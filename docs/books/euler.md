# Letters on the Composition of Systems

### A Treatise on the Euler Framework, from Axioms to Archmage

*In the manner of Euler's Letters to a German Princess*

---

## Preface

Dear Reader,

You are holding a paradox. This treatise describes a framework called Euler — and it is Euler that renders the very page you are reading. The themes that color your screen, the bookmarks you save, the reading progress that remembers where you left off, the search that finds passages across all treatises — all of it flows through the system these letters describe. You are inside the subject of study.

This is not an accident. It is the deepest test of any framework: *can it explain itself?* A programming language that cannot write its own compiler is incomplete. A framework that cannot power its own documentation is unserious. Euler powers this library, and this library teaches Euler. The circle closes.

Leonhard Euler — the mathematician, not the framework — spent his life finding the general principle behind specific problems. He did not solve the Bridges of Königsberg; he invented graph theory, of which Königsberg was the first exercise. He did not merely sum the reciprocals of squares; he discovered zeta functions, of which π²/6 was the first evaluation. He found the *universal* that made the *particular* trivial.

The Euler framework follows this method. It does not solve one web application's state management problem. It provides five general modules — JSON, Store, Theme, Router, Search — from which any web application's state management follows as a corollary. The Epistolary Library is the first proof. But a todo application, a dashboard, a game, a medical records system — each is another proof of the same theorems.

I shall teach you these theorems from the ground up. Not as API documentation — you can read the source code for that — but as *understanding*. Why does state need a version counter? Why must JSON be hand-written rather than generated? Why is a theme an array of pairs rather than a struct with named fields? Each design choice traces back to a principle, and each principle appears in domains far beyond computing.

By the end, you will not merely know how to use Euler. You will understand why it *must be this way*, and you will recognize the same patterns in operating systems, postal services, municipal governments, living cells, and the structure of language itself.

Let us begin with the simplest question: what is an application?

---

## Part I: The Axioms

### Letter 1: On the Fundamental Equation

Consider what happens when you use any piece of software. You see a screen. You do something — tap a button, type a word, scroll a page. The screen changes. You do something else. The screen changes again. This cycle repeats until you close the application.

Beneath every visual change lies a single truth: **the screen is a function of the data behind it**. The pixels you see are not drawn arbitrarily. They are computed from a *state* — a collection of values that describe what the application knows right now. The current page. The user's name. The theme preference. The reading progress. The list of bookmarks. Change the state, and the screen changes. Identical state always produces identical screen.

This is the fundamental equation of all interactive software:

```
    THE FUNDAMENTAL EQUATION

    View = f(State)

    Where:
      State  = all the data the application knows
      f      = the function that computes what to display
      View   = what the user sees on screen

    Every framework in history is an implementation
    of this equation:

    React:    View = Component(props + state)
    Angular:  View = Template(model)
    Svelte:   View = Compiled(reactive variables)
    Euler:    View = JS_Shell(WASM_State)
```

Euler called this principle *functional dependency*: the value of one thing is entirely determined by the value of another. The area of a circle is a function of its radius. The boiling point of water is a function of altitude. The screen is a function of state.

Now consider where this equation appears outside of computing.

A **bank statement** is a view of your account state. The balance, the transactions, the interest — all derived from the underlying ledger. Two people looking at the same account see the same statement. Change the ledger (deposit money), and the statement changes.

A **weather report** is a view of atmospheric state. Temperature, pressure, humidity, wind — all derived from sensor data. The map on your screen is `f(atmospheric_state)`.

A **medical chart** is a view of a patient's physiological state. Heart rate, blood pressure, lab results — all derived from the body's current condition. The chart is `f(patient_state)`.

The question that separates frameworks is not *whether* this equation holds (it always does), but two implementation questions:

1. **Where does State live?** In JavaScript's memory? In a database? In the DOM itself?
2. **How is f computed?** By diffing a virtual DOM? By re-rendering templates? By reading shared memory?

Euler's answer: State lives in WebAssembly's linear memory. f is computed by JavaScript reading that memory through the thinnest possible bridge.

This answer has consequences that ripple through every design decision in the framework. Let us trace them.

### Letter 2: On the Separation of Knowledge and Display

A library has two distinct concerns: the *collection* and the *catalog*.

The collection is the books themselves — the paper, the ink, the binding, the shelves. The catalog is the index cards (or today, the computer system) that tells you where each book is, what subject it covers, who wrote it, and whether it is available.

The collection and the catalog are different things. The catalog does not contain the books. The books do not contain the catalog. They *correspond* — each catalog entry points to a physical location — but they are separate, and separating them is essential to the library's function. A patron consults the catalog, walks to the shelf, and retrieves the book. The catalog never needs to know what paper the book is printed on. The book never needs to know what filing system the catalog uses.

This is the architecture of the Euler framework:

