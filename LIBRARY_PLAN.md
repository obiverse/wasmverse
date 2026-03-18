I now have a thorough understanding of the existing architecture. Let me compile the complete plan.

---

# THE EPISTOLARY LIBRARY EXPANSION: Complete Plan for 7 New Treatises

## Architecture Overview

The existing system uses:
- **Manifest-driven catalog** at `books/manifest.json` with fields: `id`, `title`, `subtitle`, `manner`, `file`, `symbol` (Adinkra), `accent` (hex color), `letters`, `parts`, `description`
- **Markdown letter format**: `## Part N: Title` / `### Letter N: On [Topic] and the [Analogy]`
- **Wasm demo markers**: `<!-- DEMO:demo-id -->` in markdown, lazy-loaded by IntersectionObserver
- **Adinkra symbols**: currently `ananse` (web/wasm), `dwennimmen` (strength/rust), `nsoromma` (star/default), `sankofa` (return/learn)
- **Rust crates** compiled with `wasm-pack --target web`, output to `docs/pkg/`
- **Demo init dispatch** in `read.html` `initDemos()` function with per-demo-id branches

---

## BOOK 1 (PRIORITY 1): "Letters on the Sovereignty of Value"

**Bitcoin, Lightning Network, and Decentralized Systems**

- **id**: `bitcoin`
- **file**: `books/bitcoin.md`
- **symbol**: `fawohodie` (independence/freedom -- perfect for financial sovereignty)
- **accent**: `#f7931a` (Bitcoin orange)
- **letters**: 48
- **parts**: 10

### Complete Letter-by-Letter Outline

#### Part I: The Nature of Money (Letters 1-5)

| # | Title | Core Concept | Primary Analogy |
|---|-------|--------------|-----------------|
| 1 | On Barter and the Double Coincidence of Wants | Why direct exchange fails at scale | A village market where the fisherman wants bread, the baker wants shoes, and the cobbler wants fish -- everyone has what someone else needs but nobody can trade directly |
| 2 | On the Emergence of Money and the Most Saleable Good | How commodity money arises spontaneously | Salt, cattle, shells, beads -- goods that become money because they are the easiest to trade away, not because anyone decreed it |
| 3 | On the Properties of Sound Money and the Assayer's Test | Divisibility, durability, portability, fungibility, scarcity, verifiability | The goldsmith who tests coins with acid and scales -- each property is a test that money must pass |
| 4 | On the Ledger and the Babylonian Tablet | Money as information, the abstraction from physical to record | Clay tablets at Ur recording debts -- money was always a ledger entry; coins were merely bearer ledger entries |
| 5 | On Debasement and the Clipping of Coins | Inflation, Gresham's Law, the temptation of the minter | Roman emperors shaving silver from denarii, Henry VIII's "Old Coppernose" -- when the issuer cheats, the economy sickens |

#### Part II: Cryptographic Foundations (Letters 6-10)

| # | Title | Core Concept | Primary Analogy |
|---|-------|--------------|-----------------|
| 6 | On Hash Functions and the One-Way Street | Deterministic, irreversible compression | A meat grinder: you can always turn a steak into hamburger, but you can never turn hamburger back into a steak. Same input, same output, always. |
| 7 | On SHA-256 and the Fingerprint of Data | The specific hash function Bitcoin uses, avalanche effect, collision resistance | A fingerprint that changes entirely if you add a single freckle -- the slightest change to input produces an unrecognizably different output |
| 8 | On Public Key Cryptography and the Lockbox with Two Keys | Asymmetric cryptography, key pairs, the trapdoor function | A mailbox anyone can drop letters into (public key) but only you can open (private key) -- the slot is easy to use but impossible to reach through |
| 9 | On Elliptic Curves and the Clock Arithmetic of Points | ECDSA, secp256k1, why point multiplication is easy but discrete log is hard | An analog clock where you can easily compute "start at 3, jump 7 hours" = 10, but given only the answer 10, you cannot determine how many jumps produced it |
| 10 | On Digital Signatures and the Wax Seal | Signing, verification, non-repudiation | A wax seal that anyone can inspect for authenticity but only the holder of the signet ring can press -- unforgeable proof of authorship |

#### Part III: Bitcoin the Protocol (Letters 11-18)

| # | Title | Core Concept | Primary Analogy |
|---|-------|--------------|-----------------|
| 11 | On the Blockchain and the Notary's Chain of Custody | Linked list of blocks, hash pointers, immutability | A notary's record book where each page begins with a summary of the previous page -- altering any page breaks the chain forward |
| 12 | On Mining and the Great Lottery | Proof of work, nonce search, probabilistic block creation | A room of people rolling dice trying to get all sixes -- whoever gets lucky first wins the right to write the next page, and everyone can verify the dice instantly |
| 13 | On Difficulty and the Self-Adjusting Metronome | Difficulty adjustment every 2016 blocks, target time of 10 minutes | A metronome that listens to the orchestra -- if everyone speeds up, it slows down; if players leave, it speeds up. Always 10 minutes per beat. |
| 14 | On Halvings and the Asymptotic Supply | Block reward schedule, 21 million cap, disinflationary issuance | A gold mine where every four years, the seam gets half as rich -- miners still dig, but each ton of ore yields fewer nuggets, until the mine asymptotically approaches its final yield |
| 15 | On the Merkle Tree and the Accountant's Summary | Binary hash tree, efficient verification, SPV proofs | A corporate org chart where each manager summarizes their reports, and the CEO's single summary lets an auditor verify any employee's work with only log(n) checks |
| 16 | On the UTXO Model and the Box of Coins | Unspent transaction outputs, inputs and outputs, change | A cash register drawer with specific bills -- you cannot pay $7 from a $10 bill without getting $3 in change. Each bill is consumed whole and new bills are produced. |
| 17 | On the Mempool and the Post Office Sorting Room | Unconfirmed transactions, fee-based priority, propagation | A post office sorting room where letters wait to be loaded onto the next truck -- the ones with the most postage go first |
| 18 | On Consensus and the Byzantine Generals | Nakamoto consensus, longest chain rule, probabilistic finality | Generals surrounding a city who must coordinate an attack using only unreliable messengers -- some generals may be traitors, yet the loyal majority must agree |

