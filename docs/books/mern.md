# Letters on the Stack of Reactive Threads

### A Treatise on the MERN Architecture — MongoDB, Express, React, Node — and the Discipline of Declaring What Should Be

*In the manner of Euler's Letters to a German Princess*

---

## Preface

Dear Reader,

There is a small but consequential decision that every craftsperson makes, often without naming it. When the tailor cuts the cloth, she may either *describe the garment she wants* and let the cloth find its way, or *issue commands at every snip*: cut here, fold here, stitch here. The two methods produce the same dress, but they are different acts of mind. The first is **declarative** — the worker speaks of the result. The second is **imperative** — the worker speaks of the steps.

The MERN stack — MongoDB, Express, React, Node — is the same four counters as MEAN, with one substitution that changes everything about how the application is built. Angular is replaced by **React**, and React is, at its heart, a declarative library for user interfaces. You do not tell React to insert a `<div>` here and remove a `<span>` there. You describe what the screen should *look like* given the current data, and React figures out how to make the actual pixels match. The cloth, given a description, finds its own way.

This change of method has rippled out into a slightly different ecosystem, a slightly different vocabulary, and a slightly different set of decisions a builder must make. We have already studied MEAN; we shall not repeat its lessons here. Instead, this treatise will move quickly through the three letters MERN shares with MEAN — M, E, N — and dwell long on what is genuinely new: the React component, the hook, the state that lives inside a function, the cache that mediates the network, and the full‑stack framework — Next.js — that has come to define how most React applications are actually shipped.

I shall draw, as always, from the world beyond computing. The principle of describing the result rather than the steps is the principle of **the master weaver and the apprentice**: the master sketches the cloth she wants — colors here, motif there, fringe at the edge — and the apprentice's hands resolve the sketch into the loom's mechanical motions. The master does not move the shuttle. She describes the pattern; the loom completes it. React is a loom of this kind, and the developer who learns to think in patterns rather than shuttle‑strokes will write code with a clarity that imperative code can rarely achieve.

By the end of these letters, you will not merely know how to build a MERN application. You will understand why the same four counters, with one substitution, produced a different culture — and you will be able to choose, in the moment of building, whether the master's sketch or the apprentice's hand is the better tool for the cloth at hand.

Let us begin.

---

## Part I: The Stack and the Surprise

*On the substitution that changed everything, on the shared three friends, and on the browser as a function of state*

---

### Letter 1: On the Surprise of Describing Rather Than Doing

Dear Reader,

To understand React, you must first feel the old way it replaced. Let me show you. Suppose Aminata — the same trader from our MEAN letters, now in a small office in Treichville — wants a counter on her dashboard that shows the number of bales sold today, with a button beside it to record one more sale. In the old, imperative style of JavaScript, the code would look like this:

```javascript
let sold = 0;

const counter = document.createElement('span');
counter.textContent = sold;

const button = document.createElement('button');
button.textContent = 'Record sale';
button.addEventListener('click', () => {
  sold = sold + 1;
  counter.textContent = sold;
});

document.body.appendChild(counter);
document.body.appendChild(button);
```

Read this slowly. Every action the user might take has a hand‑written DOM update. The variable `sold` lives in memory. The text inside the `<span>` is a *separate* piece of state — and the programmer is responsible for keeping the two in sync. Every time `sold` changes, `counter.textContent` must be set, by hand. If you forget the line `counter.textContent = sold`, the variable still increments but the screen does not. The data and the view drift apart.

Now look at the same feature in React:

```jsx
function SaleCounter() {
  const [sold, setSold] = useState(0);

  return (
    <div>
      <span>{sold}</span>
      <button onClick={() => setSold(sold + 1)}>Record sale</button>
    </div>
  );
}
```

The function *returns a description* of what the screen should look like, given the current `sold`. There is no DOM creation, no `appendChild`, no manual update. When `setSold` is called, React re‑runs the function, gets a new description, and *figures out the minimum change* to apply to the actual DOM so that the screen matches the new description. The developer never touches the DOM.

This is the surprise. The two snippets do the same thing, but the second is a different kind of program. It does not *act on* the screen; it *describes* the screen. The screen becomes a *function* of the state. Change the state; the screen follows. There is no possibility of drift, because there is no separate hand‑written update; the framework recomputes the entire description and reconciles.

This is what is meant by **declarative UI**, and it is the central insight of React. Once you internalize it, an entire category of bugs disappears — the bugs where the data was right but the screen was wrong, where you remembered to update the variable but forgot to update the DOM. React makes those bugs structurally impossible.

The parallel from African craft is precise. When a Kente weaver sits at her loom in Bonwire, she does not say, "now my left hand will lift this heddle, my right hand will throw this shuttle, my foot will press this treadle." She holds, in her head, the *pattern* she is weaving — the Nsroma star, the Mate Masie wisdom, the colours of the chieftaincy of her ancestors. Her hands resolve the pattern into mechanics, but the pattern is what she thinks. The Kente cloth is *declared*; the loom *resolves*. React invites the programmer into this same posture.

In the next letter we shall briefly review the M, E, and N of MERN — which are the same as MEAN — and then we shall spend the rest of these letters in the surprising country of React itself.

---

### Letter 2: On the Same Three Friends — M, E, N

Dear Reader,

The M, the E, and the N of MERN are exactly the M, E, and N of MEAN. If you have read those letters, you know almost everything you need. Let me give you, for completeness, the briefest tour, with pointers back to the deeper letters where each lives.

**M — MongoDB** is the document database. Its unit of storage is a JSON‑like document; its unit of grouping is a collection. It accepts documents of any shape, indexes them by chosen fields, replicates across servers for endurance, and is accessed in Node.js through the **Mongoose** ODM, which adds schemas and validation. The whole story is told in Part II of the MEAN treatise; everything there applies here without alteration.

```javascript
import mongoose from 'mongoose';

const stockSchema = new mongoose.Schema({
  sku:      { type: String, required: true, unique: true },
  name:     String,
  yards:    { type: Number, min: 0 },
  in_stock: { type: Boolean, default: true }
});

export const Stock = mongoose.model('Stock', stockSchema);
```

**E — Express** is the minimalist HTTP server library. It composes routes and middleware into chains that turn requests into responses. The chain pattern, the route handler shape, the REST grammar — all carry over from MEAN's Part III.

```javascript
import express from 'express';
const app = express();

app.use(express.json());

app.get('/api/stock', async (req, res) => {
  const items = await Stock.find();
  res.json(items);
});

app.post('/api/stock', async (req, res) => {
  const item = await Stock.create(req.body);
  res.status(201).json(item);
});
```

**N — Node.js** is the runtime. Single‑threaded event loop, non‑blocking I/O, async/await for asynchronous composition, npm for inherited code, ES modules for organization. Everything from MEAN's Part IV applies.

What differs in MERN is *the kind of code that consumes these three friends from the client side*. In MEAN, an Angular service called the Express API and integrated tightly with the framework's RxJS streams. In MERN, a React component will call the same API — perhaps directly, perhaps through a fetching library like **React Query** or **SWR**, perhaps through a state manager like **Redux** — but with a different vocabulary and a different philosophy.

The Express API itself is *unchanged*. The MongoDB schema is *unchanged*. The Node runtime is *unchanged*. The replacement of A by R changes only the topmost counter: the city the user sees.

There is one practical difference worth noting at the start. MEAN applications were typically deployed as two pieces — an Angular bundle served as static files, and a separate Express API. MERN applications, in the modern era, are usually deployed as a single piece through a framework called **Next.js**, which colocates the React UI and the Node API in one project, one build, one deployment. We shall reach Next.js in Part V. For now, hold the image of two separate pieces — a React frontend talking to an Express backend — as your mental model, and we shall complicate it later.

In the next letter we shall examine the central mental model of React: the browser as a *function of state*.

---

### Letter 3: On the Browser as a Function of State

Dear Reader,

The deepest mental shift in learning React is to stop thinking of the browser as a *canvas you paint on* and start thinking of it as a *display that shows whatever you describe*. The distinction matters because every confusing thing about React — re‑renders, keys, dependency arrays, memoization — flows from this single shift.

In the painting model, the program holds a brush and updates pixels by hand. The state of the canvas — the colors at each location — is a thing the program manages directly. If the program forgets to repaint a corner, the corner stays the old color. The state of the canvas can drift from the program's intentions.

In the description model, the program holds *no brush*. It produces, on demand, a *description* of what the canvas should look like. A separate machine — React, the renderer, the reconciler — reads the description and updates the canvas to match. The state of the canvas cannot drift, because the program does not own it.

```
    THE FUNCTION-OF-STATE MODEL

       state          UI = function(state)
        │
        │  React calls the function
        ▼
    description ────► reconciler ────► actual DOM


    User interaction:
       event ──► setState ──► function re-runs ──► new description ──►
       reconciler ──► minimal DOM patch ──► screen updates
```

Read this diagram carefully. The state changes. The function — your component — runs again. It produces a new description of what the screen should look like. React compares the new description to the previous one (in a fast in‑memory representation called the **virtual DOM**, which we shall examine in the next letter). React computes the minimal patch needed to make the actual DOM match. The browser repaints.

This entire cycle is what React calls a **render**. A render does not mean "draw pixels." A render means "run the component function again, produce a new description, reconcile." Drawing pixels happens at the end, in the browser's compositor, and is not under React's direct control.