```
    THE LIBRARY METAPHOR

    ┌───────────────────────────────┐
    │  EULER (WASM)                 │
    │  = The Catalog                │
    │                               │
    │  Knows: what books exist,     │
    │  which are checked out,       │
    │  what themes are available,   │
    │  where each reader left off,  │
    │  what they highlighted.       │
    │                               │
    │  Does NOT know: what pixels   │
    │  are on screen, what CSS      │
    │  properties exist, what the   │
    │  DOM looks like.              │
    └───────────────┬───────────────┘
                    │ (method calls + JSON)
                    ▼
    ┌───────────────────────────────┐
    │  JAVASCRIPT (Shell)           │
    │  = The Physical Library       │
    │                               │
    │  Knows: how to render HTML,   │
    │  how to draw on Canvas,       │
    │  how to animate particles,    │
    │  how to handle touch events.  │
    │                               │
    │  Does NOT know: what the      │
    │  current theme is, how many   │
    │  chapters the user has read,  │
    │  what the sort order should   │
    │  be, or whether to show       │
    │  the hero screen.             │
    └───────────────────────────────┘
```

JavaScript asks Euler: "Should I show the hero?" Euler says yes or no. JavaScript asks Euler: "What text should the button say?" Euler says "Begin Reading" or "Continue from Letter 12." JavaScript never decides these things — it merely renders Euler's decisions.

This separation has a name in computer science: the *Model-View* pattern. But the name is less important than the reason it exists. It exists because **knowledge and display have different rates of change**.

A library's catalog system might be redesigned every decade. But the books are acquired daily. If the catalog were embedded in the shelves, every new book would require rebuilding the shelves. By separating them, the catalog and the collection evolve independently.

In Euler, the state logic (Rust/WASM) and the rendering logic (JavaScript) evolve independently. You can redesign the entire visual experience — new animations, new layouts, a completely different CSS framework — without touching a line of Rust. You can add new state features — a flashcard system, a spaced repetition scheduler, a collaborative annotation layer — without touching a line of JavaScript.

### Letter 3: On the Five Modules

Euler the mathematician published over 800 papers. He organized them not by chronology but by *subject*: algebra, analysis, geometry, number theory, mechanics, optics. Each subject was self-contained. A student of optics need not study number theory, though the deepest insights connected them.

The Euler framework has five modules, each self-contained, each a general theorem:

```
    THE FIVE MODULES

    ┌─── json ──────────────────────────────────┐
    │  The Tongue. How systems communicate.     │
    │  Parse and serialize data without          │
    │  external dependencies.                    │
    └───────────────────────────────────────────┘

    ┌─── store ─────────────────────────────────┐
    │  The Memory. A versioned state container. │
    │  Every mutation increments a counter.      │
    │  The shell checks: if unchanged, skip.     │
    └───────────────────────────────────────────┘

    ┌─── theme ─────────────────────────────────┐
    │  The Aesthetics. Color as mathematics.    │
    │  RGB triples, mix/lighten/darken, CSS      │
    │  custom property generation.               │
    └───────────────────────────────────────────┘

    ┌─── router ────────────────────────────────┐
    │  The Map. URL parsing and construction.   │
    │  Path, parameters, fragment. Pure          │
    │  functions, no browser API coupling.       │
    └───────────────────────────────────────────┘

    ┌─── search ────────────────────────────────┐
    │  The Index. Full-text search with TF-IDF. │
    │  Inverted index, stopwords, snippets.      │
    │  Any text corpus, any domain.              │
    └───────────────────────────────────────────┘
```

Each module depends on nothing but the Rust standard library and, where needed, the `json` module. They compose but do not require each other. You can use `theme` without `search`. You can use `router` without `store`. This independence is essential — it means each module is testable in isolation and reusable in any context.

### Letter 4: On the Weight of Dependencies

Why does Euler refuse external dependencies? Why hand-write a JSON parser when `serde` exists? Why compute colors manually when `palette` exists? Why parse URLs manually when `url` exists?

The answer is weight.

When you compile a Rust program to WebAssembly, every dependency becomes bytes in the binary. The binary must travel over the network to the user's browser before the application can start. On a fast connection, this takes milliseconds. On a slow connection — a phone on a rural network, a laptop on airplane Wi-Fi — it takes seconds. Every kilobyte matters.

The `serde` library, which provides general-purpose JSON serialization for arbitrary Rust types, adds approximately 80 kilobytes to a WASM binary. The `serde_json` parser adds another 40KB. Together: 120KB — more than the entire Euler framework.

```
    THE WEIGHT OF DEPENDENCIES

    serde + serde_json:    ~120 KB
    euler (entire framework): ~206 KB

    If we used serde, the framework would be
    326 KB — 60% of which is a JSON library
    we don't fully need.

    Euler's json module:     ~8 KB in binary
    It handles everything we need.
    Savings: 112 KB, or 93%.
```

This is not premature optimization. This is *architectural discipline*. The Euler framework targets a specific environment — the web browser — where binary size directly affects load time, which directly affects whether a user waits or leaves. A 200KB framework loads in 50ms on a good connection. A 320KB framework loads in 80ms. The difference is invisible on fiber but brutal on 3G.

The deeper principle is this: **a dependency that solves more than your problem carries the weight of every problem it solves.** Serde can serialize *any* Rust type to *any* format. Euler needs to serialize *one known schema* to *one format*. The general solution costs 120KB. The specific solution costs 8KB.

Euler the mathematician understood this. His proofs were famously economical. He did not invoke heavy machinery when a direct argument sufficed. His proof that there are infinitely many primes is eight lines. Euclid's proof of the same fact, which Euler admired, is even shorter. The best proof is the one with the fewest assumptions.

---

## Part II: The Tongue — JSON Without Dependencies

### Letter 5: On Serialization and the Diplomatic Pouch

