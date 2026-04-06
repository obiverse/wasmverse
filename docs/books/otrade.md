# oTrade — Market Price Intelligence for Nigerian Traders

## Preface

Fifty million Nigerian traders wake up every morning and make decisions in the dark. They buy without knowing if the next market has it cheaper. They sell without knowing if the next town would pay more. They travel without knowing if the goods are even there.

This is a document about ending that darkness.

**oTrade** is a mobile-first price intelligence platform. Post a price in 10 seconds. See prices in 3 seconds. Get alerts via WhatsApp. The simplest tool that could possibly make 50 million traders wealthier.

What follows is the product — illustrated, explained, and grounded in the reality of Nigerian markets.

---

## Part I: The Problem

---

### Letter 1: On Information Darkness

> *"I called eight people before I drove to Onitsha. Three didn't pick up. Two gave me last week's price. I still overpaid by twelve thousand naira per bag."* — A rice trader, Calabar

The invisible tax on African commerce is not corruption, not infrastructure, not capital. It is **information asymmetry**. The trader who knows the price wins. The trader who doesn't pays — in transport costs, in bad deals, in wasted days.

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" style="width:100%;max-width:800px;display:block;margin:2em auto;">
  <defs>
    <radialGradient id="dark1" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#1a1a1a"/><stop offset="100%" stop-color="#0a0a0a"/></radialGradient>
    <filter id="glow"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <rect width="800" height="450" fill="#0a0a0a" rx="12"/>
  <text x="400" y="30" text-anchor="middle" fill="rgba(232,224,208,0.3)" font-size="12" font-family="monospace">INFORMATION DARKNESS</text>

  <!-- Trader 1: Top left -->
  <circle cx="160" cy="130" r="60" fill="none" stroke="#1a1a1a" stroke-width="2"/>
  <circle cx="160" cy="115" r="14" fill="none" stroke="#C9A84C" stroke-width="1.5"/>
  <line x1="160" y1="130" x2="160" y2="160" stroke="#C9A84C" stroke-width="1.5"/>
  <line x1="145" y1="145" x2="175" y2="145" stroke="#C9A84C" stroke-width="1.5"/>
  <text x="160" y="185" text-anchor="middle" fill="rgba(232,224,208,0.4)" font-size="10" font-family="monospace">Aba Trader</text>
  <text x="130" y="108" fill="#EF5350" font-size="18" font-family="sans-serif" font-weight="bold">?</text>

  <!-- Trader 2: Top right -->
  <circle cx="640" cy="130" r="60" fill="none" stroke="#1a1a1a" stroke-width="2"/>
  <circle cx="640" cy="115" r="14" fill="none" stroke="#C9A84C" stroke-width="1.5"/>
  <line x1="640" y1="130" x2="640" y2="160" stroke="#C9A84C" stroke-width="1.5"/>
  <line x1="625" y1="145" x2="655" y2="145" stroke="#C9A84C" stroke-width="1.5"/>
  <text x="640" y="185" text-anchor="middle" fill="rgba(232,224,208,0.4)" font-size="10" font-family="monospace">Lagos Trader</text>
  <text x="610" y="108" fill="#EF5350" font-size="18" font-family="sans-serif" font-weight="bold">?</text>

  <!-- Trader 3: Center bottom -->
  <circle cx="400" cy="330" r="60" fill="none" stroke="#1a1a1a" stroke-width="2"/>
  <circle cx="400" cy="315" r="14" fill="none" stroke="#C9A84C" stroke-width="1.5"/>
  <line x1="400" y1="330" x2="400" y2="360" stroke="#C9A84C" stroke-width="1.5"/>
  <line x1="385" y1="345" x2="415" y2="345" stroke="#C9A84C" stroke-width="1.5"/>
  <text x="400" y="390" text-anchor="middle" fill="rgba(232,224,208,0.4)" font-size="10" font-family="monospace">Enugu Trader</text>
  <text x="370" y="308" fill="#EF5350" font-size="18" font-family="sans-serif" font-weight="bold">?</text>

  <!-- Trader 4: Left bottom -->
  <circle cx="100" cy="330" r="60" fill="none" stroke="#1a1a1a" stroke-width="2"/>
  <circle cx="100" cy="315" r="14" fill="none" stroke="#C9A84C" stroke-width="1.5"/>
  <line x1="100" y1="330" x2="100" y2="360" stroke="#C9A84C" stroke-width="1.5"/>
  <line x1="85" y1="345" x2="115" y2="345" stroke="#C9A84C" stroke-width="1.5"/>
  <text x="100" y="390" text-anchor="middle" fill="rgba(232,224,208,0.4)" font-size="10" font-family="monospace">Calabar Trader</text>
  <text x="70" y="308" fill="#EF5350" font-size="18" font-family="sans-serif" font-weight="bold">?</text>

  <!-- Trader 5: Right bottom -->
  <circle cx="700" cy="330" r="60" fill="none" stroke="#1a1a1a" stroke-width="2"/>
  <circle cx="700" cy="315" r="14" fill="none" stroke="#C9A84C" stroke-width="1.5"/>
  <line x1="700" y1="330" x2="700" y2="360" stroke="#C9A84C" stroke-width="1.5"/>
  <line x1="685" y1="345" x2="715" y2="345" stroke="#C9A84C" stroke-width="1.5"/>
  <text x="700" y="390" text-anchor="middle" fill="rgba(232,224,208,0.4)" font-size="10" font-family="monospace">Onitsha Trader</text>
  <text x="670" y="308" fill="#EF5350" font-size="18" font-family="sans-serif" font-weight="bold">?</text>

  <!-- Broken connections -->
  <!-- Phone call line: dashed, with X -->
  <line x1="210" y1="150" x2="590" y2="150" stroke="#EF5350" stroke-width="1" stroke-dasharray="8,6" opacity="0.4"/>
  <text x="400" y="145" text-anchor="middle" fill="#EF5350" font-size="14" font-weight="bold">X</text>
  <text x="400" y="160" text-anchor="middle" fill="rgba(232,224,208,0.25)" font-size="9" font-family="monospace">phone calls (expensive, slow)</text>

  <!-- WhatsApp line with spam icon -->
  <line x1="150" y1="195" x2="370" y2="285" stroke="#4CAF50" stroke-width="1" stroke-dasharray="4,8" opacity="0.3"/>
  <text x="245" y="230" text-anchor="middle" fill="#FFA726" font-size="10" font-family="monospace">SPAM</text>

  <!-- Road line with X -->
  <line x1="660" y1="195" x2="430" y2="285" stroke="#FFA726" stroke-width="1" stroke-dasharray="6,6" opacity="0.3"/>
  <text x="555" y="230" text-anchor="middle" fill="#EF5350" font-size="14" font-weight="bold">X</text>
  <text x="555" y="245" text-anchor="middle" fill="rgba(232,224,208,0.25)" font-size="9" font-family="monospace">travel (costly, slow)</text>

  <!-- The invisible price in the center -->
  <rect x="340" y="195" width="120" height="50" rx="6" fill="none" stroke="rgba(232,224,208,0.15)" stroke-width="1" stroke-dasharray="4,4"/>
  <text x="400" y="216" text-anchor="middle" fill="rgba(232,224,208,0.2)" font-size="11" font-family="monospace">RICE PRICE</text>
  <text x="400" y="234" text-anchor="middle" fill="rgba(232,224,208,0.12)" font-size="16" font-family="monospace">???</text>
</svg>

Consider the four methods a trader uses today:

| Method | Cost | Speed | Reliability |
|--------|------|-------|-------------|
| **Phone calls** | Airtime + social capital | 10-30 min for 5 contacts | 40% pick up, stale info |
| **WhatsApp groups** | Free | Instant but buried | Noise, spam, no structure |
| **Physical travel** | Transport + time | Half a day minimum | Sees one market only |
| **Guessing** | Free | Instant | Zero reliability |

Nigeria's informal trade is **65% of GDP**. That is approximately **$250 billion** flowing through markets where the most basic commercial data — the price — is invisible.

The information asymmetry is not a bug. It is the defining feature. **Whoever has the phone numbers wins.** Everyone else overpays, undersells, or simply doesn't trade.

This is the problem oTrade exists to solve.

---

### Letter 2: On the Price Board

> *"If I could just open my phone and see: rice is eighty-two in Onitsha, eighty-five in Calabar, seventy-eight in Mile 12 — I would save fifty thousand naira a week."* — A wholesale buyer, Aba