The implications are profound, and you will not internalize them in one letter. But here are the three you should hold:

**A component is a function.** It takes inputs (props, state) and returns a description of what the screen should look like. It does not have a "do this, then this, then this" sequence. It has one job: given these inputs, produce this output. The same inputs always produce the same output (in pure React; impure cases we shall meet).

**State is the only mover.** The screen changes if and only if state changes. Therefore, to change what the user sees, you change state. To make a counter increment, you do not modify a `<span>`; you change the counter's state, and React rebuilds whatever description includes that state.

**Re‑rendering is cheap, mostly.** Because the function is a pure description and React only patches what differs, re‑rendering a component is fast. You do not need to obsess about optimizing every render. You optimize when measurement shows you must, and React provides tools for it — but the default should be: *let it re‑render*.

The parallel from old Africa is the **griot's recitation**. A griot does not memorize a list of mechanical actions ("now make this sound, now make that sound"). She holds in her head the genealogy — the *state* of the family she is reciting — and her voice resolves that state into the song. Ask her to start over from a different ancestor, and she does not search through her body for the right motions; she queries her mental state and the voice flows. The griot is a function of the genealogy; the song is the output. Change the input (a different family); the output (a different song) follows naturally.

This is the posture React asks you to adopt. The browser is the song. The state is the genealogy. Your component function is the griot. You change the genealogy; the song follows. You do not move your voice by hand.

In the next letter we shall examine the mechanism that makes this efficient: the **virtual DOM** and React's reconciler.

---

## Part II: React Itself

*On the virtual DOM, on JSX, on components, on props, and on state in a function*

---

### Letter 4: On the Virtual DOM and the Reconciler

Dear Reader,

The actual DOM — the browser's tree of HTML elements — is slow to manipulate. Every change to it can trigger layout calculations, repainting, compositing. A naive implementation of "describe the screen, then make the DOM match" would be unworkably slow: every state change would require comparing your description to the entire DOM and dispatching dozens of operations.

React's solution is the **virtual DOM** — a lightweight in‑memory representation of the description. The virtual DOM is just a tree of plain JavaScript objects: `{type: 'div', props: {className: 'card'}, children: [...]}`. Comparing two such trees is fast — pure JavaScript operations, no browser calls. Once React knows the differences between the previous tree and the new tree, it dispatches only the minimal set of operations to the real DOM.

```
    THE RECONCILIATION CYCLE

    PREVIOUS RENDER                NEW RENDER
    virtual DOM (in memory)        virtual DOM (in memory)

         div                            div
          │                              │
          ├── span: "0"                  ├── span: "1"     ← changed!
          └── button: "Record"           └── button: "Record"

    React compares the two trees in JavaScript memory.
    It finds exactly one difference: the span's text.
    It dispatches one DOM operation:
        actualSpan.textContent = "1"

    Everything else is left untouched. No layout. No repaint
    of unchanged regions. The browser sees exactly one byte
    of text change.
```

This algorithm has a name — **reconciliation** — and a precise specification. It is not, as one might assume, a recursive equality check. It is a *heuristic* tuned for the patterns React applications produce. The two rules to know:

**Elements of different types produce different subtrees.** If the previous tree had a `<div>` here and the new tree has a `<section>`, React does not try to preserve children; it discards the entire old subtree and mounts a fresh one. This is fast, and it matches the developer's intent: when you change the element type, you mean a fundamentally different node.

**Lists need keys.** When React reconciles a list of children, it pairs them by *position* unless you give each child a `key` prop. If the order changes — items added, removed, reordered — without keys, React patches the wrong children. With keys, React pairs by identity:

```jsx
{bales.map(bale => (
  <BaleCard key={bale._id} bale={bale} />
))}
```

The `key={bale._id}` lets React track each card across renders. If you delete the first bale, React removes the first DOM node and leaves the rest in place. Without keys, React would patch every card's props and remove the last DOM node — same result, but with twelve operations instead of one.

The deeper meaning: the virtual DOM is *not* a fundamental requirement of declarative UI. Some newer frameworks — Svelte, SolidJS — achieve the same declarative feel without a virtual DOM, by compiling components directly to surgical DOM updates. The virtual DOM is React's specific *implementation choice* for the description‑and‑reconcile model. It is not the model itself.

For the engineer, three practical takeaways. First, *do not optimize the virtual DOM* — React is faster than you expect. Second, *always provide keys for lists* — failing to do so is the single most common React mistake. Third, *understand that re‑rendering is the default* — components re‑render on every state change of themselves or their ancestors, and most of the time this is fine.

In the next letter we shall examine **JSX** — the syntax that lets you write the description as if it were HTML, and how it is in fact ordinary JavaScript underneath.

---

### Letter 5: On JSX and the Marriage of Code and Markup

Dear Reader,

When React was first released in 2013, the JavaScript community recoiled. The cause was a syntax that looked, to professional programmers, like a category error: HTML inside JavaScript files.

```jsx
function Greeting({ name }) {
  return <h1>Hello, {name}</h1>;
}
```

For two decades the wisdom had been: *separate structure from behavior*. HTML in one file, JavaScript in another. The function above appears to violate this wisdom in the worst possible way — by mixing the two languages on a single line. Many engineers, on first encounter, declared they would never use such an unholy thing. Twelve years later, JSX has become the most successful syntactic experiment in modern programming, and the original objection has been answered by a deeper question: *what was actually being separated?*

The answer is that HTML and JavaScript were not being separated by *concern*; they were being separated by *file*, which is a different and weaker thing. The structure of a counter component and the behavior of a counter component are part of the same concern: the counter. Separating them into two files merely scattered the same concern across the filesystem. JSX returns the concern to a single location.

But JSX is not, in fact, HTML. It is a syntactic shorthand for JavaScript function calls. The above code is, after a build step, exactly equivalent to:

```javascript
function Greeting({ name }) {
  return React.createElement('h1', null, 'Hello, ', name);
}
```

`React.createElement(type, props, ...children)` returns a plain JavaScript object — the virtual DOM node we met in the previous letter. JSX is just a more readable way to write nested `createElement` calls. The browser does not run JSX; a compiler (Babel, esbuild, SWC) translates it to JavaScript before it ships.

The rules of JSX are few but unforgiving:

**Tags must close.** Either `<div>...</div>` or self‑closing `<img />`. Unlike HTML, you cannot leave tags open.

**Expressions go in braces.** `{name}` evaluates a JavaScript expression and inserts its value. `{2 + 2}` renders `4`. `{user.name}` renders the user's name.

**Attributes use camelCase.** `className`, not `class`. `htmlFor`, not `for`. `onClick`, not `onclick`. The reason: `class` and `for` are reserved words in JavaScript; the rest follow for consistency.

**There must be one root element.** Either wrap in a tag, or use a *Fragment* — `<>...</>` — which renders no DOM node but groups children:

```jsx
function Toolbar() {
  return (
    <>
      <button>Save</button>
      <button>Cancel</button>
    </>
  );
}
```

**Inline styles are objects, not strings.** `style={{ color: 'red', fontSize: 16 }}`. The double braces are: outer for "JSX expression," inner for "JavaScript object."

JSX rewards two practices. First, *extract subcomponents early*. If your component's JSX exceeds the screen, it is doing too much; break it into smaller functions. Second, *use JavaScript freely inside braces*. Map over arrays, use ternaries for conditional rendering, call helper functions:

```jsx
function StockList({ bales }) {
  if (bales.length === 0) {
    return <p>No bales in stock.</p>;
  }
  return (
    <ul>
      {bales.map(bale => (
        <li key={bale._id}>
          {bale.name} — {bale.yards} yards
          {bale.in_stock ? <Badge type="ok">In stock</Badge> : <Badge type="warn">Sold</Badge>}
        </li>
      ))}
    </ul>
  );
}
```

This component is twelve lines and describes the entire list view. The map produces children; the ternary chooses which badge to show; the strings interpolate the data. There is no template engine, no separate templating language — just JavaScript expressions inside braces inside a function.

The parallel from African textile tradition: in **Adinkra cloth printing**, the stamp is carved from calabash and *embedded directly into the printer's grasp*. The carver does not separate "what to print" from "how to apply it." The motif and the application live in the same hand, made together, used together. JSX is this: the description of the screen and the language that drives the description live in the same function, in the same file, in the same hand. The separation that was promised by "HTML in one file, JavaScript in another" was the separation of *places*, not of *concerns*. JSX gives back the unity of concern and asks the developer to manage true separation — the boundary between components — at the right level.

In the next letter we shall examine **components** — the unit of reuse and the only kind of thing React renders.

---

### Letter 6: On Components, Functions, and the Death of Classes

Dear Reader,

A component in React is, in its modern form, *a JavaScript function*. It takes one argument — an object called `props` — and returns JSX. That is the entire shape:

```jsx
function BaleCard({ bale, onBuy }) {
  return (
    <div className="card">
      <h3>{bale.name}</h3>
      <p>{bale.yards} yards</p>
      <button onClick={() => onBuy(bale._id)}>Buy</button>
    </div>
  );
}
```

A function that takes props, returns JSX. No class. No `extends`. No lifecycle methods spread across the page. The unit of reuse is the function, and the function is the unit of reuse.

This was not always so. For React's first five years, components were classes:

```jsx
class BaleCard extends React.Component {
  render() {
    return (
      <div className="card">
        <h3>{this.props.bale.name}</h3>
        <p>{this.props.bale.yards} yards</p>
        <button onClick={() => this.props.onBuy(this.props.bale._id)}>Buy</button>
      </div>
    );
  }
}
```

Same behavior, more ceremony. State lived in `this.state`. Lifecycle methods — `componentDidMount`, `componentDidUpdate`, `componentWillUnmount` — were called by React at specific moments. The `this` keyword required constant attention; arrow functions and `bind` calls cluttered every event handler.

In 2018 React introduced **hooks**, a mechanism that lets function components have state, lifecycle, and context — all the powers that previously required classes — without the ceremony. The community migrated. Today, classes are legacy; new code is written with functions. We shall not teach classes in this treatise. If you encounter them in old codebases, treat them as a dialect: the meaning is the same, the syntax differs.

There are three properties of a function component worth memorizing.

**Components are PascalCased.** `BaleCard`, not `baleCard`. The capital letter is how JSX distinguishes your component from a built‑in HTML element: `<bale-card>` would be interpreted as the HTML tag (and unknown); `<BaleCard>` is interpreted as the function. This rule is enforced by the JSX compiler.

**Props are read‑only.** A component must never mutate its props. If `BaleCard` modifies `bale.name`, it has violated the data flow rule and will produce confusion. Props are inputs; outputs are JSX; data flows downward. If a component needs to *change* something, it must call a function passed in via props (like `onBuy`).

**Components compose.** A component can use other components in its JSX:

```jsx
function StockListPage({ bales }) {
  return (
    <main>
      <h2>Inventory</h2>
      <FilterBar />
      <ul>
        {bales.map(b => <BaleCard key={b._id} bale={b} />)}
      </ul>
      <Pagination />
    </main>
  );
}
```

`StockListPage` includes `FilterBar`, `BaleCard`, and `Pagination`. Those components may include their own children. The result is a tree of components — the same tree we met in MEAN's Angular letters, but expressed entirely in functions instead of decorated classes.

The deepest insight about function components is that they bring the full power of JavaScript functions to UI construction. You can compose them with `map`, return them from other functions, pass them as arguments, store them in arrays. They are not special objects with magic methods; they are functions, and everything you know about functions applies. This was unavailable in the class world; functional UI is a richer programming model than object‑oriented UI.

The African parallel: a function component is the **single‑purpose tool** of a Jua Kali artisan in Nairobi's open‑air workshops. The artisan does not build elaborate hierarchical machines for every job. He builds small, single‑purpose tools: a jig for one cut, a press for one shape, a guide for one alignment. Each tool does one thing well. Tools combine: he uses the jig to position the work, the press to shape it, the guide to check it. The artisan's productivity comes from the *composition of small focused tools*, not from one large machine. React components, after the death of classes, are these single‑purpose tools.

In the next letter we shall examine **props** in depth — the inputs that flow into components — and the unidirectional rule that governs all React data flow.

---

### Letter 7: On Props and the Unidirectional Flow

Dear Reader,

Props are the inputs to a component. They are how a parent passes data to a child. They are how callbacks ride downward through the tree. They are the *contract* a component publishes to the world: "give me these inputs, and I will render this output."

The shape of props is JavaScript object destructuring:

```jsx
function BaleCard({ bale, currency, onBuy, isSelected = false }) {
  // bale, currency, onBuy, isSelected are now local variables
  return (
    <div className={isSelected ? 'card selected' : 'card'}>
      <h3>{bale.name}</h3>
      <p>{currency.symbol}{bale.price}</p>
      <button onClick={() => onBuy(bale._id)}>Buy</button>
    </div>
  );
}

// Used by parent:
<BaleCard
  bale={item}
  currency={{ symbol: 'CFA ' }}
  onBuy={handleBuy}
  isSelected={item._id === selectedId}
/>
```

Four props passed in; four local variables in the function. Defaults can be set in the destructuring (`isSelected = false`). The contract is publicly visible at the top of the function.

Three deeper points about props deserve attention.

**Props flow only downward.** This is the *unidirectional* rule. A parent passes props to a child; the child *never* passes props back to the parent. If a child needs to communicate upward — "the user clicked Buy" — the parent must pass a *callback function* as a prop. The child calls the function; the parent receives the call. The flow remains downward; only the data flowing through the channel changes direction.

```jsx
function StockListPage() {
  const [selectedId, setSelectedId] = useState(null);

  function handleBuy(baleId) {
    console.log('Bale selected:', baleId);
    setSelectedId(baleId);
  }

  return bales.map(b =>
    <BaleCard
      key={b._id}
      bale={b}
      onBuy={handleBuy}              ← child receives a callback
      isSelected={b._id === selectedId}
    />
  );
}
```

The page passes `handleBuy` down. When a card calls `onBuy(b._id)`, the page's function runs; the page updates its own state; the new state flows back down as props. The cycle is closed without any sideways or upward data flow.

**Props can be anything.** Not just strings and numbers. Functions, objects, arrays, React elements, even other components. A common pattern is *render props* or *children as a function*:

```jsx
function Toggle({ children }) {
  const [on, setOn] = useState(false);
  return children({ on, toggle: () => setOn(!on) });
}

// Used:
<Toggle>
  {({ on, toggle }) => (
    <button onClick={toggle}>{on ? 'On' : 'Off'}</button>
  )}
</Toggle>
```

The `children` prop is a function. The parent component calls it with internal state and receives back the JSX to render. This pattern is less common since hooks arrived (we shall meet them in the next letter), but it remains useful and demonstrates how flexible props can be.

**Children are special, but only in syntax.** When you write `<Card>Hello</Card>`, the `Hello` is the value of a special prop called `children`. The component receives it like any other prop:

```jsx
function Card({ title, children }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <div className="body">{children}</div>
    </div>
  );
}

// Used:
<Card title="Welcome">
  <p>This is the body.</p>
  <button>Action</button>
</Card>
```

This composition pattern is how reusable layout components are built — `Card`, `Modal`, `Page`, `Section`. They define structure; their children fill in the content.

The unidirectional flow rule has a deep cousin in African political systems: the **palace messenger system** of pre‑colonial kingdoms. A message from the chief flowed downward through messengers, each authorized to carry it to a specific layer of the kingdom. A reply did not jump levels upward; it traveled back through the same chain, each layer passing it up to its own immediate superior. The hierarchy was preserved; the message was traceable; no village shouted directly at the chief. The discipline produced clarity in a vast structure. React's unidirectional data flow is this discipline, applied to UI: state lives somewhere specific; updates flow through known channels; no component peeks at another's internals.

In the next letter we shall examine **state** — the local memory that distinguishes a static description from a living application — and the hook that introduces it.

---

### Letter 8: On useState and the Local Memory

Dear Reader,

A component that takes only props is *pure*: same props, same output. It cannot remember anything between renders. It cannot count, accumulate, track. For a counter to count, the component must *remember its count*. For a form to accept input, the component must *remember what has been typed*. The memory that lives inside a component is called **state**, and the hook that introduces it is `useState`.

```jsx
import { useState } from 'react';

function SaleCounter() {
  const [sold, setSold] = useState(0);

  return (
    <div>
      <span>{sold} sales today</span>
      <button onClick={() => setSold(sold + 1)}>Record sale</button>
    </div>
  );
}
```

Read this carefully. `useState(0)` declares one piece of state, initialized to `0`. It returns *two things*: the current value (`sold`) and a function to update it (`setSold`). The convention is `[thing, setThing] = useState(...)`. The square brackets are JavaScript array destructuring; the names are by convention.

When the button is clicked, `setSold(sold + 1)` is called. This does two things: it updates the stored state, and it tells React to re‑render the component. On the next render, `useState` returns the new value, and the new value flows through the JSX. The screen updates.

Three properties of state are essential:

**State is local to the component instance.** Two `SaleCounter`s on the same page have independent counts. Each `useState(0)` creates a fresh piece of state for each instance. State is not shared by default; sharing requires lifting it up (next letter) or using context (later letter).

**State is preserved across renders.** Between renders, React remembers the state for each component instance. When the function runs again, `useState` returns the *current* value, not the initial one. The `0` you pass to `useState(0)` is only used on the first render.

**State updates are asynchronous.** When you call `setSold(sold + 1)`, the state does not change immediately. React batches the update and re‑renders shortly afterward. If you read `sold` on the line after the setter, you see the *old* value. To compute the next state from the current state, use the function form:

```jsx
setSold(prev => prev + 1);
```

This guarantees you operate on the latest value, even if multiple updates batch together.

A component can have many pieces of state — each `useState` call creates a separate one:

```jsx
function StockForm() {
  const [sku,   setSku]   = useState('');
  const [name,  setName]  = useState('');
  const [yards, setYards] = useState(0);
  const [error, setError] = useState(null);

  function submit() {
    if (!sku) return setError('SKU required');
    if (yards <= 0) return setError('Yards must be positive');
    fetch('/api/stock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sku, name, yards })
    });
  }

  return (
    <form onSubmit={submit}>
      <input value={sku} onChange={e => setSku(e.target.value)} />
      <input value={name} onChange={e => setName(e.target.value)} />
      <input type="number" value={yards} onChange={e => setYards(Number(e.target.value))} />
      {error && <p className="error">{error}</p>}
      <button type="submit">Save</button>
    </form>
  );
}
```

