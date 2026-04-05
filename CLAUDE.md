# The Letterverse — Euler's Library for the African Builder

## The Mission

The Letterverse is a sovereign digital university — 19 treatises (and growing) written in the voice of Euler's *Letters to a German Princess*, published as an offline-first PWA at https://obiverse.github.io/wasmverse/

The mission: **drive the African mind to noesis** — pure intellectual apprehension — across every domain a builder needs. Technology, mathematics, finance, enterprise, art, systems thinking, manufacturing, governance, communication, cryptography, and AI. Every subject taught from first principles through epistolary letters, grounded in African examples, analogies, and wisdom traditions.

A reader who completes the library can think mathematically, code in Rust and Wasm, build businesses, manage wealth, create art, see systems, understand AI, secure with cryptography, communicate with clarity, lead communities, and manufacture physical goods — from the carpenter's bench to the smart factory.

## The Eulerian Voice — The Five Principles

This is the soul of every letter. It MUST be followed:

1. **Clarify, never simplify.** Euler did not dumb down physics. He made deep structure so transparent that anyone could see through it. Never sacrifice truth for accessibility — find the analogy that makes both visible.

2. **Every concept has an isomorphism in the physical world.** Not metaphors but structural parallels. An AND gate IS a visa application. A mutex IS a washroom key. A UTXO IS a cash register bill. The same principle appearing in different media.

3. **Address the reader as an equal who simply hasn't seen this yet.** "Dear Reader" with warmth and precision. Assume intelligence. The tone is one climber speaking to another.

4. **The subject is a discovery, not an invention.** Euler felt mathematical truths existed before humans found them. Electricity was always there. Ownership had to be formalized. Bitcoin had to emerge. Show the inevitability.

5. **End with awe.** The same principles govern circuits and cathedrals, markets and ecosystems. The One who designed the mathematics is worthy of love.

## The African Grounding

Every treatise must be grounded in African reality:
- **Examples from African life**: M-Pesa, Flutterwave, Aba leather markets, Suame Magazine mechanics, Kente weaving, Jua Kali artisans, Innoson vehicles
- **African wisdom traditions**: Adinkra symbols, Ubuntu, the palaver tree, age-grade systems, griots, proverbs from Yoruba, Akan, Swahili, Igbo, Zulu, Hausa, and more
- **African mathematics**: The Ishango bone, Yoruba counting systems, Timbuktu scholarship, Egyptian geometry, Ethiopian crosses as fractals
- **The posture**: Mathematics and technology are Africa's birthright, not foreign impositions. The library empowers sovereignty, not dependency.

## Letter Structure

```markdown
### Letter N: On [Concept] and the [Analogy]

Dear Reader,

[Opening: connect to what came before, introduce the question]

[Core explanation: the concept itself, with code/diagrams if relevant]

[The isomorphism: the real-world analogy drawn out in full detail —
 not a one-liner but a paragraph showing HOW the structural principle
 is identical in both domains]

[Deeper implications: why this matters, what it connects to]

[Closing: a sentence that makes the reader feel the beauty of the structure]
```

## Heading Format (Parser Contract)

The reader at `docs/read.html` parses markdown with these exact patterns:
- `## Preface` — opening chapter
- `## Part N: Title` — groupings (NOT chapters, just nav sections)
- `### Letter N: On Title` — individual chapters
- `## Epilogue: On Title` — closing chapter

## Current Library (38 books, 1,339 letters)

### Technology Wing (10 books, 352 letters)
| Book | Letters | File |
|------|---------|------|
| Letters on the Universal Machine (WebAssembly) | 40 | wasm.md |
| Letters on the Ownership of Memory (Rust) | 36 | rust.md |
| Letters on the Sovereign Application (PWA) | 41 | pwa.md |
| Letters on the Composition of Systems (Euler Framework) | 31 | euler.md |
| Letters on the Making of the Library (Software Engineering) | 43 | making.md |
| Letters on the Web of Messages (WhatsApp & Nostr) | 42 | messages.md |
| Letters on the Sovereign Device (Android) | 23 | android.md |
| Letters on the Sovereign Machine (Linux & Linux Mint) | 46 | linux.md |
| Letters on the Sovereign Intelligence (Claude & AI) | 25 | claude-ai.md |
| Letters on the Nine Scrolls (9S Substrate) | 25 | nine-scrolls.md |

