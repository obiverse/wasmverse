/* ═══════════════════════════════════════════════════════════════════════
   COMMUNITY — The Commons feed

   Phase 1  Read-only feed, no auth. Hot/New/Topics tabs.
   Phase 2  Zap button. LNURL-pay → bolt11 invoice → lightning: URI.
   Phase 3  Thread view (?id=). Replies (KIND 1 with e/p tags).
   Phase 4  Compose overlay. KIND 30023 long-form post. Auth required.
   Phase 5  ?topic= URL param pre-filters feed. Reader links land here.

   Gravity: score = (sats^0.7 + replies*15 + reactions*5) / (age+2)^1.8
   ═══════════════════════════════════════════════════════════════════════ */

import * as nostr  from './nostr-shell.js';
import * as portal from './portal.js';
import { openConnectOverlay, wireLightningLinks, showLightningDialog, LIGHTNING_ADDR } from './connect.js';

const RELAYS     = ['wss://relay.primal.net', 'wss://nos.lol', 'wss://relay.nostr.band'];
const TAG        = 'letterverse';
const SINCE_DAYS = 45;

const STARTERS = [
  { topic: 'bitcoin',  text: 'How has understanding UTXOs changed how you think about digital ownership?' },
  { topic: 'rust',     text: 'What real problem did the Rust ownership model solve for you personally?' },
  { topic: 'wasm',     text: 'What would you build if compute was as sovereign as money?' },
  { topic: 'systems',  text: 'Which system in Africa most urgently needs redesigning from first principles?' },
  { topic: 'wealth',   text: 'How does M-Pesa\'s architecture compare structurally to the Lightning Network?' },
];

const TOPIC_COLORS = {
  bitcoin:'#f7931a', rust:'#ce412b',  wasm:'#654ff0',    math:'#4a90d9',
  crypto: '#9b59b6', systems:'#27ae60',wealth:'#e67e22',  enterprise:'#2980b9',
  governance:'#16a085', rhetoric:'#8e44ad', thought:'#2ecc71', algorithms:'#e74c3c',
  pwa:'#3498db', euler:'#f39c12', making:'#1abc9c', messages:'#9b59b6',
  industry:'#e74c3c', manufacturing:'#95a5a6', canvas:'#e91e63',
};

// ── Module state ──────────────────────────────────────────────────────────
let _ws      = null;
let _relay   = null;
const _profiles = new Map(); // pubkey → KIND 0 event (or null)

const _state = {
  posts: [], zapTotals: {}, replyCounts: {}, reactionCounts: {},
  activeTopic: null,
};

// ── Relay ─────────────────────────────────────────────────────────────────

async function connectRelay() {
  for (const url of RELAYS) {
    try {
      await new Promise((res, rej) => {
        const ws = new WebSocket(url);
        const t  = setTimeout(() => { ws.close(); rej(); }, 6000);
        ws.onopen  = () => { clearTimeout(t); _ws = ws; _relay = url; res(); };
        ws.onerror = () => { clearTimeout(t); rej(); };
      });
      return;
    } catch {}
  }
  throw new Error('All relays unreachable');
}

function subscribe(filter, timeoutMs = 8000) {
  return new Promise(resolve => {
    const events = [];
    const subId  = Math.random().toString(36).slice(2, 10);
    const timer  = setTimeout(() => { cleanup(); resolve(events); }, timeoutMs);

    function onMsg(e) {
      let msg; try { msg = JSON.parse(e.data); } catch { return; }
      if (!Array.isArray(msg)) return;
      if (msg[0] === 'EVENT' && msg[1] === subId && msg[2]) events.push(msg[2]);
      if (msg[0] === 'EOSE'  && msg[1] === subId) { clearTimeout(timer); cleanup(); resolve(events); }
    }
    function cleanup() {
      _ws.removeEventListener('message', onMsg);
      try { _ws.send(JSON.stringify(['CLOSE', subId])); } catch {}
    }
    _ws.addEventListener('message', onMsg);
    _ws.send(JSON.stringify(['REQ', subId, filter]));
  });
}

