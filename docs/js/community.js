/* ═══════════════════════════════════════════════════════════════════════
   COMMUNITY — The Commons feed

   Phase 1: Read-only feed, no auth required.
   Fetches KIND 1 + KIND 30023 posts tagged ["t","letterverse"],
   fetches KIND 9735 zap receipts + KIND 7 reactions + KIND 1 replies,
   ranks by zap-weighted gravity (HN formula + economic weight),
   renders Hot / New / Topics tabs.

   Posting: the existing share button in reader.js (KIND 1, tagged
   "letterverse") automatically seeds this feed — no composer needed yet.

   Gravity: score = (sats^0.7 + replies*15 + reactions*5) / (age+2)^1.8
   ═══════════════════════════════════════════════════════════════════════ */

const RELAYS = [
  'wss://relay.primal.net',
  'wss://nos.lol',
  'wss://relay.nostr.band',
];

// Tag that all Letterverse posts share (from reader.js publishNote)
const TAG = 'letterverse';

// Posts older than this are not fetched
const SINCE_DAYS = 45;

// Starter prompts shown in the empty state
const STARTERS = [
  { topic: 'bitcoin',  text: 'How has understanding UTXOs changed how you think about digital ownership?' },
  { topic: 'rust',     text: 'What real problem did the Rust ownership model solve for you personally?' },
  { topic: 'wasm',     text: 'What would you build if compute was as sovereign as money?' },
  { topic: 'systems',  text: 'Which system in Africa most urgently needs redesigning from first principles?' },
  { topic: 'wealth',   text: 'How does M-Pesa\'s architecture compare structurally to the Lightning Network?' },
];

// ── Relay ─────────────────────────────────────────────────────────────────

let _ws   = null;
let _relay = null;

async function connectRelay() {
  for (const url of RELAYS) {
    try {
      await new Promise((resolve, reject) => {
        const ws = new WebSocket(url);
        const t  = setTimeout(() => { ws.close(); reject(new Error('timeout')); }, 6000);
        ws.onopen  = () => { clearTimeout(t); _ws = ws; _relay = url; resolve(); };
        ws.onerror = () => { clearTimeout(t); reject(new Error('error')); };
      });
      return;
    } catch {}
  }
  throw new Error('All relays unreachable');
}

/**
 * Subscribe and collect events until EOSE (or 8s timeout).
 */
function subscribe(filter) {
  return new Promise(resolve => {
    const events = [];
    const subId  = Math.random().toString(36).slice(2, 10);
    const timer  = setTimeout(() => {
      cleanup();
      resolve(events);
    }, 8000);

    function onMessage(e) {
      let msg;
      try { msg = JSON.parse(e.data); } catch { return; }
      if (!Array.isArray(msg)) return;
      if (msg[0] === 'EVENT' && msg[1] === subId && msg[2]) events.push(msg[2]);
      if (msg[0] === 'EOSE' && msg[1] === subId) { clearTimeout(timer); cleanup(); resolve(events); }
    }

    function cleanup() {
      _ws.removeEventListener('message', onMessage);
      try { _ws.send(JSON.stringify(['CLOSE', subId])); } catch {}
    }

    _ws.addEventListener('message', onMessage);
    _ws.send(JSON.stringify(['REQ', subId, filter]));
  });
}

// ── Data fetching ─────────────────────────────────────────────────────────

const SINCE = () => Math.floor(Date.now() / 1000) - SINCE_DAYS * 86400;

async function fetchPosts() {
  const raw = await subscribe({
    kinds: [30023, 1],
    '#t': [TAG],
    since: SINCE(),
    limit: 100,
  });

  // Keep only top-level posts:
  //   - no "e" tag (not a reply/comment)
  //   - no "letterverse-attestation" t-tag (not an attestation event)
  //   - no "book" tag (not a progress event)
  return raw.filter(ev => {
    const tags  = ev.tags || [];
    const eTags = tags.filter(t => t[0] === 'e');
    if (eTags.length > 0) return false;
    const tVals = tags.filter(t => t[0] === 't').map(t => t[1]);
    if (tVals.includes('letterverse-attestation')) return false;
    const hasBook = tags.some(t => t[0] === 'book');
    if (hasBook) return false;
    // Must have some content worth showing
    return (ev.content || '').trim().length > 10;
  });
}

