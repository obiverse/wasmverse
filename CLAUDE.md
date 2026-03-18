# Wasmverse — The Epistolary Library

## What This Is

A collection of technical treatises written in the style of Euler's *Letters to a German Princess*, published as an interactive iBooks-style PWA at https://obiverse.github.io/wasmverse/

Each treatise teaches a subject from first principles through epistolary letters addressed "Dear Reader," using real-world analogies (embassies, refineries, hospitals, orchestras, courthouses, etc.) and live WebAssembly demonstrations embedded inline.

## The Eulerian Voice — How to Write Letters

This is the most critical instruction. Every letter in every treatise MUST follow this voice:

### The Five Principles of Euler's Approach

1. **Clarify, never simplify.** Euler did not dumb down physics for his princess. He made the deep structure so transparent that anyone could see through it. Never sacrifice truth for accessibility — find the analogy that makes both visible.

2. **Every concept has an isomorphism in the physical world.** An AND gate is a visa application. A mutex is a washroom key. A UTXO is a cash register bill. These are not metaphors — they are the *same structural principle* appearing in different media. Find the isomorphism, not the metaphor.

3. **Address the reader as an equal who simply hasn't seen this yet.** "Dear Reader" is not condescension. It is the posture of one who has climbed the mountain speaking to another who is about to. The tone is warm, precise, and assumes intelligence.

4. **The subject is a discovery, not an invention.** Euler felt that mathematical truths existed before humans found them. Apply this to computation: WebAssembly *had* to exist. Ownership *had* to be formalized. Bitcoin *had* to emerge. Show the inevitability.

5. **End with awe.** Each letter should leave the reader with a sense of wonder — that the same principles govern circuits and cathedrals, that composition at every scale produces infinite richness, that the One who designed the mathematics is worthy of love.

### Letter Structure

```markdown
### Letter N: On [Concept] and the [Analogy]

Dear Reader,

[Opening: connect to what came before, introduce the question]

[Core explanation: the concept itself, with code examples if relevant]

[The isomorphism: the real-world analogy, drawn out in full detail —
 not a one-liner but a paragraph showing HOW the structural principle
 is the same in both domains]

[Deeper implications: why this matters, what it connects to]

[Closing: a sentence that makes the reader feel the beauty of the structure]
```

### What Makes a Good Analogy

- **A visa application** for AND gates (all conditions must be true)
- **A library card** for borrowing (many readers OR one editor, never both)
- **A demolition crew** for Drop (arrives on schedule, no garbage collector)
- **A meat grinder** for hash functions (steak to hamburger, never back)
- **A bar tab** for payment channels (settle only when leaving)

Bad analogies: anything that requires as much explanation as the concept itself. Good analogies: things the reader already understands deeply, where the structural parallel is exact.

### Heading Format (Parser Contract)

The reader app at `docs/read.html` parses markdown with these exact patterns:
- `## Preface` — parsed as the opening chapter
- `## Part N: Title` — parsed as groupings (NOT chapters, just nav sections)
- `### Letter N: On Title` — parsed as individual chapters
- `## Epilogue: On Title` — parsed as the closing chapter

## Architecture

```
docs/
  index.html              Library hub (book cards, sacred geometry, progress rings)
  read.html               Parameterized reader (?book=wasm, ?book=rust, etc.)
  books/
    manifest.json          Book catalog (id, title, file, symbol, accent, etc.)
    wasm.md                Letters on the Universal Machine (40 letters)
    rust.md                Letters on the Ownership of Memory (36 letters)
    bitcoin.md             Letters on the Sovereignty of Value (48 letters)
    pwa.md                 Letters on the Sovereign Application
  pkg/                     Compiled Wasm modules for interactive demos
    sorting-theater/       Step-by-step sorting visualizer
    stack-machine/         Bytecode VM stepper
  sw.js                    Service worker (offline support)
  manifest.webmanifest     PWA manifest (scope: /wasmverse/)
  icon.svg                 Seed of Life app icon
  pwa.js                   Install banner, iOS instructions, offline awareness

crates/
  compute-engine/          Game of Life + Mandelbrot (Wasm)
  gpu-renderer/            WebGPU plasma shader (Wasm)
  wit-components/          Particle system + WIT demo (Wasm)
  sorting-theater/         6 sorting algorithms as step-by-step state machines
  stack-machine/           20-instruction bytecode VM with step execution

build.sh                   Builds all crates, copies Wasm to docs/pkg/
LIBRARY_PLAN.md            Complete outline for 7 future treatises
```

## Adding a New Book

1. Write the treatise as `docs/books/{id}.md` following the heading format above
2. Add an entry to `docs/books/manifest.json` with: id, title, subtitle, manner, file, symbol (Adinkra name), accent (hex color), letters (count), parts (count), description
3. Add the book's Adinkra symbol SVG to `docs/index.html` (in `adinkraSVGs` object) if it's a new symbol
4. Add a card canvas animation for the book in `initCardCanvas()` in `docs/index.html`
5. Add the book's `.md` file to the `SHELL` array in `docs/sw.js` for offline caching
6. Bump the cache version in `sw.js` (e.g., `epistolary-v5`)

## Adding Wasm Demos to a Book

1. Create a Rust crate in `crates/{name}/` following the zero-copy pattern (expose `*_ptr()` methods)
2. Add to `Cargo.toml` workspace members
3. Add build function in `build.sh`
4. Place `<!-- DEMO:demo-id -->` marker in the book's markdown where the demo should appear
5. Add demo initialization in `read.html`'s `initDemos()` function
6. Run `./build.sh docs` to compile and copy to `docs/pkg/`

## Adinkra Symbols in Use

| Symbol | Meaning | Book |
|--------|---------|------|
| ananse | Spider's web (wisdom, creativity) | WebAssembly |
| dwennimmen | Ram's horns (strength of mind) | Rust |
| fawohodie | Independence, freedom | Bitcoin |
| nsoromma | Child of the heavens (guiding star) | PWA / default |
| sankofa | Go back and learn | (chapter markers) |
| funtun | Unity in diversity | (chapter markers) |

## Build Commands

```bash
./build.sh              # Build all Rust crates
./build.sh docs         # Build + copy Wasm to docs/pkg/ + copy TREATISE.md
./build.sh serve        # Build all + start local dev server on :8080
```

## GitHub Pages

- Deployed from `docs/` folder on `master` branch
- PWA scope: `/wasmverse/`
- All paths in sw.js and manifest.webmanifest are prefixed with `/wasmverse/`
