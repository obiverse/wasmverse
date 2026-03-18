/* ═══════════════════════════════════════════════
   THE EPISTOLARY LIBRARY — PWA Engine
   Seamless install, auto-update, offline-first,
   smart onboarding across all browsers
   ═══════════════════════════════════════════════ */

(function() {
  'use strict';

  // ── Platform detection ──────────────────────
  const ua = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isAndroid = /Android/.test(ua);
  const isSafari = /Safari/.test(ua) && !/Chrome/.test(ua);
  const isFirefox = /Firefox/.test(ua);
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    || window.navigator.standalone === true;

  const STORE_KEY = 'epistolary_pwa';

  function getStore() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY) || '{}'); }
    catch { return {}; }
  }

  function setStore(patch) {
    const s = getStore();
    Object.assign(s, patch);
    localStorage.setItem(STORE_KEY, JSON.stringify(s));
  }

  // ── Detect reinstall: if we're NOT standalone but store says installed,
  //    user uninstalled. Reset the state so onboarding works again. ────
  if (!isStandalone) {
    const store = getStore();
    if (store.installed) {
      // User uninstalled — reset everything so they get a fresh experience
      localStorage.removeItem(STORE_KEY);
    }
  }

  // ── Service Worker Registration ─────────────
  if ('serviceWorker' in navigator) {
    // Use absolute path to ensure correct scope on GitHub Pages
    navigator.serviceWorker.register('/wasmverse/sw.js', { scope: '/wasmverse/' })
      .then(reg => {
        // Check for updates every 30 minutes
        setInterval(() => reg.update(), 30 * 60 * 1000);

        // Listen for new SW waiting
        reg.addEventListener('updatefound', () => {
          const newSW = reg.installing;
          if (!newSW) return;

          newSW.addEventListener('statechange', () => {
            // New SW activated — reload for fresh content
            if (newSW.state === 'activated' && navigator.serviceWorker.controller) {
              showToast('Updated — loading latest content', 'online');
              setTimeout(() => window.location.reload(), 1200);
            }
          });
        });
      })
      .catch(err => {
        console.warn('SW registration failed:', err);
      });

    // Listen for SW_UPDATED message from service worker
    navigator.serviceWorker.addEventListener('message', e => {
      if (e.data?.type === 'SW_UPDATED') {
        showToast('New content available', 'online');
        setTimeout(() => window.location.reload(), 1200);
      }
    });
  }

  // ── Inject Styles ───────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    .pwa-banner {
      position: fixed;
      bottom: 0; left: 0; right: 0;
      z-index: 9999;
      transform: translateY(100%);
      transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
      pointer-events: none;
    }
    .pwa-banner.visible { transform: translateY(0); pointer-events: auto; }
    .pwa-banner-inner {
      max-width: 520px;
      margin: 0 auto 1rem;
      padding: 1.4rem 1.6rem;
      background: rgba(14, 14, 28, 0.96);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(201, 169, 110, 0.2);
      border-radius: 16px;
      box-shadow: 0 -8px 40px rgba(0,0,0,0.5), 0 0 80px rgba(201,169,110,0.05);
      font-family: 'Crimson Pro', Georgia, serif;
      color: #ddd5c4;
    }
    @media (max-width: 560px) {
      .pwa-banner-inner { margin: 0 0.5rem 0.5rem; padding: 1.2rem; border-radius: 14px; }
    }
    .pwa-banner-title {
      font-family: 'Cormorant Garamond', Palatino, serif;
      font-size: 1.15rem; font-weight: 600; color: #e4c98a;
      margin-bottom: 0.4rem;
    }
    .pwa-banner-text { font-size: 0.88rem; color: #9e9684; line-height: 1.55; margin-bottom: 1rem; }
    .pwa-banner-actions { display: flex; gap: 0.75rem; align-items: center; }
    .pwa-btn-install {
      flex: 1; padding: 0.7rem 1.2rem;
      background: rgba(201, 169, 110, 0.12);
      border: 1px solid rgba(201, 169, 110, 0.3);
      border-radius: 10px; color: #c9a96e;
      font-family: 'Cormorant Garamond', Palatino, serif;
      font-size: 0.95rem; font-weight: 600; letter-spacing: 0.06em;
      cursor: pointer; transition: all 0.3s; text-align: center;
    }
    .pwa-btn-install:hover {
      background: rgba(201, 169, 110, 0.2);
      border-color: rgba(201, 169, 110, 0.5);
      box-shadow: 0 0 20px rgba(201, 169, 110, 0.15);
    }
    .pwa-btn-dismiss {
      padding: 0.7rem 1rem; background: none;
      border: 1px solid rgba(255,255,255,0.06); border-radius: 10px;
      color: #9e9684; font-family: 'Crimson Pro', Georgia, serif;
      font-size: 0.85rem; cursor: pointer; transition: all 0.3s; white-space: nowrap;
    }
    .pwa-btn-dismiss:hover { border-color: rgba(255,255,255,0.12); color: #ddd5c4; }

    .pwa-ios-overlay {
      position: fixed; inset: 0; z-index: 10000;
      background: rgba(6, 6, 14, 0.92);
      backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
      display: flex; align-items: center; justify-content: center;
      opacity: 0; pointer-events: none; transition: opacity 0.4s;
    }
    .pwa-ios-overlay.visible { opacity: 1; pointer-events: auto; }
    .pwa-ios-card {
      max-width: 360px; width: 90%; padding: 2rem 1.8rem;
      background: rgba(14, 14, 28, 0.98);
      border: 1px solid rgba(201, 169, 110, 0.2);
      border-radius: 20px; text-align: center;
      box-shadow: 0 20px 80px rgba(0,0,0,0.6);
    }
    .pwa-ios-card h3 {
      font-family: 'Cormorant Garamond', Palatino, serif;
      font-size: 1.3rem; font-weight: 600; color: #e4c98a; margin-bottom: 1.2rem;
    }
    .pwa-ios-steps { text-align: left; margin-bottom: 1.5rem; }
    .pwa-ios-step {
      display: flex; align-items: flex-start; gap: 0.75rem;
      padding: 0.75rem 0; border-bottom: 1px solid rgba(255,255,255,0.04);
      font-family: 'Crimson Pro', Georgia, serif;
      font-size: 0.92rem; color: #ddd5c4; line-height: 1.5;
    }
    .pwa-ios-step:last-child { border-bottom: none; }
    .pwa-ios-step-num {
      flex-shrink: 0; width: 26px; height: 26px; border-radius: 50%;
      background: rgba(201, 169, 110, 0.12);
      border: 1px solid rgba(201, 169, 110, 0.25);
      display: flex; align-items: center; justify-content: center;
      font-family: 'JetBrains Mono', monospace; font-size: 0.7rem; color: #c9a96e;
    }
    .pwa-ios-icon { display: inline-block; vertical-align: middle; width: 20px; height: 20px; }
    .pwa-ios-close {
      padding: 0.6rem 2rem;
      background: rgba(201, 169, 110, 0.1);
      border: 1px solid rgba(201, 169, 110, 0.25);
      border-radius: 10px; color: #c9a96e;
      font-family: 'Cormorant Garamond', Palatino, serif;
      font-size: 0.95rem; cursor: pointer; transition: all 0.3s;
    }
    .pwa-ios-close:hover { background: rgba(201, 169, 110, 0.2); }

    .pwa-toast {
      position: fixed; top: 1rem; left: 50%;
      transform: translateX(-50%) translateY(-120%);
      z-index: 9998; padding: 0.6rem 1.2rem;
      background: rgba(14, 14, 28, 0.95);
      backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(201, 169, 110, 0.15);
      border-radius: 10px; font-family: 'JetBrains Mono', monospace;
      font-size: 0.72rem; color: #9e9684; letter-spacing: 0.04em;
      transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1); white-space: nowrap;
    }
    .pwa-toast.visible { transform: translateX(-50%) translateY(0); }
    .pwa-toast-dot {
      display: inline-block; width: 6px; height: 6px; border-radius: 50%;
      margin-right: 0.5rem; vertical-align: middle;
    }
    .pwa-toast-dot.online { background: #4a7a4a; }
    .pwa-toast-dot.offline { background: #8b6914; }

    .pwa-welcome {
      position: fixed; inset: 0; z-index: 10001;
      background: #06060e; display: flex;
      flex-direction: column; align-items: center; justify-content: center;
      opacity: 1; transition: opacity 0.8s ease;
    }
    .pwa-welcome.fading { opacity: 0; pointer-events: none; }
    .pwa-welcome-icon {
      width: 80px; height: 80px; margin-bottom: 1.5rem;
      opacity: 0; transform: scale(0.8);
      animation: pwaIn 0.8s 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    .pwa-welcome h2 {
      font-family: 'Cormorant Garamond', Palatino, serif;
      font-size: 1.6rem; font-weight: 600; color: #e4c98a; margin-bottom: 0.3rem;
      opacity: 0; animation: pwaIn 0.8s 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    .pwa-welcome p {
      font-family: 'Crimson Pro', Georgia, serif;
      font-size: 0.95rem; color: #9e9684; font-style: italic;
      opacity: 0; animation: pwaIn 0.8s 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    .pwa-welcome-offline {
      margin-top: 1.5rem; font-family: 'JetBrains Mono', monospace;
      font-size: 0.65rem; color: #8b6914; letter-spacing: 0.1em; text-transform: uppercase;
      opacity: 0; animation: pwaIn 0.8s 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    @keyframes pwaIn { to { opacity: 1; transform: scale(1); } }
  `;
  document.head.appendChild(style);

  // ── Icons ─────────────────────────────────
  const shareIconSVG = `<svg class="pwa-ios-icon" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" stroke-width="1.5"><path d="M12 3v12M12 3l4 4M12 3L8 7"/><path d="M4 14v5a2 2 0 002 2h12a2 2 0 002-2v-5"/></svg>`;
  const plusIconSVG = `<svg class="pwa-ios-icon" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M12 8v8M8 12h8"/></svg>`;

  // ── Deferred install prompt (Chromium) ─────
  let deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredPrompt = e;
    scheduleInstallBanner();
  });

  // Track successful install
  window.addEventListener('appinstalled', () => {
    setStore({ installed: true, installedAt: Date.now() });
    hideBanner();
    showToast('Installed — available offline', 'online');
  });

  // ── Standalone mode: welcome ceremony ─────
  if (isStandalone) {
    const store = getStore();
    if (!store.welcomed) {
      showWelcome();
      setStore({ welcomed: true });
    }
    return; // No install banners in standalone mode
  }

  // ── Schedule Install Banner ───────────────
  function scheduleInstallBanner() {
    const store = getStore();
    // Don't show if dismissed in the last 3 days (shorter than before — less annoying, more chances)
    if (store.dismissedAt && (Date.now() - store.dismissedAt) < 3 * 24 * 60 * 60 * 1000) return;

    // Show after 12s or 15% scroll — whichever comes first
    let shown = false;
    const timer = setTimeout(() => { if (!shown) { shown = true; showBanner(); } }, 12000);

    const scrollHandler = () => {
      if (shown) return;
      const docH = document.body.scrollHeight - window.innerHeight;
      if (docH > 0 && (window.scrollY / docH) > 0.15) {
        shown = true;
        clearTimeout(timer);
        showBanner();
        window.removeEventListener('scroll', scrollHandler);
      }
    };
    window.addEventListener('scroll', scrollHandler, { passive: true });
  }

  // ── Show Install Banner ───────────────────
  let bannerEl = null;
  function showBanner() {
    if (bannerEl) return;
    bannerEl = document.createElement('div');
    bannerEl.className = 'pwa-banner';

    const isIOSSafari = isIOS && isSafari;
    const hasPrompt = !!deferredPrompt;

    let actionHTML;
    if (isIOSSafari) {
      actionHTML = `
        <button class="pwa-btn-install" id="pwa-install-btn">Add to Home Screen</button>
        <button class="pwa-btn-dismiss" id="pwa-dismiss-btn">Later</button>`;
    } else if (hasPrompt) {
      actionHTML = `
        <button class="pwa-btn-install" id="pwa-install-btn">Install App</button>
        <button class="pwa-btn-dismiss" id="pwa-dismiss-btn">Later</button>`;
    } else {
      actionHTML = `<button class="pwa-btn-dismiss" id="pwa-dismiss-btn" style="flex:1">Understood</button>`;
    }

    bannerEl.innerHTML = `
      <div class="pwa-banner-inner">
        <div class="pwa-banner-title">Read offline, like a real book</div>
        <div class="pwa-banner-text">
          ${isIOSSafari || hasPrompt
            ? 'Install the Library to your home screen. Your treatises travel with you — no internet required.'
            : 'This site works offline. Bookmark it, or use your browser\'s "Install" option to add it as an app.'}
        </div>
        <div class="pwa-banner-actions">${actionHTML}</div>
      </div>`;

    document.body.appendChild(bannerEl);
    requestAnimationFrame(() => requestAnimationFrame(() => bannerEl.classList.add('visible')));

    document.getElementById('pwa-install-btn')?.addEventListener('click', () => {
      if (isIOSSafari) {
        showIOSInstructions();
        hideBanner();
      } else if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(result => {
          deferredPrompt = null;
          hideBanner();
          if (result.outcome === 'accepted') showToast('Installing...', 'online');
        });
      }
    });

    document.getElementById('pwa-dismiss-btn')?.addEventListener('click', () => {
      setStore({ dismissedAt: Date.now() });
      hideBanner();
    });
  }

  function hideBanner() {
    if (!bannerEl) return;
    bannerEl.classList.remove('visible');
    setTimeout(() => { bannerEl?.remove(); bannerEl = null; }, 600);
  }

  // ── iOS Instructions ──────────────────────
  function showIOSInstructions() {
    const overlay = document.createElement('div');
    overlay.className = 'pwa-ios-overlay';
    overlay.innerHTML = `
      <div class="pwa-ios-card">
        <h3>Add to Home Screen</h3>
        <div class="pwa-ios-steps">
          <div class="pwa-ios-step">
            <span class="pwa-ios-step-num">1</span>
            <span>Tap the Share button ${shareIconSVG} in Safari's toolbar</span>
          </div>
          <div class="pwa-ios-step">
            <span class="pwa-ios-step-num">2</span>
            <span>Scroll down and tap <strong style="color:#e4c98a">"Add to Home Screen"</strong> ${plusIconSVG}</span>
          </div>
          <div class="pwa-ios-step">
            <span class="pwa-ios-step-num">3</span>
            <span>Tap <strong style="color:#e4c98a">"Add"</strong> — the Library appears as an app</span>
          </div>
        </div>
        <button class="pwa-ios-close" id="pwa-ios-close">I understand</button>
      </div>`;

    document.body.appendChild(overlay);
    requestAnimationFrame(() => requestAnimationFrame(() => overlay.classList.add('visible')));

    const close = () => {
      overlay.classList.remove('visible');
      setTimeout(() => overlay.remove(), 400);
      setStore({ dismissedAt: Date.now() });
    };

    document.getElementById('pwa-ios-close').addEventListener('click', close);
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  }

  // ── Toast Notifications ───────────────────
  let toastTimer = null;
  function showToast(message, status) {
    document.querySelector('.pwa-toast')?.remove();
    clearTimeout(toastTimer);

    const toast = document.createElement('div');
    toast.className = 'pwa-toast';
    toast.innerHTML = `<span class="pwa-toast-dot ${status}"></span>${message}`;
    document.body.appendChild(toast);
    requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add('visible')));
    toastTimer = setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 500);
    }, 3500);
  }

  // ── Online/Offline awareness ──────────────
  window.addEventListener('online', () => showToast('Back online', 'online'));
  window.addEventListener('offline', () => showToast('Reading offline — all treatises available', 'offline'));

  // First offline confirmation
  if (navigator.serviceWorker?.controller) {
    const store = getStore();
    if (!store.offlineNotified) {
      setTimeout(() => showToast('Available offline', 'online'), 2500);
      setStore({ offlineNotified: true });
    }
  }

  // ── Welcome Screen (standalone) ───────────
  function showWelcome() {
    const welcome = document.createElement('div');
    welcome.className = 'pwa-welcome';
    welcome.innerHTML = `
      <img class="pwa-welcome-icon" src="icon.svg" alt="">
      <h2>The Epistolary Library</h2>
      <p>Treatises for builders who love the universe</p>
      <div class="pwa-welcome-offline">available offline</div>`;

    document.body.appendChild(welcome);
    setTimeout(() => {
      welcome.classList.add('fading');
      setTimeout(() => welcome.remove(), 800);
    }, 2500);
  }

  // ── iOS/Firefox: trigger banner without beforeinstallprompt ──
  if ((isIOS && isSafari) || isFirefox) {
    if (!isStandalone) scheduleInstallBanner();
  }

})();