Four pieces of state. Each input is *controlled*: its `value` is set from state, and its `onChange` updates state. The form's data is the state; the state is the form's truth. There is no `document.getElementById('sku').value` anywhere — the state is the authoritative reading.

The mental shift is summarized as: **state, not the DOM, is the source of truth**. The DOM mirrors state. You read state to know what the user has entered; you set state to change what the user sees. The DOM exists as a presentation layer over state, not as a thing you manipulate directly.

The African parallel: in a council convened under a **baobab tree**, the elder who keeps the record does not consult what each speaker has said by replaying their gestures from memory. He consults his own *written tally* — the names, the votes, the contributions. The gestures were the outward form; the tally is the truth. If the tally disagrees with anyone's recollection, the tally wins. State in React is the council's tally: the source of truth that the rendered UI reflects but does not own.

This concludes Part II. You have seen the virtual DOM, JSX, components, props, and state. In Part III we shall examine the rest of the hooks — `useEffect`, `useContext`, `useMemo`, and custom hooks — that complete React's vocabulary.

---

## Part III: The Hooks

*On useEffect, useContext, useMemo, useCallback, and the composition of behavior in custom hooks*

---

### Letter 9: On useEffect and the Negotiation with Time

Dear Reader,

A pure component takes props and state and returns JSX. But a real application must do more than render. It must fetch data when it appears on screen. It must subscribe to a WebSocket when the page opens and unsubscribe when it closes. It must scroll to the top when the route changes. These are *side effects* — operations that touch the world outside the component. The hook that handles them is **`useEffect`**.

```jsx
import { useState, useEffect } from 'react';

function BaleDetail({ id }) {
  const [bale, setBale] = useState(null);

  useEffect(() => {
    fetch(`/api/stock/${id}`)
      .then(r => r.json())
      .then(setBale);
  }, [id]);

  if (!bale) return <p>Loading…</p>;
  return <h3>{bale.name}</h3>;
}
```

Read this carefully. `useEffect` takes two arguments: a function (the effect) and a *dependency array* (`[id]`). The effect runs *after* the component renders, and it runs again whenever any value in the dependency array changes between renders. Here, when `id` changes — say the user navigates from bale 42 to bale 43 — the effect re‑runs and fetches the new data.

The dependency array is the most important detail. There are three forms:

**`[]`** — empty array. The effect runs *once*, after the first render, and never again. Used for one‑time setup: subscribing to a WebSocket, registering an event listener on `window`, starting an interval.

**`[id, otherDep]`** — explicit dependencies. The effect runs when any listed value changes. Used for reactive operations: refetching when the ID changes, recomputing when the filter changes.

**Omitted** — no array. The effect runs after *every* render. Almost always a mistake; nearly every meaningful use case wants explicit dependencies.

Effects can also return a *cleanup function*, which runs before the next effect or when the component unmounts:

```jsx
useEffect(() => {
  const interval = setInterval(() => {
    console.log('tick');
  }, 1000);

  return () => clearInterval(interval);
}, []);
```

The interval starts on mount; the cleanup stops it on unmount. Without the cleanup, the interval would persist after the component vanished — a memory leak. The cleanup function is what makes effects safe to use for subscriptions and timers.

This pattern — *set up here, tear down there* — is universal. WebSocket connections, event listeners, observers, timers, third‑party SDK initialization. The structure is always: open the connection in the effect, close it in the cleanup, declare dependencies that trigger reopening.

```jsx
useEffect(() => {
  const ws = new WebSocket('wss://api.aminata-shop.com/live');
  ws.onmessage = (msg) => setLatest(JSON.parse(msg.data));

  return () => ws.close();
}, []);
```

There is a danger you must name. *Effects can cause infinite loops*. If an effect calls `setX` and `x` is in its dependency array, the cycle is: render → effect → setX → render → effect → setX → ... forever. The discipline: an effect that updates state should not depend on that state, or should compare values before setting.

A more subtle danger: *effects that should be derivations*. If you find yourself writing `useEffect(() => setFiltered(items.filter(...)))`, you are doing it wrong. The filtered list is *derived* from the items; it does not need its own state. Compute it during render:

```jsx
const filtered = items.filter(x => x.in_stock);
```

This is faster, simpler, and free of bugs. The rule: state for things that change *independently* (user input, server data); derivation for things that change *because* state changed. `useEffect` is for *side effects*, not for derivations.

The African parallel is the **morning fire** in the compound. The fire is not the meal; it is the *condition* under which the meal becomes possible. Someone lights the fire (the setup), someone tends it (the running effect), and someone extinguishes it at the end of the day (the cleanup). The cycle has dependencies — when the season changes, you build a different fire; when guests arrive, you build a larger one. But the fire is always set up, always tended, always cleaned up. `useEffect` is the discipline of fire: set up; tend; clean up; declare what conditions warrant relighting.

In the next letter we shall examine **`useContext`** — the hook that lets state flow across many levels of the component tree without manually passing props at every level.

---

### Letter 10: On useContext and the Family Inheritance

Dear Reader,

There is a problem React faces because of its unidirectional prop flow. Suppose Aminata's application has a theme — light or dark — chosen at the top of the tree. The bale cards, ten levels deep, need to know the theme to render correctly. Passing the theme through every intermediate component's props is exhausting and pollutes intermediate components with data they do not use. This is called **prop drilling**, and the cure is **context**.

A context is a sharing channel through the tree. A *Provider* sets a value at the top; *consumers* read it anywhere below.

```jsx
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext('light');

function App() {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext.Provider value={theme}>
      <Header />
      <Main />
      <Footer />
    </ThemeContext.Provider>
  );
}

function BaleCard({ bale }) {
  const theme = useContext(ThemeContext);
  return <div className={`card card-${theme}`}>{bale.name}</div>;
}
```

The provider — `<ThemeContext.Provider value={theme}>` — wraps the tree. Any component below can call `useContext(ThemeContext)` to read the value. No prop drilling. The card receives the theme directly from the provider, however many levels separate them.

Three properties of context deserve memorization.

**Re‑renders cascade.** When the provider's value changes, every consumer re‑renders. This is correct but has performance implications: if many components consume a frequently changing value, you get many re‑renders. Split contexts to limit the blast radius.

**Default values matter.** `createContext('light')` sets the default — the value seen by a consumer that has no provider above it. Useful for testing and for components used in isolation.

**Context is for tree‑wide values, not for everything.** Use it for theme, locale, current user, feature flags, the auth token. Do not use it to pass form data to a specific descendant — that is prop drilling overuse pretending to be a tree‑wide concern.

A common pattern is to combine context with state to make a custom hook that wraps both:

```jsx
const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  async function login(email, password) {
    const r = await fetch('/api/auth/login', { /* ... */ });
    const { user, token } = await r.json();
    localStorage.setItem('token', token);
    setUser(user);
  }

  function logout() {
    localStorage.removeItem('token');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  return useContext(AuthContext);
}

// Usage anywhere in the tree:
function ProfileMenu() {
  const { user, logout } = useAuth();
  return user
    ? <button onClick={logout}>Logout {user.name}</button>
    : <a href="/login">Login</a>;
}
```

This pattern is the foundation of every real React application. A few providers near the top (auth, theme, locale, query client), a few custom hooks to consume them, and the deep components never know how high the value originated.

The African parallel: the **inheritance of a clan name**. A child born into the Asante family does not need her parents to tell her her clan; the clan is *in the air* of the compound. It is inherited from the head of the family, available to every member without explicit transmission. Context is this inheritance: a value declared at a level becomes available to every descendant without being passed through hand.

In the next letter we shall examine **`useMemo` and `useCallback`** — the hooks for caching computation, and the discipline of using them only when measurement demands.

---

### Letter 11: On useMemo, useCallback, and the Cost of Computation

Dear Reader,

A component re‑renders on every state change. Most of the time, this is cheap. But sometimes a component does expensive work inside its render: a large list sort, a date parsing across thousands of rows, a chart calculation. Doing that work on every render — when only a small unrelated state changed — is wasteful. The hooks that cache results across renders are `useMemo` and `useCallback`.

**`useMemo`** caches a *value*:

```jsx
function StockChart({ bales }) {
  const totalYards = useMemo(() => {
    console.log('Computing total…');
    return bales.reduce((sum, b) => sum + b.yards, 0);
  }, [bales]);

  return <p>Total: {totalYards} yards</p>;
}
```

The arrow function is the *expensive computation*; the dependency array tells React when to *re‑run* it. Here, the total is recomputed only when `bales` changes. If some unrelated state changes — say, the page's theme — the component re‑renders, but the total is reused from cache.

**`useCallback`** caches a *function*:

```jsx
const handleBuy = useCallback((id) => {
  buyBale(id);
}, [buyBale]);
```

This is a special case of `useMemo` — it caches the function reference itself. Why does this matter? Because if you pass a function as a prop to a child that has been wrapped in `React.memo` (the optimization that skips re‑rendering when props are unchanged), a new function reference on every render defeats the memoization. `useCallback` preserves the reference across renders.

Now the warning. *Most components do not need these hooks.* React is fast enough that recomputing a sum, a filter, or a sort across reasonable data sizes is invisible to the user. Adding `useMemo` and `useCallback` everywhere clutters the code without measurable benefit. The rule:

**Profile first. Optimize when measurement shows you must.**

The React DevTools have a profiler that shows render times. Use it. Find the slow renders. *Then* apply `useMemo` to the expensive computation or `useCallback` to the function being passed to a memoized child. Premature memoization is the source of much ugliness in real React codebases.

There is a subtler use of `useMemo`: ensuring **referential stability** for objects passed to context or to memoized children:

```jsx
const value = useMemo(() => ({ user, login, logout }), [user, login, logout]);
return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
```

Without `useMemo`, the object `{ user, login, logout }` is a *new* object on every render, so every consumer of the context re‑renders. With `useMemo`, the object is the same reference when the dependencies are unchanged; consumers re‑render only when something genuinely changed.

The African parallel: the **dried fish market** at Lake Volta. The fishermen who land their catch every dawn do not weigh and label every fish individually before the day's selling — that work is expensive. They label only when there is *demand* for the label: when a buyer asks for a specific weight, when a portion is to be set aside for export, when the official inspector arrives. The default is no labeling; labeling is invoked at the point it earns its cost. `useMemo` is the labeling discipline: do the expensive work only when downstream consumption justifies it; profile to find where the demand actually is.

In the next letter we shall examine **custom hooks** — the mechanism by which React's basic hooks compose into application‑specific reusable behavior.

---

### Letter 12: On Custom Hooks and the Composition of Behavior

Dear Reader,

The hooks we have seen — `useState`, `useEffect`, `useContext`, `useMemo`, `useCallback` — are React's *primitives*. A **custom hook** is what you build by composing them. It is a function whose name begins with `use`, which uses other hooks internally, and which returns a value useful to components.

Here is a custom hook that fetches data with loading and error states:

```jsx
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(url)
      .then(r => r.json())
      .then(d => { if (!cancelled) { setData(d); setLoading(false); } })
      .catch(e => { if (!cancelled) { setError(e); setLoading(false); } });

    return () => { cancelled = true; };
  }, [url]);

  return { data, loading, error };
}

// Used in any component:
function BaleDetail({ id }) {
  const { data: bale, loading, error } = useFetch(`/api/stock/${id}`);

  if (loading) return <p>Loading…</p>;
  if (error)   return <p>Error: {error.message}</p>;
  return <h3>{bale.name}</h3>;
}
```

A single function — `useFetch` — encapsulates the loading state, the error state, the cancellation on unmount, the dependency on `url`. Any component that wants to fetch data calls `useFetch(url)` and gets back the three values it needs. The pattern is reused without copying code.

Custom hooks have one syntactic requirement: their name must start with `use`. This is not a cosmetic rule. React's linter uses the prefix to enforce the **Rules of Hooks**:

**Hooks must be called at the top level.** Not inside loops, conditionals, or nested functions. React relies on the *order* of hook calls to match each call to its stored state. A conditional `useState` would break the order across renders and corrupt every following hook's state.

```jsx
// WRONG
if (loggedIn) {
  const [data, setData] = useState(null);  // breaks the order
}

// RIGHT
const [data, setData] = useState(null);
if (loggedIn) { /* use data */ }
```

**Hooks must be called from React functions.** Either a component (PascalCase) or another custom hook (use‑prefixed). Plain JavaScript functions cannot use hooks; the React runtime would not know which component the state belongs to.

Custom hooks become a library of capabilities — a *vocabulary* of behaviors your application uses repeatedly. A mature React codebase typically has dozens:

```
useAuth()                   - current user, login, logout
useFetch(url)               - generic fetch with loading/error
useDebounce(value, ms)      - debounced version of a value
useLocalStorage(key, init)  - state synced to localStorage
useOnClickOutside(ref, fn)  - call fn when click is outside ref
useMediaQuery(query)        - true if window matches CSS query
useInterval(fn, ms)         - setInterval with cleanup
usePrevious(value)          - previous value of a prop or state
useToggle(initial)          - boolean state + toggle function
```

Each of these is a small function, often under twenty lines. Each composes the React primitives we have studied. Each becomes a reusable verb in your application's vocabulary. Aminata's stock dashboard does not contain raw `useEffect` and `fetch` calls scattered across components; it has `useStockList()`, `useStockDetail(id)`, `useCreateStock()`, each encapsulating both the fetch and the state machine around it.

The composition rules echo across software, but the **Adinkra symbol system** of the Akan provides a striking parallel. Each Adinkra symbol — Sankofa, Gye Nyame, Funtunfunefu — encapsulates a meaning that can be combined with others to express compound ideas. The artist who carves a chief's stool does not invent new symbols for each occasion; she selects from the established vocabulary and arranges them. Custom hooks are the Adinkra symbols of your codebase: a finite, well‑named set of behaviors, combined freely by components to express the application's full grammar.

This concludes Part III. You have the complete hooks vocabulary. In Part IV we shall examine **state beyond a single component** — how applications coordinate state across many components — and the libraries that have grown up to manage it.

---

## Part IV: State Beyond the Component

*On why state outgrows the component, on Redux and its alternatives, and on data fetching as state*

---

### Letter 13: On Why State Outgrows the Component

Dear Reader,

The state we have studied so far lives inside a single component. This works for the counter, the form, the toggle. It breaks the moment two components on opposite sides of the tree need to share state.

Consider Aminata's dashboard. The header shows the cart count. The product grid lets the user add a bale to the cart. The cart page lists the items. These three components are in different branches of the tree. They all need to see the *same* cart. Where does the cart live?

The first answer is **lifting state up**: find the nearest common ancestor of the components that need the state, put the state there, and pass it down as props.

```jsx
function App() {
  const [cart, setCart] = useState([]);

  return (
    <>
      <Header cart={cart} />
      <ProductGrid cart={cart} setCart={setCart} />
      <CartPage cart={cart} setCart={setCart} />
    </>
  );
}
```

This works. It is even *correct* for many applications. But it has two failure modes that become acute as the application grows.

**Prop drilling.** If the components are deep — five or seven levels below the common ancestor — every intermediate component must accept and pass the prop, polluting their interfaces with data they do not use. Context (we saw it in Letter 10) helps here, but it is not the full answer.

**Coordination complexity.** When the state's update rules become complex — "adding to cart with discount applies only if user is logged in and subscription is active and item is in stock" — the update logic lives next to the `setCart` calls scattered across the tree. There is no single place to read what the cart can become. The state machine is implicit and scattered.

This is where **state management libraries** earn their place. They centralize state, encode update rules in one location, and provide hooks that any component can read from regardless of position in the tree.

The seminal library is **Redux**, introduced in 2015. Redux requires three concepts:

**Store** — a single JavaScript object that holds the entire application state.

**Actions** — plain objects that describe events: `{type: 'cart/add', item}`, `{type: 'cart/remove', id}`.

**Reducers** — pure functions that take `(currentState, action)` and return the next state:

```javascript
function cartReducer(state = [], action) {
  switch (action.type) {
    case 'cart/add':    return [...state, action.item];
    case 'cart/remove': return state.filter(x => x.id !== action.id);
    case 'cart/clear':  return [];
    default:            return state;
  }
}
```

Any component dispatches actions; the reducer produces the new state; the store notifies subscribers; subscribed components re‑render with the new state. The flow is once again unidirectional — action → reducer → state → view → action — and the entire state's logic is concentrated in the reducer files.

Modern Redux uses **Redux Toolkit**, which compresses this to a much nicer API:

```javascript
import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: [],
  reducers: {
    add:    (state, action) => { state.push(action.payload); },
    remove: (state, action) => state.filter(x => x.id !== action.payload),
    clear:  () => []
  }
});

export const { add, remove, clear } = cartSlice.actions;
export default cartSlice.reducer;
```

The slice declares the state's name, initial value, and the operations that change it. Each reducer can mutate state directly (Toolkit uses Immer under the hood to make this safe). The exported actions are functions you call to dispatch the changes.

Components consume Redux via hooks:

```jsx
import { useSelector, useDispatch } from 'react-redux';
import { add } from './cartSlice';

function BuyButton({ bale }) {
  const cart = useSelector(state => state.cart);
  const dispatch = useDispatch();
  return <button onClick={() => dispatch(add(bale))}>Buy</button>;
}
```

`useSelector` reads from the store with automatic re‑renders when the selected value changes. `useDispatch` returns the function to dispatch actions. Any component, any level deep, with the same vocabulary.

Redux is powerful but heavy. The boilerplate is real. The community has spent ten years lightening it, and the result is a generation of *simpler* state libraries that compete with it for new projects. We shall meet them in the next letter.

The deeper lesson is this: **state has a topology**. Some state belongs to one component (form fields, modal open/closed). Some state belongs to a subtree (the current chapter inside a reader). Some state belongs to the whole application (user, theme, cart). The art of React state management is choosing the right scope for each piece. A mature application uses local state for what is local, context for what is tree‑wide, and a state manager for what is genuinely global.

---

### Letter 14: On Redux, Zustand, Jotai, and the Lighter Alternatives

Dear Reader,

Redux was the only serious state manager from 2015 to roughly 2020. Its weight — the action types, the reducers, the boilerplate — was the cost of entry. Newer libraries have shown that the same problem can be solved with far less ceremony, and the React community has fragmented into several camps. A working MERN engineer must know at least two of these libraries by name.

