/* ═══════════════════════════════════════════════
   THE LETTERVERSE — PWA Engine

   Intelligent, reliable, native-feeling.

   - Register SW with update detection
   - Show "New content" toast when SW detects changes
   - Wasm compilation cache in IndexedDB
   - Install prompt (Chrome) or iOS guide
   - Online/offline awareness
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
      cursor: pointer;
    }
    .pwa-toast.visible { transform: translateX(-50%) translateY(0); }
    .pwa-toast.update-toast {
      border-color: rgba(201,169,110,0.3);
      color: var(--gold, #c9a96e);
    }
  `;
  document.head.appendChild(style);

  // ── Toast ───────────────────────────────────
  let toastTimer;
  function showToast(msg, opts = {}) {
    document.querySelector('.pwa-toast')?.remove();
    clearTimeout(toastTimer);
    const t = document.createElement('div');
    t.className = 'pwa-toast' + (opts.className ? ' ' + opts.className : '');
    t.textContent = msg;
    if (opts.onClick) t.addEventListener('click', opts.onClick);
    document.body.appendChild(t);
    requestAnimationFrame(() => requestAnimationFrame(() => t.classList.add('visible')));
    const duration = opts.duration || 3000;
    if (duration > 0) {
      toastTimer = setTimeout(() => {
        t.classList.remove('visible');
        setTimeout(() => t.remove(), 400);
      }, duration);
    }
  }

  // ── Service Worker with Update Detection ────
  let swRegistration = null;

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/wasmverse/sw.js', { scope: '/wasmverse/' })
      .then(reg => {
        swRegistration = reg;

        // Check for SW updates every 5 minutes (not just on page load)
        setInterval(() => reg.update(), 5 * 60 * 1000);

        // Detect new SW waiting to activate
        reg.addEventListener('updatefound', () => {
          const newSW = reg.installing;
          if (!newSW) return;

          newSW.addEventListener('statechange', () => {
            if (newSW.state === 'installed' && navigator.serviceWorker.controller) {
              // New SW installed and waiting — show update toast
              showUpdateToast();
            }
          });
        });
      })
      .catch(() => {}); // Silent fail — site works fine without SW

    // Listen for SW messages (content change detection)
    navigator.serviceWorker.addEventListener('message', e => {
      if (e.data?.type === 'UPDATE_AVAILABLE') {
        showUpdateToast();
      }
    });

    // Handle controller change (SW activated) — reload cleanly
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });
  }

  function showUpdateToast() {
    showToast('New content available — tap to refresh', {
      className: 'update-toast',
      duration: 0, // Persist until clicked
      onClick: () => {
        if (swRegistration?.waiting) {
          swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
        } else {
          window.location.reload();
        }
      },
    });
  }

  // ── Wasm Compilation Cache ──────────────────
  // Store compiled Wasm modules in IndexedDB to skip
  // recompilation on subsequent loads. This is a massive
  // perf win — compilation can take 100ms+, cache hit is <5ms.
  const WASM_DB = 'letterverse-wasm-cache';
  const WASM_DB_VERSION = 1;

  function openWasmDB() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(WASM_DB, WASM_DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains('modules')) {
          db.createObjectStore('modules');
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  /**
   * Instantiate a Wasm module with compilation caching.
   * First load: compile + cache in IndexedDB.
   * Subsequent loads: instantiate from cached module (<5ms).
   *
   * Usage: const { instance, module } = await wasmInstantiateCached(url, imports);
   */
  window.wasmInstantiateCached = async function(url, imports = {}) {
    try {
      const db = await openWasmDB();

      // Try cached module first
      const cached = await new Promise((resolve, reject) => {
        const tx = db.transaction('modules', 'readonly');
        const req = tx.objectStore('modules').get(url);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });

      if (cached) {
        // Instantiate from cached compiled module — near instant
        const instance = await WebAssembly.instantiate(cached, imports);
        return { instance, module: cached };
      }

      // First load — compile from network with streaming
      const response = await fetch(url);
      const { instance, module } = await WebAssembly.instantiateStreaming(response, imports);

      // Cache the compiled module for next time
      try {
        const tx = db.transaction('modules', 'readwrite');
        tx.objectStore('modules').put(module, url);
      } catch {} // IndexedDB failures are non-fatal

      return { instance, module };
    } catch {
      // Fallback: standard instantiation without caching
      const response = await fetch(url);
      return WebAssembly.instantiateStreaming(response, imports);
    }
  };

  // ── Predictive Prefetch Signal ──────────────
  // Tell the SW what book we're reading so it can
  // prefetch the next books in the compass path.
  window.signalReading = function(bookId) {
    if (navigator.serviceWorker?.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'READING_BOOK',
        bookId,
      });
    }
  };

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
