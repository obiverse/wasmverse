/* ═══════════════════════════════════════════════
   SCROLL LABORATORIES — Interactive JS labs

   Each lab is a self-contained interactive canvas
   embedded in book content via <!-- LAB:lab-id -->
   markers. Lazy-loaded by IntersectionObserver.

   Phase 1: Pure JS labs (no WASM)
   Phase 2: Activate dormant WASM crates
   ═══════════════════════════════════════════════ */

const LABS = {
  'math-graphing':        initGraphingLab,
  'bitcoin-utxo':         initUTXOLab,
  'crypto-cipher':        initCipherLab,
  'enterprise-unit-econ': initUnitEconLab,
  'systems-feedback':     initFeedbackLab,
  'rust-ownership':       initOwnershipLab,
};

/**
 * Initialize a lab by ID. Called by reader.js initDemos().
 */
export async function initScrollLab(labId, panel) {
  const init = LABS[labId];
  if (!init) {
    panel.querySelector('.demo-content').innerHTML =
      `<div class="demo-error">Unknown lab: ${labId}</div>`;
    return;
  }
  await init(panel);
}

/* ═══════════════════════════════════════════════
   GRAPHING CALCULATOR — Plot f(x) expressions
   Book: math
   ═══════════════════════════════════════════════ */