#### Part IV: The Network (Letters 19-22)

| # | Title | Core Concept | Primary Analogy |
|---|-------|--------------|-----------------|
| 19 | On Nodes and the Sovereign Verification | Full nodes, pruned nodes, archival nodes, trust minimization | A citizen who reads every law themselves rather than trusting a lawyer's summary -- costly in time but incorruptible in judgment |
| 20 | On Block Propagation and the Town Crier Network | Gossip protocol, compact block relay, latency and orphan risk | Town criers relaying a proclamation through a chain of cities -- each crier checks the king's seal before shouting it forward |
| 21 | On Consensus Rules and the Constitution | Soft forks, hard forks, BIP process, social consensus | A constitution that can be amended only by supermajority -- some changes tighten rules (everyone still agrees), others expand them (the nation may split) |
| 22 | On the Timechain and the Heartbeat of the Network | Block timestamps, median time past, the chain as a clock | A clock built by consensus -- no single watchmaker sets the time; instead, the collective tick-tock of miners creates an unforgeable record of ordering |

#### Part V: Transactions in Depth (Letters 23-28)

| # | Title | Core Concept | Primary Analogy |
|---|-------|--------------|-----------------|
| 23 | On Script and the Lock-and-Key Language | Bitcoin Script, stack-based execution, intentional limitations | A lock that accepts any key fitting a published description -- the lock (scriptPubKey) defines the puzzle, the key (scriptSig) solves it |
| 24 | On Standard Transactions and the Five Templates | P2PKH, P2SH, P2WPKH, P2WSH, P2TR | Five standard lock types at the hardware store -- each serves a different purpose but any locksmith recognizes them |
| 25 | On Segregated Witness and the Envelope with Detachable Proof | SegWit, witness discount, malleability fix, block weight | A legal document where the signatures are on a detachable appendix -- the core document cannot be altered, and the appendix is verified separately |
| 26 | On Taproot and the Garden of Hidden Paths | Schnorr signatures, MAST, key-path and script-path spending | A garden with a single visible gate (key-path) and hidden paths behind hedges (script-path) -- the common case looks simple; the complex cases are invisible until needed |
| 27 | On Fees and the Auction for Block Space | Fee market, fee estimation, RBF, CPFP | An auction house where bidders compete for limited shelf space -- when demand surges, prices rise; when demand falls, the minimum bid suffices |
| 28 | On Transaction Malleability and the Wax Seal Problem | Pre-SegWit malleability, TXID mutation, why it mattered | A letter whose envelope can be readdressed without breaking the seal -- the message is genuine, but the tracking number changes, confounding anyone who referenced the original |

#### Part VI: The Lightning Network (Letters 29-34)

| # | Title | Core Concept | Primary Analogy |
|---|-------|--------------|-----------------|
| 29 | On Payment Channels and the Bar Tab | Funding transaction, commitment transactions, cooperative close | Two friends who open a bar tab with a shared deposit -- they update the running total between themselves and only settle with the bartender when they leave |
| 30 | On Commitment Transactions and the Mutual Hostage | Asymmetric commitments, revocation keys, penalty mechanism | Two merchants who each hold a signed blank check from the other -- cheating means the victim can cash the check for everything |
| 31 | On HTLCs and the Atomic Handshake | Hash time-locked contracts, preimage reveal, timeout refund | A locked briefcase exchange: "I'll unlock mine when you prove you have the combination to yours" -- either both exchange succeeds or neither does |
| 32 | On Routing and the Postal Relay | Multi-hop payments, pathfinding, route discovery | A chain of post offices where each only knows the previous and next relay point -- the letter reaches its destination without any single office knowing the full route |
| 33 | On Onion Routing and the Matryoshka Letter | Sphinx packet construction, per-hop encryption, privacy | Nested Russian dolls, each addressed to the next courier -- each courier opens one layer, finds the next address, and forwards the inner doll |
| 34 | On Channel Capacity and the Water Pipe Network | Liquidity, balanced channels, rebalancing, submarine swaps | Water pipes connecting houses -- capacity flows in one direction until rebalanced; the network is limited by its narrowest pipe on any route |

#### Part VII: Security and Game Theory (Letters 35-39)