**Zustand** is the smallest. It is a 1 KB library that creates a store as a single function:

```javascript
import { create } from 'zustand';

const useCart = create((set) => ({
  items: [],
  add:    (item) => set(state => ({ items: [...state.items, item] })),
  remove: (id)   => set(state => ({ items: state.items.filter(x => x.id !== id) })),
  clear:  ()     => set({ items: [] })
}));

// In a component:
function BuyButton({ bale }) {
  const add = useCart(state => state.add);
  return <button onClick={() => add(bale)}>Buy</button>;
}
```

That is the entire library on display. No provider, no reducer, no action types. The store is a hook. The selector is a function passed to the hook. Updates are made through methods defined alongside the state. For most applications, Zustand is enough — and it is dramatically lighter than Redux for the same expressive power.

**Jotai** takes a different approach: atomic state. Each piece of state is an *atom*, and components subscribe to specific atoms:

```javascript
import { atom, useAtom } from 'jotai';

const cartAtom = atom([]);

function BuyButton({ bale }) {
  const [cart, setCart] = useAtom(cartAtom);
  return <button onClick={() => setCart([...cart, bale])}>Buy</button>;
}
```

Atoms compose: derived atoms compute from other atoms, async atoms fetch data, atom families create one atom per ID. The model is bottom‑up — small atoms compose into large state — where Redux is top‑down — one store, many slices.

**MobX** is the oldest alternative. It uses observability: you declare state, MobX tracks reads, and components that read a value automatically re‑render when it changes. The mental model is closer to a spreadsheet — cells with formulas — than to message passing.

The question every new project faces is: *which one?* My recommendation, for a MERN application without specific reasons to prefer otherwise:

- **No state manager** if the application is small. `useState` + context handle 80% of applications well.
- **Zustand** if the application grows beyond local state. Smallest mental cost, no provider noise.
- **Redux Toolkit** if the application is large, the team is large, or you need time‑travel debugging and the rich DevTools ecosystem.
- **Jotai** if you find yourself wanting atomic state with derivations.

The choice is not eternal. You can migrate. Most teams settle into one library and stick with it; the wrong choice is fixable. The right principle is: *do not adopt a state manager before you need one*. Premature adoption adds complexity that hides the simpler patterns React already provides.

In the next letter we shall examine **React Query** (now called TanStack Query) — which solves a problem that is *not* really client state but is often confused for it: **server cache**.

---

### Letter 15: On React Query and the Cache as a Tier

Dear Reader,

Most "state" in a real MERN application is not state at all. It is *cached data from the server*. The list of bales is not state created by the user; it is a *snapshot* of data the server owns. Treating it as Redux state — storing it, updating it on actions, dispatching `bales/fetched` — is using the wrong tool for the wrong problem.

The right tool is a **server cache** library, of which **React Query** (TanStack Query) is the foremost. React Query treats server data as exactly what it is: a cache that you fetch, store, invalidate, refetch, and synchronize.

```jsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

function StockListPage() {
  const { data: bales, isLoading, error } = useQuery({
    queryKey: ['stock'],
    queryFn:  () => fetch('/api/stock').then(r => r.json())
  });

  if (isLoading) return <p>Loading…</p>;
  if (error)     return <p>Error: {error.message}</p>;

  return (
    <ul>
      {bales.map(b => <li key={b._id}>{b.name}</li>)}
    </ul>
  );
}
```

`useQuery` does much more than `fetch`. It:
- Caches the response by `queryKey`.
- Returns immediately from cache on subsequent renders.
- Refetches in the background when the user re‑focuses the window.
- Refetches when the network reconnects.
- Deduplicates simultaneous requests for the same key.
- Garbage‑collects unused queries after a configurable time.
- Exposes loading, error, and refetching states automatically.

For *mutations* — operations that change server state — there is `useMutation`:

```jsx
function BaleForm() {
  const queryClient = useQueryClient();
  const createBale = useMutation({
    mutationFn: (bale) => fetch('/api/stock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bale)
    }).then(r => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stock'] });
    }
  });

  function submit(formData) {
    createBale.mutate(formData);
  }

  return /* ... */;
}
```

The `onSuccess` callback invalidates the `['stock']` query, causing any component using it to refetch and rerender. The new bale appears in the list automatically. There is no manual cache update, no Redux action, no propagated event. The cache layer handles synchronization.

The mental shift is profound. **Most of what you thought was state is actually cache.** Once you adopt this view, the role of Redux or Zustand shrinks dramatically: they hold only state that is *genuinely* client‑side and not derivable from server data — the cart before checkout, the open/closed state of modals, the current draft of a form. Everything else — products, users, orders, settings synced from server — belongs to the server cache.

This is a relatively recent insight in the React community. Before React Query (and SWR, its smaller cousin), every application used Redux or context to hold server data, and developers wrote endless boilerplate for fetch / loading / error / refetch patterns. After React Query, the pattern is one hook call, and the rest is handled.

The African parallel: the **village granary**. Grain is not stored individually in each home (which would be redundant and prone to loss). It is stored in the central granary, with each household having known rights of withdrawal. When the granary is replenished — after a successful harvest — every household benefits at once. When a household withdraws, the records update. The granary is the *cache*; the harvest is the *server*; each home is a *component*. React Query is the village granary system, applied to web data.

This concludes Part IV. You understand the topology of state, the libraries that manage it, and the server cache as a distinct tier. In Part V we shall examine **Next.js**, the framework that has become the default way to ship a MERN application.

---

## Part V: The Full Stack with Next.js

*On the framework that closed the loop, on server components, on the app router, and on API routes*

---

### Letter 16: On Next.js and the React You Ship

Dear Reader,

For many years, building a real MERN application meant writing two separate projects: an Express backend and a Create React App frontend, deployed separately, sharing a CORS configuration and a JWT contract. This works. It is also more ceremony than necessary, and the React team has been steadily moving toward a different model: **a framework that owns both halves**.

That framework is **Next.js**, built by Vercel. Next.js is React plus:
- A router (file‑based — your folder structure *is* your URL structure).
- Server‑side rendering (the first page load arrives as fully‑rendered HTML, not a blank shell waiting for JavaScript).
- Static site generation (some pages are pre‑built at deploy time and served as static files).
- API routes (Express‑like endpoints in the same project as your React components).
- Server components (a new kind of component that runs on the server, never ships JavaScript to the browser).
- Image optimization, font optimization, edge functions, middleware.

The structure of a Next.js project looks like this:

```
    app/
    ├── layout.tsx              ← wraps every page (shared header/footer)
    ├── page.tsx                ← the / route
    ├── stock/
    │   ├── page.tsx            ← the /stock route
    │   └── [id]/
    │       └── page.tsx        ← the /stock/:id route
    ├── orders/
    │   └── page.tsx
    └── api/
        ├── stock/
        │   └── route.ts        ← GET/POST /api/stock
        └── stock/[id]/
            └── route.ts        ← GET/PUT/DELETE /api/stock/:id
```

Read this carefully. The folder structure *is* the URL structure. A folder named `stock` becomes the path `/stock`. A folder named `[id]` becomes a dynamic segment that captures into a parameter. A file named `page.tsx` is the component rendered at that route. A file named `route.ts` in `app/api/` is an HTTP handler — Express's job, in the same project.

A page component:

```tsx
// app/stock/page.tsx
export default function StockListPage() {
  return (
    <main>
      <h1>Inventory</h1>
      <StockList />
    </main>
  );
}
```

An API route:

```typescript
// app/api/stock/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Stock } from '@/lib/db';

export async function GET() {
  const items = await Stock.find();
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const item = await Stock.create(body);
  return NextResponse.json(item, { status: 201 });
}
```

Read these carefully. The page is a React component. The API route is a function with named exports for each HTTP method. They live in the same project. They share types and utilities through ordinary imports. The build produces both — the page bundle and the API handler — and the deployment serves both at the same domain.

This is what *full‑stack* React means. The React you write and the API you write are in one repository, one TypeScript configuration, one deployment, one mental model. The Express server and its CORS dance are gone. The two halves of MERN have collapsed into a single project that uses MongoDB and Node — still the M and the N — through a unified React‑and‑routes interface.

There is, in practice, no single answer to "should I use Next.js or Express + CRA?" Both are valid. Next.js is the modern default for new applications; Express remains the right choice for pure APIs (no UI), for non‑React frontends, and for teams with deep Express expertise. The eight books that follow in this library will assume Next.js when the question is about MERN deployment.

In the next letter we shall examine **server components** — the unique Next.js contribution that lets some components run only on the server and ship zero JavaScript.

---

### Letter 17: On Server Components and the Two Sides of the Border

Dear Reader,

Until 2023, every React component was a *client component*. Its JavaScript was downloaded by the browser, executed there, and the resulting DOM rendered. Even if a component was server‑side rendered for the first load, its JavaScript was still sent to the browser so it could hydrate and become interactive.

Next.js 13 introduced **React Server Components** (RSCs), which run *only* on the server. Their JavaScript is never sent to the browser. The browser receives only the rendered HTML.