// ── Data fetching ─────────────────────────────────────────────────────────

const SINCE = () => Math.floor(Date.now() / 1000) - SINCE_DAYS * 86400;

async function fetchPosts() {
  const raw = await subscribe({ kinds: [30023, 1], '#t': [TAG], since: SINCE(), limit: 100 });
  return raw.filter(ev => {
    const tags  = ev.tags || [];
    if (tags.some(t => t[0] === 'e'))                            return false;
    if (tags.some(t => t[0] === 't' && t[1] === 'letterverse-attestation')) return false;
    if (tags.some(t => t[0] === 'book'))                         return false;
    if (tags.some(t => t[0] === 'pct'))                          return false;
    return (ev.content || '').trim().length > 10;
  });
}

async function fetchInteractions(ids) {
  if (!ids.length) return { zaps: [], reactions: [], replies: [] };
  const [zaps, rest] = await Promise.all([
    subscribe({ kinds: [9735], '#e': ids, limit: 500 }),
    subscribe({ kinds: [1, 7], '#e': ids, limit: 500 }),
  ]);
  return { zaps, reactions: rest.filter(e => e.kind === 7), replies: rest.filter(e => e.kind === 1) };
}

async function fetchReplies(parentId) {
  return subscribe({ kinds: [1], '#e': [parentId], limit: 100 });
}

async function fetchProfile(pubkey) {
  if (_profiles.has(pubkey)) return _profiles.get(pubkey);
  const evs = await subscribe({ kinds: [0], authors: [pubkey], limit: 1 }, 4000);
  const p = evs[0] || null;
  _profiles.set(pubkey, p);
  return p;
}

// ── Aggregation ───────────────────────────────────────────────────────────

function aggregateZaps(zapEvents) {
  const out = {};
  for (const ev of zapEvents) {
    const e = ev.tags?.find(t => t[0] === 'e');
    const a = ev.tags?.find(t => t[0] === 'amount');
    if (!e) continue;
    out[e[1]] = (out[e[1]] || 0) + Math.floor(parseInt(a?.[1] || '0', 10) / 1000);
  }
  return out;
}

function aggregateCounts(events, kind) {
  const out = {};
  for (const ev of events) {
    if (ev.kind !== kind) continue;
    const e = ev.tags?.find(t => t[0] === 'e');
    if (!e) continue;
    out[e[1]] = (out[e[1]] || 0) + 1;
  }
  return out;
}

// ── Ranking ───────────────────────────────────────────────────────────────

function gravity(ev) {
  const sats      = _state.zapTotals[ev.id]      || 0;
  const replies   = _state.replyCounts[ev.id]    || 0;
  const reactions = _state.reactionCounts[ev.id] || 0;
  const ageH      = (Date.now() / 1000 - ev.created_at) / 3600;
  return (Math.pow(sats, 0.7) + replies * 15 + reactions * 5) / Math.pow(ageH + 2, 1.8);
}

// ── Event parsing ─────────────────────────────────────────────────────────