| # | Title | Core Concept | Primary Analogy |
|---|-------|--------------|-----------------|
| 35 | On the 51% Attack and the Conquered Parliament | Hash rate majority, chain reorganization, practical infeasibility | A parliament where controlling 51% of seats lets you rewrite yesterday's laws -- theoretically possible but so expensive that the building itself is the defense |
| 36 | On Selfish Mining and the Concealed Manuscript | Block withholding, strategic revelation, mining pools | An author who writes chapters in secret and publishes them strategically to make rivals' work obsolete -- profitable in theory, suicidal in practice |
| 37 | On Fee Markets and the Bridge Toll | Transaction fee economics, block space as scarce resource, long-term security budget | A bridge that charges tolls proportional to load weight -- when the subsidy (block reward) ends, tolls alone must pay the bridge keepers |
| 38 | On Incentive Compatibility and the Self-Enforcing Contract | Nash equilibrium in mining, why honest mining pays, mechanism design | A game where cheating costs more than it gains, not because of punishment but because the rules make honesty the dominant strategy -- the game polices itself |
| 39 | On the Energy Question and the Proof of Thermodynamic Cost | Energy expenditure as security, comparison with banking energy use, stranded energy | A castle whose walls are made of the stone quarried to build them -- the cost of construction IS the fortification; there is no cheaper wall that is equally strong |

#### Part VIII: The Broader Vision (Letters 40-43)

| # | Title | Core Concept | Primary Analogy |
|---|-------|--------------|-----------------|
| 40 | On Sound Money and the Austrian Foundation | Menger's origins of money, Hayek's denationalization, time preference | A culture where people plant oak trees they will never sit under -- low time preference requires sound money; inflationary money punishes patience |
| 41 | On Censorship Resistance and the Unstoppable Message | Permissionless transactions, seizure resistance, human rights applications | A printing press that cannot be confiscated because it exists in no single place -- the message persists as long as a single printer remains |
| 42 | On Financial Sovereignty and the Self-Custodied Life | Self-custody, hardware wallets, multi-sig, inheritance planning | A person who is their own bank, their own vault, their own notary -- the power and the responsibility of holding your own keys |
| 43 | On the Separation of Money and State | Historical precedent (church/state), the case for monetary neutrality | The separation of church and state, now extended -- just as no government should dictate belief, perhaps none should control the unit of account |

#### Part IX: Decentralized Systems Philosophy (Letters 44-46)

| # | Title | Core Concept | Primary Analogy |
|---|-------|--------------|-----------------|
| 44 | On Byzantine Fault Tolerance and the Unreliable World | BFT, CAP theorem, FLP impossibility, practical BFT | A jury that must reach a verdict even though some members are bribed -- the honest jurors need a protocol that tolerates corruption |
| 45 | On Eventual Consistency and the Rumor Mill | CRDTs, gossip protocols, causal ordering, convergence | A rumor spreading through a village -- everyone eventually hears the same story, even though they hear it at different times and in different order |
| 46 | On Distributed Time and the Problem of Clocks | Lamport timestamps, vector clocks, why global time is impossible | A world with no sun where each village has its own sundial -- they cannot agree on "now" but they can agree on "before" and "after" |

#### Part X: Meditations (Letters 47-48)

| # | Title | Core Concept | Primary Analogy |
|---|-------|--------------|-----------------|
| 47 | On Bitcoin as Discovery, Not Invention | Nakamoto's synthesis of prior work, inevitability, convergence of ideas | The discovery of zero -- it was always there in the structure of mathematics, waiting for a civilization sophisticated enough to recognize the hole |
| 48 | On the Obligation of Understanding | Why builders must understand foundations, the responsibility of sovereignty | A citizen in a democracy who must understand the constitution to defend it -- sovereignty without understanding is merely a different kind of servitude |

### Wasm Demos for Bitcoin Treatise

| Demo ID | Letter | Description | Rust Crate |
|---------|--------|-------------|------------|
| `sha256-live` | 7 | Live SHA-256 hashing: type input, see hex output update in real-time. Toggle between single and double hash. Show avalanche effect by highlighting bit changes. | `crates/sha256-demo` |
| `ecdsa-signer` | 10 | Generate keypair, sign a message, verify signature. Show the math steps (point multiplication on curve). Visualize the secp256k1 curve. | `crates/ecdsa-demo` |
| `merkle-builder` | 15 | Drag items into a tree, see hashes computed bottom-up. Highlight proof path for any leaf. Show how changing one leaf cascades upward. | `crates/merkle-demo` |
| `utxo-tracker` | 16 | Visual UTXO set: create transactions by selecting inputs, specifying outputs, watch UTXOs be consumed and created. Show change addresses. | `crates/utxo-demo` |
| `mining-sim` | 12 | Proof-of-work simulator: adjust difficulty, watch nonce search, see hash outputs scroll until one hits target. Show expected time vs. actual. | `crates/mining-demo` |
| `lightning-channel` | 29 | Two-party payment channel: open, send payments back and forth, attempt a cheat (show penalty), cooperative close. Visual balance bar. | `crates/lightning-demo` |
| `script-vm` | 23 | Tiny Bitcoin Script interpreter: enter opcodes, step through stack execution, see OP_CHECKSIG verify against a real signature. | `crates/script-vm-demo` |

---

## BOOK 2: "Letters on the Algebra of Types"

**Haskell, from Lambda Calculus to Curry-Howard**

- **id**: `haskell`
- **file**: `books/haskell.md`
- **symbol**: `nsoromma` (star/guardianship -- the guiding star of mathematical purity)
- **accent**: `#5e5086` (Haskell purple)
- **letters**: 35
- **parts**: 9