When the French ambassador to Russia wishes to send a message to Paris, the message must be *encoded* in a form that survives the journey. It is written on paper (serialized from thought to text), placed in a diplomatic pouch (a transport container), carried by courier (the network), and decoded by the recipient (deserialized from text back to understanding).

This is serialization: converting structured data in memory (a Rust struct, a JavaScript object) into a linear sequence of characters that can be stored or transmitted, and then converting it back.

JSON — JavaScript Object Notation — is the diplomatic language of the web. It represents data as nested key-value pairs:

```json
{
    "theme": "midnight",
    "fontSize": 19,
    "reading": {
        "wasm": {
            "chaptersRead": 12,
            "scrollPosition": 0.65
        }
    }
}
```

Every web API speaks JSON. Every browser can parse it natively. It is not the most efficient format (binary formats like Protocol Buffers or MessagePack are smaller and faster), but it is the most *universal*. Euler chose it for the same reason Euler the mathematician wrote in Latin: not because it was the best language, but because everyone could read it.

### Letter 6: On the Writer and the Builder Pattern

Euler's `json::Writer` constructs JSON through a sequence of method calls:

```rust
let mut w = Writer::new();
w.object_open()
    .key("name").val_str("Euler")
    .key("version").val_num(1.0)
    .key("modules").array_open()
        .val_str("json")
        .val_str("store")
        .val_str("theme")
    .array_close()
.object_close();
let json = w.finish();
// {"name":"Euler","version":1,"modules":["json","store","theme"]}
```

This is the *builder pattern* — a design pattern where an object is constructed through a sequence of incremental operations rather than all at once. It appears throughout engineering.

A bricklayer builds a wall one brick at a time. Each brick depends on the one below it being set and mortar applied. The builder pattern: `wall.brick().mortar().brick().mortar()...`

A conductor rehearses an orchestra one section at a time. Strings, then woodwinds, then brass, then percussion, then full ensemble. The builder pattern: `score.strings().woodwinds().brass().percussion().tutti()`.

The Writer tracks one piece of state: `needs_sep` — a boolean that remembers whether the next value needs a preceding comma. When you open an object or array, `needs_sep` resets to false (no comma before the first element). When you write a value, `needs_sep` becomes true (the next value will need a comma). This single boolean eliminates the need for the caller to track whether they are writing the first element or a subsequent one.

### Letter 7: On the Parser and the Known Schema

The parser side of `json` is deliberately limited. It does not parse arbitrary JSON into a tree structure (that would require allocating nodes, managing lifetimes, and handling every edge case of the JSON specification). Instead, it extracts values by key from a JSON string:

```rust
let json = r#"{"name":"Euler","version":1}"#;
let name = json::get_str(json, "name");    // Some("Euler")
let ver = json::get_num(json, "version");  // Some(1.0)
let missing = json::get_str(json, "age");  // None
```

This works because Euler always knows the shape of its data. The state has a fixed schema: theme is a string, fontSize is a number, reading is an object of objects. We never need to parse *unknown* JSON — we always know what keys to expect.

This is the principle of *schema-aware parsing*: if you know the structure of the data in advance, you can extract what you need without building a complete representation. A customs officer checking passports does not read every page — they open to the photo page, verify the name and photo, check the expiry date, and stamp. They know the schema of a passport.

---

## Part III: The Memory — Versioned State

### Letter 8: On the Version Counter and the Clock Tower

In a medieval town, the clock tower serves a simple but essential purpose: it tells everyone what time it is. Before the clock tower, every household kept its own time, and no two clocks agreed. After the clock tower, every shopkeeper, every church, every school synchronized to a single source.

The `store::Versioned<T>` wrapper serves the same purpose for application state. It wraps any data type and maintains a monotonically increasing counter:

```rust
pub struct Versioned<T> {
    inner: T,
    version: u64,
}
```

Every time the state is mutated (through `get_mut()`), the version increments. Every time the state is read (through `get()`), the version remains unchanged.

The JavaScript shell checks this version on every animation frame or event. If the version has not changed since the last render, the shell skips all work. This is the Eulerian optimization: **do not recompute what has not changed.**

```
    THE VERSION CHECK

    Frame 1: version = 5  → render (version changed)
    Frame 2: version = 5  → skip (nothing changed)
    Frame 3: version = 5  → skip
    Frame 4: version = 6  → render (user changed theme)
    Frame 5: version = 6  → skip
    Frame 6: version = 6  → skip
    ...
```

Without versioning, every frame would re-read state, re-parse JSON, re-apply CSS variables, re-check bookmarks — even when nothing has changed. This is like a bank re-printing every customer's statement every second, regardless of whether any transaction occurred.

### Letter 9: On Persistence and the Diplomatic Archive

When the French ambassador finishes their posting in Russia and returns to Paris, the embassy's archives must survive the transition. The new ambassador must find every treaty, every correspondence, every agreement exactly as it was left.

State persistence is the archive. When the user closes the application (or their browser tab), the state must survive. When they return, the state must be restored exactly. Euler provides two methods for this:

- `dehydrate()` — serialize the entire state to a JSON string
- `hydrate(json)` — restore the entire state from a JSON string

The JavaScript shell bridges these to `localStorage`:

```javascript
// On state change:
localStorage.setItem('euler_state', euler.dehydrate());

// On application boot:
const saved = localStorage.getItem('euler_state');
if (saved) euler.hydrate(saved);
```