function initGraphingLab(panel) {
  const content = panel.querySelector('.demo-content');
  content.innerHTML = `
    <div class="demo-canvas-wrap"><canvas id="graph-canvas" width="600" height="400"></canvas></div>
    <div class="demo-controls">
      <input type="text" class="lab-input" id="graph-fn" value="Math.sin(x)" placeholder="f(x) = ...">
      <button class="demo-btn" id="graph-plot">Plot</button>
      <button class="demo-btn" id="graph-clear">Clear</button>
    </div>
    <div class="demo-stats" id="graph-stats">Enter a JS expression using x (e.g. Math.sin(x), x*x, Math.log(x))</div>`;

  const canvas = content.querySelector('#graph-canvas');
  const ctx = canvas.getContext('2d');
  const fnInput = content.querySelector('#graph-fn');
  const statsEl = content.querySelector('#graph-stats');

  const colors = ['#c9a96e', '#cd5c5c', '#48a6a6', '#9478c4', '#e4c98a'];
  let colorIdx = 0;

  function drawGrid() {
    const w = canvas.width, h = canvas.height;
    ctx.fillStyle = '#0a0a14';
    ctx.fillRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = 'rgba(201,169,110,0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
      const x = (w / 10) * i;
      const y = (h / 10) * i;
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = 'rgba(201,169,110,0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(w / 2, 0); ctx.lineTo(w / 2, h); ctx.stroke();

    // Labels
    ctx.fillStyle = 'rgba(201,169,110,0.5)';
    ctx.font = '11px JetBrains Mono, monospace';
    ctx.textAlign = 'center';
    const xRange = 10, yRange = 5;
    for (let i = -5; i <= 5; i++) {
      if (i === 0) continue;
      const px = w / 2 + (i / xRange) * w;
      ctx.fillText(String(i * 2), px, h / 2 + 14);
    }
    ctx.textAlign = 'right';
    for (let i = -4; i <= 4; i++) {
      if (i === 0) continue;
      const py = h / 2 - (i / yRange) * (h / 2);
      ctx.fillText(String(i), w / 2 - 6, py + 4);
    }
  }

  function plotFn(expr) {
    const w = canvas.width, h = canvas.height;
    const xMin = -10, xMax = 10;
    const yMin = -5, yMax = 5;

    try {
      const fn = new Function('x', `return ${expr}`);
      // Test with a sample value
      const test = fn(1);
      if (typeof test !== 'number') throw new Error('Must return a number');

      ctx.strokeStyle = colors[colorIdx % colors.length];
      colorIdx++;
      ctx.lineWidth = 2;
      ctx.beginPath();

      let started = false;
      for (let px = 0; px < w; px++) {
        const x = xMin + (px / w) * (xMax - xMin);
        const y = fn(x);
        if (!isFinite(y)) { started = false; continue; }
        const py = h / 2 - (y / (yMax - yMin)) * h;
        if (!started) { ctx.moveTo(px, py); started = true; }
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
      statsEl.textContent = `Plotted: f(x) = ${expr}`;
    } catch (err) {
      statsEl.textContent = `Error: ${err.message}`;
    }
  }

  drawGrid();

  content.querySelector('#graph-plot').addEventListener('click', () => plotFn(fnInput.value));
  content.querySelector('#graph-clear').addEventListener('click', () => { drawGrid(); colorIdx = 0; });
  fnInput.addEventListener('keydown', e => { if (e.key === 'Enter') plotFn(fnInput.value); });
}

/* ═══════════════════════════════════════════════
   UTXO VISUALIZER — Box diagram of UTXO splitting
   Book: bitcoin
   ═══════════════════════════════════════════════ */
function initUTXOLab(panel) {
  const content = panel.querySelector('.demo-content');
  content.innerHTML = `
    <div class="demo-canvas-wrap"><canvas id="utxo-canvas" width="600" height="350"></canvas></div>
    <div class="demo-controls">
      <button class="demo-btn" id="utxo-receive">Receive</button>
      <button class="demo-btn" id="utxo-spend">Spend</button>
      <button class="demo-btn" id="utxo-reset">Reset</button>
    </div>
    <div class="demo-stats" id="utxo-stats">Your wallet holds 1 UTXO</div>`;

  const canvas = content.querySelector('#utxo-canvas');
  const ctx = canvas.getContext('2d');
  const statsEl = content.querySelector('#utxo-stats');

  let utxos = [{ amount: 50000, color: '#c9a96e' }];
  const spent = [];

  function draw() {
    const w = canvas.width, h = canvas.height;
    ctx.fillStyle = '#0a0a14';
    ctx.fillRect(0, 0, w, h);

    // Draw UTXOs as boxes
    const total = utxos.reduce((s, u) => s + u.amount, 0);
    let x = 20;
    const boxH = 60;
    const y = h / 2 - boxH / 2;

    utxos.forEach(u => {
      const boxW = Math.max(40, (u.amount / 100000) * (w - 40));
      ctx.fillStyle = u.color;
      ctx.globalAlpha = 0.3;
      ctx.fillRect(x, y, boxW, boxH);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = u.color;
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, boxW, boxH);

      ctx.fillStyle = '#f0e8d8';
      ctx.font = '600 14px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${(u.amount / 100000000).toFixed(5)} BTC`, x + boxW / 2, y + boxH / 2 + 5);
      x += boxW + 10;
    });

    // Show spent UTXOs as faded
    spent.slice(-3).forEach((u, i) => {
      const sx = 20 + i * 80;
      const sy = h - 50;
      ctx.globalAlpha = 0.15;
      ctx.fillStyle = u.color;
      ctx.fillRect(sx, sy, 70, 30);
      ctx.globalAlpha = 0.3;
      ctx.font = '10px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ddd5c4';
      ctx.fillText('spent', sx + 35, sy + 18);
      ctx.globalAlpha = 1;
    });

    statsEl.textContent = `${utxos.length} UTXO${utxos.length !== 1 ? 's' : ''} \u2022 Total: ${(total / 100000000).toFixed(5)} BTC`;
  }

  draw();

  const colors = ['#c9a96e', '#48a6a6', '#cd5c5c', '#9478c4', '#e4c98a'];

  content.querySelector('#utxo-receive').addEventListener('click', () => {
    const amount = 10000 + Math.floor(Math.random() * 90000);
    utxos.push({ amount, color: colors[utxos.length % colors.length] });
    draw();
  });

  content.querySelector('#utxo-spend').addEventListener('click', () => {
    if (utxos.length === 0) return;
    // Spend the largest UTXO, create change
    utxos.sort((a, b) => b.amount - a.amount);
    const input = utxos.shift();
    spent.push(input);
    const fee = 500;
    const sendAmount = Math.floor(input.amount * 0.6);
    const change = input.amount - sendAmount - fee;
    if (change > 1000) {
      utxos.push({ amount: change, color: input.color });
    }
    draw();
  });

  content.querySelector('#utxo-reset').addEventListener('click', () => {
    utxos = [{ amount: 50000, color: '#c9a96e' }];
    spent.length = 0;
    draw();
  });
}