async function fetchInteractions(postIds) {
  if (!postIds.length) return { zaps: [], reactions: [], replies: [] };

  const [zaps, rest] = await Promise.all([
    subscribe({ kinds: [9735], '#e': postIds, limit: 500 }),
    subscribe({ kinds: [1, 7], '#e': postIds, limit: 500 }),
  ]);

  const reactions = rest.filter(e => e.kind === 7);
  const replies   = rest.filter(e => e.kind === 1);
  return { zaps, reactions, replies };
}

// ── Aggregation ───────────────────────────────────────────────────────────

function aggregateZaps(zapEvents) {
  // KIND 9735 zap receipt: amount is in the "amount" tag (millisats as string)
  const totals = {};
  for (const ev of zapEvents) {
    const eTag     = ev.tags?.find(t => t[0] === 'e');
    const amtTag   = ev.tags?.find(t => t[0] === 'amount');
    if (!eTag) continue;
    const sats = Math.floor(parseInt(amtTag?.[1] || '0', 10) / 1000);
    totals[eTag[1]] = (totals[eTag[1]] || 0) + sats;
  }
  return totals;
}

function aggregateCounts(events, kind) {
  const counts = {};
  for (const ev of events) {
    if (ev.kind !== kind) continue;
    const eTag = ev.tags?.find(t => t[0] === 'e');
    if (!eTag) continue;
    counts[eTag[1]] = (counts[eTag[1]] || 0) + 1;
  }
  return counts;
}

// ── Ranking ───────────────────────────────────────────────────────────────

function gravity(ev, zapTotals, replyCounts, reactionCounts) {
  const sats      = zapTotals[ev.id]      || 0;
  const replies   = replyCounts[ev.id]    || 0;
  const reactions = reactionCounts[ev.id] || 0;
  const ageHours  = (Date.now() / 1000 - ev.created_at) / 3600;
  const signal    = Math.pow(sats, 0.7) + replies * 15 + reactions * 5;
  return signal / Math.pow(ageHours + 2, 1.8);
}

// ── Event parsing ─────────────────────────────────────────────────────────