The dehydrate/hydrate metaphor is deliberate. A dehydrated state is compact — a flat string that fits in localStorage's 5MB limit. A hydrated state is alive — a Rust struct in WASM linear memory, with all its methods operational. The transition between forms is lossless: `hydrate(dehydrate(state)) === state`.

---

## Part IV: The Aesthetics — Color as Mathematics

### Letter 10: On Color and the Three Numbers

Euler devoted many letters to the Princess on the subject of light and color. He understood that color is not a property of objects but a property of light — specifically, of the wavelengths of electromagnetic radiation that the human eye detects.

In computing, every color on your screen is described by three numbers: the intensity of red, green, and blue light. Each ranges from 0 (no light) to 255 (maximum light). Three bytes. Twenty-four bits. Sixteen million possible colors.

```
    COLOR AS THREE NUMBERS

    Black:   Color(0, 0, 0)       — no light
    White:   Color(255, 255, 255) — all light
    Red:     Color(255, 0, 0)     — red only
    Gold:    Color(201, 169, 110) — the library's accent

    Midnight background: Color(10, 10, 20)
    That is: very little red, very little green,
    slightly more blue. A deep, cold darkness.
```

Euler's `theme::Color` struct represents this triple and provides mathematical operations:

```rust
let midnight_bg = Color(10, 10, 20);
let gold = Color(201, 169, 110);

// Mix two colors (linear interpolation)
let blend = midnight_bg.mix(&gold, 0.1); // 10% gold

// Lighten (mix toward white)
let lighter = gold.lighten(20); // 20% lighter

// Darken (mix toward black)
let shadow = gold.darken(30); // 30% darker

// Convert to CSS
gold.to_hex()     // "#c9a96e"
gold.to_rgba(0.5) // "rgba(201,169,110,0.5)"
```

All operations are integer arithmetic. There is no floating-point rounding error in color computation. The mix function uses a parameter `t` from 0.0 to 1.0: at `t=0.0`, you get the first color; at `t=1.0`, the second; at `t=0.5`, the midpoint.

This is the same linear interpolation that Euler used to approximate curves. Between any two points, the simplest path is a straight line. Between any two colors, the simplest blend is a linear mix.

### Letter 11: On Themes and the Set of Variables

A theme in Euler is not a predefined set of named fields. It is an *array of key-value pairs*:

```rust
pub struct Theme {
    pub name: &'static str,
    pub vars: &'static [(&'static str, &'static str)],
}

const MIDNIGHT: Theme = Theme {
    name: "midnight",
    vars: &[
        ("--bg-deep", "#06060e"),
        ("--bg", "#0a0a14"),
        ("--text", "#ddd5c4"),
        ("--gold", "#c9a96e"),
        // ... 13 variables total
    ],
};
```

Why pairs instead of named fields? Because **a framework cannot know what variables an application will need.** The Epistolary Library needs `--bg-deep`, `--gold-glow`, `--border-subtle`. A music application might need `--waveform-color`, `--playhead`, `--beat-grid`. A medical dashboard might need `--alert-critical`, `--vitals-normal`, `--chart-bg`.

By using pairs, the theme engine becomes domain-agnostic. Any application defines its own vocabulary of CSS variables. The framework provides the *mechanism* (store themes, switch between them, generate CSS JSON, apply overrides) without dictating the *vocabulary*.

This is the generalization principle. Euler the mathematician did not define separate addition operations for integers, rationals, and reals. He defined addition *once*, abstractly, and showed that it applied to all number systems. The theme engine defines theming *once*, abstractly, and it applies to all design systems.

### Letter 12: On the Override and the Book's Accent