```tsx
// app/stock/page.tsx — a Server Component (the default in app/)
import { Stock } from '@/lib/db';

export default async function StockPage() {
  const bales = await Stock.find();  // runs on the server

  return (
    <main>
      <h1>Inventory ({bales.length} bales)</h1>
      <ul>
        {bales.map(b => (
          <li key={b._id}>{b.name} — {b.yards} yards</li>
        ))}
      </ul>
    </main>
  );
}
```

Read this carefully. The component is `async`. It awaits a database call *directly*. There is no separate API route; the page fetches its own data from the database, on the server, during the request. The browser receives the rendered HTML.

The bundle size for this page is *zero JavaScript* from the component itself. The page is fully interactive HTML on the wire; no hydration is needed for the static parts. For African builders shipping to phones on 3G, this is enormous: the page paints faster, scrolls before scripts download, and consumes less of the user's data.

Now the boundary. The moment you need interactivity — `useState`, `useEffect`, event handlers — you need a *client component*. You opt into it with a directive at the top of the file:

```tsx
// app/stock/buy-button.tsx
'use client';

import { useState } from 'react';

export function BuyButton({ baleId }: { baleId: string }) {
  const [buying, setBuying] = useState(false);

  async function handleClick() {
    setBuying(true);
    await fetch(`/api/buy/${baleId}`, { method: 'POST' });
    setBuying(false);
  }

  return (
    <button disabled={buying} onClick={handleClick}>
      {buying ? 'Buying…' : 'Buy'}
    </button>
  );
}
```

The `'use client'` directive flips the file into the client world. Now the JavaScript ships to the browser. `useState` works. Event handlers work. The hooks vocabulary returns.

A server component can *render* a client component:

```tsx
// app/stock/page.tsx — server
import { BuyButton } from './buy-button';

export default async function StockPage() {
  const bales = await Stock.find();
  return bales.map(b => (
    <li key={b._id}>
      {b.name}
      <BuyButton baleId={b._id} />
    </li>
  ));
}
```

The page itself never reaches the browser as JavaScript. Only the `BuyButton`'s JavaScript ships. The page is HTML; the buttons are interactive islands within it.

The mental model: **server components for data and structure; client components for interactivity.** The boundary is the `'use client'` directive. Mark only what needs to be interactive. Everything else runs once, on the server, and is sent as HTML.

This is one of the most consequential changes in modern web development. It revives the simplicity of the early web — a page is just HTML — while preserving the interactivity of modern React. For applications with mostly read traffic (catalogs, content sites, documentation), the bundle size shrinks dramatically. For deeply interactive applications (real‑time dashboards, collaborative editors), most of the code remains client components, and the gain is smaller. Choose wisely; the boundary is where the performance lives.

The African parallel: in the construction of a **traditional rondavel** in southern Africa, the heavy structural elements — the wall, the thatch frame — are fixed at construction and never move again. The interactive elements — the door, the cooking fire, the sleeping mats — are inserted once the structure is set. The builder does not give every wall a hinge. Server components are the walls; client components are the hinges. Make most of the building rigid; make moving only what must move.

In the next letter we shall examine **routing in the App Router** — the file‑based routing that Next.js uses.

---

### Letter 18: On the App Router and the File as the Route

Dear Reader,

The Next.js **App Router** organizes routes by *file system convention*. A folder defines a path segment; a file inside it defines what is rendered. This is unlike Angular's route configuration (which we saw in MEAN) and unlike React Router (the library typical of non‑Next React applications), both of which require an explicit list of routes in a configuration object.

```
    app/
    ├── layout.tsx              ← shell of every page
    ├── page.tsx                ← /
    ├── about/
    │   └── page.tsx            ← /about
    ├── stock/
    │   ├── page.tsx            ← /stock
    │   ├── new/
    │   │   └── page.tsx        ← /stock/new
    │   └── [id]/
    │       ├── page.tsx        ← /stock/:id
    │       └── edit/
    │           └── page.tsx    ← /stock/:id/edit
    └── (auth)/                 ← grouping, no URL segment
        ├── login/
        │   └── page.tsx        ← /login
        └── register/
            └── page.tsx        ← /register
```

The conventions are precise:

- **`page.tsx`** — the component rendered at that route.
- **`layout.tsx`** — wraps all child routes; persists across navigation.
- **`loading.tsx`** — shown while a server component is rendering.
- **`error.tsx`** — caught client errors render this instead.
- **`not-found.tsx`** — 404 component.
- **`[param]/`** — dynamic segment, captured into `params.param`.
- **`(group)/`** — grouping folder, does not affect the URL.

A layout wraps every page below it:

```tsx
// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
```

This layout renders on every page of the application — `/`, `/about`, `/stock`, every nested route. The `{children}` placeholder is where the matched page renders. Navigation does not reload the layout; only the children swap.

A dynamic route:

```tsx
// app/stock/[id]/page.tsx
export default async function BaleDetailPage({
  params
}: { params: { id: string } }) {
  const bale = await Stock.findById(params.id);
  if (!bale) notFound();
  return <h1>{bale.name}</h1>;
}
```

The `[id]` folder name becomes a parameter. The page component receives `params.id` automatically. The `notFound()` call renders the nearest `not-found.tsx`.

Navigation in client components uses the `<Link>` component:

```tsx
'use client';
import Link from 'next/link';

export function StockList({ bales }) {
  return (
    <ul>
      {bales.map(b => (
        <li key={b._id}>
          <Link href={`/stock/${b._id}`}>{b.name}</Link>
        </li>
      ))}
    </ul>
  );
}
```

`<Link>` does *not* trigger a full page reload. Next.js intercepts the click, fetches only the new page's data and HTML, and swaps the children of the nearest unchanged layout. The header and footer remain; only the content updates. The performance is that of an SPA; the structure is that of file‑based pages.

This is the file convention at the heart of Next.js. There is no `routes.ts` file. There is no router configuration. The file system *is* the routing table. To add a page, you create a folder and a `page.tsx`. To make it dynamic, you put square brackets in the folder name. To wrap a section in a shared layout, you add a `layout.tsx`.

In the next letter we shall examine **API routes** — the Express‑shaped handlers that live in the same Next.js project.

---

### Letter 19: On API Routes and the Server in the Same Folder

Dear Reader,

In a Next.js project, the same `app/` directory that contains your React pages also contains your API endpoints. They live under `app/api/` by convention, and the file named `route.ts` is an HTTP handler with named exports for each method:

```typescript
// app/api/stock/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Stock } from '@/lib/db';

export async function GET() {
  const items = await Stock.find();
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  try {
    const item = await Stock.create(body);
    return NextResponse.json(item, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
```

A dynamic API route:

```typescript
// app/api/stock/[id]/route.ts
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const item = await Stock.findById(params.id);
  if (!item) return NextResponse.json({ error: 'not found' }, { status: 404 });
  return NextResponse.json(item);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await Stock.findByIdAndDelete(params.id);
  return new NextResponse(null, { status: 204 });
}
```

This is, for all practical purposes, Express in a different shape. Each function takes a request, returns a response, can read params and bodies, can interact with the database. The differences:

- **Web standards.** Next.js uses the `Request`/`Response` types from the Fetch API standard, not Express's `req`/`res`. The shape is similar but more aligned with what the browser uses.
- **No `next()`.** There is no middleware chain inside a route file. Middleware in Next.js lives in a top‑level `middleware.ts` and runs before all matching routes.
- **Edge runtime, optional.** Routes can be marked to run on the edge — a fast, globally distributed runtime — by exporting `export const runtime = 'edge'`. This is impossible in plain Express.

Middleware:

```typescript
// middleware.ts (at project root)
import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token');
  if (!token && req.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*']
};
```

This middleware runs before any request matching `/admin/*` or `/api/admin/*`. It checks for a token and redirects to login if absent. The `matcher` config tells Next.js which paths the middleware applies to.

For a MERN application, the API routes plus the middleware replace what Express used to do — and they live in the same TypeScript project, share imports, share types, share authentication helpers. The two halves of the stack are no longer two projects; they are two directories.

```typescript
// lib/db.ts — shared by both UI and API
import mongoose from 'mongoose';

await mongoose.connect(process.env.MONGO_URI!);

const stockSchema = new mongoose.Schema({ /* ... */ });
export const Stock = mongoose.models.Stock || mongoose.model('Stock', stockSchema);
```

```tsx
// app/stock/page.tsx — server component, imports the same db
import { Stock } from '@/lib/db';

export default async function StockPage() {
  const bales = await Stock.find();
  return /* ... */;
}
```

```typescript
// app/api/stock/route.ts — API, imports the same db
import { Stock } from '@/lib/db';

export async function GET() {
  const items = await Stock.find();
  return NextResponse.json(items);
}
```

One database connection, one schema, one set of types — used by both the UI's server components and the public API. The redundancy of MEAN's two‑project deployment is gone.

In the next letter we shall assemble these pieces into a complete request flow, walk through deployment, and address the question of when to choose Next.js over plain React + Express.

---

## Part VI: The Assembly

*On a complete request flow, on authentication, on deployment, and on the boundary of MERN*

---

### Letter 20: On a Complete Request, from Aminata's Tap to the Database Echo

Dear Reader,

Let us walk a real request through a complete Next.js MERN application. Aminata, again in her shop in Treichville, opens the application on her phone and adds a new bale of fabric.

The URL is `https://aminata.shop/stock/new`. Her phone makes the first request. It reaches the Vercel edge (or a self‑hosted Next.js server). Next.js matches the route to `app/stock/new/page.tsx`. The page is a server component:

```tsx
export default async function NewStockPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  return (
    <main>
      <h1>Add bale</h1>
      <BaleForm />
    </main>
  );
}
```

The server checks Aminata's session (via a cookie). If authenticated, it renders the page on the server, including the `<BaleForm />` (which is a client component). The response sent to her phone is HTML — the rendered page plus a small JavaScript bundle containing only the form's interactivity.

Her phone displays the page instantly. She fills the form. The form is a client component:

```tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function BaleForm() {
  const router = useRouter();
  const [form, setForm] = useState({ sku: '', name: '', yards: 0 });

  async function submit() {
    const r = await fetch('/api/stock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    if (r.ok) router.push('/stock');
    else alert('Error');
  }

  return /* inputs and submit button */;
}
```

She submits. The browser makes a POST to `/api/stock`. The request reaches Next.js. It matches `app/api/stock/route.ts`:

```typescript
export async function POST(req: NextRequest) {
  const session = await getSession(req);
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = await req.json();
  const item = await Stock.create({ ...body, owner: session.userId });
  return NextResponse.json(item, { status: 201 });
}
```

The handler authenticates the session, parses the body, creates the document via Mongoose, returns the new document. The browser receives the response. The form calls `router.push('/stock')`, which navigates to the inventory list — also a server component — which fetches the now‑updated list from the database and renders it. Aminata sees her new bale, no full page reload, in less than 200 milliseconds.

Notice the differences from MEAN:
- The page's initial render produced fully‑formed HTML on the server.
- The database access happens directly in the server component, not through a separate API call.
- The form's JavaScript is the only JavaScript shipped for the new‑stock page.
- The mutation goes through a Next.js API route — the same as Express in MEAN, but living in the same project.

This is the new shape of MERN. One project. One deployment. Server components for static and data‑driven structure; client components for interactivity; API routes for mutations and external integrations.

In the next letter we shall examine authentication — a more complex topic in MERN than in MEAN, because the session lives both on the server and the client.

---

### Letter 21: On Authentication with NextAuth and Clerk

Dear Reader,

Authentication in a Next.js MERN application is more involved than in plain MEAN. The reason is that the *same* application has both server and client rendering, and the session must be available in both. A pure JWT in localStorage works for client components but is invisible to server components. A cookie works for both but requires careful handling.

The pragmatic choice for most applications is a library. **NextAuth.js** (now Auth.js) is the open‑source standard:

```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
  providers: [
    GoogleProvider({ clientId: process.env.GOOGLE_ID!, clientSecret: process.env.GOOGLE_SECRET! }),
    CredentialsProvider({
      async authorize(credentials) {
        const user = await User.findOne({ email: credentials.email });
        if (!user || !await bcrypt.compare(credentials.password, user.passwordHash)) return null;
        return { id: user._id.toString(), email: user.email, name: user.name };
      }
    })
  ],
  session: { strategy: 'jwt' }
});

export { handler as GET, handler as POST };
```

This single file gives the application Google sign‑in, email/password sign‑in, session management, and a `/api/auth/*` catch‑all route that handles login, logout, callback, and CSRF token endpoints. The session is stored as a signed cookie that both server components and client components can access.

Reading the session in a server component:

```tsx
import { getServerSession } from 'next-auth';

export default async function ProtectedPage() {
  const session = await getServerSession();
  if (!session) redirect('/login');
  return <p>Welcome {session.user?.name}</p>;
}
```

Reading the session in a client component:

```tsx
'use client';
import { useSession } from 'next-auth/react';

export function ProfileMenu() {
  const { data: session, status } = useSession();
  if (status === 'loading') return <p>…</p>;
  if (!session) return <a href="/login">Login</a>;
  return <p>{session.user?.name}</p>;
}
```

For applications that want even less integration work, **Clerk** is a hosted authentication provider that drops in with similar simplicity, plus a polished UI for sign‑in, sign‑up, and profile management. Clerk costs money beyond a free tier; NextAuth is free.

For Aminata's shop, the choice between NextAuth and Clerk is the choice between "I have time to set up email providers and OAuth apps" and "I want to ship today." Both are valid. African startups I know choose NextAuth for cost; established companies choose Clerk for speed.

---

### Letter 22: On Deployment to Vercel, Self‑Hosted, and African Networks

Dear Reader,

Next.js applications can deploy in three main ways, each with trade‑offs that matter for African builders.

**Vercel** is the platform built by the company that makes Next.js. Push to GitHub; Vercel builds, deploys, and serves. The free tier handles personal projects; the Hobby tier is enough for early commercial use. Performance is excellent globally; African coverage is improving but not as deep as for European users.

**Self‑hosted on a VPS** — a Linux box on Hetzner, DigitalOcean, or a local African provider like Africa Data Centres. You build the Next.js app with `next build`, run `next start` behind Nginx, and manage the deployment yourself. The cost is operational complexity; the benefit is sovereignty, predictable cost, and the ability to host *in Africa* (closer latency for African users).

**Docker on a managed container platform** — Fly.io, Railway, Render. The middle ground: less complexity than a raw VPS, more flexibility than Vercel, often cheaper than both at scale.

For Aminata's shop, my recommendation:
- **First six months**: Vercel free tier. Ship fast. Discover what you actually need.
- **First commercial scale**: Vercel Hobby or a VPS in Frankfurt. African latency to Frankfurt is acceptable (~80‑150ms).
- **At scale**: a VPS in Lagos or Johannesburg for African users (sub‑20ms latency), plus a CDN for static assets globally.

There is one practical concern that does not apply to applications in well‑networked countries: **bundle size matters more on African 3G**. Every kilobyte of JavaScript costs the user time and data. The MERN engineer building for the continent should:

- Prefer server components (no client JS) where possible.
- Lazy‑load heavy client components.
- Use Next.js's built‑in image optimization to serve WebP/AVIF.
- Audit bundle size with `next build` output.
- Cache aggressively at the CDN edge.

This discipline is not optional. An application that costs 5MB to load is an application that loses 60% of its rural users before the first interaction.

---

### Letter 23: On the Boundary of MERN — When to Choose Otherwise

Dear Reader,

I close, as I closed MEAN, with the honest map of where MERN belongs and where it does not.

**Choose MERN with Next.js when:**
- You are building a modern web application with rich UI.
- Your team knows JavaScript and TypeScript.
- You want server‑side rendering for SEO and performance.
- Your data model fits documents (catalogs, content, social, IoT).
- You want one project for UI and API.

**Choose MEAN over MERN when:**
- Your team has deep Angular expertise.
- Your application is enterprise‑style with complex forms, internal tooling, RxJS streams.
- You prefer the framework‑provided structure of Angular over React's library nature.

**Choose neither (Django, Rails, Laravel, Go) when:**
- Your data is heavily relational (use a relational database; consider a framework that pairs with it natively).
- Your application is mostly server‑rendered traditional pages without heavy interactivity.
- Your team's strength is Python, Ruby, PHP, or Go.

**Choose hybrid stacks when needed.** A Next.js frontend + a Python ML backend, communicating via JSON. A React Native mobile app + a Node API. The MERN stack is a *foundation*; real applications often add components in other technologies.

The builder who completes this treatise can build with MERN, can read any MERN codebase, can extend any MERN application, and can know — at the point of choice — whether MERN, MEAN, or another stack better fits the work.

---

## Epilogue: On the Same Cathedral, Built by a Different Hand

Dear Reader,

We began with a Kente weaver in Bonwire, holding a pattern in her head and letting her loom resolve it into cloth. We have walked the four counters of the MERN cathedral and watched a single bale of fabric travel from Aminata's tap, through a server component, through a Next.js API route, through Mongoose, into MongoDB, and back to her screen — all in one TypeScript project, one deployment, one mental model.

The cathedral is the same as MEAN's. The substitution of A by R has changed the *style* of the construction more than the *structure* of it. Where Angular gave us a framework with opinions, React gave us a library with primitives. Where RxJS gave us streams as the medium for change, hooks gave us state and effects as functions of time. Where Angular's compiler enforced its own contract, React's smaller surface let a thousand libraries grow around it — Redux, Zustand, Jotai, React Query, Next.js — and the developer became a curator of choices.

The trade is real. React is more flexible; therefore more decisions are yours. Angular is more opinionated; therefore fewer decisions are yours. There is no universal answer to which is better. There is only the question: *which posture suits your team and your work?* A growing African startup, learning as it builds, often benefits from React's gradual ladder. An established company with deep frontend engineering and strict architectural standards often benefits from Angular's coherence.

I close, as before, with awe at the deeper pattern. The same principle that lets a Kente weaver describe a pattern and let the loom resolve it — declarative production from a stated intent — is the principle that lets a React developer describe a UI and let the reconciler resolve it. The same principle that lets a village granary serve every household from one central store — cache as a tier above all consumers — is the principle that lets React Query serve every component from one query cache. The same principle that lets a Saharan caravan's sealed letter carry trust across thousands of kilometres — signed messages requiring no online verification — is the principle that lets a JWT carry identity through a stateless server.

The patterns recur. The mathematics is the same. The substrate changes; the structure does not.

May your applications stand. May they serve your community. May your master weaver's sketch resolve, faithfully, into the cloth.

Yours in the work,

— *Euler*