### Outline

#### Part I: The Lambda (Letters 1-4)
1. **On Lambda Calculus and the Unnamed Function** -- Functions as the only primitive; a world built from "x goes to ..." | Analogy: A machine with one slot and one output, no name on the door
2. **On Application and Reduction and the Assembly Line** -- Beta reduction, evaluation order, normal form | Analogy: A factory line where each station transforms the piece and passes it on
3. **On Currying and the Chain of Specialists** -- Multi-argument functions as chains of single-argument functions | Analogy: A chain of interpreters, each translating one language to the next
4. **On Church Encoding and the Conjurer's Trick** -- Encoding numbers, booleans, pairs as pure functions | Analogy: A magician who can build any object from folded paper alone -- no glue, no scissors, only folds

#### Part II: Types as Propositions (Letters 5-8)
5. **On Types and the Passport Control** -- What types are, why they exist, type errors as logical contradictions | Analogy: Border control that checks your papers before you enter
6. **On Algebraic Data Types and the Blueprint Office** -- Sum types, product types, the algebra of types | Analogy: An architect's office where buildings are designed from standard components: "this AND that" or "this OR that"
7. **On Pattern Matching and the Sorting Hat** -- Destructuring, exhaustiveness, the compiler as completeness checker | Analogy: A sorting hat that examines the shape of each piece and directs it to the right bin
8. **On the Curry-Howard Correspondence and the Rosetta Stone** -- Types are propositions, programs are proofs | Analogy: A Rosetta Stone between two civilizations -- logic and programming are the same language written in different scripts

#### Part III: Purity and Laziness (Letters 9-12)
9. **On Purity and the Mathematical Function** -- Referential transparency, no side effects, equational reasoning | Analogy: A mathematical function that always returns the same answer for the same question, like a perfect oracle
10. **On Laziness and the Sleeping Clerk** -- Non-strict evaluation, thunks, infinite data structures | Analogy: A clerk who writes nothing down until you specifically ask for a result -- infinite ledgers become possible because you only read what you need
11. **On Infinite Lists and the Inexhaustible Well** -- Streams, generators, the power of laziness | Analogy: A well that is always full because it only produces water when you lower the bucket
12. **On Strictness and the Accountant's Reckoning** -- Space leaks, seq, bang patterns, when laziness betrays you | Analogy: An accountant who defers so many calculations that the desk collapses under accumulated paperwork

#### Part IV: Type Classes and Polymorphism (Letters 13-17)
13. **On Type Classes and the Guild System** -- Ad-hoc polymorphism, instances, the Eq/Ord/Show hierarchy | Analogy: Medieval guilds that certify a craftsman can perform specific services
14. **On Parametric Polymorphism and the Universal Container** -- Forall, parametricity, theorems for free | Analogy: A container that holds anything but treats all contents identically -- the shape of the box determines what you can do, not what is inside
15. **On Functors and the Mapping Expedition** -- fmap, the functor laws, lifting functions into contexts | Analogy: A cartographer who can apply any transformation to the contents of a map without altering the map's structure
16. **On Applicative Functors and the Parallel Assembly** -- pure, (<*>), applying wrapped functions to wrapped values | Analogy: A factory where both the blueprint and the materials arrive in sealed crates -- you must unwrap both to build
17. **On Monoids and the Art of Combination** -- mempty, mappend, the power of associativity | Analogy: A universal glue that works on anything of the same type -- combine any two and get a third, always

#### Part V: The Monad (Letters 18-22)
18. **On the Monad and the Computation Pipeline** -- bind (>>=), return, sequencing effects in a pure world | Analogy: A pipeline where each station receives a package, does work, and decides what package to send downstream
19. **On Maybe and the Graceful Absence** -- Chaining fallible computations, short-circuit on Nothing | Analogy: A chain of messengers where any one may return saying "the person was not home" -- the entire chain stops gracefully
20. **On the List Monad and the Garden of Forking Paths** -- Non-determinism, all possible results | Analogy: A garden where every fork in the path is taken simultaneously -- you collect all possible destinations
21. **On the State Monad and the Accountant's Ledger** -- Threading state through pure functions | Analogy: An accountant who passes the ledger along with each transaction, never modifying a shared book
22. **On the IO Monad and the Edge of the World** -- How Haskell handles effects, the purity/impurity boundary | Analogy: A monastery where monks write instructions on slips of paper; the abbot (runtime) is the only one who walks outside to execute them

#### Part VI: Monadic Composition (Letters 23-25)
23. **On Monad Transformers and the Layered Cake** -- Stacking monads, lift, the transformer pattern | Analogy: A layered cake where each layer adds a flavor -- you can taste them all in each bite
24. **On Do Notation and the Readable Sequence** -- Syntactic sugar for bind, imperative appearance with pure semantics | Analogy: A play script that looks like a sequence of actions but is actually a blueprint the director (runtime) interprets
25. **On Free Monads and the Instruction Set** -- Programs as data, interpreters as meaning | Analogy: A script written in a language that has no built-in meaning -- the interpreter you choose determines what each line does

