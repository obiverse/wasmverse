/* ═══════════════════════════════════════════════
   THE LETTERVERSE — PWA Engine

   Simple, reliable, native-feeling.

   - Register SW (network-first, no precache drama)
   - Detect install prompt (Chrome) or guide iOS users
   - Show offline/online toasts
   - Welcome screen for standalone mode
   ═══════════════════════════════════════════════ */

(function() {
  'use strict';

  const ua = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isSafari = /Safari/.test(ua) && !/Chrome/.test(ua);
  const isFirefox = /Firefox/.test(ua);
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    || window.navigator.standalone === true;

  const STORE_KEY = 'letterverse_pwa';

  function getStore() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY) || '{}'); }
    catch { return {}; }
  }

  function setStore(patch) {
    const s = getStore();
    Object.assign(s, patch);
    localStorage.setItem(STORE_KEY, JSON.stringify(s));
  }

  // ── Service Worker ──────────────────────────
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/wasmverse/sw.js', { scope: '/wasmverse/' })
      .catch(() => {}); // Silent fail — site works fine without SW
  }

  // ── Inject Styles ───────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    .pwa-banner {
      position: fixed; bottom: 0; left: 0; right: 0; z-index: 9999;
      transform: translateY(100%);
      transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
      pointer-events: none;
    }
    .pwa-banner.visible { transform: translateY(0); pointer-events: auto; }
    .pwa-banner-inner {
      max-width: 480px; margin: 0 auto 1rem; padding: 1.2rem 1.4rem;
      background: var(--bg-elevated, #0f0f1e);
      border: 1px solid var(--border, #1e1e30);
      border-radius: 14px;
      box-shadow: 0 -4px 30px rgba(0,0,0,0.4);
      font-family: 'Crimson Pro', Georgia, serif; color: var(--text, #ddd5c4);
    }
    @media (max-width: 520px) {
      .pwa-banner-inner { margin: 0 0.5rem 0.5rem; padding: 1rem; border-radius: 12px; }
    }
    .pwa-banner-title {
      font-family: 'Cormorant Garamond', Palatino, serif;
      font-size: 1.1rem; font-weight: 600; color: var(--gold-bright, #e4c98a);
      margin-bottom: 0.3rem;
    }
    .pwa-banner-text { font-size: 0.85rem; color: var(--text-dim, #9e9684); line-height: 1.5; margin-bottom: 0.8rem; }
    .pwa-banner-actions { display: flex; gap: 0.6rem; }
    .pwa-btn {
      flex: 1; padding: 0.6rem 1rem; border-radius: 8px; cursor: pointer;
      font-family: 'Cormorant Garamond', Palatino, serif; font-size: 0.9rem;
      font-weight: 600; text-align: center; transition: all 0.2s;
    }
    .pwa-btn-primary {
      background: rgba(201,169,110,0.12); border: 1px solid rgba(201,169,110,0.3);
      color: var(--gold, #c9a96e);
    }
    .pwa-btn-primary:hover { background: rgba(201,169,110,0.2); }
    .pwa-btn-dismiss {
      background: none; border: 1px solid rgba(255,255,255,0.06);
      color: var(--text-dim, #9e9684);
    }
    .pwa-toast {
      position: fixed; top: 1rem; left: 50%;
      transform: translateX(-50%) translateY(-120%); z-index: 9998;
      padding: 0.5rem 1rem;
      background: var(--bg-elevated, #0f0f1e);
      border: 1px solid var(--border, #1e1e30);
      border-radius: 8px;
      font-family: 'JetBrains Mono', monospace; font-size: 0.7rem;
      color: var(--text-dim, #9e9684);
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      white-space: nowrap;
    }
    .pwa-toast.visible { transform: translateX(-50%) translateY(0); }
  `;
  document.head.appendChild(style);

  // ── Toast ───────────────────────────────────
  let toastTimer;
  function showToast(msg) {
    document.querySelector('.pwa-toast')?.remove();
    clearTimeout(toastTimer);
    const t = document.createElement('div');
    t.className = 'pwa-toast';
    t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(() => requestAnimationFrame(() => t.classList.add('visible')));
    toastTimer = setTimeout(() => {
      t.classList.remove('visible');
      setTimeout(() => t.remove(), 400);
    }, 3000);
  }

  // ── Install prompt (Chrome/Edge) ────────────
  let deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredPrompt = e;
    showInstallBanner();
  });

  window.addEventListener('appinstalled', () => {
    setStore({ installed: true });
    hideBanner();
    showToast('Installed — works offline');
  });

  // ── Standalone welcome ──────────────────────
  if (isStandalone) {
    const s = getStore();
    if (!s.welcomed) {
      setStore({ welcomed: true });
      showToast('The Letterverse — reading offline');
    }
    return; // No install banners in standalone
  }

  // ── iOS / Firefox: show banner after engagement ──
  if ((isIOS && isSafari) || isFirefox) {
    const s = getStore();
    if (!s.dismissedAt || (Date.now() - s.dismissedAt) > 7 * 86400000) {
      setTimeout(showInstallBanner, 15000);
    }
  }

  // ── Online/Offline ──────────────────────────
  window.addEventListener('online', () => showToast('Back online'));
  window.addEventListener('offline', () => showToast('Reading offline'));

  // ── Install Banner ──────────────────────────
  let bannerEl = null;

  function showInstallBanner() {
    if (bannerEl) return;
    const s = getStore();
    if (s.installed || (s.dismissedAt && (Date.now() - s.dismissedAt) < 7 * 86400000)) return;

    bannerEl = document.createElement('div');
    bannerEl.className = 'pwa-banner';

    const isIOSSafari = isIOS && isSafari;
    const action = deferredPrompt ? 'Install App' : isIOSSafari ? 'Add to Home Screen' : 'Bookmark to Install';

    bannerEl.innerHTML = `
      <div class="pwa-banner-inner">
        <div class="pwa-banner-title">Read offline, like a book</div>
        <div class="pwa-banner-text">Install the Letterverse. Your treatises travel with you.</div>
        <div class="pwa-banner-actions">
          <button class="pwa-btn pwa-btn-primary" id="pwa-install">${action}</button>
          <button class="pwa-btn pwa-btn-dismiss" id="pwa-dismiss">Later</button>
        </div>
      </div>`;
    document.body.appendChild(bannerEl);
    requestAnimationFrame(() => requestAnimationFrame(() => bannerEl.classList.add('visible')));

    document.getElementById('pwa-install').onclick = () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(() => { deferredPrompt = null; hideBanner(); });
      } else if (isIOSSafari) {
        showToast('Tap Share → Add to Home Screen');
        hideBanner();
      } else {
        hideBanner();
      }
    };

    document.getElementById('pwa-dismiss').onclick = () => {
      setStore({ dismissedAt: Date.now() });
      hideBanner();
    };
  }

  function hideBanner() {
    if (!bannerEl) return;
    bannerEl.classList.remove('visible');
    setTimeout(() => { bannerEl?.remove(); bannerEl = null; }, 500);
  }

})();