Each book in the Epistolary Library has an accent color. The WebAssembly treatise is gold (#c9a96e). The Rust treatise is copper (#b87333). The Bitcoin treatise is orange (#f7931a). The Euler framework treatise — the one you are reading — is emerald.

When you switch from one book to another, the accent color changes, but the theme stays the same. The Midnight theme with a gold accent is different from the Midnight theme with a copper accent, but they share the same background, text, and border colors.

The `with_overrides()` method handles this:

```rust
// Base theme: Midnight
let css = MIDNIGHT.to_css_json();
// {"--bg":"#0a0a14","--gold":"#c9a96e",...}

// With copper accent:
let css = MIDNIGHT.with_overrides(&[
    ("--gold", "#b87333"),
    ("--gold-bright", "#b87333"),
    ("--gold-dim", "#b87333"),
]);
// {"--bg":"#0a0a14","--gold":"#b87333",...}
```

The theme is not mutated. A new JSON string is generated with the overridden values. This is *immutable transformation* — the original theme is unchanged, and the overridden version is a fresh computation. In a world where the same theme might be rendered simultaneously in two browser tabs with different books open, immutability prevents one tab's accent from leaking into another.

---

## Part V: The Map — URLs as State

### Letter 13: On the Bridges of Königsberg and the Graph of Navigation

In 1736, Euler solved the famous problem of the Bridges of Königsberg: is it possible to walk through the city crossing each of its seven bridges exactly once? Euler proved it impossible — but in doing so, he invented *graph theory*, the study of networks of nodes connected by edges.

A web application is a graph. Each page is a node. Each link is an edge. The URL is the address of the current node:

```
    THE NAVIGATION GRAPH

    index.html ──── read.html?book=wasm
         │              │
         │              ├── #letter-1
         │              ├── #letter-2
         │              ├── ...
         │              └── #letter-40
         │
         ├── read.html?book=rust
         │              │
         │              └── #letter-1 ... #letter-36
         │
         └── read.html?book=euler
                        │
                        └── (you are here)
```

Euler's `router` module parses URLs into their components:

```rust
let route = Route::parse("/read.html?book=wasm#letter-5");
// route.path   = "/read.html"
// route.params = [("book", "wasm")]
// route.hash   = "letter-5"

route.param("book") // Some("wasm")
```

This is pure parsing — no side effects, no browser history manipulation. The router extracts *meaning* from a URL string. What to do with that meaning is the application's decision, not the framework's.

### Letter 14: On the Hash Fragment and the Scroll Target

The hash fragment — the portion of a URL after the `#` symbol — has a special property: it identifies a location *within* a page, not a separate page. When you navigate to `/read.html?book=wasm#letter-12`, the browser loads `read.html`, then scrolls to the element with `id="letter-12"`.

Euler uses this for deep-linking. When a returning reader opens the library, the application knows (from persisted state) that they were reading Letter 12 of the WebAssembly treatise. Instead of showing the hero animation and requiring them to find their place, the application navigates directly to `read.html?book=wasm#letter-12`, and the reader lands exactly where they left off.

The `Route::build()` method constructs these URLs:

```rust
Route::build("/read.html", &[("book", "wasm")], "letter-12")
// "/read.html?book=wasm#letter-12"
```

This is the general principle of *addressability*: every meaningful state of the application should have a URL. If a reader can be at Letter 12 of the WebAssembly treatise, there should be a URL that takes them directly there. If a reader has the Parchment theme with 22px font, there should be a way to encode that (though we encode preferences in localStorage rather than the URL, since they are personal rather than shareable).

---

## Part VI: The Index — Full-Text Search

### Letter 15: On the Inverted Index and the Library Catalog

When you search for a word in a library, you do not open every book to every page. You consult the catalog — an index that maps *subjects to books*, rather than books to subjects. This inversion is the key insight: instead of asking "what is in this book?", you ask "which books contain this subject?"

Euler's `search::Index` is an inverted index. When a document is added, it is *tokenized* — broken into individual words, lowercased, with common words (stopwords) removed. Each remaining word is mapped to the document that contains it, along with how frequently it appears:

```
    INVERTED INDEX

    After indexing two documents:
      doc1: "Transistors are the foundation of computation"
      doc2: "Memory safety without garbage collection"

    The index looks like:

    "transistors" → [(doc1, 0.20)]
    "foundation"  → [(doc1, 0.20)]
    "computation" → [(doc1, 0.20)]
    "memory"      → [(doc2, 0.25)]
    "safety"      → [(doc2, 0.25)]
    "garbage"     → [(doc2, 0.25)]
    "collection"  → [(doc2, 0.25)]

    Stopwords removed: "are", "the", "of", "without"
    These carry no meaning for search.
```

### Letter 16: On TF-IDF and the Weight of Words

Not all words are equally important. The word "computation" in a book about WebAssembly is unremarkable — it appears in every chapter. But the word "computation" in a book about gardening would be extraordinary and highly relevant to a search.

TF-IDF (Term Frequency × Inverse Document Frequency) captures this intuition:

```
    TF-IDF SCORING

    TF(term, document) = occurrences of term in document
                         ─────────────────────────────────
                         total words in document

    IDF(term) = ln( total documents )
                   ──────────────────
                   documents containing term

    Score = TF × IDF

    A word that appears often in one document (high TF)
    but rarely across the corpus (high IDF)
    gets a high score. It is distinctive.

    A word that appears everywhere (low IDF)
    gets a low score. It is generic.
```

This is the same principle behind information theory. Claude Shannon proved in 1948 that the *information content* of a message is inversely proportional to its probability. A message that says "the sun rose this morning" carries almost no information — you expected it. A message that says "the sun did not rise this morning" carries enormous information — it is unexpected.

TF-IDF applies Shannon's insight to search: a word's relevance is proportional to its unexpectedness in the corpus.

### Letter 17: On Snippets and the Art of Context

When search results are displayed, the user needs context — not just the document title, but a *snippet* showing where the query appears in the text. Euler's search engine extracts snippets by finding the first occurrence of any query term and returning the surrounding 120 characters, aligned to word boundaries:

```
    SNIPPET EXTRACTION

    Query: "transistor"
    Document: "...Consider the humblest thing in all of
    engineering: a switch. A transistor is a switch made
    of silicon. It is so small that billions fit..."

    Snippet: "...engineering: a switch. A transistor is a
    switch made of silicon. It is so small..."
```

The snippet provides just enough context for the reader to decide whether this result is what they are looking for. It is the literary equivalent of a book's blurb — not the whole story, but enough to invite reading.

---

## Part VII: The Bridge — WASM and JavaScript

### Letter 18: On the Boundary Between Two Worlds

WebAssembly and JavaScript are separate execution environments. WASM has its own linear memory — a flat byte array. JavaScript has its own garbage-collected heap. They cannot directly access each other's memory. They communicate through a *boundary* — a narrow channel through which values can pass.

The tool that creates this channel is `wasm-bindgen`. When you annotate a Rust struct with `#[wasm_bindgen]`, the compiler generates JavaScript glue code that:

1. Allocates the struct in WASM's linear memory when `new()` is called
2. Returns an opaque handle (an integer) to JavaScript
3. When JavaScript calls a method, the handle is passed back to WASM, which uses it to find the struct in memory
4. Return values are serialized: numbers pass directly, strings are encoded to UTF-8

```
    THE BOUNDARY

    JavaScript                    WASM Linear Memory
    ┌──────────┐                  ┌──────────────────┐
    │          │                  │  [AppState at    │
    │  handle  │─── points to ───│   address 4096]  │
    │  = 4096  │                  │                  │
    │          │                  │  theme: midnight │
    │          │                  │  fontSize: 19    │
    │          │                  │  ...             │
    └──────────┘                  └──────────────────┘

    euler.set_theme("parchment")
      → calls WASM function with handle 4096
      → WASM finds AppState at address 4096
      → mutates theme field in linear memory
      → increments version counter
      → returns void (no data crosses the boundary)

    euler.theme_css_json()
      → calls WASM function with handle 4096
      → WASM reads AppState, builds JSON string
      → copies string to a shared buffer
      → returns pointer + length to JS
      → JS decodes UTF-8 at that pointer
```

Every boundary crossing has a cost. Primitive values (numbers, booleans) are cheap — they pass as a single integer. Strings are more expensive — they must be encoded to UTF-8 on the WASM side and decoded on the JavaScript side. The art of framework design at the WASM boundary is to minimize crossings and maximize the work done between them.

### Letter 19: On the Shell and the Nervous System

The JavaScript shell — `euler-shell.js` — is the nervous system that connects Euler's brain to the browser's body. It is deliberately thin: 120 lines. It does five things:

```
    THE FIVE DUTIES OF THE SHELL

    1. BOOT
       Load WASM binary, instantiate Euler,
       hydrate from localStorage.

    2. PERSIST
       On state changes, serialize to localStorage.
       Debounced: waits 500ms for changes to settle.

    3. APPLY THEME
       Read euler.theme_css_json(), parse it,
       set CSS custom properties on document root.

    4. APPLY TYPOGRAPHY
       Read font_size, line_height, content_width,
       set CSS custom properties on document root.

    5. MIGRATE
       On first boot, check for old localStorage keys
       from the previous lib.js format, merge them into
       euler's unified state, persist, clean up old keys.
```

The shell does not make decisions. It does not hold state. It does not compute derived values. It is an *adapter* — converting Euler's abstract outputs into the browser's concrete APIs. This is the same role a device driver plays in an operating system: translating between the kernel's abstract file operations and the hardware's specific register protocols.

### Letter 20: On the Migration and the Backward-Compatible Archive

When the Epistolary Library upgraded from `lib.js` (the old JavaScript state management) to Euler (the new WASM framework), every existing reader's data had to survive the transition. Their reading progress, bookmarks, highlights, and theme preferences were stored in five separate localStorage keys:

```
    OLD FORMAT (lib.js)

    epistolary_progress:  {"wasm":{"chaptersRead":12,...}}
    epistolary_theme:     "midnight"
    epistolary_typography: {"fontSize":19,...}
    epistolary_bookmarks: {"wasm":[...]}
    epistolary_highlights: {"wasm":[...]}

    NEW FORMAT (euler)

    euler_state:          {"theme":"midnight","fontSize":19,
                           "reading":{"wasm":{...}},
                           "bookmarks":{...},"highlights":{...}}
```

The migration function in the shell checks: does `euler_state` exist? If so, use it. If not, check for the five old keys, merge them into the new format, hydrate Euler, persist in the new format, and delete the old keys.

This is the principle of *backward compatibility*: new systems must respect the data created by old systems. Every database migration, every file format upgrade, every API version change faces this challenge. The cost of breaking backward compatibility is not technical — it is *human*. It is the reader who returns to the library and finds their bookmarks gone.

---

## Part VIII: The First Proof — The Epistolary Library

### Letter 21: On the Application Layer

The five modules are theorems. The application layer — `lib.rs` — is the first proof: the Epistolary Library, a reading application for technical treatises.

The application defines its domain types:

```rust
struct ReadingState {
    chapters_read: u32,
    total_chapters: u32,
    scroll_position: f64,     // 0.0-1.0 fraction of page
    current_chapter_id: String,
    last_read: f64,           // Unix timestamp in milliseconds
}

struct Bookmark {
    chapter_id: String,
    timestamp: f64,
}

struct Highlight {
    id: String,
    chapter_id: String,
    text: String,
    color: String,    // "gold", "coral", "teal", "lavender"
    note: String,
    timestamp: f64,
}
```

These types are specific to a reading application. A music app would have `Track`, `Playlist`, `PlaybackState`. A chat app would have `Message`, `Conversation`, `User`. The framework does not know or care about these types — it provides the infrastructure (JSON, versioning, theming, routing, search) that every application needs.

### Letter 22: On the Hero Decision and the Returning Reader

One of the most impactful decisions the application makes is whether to show the hero screen — the full-screen animated gateway that greets new readers.

```rust
pub fn should_show_hero(&self, book_id: &str) -> bool {
    match self.state.get().reading.get(book_id) {
        Some(rs) => rs.chapters_read == 0,
        None => true, // First visit — show the ceremony
    }
}
```

A new reader sees the hero: the particle field, the sacred geometry, the title rising into view. This is the *ceremony of arrival* — the experience of entering a space for the first time.

A returning reader skips the hero entirely. They have already been welcomed. They are residents, not visitors. The application takes them directly to where they left off, using the scroll target:

```rust
pub fn get_scroll_target(&self, book_id: &str) -> String {
    self.state.get().reading.get(book_id)
        .filter(|rs| !rs.current_chapter_id.is_empty())
        .map(|rs| rs.current_chapter_id.clone())
        .unwrap_or_default() // Empty string = start from top
}
```

And the button text adapts:

```rust
pub fn hero_button_text(&self, book_id: &str) -> String {
    match self.state.get().reading.get(book_id) {
        Some(rs) if rs.chapters_read > 0 &&
                     rs.chapters_read < rs.total_chapters =>
            format!("Continue from Letter {}", rs.chapters_read),
        Some(rs) if rs.chapters_read > 0 =>
            "Read Again".to_string(),
        _ => "Begin Reading".to_string(),
    }
}
```

Three states. Three messages. The logic is a simple match expression — but it transforms the user experience from "every visit feels like the first time" to "the library remembers you."

### Letter 23: On Sorting and the Correct Order

The library hub displays book cards that can be sorted by various criteria. The sort function demonstrates how Euler's type system prevents the bug that plagued the JavaScript implementation (where progress sort was accidentally reversed):

```rust
"progress" => books.sort_by(|a, b| {
    let pa = /* progress fraction of a */;
    let pb = /* progress fraction of b */;
    pb.partial_cmp(&pa)  // pb before pa = DESCENDING
        .unwrap_or(std::cmp::Ordering::Equal)
}),
```

The `pb.partial_cmp(&pa)` comparison puts `b` first — higher progress books appear first. In the JavaScript version, the variables were swapped, putting lower progress first. The bug was invisible in the code review because `pa - pb` vs `pb - pa` looks almost identical. In Rust, the comparison direction is explicit: `pb.cmp(&pa)` means "sort by descending."

This is why Euler's state logic lives in Rust rather than JavaScript: the type system catches classes of errors that human review misses.

### Letter 24: On Bookmarks, Highlights, and the Study System

The study system provides three operations: bookmark a chapter, highlight a passage, and export notes as Markdown.

Bookmarks are simple: a chapter ID and a timestamp. Toggle on, toggle off.

Highlights carry more data: an ID (generated by JavaScript's `crypto.randomUUID()`), the chapter, the selected text, a color (gold, coral, teal, or lavender), an optional note, and a timestamp. Euler stores these but does not render them — rendering (wrapping text in colored `<span>` elements) is JavaScript's job.

The export function composes everything into Markdown:

```markdown
# Study Notes: Letters on the Universal Machine

---

## Bookmarks

- letter-5-on-registers-and-the-counting-machine

---

## Highlights

### letter-1-on-switches-and-truth

> "A transistor is a switch made of silicon." *(gold)*
>
> **Note:** This is the foundational insight — everything reduces to switches.
```

This is a complete, portable document. The reader can paste it into Obsidian, Notion, or any Markdown editor. Their study notes leave the library and travel with them.

---

## Part IX: The Composition

### Letter 25: On the Independence of Modules

Consider the five senses: sight, hearing, touch, taste, smell. Each operates independently — you can see without hearing, hear without tasting. But they compose: the experience of eating a meal involves taste, smell, sight, and texture simultaneously. The senses are *independent but composable*.

Euler's modules have this property:

- `json` depends on nothing. It is the foundation — the tongue.
- `store` depends on nothing. It is self-contained.
- `theme` depends on `json` (to generate CSS JSON). One dependency.
- `router` depends on nothing. Pure parsing.
- `search` depends on nothing. Self-contained index.

```
    MODULE DEPENDENCY GRAPH

    json ◄──── theme
      ▲
      │
    store     router     search

    (Four modules have zero dependencies.
     One module depends on json.
     No cycles. No hidden coupling.)
```

This independence means each module is testable in isolation. `cargo test` runs 44 tests across all modules, and each test exercises one module without touching the others. If the search module has a bug, the theme tests still pass. If the router is refactored, the JSON tests are unaffected.

### Letter 26: On Reuse and the Second Application

Suppose you wish to build a weather dashboard using Euler. The domain types are entirely different: `Temperature`, `Forecast`, `Station` instead of `ReadingState`, `Bookmark`, `Highlight`. But the infrastructure is identical:

- `json`: serialize forecasts to localStorage, parse API responses
- `store`: version-tracked state, render only when data changes
- `theme`: dark mode / light mode, chart accent colors
- `router`: `/dashboard?station=LAX#hourly` → parse station ID, tab
- `search`: search across weather stations by name or code

You write a new `lib.rs` with your domain structs and `#[wasm_bindgen]` methods. The five modules come along unchanged. This is the power of generalization: the theorems are proven once; the proofs are written for each application.

### Letter 27: On the Future and the Component Model

The Euler framework, as it exists today, has one `#[wasm_bindgen]` entry point — the `Euler` struct. All state and all methods live on this single struct. This is sufficient for a single-page application, but it does not yet compose.

The next evolution is the *component model*: multiple independent components, each with their own state, communicating through defined interfaces. This mirrors the WIT (WebAssembly Interface Types) pattern that the `wit-components` crate demonstrates:

```
    FUTURE: COMPONENT COMPOSITION

    ┌─── Reading Component ──────────┐
    │  State: book, chapter, scroll  │
    │  Renders: main content area    │
    └──────────────┬─────────────────┘
                   │ (interface)
    ┌──────────────┴─────────────────┐
    │  State: bookmarks, highlights  │
    │  Renders: study panel          │
    └─── Study Component ────────────┘
```

Each component is a separate WASM module with its own linear memory. They communicate through shared interfaces — not shared memory. This is the Plan 9 model: every service presents a file-like interface, and services compose by mounting each other's interfaces.

This evolution is not yet implemented. It is described here because Euler's architecture — the module independence, the version-tracked state, the thin shell pattern — was designed with this future in mind. The pieces are ready. The composition awaits.

---

## Part X: The Archmage's View

### Letter 28: On the Binary and the Weight of Knowledge

The complete Euler framework compiles to 206 kilobytes of WebAssembly. Let us understand what that means.

206KB is approximately:
- 40 pages of printed text
- One high-resolution photograph
- 3 seconds of compressed audio
- The first three seconds of a mobile network connection

In those 206KB lives:
- A JSON parser and serializer
- A versioned state container
- A theme engine with color mathematics
- A URL router
- A full-text search engine with TF-IDF scoring
- An entire reading application with bookmarks, highlights, progress tracking, sorting, filtering, and export

For comparison:
- React (minified): 130KB
- Angular (core): 300KB+
- Vue: 90KB
- jQuery: 87KB

Euler provides more functionality than jQuery in 206KB, while running in WASM — which means no JIT compilation, no garbage collection pauses, and deterministic performance.

### Letter 29: On Testing and the Verified Foundation

Euler the mathematician was famous for his computational verification. He did not merely prove theorems — he checked them against specific cases. When he discovered the formula for the sum of reciprocal squares (π²/6), he verified it by computing the sum to many decimal places.

The Euler framework has 44 tests across all modules:

```
    TEST DISTRIBUTION

    json:    8 tests  (parser, writer, roundtrip, edge cases)
    store:   3 tests  (version increment, read-only, set)
    theme:   6 tests  (color math, CSS generation, overrides, lookup)
    router:  7 tests  (parse, build, full URL, hash, decode)
    search:  6 tests  (basic search, TF-IDF ranking, in-doc, snippets)
    lib.rs: 14 tests  (hero text, bookmarks, round-trip, sort, search)
    ────────────
    Total:  44 tests, all passing
```

Each test verifies a specific property:

- **Round-trip**: `hydrate(dehydrate(state)) === state`
- **Version tracking**: `get()` doesn't bump, `get_mut()` does
- **Sort order**: progress sort puts most-read books first
- **Theme overrides**: accent colors replace gold but preserve background
- **Search ranking**: documents mentioning the query term score higher
- **URL parsing**: full URLs, relative paths, hashes, encoded characters

### Letter 30: On the Source and the Invitation

The complete source code of the Euler framework is 1,836 lines of Rust:

```
    SOURCE DISTRIBUTION

    json.rs    371 lines   The tongue
    store.rs    81 lines   The memory
    theme.rs   195 lines   The aesthetics
    router.rs  168 lines   The map
    search.rs  264 lines   The index
    lib.rs     757 lines   The first proof
    ──────────────────
    Total     1,836 lines
```

Every line is readable by a programmer with basic Rust knowledge. There is no macro magic, no procedural macros, no unsafe code, no trait wizardry. The code reads as it executes: sequentially, predictably, and transparently.

This is the Eulerian aesthetic: the proof should be readable by the reader it is intended for. Euler's letters to the Princess used no symbol she could not understand. The Euler framework uses no Rust feature that a second-year programmer could not follow.

The source is at `crates/euler/src/`. The invitation is open. Read it. Modify it. Build your own application on it. The modules are your inheritance. The proofs are yours to write.

---

## Epilogue

### Letter 31: On the Circle That Closes

You have now read a treatise about the framework that renders the treatise you are reading. The themes that color your screen were generated by `theme.rs`. The reading progress that let you resume where you left off was tracked by `store.rs`. The chapter you are reading was serialized by `json.rs`. The URL in your address bar was parsed by `router.rs`. If you searched for this passage, `search.rs` found it for you.

This self-reference is not a novelty. It is the deepest test of generality. A system that cannot describe itself is incomplete — this is Gödel's lesson. A system that *can* describe itself, clearly and without paradox, has achieved a form of completeness that mathematics calls *reflection*.

Euler the mathematician achieved reflection many times. His notation — f(x), Σ, e, i, π — became the language in which mathematics describes itself. His methods — power series, infinite products, generating functions — became the tools with which mathematicians discover new mathematics. He did not merely solve problems. He created the language and the tools that made future problems solvable.

The Euler framework aspires to the same. Not because 1,836 lines of Rust can rival the work of history's most prolific mathematician, but because the *method* is the same: start from axioms (the five modules), verify each one independently (44 tests), and compose them into proofs (applications) that are more than the sum of their parts.

The next treatise in this library will be powered by Euler. So will the next application you build, if you choose to build on this foundation. The modules are general. The proofs are specific. The method is timeless.

Euler would recognize it — not because it is clever, but because it is simple. The fewest axioms. The maximum generality. Everything composes.

---

*Go, now, and build something that composes.*