The core of oTrade is the **Price Board** — a single screen that shows the latest prices for your commodities at your markets. No feeds. No timelines. No social features. Just prices.

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 620" style="width:100%;max-width:380px;display:block;margin:2em auto;">
  <defs>
    <clipPath id="phoneClip"><rect x="20" y="20" width="340" height="580" rx="30"/></clipPath>
    <linearGradient id="headerGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#1B5E20"/><stop offset="100%" stop-color="#111111"/></linearGradient>
  </defs>

  <!-- Phone body -->
  <rect width="380" height="620" rx="36" fill="#1a1a1a" stroke="#333" stroke-width="2"/>
  <rect x="20" y="20" width="340" height="580" rx="28" fill="#111111"/>

  <!-- Status bar -->
  <text x="40" y="52" fill="rgba(232,224,208,0.5)" font-size="11" font-family="monospace">9:41</text>
  <circle cx="310" cy="48" r="4" fill="#4CAF50"/>
  <rect x="322" y="44" width="20" height="8" rx="2" fill="rgba(232,224,208,0.3)"/>

  <!-- Header -->
  <rect x="20" y="62" width="340" height="60" fill="url(#headerGrad)"/>
  <text x="190" y="88" text-anchor="middle" fill="#C9A84C" font-size="15" font-weight="bold" font-family="sans-serif">oTrade</text>
  <text x="190" y="108" text-anchor="middle" fill="rgba(232,224,208,0.6)" font-size="11" font-family="sans-serif">Watt Market, Calabar</text>

  <!-- Search bar -->
  <rect x="40" y="134" width="300" height="36" rx="18" fill="#1a1a1a" stroke="rgba(232,224,208,0.1)" stroke-width="1"/>
  <text x="60" y="157" fill="rgba(232,224,208,0.3)" font-size="12" font-family="sans-serif">Search commodities...</text>

  <!-- Price rows -->
  <!-- Row 1: Rice - Rising -->
  <rect x="30" y="184" width="320" height="64" rx="8" fill="#1a1a1a"/>
  <circle cx="56" cy="216" r="16" fill="#2E7D32" opacity="0.3"/>
  <text x="56" y="221" text-anchor="middle" fill="#4CAF50" font-size="14">R</text>
  <text x="82" y="208" fill="#E8E0D0" font-size="14" font-weight="bold" font-family="sans-serif">Local Rice</text>
  <text x="82" y="228" fill="rgba(232,224,208,0.4)" font-size="11" font-family="sans-serif">50kg bag  ·  Grade A</text>
  <text x="330" y="208" text-anchor="end" fill="#E8E0D0" font-size="16" font-weight="bold" font-family="monospace">₦85,000</text>
  <text x="330" y="228" text-anchor="end" fill="#4CAF50" font-size="12" font-family="sans-serif">▲ 2.4%</text>

  <!-- Row 2: Cement - Stable -->
  <rect x="30" y="258" width="320" height="64" rx="8" fill="#1a1a1a"/>
  <circle cx="56" cy="290" r="16" fill="#2E7D32" opacity="0.3"/>
  <text x="56" y="295" text-anchor="middle" fill="#4CAF50" font-size="14">C</text>
  <text x="82" y="282" fill="#E8E0D0" font-size="14" font-weight="bold" font-family="sans-serif">Cement (Dangote)</text>
  <text x="82" y="302" fill="rgba(232,224,208,0.4)" font-size="11" font-family="sans-serif">50kg bag</text>
  <text x="330" y="282" text-anchor="end" fill="#E8E0D0" font-size="16" font-weight="bold" font-family="monospace">₦7,500</text>
  <text x="330" y="302" text-anchor="end" fill="#FFA726" font-size="12" font-family="sans-serif">→ 0.0%</text>

  <!-- Row 3: Garri - Falling -->
  <rect x="30" y="332" width="320" height="64" rx="8" fill="#1a1a1a"/>
  <circle cx="56" cy="364" r="16" fill="#2E7D32" opacity="0.3"/>
  <text x="56" y="369" text-anchor="middle" fill="#4CAF50" font-size="14">G</text>
  <text x="82" y="356" fill="#E8E0D0" font-size="14" font-weight="bold" font-family="sans-serif">White Garri</text>
  <text x="82" y="376" fill="rgba(232,224,208,0.4)" font-size="11" font-family="sans-serif">50kg bag  ·  Ijebu</text>
  <text x="330" y="356" text-anchor="end" fill="#E8E0D0" font-size="16" font-weight="bold" font-family="monospace">₦45,000</text>
  <text x="330" y="376" text-anchor="end" fill="#EF5350" font-size="12" font-family="sans-serif">▼ 1.8%</text>

  <!-- Row 4: Palm Oil - Rising -->
  <rect x="30" y="406" width="320" height="64" rx="8" fill="#1a1a1a"/>
  <circle cx="56" cy="438" r="16" fill="#2E7D32" opacity="0.3"/>
  <text x="56" y="443" text-anchor="middle" fill="#4CAF50" font-size="14">P</text>
  <text x="82" y="430" fill="#E8E0D0" font-size="14" font-weight="bold" font-family="sans-serif">Palm Oil</text>
  <text x="82" y="450" fill="rgba(232,224,208,0.4)" font-size="11" font-family="sans-serif">25L jerrycan  ·  Refined</text>
  <text x="330" y="430" text-anchor="end" fill="#E8E0D0" font-size="16" font-weight="bold" font-family="monospace">₦38,000</text>
  <text x="330" y="450" text-anchor="end" fill="#4CAF50" font-size="12" font-family="sans-serif">▲ 5.1%</text>

  <!-- Row 5: Beans -->
  <rect x="30" y="480" width="320" height="64" rx="8" fill="#1a1a1a"/>
  <circle cx="56" cy="512" r="16" fill="#2E7D32" opacity="0.3"/>
  <text x="56" y="517" text-anchor="middle" fill="#4CAF50" font-size="14">B</text>
  <text x="82" y="504" fill="#E8E0D0" font-size="14" font-weight="bold" font-family="sans-serif">Brown Beans</text>
  <text x="82" y="524" fill="rgba(232,224,208,0.4)" font-size="11" font-family="sans-serif">100kg bag  ·  Clean</text>
  <text x="330" y="504" text-anchor="end" fill="#E8E0D0" font-size="16" font-weight="bold" font-family="monospace">₦120,000</text>
  <text x="330" y="524" text-anchor="end" fill="#4CAF50" font-size="12" font-family="sans-serif">▲ 0.8%</text>

  <!-- Bottom nav -->
  <rect x="20" y="556" width="340" height="44" fill="#0a0a0a"/>
  <text x="80" y="583" text-anchor="middle" fill="#4CAF50" font-size="10" font-weight="bold" font-family="sans-serif">PRICES</text>
  <text x="160" y="583" text-anchor="middle" fill="rgba(232,224,208,0.4)" font-size="10" font-family="sans-serif">POST</text>
  <text x="240" y="583" text-anchor="middle" fill="rgba(232,224,208,0.4)" font-size="10" font-family="sans-serif">ALERTS</text>
  <text x="320" y="583" text-anchor="middle" fill="rgba(232,224,208,0.4)" font-size="10" font-family="sans-serif">PROFILE</text>
  <rect x="55" y="568" width="50" height="2" rx="1" fill="#4CAF50"/>
</svg>

The Price Board answers exactly one question: **What does this cost, right now, at this market?**

Every price shows:
- **Commodity name** and grade
- **Price in Naira** (always Naira, always per standard trading unit)
- **Trend indicator** — rising (green), falling (red), or stable (amber)
- **Last updated** timestamp
- **Reporter count** — how many traders confirmed this price

The design principle is **3-second value**. A trader opens oTrade, sees their market, sees the prices, closes the app. Done. No scrolling through feeds, no clicking through menus.

You pick your markets during onboarding. You pick your commodities. From that moment on, the app opens to exactly what you care about. Local Rice at Watt Market. Cement at Ariaria. Garri across all southeastern markets.

**25 commodities** across **6 categories**: grains, tubers, oils, vegetables, building materials, and consumer goods. Every item a Nigerian trader actually buys and sells, with local names in Hausa, Igbo, and Yoruba.

The Price Board is not a social network. It is not a marketplace. It is a **price signal**, pure and clean.

---

### Letter 3: On Posting a Price in 10 Seconds