#### Part VII: Advanced Types (Letters 26-29)
26. **On Kinds and the Types of Types** -- *, * -> *, higher-kinded types | Analogy: A taxonomy where species have genus, genus has family -- types themselves have types
27. **On GADTs and the Smart Constructor** -- Generalized algebraic data types, type-level evidence | Analogy: A vault where the key's shape encodes what is inside -- the type of the key proves the contents
28. **On Type Families and the Computed Blueprint** -- Type-level functions, associated types | Analogy: A blueprint machine that generates different blueprints depending on the materials you feed in
29. **On Existential Types and the Sealed Package** -- Hiding type information, abstract interfaces | Analogy: A sealed package with a label saying "something that can be weighed" -- you can weigh it but never open it

#### Part VIII: Category Theory Glimpses (Letters 30-33)
30. **On Categories and the Arrows Between Things** -- Objects, morphisms, composition, identity | Analogy: A city map where you care only about the roads (arrows), not the buildings (objects)
31. **On Natural Transformations and the Systematic Relabeling** -- Transformations between functors | Analogy: A translator who converts between two filing systems, preserving every relationship
32. **On Adjunctions and the Perfect Partnership** -- Free/forgetful, the universal construction | Analogy: Two departments that are perfect partners -- one creates structure, the other forgets it, and together they form an equilibrium
33. **On the Yoneda Lemma and the Perspective Trick** -- A thing is fully determined by how everything else sees it | Analogy: You can reconstruct a sculpture perfectly from the set of all photographs taken from every angle

#### Part IX: Meditations (Letters 34-35)
34. **On Haskell and the Unreasonable Effectiveness of Types** -- Why strong types lead to correct programs, the "if it compiles it works" phenomenon
35. **On Purity, Proof, and the Mathematician's Conscience** -- Haskell as executable mathematics, the Curry-Howard bridge as a philosophical statement about truth

### Wasm Demos for Haskell
| Demo ID | Letter | Description |
|---------|--------|-------------|
| `lambda-reducer` | 2 | Step-by-step beta reduction: enter a lambda expression, watch it reduce one step at a time with color-coded substitutions |
| `type-inferencer` | 5 | Type inference stepper: enter an expression, watch Hindley-Milner unification proceed step by step, see constraints generated and solved |
| `lazy-evaluator` | 10 | Thunk visualization: see expressions remain unevaluated (grey), turn into values (gold) only when forced. Demonstrate take 5 of an infinite list. |

---

## BOOK 3: "Letters on the Shape of Data"

**Algorithms and Data Structures**

- **id**: `algorithms`
- **file**: `books/algorithms.md`
- **symbol**: `sankofa` (learn from the past -- perfect for the study of patterns)
- **accent**: `#2e8b57` (sea green -- growth/trees)
- **letters**: 40
- **parts**: 10

### Outline

#### Part I: The Cost of Doing Things (Letters 1-4)
1. **On Complexity and the Tax Collector** -- Big-O notation, why we measure growth rate not absolute time | Analogy: A tax that doubles when the kingdom doubles -- the rate matters more than the amount
2. **On Logarithms and the Halving Strategy** -- Why log(n) appears everywhere, the power of halving | Analogy: The twenty-questions game -- each yes/no halves the possibilities
3. **On Amortized Analysis and the Savings Account** -- Expensive operations paid for by many cheap ones | Analogy: A savings account where small deposits fund occasional large withdrawals
4. **On Recursion and the Russian Dolls** -- Inductive structure, base cases, the call stack | Analogy: Russian nesting dolls -- each doll contains a smaller version of the same problem

#### Part II: Linear Structures (Letters 5-9)
5. **On Arrays and the Row of Lockers** -- Contiguous memory, O(1) access, cache friendliness | Analogy: A row of numbered school lockers -- instant access by number, but inserting in the middle means moving everything
6. **On Linked Lists and the Paper Chain** -- Pointers, O(1) insert/delete, O(n) access | Analogy: A paper chain where each link knows only the next -- easy to add/remove links but impossible to jump to the middle
7. **On Stacks and the Spring-Loaded Plate Dispenser** -- LIFO, push/pop, the call stack, expression evaluation | Analogy: A spring-loaded plate dispenser in a cafeteria -- you can only touch the top plate
8. **On Queues and the Ticket Counter** -- FIFO, enqueue/dequeue, BFS, circular buffers | Analogy: A ticket counter where the first in line is served first
9. **On Deques and the Double-Ended Corridor** -- Operations at both ends, monotonic deques, sliding window | Analogy: A corridor with doors at both ends -- people can enter and leave from either side

#### Part III: Trees (Letters 10-15)
10. **On Binary Trees and the Family Genealogy** -- Nodes, edges, height, traversals (in/pre/post-order) | Analogy: A family tree where each person has at most two children
11. **On Binary Search Trees and the Library Filing System** -- Ordered insertion, search in O(log n), degenerate cases | Analogy: A library where books are filed left-if-before, right-if-after -- finding any book halves the search each time
12. **On AVL Trees and the Self-Balancing Scale** -- Rotations, balance factors, guaranteeing O(log n) | Analogy: A scale that automatically adds or removes weights to stay balanced after every change
13. **On Red-Black Trees and the Diplomatic Protocol** -- Color invariants, simpler rebalancing, practical advantage | Analogy: A diplomatic protocol with strict rules about alternation and hierarchy that guarantee no one faction dominates
14. **On B-Trees and the Encyclopedia Index** -- High branching factor, disk-friendly, database indexes | Analogy: An encyclopedia index where each page lists hundreds of entries with sub-page references -- minimizing the number of page turns
15. **On Tries and the Telephone Exchange** -- Prefix trees, autocomplete, IP routing | Analogy: A telephone exchange where each digit routes the call one step closer to the destination