function getTitle(ev) {
  // KIND 30023: explicit title tag
  const t = ev.tags?.find(t => t[0] === 'title');
  if (t) return t[1];
  // KIND 1: first non-empty line, stripped of markdown #
  const first = (ev.content || '').trim().split('\n')
    .find(l => l.trim().length > 0) || '';
  const stripped = first.replace(/^#+\s*/, '').trim();
  return stripped.length > 100 ? stripped.slice(0, 98) + '…' : stripped;
}

function getExcerpt(ev) {
  // KIND 30023: use summary tag
  const s = ev.tags?.find(t => t[0] === 'summary');
  if (s) return s[1].slice(0, 220);
  // Both: skip the first line (used as title), return the next 220 chars
  const lines = (ev.content || '').trim().split('\n');
  const rest  = lines.slice(1).join(' ').replace(/#+\s*/g, '').trim();
  return rest.length > 220 ? rest.slice(0, 218) + '…' : rest;
}

function getBookId(ev) {
  const t = ev.tags?.find(
    t => t[0] === 't' && t[1].startsWith('letterverse-') && t[1] !== 'letterverse-community'
  );
  return t ? t[1].replace('letterverse-', '') : null;
}

function ageStr(created_at) {
  const h = (Date.now() / 1000 - created_at) / 3600;
  if (h < 1)  return `${Math.round(h * 60)}m`;
  if (h < 24) return `${Math.round(h)}h`;
  return `${Math.round(h / 24)}d`;
}

function shortPubkey(pubkey) {
  return pubkey ? pubkey.slice(0, 8) + '…' + pubkey.slice(-4) : '—';
}

// Subtle accent color per topic — gives each post a visual identity
const TOPIC_COLORS = {
  bitcoin:  '#f7931a', rust:       '#ce412b', wasm:         '#654ff0',
  math:     '#4a90d9', crypto:     '#9b59b6', systems:      '#27ae60',
  wealth:   '#e67e22', enterprise: '#2980b9', governance:   '#16a085',
  rhetoric: '#8e44ad', thought:    '#2ecc71', algorithms:   '#e74c3c',
  pwa:      '#3498db', euler:      '#f39c12', making:       '#1abc9c',
  messages: '#9b59b6', industry:   '#e74c3c', manufacturing: '#95a5a6',
  canvas:   '#e91e63',
};

function topicColor(bookId) {
  return TOPIC_COLORS[bookId] || 'var(--gold-dim)';
}

// ── Rendering ─────────────────────────────────────────────────────────────

function renderCard(ev, zapTotals, replyCounts, reactionCounts) {
  const title    = getTitle(ev);
  const excerpt  = getExcerpt(ev);
  const bookId   = getBookId(ev);
  const sats     = zapTotals[ev.id] || 0;
  const replies  = replyCounts[ev.id] || 0;
  const color    = topicColor(bookId);
  const nostrUrl = `https://njump.me/${ev.id}`;

  const card = document.createElement('article');
  card.className = 'post-card';
  card.dataset.id = ev.id;
  card.style.setProperty('--post-color', color);

  card.innerHTML =
    `<div class="post-meta-top">` +
      `<span class="post-zaps${sats > 0 ? ' has-zaps' : ''}">&#9889; ${sats > 0 ? sats.toLocaleString() + ' sats' : '—'}</span>` +
      `<span class="post-replies">◈ ${replies}</span>` +
      `<span class="post-age">${ageStr(ev.created_at)}</span>` +
    `</div>` +
    `<h2 class="post-title">${_esc(title)}</h2>` +
    (excerpt ? `<p class="post-excerpt">${_esc(excerpt)}</p>` : '') +
    `<div class="post-meta-bottom">` +
      `<span class="post-author">${shortPubkey(ev.pubkey)}</span>` +
      (bookId ? `<span class="post-topic">#${bookId}</span>` : '') +
      `<a class="post-nostr-link" href="${nostrUrl}" target="_blank" rel="noopener"` +
        ` title="View on Nostr" onclick="event.stopPropagation()">&#9670;</a>` +
    `</div>` +
    `<div class="post-body" hidden>${_esc(ev.content)}</div>`;

  // Toggle expanded body on click
  card.addEventListener('click', () => {
    const body = card.querySelector('.post-body');
    const expanded = !body.hidden;
    body.hidden = expanded;
    card.classList.toggle('expanded', !expanded);
    if (!expanded) {
      const excerpt = card.querySelector('.post-excerpt');
      if (excerpt) excerpt.style.display = 'none';
    } else {
      const excerpt = card.querySelector('.post-excerpt');
      if (excerpt) excerpt.style.display = '';
    }
  });

  return card;
}

function renderFeed(posts, zapTotals, replyCounts, reactionCounts) {
  const feed = document.getElementById('comm-feed');
  feed.innerHTML = '';

  // Relay status bar
  const bar = document.createElement('div');
  bar.className = 'comm-relay-bar';
  bar.innerHTML =
    `<span class="comm-relay-dot live"></span>` +
    `<span>${(_relay || '').replace('wss://', '')}</span>` +
    `<span class="comm-post-count">${posts.length} post${posts.length !== 1 ? 's' : ''}</span>`;
  feed.appendChild(bar);

  if (!posts.length) {
    document.getElementById('comm-empty').hidden = false;
    document.getElementById('comm-feed').hidden = true;
    renderStarters();
    return;
  }

  for (const ev of posts) {
    feed.appendChild(renderCard(ev, zapTotals, replyCounts, reactionCounts));
  }
}

function renderStarters() {
  const el = document.getElementById('comm-starters');
  el.innerHTML = STARTERS.map(s =>
    `<div class="comm-starter">` +
      `<span class="comm-starter-topic">#${s.topic}</span>` +
      `${_esc(s.text)}` +
    `</div>`
  ).join('');
}

function renderTopics(posts) {
  const counts = {};
  for (const ev of posts) {
    const id = getBookId(ev);
    if (id) counts[id] = (counts[id] || 0) + 1;
  }

  const grid = document.getElementById('comm-topic-grid');
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);

  if (!entries.length) {
    grid.innerHTML = '<p class="comm-topics-label" style="opacity:0.5">No topic tags yet</p>';
    return;
  }

  grid.innerHTML = entries.map(([id, n]) =>
    `<div class="comm-topic-tile" data-topic="${id}">` +
      `<span class="comm-topic-name">#${id}</span>` +
      `<span class="comm-topic-count">${n} post${n !== 1 ? 's' : ''}</span>` +
    `</div>`
  ).join('');

  // Topic click → filter Hot tab
  grid.querySelectorAll('.comm-topic-tile').forEach(tile => {
    tile.addEventListener('click', () => {
      window._commState.activeTopic = tile.dataset.topic;
      switchTab('hot');
    });
  });
}

// ── Tab switching ─────────────────────────────────────────────────────────

function switchTab(tab) {
  document.querySelectorAll('.comm-tab').forEach(t =>
    t.classList.toggle('active', t.dataset.tab === tab)
  );

  const feed      = document.getElementById('comm-feed');
  const topicsView = document.getElementById('comm-topics-view');
  const empty     = document.getElementById('comm-empty');

  feed.hidden       = false;
  topicsView.hidden = true;
  empty.hidden      = true;

  const { posts, zapTotals, replyCounts, reactionCounts } = window._commState;

  if (tab === 'topics') {
    feed.hidden       = true;
    topicsView.hidden = false;
    return;
  }

  let ordered = [...posts];

  // Filter by active topic if one is selected (from topics tab click)
  const activeTopic = window._commState.activeTopic;
  if (activeTopic) {
    ordered = ordered.filter(ev => getBookId(ev) === activeTopic);
    window._commState.activeTopic = null; // clear after use
  }

  if (tab === 'hot') {
    ordered.sort((a, b) =>
      gravity(b, zapTotals, replyCounts, reactionCounts) -
      gravity(a, zapTotals, replyCounts, reactionCounts)
    );
  } else if (tab === 'new') {
    ordered.sort((a, b) => b.created_at - a.created_at);
  }

  renderFeed(ordered, zapTotals, replyCounts, reactionCounts);
  feed.hidden = false;
}

// ── Init ──────────────────────────────────────────────────────────────────

window._commState = { posts: [], zapTotals: {}, replyCounts: {}, reactionCounts: {}, activeTopic: null };

async function init() {
  // Update scroll progress bar
  window.addEventListener('scroll', () => {
    const el  = document.getElementById('comm-top-progress');
    const dh  = document.documentElement.scrollHeight - window.innerHeight;
    el.style.width = dh > 0 ? (window.scrollY / dh * 100) + '%' : '0%';
  }, { passive: true });

  // Tab click handlers
  document.querySelectorAll('.comm-tab').forEach(tab => {
    tab.addEventListener('click', () => switchTab(tab.dataset.tab));
  });

  const loading = document.getElementById('comm-loading');
  const error   = document.getElementById('comm-error');
  const feed    = document.getElementById('comm-feed');

  try {
    await connectRelay();

    // Fetch posts
    const posts = await fetchPosts();
    const postIds = posts.map(e => e.id);

    // Fetch all interactions in parallel
    const { zaps, reactions, replies } = await fetchInteractions(postIds);

    const zapTotals      = aggregateZaps(zaps);
    const reactionCounts = aggregateCounts(reactions, 7);
    const replyCounts    = aggregateCounts(replies, 1);

    // Store for tab switching
    window._commState = { posts, zapTotals, replyCounts, reactionCounts, activeTopic: null };

    // Pre-build topics view
    renderTopics(posts);

    // Hide loading, show feed
    loading.hidden = true;
    feed.hidden = false;

    // Default: Hot tab
    switchTab('hot');

  } catch (err) {
    loading.hidden = true;
    error.hidden   = false;
    console.error('[Community]', err);
  }
}

function _esc(s) {
  return String(s).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );
}

document.addEventListener('DOMContentLoaded', init);