> *"If posting a price took longer than sending a WhatsApp, nobody would do it. But if it's faster? If I can post while sitting in the market drinking zobo? Then yes."* — A garri seller, Abakiliki

The entire value of oTrade depends on one thing: **traders posting prices**. If posting is hard, nobody posts. If nobody posts, there are no prices. If there are no prices, there is no app.

So posting must be faster than a WhatsApp message.

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 300" style="width:100%;max-width:800px;display:block;margin:2em auto;">
  <rect width="800" height="300" rx="12" fill="#0a0a0a"/>

  <!-- Step 1: Pick Commodity -->
  <rect x="30" y="40" width="160" height="220" rx="20" fill="#111111" stroke="#333" stroke-width="1"/>
  <rect x="40" y="55" width="140" height="24" rx="4" fill="#1a1a1a"/>
  <text x="110" y="72" text-anchor="middle" fill="rgba(232,224,208,0.5)" font-size="10" font-family="sans-serif">Pick Commodity</text>
  <!-- Options -->
  <rect x="45" y="90" width="130" height="30" rx="6" fill="#2E7D32" opacity="0.8"/>
  <text x="110" y="110" text-anchor="middle" fill="#E8E0D0" font-size="12" font-weight="bold" font-family="sans-serif">Local Rice</text>
  <rect x="45" y="126" width="130" height="30" rx="6" fill="#1a1a1a"/>
  <text x="110" y="146" text-anchor="middle" fill="rgba(232,224,208,0.5)" font-size="12" font-family="sans-serif">Cement</text>
  <rect x="45" y="162" width="130" height="30" rx="6" fill="#1a1a1a"/>
  <text x="110" y="182" text-anchor="middle" fill="rgba(232,224,208,0.5)" font-size="12" font-family="sans-serif">White Garri</text>
  <rect x="45" y="198" width="130" height="30" rx="6" fill="#1a1a1a"/>
  <text x="110" y="218" text-anchor="middle" fill="rgba(232,224,208,0.5)" font-size="12" font-family="sans-serif">Palm Oil</text>
  <text x="110" y="250" text-anchor="middle" fill="rgba(232,224,208,0.3)" font-size="9" font-family="monospace">STEP 1</text>

  <!-- Arrow 1 -->
  <line x1="200" y1="150" x2="240" y2="150" stroke="#C9A84C" stroke-width="2"/>
  <polygon points="240,145 250,150 240,155" fill="#C9A84C"/>

  <!-- Step 2: Pick Market -->
  <rect x="260" y="40" width="160" height="220" rx="20" fill="#111111" stroke="#333" stroke-width="1"/>
  <rect x="270" y="55" width="140" height="24" rx="4" fill="#1a1a1a"/>
  <text x="340" y="72" text-anchor="middle" fill="rgba(232,224,208,0.5)" font-size="10" font-family="sans-serif">Pick Market</text>
  <rect x="275" y="90" width="130" height="30" rx="6" fill="#2E7D32" opacity="0.8"/>
  <text x="340" y="110" text-anchor="middle" fill="#E8E0D0" font-size="12" font-weight="bold" font-family="sans-serif">Watt Market</text>
  <rect x="275" y="126" width="130" height="30" rx="6" fill="#1a1a1a"/>
  <text x="340" y="146" text-anchor="middle" fill="rgba(232,224,208,0.5)" font-size="12" font-family="sans-serif">Marian Market</text>
  <rect x="275" y="162" width="130" height="30" rx="6" fill="#1a1a1a"/>
  <text x="340" y="182" text-anchor="middle" fill="rgba(232,224,208,0.5)" font-size="12" font-family="sans-serif">Ariaria Market</text>
  <text x="340" y="250" text-anchor="middle" fill="rgba(232,224,208,0.3)" font-size="9" font-family="monospace">STEP 2</text>

  <!-- Arrow 2 -->
  <line x1="430" y1="150" x2="470" y2="150" stroke="#C9A84C" stroke-width="2"/>
  <polygon points="470,145 480,150 470,155" fill="#C9A84C"/>

  <!-- Step 3: Enter Price -->
  <rect x="490" y="40" width="160" height="220" rx="20" fill="#111111" stroke="#333" stroke-width="1"/>
  <rect x="500" y="55" width="140" height="24" rx="4" fill="#1a1a1a"/>
  <text x="570" y="72" text-anchor="middle" fill="rgba(232,224,208,0.5)" font-size="10" font-family="sans-serif">Enter Price</text>
  <text x="570" y="110" text-anchor="middle" fill="rgba(232,224,208,0.3)" font-size="12" font-family="sans-serif">Local Rice — Watt Market</text>
  <rect x="510" y="125" width="120" height="45" rx="8" fill="#1a1a1a" stroke="#C9A84C" stroke-width="1.5"/>
  <text x="525" y="153" fill="rgba(232,224,208,0.3)" font-size="14" font-family="sans-serif">₦</text>
  <text x="545" y="153" fill="#E8E0D0" font-size="18" font-weight="bold" font-family="monospace">85,000</text>
  <text x="570" y="192" text-anchor="middle" fill="rgba(232,224,208,0.4)" font-size="11" font-family="sans-serif">per 50kg bag</text>
  <text x="570" y="250" text-anchor="middle" fill="rgba(232,224,208,0.3)" font-size="9" font-family="monospace">STEP 3</text>

  <!-- Arrow 3 -->
  <line x1="660" y1="150" x2="700" y2="150" stroke="#C9A84C" stroke-width="2"/>
  <polygon points="700,145 710,150 700,155" fill="#C9A84C"/>

  <!-- Checkmark -->
  <circle cx="745" cy="150" r="30" fill="#2E7D32"/>
  <polyline points="730,150 740,162 762,138" fill="none" stroke="#E8E0D0" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="745" y="200" text-anchor="middle" fill="#C9A84C" font-size="11" font-weight="bold" font-family="sans-serif">POSTED</text>

  <!-- Timer -->
  <rect x="340" y="272" width="120" height="22" rx="11" fill="#1a1a1a" stroke="#C9A84C" stroke-width="1"/>
  <text x="400" y="287" text-anchor="middle" fill="#C9A84C" font-size="11" font-weight="bold" font-family="monospace">10 SECONDS</text>
</svg>

Three taps and a number. That is the entire flow:

1. **Pick your commodity** — the list remembers your recent picks, so regulars see their items first
2. **Pick your market** — defaults to your primary market (set during onboarding)
3. **Type the price** — a clean number pad, Naira symbol pre-filled, unit displayed

Then you see the confirmation: your price, the current 7-day average, and how your report compares.

**The design insight**: We don't ask for grades, quantities, or photos on first post. Just the price. Friction kills contribution. Grades and details are optional taps after submission. The 80/20 rule: 80% of the value comes from the price alone.

**Authentication**: Phone number via SMS OTP. No email. No password. No account creation form. The trader's phone number IS their identity — same as in every market transaction today.

**Incentive**: Every posted price earns a **reputation score**. Traders with high reputation (consistent, accurate, frequent) get a verified badge. Future premium features will be free for top contributors. The market rewards the generous.

If the app works offline, prices queue locally and sync when connectivity returns. A trader in Abakpa market with spotty MTN signal can post all morning and everything uploads when they hit a stable connection.

---

### Letter 4: On the WhatsApp Bridge

> *"I don't want another app. I have WhatsApp. Everyone has WhatsApp. If I can send prices on WhatsApp, I will do it every day."* — A cement dealer, Onitsha

Nigeria has **60 million WhatsApp users**. Many traders — especially the older generation, the market women, the wholesalers who move the real volume — will not download a new app. They shouldn't have to.