### Science Wing (9 books, 305 letters)
| Book | Letters | File |
|------|---------|------|
| Letters on the Mathematics of Reality | 35 | math.md |
| Letters on the Patterns of Nature (Systems Thinking) | 30 | systems.md |
| Letters on the Architecture of Thought (AI & Neural Networks) | 35 | thought.md |
| Letters on the Shape of Data (Algorithms) | 35 | algorithms.md |
| Letters on the Cryptography of Trust | 35 | crypto.md |
| Letters on the Power of Nature (Electricity) | 45 | electricity.md |
| Letters on the Chemistry of Matter | 35 | chemistry.md |
| Letters on the Warmth of Fire (Thermodynamics) | 30 | heat.md |
| Letters on the Direction of Prayer (Geometry & Sensors) | 25 | qibla.md |

### Finance Wing (2 books, 83 letters)
| Book | Letters | File |
|------|---------|------|
| Letters on the Sovereignty of Value (Bitcoin) | 48 | bitcoin.md |
| Letters on the Architecture of Wealth (Finance) | 35 | wealth.md |

### Building Wing (5 books, 160 letters)
| Book | Letters | File |
|------|---------|------|
| Letters on the Sovereign Enterprise (Entrepreneurship) | 35 | enterprise.md |
| Letters on the Rhetoric of Clarity (Communication) | 30 | rhetoric.md |
| Letters on the Governance of the Commons (Leadership) | 30 | governance.md |
| Letters on the Healing of the Body (Public Health) | 35 | health.md |
| Letters on the Map of the Earth (Surveying & GIS) | 30 | earth.md |

### Making Wing (5 books, 188 letters)
| Book | Letters | File |
|------|---------|------|
| Letters on the Manufacturing of Worlds | 43 | manufacturing.md |
| Letters on the Engine of Industry | 35 | industry.md |
| Letters on the Strength of Things (Structures) | 40 | strength.md |
| Letters on the Nourishment of Nations (Agriculture) | 35 | agriculture.md |
| Letters on the Flow of Water (Sanitation) | 35 | water.md |

### Creative Wing (2 books, 60 letters)
| Book | Letters | File |
|------|---------|------|
| Letters on the Generative Canvas (Creative Coding) | 30 | canvas.md |
| Letters on the Language of Design | 30 | design.md |

### Sovereignty Wing (5 books, 191 letters)
| Book | Letters | File |
|------|---------|------|
| Letters on the Sovereignty of Keys (Digital Identity) | 40 | keys.md |
| Letters on the Lightning of Exchange | 38 | lightning.md |
| Letters on the Protocol of Whispers (Nostr) | 42 | whispers.md |
| Letters on the Invisible Cloak (Privacy) | 35 | cloak.md |
| Letters on the Fortress of the Self (Infrastructure) | 36 | fortress.md |

## Architecture

```
docs/
  index.html              Library hub (categories, search, progress, themes)
  read.html               Parameterized reader (?book=id)
  books/
    manifest.json          Book catalog with categories
    *.md                   19 treatise files
  css/
    base.css               Shared variables, reset, typography
    library.css            Hub page styles
    reader.css             Reader page styles
    search.css             Global search modal
    theme-toggle.css       Theme switcher
  js/
    library.js             Hub logic (cards, filtering, canvas animations)
    reader.js              Reader logic (sidebar, scrollspy, chapters, demos)
    search.js              Global Cmd+K search (Euler TF-IDF)
    theme-global.js        Dark/light/system theme toggle
    marked.min.js          Markdown parser
  euler-shell.js           Wasm↔JS bridge (boot, persist, theme, typography)
  pwa.js                   PWA install, offline awareness
  sw.js                    Service worker (network-first, cache as backup)
  pkg/euler/               Euler framework Wasm module
  pkg/sorting-theater/     Sorting demo Wasm module
  pkg/stack-machine/       Stack VM demo Wasm module

crates/
  euler/                   Framework: json, store, theme, router, search (1,836 lines Rust)
  sorting-theater/         6 sorting algorithms as state machines
  stack-machine/           20-instruction bytecode VM
  compute-engine/          Game of Life + Mandelbrot
  gpu-renderer/            WebGPU plasma shader
  wit-components/          WIT particle system
```

## Adding a New Book

1. Write `docs/books/{id}.md` following the heading format
2. Add entry to `docs/books/manifest.json` with: id, title, subtitle, manner, file, symbol, accent, letters, parts, category, description
3. That's it. The hub reads from manifest.json. The reader parses the markdown. The SW caches on first access. No precache list to maintain.

## PWA Architecture

The PWA is deliberately simple — **network-first for everything**:
- Online: fetch from network, cache the response
- Offline: serve from cache
- No precache list. No version tokens. No self-healing scripts.
- The SW cannot fail to install. Content is always fresh. Offline builds naturally.

## Build Commands

```bash
./build.sh              # Build all Rust crates
./build.sh euler        # Build only Euler framework
./build.sh docs         # Build + copy Wasm to docs/pkg/
./build.sh test         # Run all tests (44 passing)
./build.sh serve        # Build + local dev server on :8080
```
