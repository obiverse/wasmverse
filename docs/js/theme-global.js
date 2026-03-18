/* ═══════════════════════════════════════════════
   THEME-GLOBAL — Global theme toggle + African patterns
   Works on both hub and reader pages.
   Uses Euler for theme state, falls back gracefully.
   ═══════════════════════════════════════════════ */

import { get as getEuler, applyTheme, autoPersist } from '../euler-shell.js';

const MODES = ['dark', 'light', 'system'];
const MODE_TO_THEME = { dark: 'midnight', light: 'parchment' };
const STORE_KEY = 'epistolary_theme_mode';

let currentMode = localStorage.getItem(STORE_KEY) || 'dark';

/* ═══════════════════════════════════════════════
   SVG ICONS
   ═══════════════════════════════════════════════ */
const icons = {
  dark: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z"/></svg>`,
  light: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`,
  system: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>`,
};

const labels = { dark: 'Midnight', light: 'Parchment', system: 'System' };

/* ═══════════════════════════════════════════════
   SYSTEM THEME DETECTION
   ═══════════════════════════════════════════════ */
function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'parchment' : 'midnight';
}

function resolveTheme(mode) {
  if (mode === 'system') return getSystemTheme();
  return MODE_TO_THEME[mode] || 'midnight';
}

/* ═══════════════════════════════════════════════
   APPLY THEME
   ═══════════════════════════════════════════════ */
function applyMode(mode) {
  currentMode = mode;
  localStorage.setItem(STORE_KEY, mode);

  const themeName = resolveTheme(mode);
  const euler = getEuler();

  if (euler) {
    euler.set_theme(themeName);
    applyTheme();
    autoPersist();
  } else {
    // Fallback: apply basic dark/light class
    document.body.dataset.theme = themeName;
    if (themeName === 'parchment' || themeName === 'sepia') {
      document.documentElement.style.setProperty('--bg-deep', '#efe8d8');
      document.documentElement.style.setProperty('--bg', '#faf7f0');
      document.documentElement.style.setProperty('--bg-elevated', '#f4efe4');
      document.documentElement.style.setProperty('--text', '#2a2520');
      document.documentElement.style.setProperty('--text-dim', '#6b6358');
      document.documentElement.style.setProperty('--text-bright', '#1a1510');
      document.documentElement.style.setProperty('--gold', '#8b6914');
      document.documentElement.style.setProperty('--gold-bright', '#6b4f1d');
      document.documentElement.style.setProperty('--gold-dim', '#b8951f');
      document.documentElement.style.setProperty('--border', '#d8ceb8');
      document.documentElement.style.setProperty('--border-subtle', '#e2d9c8');
    } else {
      // Reset to midnight defaults (CSS :root handles it)
      ['--bg-deep','--bg','--bg-elevated','--text','--text-dim','--text-bright',
       '--gold','--gold-bright','--gold-dim','--border','--border-subtle']
        .forEach(p => document.documentElement.style.removeProperty(p));
    }
  }

  // Update toggle active state
  document.querySelectorAll('.theme-opt').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === mode);
  });

  // Update meta theme-color for browser chrome
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.content = (themeName === 'parchment' || themeName === 'sepia') ? '#faf7f0' : '#0a0a14';
  }
}

/* ═══════════════════════════════════════════════
   BUILD TOGGLE UI
   ═══════════════════════════════════════════════ */
function createToggle() {
  const toggle = document.createElement('div');
  toggle.className = 'theme-toggle';
  toggle.setAttribute('role', 'radiogroup');
  toggle.setAttribute('aria-label', 'Theme');

  MODES.forEach(mode => {
    const btn = document.createElement('button');
    btn.className = 'theme-opt' + (mode === currentMode ? ' active' : '');
    btn.dataset.mode = mode;
    btn.dataset.label = labels[mode];
    btn.innerHTML = icons[mode];
    btn.setAttribute('role', 'radio');
    btn.setAttribute('aria-checked', mode === currentMode);
    btn.setAttribute('aria-label', labels[mode] + ' theme');
    btn.addEventListener('click', () => applyMode(mode));
    toggle.appendChild(btn);
  });

  document.body.appendChild(toggle);
}

/* ═══════════════════════════════════════════════
   AFRICAN SPIRITUAL PATTERN — Kente-inspired SVG
   Generated procedurally as inline SVG background
   ═══════════════════════════════════════════════ */
function createAfricanPattern() {
  // Kente cloth: interlocking rectangles and zigzags
  // Adinkra-inspired: concentric forms suggesting unity and wisdom
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
    <!-- Kente cross-weave -->
    <line x1="0" y1="60" x2="120" y2="60" stroke="currentColor" stroke-width="0.5" opacity="0.3"/>
    <line x1="60" y1="0" x2="60" y2="120" stroke="currentColor" stroke-width="0.5" opacity="0.3"/>
    <!-- Diamond (unity) -->
    <path d="M60 20 L80 60 L60 100 L40 60Z" fill="none" stroke="currentColor" stroke-width="0.6" opacity="0.4"/>
    <!-- Inner diamond -->
    <path d="M60 35 L72 60 L60 85 L48 60Z" fill="none" stroke="currentColor" stroke-width="0.4" opacity="0.25"/>
    <!-- Concentric circles (Adinkra: completeness) -->
    <circle cx="60" cy="60" r="15" fill="none" stroke="currentColor" stroke-width="0.4" opacity="0.2"/>
    <circle cx="60" cy="60" r="8" fill="none" stroke="currentColor" stroke-width="0.3" opacity="0.15"/>
    <!-- Corner triangles (Ethiopian cross motif) -->
    <path d="M0 0 L15 0 L0 15Z" fill="none" stroke="currentColor" stroke-width="0.4" opacity="0.2"/>
    <path d="M120 0 L105 0 L120 15Z" fill="none" stroke="currentColor" stroke-width="0.4" opacity="0.2"/>
    <path d="M0 120 L15 120 L0 105Z" fill="none" stroke="currentColor" stroke-width="0.4" opacity="0.2"/>
    <path d="M120 120 L105 120 L120 105Z" fill="none" stroke="currentColor" stroke-width="0.4" opacity="0.2"/>
    <!-- Zigzag borders (Kente wisdom pattern) -->
    <path d="M0 30 L10 20 L20 30 L30 20 L40 30" fill="none" stroke="currentColor" stroke-width="0.3" opacity="0.15"/>
    <path d="M80 90 L90 100 L100 90 L110 100 L120 90" fill="none" stroke="currentColor" stroke-width="0.3" opacity="0.15"/>
    <!-- Dot grid (sand divination: Ifa) -->
    <circle cx="20" cy="20" r="1" fill="currentColor" opacity="0.1"/>
    <circle cx="100" cy="20" r="1" fill="currentColor" opacity="0.1"/>
    <circle cx="20" cy="100" r="1" fill="currentColor" opacity="0.1"/>
    <circle cx="100" cy="100" r="1" fill="currentColor" opacity="0.1"/>
    <circle cx="60" cy="60" r="1.5" fill="currentColor" opacity="0.12"/>
  </svg>`;

  const encoded = 'data:image/svg+xml,' + encodeURIComponent(svg);

  const el = document.createElement('div');
  el.className = 'african-pattern';
  el.style.backgroundImage = `url("${encoded}")`;
  document.body.appendChild(el);
}

/* ═══════════════════════════════════════════════
   INIT
   ═══════════════════════════════════════════════ */

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', () => {
  if (currentMode === 'system') applyMode('system');
});

// Apply saved theme immediately (before Euler boots)
applyMode(currentMode);

// Create UI
createToggle();
createAfricanPattern();