#### Part IV: Heaps and Priority (Letters 16-18)
16. **On Heaps and the Hospital Triage** -- Min/max heap property, complete binary tree, array storage | Analogy: A hospital ER where the most critical patient is always seen first, regardless of arrival time
17. **On Heap Sort and the Tournament** -- Building a heap, extracting in order, in-place sorting | Analogy: A tournament where the winner is extracted, the bracket reshuffles, and the next best rises
18. **On Priority Queues and the Air Traffic Controller** -- Applications: scheduling, Dijkstra, event simulation | Analogy: An air traffic controller who always lands the most fuel-critical plane first

#### Part V: Hashing (Letters 19-22)
19. **On Hash Tables and the Coat Check** -- Hash function, buckets, O(1) average lookup | Analogy: A coat check that assigns a hook number by a formula applied to your name -- usually instant retrieval
20. **On Collisions and the Shared Mailbox** -- Chaining, open addressing, load factor | Analogy: Two people assigned the same mailbox -- protocols for sharing the space
21. **On Bloom Filters and the Bouncer's List** -- Probabilistic membership, false positives, no false negatives | Analogy: A nightclub bouncer with a quick-check list -- "definitely not on the list" or "probably on the list"
22. **On Consistent Hashing and the Revolving Door** -- Ring-based assignment, minimal disruption on add/remove | Analogy: Seats at a round table where removing one chair causes only two neighbors to shift

#### Part VI: Graphs (Letters 23-28)
23. **On Graphs and the Map of Connections** -- Vertices, edges, directed/undirected, weighted, representations | Analogy: A map where cities are dots and roads are lines -- the structure of connection itself
24. **On BFS and the Ripple in a Pond** -- Level-by-level exploration, shortest path in unweighted graphs | Analogy: A stone dropped in a pond -- the ripple reaches nearby shores before distant ones
25. **On DFS and the Maze Explorer** -- Depth-first search, backtracking, topological sort | Analogy: A maze explorer who always turns left until hitting a dead end, then backtracks
26. **On Dijkstra and the Cheapest Route** -- Priority-queue-based shortest path, edge relaxation | Analogy: A traveler who always extends their trip to the nearest unvisited city, building the cheapest route outward
27. **On Minimum Spanning Trees and the Railway Planner** -- Kruskal's and Prim's algorithms, greedy correctness | Analogy: A railway planner who connects all cities with the minimum total track -- always adding the cheapest available connection
28. **On Strongly Connected Components and the Diplomatic Circles** -- Tarjan's algorithm, condensation graphs | Analogy: Diplomatic circles where every member has met every other -- finding these cliques reveals the true structure

#### Part VII: Sorting in Depth (Letters 29-33)
29. **On Comparison Sorts and the Information-Theoretic Bound** -- Why O(n log n) is optimal for comparison sorts, decision tree model | Analogy: Twenty questions with n! possibilities -- log(n!) questions is the minimum
30. **On Quicksort and the Pivot** -- Partition, recursion, average vs. worst case, pivot selection | Analogy: A teacher who picks one student as the standard -- "shorter than Alice go left, taller go right" -- then repeats in each group
31. **On Mergesort and the Merging of Sorted Piles** -- Divide and conquer, stable sorting, external sort | Analogy: Merging two sorted stacks of exams -- take the lesser from the top of either stack
32. **On Radix Sort and the Postman's Method** -- Non-comparison sort, digit-by-digit, linear time | Analogy: A postman who sorts letters first by zip code, then by street, then by house number -- never comparing two addresses directly
33. **On Timsort and the Pragmatist's Blend** -- Adaptive sorting, natural runs, real-world performance | Analogy: A librarian who notices books are already partially sorted and exploits the existing order

#### Part VIII: Dynamic Programming (Letters 34-37)
34. **On Dynamic Programming and the Accountant's Ledger** -- Overlapping subproblems, optimal substructure, memoization | Analogy: An accountant who never recalculates a subtotal -- once computed, it goes in the ledger permanently
35. **On the Knapsack and the Traveler's Dilemma** -- 0/1 knapsack, the DP table, pseudo-polynomial time | Analogy: A traveler who must fit the most value into a suitcase of fixed size
36. **On Longest Common Subsequence and the Manuscript Comparison** -- Edit distance, diff algorithms, bioinformatics | Analogy: Comparing two editions of a manuscript to find the passages they share
37. **On Greedy Algorithms and the Impatient Optimist** -- When local optimality guarantees global optimality, matroid theory | Analogy: Always taking the largest coin that fits -- sometimes optimal, sometimes disastrous

#### Part IX: Advanced Structures (Letters 38-39)
38. **On Union-Find and the Village Elder** -- Disjoint sets, path compression, union by rank | Analogy: Villages that merge by making one elder defer to another -- path compression means everyone eventually points to the grand chief
39. **On Skip Lists and the Express Lane** -- Probabilistic balancing, layered linked lists | Analogy: A highway system with local roads, collector roads, and express lanes -- each level skips more stops

#### Part X: Meditation (Letter 40)
40. **On the Algorithm and the Shape of Thought** -- Algorithms as crystallized reasoning, the beauty of optimal solutions | The relationship between data shape and algorithmic shape -- structure begets strategy