The **WhatsApp Bridge** turns WhatsApp into an oTrade terminal.

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 340" style="width:100%;max-width:800px;display:block;margin:2em auto;">
  <rect width="800" height="340" rx="12" fill="#0a0a0a"/>

  <!-- Left panel: WhatsApp -->
  <rect x="30" y="30" width="340" height="280" rx="16" fill="#0b141a"/>
  <rect x="30" y="30" width="340" height="50" rx="16" fill="#1f2c34"/>
  <rect x="30" y="64" width="340" height="0" fill="#1f2c34"/>
  <text x="200" y="62" text-anchor="middle" fill="#E8E0D0" font-size="14" font-weight="bold" font-family="sans-serif">oTrade Bot</text>
  <circle cx="60" cy="55" r="15" fill="#2E7D32"/>
  <text x="60" y="60" text-anchor="middle" fill="#E8E0D0" font-size="12" font-weight="bold">oT</text>

  <!-- User message bubble -->
  <rect x="130" y="100" width="220" height="50" rx="10" fill="#005c4b"/>
  <text x="145" y="120" fill="#E8E0D0" font-size="14" font-weight="bold" font-family="monospace">PRICE rice 85000 watt</text>
  <text x="335" y="140" text-anchor="end" fill="rgba(232,224,208,0.4)" font-size="9" font-family="sans-serif">9:41 AM ✓✓</text>

  <!-- Bot response bubble -->
  <rect x="50" y="165" width="280" height="90" rx="10" fill="#1f2c34"/>
  <text x="65" y="185" fill="#4CAF50" font-size="13" font-weight="bold" font-family="sans-serif">✓ Recorded</text>
  <text x="65" y="205" fill="#E8E0D0" font-size="12" font-family="sans-serif">Local Rice — ₦85,000/bag</text>
  <text x="65" y="222" fill="#E8E0D0" font-size="12" font-family="sans-serif">Watt Market, Calabar</text>
  <text x="65" y="245" fill="rgba(232,224,208,0.5)" font-size="11" font-family="sans-serif">Avg (7d): ₦83,500 · 12 reports</text>

  <!-- Center divider / bridge -->
  <rect x="385" y="100" width="30" height="140" rx="4" fill="#111111"/>
  <line x1="400" y1="115" x2="400" y2="225" stroke="#C9A84C" stroke-width="2" stroke-dasharray="4,6"/>
  <circle cx="400" cy="170" r="12" fill="#C9A84C"/>
  <text x="400" y="175" text-anchor="middle" fill="#0a0a0a" font-size="12" font-weight="bold">⚡</text>

  <!-- Right panel: oTrade system -->
  <rect x="430" y="30" width="340" height="280" rx="16" fill="#111111"/>
  <rect x="430" y="30" width="340" height="50" rx="16" fill="#1B5E20"/>
  <text x="600" y="62" text-anchor="middle" fill="#C9A84C" font-size="14" font-weight="bold" font-family="sans-serif">oTrade Intelligence</text>

  <!-- Parsed data -->
  <rect x="450" y="95" width="300" height="30" rx="6" fill="#1a1a1a"/>
  <text x="460" y="115" fill="rgba(232,224,208,0.4)" font-size="10" font-family="monospace">commodity:</text>
  <text x="545" y="115" fill="#4CAF50" font-size="10" font-weight="bold" font-family="monospace">rice-local</text>

  <rect x="450" y="132" width="300" height="30" rx="6" fill="#1a1a1a"/>
  <text x="460" y="152" fill="rgba(232,224,208,0.4)" font-size="10" font-family="monospace">market:</text>
  <text x="525" y="152" fill="#4CAF50" font-size="10" font-weight="bold" font-family="monospace">watt-calabar</text>

  <rect x="450" y="169" width="300" height="30" rx="6" fill="#1a1a1a"/>
  <text x="460" y="189" fill="rgba(232,224,208,0.4)" font-size="10" font-family="monospace">price_ngn:</text>
  <text x="545" y="189" fill="#C9A84C" font-size="10" font-weight="bold" font-family="monospace">85,000</text>

  <rect x="450" y="206" width="300" height="30" rx="6" fill="#1a1a1a"/>
  <text x="460" y="226" fill="rgba(232,224,208,0.4)" font-size="10" font-family="monospace">source:</text>
  <text x="520" y="226" fill="#4CAF50" font-size="10" font-weight="bold" font-family="monospace">whatsapp</text>

  <rect x="450" y="243" width="300" height="30" rx="6" fill="#1a1a1a"/>
  <text x="460" y="263" fill="rgba(232,224,208,0.4)" font-size="10" font-family="monospace">status:</text>
  <text x="520" y="263" fill="#4CAF50" font-size="10" font-weight="bold" font-family="monospace">✓ scroll written</text>

  <!-- Labels -->
  <text x="200" y="325" text-anchor="middle" fill="rgba(232,224,208,0.3)" font-size="10" font-family="monospace">WHATSAPP</text>
  <text x="600" y="325" text-anchor="middle" fill="rgba(232,224,208,0.3)" font-size="10" font-family="monospace">oTRADE BACKEND</text>
</svg>

The commands are deliberately simple — no app to learn, no interface to navigate:

**Post a price:**
```
PRICE rice 85000 watt
```

**Set an alert:**
```
ALERT rice below 80000 watt
```

**Check prices:**
```
PRICES rice
```

The bot uses **fuzzy matching**. "rice" matches "Local Rice." "watt" matches "Watt Market, Calabar." "cement" matches "Cement (Dangote)." Traders don't need to remember exact names.

The response is immediate and informative — not just a confirmation, but context. The trader sees their price, the 7-day average, and how many others have reported. This creates a feedback loop: post a price, learn the market, post better prices.

**Why WhatsApp matters**: The WhatsApp Business API is already wired into the existing Obiverse backend. This is not a new integration — it is an extension. The infrastructure exists. The bot is an afternoon of work, not a quarter of engineering.

The WhatsApp Bridge means oTrade's addressable market is not "people who download our app." It is **everyone with WhatsApp** — 60 million Nigerians.

A market woman in Ogbete who has never installed an app in her life can text "PRICE tomato 12000 ogbete" and become a contributor to the most valuable commercial dataset on the continent.

---

### Letter 5: On the Intelligence Layer

> *"Prices are useful. Trends are valuable. Alerts are money in my pocket."* — A palm oil wholesaler, Aba