function getTitle(ev) {
  const t = ev.tags?.find(t => t[0] === 'title');
  if (t) return t[1];
  const first = (ev.content || '').trim().split('\n').find(l => l.trim()) || '';
  const s = first.replace(/^#+\s*/, '').trim();
  return s.length > 100 ? s.slice(0, 98) + '…' : s;
}

function getExcerpt(ev) {
  const s = ev.tags?.find(t => t[0] === 'summary');
  if (s) return s[1].slice(0, 220);
  const rest = (ev.content || '').trim().split('\n').slice(1).join(' ').replace(/#+\s*/g, '').trim();
  return rest.length > 220 ? rest.slice(0, 218) + '…' : rest;
}

function getBookId(ev) {
  const t = ev.tags?.find(t => t[0] === 't' && t[1].startsWith('letterverse-') && t[1] !== 'letterverse-community');
  return t ? t[1].replace('letterverse-', '') : null;
}

function getAuthor(ev) {
  // Prefer the tagged user_npub (p tag from our publishNote/publishPost)
  const p = ev.tags?.find(t => t[0] === 'p' && t[1] !== ev.pubkey);
  return p ? p[1] : ev.pubkey;
}

function ageStr(ts) {
  const h = (Date.now() / 1000 - ts) / 3600;
  if (h < 1) return `${Math.round(h * 60)}m`;
  if (h < 24) return `${Math.round(h)}h`;
  return `${Math.round(h / 24)}d`;
}

function short(pk) { return pk ? pk.slice(0, 8) + '…' + pk.slice(-4) : '—'; }
function topicColor(id) { return TOPIC_COLORS[id] || 'var(--gold-dim)'; }

// ── LNURL-pay (Phase 2) ───────────────────────────────────────────────────

async function fetchBolt11(lnaddr, sats) {
  const [user, domain] = (lnaddr || '').split('@');
  if (!user || !domain) throw new Error('Invalid address');
  const url = `https://${domain}/.well-known/lnurlp/${user}`;
  const meta = await fetch(url).then(r => r.json());
  const msats = sats * 1000;
  if (msats < (meta.minSendable || 0) || msats > (meta.maxSendable || Infinity))
    throw new Error(`Amount out of range (${meta.minSendable/1000}–${meta.maxSendable/1000} sats)`);
  const inv = await fetch(`${meta.callback}?amount=${msats}`).then(r => r.json());
  if (!inv.pr) throw new Error('No invoice returned');
  return inv.pr;
}

// ── Zap sheet (Phase 2) ───────────────────────────────────────────────────

function openZapSheet(card, ev) {
  document.querySelectorAll('.zap-sheet').forEach(s => s.remove());

  const authorPubkey = getAuthor(ev);
  const sheet = document.createElement('div');
  sheet.className = 'zap-sheet';
  sheet.innerHTML =
    `<div class="zap-header">` +
      `<span class="zap-title">&#9889; Zap ${short(authorPubkey)}</span>` +
      `<button class="zap-close">✕</button>` +
    `</div>` +
    `<div class="zap-amounts">` +
      `<button class="zap-amt" data-sats="21">21</button>` +
      `<button class="zap-amt" data-sats="210">210</button>` +
      `<button class="zap-amt" data-sats="2100">2100</button>` +
      `<button class="zap-amt" data-sats="21000">21000</button>` +
    `</div>` +
    `<p class="zap-status" id="zap-status">Looking up Lightning address…</p>`;

  card.appendChild(sheet);
  sheet.querySelector('.zap-close').onclick = () => sheet.remove();

  let lnaddr = null;

  // Fetch author profile for lud16 (non-blocking)
  fetchProfile(authorPubkey).then(profile => {
    try {
      const meta = JSON.parse(profile?.content || '{}');
      lnaddr = meta.lud16 || meta.lud06 || null;
    } catch {}
    const statusEl = sheet.querySelector('#zap-status');
    statusEl.textContent = lnaddr ? `⚡ ${lnaddr}` : `⚡ ${LIGHTNING_ADDR} (library)`;
    if (!lnaddr) lnaddr = LIGHTNING_ADDR;
  }).catch(() => {
    lnaddr = LIGHTNING_ADDR;
    sheet.querySelector('#zap-status').textContent = `⚡ ${LIGHTNING_ADDR} (library)`;
  });

  sheet.querySelectorAll('.zap-amt').forEach(btn => {
    btn.addEventListener('click', async () => {
      const sats = parseInt(btn.dataset.sats, 10);
      const addr = lnaddr || '120941092081@breez.tips';
      const statusEl = sheet.querySelector('#zap-status');
      statusEl.textContent = 'Fetching invoice…';
      btn.disabled = true;

      try {
        const bolt11 = await fetchBolt11(addr, sats);
        statusEl.textContent = `✓ Invoice for ${sats} sats — scan or copy`;
        // Show invoice QR in the sheet itself
        _showInvoiceQr(sheet, bolt11, sats);
      } catch {
        // Fallback: show address dialog (no invoice, but still wallet-agnostic)
        sheet.remove();
        showLightningDialog(addr);
      }
    });
  });
}

// Replace the zap sheet body with a bolt11 invoice QR + copy button
function _showInvoiceQr(sheet, bolt11, sats) {
  const amtsEl = sheet.querySelector('.zap-amounts');
  if (amtsEl) amtsEl.style.display = 'none';

  const wrap = document.createElement('div');
  wrap.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:0.5rem;margin-top:0.5rem';
  wrap.innerHTML =
    `<canvas id="zap-invoice-qr" style="image-rendering:pixelated;width:140px;height:140px;border-radius:6px;display:none"></canvas>` +
    `<div style="display:flex;align-items:center;gap:0.4rem;background:rgba(255,255,255,0.04);border:1px solid var(--border);border-radius:6px;padding:0.35rem 0.6rem;width:100%;box-sizing:border-box">` +
      `<span style="font-family:var(--font-code);font-size:0.55rem;color:var(--gold-bright);flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${sats} sats</span>` +
      `<button id="zap-copy-btn" style="background:rgba(201,169,110,0.12);border:1px solid rgba(201,169,110,0.3);border-radius:4px;color:var(--gold-dim);font-family:var(--font-code);font-size:0.58rem;padding:0.2rem 0.4rem;cursor:pointer">Copy</button>` +
      `<a href="lightning:${bolt11}" style="font-family:var(--font-code);font-size:0.58rem;color:var(--text-dim);text-decoration:none;opacity:0.5" target="_blank">Wallet ↗</a>` +
    `</div>`;

  sheet.appendChild(wrap);

  // Render QR
  const canvas = wrap.querySelector('#zap-invoice-qr');
  nostr.renderQR(canvas, `lightning:${bolt11}`, { scale: 3 })
    .then(() => { canvas.style.display = 'block'; })
    .catch(() => {});

  // Copy bolt11
  wrap.querySelector('#zap-copy-btn').addEventListener('click', async function() {
    try {
      await navigator.clipboard.writeText(bolt11);
      this.textContent = '✓';
      setTimeout(() => { this.textContent = 'Copy'; }, 2000);
    } catch { this.textContent = 'Err'; }
  });
}

// ── Rendering ─────────────────────────────────────────────────────────────

function renderCard(ev) {
  const title   = getTitle(ev);
  const excerpt = getExcerpt(ev);
  const bookId  = getBookId(ev);
  const sats    = _state.zapTotals[ev.id]   || 0;
  const replies = _state.replyCounts[ev.id] || 0;
  const color   = topicColor(bookId);

  const card = document.createElement('article');
  card.className = 'post-card';
  card.dataset.id = ev.id;
  card.style.setProperty('--post-color', color);

  card.innerHTML =
    `<div class="post-meta-top">` +
      `<button class="post-zap-btn${sats > 0 ? ' has-zaps' : ''}" data-action="zap">` +
        `&#9889; ${sats > 0 ? sats.toLocaleString() + ' sats' : 'Zap'}` +
      `</button>` +
      `<button class="post-thread-btn" data-action="thread">◈ ${replies} repl${replies === 1 ? 'y' : 'ies'}</button>` +
      `<span class="post-age">${ageStr(ev.created_at)}</span>` +
    `</div>` +
    `<h2 class="post-title">${_esc(title)}</h2>` +
    (excerpt ? `<p class="post-excerpt">${_esc(excerpt)}</p>` : '') +
    `<div class="post-meta-bottom">` +
      `<span class="post-author">${short(getAuthor(ev))}</span>` +
      (bookId ? `<span class="post-topic">#${bookId}</span>` : '') +
      `<a class="post-nostr-link" href="https://njump.me/${ev.id}" target="_blank"` +
        ` rel="noopener" title="View on Nostr" onclick="event.stopPropagation()">&#9670;</a>` +
    `</div>`;

  card.querySelector('[data-action="zap"]').addEventListener('click', e => {
    e.stopPropagation(); openZapSheet(card, ev);
  });
  card.querySelector('[data-action="thread"]').addEventListener('click', e => {
    e.stopPropagation(); openThread(ev);
  });
  card.addEventListener('click', () => openThread(ev));

  return card;
}

function renderFeed(posts) {
  const feed  = document.getElementById('comm-feed');
  const empty = document.getElementById('comm-empty');
  feed.innerHTML = '';

  // Relay bar
  const bar = document.createElement('div');
  bar.className = 'comm-relay-bar';
  bar.innerHTML =
    `<span class="comm-relay-dot live"></span>` +
    `<span>${(_relay || '').replace('wss://', '')}</span>` +
    `<span class="comm-post-count">${posts.length} post${posts.length !== 1 ? 's' : ''}</span>`;
  feed.appendChild(bar);

  if (!posts.length) {
    empty.hidden = false;
    renderStarters();
    return;
  }
  empty.hidden = true;
  posts.forEach(ev => feed.appendChild(renderCard(ev)));
}

function renderStarters() {
  document.getElementById('comm-starters').innerHTML = STARTERS.map(s =>
    `<div class="comm-starter">` +
      `<span class="comm-starter-topic">#${s.topic}</span>${_esc(s.text)}` +
    `</div>`
  ).join('');
}

function renderTopics(posts) {
  const counts = {};
  posts.forEach(ev => { const id = getBookId(ev); if (id) counts[id] = (counts[id] || 0) + 1; });
  const grid = document.getElementById('comm-topic-grid');
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  if (!entries.length) {
    grid.innerHTML = '<p class="comm-topics-label" style="opacity:0.4">No topics yet</p>';
    return;
  }
  grid.innerHTML = entries.map(([id, n]) =>
    `<div class="comm-topic-tile" data-topic="${id}" style="border-left:3px solid ${topicColor(id)}40">` +
      `<span class="comm-topic-name" style="color:${topicColor(id)}">#${id}</span>` +
      `<span class="comm-topic-count">${n} post${n !== 1 ? 's' : ''}</span>` +
    `</div>`
  ).join('');
  grid.querySelectorAll('.comm-topic-tile').forEach(t => {
    t.addEventListener('click', () => { _state.activeTopic = t.dataset.topic; switchTab('hot'); });
  });
}

// ── Thread view (Phase 3) ─────────────────────────────────────────────────

async function openThread(ev) {
  // Push ?id= to URL without reload
  history.pushState(null, '', `?id=${ev.id}`);
  showThreadView(ev);
  const replies = await fetchReplies(ev.id);
  renderReplies(ev, replies);
}

function showThreadView(ev) {
  const main = document.getElementById('comm-main');
  // Hide feed, empty, topics — show thread
  ['comm-feed','comm-empty','comm-topics-view','comm-loading'].forEach(id => {
    const el = document.getElementById(id); if (el) el.hidden = true;
  });
  document.getElementById('comm-tabs').style.display = 'none';

  // Build thread container
  let thread = document.getElementById('comm-thread');
  if (!thread) {
    thread = document.createElement('div');
    thread.id = 'comm-thread';
    main.appendChild(thread);
  }
  thread.hidden = false;

  const bookId = getBookId(ev);
  const color  = topicColor(bookId);

  thread.innerHTML =
    `<div class="thread-back">` +
      `<button class="thread-back-btn" id="thread-back">&#8592; Back to feed</button>` +
      (bookId ? `<span class="post-topic" style="border-color:${color}40;color:${color}">#${bookId}</span>` : '') +
    `</div>` +
    `<article class="thread-post" style="--post-color:${color}">` +
      `<div class="post-meta-top">` +
        `<button class="post-zap-btn" data-action="zap">&#9889; ${(_state.zapTotals[ev.id]||0).toLocaleString() || 'Zap'} sats</button>` +
        `<span class="post-age">${ageStr(ev.created_at)}</span>` +
      `</div>` +
      `<h1 class="thread-title">${_esc(getTitle(ev))}</h1>` +
      `<div class="thread-body">${_esc(ev.content)}</div>` +
      `<div class="post-meta-bottom">` +
        `<span class="post-author">${short(getAuthor(ev))}</span>` +
        `<a class="post-nostr-link" href="https://njump.me/${ev.id}" target="_blank" rel="noopener">&#9670;</a>` +
      `</div>` +
    `</article>` +
    `<div class="thread-replies-header">` +
      `<span class="comm-relay-bar" style="border:none;padding:0;margin-bottom:0.75rem">` +
        `<span class="comm-relay-dot live"></span> Replies &nbsp;` +
        `<span id="reply-count" class="comm-post-count"></span>` +
      `</span>` +
      `${nostr.isConnected() ? '<button class="reply-open-btn" id="reply-open-btn">Reply ↗</button>' : '<p class="thread-auth-hint"><a href="index.html">Connect wallet</a> to reply</p>'}` +
    `</div>` +
    `<div id="thread-reply-form" hidden></div>` +
    `<div id="thread-replies"><div class="comm-loading" style="padding:2rem"><div class="comm-spinner"></div></div></div>`;

  // Wire up the zap on the thread post
  const threadPost = thread.querySelector('.thread-post');
  thread.querySelector('[data-action="zap"]')?.addEventListener('click', e => {
    e.stopPropagation(); openZapSheet(threadPost, ev);
  });

  thread.querySelector('#thread-back').addEventListener('click', closeThread);

  // Reply button
  thread.querySelector('#reply-open-btn')?.addEventListener('click', () => {
    openReplyForm(ev, thread.querySelector('#thread-reply-form'));
  });
}

function renderReplies(parentEv, replies) {
  const container = document.getElementById('thread-replies');
  if (!container) return;
  document.getElementById('reply-count').textContent = `${replies.length}`;

  if (!replies.length) {
    container.innerHTML = `<p class="thread-empty">No replies yet — be the first voice.</p>`;
    return;
  }

  const sorted = [...replies].sort((a, b) => a.created_at - b.created_at);
  container.innerHTML = '';
  sorted.forEach(reply => {
    const el = document.createElement('div');
    el.className = 'thread-reply';
    el.innerHTML =
      `<div class="thread-reply-meta">` +
        `<span class="post-author">${short(getAuthor(reply))}</span>` +
        `<span class="post-age">${ageStr(reply.created_at)}</span>` +
        `<a class="post-nostr-link" href="https://njump.me/${reply.id}" target="_blank" rel="noopener">&#9670;</a>` +
      `</div>` +
      `<div class="thread-reply-body">${_esc(reply.content)}</div>`;
    container.appendChild(el);
  });
}

function openReplyForm(parentEv, container) {
  container.hidden = false;
  container.innerHTML =
    `<div class="reply-form">` +
      `<textarea class="reply-textarea" placeholder="Your reply…"></textarea>` +
      `<div class="reply-form-row">` +
        `<button class="reply-submit-btn" id="reply-submit">Publish ↗</button>` +
        `<button class="reply-cancel-btn" id="reply-cancel">Cancel</button>` +
        `<span class="share-status" id="reply-status"></span>` +
      `</div>` +
    `</div>`;

  container.querySelector('#reply-cancel').addEventListener('click', () => { container.hidden = true; });
  container.querySelector('#reply-submit').addEventListener('click', async () => {
    const text = container.querySelector('.reply-textarea').value.trim();
    if (!text) return;
    const statusEl = container.querySelector('#reply-status');
    statusEl.textContent = 'Publishing…';
    const ok = await nostr.publishReply(parentEv.id, parentEv.pubkey, text);
    statusEl.textContent = ok ? '✓ Reply published' : 'Error — try again';
    statusEl.style.color = ok ? 'var(--gold-bright)' : '';
    if (ok) setTimeout(() => { container.hidden = true; container.innerHTML = ''; }, 2000);
  });
}

function closeThread() {
  const thread = document.getElementById('comm-thread');
  if (thread) thread.hidden = true;
  document.getElementById('comm-tabs').style.display = '';
  history.pushState(null, '', location.pathname);
  switchTab('hot');
}

// ── Compose overlay (Phase 4) ─────────────────────────────────────────────

function openCompose() {
  const overlay = document.getElementById('compose-overlay');
  overlay.hidden = false;
  document.body.style.overflow = 'hidden';
  document.getElementById('compose-body').focus();
}

function closeCompose() {
  document.getElementById('compose-overlay').hidden = true;
  document.body.style.overflow = '';
}

async function populateTopicSelect() {
  const sel = document.getElementById('compose-topic');
  if (sel.options.length > 1) return; // already populated
  try {
    const manifest = await fetch('books/manifest.json').then(r => r.json());
    manifest.books?.forEach(b => {
      const opt = document.createElement('option');
      opt.value = b.id; opt.textContent = b.id;
      sel.appendChild(opt);
    });
  } catch {}
}

async function submitCompose() {
  const title  = document.getElementById('compose-title').value.trim();
  const body   = document.getElementById('compose-body').value.trim();
  const bookId = document.getElementById('compose-topic').value || null;
  const status = document.getElementById('compose-status');

  if (!body) { status.textContent = 'Write something first.'; return; }
  status.textContent = 'Publishing…';

  const ok = await nostr.publishPost(title || body.slice(0, 80), body, bookId);
  status.textContent = ok ? '✓ Published to Nostr — reloading feed…' : 'Error — try again';
  status.style.color = ok ? 'var(--gold-bright)' : '';

  if (ok) {
    setTimeout(async () => {
      closeCompose();
      await reloadFeed();
    }, 1500);
  }
}

// ── Tab switching ─────────────────────────────────────────────────────────

function switchTab(tab) {
  document.querySelectorAll('.comm-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
  const feed = document.getElementById('comm-feed');
  const topicsView = document.getElementById('comm-topics-view');
  const empty = document.getElementById('comm-empty');

  feed.hidden = false; topicsView.hidden = true; empty.hidden = true;

  if (tab === 'topics') {
    feed.hidden = true; topicsView.hidden = false; return;
  }

  let posts = [..._state.posts];
  if (_state.activeTopic) {
    posts = posts.filter(ev => getBookId(ev) === _state.activeTopic);
    _state.activeTopic = null;
  }

  posts.sort(tab === 'new'
    ? (a, b) => b.created_at - a.created_at
    : (a, b) => gravity(b) - gravity(a)
  );

  renderFeed(posts);
  feed.hidden = false;
}

// ── Reload feed data ──────────────────────────────────────────────────────

async function reloadFeed() {
  const posts = await fetchPosts();
  const ids   = posts.map(e => e.id);
  const { zaps, reactions, replies } = await fetchInteractions(ids);
  Object.assign(_state, {
    posts,
    zapTotals:      aggregateZaps(zaps),
    reactionCounts: aggregateCounts(reactions, 7),
    replyCounts:    aggregateCounts(replies, 1),
  });
  renderTopics(posts);
  switchTab(document.querySelector('.comm-tab.active')?.dataset.tab || 'hot');
}

// ── Init ──────────────────────────────────────────────────────────────────

async function init() {
  // Restore nostr session (for compose + reply buttons)
  await nostr.restoreSession().catch(() => {});

  // ── Portal wiring ─────────────────────────────────────────────────────
  document.getElementById('portal-close')?.addEventListener('click', portal.close);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !document.getElementById('portal-overlay')?.hidden) portal.close();
  });

  // ── Community QR (fire-and-forget — never blocks relay connect) ───────
  const commQr = document.getElementById('comm-zap-qr');
  if (commQr) {
    nostr.renderQR(commQr, `lightning:${LIGHTNING_ADDR}`, { scale: 3 })
      .then(() => { commQr.style.display = 'block'; })
      .catch(() => {});
  }

  // Scroll progress bar
  window.addEventListener('scroll', () => {
    const dh = document.documentElement.scrollHeight - window.innerHeight;
    document.getElementById('comm-top-progress').style.width = dh > 0 ? (scrollY/dh*100)+'%' : '0';
  }, { passive: true });

  // Tab handlers
  document.querySelectorAll('.comm-tab').forEach(t => t.addEventListener('click', () => switchTab(t.dataset.tab)));

  // Compose overlay wiring
  document.getElementById('compose-close')?.addEventListener('click', closeCompose);
  document.getElementById('compose-overlay')?.addEventListener('click', e => {
    if (e.target === document.getElementById('compose-overlay')) closeCompose();
  });
  document.getElementById('compose-publish')?.addEventListener('click', submitCompose);
  document.getElementById('compose-body')?.addEventListener('input', () => {
    const n = (document.getElementById('compose-body').value || '').length;
    document.getElementById('compose-char-count').textContent = n;
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !document.getElementById('compose-overlay')?.hidden) closeCompose();
  });

  // ── Identity button — always visible, state-aware ─────────────────────
  const identityBtn   = document.getElementById('comm-identity-btn');
  const identityDot   = document.getElementById('comm-identity-dot');
  const identityLabel = document.getElementById('comm-identity-label');

  function updateIdentity() {
    if (!identityBtn) return;
    identityBtn.hidden = false;
    if (nostr.isConnected()) {
      if (identityDot) { identityDot.textContent = '◉'; identityDot.className = 'nav-dot-live'; }
      if (identityLabel) identityLabel.textContent = nostr.getPubkeyDisplay() ?? 'Account';
      identityBtn.title   = 'Your account';
      identityBtn.onclick = () => portal.open();

      // Activate FAB
      const fab = document.getElementById('compose-fab');
      if (fab && fab.hidden) {
        fab.hidden = false;
        fab.addEventListener('click', () => { populateTopicSelect(); openCompose(); });
      }
    } else {
      if (identityDot) { identityDot.textContent = '·'; identityDot.className = ''; }
      if (identityLabel) identityLabel.textContent = 'Sign in';
      identityBtn.title   = 'Sign in with OBIVERSE';
      identityBtn.onclick = () => openConnectOverlay({
        onSuccess: () => updateIdentity(),
      });
    }
  }
  updateIdentity();

  // Portal disconnect → update identity
  document.getElementById('portal-disconnect-btn')?.addEventListener('click', async () => {
    await nostr.disconnect();
    portal.close();
    updateIdentity();
    // Hide FAB
    const fab = document.getElementById('compose-fab');
    if (fab) fab.hidden = true;
  });

  // Wire Lightning links to dialog (platform-agnostic, no lightning: URI)
  wireLightningLinks();

  const loading = document.getElementById('comm-loading');
  const errEl   = document.getElementById('comm-error');
  const feed    = document.getElementById('comm-feed');

  try {
    await connectRelay();
    const params = new URLSearchParams(location.search);

    // Phase 5: ?topic= pre-filter
    const topicParam = params.get('topic');
    if (topicParam) _state.activeTopic = topicParam;

    // Phase 3: ?id= thread view
    const idParam = params.get('id');
    if (idParam) {
      loading.hidden = true; feed.hidden = false;
      const evs = await subscribe({ ids: [idParam], limit: 1 });
      if (evs[0]) {
        showThreadView(evs[0]);
        const replies = await fetchReplies(idParam);
        renderReplies(evs[0], replies);
      } else {
        errEl.hidden = false;
        document.querySelector('.comm-empty-title').textContent = 'Post not found';
      }
      return;
    }

    // Default: load feed
    const posts = await fetchPosts();
    const ids   = posts.map(e => e.id);
    const { zaps, reactions, replies } = await fetchInteractions(ids);

    Object.assign(_state, {
      posts,
      zapTotals:      aggregateZaps(zaps),
      reactionCounts: aggregateCounts(reactions, 7),
      replyCounts:    aggregateCounts(replies, 1),
    });

    renderTopics(posts);
    loading.hidden = true;
    feed.hidden = false;
    switchTab(topicParam ? 'hot' : 'hot');

    // Show topic label if pre-filtered
    if (topicParam) {
      const bar = document.querySelector('.comm-relay-bar');
      if (bar) {
        const badge = document.createElement('span');
        badge.className = 'post-topic';
        badge.style.color = topicColor(topicParam);
        badge.textContent = `#${topicParam}`;
        bar.appendChild(badge);
      }
    }

  } catch (err) {
    loading.hidden = true;
    errEl.hidden = false;
    console.error('[Community]', err);
  }
}

function _esc(s) {
  return String(s).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );
}

document.addEventListener('DOMContentLoaded', init);