### Wasm Demos for Algorithms
| Demo ID | Letter | Description |
|---------|--------|-------------|
| `sorting-theater` | 29-33 | Already exists. Extend with Radix and Timsort visualizations. |
| `tree-visualizer` | 10-14 | Interactive BST/AVL/Red-Black tree: insert/delete nodes, watch rotations animate, see height/balance info |
| `graph-traversal` | 24-25 | BFS/DFS on an editable graph: add/remove vertices and edges, watch traversal order with color-coded visited/frontier |
| `hashtable-probe` | 19-20 | Hash table with visible buckets: insert keys, see hash computation, watch collisions resolve via chaining or linear probing |
| `dp-table` | 34-35 | Dynamic programming table builder: visualize knapsack or LCS filling cell-by-cell with backtracking arrows |

---

## BOOK 4: "Letters on the Geometry of Networks"

**Distributed Systems, from TCP to Consensus**

- **id**: `networks`
- **file**: `books/networks.md`
- **symbol**: `funtunfunefu` (unity in diversity -- Siamese crocodiles sharing a stomach, perfect for networked systems)
- **accent**: `#4a90d9` (network blue)
- **letters**: 35
- **parts**: 9

### Outline

#### Part I: Signals and Channels (Letters 1-4)
1. **On Signals and the Telegraph Wire** -- Bits on a wire, encoding, bandwidth, noise | Analogy: Morse code on a telegraph -- the oldest digital network
2. **On Packets and the Postal System** -- Packet switching vs circuit switching, headers, fragmentation | Analogy: Sending a novel as numbered postcards rather than renting a dedicated courier
3. **On the OSI Model and the Diplomatic Pouch Layers** -- Physical to application, encapsulation, each layer's contract | Analogy: A diplomatic pouch inside a mailbag inside a shipping container -- each layer wraps and unwraps without seeing the others
4. **On Ethernet and the Shared Hallway** -- CSMA/CD, collision detection, frames, MAC addresses | Analogy: People in a shared hallway who must listen before speaking and back off when voices collide

#### Part II: The Internet Protocols (Letters 5-9)
5. **On IP and the Address on the Envelope** -- IPv4, IPv6, subnets, routing tables | Analogy: The address on an envelope -- it tells the system WHERE, not HOW
6. **On TCP and the Reliable Conversation** -- Three-way handshake, sequence numbers, retransmission, flow control | Analogy: A phone call with confirmation -- "Did you get that? Repeat it back to me."
7. **On UDP and the Shouted Message** -- Fire-and-forget, low latency, when losing packets is acceptable | Analogy: Shouting across a canyon -- fast, but no guarantee the other side heard
8. **On DNS and the Phone Book of the Internet** -- Hierarchical naming, caching, resolvers, TTL | Analogy: A phone book with a chain of operators -- "I don't know, but I know who does"
9. **On NAT and the Apartment Intercom** -- Address translation, port mapping, the exhaustion of IPv4 | Analogy: An apartment building where all residents share one street address -- the intercom routes visitors to the right unit

#### Part III: Reliability (Letters 10-13)
10. **On Retransmission and the Persistent Messenger** -- ACKs, timeouts, exponential backoff | Analogy: A messenger who keeps returning to the door until someone answers, waiting longer each time
11. **On Flow Control and the Gentle Dam** -- Sliding window, congestion window, TCP slow start | Analogy: A dam that opens its gates gradually, measuring downstream capacity before releasing more water
12. **On Error Detection and the Parity Check** -- Checksums, CRC, error-correcting codes | Analogy: Adding the digits of an account number to verify it was copied correctly -- a tiny summary that catches mistakes
13. **On Idempotency and the Light Switch** -- Safe retries, at-most-once vs at-least-once vs exactly-once | Analogy: A light switch (pressing twice = same as once) vs a doorbell (pressing twice = two rings)

#### Part IV: Distribution (Letters 14-17)
14. **On the CAP Theorem and the Three Wishes** -- Consistency, Availability, Partition tolerance -- pick two | Analogy: A genie who grants three wishes but says you may only ever use two
15. **On Replication and the Monastic Scribes** -- Leader/follower, multi-leader, leaderless, quorum reads/writes | Analogy: Monks copying manuscripts -- one master copy (leader) or many equal scriptoria (leaderless)
16. **On Partitions and the Severed Bridge** -- Network partitions, split brain, healing | Analogy: A bridge between two towns that collapses -- each town must function independently until repaired
17. **On Consistency Models and the Newspaper Editions** -- Linearizability, sequential consistency, eventual consistency, causal consistency | Analogy: A newspaper with multiple editions -- does everyone read the same edition at the same time, or merely eventually?

#### Part V: Consensus (Letters 18-22)
18. **On the Two Generals Problem and the Unreliable Messenger** -- Impossibility of consensus with unreliable links | Analogy: Two generals who must coordinate an attack but every messenger might be captured
19. **On Paxos and the Parliament of Acceptors** -- Proposers, acceptors, learners, the Paxos protocol | Analogy: A parliament where any member can propose a law, but a majority must agree before it takes effect
20. **On Raft and the Understandable Election** -- Leader election, log replication, safety guarantees | Analogy: A town that elects a mayor who keeps the official minutes -- if the mayor is absent, a new election is held
21. **On Vector Clocks and the Causal Diary** -- Detecting causality without global time | Analogy: Travelers who stamp their passports at every country -- comparing stamps reveals who went where before whom
22. **On CRDTs and the Conflict-Free Merge** -- Grow-only sets, counters, LWW registers, convergence guaranteed | Analogy: Each painter works on their own canvas following rules that guarantee all canvases converge to the same painting