/* ═══════════════════════════════════════════════
   CIPHER PLAYGROUND — Live cipher transforms
   Book: crypto
   ═══════════════════════════════════════════════ */
function initCipherLab(panel) {
  const content = panel.querySelector('.demo-content');
  content.innerHTML = `
    <div class="lab-two-col">
      <div class="lab-col">
        <label class="lab-label">Plaintext</label>
        <textarea class="lab-textarea" id="cipher-input" rows="4" placeholder="Type your message...">Hello from the Letterverse</textarea>
      </div>
      <div class="lab-col">
        <label class="lab-label">Ciphertext</label>
        <textarea class="lab-textarea" id="cipher-output" rows="4" readonly></textarea>
      </div>
    </div>
    <div class="demo-controls">
      <select class="lab-select" id="cipher-algo">
        <option value="caesar">Caesar (shift)</option>
        <option value="rot13">ROT13</option>
        <option value="atbash">Atbash</option>
        <option value="xor">XOR</option>
      </select>
      <label class="lab-label-inline">Key: <input type="number" class="lab-input-sm" id="cipher-key" value="3" min="1" max="25"></label>
    </div>
    <div class="demo-stats" id="cipher-stats">Caesar cipher with shift 3</div>`;

  const input = content.querySelector('#cipher-input');
  const output = content.querySelector('#cipher-output');
  const algo = content.querySelector('#cipher-algo');
  const key = content.querySelector('#cipher-key');
  const stats = content.querySelector('#cipher-stats');

  function transform() {
    const text = input.value;
    const k = parseInt(key.value) || 3;
    const method = algo.value;

    let result = '';
    switch (method) {
      case 'caesar':
        result = text.split('').map(c => {
          if (c >= 'A' && c <= 'Z') return String.fromCharCode(((c.charCodeAt(0) - 65 + k) % 26) + 65);
          if (c >= 'a' && c <= 'z') return String.fromCharCode(((c.charCodeAt(0) - 97 + k) % 26) + 97);
          return c;
        }).join('');
        stats.textContent = `Caesar cipher with shift ${k}`;
        break;
      case 'rot13':
        result = text.split('').map(c => {
          if (c >= 'A' && c <= 'Z') return String.fromCharCode(((c.charCodeAt(0) - 65 + 13) % 26) + 65);
          if (c >= 'a' && c <= 'z') return String.fromCharCode(((c.charCodeAt(0) - 97 + 13) % 26) + 97);
          return c;
        }).join('');
        stats.textContent = 'ROT13 \u2014 its own inverse (apply twice = original)';
        break;
      case 'atbash':
        result = text.split('').map(c => {
          if (c >= 'A' && c <= 'Z') return String.fromCharCode(90 - (c.charCodeAt(0) - 65));
          if (c >= 'a' && c <= 'z') return String.fromCharCode(122 - (c.charCodeAt(0) - 97));
          return c;
        }).join('');
        stats.textContent = 'Atbash \u2014 reverse alphabet substitution';
        break;
      case 'xor':
        result = text.split('').map(c => {
          return String.fromCharCode(c.charCodeAt(0) ^ k);
        }).join('');
        stats.textContent = `XOR with key ${k} \u2014 symmetric (apply twice = original)`;
        break;
    }
    output.value = result;
  }

  input.addEventListener('input', transform);
  algo.addEventListener('change', transform);
  key.addEventListener('input', transform);
  transform();
}