Raw prices are step one. The real power emerges when prices become **intelligence** — patterns, comparisons, and triggers that help traders make better decisions automatically.

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 480" style="width:100%;max-width:800px;display:block;margin:2em auto;">
  <defs>
    <linearGradient id="chartLine" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#2E7D32"/><stop offset="100%" stop-color="#4CAF50"/></linearGradient>
    <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#4CAF50" stop-opacity="0.3"/><stop offset="100%" stop-color="#4CAF50" stop-opacity="0"/></linearGradient>
  </defs>
  <rect width="800" height="480" rx="12" fill="#0a0a0a"/>

  <!-- SECTION 1: Price Chart -->
  <text x="40" y="30" fill="#C9A84C" font-size="12" font-weight="bold" font-family="sans-serif">LOCAL RICE — WATT MARKET, CALABAR</text>
  <text x="760" y="30" text-anchor="end" fill="rgba(232,224,208,0.4)" font-size="11" font-family="sans-serif">Last 7 days</text>

  <!-- Y axis labels -->
  <text x="35" y="68" text-anchor="end" fill="rgba(232,224,208,0.3)" font-size="9" font-family="monospace">₦88K</text>
  <text x="35" y="118" text-anchor="end" fill="rgba(232,224,208,0.3)" font-size="9" font-family="monospace">₦85K</text>
  <text x="35" y="168" text-anchor="end" fill="rgba(232,224,208,0.3)" font-size="9" font-family="monospace">₦82K</text>
  <text x="35" y="218" text-anchor="end" fill="rgba(232,224,208,0.3)" font-size="9" font-family="monospace">₦79K</text>

  <!-- Grid lines -->
  <line x1="50" y1="65" x2="760" y2="65" stroke="rgba(232,224,208,0.06)" stroke-width="1"/>
  <line x1="50" y1="115" x2="760" y2="115" stroke="rgba(232,224,208,0.06)" stroke-width="1"/>
  <line x1="50" y1="165" x2="760" y2="165" stroke="rgba(232,224,208,0.06)" stroke-width="1"/>
  <line x1="50" y1="215" x2="760" y2="215" stroke="rgba(232,224,208,0.06)" stroke-width="1"/>

  <!-- X axis labels -->
  <text x="100" y="240" text-anchor="middle" fill="rgba(232,224,208,0.3)" font-size="9" font-family="monospace">Mon</text>
  <text x="210" y="240" text-anchor="middle" fill="rgba(232,224,208,0.3)" font-size="9" font-family="monospace">Tue</text>
  <text x="320" y="240" text-anchor="middle" fill="rgba(232,224,208,0.3)" font-size="9" font-family="monospace">Wed</text>
  <text x="430" y="240" text-anchor="middle" fill="rgba(232,224,208,0.3)" font-size="9" font-family="monospace">Thu</text>
  <text x="540" y="240" text-anchor="middle" fill="rgba(232,224,208,0.3)" font-size="9" font-family="monospace">Fri</text>
  <text x="650" y="240" text-anchor="middle" fill="rgba(232,224,208,0.3)" font-size="9" font-family="monospace">Sat</text>
  <text x="740" y="240" text-anchor="middle" fill="rgba(232,224,208,0.3)" font-size="9" font-family="monospace">Sun</text>

  <!-- Price line (rising trend: 80K Mon → 85K Sun) -->
  <!-- Y scale: 88K=65, 79K=215, range=150px for 9K, ~16.67px per K -->
  <!-- 80K=198, 79.5K=206, 81K=182, 80.5K=190, 82K=165, 83.5K=140, 85K=115 -->
  <polygon points="100,198 210,182 320,190 430,165 540,148 650,132 740,115 740,215 100,215" fill="url(#chartFill)"/>
  <polyline points="100,198 210,182 320,190 430,165 540,148 650,132 740,115" fill="none" stroke="url(#chartLine)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Data points -->
  <circle cx="100" cy="198" r="4" fill="#4CAF50"/>
  <circle cx="210" cy="182" r="4" fill="#4CAF50"/>
  <circle cx="320" cy="190" r="4" fill="#4CAF50"/>
  <circle cx="430" cy="165" r="4" fill="#4CAF50"/>
  <circle cx="540" cy="148" r="4" fill="#4CAF50"/>
  <circle cx="650" cy="132" r="4" fill="#4CAF50"/>
  <circle cx="740" cy="115" r="5" fill="#C9A84C" stroke="#0a0a0a" stroke-width="2"/>
  <text x="740" y="105" text-anchor="middle" fill="#C9A84C" font-size="10" font-weight="bold" font-family="monospace">₦85K</text>

  <!-- SECTION 2: Market Comparison -->
  <text x="40" y="280" fill="#C9A84C" font-size="12" font-weight="bold" font-family="sans-serif">CROSS-MARKET COMPARISON</text>

  <!-- Bar 1: Watt Market -->
  <text x="160" y="308" text-anchor="end" fill="rgba(232,224,208,0.6)" font-size="11" font-family="sans-serif">Watt, Calabar</text>
  <rect x="170" y="296" width="408" height="18" rx="3" fill="#2E7D32"/>
  <text x="585" y="310" fill="#E8E0D0" font-size="11" font-weight="bold" font-family="monospace">₦85,000</text>

  <!-- Bar 2: Ariaria -->
  <text x="160" y="336" text-anchor="end" fill="rgba(232,224,208,0.6)" font-size="11" font-family="sans-serif">Ariaria, Aba</text>
  <rect x="170" y="324" width="396" height="18" rx="3" fill="#2E7D32" opacity="0.8"/>
  <text x="573" y="338" fill="#E8E0D0" font-size="11" font-weight="bold" font-family="monospace">₦84,500</text>

  <!-- Bar 3: Onitsha -->
  <text x="160" y="364" text-anchor="end" fill="rgba(232,224,208,0.6)" font-size="11" font-family="sans-serif">Onitsha Main</text>
  <rect x="170" y="352" width="372" height="18" rx="3" fill="#2E7D32" opacity="0.6"/>
  <text x="549" y="366" fill="#E8E0D0" font-size="11" font-weight="bold" font-family="monospace">₦82,000</text>

  <!-- Bar 4: Mile 12 -->
  <text x="160" y="392" text-anchor="end" fill="rgba(232,224,208,0.6)" font-size="11" font-family="sans-serif">Mile 12, Lagos</text>
  <rect x="170" y="380" width="336" height="18" rx="3" fill="#4CAF50" opacity="0.7"/>
  <text x="513" y="394" fill="#E8E0D0" font-size="11" font-weight="bold" font-family="monospace">₦78,000</text>

  <!-- SECTION 3: Alert -->
  <rect x="40" y="420" width="720" height="44" rx="8" fill="#1a1a1a" stroke="#C9A84C" stroke-width="1" stroke-dasharray="4,4"/>
  <text x="70" y="447" fill="#C9A84C" font-size="18">🔔</text>
  <text x="95" y="440" fill="rgba(232,224,208,0.6)" font-size="11" font-family="sans-serif">ALERT ACTIVE:</text>
  <text x="200" y="440" fill="#E8E0D0" font-size="11" font-family="sans-serif">Local Rice below</text>
  <text x="300" y="440" fill="#4CAF50" font-size="11" font-weight="bold" font-family="monospace">₦80,000</text>
  <text x="365" y="440" fill="rgba(232,224,208,0.6)" font-size="11" font-family="sans-serif">at any market</text>
  <text x="480" y="440" fill="rgba(232,224,208,0.4)" font-size="11" font-family="sans-serif">→ WhatsApp notification</text>
  <text x="95" y="456" fill="rgba(232,224,208,0.3)" font-size="9" font-family="monospace">Nearest match: Mile 12 at ₦78,000 (TRIGGERED)</text>
</svg>

The intelligence layer has three components:

**1. Price History**
Every commodity at every market accumulates a history. A 7-day chart shows whether prices are rising, falling, or stable. A 30-day view reveals seasonal patterns. The computed index for each commodity-market pair stores: latest price, 7-day average, 7-day min/max, observation count, reporter count, and trend direction.

**2. Cross-Market Comparison**
The single most valuable feature. A trader looking at Local Rice sees the price at every market with data. The difference between ₦78,000 at Mile 12 and ₦85,000 at Watt Market is ₦7,000 per bag. On a truckload of 200 bags, that is **₦1.4 million** in arbitrage potential.

This is information that was invisible yesterday. Today it is a bar chart on your phone.

**3. Price Alerts**
A trader sets a threshold: "Tell me when Local Rice drops below ₦80,000 at any market." The alert engine runs on every new price submission. When the threshold is crossed, a WhatsApp message fires instantly. The trader does not need to check the app. The market comes to them.

Alert conditions:
- **Below threshold** — "I want to buy when it's cheap"
- **Above threshold** — "I want to sell when the price spikes"
- **Any market** or a specific market
- **Delivery via WhatsApp** (primary) or push notification

The intelligence layer transforms oTrade from a reference tool into a **decision engine**. Prices are data. Trends are information. Alerts are action.

---

### Letter 6: On the Architecture

> *"I don't care how it works. But the person building it should care deeply."* — A software engineer, Lagos