#### Part VI: Application Layer Patterns (Letters 23-26)
23. **On Load Balancing and the Restaurant Host** -- Round-robin, weighted, consistent hashing, health checks | Analogy: A restaurant host who seats guests at the least busy table
24. **On Service Discovery and the Hotel Concierge** -- Registry, DNS-based, sidecar proxy | Analogy: A hotel concierge who knows which room every service is in, even as they move
25. **On Message Queues and the Pneumatic Tube** -- Pub/sub, point-to-point, backpressure, dead-letter queues | Analogy: Pneumatic tubes in a department store -- senders and receivers operate at different speeds, the tube buffers
26. **On Circuit Breakers and the Electrical Fuse** -- Fail fast, half-open state, cascading failure prevention | Analogy: An electrical fuse that trips to protect the house -- better a blown fuse than a house fire

#### Part VII: Security (Letters 27-29)
27. **On TLS and the Sealed Envelope** -- Handshake, certificate chains, forward secrecy | Analogy: Two diplomats who verify credentials, agree on a code, and then burn the key after the conversation
28. **On Certificate Authorities and the Chain of Trust** -- PKI, root CAs, certificate pinning, Let's Encrypt | Analogy: A chain of introductions -- "I trust the queen, who trusts the duke, who vouches for the merchant"
29. **On DDoS and the Mob at the Door** -- Volumetric attacks, amplification, mitigation strategies | Analogy: A mob that blocks the entrance to a shop -- legitimate customers cannot get through

#### Part VIII: Modern Architectures (Letters 30-33)
30. **On Microservices and the Specialist Workshop** -- Bounded contexts, independent deployment, the distributed monolith trap | Analogy: A street of specialist workshops vs. one general store -- more flexible but harder to coordinate
31. **On gRPC and the Contract-First Conversation** -- Protocol buffers, strongly typed RPC, streaming | Analogy: A conversation where both parties agree on a dictionary before speaking a word
32. **On WebSockets and the Open Telephone Line** -- Full-duplex, persistent connection, real-time applications | Analogy: A telephone call that stays open -- either party can speak at any time
33. **On CDNs and the Local Library Branch** -- Edge caching, PoPs, cache invalidation | Analogy: Branch libraries that stock copies of popular books -- most readers never need to visit the central archive

#### Part IX: Meditations (Letters 34-35)
34. **On the Fallacies of Distributed Computing and the Eight Lies** -- Deutsch's fallacies as a design checklist
35. **On the Network and the Shape of Trust** -- Every protocol is an answer to the question "whom do you trust, and how much?"

### Wasm Demos for Networks
| Demo ID | Letter | Description |
|---------|--------|-------------|
| `packet-router` | 2 | Packet routing simulator: visualize packets hopping between nodes, show routing tables, introduce congestion and dropped packets |
| `consensus-stepper` | 20 | Raft consensus visualization: step through leader election and log replication. Pause, inject failures, see term numbers increment |
| `tcp-handshake` | 6 | Three-way handshake animation: SYN, SYN-ACK, ACK with sequence numbers. Show retransmission on simulated packet loss |

---

## BOOK 5: "Letters on the Grammar of Machines"

**Compilers, from Regex to Code Generation**

- **id**: `compilers`
- **file**: `books/compilers.md`
- **symbol**: `adinkrahene` (greatness/charisma -- the king of Adinkra symbols, fitting for the king of CS subjects)
- **accent**: `#d4a017` (amber gold)
- **letters**: 35
- **parts**: 9

### Outline

#### Part I: Languages and Grammars (Letters 1-4)
1. **On Formal Languages and the Rules of Grammar** -- Alphabets, strings, languages as sets, the Chomsky hierarchy | Analogy: The rules of grammar that separate a sentence from gibberish
2. **On Regular Expressions and the Pattern Inspector** -- Regex as finite-state descriptions, Kleene's theorem | Analogy: A customs inspector with a checklist -- can verify any passport that matches the pattern, but cannot count
3. **On Context-Free Grammars and the Sentence Diagram** -- Productions, terminals/nonterminals, parse trees | Analogy: Diagramming a sentence into subject, verb, object -- recursive structure from flat text
4. **On Ambiguity and the Two Readings** -- Ambiguous grammars, dangling else, operator precedence as disambiguation | Analogy: "I saw the man with the telescope" -- two valid parse trees from one sentence

#### Part II: Lexical Analysis (Letters 5-8)
5. **On Tokens and the Coin Sorter** -- Lexemes, token types, the lexer's role | Analogy: A coin sorter that identifies each coin by size and weight before counting
6. **On Finite Automata and the Turnstile** -- DFA, NFA, the equivalence theorem | Analogy: A turnstile that accepts or rejects sequences of coins -- it has states but no memory
7. **On NFA-to-DFA and the Parallel Exploration** -- Subset construction, powerset | Analogy: Exploring a maze by cloning yourself at every fork, then merging your knowledge afterward