/* ═══════════════════════════════════════════════
   UNIT ECONOMICS SIMULATOR
   Book: enterprise
   ═══════════════════════════════════════════════ */
function initUnitEconLab(panel) {
  const content = panel.querySelector('.demo-content');
  content.innerHTML = `
    <div class="lab-sliders">
      <label class="lab-slider-label">Customer Acquisition Cost (CAC)
        <input type="range" class="lab-slider" id="econ-cac" min="5" max="500" value="100">
        <span class="lab-slider-val" id="econ-cac-val">$100</span>
      </label>
      <label class="lab-slider-label">Monthly Revenue per Customer
        <input type="range" class="lab-slider" id="econ-rev" min="5" max="200" value="30">
        <span class="lab-slider-val" id="econ-rev-val">$30</span>
      </label>
      <label class="lab-slider-label">Monthly Churn Rate
        <input type="range" class="lab-slider" id="econ-churn" min="1" max="30" value="5">
        <span class="lab-slider-val" id="econ-churn-val">5%</span>
      </label>
      <label class="lab-slider-label">Gross Margin
        <input type="range" class="lab-slider" id="econ-margin" min="10" max="95" value="70">
        <span class="lab-slider-val" id="econ-margin-val">70%</span>
      </label>
    </div>
    <div class="demo-canvas-wrap"><canvas id="econ-canvas" width="600" height="250"></canvas></div>
    <div class="demo-stats" id="econ-stats"></div>`;

  const canvas = content.querySelector('#econ-canvas');
  const ctx = canvas.getContext('2d');
  const stats = content.querySelector('#econ-stats');

  const sliders = {
    cac:    content.querySelector('#econ-cac'),
    rev:    content.querySelector('#econ-rev'),
    churn:  content.querySelector('#econ-churn'),
    margin: content.querySelector('#econ-margin'),
  };
  const vals = {
    cac:    content.querySelector('#econ-cac-val'),
    rev:    content.querySelector('#econ-rev-val'),
    churn:  content.querySelector('#econ-churn-val'),
    margin: content.querySelector('#econ-margin-val'),
  };

  function compute() {
    const cac = +sliders.cac.value;
    const rev = +sliders.rev.value;
    const churn = +sliders.churn.value / 100;
    const margin = +sliders.margin.value / 100;

    vals.cac.textContent = `$${cac}`;
    vals.rev.textContent = `$${rev}`;
    vals.churn.textContent = `${(churn * 100).toFixed(0)}%`;
    vals.margin.textContent = `${(margin * 100).toFixed(0)}%`;

    const avgLifetimeMonths = 1 / churn;
    const ltv = rev * margin * avgLifetimeMonths;
    const ltvCacRatio = ltv / cac;
    const paybackMonths = cac / (rev * margin);

    // Draw P&L chart over 24 months
    const w = canvas.width, h = canvas.height;
    ctx.fillStyle = '#0a0a14';
    ctx.fillRect(0, 0, w, h);

    // Cumulative profit per customer over time
    const months = 24;
    const data = [];
    let cumProfit = -cac;
    for (let m = 0; m <= months; m++) {
      data.push(cumProfit);
      const retention = Math.pow(1 - churn, m);
      cumProfit += rev * margin * retention;
    }

    const maxVal = Math.max(...data.map(Math.abs), 1);
    const scaleY = (h - 40) / (maxVal * 2);
    const zeroY = h / 2;

    // Zero line
    ctx.strokeStyle = 'rgba(201,169,110,0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(40, zeroY); ctx.lineTo(w - 10, zeroY); ctx.stroke();

    // Profit curve
    ctx.strokeStyle = ltvCacRatio >= 3 ? '#48a6a6' : ltvCacRatio >= 1 ? '#c9a96e' : '#cd5c5c';
    ctx.lineWidth = 2;
    ctx.beginPath();
    data.forEach((val, i) => {
      const x = 40 + (i / months) * (w - 50);
      const y = zeroY - val * scaleY;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Payback line
    if (paybackMonths <= months) {
      const px = 40 + (paybackMonths / months) * (w - 50);
      ctx.strokeStyle = 'rgba(201,169,110,0.5)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(px, 10); ctx.lineTo(px, h - 10); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(201,169,110,0.6)';
      ctx.font = '10px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`Payback: ${paybackMonths.toFixed(1)}mo`, px, 22);
    }

    // Labels
    ctx.fillStyle = 'rgba(201,169,110,0.5)';
    ctx.font = '10px JetBrains Mono, monospace';
    ctx.textAlign = 'left';
    ctx.fillText('$0', 10, zeroY + 4);
    ctx.fillText('Months \u2192', w - 70, h - 5);

    const health = ltvCacRatio >= 3 ? 'Healthy' : ltvCacRatio >= 1 ? 'Marginal' : 'Unsustainable';
    stats.textContent = `LTV: $${ltv.toFixed(0)} \u2022 LTV/CAC: ${ltvCacRatio.toFixed(1)}x \u2022 Payback: ${paybackMonths.toFixed(1)} months \u2022 ${health}`;
  }

  Object.values(sliders).forEach(s => s.addEventListener('input', compute));
  compute();
}

/* ═══════════════════════════════════════════════
   FEEDBACK LOOP SIMULATOR
   Book: systems
   ═══════════════════════════════════════════════ */
function initFeedbackLab(panel) {
  const content = panel.querySelector('.demo-content');
  content.innerHTML = `
    <div class="demo-canvas-wrap"><canvas id="feedback-canvas" width="600" height="350"></canvas></div>
    <div class="demo-controls">
      <select class="lab-select" id="feedback-type">
        <option value="reinforcing">Reinforcing (positive feedback)</option>
        <option value="balancing">Balancing (negative feedback)</option>
        <option value="oscillating">Oscillating (delay + negative)</option>
      </select>
      <label class="lab-label-inline">Growth rate: <input type="range" class="lab-slider-sm" id="feedback-rate" min="1" max="20" value="5"></label>
      <button class="demo-btn" id="feedback-run">Run</button>
      <button class="demo-btn" id="feedback-reset">Reset</button>
    </div>
    <div class="demo-stats" id="feedback-stats">Select a loop type and press Run</div>`;

  const canvas = content.querySelector('#feedback-canvas');
  const ctx = canvas.getContext('2d');
  const stats = content.querySelector('#feedback-stats');
  const typeSelect = content.querySelector('#feedback-type');
  const rateSlider = content.querySelector('#feedback-rate');

  let animId = null;
  let data = [100];

  function draw() {
    const w = canvas.width, h = canvas.height;
    ctx.fillStyle = '#0a0a14';
    ctx.fillRect(0, 0, w, h);

    if (data.length < 2) return;

    const maxVal = Math.max(...data.map(Math.abs), 1);
    const scaleX = (w - 60) / Math.max(data.length - 1, 1);
    const scaleY = (h - 40) / (maxVal * 1.2);
    const zeroY = h / 2;

    // Grid
    ctx.strokeStyle = 'rgba(201,169,110,0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(40, zeroY); ctx.lineTo(w - 10, zeroY); ctx.stroke();

    // Data line
    const type = typeSelect.value;
    ctx.strokeStyle = type === 'reinforcing' ? '#cd5c5c' : type === 'balancing' ? '#48a6a6' : '#9478c4';
    ctx.lineWidth = 2;
    ctx.beginPath();
    data.forEach((val, i) => {
      const x = 40 + i * scaleX;
      const y = zeroY - val * scaleY;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Current value label
    const last = data[data.length - 1];
    ctx.fillStyle = '#f0e8d8';
    ctx.font = '12px JetBrains Mono, monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`Stock: ${last.toFixed(1)}`, 50, 20);
  }

  function simulate() {
    const rate = +rateSlider.value / 100;
    const type = typeSelect.value;
    const target = 100;
    const last = data[data.length - 1];

    let next;
    switch (type) {
      case 'reinforcing':
        next = last * (1 + rate);
        break;
      case 'balancing':
        next = last + (target - last) * rate;
        break;
      case 'oscillating': {
        const delay = Math.max(0, data.length - 5);
        const delayed = data[delay] || last;
        next = last + (target - delayed) * rate;
        break;
      }
    }

    data.push(next);
    draw();

    stats.textContent = `Step ${data.length - 1} \u2022 Stock: ${next.toFixed(1)} \u2022 Rate: ${(rate * 100).toFixed(0)}%`;

    if (data.length < 100 && Math.abs(next) < 1e6) {
      animId = requestAnimationFrame(simulate);
    }
  }

  content.querySelector('#feedback-run').addEventListener('click', () => {
    if (animId) cancelAnimationFrame(animId);
    simulate();
  });

  content.querySelector('#feedback-reset').addEventListener('click', () => {
    if (animId) cancelAnimationFrame(animId);
    animId = null;
    data = [100];
    draw();
    stats.textContent = 'Select a loop type and press Run';
  });

  draw();
}

/* ═══════════════════════════════════════════════
   OWNERSHIP VISUALIZER — Moves and borrows
   Book: rust
   ═══════════════════════════════════════════════ */
function initOwnershipLab(panel) {
  const content = panel.querySelector('.demo-content');
  content.innerHTML = `
    <div class="demo-canvas-wrap"><canvas id="own-canvas" width="600" height="300"></canvas></div>
    <div class="demo-controls">
      <select class="lab-select" id="own-scenario">
        <option value="move">Move (ownership transfer)</option>
        <option value="borrow">Borrow (&amp;T — shared reference)</option>
        <option value="mut-borrow">Mutable Borrow (&amp;mut T)</option>
        <option value="clone">Clone (deep copy)</option>
        <option value="drop">Drop (end of scope)</option>
      </select>
      <button class="demo-btn" id="own-play">Animate</button>
    </div>
    <div class="demo-stats" id="own-stats">Select a scenario to visualize Rust ownership</div>`;

  const canvas = content.querySelector('#own-canvas');
  const ctx = canvas.getContext('2d');
  const stats = content.querySelector('#own-stats');
  const scenario = content.querySelector('#own-scenario');

  const GOLD = '#c9a96e';
  const TEAL = '#48a6a6';
  const RED = '#cd5c5c';
  const DIM = '#9e9684';

  function drawBox(x, y, w, h, label, color, dashed) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    if (dashed) ctx.setLineDash([6, 4]);
    ctx.strokeRect(x, y, w, h);
    ctx.setLineDash([]);
    ctx.fillStyle = color;
    ctx.font = '600 13px JetBrains Mono, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(label, x + w / 2, y + h / 2 + 5);
  }

  function drawArrow(x1, y1, x2, y2, color, label) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
    ctx.stroke();
    // Arrowhead
    const angle = Math.atan2(y2 - y1, x2 - x1);
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - 10 * Math.cos(angle - 0.3), y2 - 10 * Math.sin(angle - 0.3));
    ctx.lineTo(x2 - 10 * Math.cos(angle + 0.3), y2 - 10 * Math.sin(angle + 0.3));
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    if (label) {
      ctx.fillStyle = color;
      ctx.font = '11px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(label, (x1 + x2) / 2, (y1 + y2) / 2 - 8);
    }
  }

  function drawScene(type, progress) {
    const w = canvas.width, h = canvas.height;
    ctx.fillStyle = '#0a0a14';
    ctx.fillRect(0, 0, w, h);

    const bw = 100, bh = 50;
    const y1 = 60, y2 = 180;

    switch (type) {
      case 'move': {
        // Variable a (left), variable b (right)
        const fade = Math.min(1, progress * 2);
        drawBox(80, y1, bw, bh, 'let a = vec![]', fade < 1 ? GOLD : DIM, fade >= 1);
        if (progress > 0.3) {
          const slide = Math.min(1, (progress - 0.3) * 2);
          drawArrow(180, y1 + bh / 2, 180 + 100 * slide, y1 + bh / 2 + 80 * slide, GOLD, 'move');
          if (slide > 0.5) drawBox(300, y2, bw, bh, 'let b = a', GOLD, false);
        }
        stats.textContent = progress > 0.3
          ? 'Ownership moved from a to b. a is no longer valid.'
          : 'Variable a owns the heap data.';
        break;
      }
      case 'borrow': {
        drawBox(80, y1, bw, bh, 'let a = String', GOLD, false);
        if (progress > 0.2) {
          drawArrow(180, y1 + bh, 300, y2, TEAL, '&a');
          drawBox(300, y2, bw, bh, 'let r = &a', TEAL, true);
        }
        if (progress > 0.5) {
          drawArrow(180, y1 + bh, 450, y2, TEAL, '&a');
          drawBox(450, y2, bw, bh, 'let s = &a', TEAL, true);
        }
        stats.textContent = 'Multiple shared references (&T) allowed. No mutation.';
        break;
      }
      case 'mut-borrow': {
        drawBox(80, y1, bw, bh, 'let mut a', GOLD, false);
        if (progress > 0.3) {
          drawArrow(180, y1 + bh, 300, y2, RED, '&mut a');
          drawBox(300, y2, bw, bh, 'let r = &mut a', RED, true);
        }
        if (progress > 0.6) {
          // Show crossed-out second borrow
          ctx.globalAlpha = 0.3;
          drawBox(450, y2, bw, bh, '&mut a \u2718', RED, true);
          ctx.globalAlpha = 1;
        }
        stats.textContent = 'Only ONE mutable reference at a time. Second borrow rejected.';
        break;
      }
      case 'clone': {
        drawBox(80, y1, bw, bh, 'let a = vec![]', GOLD, false);
        if (progress > 0.3) {
          drawArrow(180, y1 + bh / 2, 300, y2 + bh / 2, TEAL, '.clone()');
          drawBox(300, y2, bw, bh, 'let b = a.clone()', TEAL, false);
        }
        stats.textContent = 'Clone creates an independent copy. Both a and b are valid owners.';
        break;
      }
      case 'drop': {
        const fade = Math.min(1, progress * 3);
        if (fade < 1) {
          drawBox(80, y1, bw, bh, 'let a = Box', GOLD, false);
        }
        if (progress > 0.5) {
          ctx.globalAlpha = Math.max(0, 1 - (progress - 0.5) * 3);
          drawBox(80, y1, bw, bh, 'let a = Box', DIM, true);
          ctx.globalAlpha = 1;
          ctx.fillStyle = RED;
          ctx.font = '600 14px JetBrains Mono, monospace';
          ctx.textAlign = 'center';
          ctx.fillText('} // a dropped here', 200, y2 + 20);
        }
        stats.textContent = progress > 0.5
          ? 'Scope ends: a is dropped, heap memory freed automatically.'
          : 'Variable a owns heap-allocated data.';
        break;
      }
    }
  }

  let animId = null;
  let progress = 0;

  function animate() {
    progress += 0.015;
    if (progress > 1) { progress = 1; drawScene(scenario.value, 1); return; }
    drawScene(scenario.value, progress);
    animId = requestAnimationFrame(animate);
  }

  content.querySelector('#own-play').addEventListener('click', () => {
    if (animId) cancelAnimationFrame(animId);
    progress = 0;
    animate();
  });

  scenario.addEventListener('change', () => {
    if (animId) cancelAnimationFrame(animId);
    progress = 0;
    drawScene(scenario.value, 0);
    stats.textContent = 'Select a scenario to visualize Rust ownership';
  });

  drawScene('move', 0);
}