oTrade is built on infrastructure that already exists. This is not a greenfield project — it is an extension of the Obiverse platform, adding trade intelligence to a proven stack.

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 440" style="width:100%;max-width:800px;display:block;margin:2em auto;">
  <defs>
    <linearGradient id="rustGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#2E7D32"/><stop offset="100%" stop-color="#1B5E20"/></linearGradient>
  </defs>
  <rect width="800" height="440" rx="12" fill="#0a0a0a"/>
  <text x="400" y="28" text-anchor="middle" fill="rgba(232,224,208,0.3)" font-size="11" font-family="monospace">OTRADE SYSTEM ARCHITECTURE</text>

  <!-- CLIENT LAYER -->
  <text x="40" y="60" fill="rgba(232,224,208,0.3)" font-size="9" font-family="monospace">CLIENTS</text>

  <!-- Flutter App -->
  <rect x="60" y="72" width="200" height="70" rx="10" fill="#111111" stroke="#4CAF50" stroke-width="1.5"/>
  <text x="160" y="98" text-anchor="middle" fill="#4CAF50" font-size="14" font-weight="bold" font-family="sans-serif">Flutter App</text>
  <text x="160" y="118" text-anchor="middle" fill="rgba(232,224,208,0.4)" font-size="10" font-family="sans-serif">iOS + Android</text>
  <text x="160" y="132" text-anchor="middle" fill="rgba(232,224,208,0.25)" font-size="9" font-family="monospace">SQLite offline cache</text>

  <!-- WhatsApp Bot -->
  <rect x="300" y="72" width="200" height="70" rx="10" fill="#111111" stroke="#4CAF50" stroke-width="1.5"/>
  <text x="400" y="98" text-anchor="middle" fill="#4CAF50" font-size="14" font-weight="bold" font-family="sans-serif">WhatsApp Bot</text>
  <text x="400" y="118" text-anchor="middle" fill="rgba(232,224,208,0.4)" font-size="10" font-family="sans-serif">Business API</text>
  <text x="400" y="132" text-anchor="middle" fill="rgba(232,224,208,0.25)" font-size="9" font-family="monospace">PRICE / ALERT / PRICES</text>

  <!-- Web (Future) -->
  <rect x="540" y="72" width="200" height="70" rx="10" fill="#111111" stroke="rgba(232,224,208,0.15)" stroke-width="1" stroke-dasharray="4,4"/>
  <text x="640" y="98" text-anchor="middle" fill="rgba(232,224,208,0.25)" font-size="14" font-family="sans-serif">Web Dashboard</text>
  <text x="640" y="118" text-anchor="middle" fill="rgba(232,224,208,0.2)" font-size="10" font-family="sans-serif">Future</text>

  <!-- Arrows down from clients -->
  <line x1="160" y1="142" x2="160" y2="180" stroke="#4CAF50" stroke-width="1.5"/>
  <polygon points="155,178 160,188 165,178" fill="#4CAF50"/>
  <line x1="400" y1="142" x2="400" y2="180" stroke="#4CAF50" stroke-width="1.5"/>
  <polygon points="395,178 400,188 405,178" fill="#4CAF50"/>
  <line x1="640" y1="142" x2="640" y2="180" stroke="rgba(232,224,208,0.15)" stroke-width="1" stroke-dasharray="4,4"/>

  <!-- API LAYER -->
  <text x="40" y="200" fill="rgba(232,224,208,0.3)" font-size="9" font-family="monospace">RUST API</text>
  <rect x="60" y="190" width="680" height="100" rx="10" fill="url(#rustGrad)" opacity="0.9"/>
  <text x="400" y="215" text-anchor="middle" fill="#C9A84C" font-size="16" font-weight="bold" font-family="sans-serif">Rust API — Axum (obi-web)</text>

  <!-- API modules -->
  <rect x="80" y="228" width="180" height="44" rx="6" fill="rgba(0,0,0,0.3)"/>
  <text x="170" y="248" text-anchor="middle" fill="#E8E0D0" font-size="11" font-weight="bold" font-family="monospace">trade_handlers.rs</text>
  <text x="170" y="264" text-anchor="middle" fill="rgba(232,224,208,0.5)" font-size="9" font-family="sans-serif">Prices, Markets, Commodities</text>

  <rect x="280" y="228" width="200" height="44" rx="6" fill="rgba(0,0,0,0.3)"/>
  <text x="380" y="248" text-anchor="middle" fill="#E8E0D0" font-size="11" font-weight="bold" font-family="monospace">whatsapp_handlers.rs</text>
  <text x="380" y="264" text-anchor="middle" fill="rgba(232,224,208,0.5)" font-size="9" font-family="sans-serif">Parse PRICE/ALERT/PRICES</text>

  <rect x="500" y="228" width="180" height="44" rx="6" fill="rgba(0,0,0,0.3)"/>
  <text x="590" y="248" text-anchor="middle" fill="#E8E0D0" font-size="11" font-weight="bold" font-family="monospace">alert_engine.rs</text>
  <text x="590" y="264" text-anchor="middle" fill="rgba(232,224,208,0.5)" font-size="9" font-family="sans-serif">Match, Trigger, Notify</text>

  <!-- Arrow down to DB -->
  <line x1="400" y1="290" x2="400" y2="330" stroke="#C9A84C" stroke-width="1.5"/>
  <polygon points="395,328 400,338 405,328" fill="#C9A84C"/>

  <!-- DATABASE LAYER -->
  <text x="40" y="350" fill="rgba(232,224,208,0.3)" font-size="9" font-family="monospace">STORAGE</text>
  <rect x="150" y="340" width="500" height="80" rx="10" fill="#111111" stroke="#C9A84C" stroke-width="1.5"/>
  <text x="400" y="368" text-anchor="middle" fill="#C9A84C" font-size="16" font-weight="bold" font-family="sans-serif">9S Scroll Store</text>
  <text x="400" y="388" text-anchor="middle" fill="rgba(232,224,208,0.5)" font-size="11" font-family="sans-serif">PostgreSQL — scrolls table</text>
  <text x="400" y="406" text-anchor="middle" fill="rgba(232,224,208,0.3)" font-size="9" font-family="monospace">/trade/prices/*  /trade/markets/*  /trade/commodities/*  /trade/index/*</text>
</svg>

The stack is deliberately minimal:

| Layer | Technology | Status |
|-------|-----------|--------|
| **Mobile** | Flutter (Dart) | Shared with existing Obiverse apps |
| **API** | Rust (Axum) | Existing obi-web crate — add 2 files |
| **Database** | PostgreSQL via 9S scrolls | Existing, proven, running |
| **Offline** | SQLite (sqflite) | Same pattern as existing apps |
| **WhatsApp** | Business API | Already wired in obi-web |
| **Payments** | Paystack | Already integrated |

Everything is a **scroll** — the 9S data model where every object has a path, a type, metadata, and data. A price observation is a scroll at `/trade/prices/{id}`. A market is a scroll at `/trade/markets/{id}`. The computed index is a scroll at `/trade/index/{market_id}/{commodity_id}`.

This means:
- **No new database tables** — it all goes in the existing `scrolls` table
- **No new infrastructure** — the API server is already running
- **No new auth system** — phone OTP already works

The backend work is two Rust files: `trade_handlers.rs` (price CRUD, market/commodity listing, search) and `alert_engine.rs` (background task that matches prices against alerts and fires WhatsApp notifications).

The Flutter app follows the exact same architecture as existing Obiverse apps: shared theme, shared auth flow, shared navigation patterns. The `trade_core` package holds pure Dart models with zero dependencies — commodity, market, price observation, alert.

**Build time to MVP**: 8 weeks. Not because the technology is complex, but because the seed data collection (calling contacts in 7 markets) takes time. The code is the easy part.

---

### Letter 7: On the Market Map

> *"Start where you know. I know Calabar. I know Aba. I know the traders, the roads, the prices. Start there."* — The founder

oTrade launches with **7 markets** in southeastern Nigeria and Lagos. These are not random — they are the nodes of the largest informal trade network in West Africa, connected by roads, relationships, and the daily movement of goods.

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 520" style="width:100%;max-width:800px;display:block;margin:2em auto;">
  <defs>
    <radialGradient id="mapBg" cx="50%" cy="50%" r="60%"><stop offset="0%" stop-color="#111111"/><stop offset="100%" stop-color="#0a0a0a"/></radialGradient>
    <filter id="dotGlow"><feGaussianBlur stdDeviation="4" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <rect width="800" height="520" rx="12" fill="url(#mapBg)"/>
  <text x="400" y="28" text-anchor="middle" fill="rgba(232,224,208,0.3)" font-size="11" font-family="monospace">OTRADE MARKET MAP — SOUTHEASTERN NIGERIA + LAGOS</text>

  <!-- Simplified outline of southeastern Nigeria -->
  <path d="M 80,200 Q 120,120 300,80 Q 400,60 500,100 Q 620,140 700,180 Q 740,220 720,300 Q 680,380 600,420 Q 500,460 380,440 Q 260,420 160,360 Q 100,300 80,200 Z" fill="none" stroke="rgba(232,224,208,0.06)" stroke-width="1"/>

  <!-- Connection lines (trade routes) -->
  <!-- Lagos to Onitsha -->
  <line x1="140" y1="180" x2="420" y2="260" stroke="rgba(78,205,79,0.15)" stroke-width="1"/>
  <!-- Onitsha to Aba -->
  <line x1="420" y1="260" x2="520" y2="330" stroke="rgba(78,205,79,0.15)" stroke-width="1"/>
  <!-- Aba to Calabar -->
  <line x1="520" y1="330" x2="650" y2="380" stroke="rgba(78,205,79,0.15)" stroke-width="1"/>
  <!-- Onitsha to Enugu -->
  <line x1="420" y1="260" x2="480" y2="180" stroke="rgba(78,205,79,0.15)" stroke-width="1"/>
  <!-- Enugu to Abakiliki -->
  <line x1="480" y1="180" x2="580" y2="150" stroke="rgba(78,205,79,0.15)" stroke-width="1"/>
  <!-- Aba to Calabar via Watt -->
  <line x1="520" y1="330" x2="620" y2="400" stroke="rgba(78,205,79,0.15)" stroke-width="1"/>
  <!-- Calabar Watt to Marian -->
  <line x1="650" y1="380" x2="620" y2="400" stroke="rgba(201,168,76,0.3)" stroke-width="1"/>

  <!-- MARKET DOTS -->
  <!-- 1. Lagos (Mile 12) - far west -->
  <circle cx="140" cy="180" r="14" fill="#2E7D32" filter="url(#dotGlow)" opacity="0.9"/>
  <circle cx="140" cy="180" r="6" fill="#4CAF50"/>
  <text x="140" y="210" text-anchor="middle" fill="#E8E0D0" font-size="12" font-weight="bold" font-family="sans-serif">Mile 12</text>
  <text x="140" y="226" text-anchor="middle" fill="rgba(232,224,208,0.4)" font-size="10" font-family="sans-serif">Lagos</text>

  <!-- 2. Onitsha - central -->
  <circle cx="420" cy="260" r="14" fill="#2E7D32" filter="url(#dotGlow)" opacity="0.9"/>
  <circle cx="420" cy="260" r="6" fill="#4CAF50"/>
  <text x="420" y="290" text-anchor="middle" fill="#E8E0D0" font-size="12" font-weight="bold" font-family="sans-serif">Onitsha Main</text>
  <text x="420" y="306" text-anchor="middle" fill="rgba(232,224,208,0.4)" font-size="10" font-family="sans-serif">Anambra</text>

  <!-- 3. Enugu (Ogbete) -->
  <circle cx="480" cy="180" r="14" fill="#2E7D32" filter="url(#dotGlow)" opacity="0.9"/>
  <circle cx="480" cy="180" r="6" fill="#4CAF50"/>
  <text x="480" y="164" text-anchor="middle" fill="#E8E0D0" font-size="12" font-weight="bold" font-family="sans-serif">Ogbete</text>
  <text x="480" y="150" text-anchor="middle" fill="rgba(232,224,208,0.4)" font-size="10" font-family="sans-serif">Enugu</text>

  <!-- 4. Abakiliki (Abakpa) -->
  <circle cx="580" cy="150" r="12" fill="#2E7D32" filter="url(#dotGlow)" opacity="0.9"/>
  <circle cx="580" cy="150" r="5" fill="#4CAF50"/>
  <text x="580" y="138" text-anchor="middle" fill="#E8E0D0" font-size="11" font-weight="bold" font-family="sans-serif">Abakpa</text>
  <text x="580" y="124" text-anchor="middle" fill="rgba(232,224,208,0.4)" font-size="10" font-family="sans-serif">Abakiliki</text>

  <!-- 5. Aba (Ariaria) -->
  <circle cx="520" cy="330" r="14" fill="#2E7D32" filter="url(#dotGlow)" opacity="0.9"/>
  <circle cx="520" cy="330" r="6" fill="#4CAF50"/>
  <text x="520" y="360" text-anchor="middle" fill="#E8E0D0" font-size="12" font-weight="bold" font-family="sans-serif">Ariaria</text>
  <text x="520" y="376" text-anchor="middle" fill="rgba(232,224,208,0.4)" font-size="10" font-family="sans-serif">Aba</text>

  <!-- 6. Calabar (Watt) -->
  <circle cx="650" cy="380" r="16" fill="#C9A84C" filter="url(#dotGlow)" opacity="0.9"/>
  <circle cx="650" cy="380" r="7" fill="#C9A84C"/>
  <text x="680" y="375" fill="#C9A84C" font-size="12" font-weight="bold" font-family="sans-serif">Watt</text>
  <text x="680" y="391" fill="rgba(201,168,76,0.6)" font-size="10" font-family="sans-serif">Calabar</text>
  <text x="680" y="405" fill="rgba(201,168,76,0.4)" font-size="8" font-family="monospace">HOME BASE</text>

  <!-- 7. Calabar (Marian) -->
  <circle cx="620" cy="400" r="12" fill="#C9A84C" filter="url(#dotGlow)" opacity="0.7"/>
  <circle cx="620" cy="400" r="5" fill="#C9A84C"/>
  <text x="590" y="418" text-anchor="end" fill="#C9A84C" font-size="11" font-weight="bold" font-family="sans-serif">Marian</text>
  <text x="590" y="432" text-anchor="end" fill="rgba(201,168,76,0.5)" font-size="10" font-family="sans-serif">Calabar</text>

  <!-- Stats box -->
  <rect x="60" y="300" width="260" height="160" rx="10" fill="#111111" stroke="rgba(232,224,208,0.1)" stroke-width="1"/>

  <text x="80" y="328" fill="#C9A84C" font-size="13" font-weight="bold" font-family="sans-serif">Launch Numbers</text>

  <text x="80" y="355" fill="rgba(232,224,208,0.5)" font-size="11" font-family="sans-serif">Markets</text>
  <text x="290" y="355" text-anchor="end" fill="#E8E0D0" font-size="14" font-weight="bold" font-family="monospace">7</text>

  <text x="80" y="380" fill="rgba(232,224,208,0.5)" font-size="11" font-family="sans-serif">Commodities</text>
  <text x="290" y="380" text-anchor="end" fill="#E8E0D0" font-size="14" font-weight="bold" font-family="monospace">25</text>

  <text x="80" y="405" fill="rgba(232,224,208,0.5)" font-size="11" font-family="sans-serif">Price Points</text>
  <text x="290" y="405" text-anchor="end" fill="#4CAF50" font-size="14" font-weight="bold" font-family="monospace">175</text>

  <text x="80" y="430" fill="rgba(232,224,208,0.5)" font-size="11" font-family="sans-serif">Categories</text>
  <text x="290" y="430" text-anchor="end" fill="#E8E0D0" font-size="14" font-weight="bold" font-family="monospace">6</text>

  <text x="80" y="450" fill="rgba(232,224,208,0.3)" font-size="9" font-family="monospace">25 × 7 = 175 seed price points</text>
</svg>

The 7 launch markets:

| Market | City | State | Why |
|--------|------|-------|-----|
| **Watt Market** | Calabar | Cross River | Home base, team's network, wholesale + retail |
| **Marian Market** | Calabar | Cross River | Calabar's wholesale hub |
| **Onitsha Main** | Onitsha | Anambra | Largest market in West Africa by volume |
| **Mile 12** | Lagos | Lagos | Nigeria's agricultural wholesale hub |
| **Ariaria** | Aba | Abia | Manufacturing + wholesale, Igbo trade capital |
| **Ogbete** | Enugu | Enugu | Southeast's gateway market |
| **Abakpa** | Abakiliki | Ebonyi | Rice belt epicenter |

**25 commodities** across 6 categories:

- **Grains**: Local rice, imported rice, brown beans, white beans, yellow maize, millet
- **Tubers**: White yam, fresh cassava, white garri, yellow garri
- **Oils & Protein**: Palm oil, groundnut oil, stockfish, crayfish, eggs
- **Vegetables**: Fresh tomato, tin tomato, fresh pepper, onion
- **Building materials**: Cement, roofing sheet, iron rod
- **Consumer goods**: Sugar, flour, salt

Each commodity has local-language names (Hausa, Igbo, Yoruba), standard trading units (50kg bag, 25L jerrycan, crate), and grade variants (Grade A rice, Dangote cement, Ijebu garri).

**25 commodities across 7 markets = 175 price points.** This is the seed dataset — manually collected from contacts in each market before a single user posts. When a trader first opens oTrade, it is already full of real, current prices.

**Growth path**: Phase 5 expands to 20+ markets and 50+ commodities. Then Ghana, Cameroon. The data model is universal — any commodity, any market, any currency.

---

### Letter 8: On the Business

> *"The data is the business. The app is just the door."* — A fintech founder, Lagos

oTrade is not an app. oTrade is a **data company** that happens to have an app.

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" style="width:100%;max-width:800px;display:block;margin:2em auto;">
  <defs>
    <linearGradient id="funnelGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#2E7D32" stop-opacity="0.4"/><stop offset="50%" stop-color="#2E7D32" stop-opacity="0.6"/><stop offset="100%" stop-color="#C9A84C" stop-opacity="0.8"/></linearGradient>
  </defs>
  <rect width="800" height="500" rx="12" fill="#0a0a0a"/>

  <!-- FUNNEL -->
  <text x="400" y="28" text-anchor="middle" fill="rgba(232,224,208,0.3)" font-size="11" font-family="monospace">THE OTRADE OPPORTUNITY</text>

  <!-- Level 1: 50M traders (widest) -->
  <polygon points="100,55 700,55 660,115 140,115" fill="#2E7D32" opacity="0.25"/>
  <text x="400" y="80" text-anchor="middle" fill="#E8E0D0" font-size="16" font-weight="bold" font-family="sans-serif">50 Million Nigerian Traders</text>
  <text x="400" y="100" text-anchor="middle" fill="rgba(232,224,208,0.4)" font-size="11" font-family="sans-serif">65% of GDP — $250B informal trade</text>

  <!-- Level 2: 5M addressable -->
  <polygon points="165,125 635,125 600,185 200,185" fill="#2E7D32" opacity="0.4"/>
  <text x="400" y="150" text-anchor="middle" fill="#E8E0D0" font-size="14" font-weight="bold" font-family="sans-serif">5M Smartphone + WhatsApp Traders</text>
  <text x="400" y="170" text-anchor="middle" fill="rgba(232,224,208,0.4)" font-size="11" font-family="sans-serif">Addressable market — southeastern Nigeria + Lagos</text>

  <!-- Level 3: 500K data points -->
  <polygon points="225,195 575,195 545,255 255,255" fill="#2E7D32" opacity="0.6"/>
  <text x="400" y="218" text-anchor="middle" fill="#E8E0D0" font-size="14" font-weight="bold" font-family="sans-serif">1% = 500,000 Price Reports / Month</text>
  <text x="400" y="238" text-anchor="middle" fill="rgba(232,224,208,0.4)" font-size="11" font-family="sans-serif">The most valuable commercial dataset on the continent</text>

  <!-- Level 4: Bloomberg terminal -->
  <polygon points="280,265 520,265 490,325 310,325" fill="#C9A84C" opacity="0.8"/>
  <text x="400" y="290" text-anchor="middle" fill="#0a0a0a" font-size="13" font-weight="bold" font-family="sans-serif">The Bloomberg Terminal</text>
  <text x="400" y="310" text-anchor="middle" fill="rgba(10,10,10,0.7)" font-size="11" font-family="sans-serif">of African Commerce</text>

  <!-- Revenue streams (branches from the funnel) -->
  <text x="60" y="370" fill="#C9A84C" font-size="12" font-weight="bold" font-family="sans-serif">REVENUE STREAMS</text>

  <!-- Stream 1: Featured Listings -->
  <rect x="60" y="385" width="210" height="50" rx="8" fill="#111111" stroke="#2E7D32" stroke-width="1"/>
  <text x="70" y="405" fill="#4CAF50" font-size="11" font-weight="bold" font-family="sans-serif">Featured Listings</text>
  <text x="70" y="425" fill="rgba(232,224,208,0.5)" font-size="10" font-family="sans-serif">Traders pin prices at top</text>
  <text x="260" y="415" text-anchor="end" fill="#C9A84C" font-size="12" font-weight="bold" font-family="monospace">₦500-2K/day</text>

  <!-- Stream 2: Premium Alerts -->
  <rect x="295" y="385" width="210" height="50" rx="8" fill="#111111" stroke="#2E7D32" stroke-width="1"/>
  <text x="305" y="405" fill="#4CAF50" font-size="11" font-weight="bold" font-family="sans-serif">Premium Alerts</text>
  <text x="305" y="425" fill="rgba(232,224,208,0.5)" font-size="10" font-family="sans-serif">Instant vs 15-min delay</text>
  <text x="495" y="415" text-anchor="end" fill="#C9A84C" font-size="12" font-weight="bold" font-family="monospace">₦1K/month</text>

  <!-- Stream 3: Data API -->
  <rect x="530" y="385" width="210" height="50" rx="8" fill="#111111" stroke="#C9A84C" stroke-width="1.5"/>
  <text x="540" y="405" fill="#C9A84C" font-size="11" font-weight="bold" font-family="sans-serif">Data API</text>
  <text x="540" y="425" fill="rgba(232,224,208,0.5)" font-size="10" font-family="sans-serif">Enterprise, commodity boards</text>
  <text x="730" y="415" text-anchor="end" fill="#C9A84C" font-size="12" font-weight="bold" font-family="monospace">₦50K-500K/mo</text>

  <!-- Break-even line -->
  <line x1="60" y1="455" x2="740" y2="455" stroke="rgba(232,224,208,0.1)" stroke-width="1"/>
  <text x="60" y="475" fill="rgba(232,224,208,0.4)" font-size="11" font-family="sans-serif">Break-even:</text>
  <text x="145" y="475" fill="#4CAF50" font-size="11" font-weight="bold" font-family="monospace">5,000 traders</text>
  <text x="260" y="475" fill="rgba(232,224,208,0.4)" font-size="11" font-family="sans-serif">×</text>
  <text x="280" y="475" fill="#C9A84C" font-size="11" font-weight="bold" font-family="monospace">₦1,000/mo</text>
  <text x="370" y="475" fill="rgba(232,224,208,0.4)" font-size="11" font-family="sans-serif">=</text>
  <text x="390" y="475" fill="#E8E0D0" font-size="11" font-weight="bold" font-family="monospace">₦5M/mo</text>
  <text x="460" y="475" fill="rgba(232,224,208,0.3)" font-size="11" font-family="sans-serif">(~$3,000 USD)</text>

  <!-- Paystack note -->
  <text x="740" y="475" text-anchor="end" fill="rgba(232,224,208,0.2)" font-size="9" font-family="monospace">Paystack already integrated</text>
</svg>

**Three revenue streams, all native to the product:**

**1. Featured Listings (₦500-2,000/day)**
A trader pays to pin their price at the top of a commodity's listing. "I sell Grade A rice at ₦83,000 at Watt Market — feature my price." This is classified advertising for the commodity age. Traders already pay for WhatsApp group promotion. This is cleaner, cheaper, and reaches the right audience.

**2. Premium Alerts (₦1,000/month)**
Free users get alerts with a 15-minute delay. Premium subscribers get instant alerts. When a price drops below your threshold, 15 minutes is the difference between getting the deal and missing it. The trader who moves first wins.

**3. Data API (₦50,000-500,000/month)**
This is the Bloomberg play. Commodity boards (AFEX, NCX), agricultural enterprises, banks pricing commodity-backed loans, researchers studying food inflation, governments tracking price stability — all of them need structured price data from informal markets, and none of them have it today.

The data API is where oTrade becomes a serious business. 500,000 monthly price reports across 50 commodities and 20 markets is a dataset no one else in Africa possesses. The first platform to aggregate and structure this data **owns the most valuable commercial dataset on the continent**.

**Growth roadmap:**

| Phase | Timeline | Milestone |
|-------|----------|-----------|
| Foundation | Week 1 | Skeleton app, seed data, 175 price points |
| Post & Browse | Week 2-3 | Traders posting and viewing prices |
| Intelligence | Week 4-5 | Charts, trends, cross-market comparison |
| Alerts & WhatsApp | Week 6-7 | Alert engine, WhatsApp bot live |
| Launch | Week 8 | TestFlight + Play Store |
| Revenue | Month 3+ | Featured listings, premium alerts, data API |
| Scale | Month 6+ | 20 markets, 50 commodities, Ghana + Cameroon |

**Success metrics:**
- **Week 1**: 100 prices posted
- **Month 1**: 500 app downloads, 7 markets with daily updates
- **Month 3**: 1,000 active traders, WhatsApp bot processing 100+ messages/day
- **Month 6**: 5,000 traders, first revenue from featured listings

The break-even is modest: **5,000 active traders paying ₦1,000/month = ₦5 million/month**. That is roughly $3,000 USD — achievable with a fraction of the addressable market.

But the ceiling is not subscription revenue. It is data. The Bloomberg Terminal for equities processes millions of data points and generates $12 billion in annual revenue. The Bloomberg Terminal for African informal commerce — processing millions of price observations from millions of traders across the continent's largest economy — is a business that does not yet exist.

**oTrade is how it begins.**

---

## Epilogue: On the Merchant Who Builds Empires

> *"The merchant who has knowledge trades wisely. The merchant who has information trades profitably. The merchant who has both builds an empire."*

Fifty million traders. Information darkness. A 10-second price post. An 8-week build.

The technology is simple. The infrastructure exists. The market is desperate for this.

What oTrade really sells is not an app — it is the end of guessing. The end of calling eight contacts. The end of driving to Onitsha without knowing the price.

It is the beginning of a continent that trades with its eyes open.

**Know the price before you travel.**
