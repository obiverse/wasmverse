# Letters on the Animation of Worlds

### A Treatise on Game Development, from the Loop to the Living World

*In the manner of Euler's Letters to a German Princess*

---

## Preface

Dear Reader,

Long before any computer existed, the children of Africa were programming. In the sand of an Akan compound, two players sat opposite a wooden board carved with twelve cups. Into the cups they placed seeds — sometimes cowries, sometimes pebbles, sometimes the small hard kernels of the oil palm. The game was *Oware* in Ghana, *Bao* on the Swahili coast, *Ayo* among the Yoruba, *Omweso* in Uganda, *Gebeta* in Ethiopia. Across the continent it bears a thousand names, but the rules are nearly identical, and the game is older than any written record. Some archaeologists trace its ancestors to ancient Kush, others to the Nile valley before the dynasties. Whatever its true origin, this much is certain: the African mind has been designing rule systems for play for at least four thousand years.

What is *Oware*, exactly? It is a finite-state machine. Each cup is a memory cell. Each move is a transition function. The "sowing" — the act of picking up the seeds in one cup and dropping them one by one into the cups that follow — is a deterministic operation on the game state. The capture rule is a conditional. The terminal condition is a predicate. *Oware* is, in every formal sense, a *program*. The only difference between a child playing *Oware* under a baobab in Kumasi and a programmer building a turn-based game in Lagos is the substrate. One uses seeds and wood; the other uses electrons and silicon. The mathematics is identical. The seeds were always going to become pixels. We are simply translating an ancient art into a new material.

This treatise teaches you to build games. Not to play them — to *build* them. By the time you finish the last letter, you will be able to design a world, animate its inhabitants, simulate its physics, respond to a player's hand, render it sixty times a second, and ship it to any phone in Africa as a single URL. You will understand the game loop with the same intimacy with which you understand your own pulse. You will know why a falling object accelerates, why a character that nearly clears a platform feels broken, why a multiplayer game on a slow connection behaves like a drunken man, and how to mend each of these. You will learn to write your games in JavaScript and in Rust, compile them to WebAssembly, and run them in any browser without any store, any publisher, any permission.

The game development industry, as the world measures it, is now larger than film and music combined — roughly two hundred and fifty billion dollars a year. Africa is, by population, the largest emerging market for it. By creators, however, the continent is a desert. Not because Africans cannot make games — *Oware* is the proof against that slander — but because the discipline has been packaged as the property of foreign studios with budgets the size of small nations. This is a lie we shall now help to dismantle. A game is mathematics, geometry, art, and a loop. The mathematics is universal. The art is everywhere. The loop is just code. And code is cheap.

Why would Euler care about games? The answer is that Euler already wrote about games and did not call them that. His most famous puzzle — the Seven Bridges of Königsberg — is, structurally, a game level: a set of locations, a set of moves, a win condition. The branch of mathematics he founded by solving it, *graph theory*, is the same mathematics every modern game uses to find paths through dungeons, to route enemies around walls, to connect quest objectives. His formula relating vertices, edges, and faces of a polyhedron, **V − E + F = 2**, is the foundation of every 3D mesh you will ever render. His work on the Knight's Tour — finding a path for a chess knight that visits every square on the board exactly once — is a direct ancestor of every puzzle game and every procedural level generator. Euler did not just write about games. Euler designed the mathematics that *makes* games possible. He would have loved this subject. He would have wanted us to teach it.

I have arranged these letters in six parts, each tracing a layer of the game from the inside out. The first part is the **loop** — the heartbeat of every game ever made. The second is the **geometry** — vectors, transforms, collisions, the language of where-things-are. The third is the **soul** — entities, behaviour, animation, the question of how a sprite acquires the appearance of life. The fourth is the **senses** — pixels, sprites, shaders, sound, the surface where the game touches the player. The fifth is the **physics** — the laws of the small universe you have made, and the difference between physics that *is* correct and physics that *feels* correct, which are not the same thing. The sixth is the **meaning** — game design, story, sovereignty, the question of what kind of world you wish to author and what your players will carry away from it.

We begin with the loop, because everything else is consequence.

---

## Part I: The Loop That Is the World

### Letter 1: On the Loop and the Beating of the Heart

Dear Reader,

Place your fingers on the side of your throat, just below the angle of your jaw. You will feel a small, steady pulse — perhaps seventy times each minute, perhaps eighty, perhaps a hundred if you have just climbed stairs. That pulse is not your life. Your life is the *continuity* between the pulses, the work the heart does in the silent intervals when nothing is being felt. But without the pulse, there would be no continuity. Without the rhythmic act of contraction and release, the blood would not move, the cells would not be fed, and the whole great river of your existence would cease within minutes. The pulse is not life, but life lives by the pulse.

A game lives by the same arrangement. When you watch a character on a screen run, jump, fall, and land, you are not watching motion. You are watching a sequence of still images, each one slightly different from the last, presented to your eye at a rate fast enough that your visual cortex blends them into the appearance of motion. The standard rate is sixty times each second — sixty *frames per second*, often abbreviated 60 FPS. Each frame is a complete still image. Between two frames, the screen is doing nothing the eye can see; the computer is doing everything. It is reading the player's input, advancing the simulation, computing where everything has moved to, what has collided with what, who has been hit, who has fallen, who has won — and then drawing the next frame and showing it. Sixty times a second. Without pause. From the moment the game starts to the moment the player closes the window.

This rhythm is called the **game loop**, and it is the single most important concept in this entire treatise. Every game ever made, from the simplest *Pong* clone to the most lavish open-world adventure, runs a game loop. A web game written in JavaScript runs a game loop. A Nintendo cartridge from 1985 runs a game loop. The arcade cabinet in a Lagos mall runs a game loop. Strip away the graphics, the sound, the network code, the marketing — what remains, at the bottom of every game, is a single repeating sequence of three steps: *read the input, update the world, draw the world*. Read, update, draw. Read, update, draw. Sixty times a second, until the player goes home.

The talking drum of the Yoruba — the *dùndún* — is built around exactly the same principle. The drummer holds the drum under one arm, with leather thongs running between the two heads. By squeezing the thongs, the drummer changes the tension of the membrane, and the pitch of the drum rises and falls in imitation of the tonal patterns of Yoruba speech. The drum *talks*. But the talking is not continuous. Each syllable is a single strike of the curved beater — a discrete event, an instant of contact, followed by silence. The listener hears a sentence; the drum produces a sequence of strikes. Between the strikes, the drum is silent. Between the strikes, the drummer is squeezing the thongs to set the pitch for the next strike. The illusion of speech is built from a stream of discrete moments, each one carefully prepared in the silence that preceded it. *Dùndún* is a game loop. Squeeze (update). Strike (render). Listen (input). Squeeze. Strike. Listen.

Let us write the simplest possible game loop in code. We shall use HTML and JavaScript, because they require no installation and run on any phone in the world.

```javascript
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

// The state of our small world: a single ball
let ball = { x: 100, y: 100, vx: 3, vy: 2 };

function update(dt) {
    // Advance the ball by its velocity
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Bounce off the walls
    if (ball.x < 0 || ball.x > canvas.width)  ball.vx = -ball.vx;
    if (ball.y < 0 || ball.y > canvas.height) ball.vy = -ball.vy;
}

function render() {
    // Clear the canvas — wipe yesterday's frame away
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw today's frame: the ball at its current position
    ctx.fillStyle = '#ec5d3a';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, 12, 0, Math.PI * 2);
    ctx.fill();
}

function frame() {
    update(1/60);                  // advance the world by one tick
    render();                      // paint the world
    requestAnimationFrame(frame);  // ask the browser for the next frame
}

requestAnimationFrame(frame);      // begin the heartbeat
```

Read this code carefully, because every game you will ever build — in any language, on any platform — is a refinement of these twenty lines. The variable `ball` is the **state** of the world. The function `update` is the **physics** — the rule that says how the world changes from one moment to the next. The function `render` is the **projection** — the rule that says how the world is drawn so the player can see it. And the function `frame` is the **loop** — the eternal repetition that keeps the world alive. Remove `requestAnimationFrame` and the world freezes mid-step. Remove `update` and the ball never moves. Remove `render` and the player sees nothing. All three must run, in order, sixty times a second, forever.

There is a subtlety hidden in the line `update(1/60)`. The argument `1/60` is the **time step** — the amount of simulated time that passes between one frame and the next. We have hard-coded it to one-sixtieth of a second, on the assumption that the browser will indeed call us sixty times a second. But what if it does not? What if the player's phone is old, and the browser can only manage thirty frames per second? Then the ball will move at half the speed it should. What if the player has a new gaming monitor that runs at one hundred and twenty hertz? Then the ball will move at twice the speed. This is the **frame-rate dependence problem**, and it has ruined more games than any other single mistake. We shall solve it properly in the next letter, when we meet *delta time*. For now, simply notice that the time step is a *promise* about how often the loop will run, and that promises must be checked.

There is something quietly miraculous in this arrangement. The ball, in our code, does not exist between frames. At one instant it is at position (100, 100). At the next instant it is at (103, 102). Between those two instants there is no ball — there is only the *rule* that takes the old position and produces the new one. The continuity is an illusion the player's mind constructs by interpolating between the discrete frames. This is precisely the situation contemporary physics describes for the universe itself. Quantum mechanics suggests that the physical world, at its smallest scale, is not continuous — that space comes in indivisible parcels of the *Planck length*, and time in indivisible ticks of the *Planck time*, and that "between" two ticks the universe is, in some deep sense, not anywhere. The cosmos may be running its own game loop, at a frame rate of about 10⁴³ frames per second. We do not know if this is true. We know only that the same architecture that makes the simplest browser game possible also describes the deepest hypothesis about reality. To program a game loop is, in a small way, to imitate the most fundamental act of creation: to declare a state, to write a rule, and then to repeat the rule until a world emerges.

In the next letter we shall make our loop honest. We shall stop pretending that every frame takes exactly one-sixtieth of a second, and we shall learn to measure the time that has truly elapsed. This is the small correction that turns a toy into a tool — and that allows the same code to run, faithfully, on a flagship phone in Johannesburg and a four-year-old budget Android in Bamako. The drum must speak the same words whether the drummer's hands are quick or slow. We shall now make ours capable of doing so.

---

### Letter 2: On Delta Time and the Honest Clock

My dear reader, we left the last letter with a small embarrassment. Our loop declared, with a confidence it had not earned, that every frame takes exactly one-sixtieth of a second. It called `update(1/60)` and then asked the browser to wake it up again, as if the browser were a perfectly punctual servant who would return at precisely the appointed instant. But browsers are not punctual servants. Phones are not punctual servants. A phone on a cold morning, with fifteen background apps fighting for the processor, will deliver frames at forty-two hertz one second and at fifty-eight the next. A phone on battery saver mode will throttle itself without warning. A gaming monitor at home will run at a hundred and twenty. And our ball, which computes its motion in frames rather than in seconds, will race on the fast machine and crawl on the slow one. The same code, on two devices, will produce two different games. This is intolerable.

The cure has a name: **delta time**, written `dt`, the Greek letter delta standing for *difference*. At the start of each frame, instead of assuming how long the last frame took, we *measure* it. The browser provides a clock — `performance.now()` — which returns the number of milliseconds since the page loaded, accurate to roughly a thousandth of a millisecond. We record the time at which the current frame begins, subtract the time of the previous frame, divide by a thousand to convert milliseconds into seconds, and we have `dt` — the honest interval, the true gap between this heartbeat and the last. Then, when we update the ball, we no longer say "move three pixels per frame." We say "move one hundred and eighty pixels *per second*," and we multiply by `dt`. If the frame was slow, `dt` is larger, and the ball jumps further to compensate. If the frame was fast, `dt` is smaller, and the ball creeps by a proportionally smaller amount. The total distance covered in one second is always the same, whatever the frame rate. The motion becomes **frame-rate independent**.

```javascript
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

// Velocities are now in pixels per SECOND, not pixels per frame
let ball = { x: 100, y: 100, vx: 180, vy: 120 };

let lastTime = performance.now();

function update(dt) {
    ball.x += ball.vx * dt;
    ball.y += ball.vy * dt;
    if (ball.x < 0 || ball.x > canvas.width)  ball.vx = -ball.vx;
    if (ball.y < 0 || ball.y > canvas.height) ball.vy = -ball.vy;
}

function render() {
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ec5d3a';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, 12, 0, Math.PI * 2);
    ctx.fill();
}

function frame(now) {
    const dt = (now - lastTime) / 1000;  // milliseconds → seconds
    lastTime = now;
    update(dt);
    render();
    requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
```

Read the change slowly. The variable `ball.vx` was `3` before; it is now `180`. Why one hundred and eighty? Because three pixels per frame at sixty frames per second is one hundred and eighty pixels per second — the same velocity, expressed in the honest unit. The multiplication `ball.vx * dt` is the act of integration, the oldest technique in the calculus: velocity multiplied by time equals distance. Euler himself, in the *Institutiones Calculi Integralis*, taught this very trick three centuries ago. When you write `ball.x += ball.vx * dt`, you are performing Euler's method — a first-order numerical integration of the equation of motion. You are not borrowing from Euler's work in some decorative sense; you are *doing* Euler's work, with a computer where he had only quill and ink. We shall return to this in the physics letters, where Euler's method will show both its power and its limits.

There is an African parable for this that is exact. Consider the boatman who crosses Lake Volta at dawn. He does not measure his progress by counting his strokes. He could count his strokes — one, two, three, up to a thousand — but if the wind is against him each stroke moves him less, and if the current is with him each stroke moves him more, and at the end of a thousand strokes he does not know where he is. The experienced boatman watches the far shore. He measures his progress by the *distance actually travelled*, not by the *number of actions performed*. The stroke is the frame. The distance is the delta. The truth lives in the measurement, not in the cadence. A young boatman counts strokes and arrives at the wrong village. An old boatman watches the shore and arrives home.

The *Suame Magazine* in Kumasi, which is the largest concentration of auto mechanics in West Africa, teaches the same lesson in a different register. When a Suame master tunes an engine, he does not count his hammer blows. He attaches a timing light, or a meter, or his trained ear, and he measures the *result* — the rhythm of the engine itself, in revolutions per minute. Two mechanics with different hands will reach the same tuning, because both are adjusting not to their own gestures but to the clock of the engine. The hammer is the frame. The RPM is the delta. A craftsman who judges his work by the feel of his own hand produces work that varies with his mood. A craftsman who judges by the instrument produces work that is the same on Monday as on Friday. Frame-rate independence is engineering discipline inherited from the workshop.

Consider now what this small change permits. A teenager in Johannesburg, playing our game on the latest flagship phone at one hundred and twenty frames per second, sees the ball cross the screen in exactly the same time as a teenager in Bamako playing the same URL on a four-year-old phone at forty frames per second. The phones draw different numbers of frames. The phones compute different deltas. But the product `velocity × time` — the total distance travelled — is identical. The game is the same game. This is not a small thing. It is the foundation of *fairness*, and fairness is the foundation of multiplayer, and multiplayer is the foundation of community, and community is the foundation of a game that matters in a place rather than merely being consumed there. Without delta time, a Lagos tournament would be unwinnable by anyone without an expensive phone, and the art would calcify into a class privilege. With delta time, any phone is enough.

There is a catch, however, and it is serious enough to demand the whole of the next letter. Delta time is honest about the past — it tells us exactly how long the last frame took — but it is dishonest about the *physics*. If the player's phone hiccups and a single frame takes a quarter of a second (because the browser paused to garbage-collect, or because an incoming WhatsApp notification stole the processor), then `dt` for that frame will be `0.25`. And if we multiply our velocity by `0.25`, the ball will jump forward a quarter of a second's worth of motion *in a single step*. For a ball bouncing gently in a box, this is merely ugly. For a character jumping onto a platform, it is catastrophic: the character may skip right through the platform as if it were not there, because between "above the platform" and "below the platform" there was no frame in which the character was "on" the platform. Variable time steps break physics. In the next letter we shall meet the **fixed timestep**, the small discipline that separates the trembling bridge of a broken simulation from a bridge the player may safely cross.

### Letter 3: On the Fixed Timestep and the Trembling Bridge

Dear reader, imagine a bridge of planks across a ravine. The planks are laid at fixed intervals, one every pace. A runner crosses the bridge by placing one foot on each plank in turn. If the runner is tired, his pace is slow; if rested, his pace is quick; but each footfall lands on a plank, and the bridge holds, because the distance between planks is *fixed by the bridge, not by the runner*. Now imagine a second bridge whose planks are laid at variable intervals — two paces here, half a pace there, a yawning gap beyond. A runner on this bridge cannot trust his stride. One footfall will land on solid wood; the next will punch through air and plunge him into the ravine. A game whose physics is driven by the raw `dt` of the last letter is this second bridge. Most of the time the intervals are comfortable and the runner crosses safely. But once in a while a frame is long, the interval yawns, and the character falls through the world.

The reason is mathematical, not merely aesthetic. When we wrote `ball.x += ball.vx * dt` we performed what mathematicians call **Euler integration**, a linear approximation of a curve. For a ball moving in a straight line, the approximation is exact. But for any interesting physics — a character bouncing on a trampoline, a pendulum swinging, a spring oscillating, two planets orbiting each other — the curve is not straight, and the error of the approximation grows with `dt`. Small `dt`, small error. Large `dt`, large error. Worse still, the errors *compound*: each bad step nudges the state slightly off the true curve, and the next step starts from the wrong place, and drifts further. A spring simulated with a variable `dt` that occasionally spikes will, within a few seconds, explode into infinity. A character simulated with a variable `dt` will, sooner or later, tunnel through a wall. These are not bugs in your code; they are unavoidable consequences of the mathematics of numerical integration with a non-uniform step size.

The cure is a discipline named the **fixed timestep**. The idea is to separate the two clocks that live inside every game: the **simulation clock**, which ticks at a fixed, constant rate — say, one hundred and twenty times per second, or every `1/120` of a second — and the **render clock**, which runs as fast as the screen will allow. The render clock tells us *when to draw*. The simulation clock tells us *when to think*. They are no longer the same clock. Between two rendered frames, the simulation may tick once, twice, ten times, or zero times, depending on how much real time has passed. Inside each simulation tick, `dt` is always exactly `1/120`. The physics sees a perfectly regular bridge. The runner's stride is always the same length. Nothing falls through.

The technique that glues the two clocks together is the **accumulator**. It is a small bank account that holds elapsed real time. Each frame, we deposit the real `dt` into the accumulator. Then we withdraw fixed-size chunks — exactly `1/120` of a second each — and run one simulation tick per chunk, until the accumulator has less than a full chunk remaining. The remainder sits in the accumulator until next frame, when a new deposit is added. No real time is ever lost; no simulation tick is ever of irregular length. The simulation proceeds on its own steady heartbeat, while the display flexes to match whatever the phone can deliver.

```javascript
const STEP = 1 / 120;  // simulation ticks at exactly 120 Hz
let accumulator = 0;
let lastTime = performance.now();

let ball = { x: 100, y: 100, vx: 180, vy: 120 };
let prevBall = { ...ball };  // last simulated state, for interpolation

function simulate(dt) {
    prevBall = { ...ball };
    ball.x += ball.vx * dt;
    ball.y += ball.vy * dt;
    if (ball.x < 0 || ball.x > canvas.width)  ball.vx = -ball.vx;
    if (ball.y < 0 || ball.y > canvas.height) ball.vy = -ball.vy;
}

function render(alpha) {
    // Interpolate between the last two simulated states
    const x = prevBall.x * (1 - alpha) + ball.x * alpha;
    const y = prevBall.y * (1 - alpha) + ball.y * alpha;
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ec5d3a';
    ctx.beginPath();
    ctx.arc(x, y, 12, 0, Math.PI * 2);
    ctx.fill();
}

function frame(now) {
    let dt = (now - lastTime) / 1000;
    lastTime = now;
    if (dt > 0.25) dt = 0.25;  // clamp after a tab-switch
    accumulator += dt;
    while (accumulator >= STEP) {
        simulate(STEP);
        accumulator -= STEP;
    }
    const alpha = accumulator / STEP;  // 0..1 — how far into the next tick
    render(alpha);
    requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
```

There is one subtlety worth lingering on, and it is the line `const alpha = accumulator / STEP`. After the `while` loop, the accumulator holds a small residue — less than one full step's worth of time that has passed in the real world but has not yet been simulated. If we simply drew the ball at its latest simulated position, we would introduce a tiny lag and a small judder, because the display is showing a state that is slightly behind reality. The cure is **interpolation**: we remember the previous simulated state (`prevBall`) and the current one (`ball`), and we draw the ball at a weighted blend of the two, where the weight `alpha` is the fraction of the residue into the next tick. When `alpha` is zero, we draw the previous state; when `alpha` is one, we draw the current state; when `alpha` is a half, we draw halfway between. The motion becomes glass-smooth even when the render rate and the simulation rate are entirely unrelated. This trick was formalised for a generation of game developers by Glenn Fiedler in his 2004 essay *"Fix Your Timestep!"*, but the underlying idea is older than any computer.

Older, for instance, than the *dùndún* we met in Letter 1. The master drummer of a Yoruba court knows that the tempo of the *bàtá* ensemble is sacred. It does not speed up when a dancer grows excited, and it does not slow down when a dancer grows tired. The drum holds the clock. The dancer flexes against it — sometimes on the beat, sometimes a fraction ahead, sometimes a fraction behind, sometimes deliberately syncopated — but the beat itself is unmoved. *The inner clock is fixed; the outer performance bends to match*. This is the fixed timestep expressed in wood and skin. If the drummer allowed the beat to wander with the mood of the dancers, the ensemble would collapse within minutes, because each drummer would drift from each other, and the ritual would dissolve into noise. The fixed beat is what permits the flexibility of the dance to be safe. In a game, the fixed simulation tick is what permits the flexibility of the rendering rate to be safe. Without the one, the other destroys itself.

The Akan proverb says, "*The river flows, but its bed is still*." A game is a river; the fixed timestep is the bed. The water can rush or crawl, the dancers above can leap or walk, the phones in the field can render forty frames or a hundred and twenty, and beneath all of it the simulation steps forward in perfect, unvarying rhythm. This is the first technical commitment of a serious game programmer, and many who never learn it spend years chasing bugs that are not bugs in their code but bugs in their time. In the next letter we shall turn from the *when* of the simulation to the *what* — the thing that the simulation actually advances, which has a name of its own. It is called **state**, and it is the entire substance of your small universe.

### Letter 4: On State and the Eternal Present

Consider, my dear reader, an *Oware* board at some instant in the middle of a game. Twelve cups, carved into a plank of wood, each holding some number of seeds. Perhaps the first cup holds four seeds, the second holds zero, the third holds seven, and so on across the board. The two players sit opposite each other; one of them is about to move. Now pause. Look at the board. Answer this question: *what is the complete situation of the game at this moment?* The answer is not long. It is: the number of seeds in each of the twelve cups, the number of seeds each player has captured so far, and whose turn it is to move. That is all. From that small bundle of numbers, any other player who sat down before the board could continue the game exactly where you had left it. They would not need to know what moves had come before. They would not need to know the players' names, the time of day, or the weather. They would need only the twelve cup-counts, the two capture-counts, and a single bit telling them whose turn it is. *Fifteen numbers.* That is the entire game.

This small bundle of numbers has a name in our craft. It is called the **state**. The state of a game, at any instant, is the complete collection of values that determines everything the game currently is. If you know the state, you know the game. If two games have identical states, they are — for all formal purposes — the same game. Nothing that has happened in the past matters except insofar as it has left its trace in the present state. This is a deep claim, and it is worth pausing over: *the past is only the state it has produced*. A character who has been wounded and healed is no different from a character who was never wounded, provided both end up with the same health value. The history has vanished; only the summary remains. This is not a limitation. It is a liberation. It means that to save a game you need only write down the state. It means that to send a game across a network you need only send the state. It means that to understand a game you need only read the state.

In code, the state of a small platformer might look like this:

```javascript
const state = {
    player: {
        x: 64, y: 400,
        vx: 0, vy: 0,
        facing: 'right',
        health: 3,
        onGround: true,
        coinsCollected: 0,
    },
    enemies: [
        { kind: 'goomba', x: 300, y: 400, vx: -30, alive: true },
        { kind: 'goomba', x: 700, y: 400, vx: -30, alive: true },
    ],
    coins: [
        { x: 200, y: 350, collected: false },
        { x: 450, y: 300, collected: false },
    ],
    level: 1,
    score: 0,
    timeRemaining: 300,
    paused: false,
};

function update(state, input, dt) {
    // Read input, advance physics, resolve collisions,
    // and return a new state — or mutate in place.
    // This single function is the entire definition of the game.
    return newState;
}
```

Read this carefully. The object `state` contains no code. It is pure data: numbers, strings, booleans, arrays of more data. The function `update` contains no data of its own; it is pure code. The separation is total and deliberate. **Behaviour lives in functions; identity lives in state.** This is the single most important architectural idea in game programming, and it generalises beyond games to almost every system a programmer will ever build. The reason is that data can be saved, loaded, inspected, transmitted, rewound, and duplicated, whereas code cannot. If your game mixes behaviour and identity — if, for example, an enemy's current anger level is stored in a local variable inside a method rather than in a field on a state record — then you cannot save the game without also saving the contents of the call stack, which is a feat no practical engine attempts. Keep state in data. Keep behaviour in functions. The line between them is the border that divides what can be *remembered* from what can only be *re-executed*.

There is a further discipline, practised by the most careful game programmers, called **immutability**. In its strict form, `update` does not modify the old state at all. It reads the old state and the input, and it constructs an entirely new state object containing the new values, leaving the old state unchanged. This sounds wasteful — and in certain hot loops it is — but it brings extraordinary benefits. You can keep the last N states in a ring buffer and offer the player a rewind button. You can compare two states to see exactly what changed. You can hand the old state to a replay system without fearing that the live game will mutate it under the replay's feet. You can run the game forward in parallel from several different inputs to see which one yields the best outcome — the basis of many forms of game AI. Immutability costs a little in performance and buys a great deal in reasoning power. In practice, most game programmers settle for a compromise: mutate within a single tick for speed, but treat the state at tick boundaries as if it were immutable — never keeping references to parts of it across ticks, never allowing one subsystem to alter what another subsystem is still reading.

The *Ifa* divination corpus of the Yoruba is, in every structural sense, the most ancient state system the continent has preserved. A babalawo — a priest of Ifa — carries in his trained memory the full library of **256 *Odu***, each *Odu* being a named state with its own associated verses, proverbs, remedies, and sacrifices. To cast a reading, the babalawo scatters sixteen cowries or strikes the *opele* chain and observes the outcome, which is the **input** to the system. The input selects exactly one of the 256 *Odu*, and that *Odu* is the **new state** of the consultation. The verses and instructions associated with the chosen *Odu* are then recited to the client. Read this paragraph again with a programmer's eye: there is a finite state space of size 256, there is an input device that produces a selection, there is a transition function that maps input to state, and there is an output function that maps state to words. This is a program. It has been running, continuously, on the biological processors of trained priests, for at least a thousand years. When you write `function update(state, input, dt)` in your game, you are not inventing a new pattern. You are translating the oldest profession on the continent into JavaScript.

The Oware board itself is the simpler, more literal example. The board *is* the state. When you photograph an Oware game in progress, you have saved the game. When you hand the photograph to a friend who knows the rules, they can continue the game from where you stopped. There is no hidden memory; there is no secret history; there is no unspoken context. Everything the game is, is visible on the wood. This transparency — this property that the state is a single, complete, inspectable object — is the property you must engineer into every game you build. If a bug appears, you should be able to print the state and see exactly what is wrong. If a feature is missing, you should be able to add a field to the state and a clause to the update function, and the feature should appear. A game whose state is hidden or scattered across many mutable objects is a game you cannot debug, cannot save, cannot replay, and ultimately cannot finish.

In the next letter we shall consider a special kind of state — one whose values are drawn from a small, fixed alphabet, and whose transitions form a graph. It is the state pattern that lives inside every arcade ghost, every door, every boss, every menu, and every NPC. The Akan compound already knew its shape. We shall give it its computer-science name: the **finite-state machine**.

### Letter 5: On the Akan Compound and the Coin-Op Cabinet

Walk, dear reader, into a traditional Akan compound at first light. The sun has not yet cleared the edge of the palm trees, and the compound is in one of its characteristic conditions — a condition a programmer would call a **state**. The women are grinding millet by the hearth; the children are drawing water from the standing pot; the elders are still asleep beneath their wrappers. This is *dawn-state*. An hour later, the sun is up, the food is cooked, and the children are sent off along the path to the market stalls; the compound has transitioned into *market-state*. Midday brings *rest-state* — the hottest hour, when nothing is done, and the compound is silent under the shade. Afternoon brings *palaver-state*, when disputes are heard beneath the wawa tree and the elders speak in turn. Evening brings *meal-state*, then *story-state*, then *sleep-state*, and the cycle begins again. Each state has its own permitted activities, its own roles, its own sounds. The transitions between states are not arbitrary — they are triggered by specific cues: the crow of the rooster, the position of the sun, the ringing of a handbell, the arrival of a visitor. There is no Akan elder who would describe the compound this way, but what I have just described is, in the precise technical sense of the term, a **finite-state machine**.

A *finite-state machine* — often abbreviated **FSM** — is a system that at any moment is in exactly one of a fixed, finite collection of states, and that moves between those states by transitions triggered by specific events. The machine is "finite" because there is a known, enumerable list of states; there is no continuous dial with infinitely many positions. It is a "state machine" because its behaviour at any instant depends entirely on which state it is in. The same input, delivered in two different states, produces two different outcomes. Hand the same visitor to the compound at dawn and at midnight, and the response is completely different — the dawn guest is welcomed with porridge, the midnight guest with suspicion. The input is identical; the behaviour is not. Behaviour is a function of state.

The arcade games of the 1980s were built almost entirely on this pattern, and the clearest example is *Pac-Man*. The four ghosts — Blinky, Pinky, Inky, and Clyde — appear to have rich, distinct personalities, but each ghost has only four states and a single transition diagram. The states are **Scatter** (retreat to your assigned corner), **Chase** (pursue Pac-Man according to your personal rule), **Frightened** (flee randomly, Pac-Man can eat you), and **Eaten** (return to the ghost house as a pair of eyes, then respawn). Transitions: a timer switches between Scatter and Chase on a schedule; Pac-Man eating a power pellet forces every ghost into Frightened; being eaten transitions to Eaten; reaching the ghost house transitions from Eaten back to Chase. That is the entire ghost. There is no hidden sophistication. The feeling that each ghost has a personality comes from the specific rule used in the Chase state — Blinky chases Pac-Man's current tile, Pinky chases the tile four ahead of Pac-Man, Inky uses Blinky's position in a vector calculation, Clyde alternates between chasing and retreating — but the skeleton is four states and a handful of transitions. *Four states per ghost. A game that a continent played for forty years.*

Let us build a state machine in code. We shall make it a patrolling enemy with four states: **Patrol** (walking a fixed path), **Alert** (heard something, stopped to look), **Chase** (spotted the player, pursuing), and **Return** (lost the player, walking back to the patrol route).

```javascript
const State = Object.freeze({
    Patrol: 'Patrol',
    Alert:  'Alert',
    Chase:  'Chase',
    Return: 'Return',
});

function transition(enemy, event, world) {
    switch (enemy.state) {
        case State.Patrol:
            if (event === 'noise')       return State.Alert;
            if (event === 'see_player')  return State.Chase;
            break;
        case State.Alert:
            if (event === 'see_player')  return State.Chase;
            if (event === 'timeout')     return State.Patrol;
            break;
        case State.Chase:
            if (event === 'lost_player') return State.Return;
            if (event === 'reach_player')return State.Chase; // attack handled elsewhere
            break;
        case State.Return:
            if (event === 'at_route')    return State.Patrol;
            if (event === 'see_player')  return State.Chase;
            break;
    }
    return enemy.state;  // no transition — stay where we are
}

function updateEnemy(enemy, world, dt) {
    // First, what has happened since last tick?
    const events = senseWorld(enemy, world);
    for (const event of events) enemy.state = transition(enemy, event, world);

    // Then, behave according to the current state.
    switch (enemy.state) {
        case State.Patrol: walkPatrolPath(enemy, dt);            break;
        case State.Alert:  standAndLook(enemy, dt);              break;
        case State.Chase:  runTowards(enemy, world.player, dt);  break;
        case State.Return: walkTowards(enemy, enemy.routeStart, dt); break;
    }
}
```

Notice the structure of this code. There are exactly two things happening. First, we **sense** — we look at the world and produce a list of events (a noise was heard, the player is visible, a timer ran out, the patrol path was reached). Second, we **transition** — we feed each event through the `transition` function, which knows, for each (state, event) pair, which new state to enter. Third, we **act** — we do whatever the current state prescribes. The separation of sensing, transitioning, and acting is not decorative; it is the discipline that keeps the machine comprehensible. A novice who mixes the three — who writes "if the player is visible then run towards them" directly inside `updatePatrol` — discovers within a week that his enemy AI is an unreadable tangle in which no two behaviours can be added without breaking a third. The FSM pattern forces the programmer to name his states, enumerate his transitions, and keep the logic of *when* separate from the logic of *what*. This discipline is worth more than any amount of clever code.

State machines are everywhere once you learn to see them. A *door* has states: Closed, Opening, Open, Closing. A *traffic light*: Red, Green, Yellow. A *menu*: MainMenu, Settings, LevelSelect, InGame, Paused, GameOver. A *combo* in a fighting game is a path through a state graph — Neutral → Forward → Down → DownForward → Punch produces a fireball, because those exact five transitions lead to the `Fireball` state. Even the entire *game* is a state machine at its outermost level: Boot → TitleScreen → Playing → Paused → GameOver → TitleScreen. When you design a new system, the first question to ask is: *what are the states?* The second question is: *what are the transitions?* If you can answer those two questions on a single sheet of paper — with boxes for the states and arrows for the transitions — you have specified the behaviour completely, and the code will almost write itself.

The Akan compound, the arcade ghost, the fighting-game combo, the traffic light, and the boss monster are the same thing in different substrates. A finite set of conditions, a finite set of events, a rule for moving between them. The human mind finds this pattern so natural that cultures across the continent have been using it for rituals, for legal procedures, for ceremonies, for generations before any alphabet was written. When you encode it in JavaScript, you are not borrowing from computer science. You are lending computer science the shape that human beings had already worked out. The only new thing is the speed of execution: the compound transitions four or five times a day, the arcade ghost transitions four or five times a *second*.

There is one property of well-built state machines that is so valuable it deserves a letter of its own. It is the property that, given the same state and the same sequence of events, the machine will always produce exactly the same result. Run the ghost with the same Pac-Man inputs and the ghost will walk exactly the same path. Run the compound through a day with the same weather and visitors and the same rituals unfold in the same order. This property is called **determinism**, and in the next letter we shall see that it is the hinge on which replays, testing, tool-assisted speedruns, and an entire class of multiplayer games all turn.

### Letter 6: On Determinism and the Joy of Replay

A *griot* of the Mande people is, by training, a living library. His profession is to hold in memory the epic of *Sundiata* — the story of the thirteenth-century founder of the Mali Empire, Sundiata Keita — and to recite it, in full, when called upon. The epic is long: thousands of verses, hundreds of named characters, dozens of episodes. A single performance takes hours. And the remarkable fact, the fact that strikes every scholar who has studied the tradition, is that when two griots trained in the same lineage recite the epic independently, the versions match to a degree that would astonish an outsider. The same verses, in the same order, with the same cadence, ending at the same invocation. The griot has not written the epic down. He has trained his memory so completely that, given the same starting word, he produces the same sequence of subsequent words. A griot is a **deterministic replay system**, and his state is the trained contents of his own mind.

This property — that the same beginning produces the same middle and the same end — is called **determinism**, and in game programming it is worth more than nearly any other virtue. A system is deterministic when `output = f(input, state)` is a pure function: no hidden sources of variation, no random calls to the system clock, no unpredictable thread scheduling, no floating-point behaviour that differs between two machines. Feed in the same state and the same input, get the same next state, every single time, on every single machine. If you have this property, an enormous number of good things become possible at almost no cost. If you do not have it, you will spend years fighting bugs you cannot reproduce, you will never build a replay system, you will never have a serious multiplayer game, and your tests will be flaky forever.

The first gift of determinism is **replay**. Because the game's behaviour is a function only of its state and its input, you can save a game session as nothing more than the starting state plus the sequence of inputs the player provided. To replay the session, you load the starting state and feed the inputs back into the update function, one per tick. The game will unfold again, identically — the same enemies will die at the same moments, the same coins will be collected in the same order, the same final score will appear. You do not need to record the screen; you do not need to record the positions of anything; you only need the inputs. A sixty-minute play session can be captured in a few kilobytes. The replay can be shared with friends, studied for improvement, used as a ghost racer, or turned into a training video. An *Oware* match is recorded this way even today: a sequence of move numbers, sometimes written in the margin of a notebook, sometimes stored as a string of digits. From that sequence, any player who knows the rules can reconstruct the entire game, seed by seed, capture by capture, up to the final position. The replay *is* the game.

Let us build the smallest possible replay system.

```javascript
let recording = true;
const inputs = [];    // we will record one entry per tick

function collectInput(tick) {
    const snapshot = {
        left:  keys.has('ArrowLeft'),
        right: keys.has('ArrowRight'),
        jump:  keys.has(' '),
    };
    if (recording) inputs.push({ tick, ...snapshot });
    return snapshot;
}

function replay(startState) {
    let state = structuredClone(startState);
    for (let tick = 0; tick < inputs.length; tick++) {
        state = update(state, inputs[tick], STEP);
        render(state, 0);
    }
}

// During play:
//   state = update(state, collectInput(tick), STEP);
// Then at the end, call replay(startState) and watch the session unfold again.
```

The whole replay system is a dozen lines. What makes it work is not the code — the code is trivial — but the discipline that `update` is deterministic. If `update` secretly consults `Math.random()` or `Date.now()` or reads a variable that some other subsystem might have changed, the replay will diverge from the original within a few ticks, and by the end of a sixty-second session it will be in a completely different world. Preserving determinism is therefore an act of *engineering discipline*: every source of randomness must be seeded from a known value stored in the state; every call to the clock must be replaced by the simulation's own tick count; every floating-point calculation must be deterministic across the machines you care about. This is demanding, but the reward is worth it.

The second gift of determinism is **reproducible testing**. A bug that appears only once in ten thousand plays is nearly impossible to diagnose in a non-deterministic system, because every attempt to reproduce it produces a slightly different world. In a deterministic system, you record the inputs that led to the bug, replay them, and the bug appears every single time. You can then walk backwards through the replay, one tick at a time, until you find the exact tick on which the error first appears. A bug that took weeks to find in a sloppy codebase can be found in an hour in a deterministic one. Many professional studios now record every playtest session automatically, and when a tester reports a bug, the engineers replay the exact session on their own machines and see the exact same failure. This is the testing discipline of the twenty-first century, and it is built on nothing more than the property `same input + same state = same output`.

The third, and in many ways most important, gift of determinism is **lockstep multiplayer**. In a lockstep game, each player runs the full simulation on their own device. The players do not exchange game states across the network — states are too large and too slow to transmit at sixty hertz. Instead, the players exchange only their *inputs*. Each tick, each player sends their own input and receives the inputs of the others, and then every player's simulation advances using the same full set of inputs. Because the simulation is deterministic, every player's game ends up in exactly the same state at the end of the tick, without any synchronisation beyond the inputs themselves. This is how real-time strategy games with thousands of units — *Age of Empires*, *StarCraft*, *Warcraft III* — managed to run over slow modems in the 1990s. The full state of a thousand-unit battlefield is enormous; the inputs are tiny. Lockstep is the only way to make such games possible, and lockstep is impossible without determinism. A multiplayer *Oware* game written with strict determinism would synchronise perfectly between a player in Kampala and a player in Dakar using only a handful of bytes per move.

The fourth gift is the **Tool-Assisted Speedrun**, or TAS, the art of completing a game in the absolute minimum possible time by exploiting determinism to play with inhuman precision. A TAS artist records their inputs frame by frame, rewinds when a choice turns out to be suboptimal, tries a different input, and gradually constructs a sequence of inputs that, when replayed from the game's starting state, completes the game faster than any human reflex could manage. The *Super Mario Bros.* speedrun record, held by a TAS, is under five minutes, and the entire run exists only as a list of controller button presses — because the game is deterministic, the list reproduces the entire playthrough perfectly, on any copy of the cartridge, forever. This is a practice that treats a game as a mathematical object to be optimised, and it is only possible because the game is, at its core, a pure function.

I want you to see, dear reader, how many different good things rest on this single, quiet property. Replay, testing, multiplayer, speedrunning, debugging, save-games that can be trusted, ghost racers, training AIs by running millions of games in parallel — all of them depend on `same input + same state = same output`. This is not a trick. It is the discipline of treating your game as a mathematical function rather than as a heap of side effects. The griot reciting *Sundiata*, the Oware match reconstructed from a list of moves, the Pac-Man ghost whose path can be predicted exactly from the tile the player is standing on — all of them are telling you the same thing. Determinism is the soul of every system that wishes to be *remembered* rather than merely *lived*.

We have now assembled, in these first six letters, the whole skeleton of a game. We have a loop (Letter 1), an honest clock (Letter 2), a fixed simulation tick (Letter 3), a state (Letter 4), a finite-state machine for the things inside the state (Letter 5), and a deterministic update function that makes all of it repeatable (Letter 6). What we do not yet have is any notion of *where things are*, beyond an `x` and a `y` scattered inside a state record. We have no vectors, no transforms, no rotations, no collisions, no sense of space. This is the subject of the next part of the treatise, which begins with a letter on the mathematics Euler himself refined — the algebra of directed arrows in the plane, known to every working game programmer as **the vector**. We shall meet it next.

---

## Part II: The Geometry of Play

### Letter 7: On Vectors and the Three Numbers of Motion

Dear Reader, in the last part we gave our world a heartbeat. Now we must teach it where things are. The question "where" seems, at first, to want a single answer: a name, a point, a dot on a map. But the moment anything in your world *moves*, "where" becomes insufficient. You need also "which way" and "how fast". You need, in short, an object that carries both a length and a direction at the same time. This object is the **vector**, and it is the fundamental piece of furniture of every game ever built. A position is a vector. A velocity is a vector. A force is a vector. The difference between two positions is a vector. Learn vectors properly in this letter and three quarters of the mathematics of games will already be behind you.

A vector in two dimensions is nothing more than a pair of numbers, `(x, y)`, which you should picture not as a point on a page but as an **arrow** drawn from the origin to that point. The arrow has a tail and a head. It has a **direction** — where the head points — and a **magnitude** — the length of the arrow. A vector `(3, 4)` is an arrow three steps east and four steps north; its magnitude, by the Pythagorean theorem, is `√(3² + 4²) = 5`. This is all a vector is. But from this modest definition grows the entire geometry of motion. The trader who walks from Onitsha market toward Aba does not memorise every footstep of the journey; she carries in her mind a single vector — "south-east, roughly one hundred and twenty kilometres" — and that vector, composed of a direction and a distance, is a complete description of her route regardless of the twists of the road. When she arrives at Aba and turns toward the leather stalls, she adds a second vector to the first. The sum of vectors is the sum of journeys.

Every moving object in a game is governed by three vectors that form a kind of holy trinity: **position**, **velocity**, and **acceleration**. Position is *where the thing is*. Velocity is *how fast the position is changing, and in what direction*. Acceleration is *how fast the velocity is changing, and in what direction*. These are not three unrelated quantities. They are a chain: acceleration is added to velocity every frame, and velocity is added to position every frame. If you understand this chain, you understand why a jumping character rises then falls, why a thrown spear curves, why a car drifts into a turn. Gravity is an acceleration vector pointing down. Wind is an acceleration vector pointing sideways. The player's thumb on the joystick is an acceleration vector in whatever direction she pushes. Every force in your world is an acceleration applied to a velocity which modifies a position. It is one of the most beautiful and economical ideas in all of physics that three numbers, layered one atop the other, suffice to describe the motion of anything.

Let us build a `Vec2` structure in JavaScript that knows how to add itself to another, subtract, scale by a number, and report its length. Every game you will ever write will have something like this hiding inside it.

```javascript
class Vec2 {
    constructor(x = 0, y = 0) { this.x = x; this.y = y; }

    add(v)   { return new Vec2(this.x + v.x, this.y + v.y); }
    sub(v)   { return new Vec2(this.x - v.x, this.y - v.y); }
    scale(s) { return new Vec2(this.x * s,   this.y * s);   }

    length() { return Math.sqrt(this.x * this.x + this.y * this.y); }

    // Return the same direction but with length 1
    normalize() {
        const L = this.length();
        return L === 0 ? new Vec2(0, 0) : new Vec2(this.x / L, this.y / L);
    }
}

// The trinity in action
let position     = new Vec2(100, 100);
let velocity     = new Vec2(0, 0);
const gravity    = new Vec2(0, 500); // 500 pixels per second², downward

function update(dt) {
    velocity = velocity.add(gravity.scale(dt));   // v += a · dt
    position = position.add(velocity.scale(dt));  // p += v · dt
}
```

Notice the two operations in `update`. Acceleration, multiplied by the tiny time step `dt`, is added to velocity. Velocity, multiplied by `dt`, is added to position. That is the whole of Newtonian motion, compressed into two lines. Every frame, gravity nudges the velocity a little more downward; every frame, the (now slightly faster) velocity nudges the position a little further down the screen. Run the loop, and you will see a character fall with the exact weight of a body on earth — or on the moon, if you dial gravity down, or underwater, if you add a drag term. The same two lines describe a raindrop, a cannonball, a leaping antelope, and a *fufu* pestle on its downward stroke. The universality is not a coincidence. The universe runs these two lines for every particle in it, and the reason our games feel like physics is that physics *is* these two lines.

Vector subtraction has a beautiful reading that beginners often miss. When you write `target.sub(player)`, you are not computing some abstract difference. You are computing **the vector from the player to the target** — the arrow whose tail is at the player and whose head is at the target. Reading subtraction as "from-to" is one of those small cognitive shifts that, once made, permanently clarifies game code. How does an enemy walk toward the player? Take `player.pos.sub(enemy.pos)`; that gives the vector *from enemy to player*. Normalise it — that is, divide by its length — to get a direction vector of length 1, which we call a **unit vector**. Multiply by the enemy's speed, and you have a velocity that points exactly at the player, no matter where he runs. Three lines of vector code turn a lifeless sprite into a pursuer. Normalisation is the humble but essential operation that separates "which way" from "how far", and in games we almost always want to handle those two quantities separately.

```javascript
// Enemy chases player at a steady speed
const toPlayer = player.pos.sub(enemy.pos);   // the "from-to" arrow
const direction = toPlayer.normalize();       // length 1, same heading
enemy.vel = direction.scale(enemy.speed);     // constant speed in that direction
```

There is an old Yoruba praise-song pattern that the *oríkì* chanter follows without ever naming it as mathematics: "from the ancestors, through the elders, to the child." It is a chain of arrows, each beginning where the previous ended, and the entire lineage is the sum of these arrows — a single vector from the beginning of the line to the child who stands before the chanter. The chanter does not recite every birth and death between; she recites the vector sum. In the same way, when your game character walks a winding path across a tilemap, you may at any moment ask for the single vector from her starting point to her current position, and that vector is the sum of every step she has taken. Vectors compose. Journeys compose. Histories compose. The arithmetic of arrows is the arithmetic of lives.

Having learned to carry direction and magnitude together in a single object, we must next learn to *compare* two such objects. Given two arrows, how much do they point the same way? This innocent question has an exact answer, and that answer is the subject of the next letter.

### Letter 8: On the Dot Product and the Question of Alignment

My dear reader, suppose you are building a guard in a stealth game. The guard has a facing — a direction in which he is looking — and a cone of vision perhaps sixty degrees wide. The player is skulking somewhere in the level. The question the guard must ask, sixty times a second, is simple in English and merciless in its geometric demands: *is the player within my cone of vision?* To answer it, you need a single number that tells you how closely two vectors are aligned. That number is the **dot product**, and once you understand it you will find yourself reaching for it in almost every AI routine you write.

The dot product of two vectors `a` and `b` is defined algebraically as `a.x * b.x + a.y * b.y`. A single multiplication, a single addition, two numbers in and one number out. It looks almost suspiciously simple. But there is a second, geometric definition that is hiding inside the first: `a · b = |a| × |b| × cos(θ)`, where `|a|` and `|b|` are the magnitudes of the two vectors and `θ` is the angle between them. The two definitions are mathematically identical — a fact which, when proved, has the flavour of a small miracle, and which was known in essence to the geometers of Alexandria long before anyone had a name for it. The algebraic form is what the computer evaluates. The geometric form is what the programmer *reads*. When you use the dot product in code, you are invoking both at once: the machine computes two multiplies and an add, and your mind interprets the result as a cosine.

The cosine has a specific and precious shape that makes the dot product valuable. When two unit vectors (vectors of length 1) point in exactly the same direction, the angle between them is zero, `cos(0) = 1`, and their dot product is `1`. When they are perpendicular, the angle is ninety degrees, `cos(90°) = 0`, and their dot product is `0`. When they point in exactly opposite directions, the angle is one hundred and eighty degrees, `cos(180°) = -1`, and the dot product is `-1`. The dot product of two unit vectors, in other words, is a single number between -1 and 1 that tells you *how aligned they are*. Positive means "roughly the same way." Zero means "at right angles." Negative means "roughly opposed." The guard's cone of vision, the enemy's ability to see the player, the player's lateral velocity relative to a wall, the light falling on a surface in a shader — all of these are computed with this one humble operation.

```javascript
function dot(a, b) {
    return a.x * b.x + a.y * b.y;
}

// Can the guard see the player?
// facing: unit vector the guard is looking along
// coneCos: cosine of half the cone angle, precomputed once
function guardSees(guard, player, facing, coneCos, maxRange) {
    const toPlayer = player.pos.sub(guard.pos);
    const distance = toPlayer.length();
    if (distance > maxRange) return false;        // too far to see
    const direction = toPlayer.normalize();        // from-to, length 1
    return dot(facing, direction) >= coneCos;      // inside the cone?
}
```

Study this function, because it contains a pattern you will use hundreds of times. We first compute the "from-to" vector from guard to player. We check the distance with its length, to rule out anyone too far away. We then normalise the vector to get pure direction, and we dot it with the guard's facing. The result is `cos(θ)`, where `θ` is the angle between *where the guard is looking* and *where the player is*. If that cosine is larger than the cosine of the cone's half-angle, the player is inside the cone. Note the clever inversion: a smaller angle gives a larger cosine, so the comparison goes the way that at first seems backward. Compute `coneCos = Math.cos(Math.PI / 6)` once, at the start of the level, for a sixty-degree cone. You will never need to call `acos` in the hot loop. The whole visibility check is six multiplies, a few additions, and a comparison. Sixty times a second, for every guard in the level, with room to spare.

Now let us search for the isomorphism in the physical world, because the dot product is too beautiful to be left as pure arithmetic. Consider the Yoruba *praise-singer* approaching an *oba* in court. She does not merely walk in; she bows. The depth of her bow encodes the alignment of her respect with the axis of the chief's authority. A shallow bow — a small angle — projects most of her stature onto that axis, and the projection is large; the chief reads it as full acknowledgement. A refusal to bow at all would leave her body perpendicular to the axis of deference, and the projection would be zero: a neutrality that is itself a kind of defiance. The dot product is the mathematician's formalisation of this ancient ceremony. It asks, "how much of *this* lies along *that*?" and answers with a single signed number.

There is an even more homely example on the threshing floor. When the farmer in an Ethiopian highland village winnows *teff* after harvest, she tosses the grain upward into the wind. The chaff, being light, is carried sideways by the wind; the heavier grain falls nearly straight down. Whether any particular husk flies or falls depends on the angle between the wind's direction and the grain's natural falling direction — and what the wind can do to the husk is, in its essence, the dot product of the wind vector with the husk's surface normal. When the wind and the surface are aligned, the force is maximum; when they are perpendicular, the force is zero. The winnower does not compute this. Her hands know it. A thousand generations of hands have taught her hands. We are simply writing the equation her hands already solved.

And there is the muezzin at dawn, turning his body toward the *Qibla* — the direction of the Kaaba in Mecca. He is performing, in geometric terms, a manual maximisation of the dot product between his forward-facing vector and the great circle arrow pointing from his prayer mat to the sacred stone. His body is a unit vector. The *Qibla* is another. When the two are perfectly aligned, the dot product is one, and the prayer is correctly oriented. Five times a day, across a billion bodies and twenty time zones, the same geometric computation is performed — not with code, but with the same structural arithmetic that our guard uses to see our player. The isomorphism runs in both directions: the guard learns from the muezzin, and the muezzin is vindicated by the guard. The geometry is the same geometry.

With vectors to carry motion and the dot product to compare directions, we are ready for the question every player feels most viscerally: when do two things *touch*?

### Letter 9: On Collision and the Boundaries of Things

Dear reader, of all the moments in a game, none is felt so sharply by the player as the moment of contact. The sword meets the shield. The wheel meets the kerb. The foot meets the ground after a jump. The projectile meets the skull. The whole emotional logic of play is built on these instants of collision, and the whole technical challenge of making them feel right begins with a simpler, colder question: *at what precise frame did the two things begin to overlap?* This is the subject of **collision detection**, and it is one of those areas where a few well-chosen mathematical shapes do nearly all the work.

The simplest possible collision test is **circle versus circle**. Two circles overlap if and only if the distance between their centres is less than the sum of their radii. That is the entire test. No matter how they are oriented, no matter how they are moving, the question of whether they touch is answered by a single comparison. Even better, we can skip the square root in the distance calculation and compare squared distances to the squared sum of radii, which is faster and loses no information. A circle is a merciful shape for a game programmer, because its symmetry means rotation does not change it. A tyre rolling, a coin spinning, a head of a masquerade turning — all of them, for collision purposes, are just circles.

```javascript
function circlesOverlap(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const distanceSq = dx * dx + dy * dy;
    const rSum = a.r + b.r;
    return distanceSq < rSum * rSum;   // no Math.sqrt needed
}
```

The next shape in our toolkit is the **axis-aligned bounding box**, or **AABB** — a rectangle whose sides are parallel to the x and y axes. AABBs cannot rotate; that is their whole virtue. Two AABBs overlap if and only if they overlap on the x axis *and* on the y axis. Two one-dimensional overlap tests combined with an `&&` give you a two-dimensional collision test. This is extraordinarily cheap, which is why AABBs are the workhorse of platformers and top-down games. The player character, the enemies, the walls, the pickups — all are AABBs first, and only occasionally are upgraded to something more complex.

```javascript
function aabbsOverlap(a, b) {
    return a.x < b.x + b.w &&
           a.x + a.w > b.x &&
           a.y < b.y + b.h &&
           a.y + a.h > b.y;
}
```

For shapes that are neither circles nor axis-aligned rectangles — a rotated crate, a hexagonal shield, a star-shaped power-up — we need a more general theorem. It is called the **Separating Axis Theorem**, usually abbreviated **SAT**, and it says this: two convex shapes do *not* overlap if and only if there exists some line onto which their projections do not overlap. To check if two convex polygons collide, you try a small number of candidate axes — the normals of their edges — project both shapes onto each axis, and see if any axis separates them. If you find even one axis on which the shadows do not overlap, the shapes do not touch. If every axis you try has overlapping shadows, the shapes must be colliding. SAT is beautiful and efficient, but its full implementation will wait; for now, remember that circles and AABBs will carry you through ninety percent of your games, and SAT stands in reserve for the rest.

Detecting a collision is only half the work. The other half is the **response**: what do the objects do once they are found to be touching? A ball bouncing off a wall must reverse its velocity along the wall's normal. A player pressed against a wall must be pushed back out of the wall so that she stops exactly against it rather than sinking into it. This pushing-out is called **resolution**, and there is a subtle and cruel bug that catches almost every beginner the first time: if you resolve the x axis and the y axis simultaneously, a character running along a floor will sometimes "catch" on the vertical seams between tiles and lurch to a halt. The cure is to resolve one axis at a time — update x, check and resolve x collisions, then update y, check and resolve y collisions. Splitting the motion into its two components prevents the character from ever slipping into a corner she cannot climb out of. This is the kind of folk knowledge that is passed from game programmer to game programmer around fires and in chatrooms, and I pass it to you now so that you will not lose a weekend to it as I once did.

The isomorphism of collision lives everywhere in African making. Think of the *kola nut* falling into the divination bowl of the *babalawo*. The nut descends through the air along a trajectory; the rim of the bowl rises to meet it; at one precise instant, the edge of the nut touches the edge of the bowl, and a new event begins — the bowl decelerates the nut, reflects some of its momentum, directs it toward the centre. The diviner reads the pattern of how the nuts land, but beneath the reading is a collision event whose timing is exquisitely definite. Or think of the Aba leatherworker's punch and die: a shaped steel punch descends onto a sheet of leather stretched over a matched steel die, and at the instant of contact — the frame of collision, as a game programmer would say — the leather is cut to an identical shape, each and every time. The whole craft depends on the collision being detected, resolved, and its consequences applied, in exactly the way our code must do sixty times a second for each of the dozen moving things in our little world.

With objects that can move and collide, we are nearly ready to build a living scene. But our scene so far lives in a single flat coordinate system, and a real game is a hierarchy of spaces within spaces. To organise them, we need a piece of mathematical machinery that is simpler than it sounds and more powerful than any other in graphics: the transform.

### Letter 10: On Transforms and the Matrix of Worlds

Dear reader, consider the masquerade of the *Egungun* festival among the Yoruba. The dancer is at the centre of a circle of drummers. The masquerade's body is upright. His arm is raised. His hand holds a whisk. The whisk has a tip that flicks through the air in great arcs as he dances. Now: where, at this very instant, is the tip of the whisk? The honest answer is that there is no way to point to its location in the village square directly. The tip is *in the hand*. The hand is *in the arm*. The arm is *in the body*. The body is *in the village square*. To know where the whisk tip is, you must follow a chain of local coordinate systems, each nested inside the next, each contributing a small rotation or translation to the final answer. This nesting is the meaning of the word **transform**, and the mathematical object that represents one is a **matrix**.

A **transform** is a function that takes a point in one coordinate system and returns its position in another. In two dimensions, the three transforms you will use constantly are **translation** (moving a point by a fixed offset), **rotation** (spinning a point around the origin by a fixed angle), and **scale** (multiplying a point's coordinates by a fixed factor to make it bigger or smaller). Each of these can be represented by a small matrix of numbers, and the transformation of a point becomes a matrix-vector multiplication. This is where students often flinch, because matrices carry an aura of intimidation, but the truth is that the 2D transforms you need fit in a three-by-three grid of numbers and can be applied to any point with six multiplications and four additions. Matrices in games are not abstract algebra; they are compact instruction cards that say "to go from this space to that space, do this to every point."

The magic of matrices is **composition**. If you have a matrix `A` that says "rotate by thirty degrees" and a matrix `B` that says "translate by (100, 50)", then the product `C = B × A` is a single matrix that says "first rotate by thirty degrees, then translate by (100, 50)". You do not need to apply `A` to every point and then apply `B` to every result; you can precompute `C` once and apply it. This is why the graphics pipeline of every 3D game — and most 2D games — speaks fluent matrix: a hundred thousand vertices of a mesh can all be transformed by the same single matrix in a tight loop, without the game ever needing to think separately about translation, rotation, and scale. The three operations have been baked into one object.

```javascript
// A 2D affine transform, expressed as a 3×3 matrix in row-major form:
//
//   | a  c  tx |
//   | b  d  ty |
//   | 0  0   1 |
//
// Applied to a point (x, y), it gives (a*x + c*y + tx, b*x + d*y + ty).

function translate(tx, ty) {
    return { a: 1, b: 0, c: 0, d: 1, tx, ty };
}

function rotate(rad) {
    const c = Math.cos(rad), s = Math.sin(rad);
    return { a: c, b: s, c: -s, d: c, tx: 0, ty: 0 };
}

function scale(sx, sy) {
    return { a: sx, b: 0, c: 0, d: sy, tx: 0, ty: 0 };
}

function apply(m, p) {
    return {
        x: m.a * p.x + m.c * p.y + m.tx,
        y: m.b * p.x + m.d * p.y + m.ty,
    };
}
```

In practice, you will rarely hand-roll these matrices in a 2D game, because the browser's canvas API already exposes them as a small, well-mannered vocabulary. `ctx.translate(x, y)` pushes a translation onto the current transform. `ctx.rotate(angle)` pushes a rotation. `ctx.scale(sx, sy)` pushes a scale. `ctx.save()` and `ctx.restore()` let you enter and exit nested coordinate systems without worrying about undoing what you did. This is exactly the machinery you need to draw the *Egungun* and his whisk without ever computing the tip's world position yourself.

```javascript
function drawMasquerade(ctx, body) {
    ctx.save();
    ctx.translate(body.x, body.y);          // enter the body's space
    ctx.rotate(body.angle);

    ctx.save();
    ctx.translate(0, -40);                   // enter the arm's space
    ctx.rotate(body.armAngle);
    drawArm(ctx);

    ctx.save();
    ctx.translate(30, 0);                    // enter the whisk's space
    ctx.rotate(body.whiskAngle);
    drawWhisk(ctx);
    ctx.restore();                           // leave whisk

    ctx.restore();                           // leave arm
    ctx.restore();                           // leave body
}
```

Read this function and notice how each `save`/`restore` pair is a small village within a larger one. The body lives in the village square. The arm lives on the body. The whisk lives on the arm. At no point do we ever ask "where in the world is the tip of the whisk?" — we let the chain of transforms answer that question for us. This is called a **scene graph**, and it is the same idea that underlies every animation system, every ragdoll physics engine, every rigged 3D character, and every industrial robot arm. Without transforms, every animated thing would have to compute its world position by hand, and we would go mad inside an afternoon.

The African isomorphism of the scene graph is the **compound** — the walled yard of a traditional Yoruba or Igbo household. The compound contains several houses. Each house contains several rooms. Each room contains the bodies of its occupants. Each body holds, in its hands, the utensils of its work. Where is the spoon that was set down on the mat after the evening meal? It is on the mat; the mat is on the floor of the room; the room is in the house; the house is in the compound; the compound is in the village; the village is in the land. Five nested coordinate systems. To find the spoon, you follow the chain. When a child is sent to fetch it, she does not compute GPS coordinates; she walks the tree — compound to house to room — until the final local space contains the object. This is exactly what our code does. The graphics pipeline is the old architecture of the compound, written in mathematics.

With transforms in hand, we can draw hierarchies of objects at any position, at any rotation, at any scale, without confusing ourselves. And we are ready, now, to address the single biggest transform of all: the one that represents the camera, the moving eye of the player upon the world.

### Letter 11: On the Camera and the Moving Eye

Dear reader, until this point in our treatise, the world of the game has been the size of the screen. The ball bounced within the four walls of the canvas; the masquerade danced in whatever corner we placed him; there was no notion that the world might be larger than what the player could see at any one moment. In a real game this is almost never the case. The world of *Super Mario* is wider than the screen by many screens. The world of an open-world adventure is a continent. The world of a dungeon crawler is a labyrinth. The piece of machinery that lets us look at different parts of a world bigger than the screen is the **camera**, and it is, at bottom, nothing more than one more transform — but one with such an exalted role that it deserves a letter of its own.

The camera is a transform that converts **world coordinates** (where things are in the game's universe) into **screen coordinates** (where they are drawn on the player's display). If the camera's position in the world is `(camX, camY)` and the screen is `W` pixels wide and `H` pixels tall, then a thing at world position `(wx, wy)` is drawn at screen position `(wx - camX + W/2, wy - camY + H/2)`. That is the whole of the camera math: subtract the camera's world position, then add the centre of the screen. This simple shift transforms an infinite world into a finite view. Everything you know about scrolling games — side-scrollers, top-down shooters, isometric strategy — is built on this single subtraction.

```javascript
const camera = { x: 0, y: 0 };
const screen = { w: canvas.width, h: canvas.height };

function worldToScreen(wx, wy) {
    return {
        x: wx - camera.x + screen.w / 2,
        y: wy - camera.y + screen.h / 2,
    };
}

function drawEntity(ctx, e) {
    const s = worldToScreen(e.x, e.y);
    ctx.drawImage(e.sprite, s.x - e.sprite.width / 2, s.y - e.sprite.height / 2);
}
```

A still camera is seldom what we want. The player moves, and the camera must move with her, or she will walk off the edge of the screen. But a camera that slavishly snaps to the player's position produces a jittery, nauseating view that makes the player feel like she is strapped to the character's skull. What we want instead is a camera that **leads** slightly, that **follows** with a gentle lag, that feels like the gaze of a thoughtful cinematographer walking behind the action. The mathematical tool for this is **linear interpolation**, universally called **lerp**: a formula that moves one value a fraction of the way toward another. `lerp(a, b, t) = a + (b - a) * t`. When `t` is `0.1`, the camera moves ten percent of the way from its current position toward the player each frame. The result is a smooth, trailing follow that feels like watching, not riding.

```javascript
function lerp(a, b, t) { return a + (b - a) * t; }

function updateCamera(player, dt) {
    // Follow the player with a gentle lag
    camera.x = lerp(camera.x, player.x, 5 * dt);
    camera.y = lerp(camera.y, player.y, 5 * dt);

    // Clamp the camera so it never sees outside the level
    const halfW = screen.w / 2, halfH = screen.h / 2;
    if (camera.x < halfW)           camera.x = halfW;
    if (camera.y < halfH)           camera.y = halfH;
    if (camera.x > level.w - halfW) camera.x = level.w - halfW;
    if (camera.y > level.h - halfH) camera.y = level.h - halfH;
}
```

The clamping in the second half of that function is as important as the following in the first. Without clamping, the camera will drift past the edge of the level and the player will see a great black void beyond the world. With clamping, the camera snugs up against the walls of the level and stops there — the player walks across the screen instead of the camera scrolling past her, and she never sees the abyss. This is the kind of detail that separates a game that feels finished from a game that feels like a prototype, and it costs four `if` statements.

There is one more camera trick that every action game must know: **shake**. At the moment of impact — when a shell lands, when a giant stomps, when the player's character is struck by a hammer — you add a small random offset to the camera's rendered position for a few frames, and the whole screen jitters. The offset does not change the game state; it is applied only at draw time. A shake of three or four pixels for a quarter of a second is enough to make the hit feel weighty. Too much shake and the player cannot see what is happening; too little and the blow feels feeble. The dosage is an art, and you will learn it by playing your own game many times.

```javascript
let shakeIntensity = 0;

function triggerShake(amount) { shakeIntensity = amount; }

function shakeOffset() {
    if (shakeIntensity <= 0) return { x: 0, y: 0 };
    const x = (Math.random() - 0.5) * 2 * shakeIntensity;
    const y = (Math.random() - 0.5) * 2 * shakeIntensity;
    shakeIntensity *= 0.9;   // decay by ten percent per frame
    return { x, y };
}
```

The African isomorphism of the camera is the *Egungun* audience itself. When the masquerade dances through the village, the children and elders do not stay rooted in one spot; they move along with him, flowing around his performance like water around a stone. The masquerade is the player. The audience is the camera. Each onlooker's eye stays fixed on the dancer, turning and translating as the dancer moves, with a small courteous lag — never crowding him, never lagging so far behind as to lose sight. The *griot* performing an epic does the same with his gaze: he settles on one listener, holds the moment, then drifts to another as the story turns, his eye a slow camera lerping across the crowd. In both cases the principle is identical to the one in our code: a focus vector smoothly follows a moving target, bounded by the walls of whatever space contains it.

With a camera to carry the player's eye across a world, we need next a way to describe worlds large enough to need carrying. And for this we turn to the oldest mathematical object in African textiles: the grid.

### Letter 12: On Tilemaps and the Loom of Levels

Dear reader, look closely at a length of *Kente* cloth hanging in a weaver's workshop in Bonwire, the Ashanti village where the royal weave is made. You will see, if you press your eye close to the cloth, that the rich and intricate pattern is not continuous at all. It is a grid. Each tiny square of the weave is either a warp thread shown or a weft thread shown, and that single binary decision, repeated across thousands of cells, is the whole of the design. The weaver does not paint Kente; she quantises it. She reduces the infinite spectrum of possible patterns to a grid of choices, and from that grid emerges a work so rich that no king refuses it. This reduction of a continuous world to a grid of discrete choices is exactly the strategy that games have used for level design since the 1980s, and it is called the **tilemap**.

A **tilemap** is a two-dimensional array of integers. Each integer is an index into a **tileset** — a single image containing many small square tiles side by side. To render a level, the game walks the array and, for each cell, draws the tile whose index is stored there at the cell's position on the screen. That is the entire mechanism. A level that is one hundred cells wide and one hundred cells tall is ten thousand bytes of data — roughly the size of a short text file — but when drawn, it becomes a rich landscape of grass, stone, water, trees, bridges, and walls. The economy of this representation is staggering. An entire world fits in less memory than a single photograph, and it loads in milliseconds.

Why does the tilemap work so well? Because nearly every game world has enormous **repetition**. A field of grass is the same tile of grass, drawn a thousand times. A stone wall is the same wall tile, drawn along a line. A river is a handful of water tiles arranged in a sinuous band. By noticing the repetition and storing only the index of which tile to draw, we compress the world by a factor of a hundred or more. It is the same trick the Kente weaver uses: a few basic thread patterns, called *adwini*, are combined in thousands of ways across the grid, and the whole cloth is described by listing which *adwini* goes in which cell. She does not need to invent each square from scratch, and neither does our game.

```javascript
// A tiny 10×6 level. Each number indexes into the tileset.
const TILE_SIZE = 32;
const level = [
    [1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,2,2,0,0,3,0,0,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,2,2,0,0,1],
    [1,1,1,1,1,1,1,1,1,1],
];

// A tileset image laid out as a strip: [grass, wall, water, tree, ...]
function drawTilemap(ctx, tileset) {
    for (let y = 0; y < level.length; y++) {
        for (let x = 0; x < level[y].length; x++) {
            const tileIndex = level[y][x];
            ctx.drawImage(
                tileset,
                tileIndex * TILE_SIZE, 0,    // source x, y in the tileset
                TILE_SIZE, TILE_SIZE,         // source width, height
                x * TILE_SIZE, y * TILE_SIZE, // destination on canvas
                TILE_SIZE, TILE_SIZE
            );
        }
    }
}
```

The loop is as plain as any loop in this treatise, and yet you should pause over it, because you are watching the birth of worlds. Two nested `for` loops, an array lookup, and a single `drawImage` call. That is a level renderer. Add collision by marking certain tile indices as solid and checking them when the player tries to move; add layers by stacking multiple tilemaps on top of each other (a ground layer, a decoration layer, a foreground layer for things the player walks behind); add animation by swapping tiles on a timer to make water shimmer or torches flicker; and you have, in a few dozen lines, the engine of a thousand classic games.

The industry-standard tool for editing tilemaps is a free program called **Tiled**, which lets you paint a level like a watercolour — clicking tiles from a palette and dropping them into cells — and then export the result as a JSON file your game can load. A level designer, who need not be a programmer at all, can lay out a whole world in an afternoon. This separation of content from code is itself a profound idea: it lets you hire or collaborate with people whose talent is spatial imagination rather than syntax, and it lets you iterate on gameplay feel without rebuilding your program. A musician and a programmer and a visual artist can together build a game in which none of them ever touches the other's craft. Tiled is the loom; the level is the cloth.

Another West African textile tradition sharpens the isomorphism. Yoruba *adire* is a resist-dyed cloth: the cloth is first painted, tied, or stitched with a pattern that will block the indigo dye; it is then dipped, and where the resist held, the cloth remains pale, and where it did not, the cloth turns deep blue. The pattern is planned on a grid — a literal grid drawn in starch or stitched with raffia — and the dyeing transforms the grid of binary decisions into a field of rich blue imagery. The *adire* artist is doing exactly what the tilemap renderer does: she stores a level as a grid of small decisions, and a single uniform process (the dye, or `drawImage`) expands each decision into its full visual consequence. The Kente loom, the adire cloth, and the tilemap are three expressions of the same mathematical insight, separated by centuries and substrates.

With tilemaps, our worlds can be large. With large worlds come creatures that must move intelligently through them. An enemy on the far side of a wall must know how to get around the wall to reach the player. This is the problem of pathfinding, and it is the subject that closes this second part.

### Letter 13: On Pathfinding and the Streets of Lagos

Dear reader, imagine an *okada* driver in Lagos at five in the afternoon on a Friday. He is at Yaba, his passenger wants to go to Surulere, and between the two lies a geography of one-way streets, potholes, market stalls spilling into the road, traffic lights that have been dead since the last power cut, and a great moving clot of traffic that thickens and thins in unpredictable patterns. The driver does not possess a map with straight-line distances only; he possesses a *weighted graph* of the city, where each edge carries a cost that includes not only its physical length but also, crucially, the current congestion. His route is not the shortest in kilometres. It is the cheapest in a blended currency of distance, time, fuel, and risk. Without ever having heard of computer science, the *okada* driver solves, a hundred times an hour, the same problem that every game enemy must solve to find its way to the player: **shortest path through a weighted graph**. And the algorithm we will teach him, had he wished to name it, is called **A-star**, written `A*`.

The problem begins in a place you will recognise. Euler, in 1735, walked through the city of Königsberg, where seven bridges connected two islands and two riverbanks across the river Pregel. The townspeople wondered whether one could take a Sunday stroll that crossed each bridge exactly once. Euler proved it was impossible, and in doing so he invented a new branch of mathematics: **graph theory**. He taught us to throw away the map and keep only the *connections* — a set of vertices (places) and edges (paths between them), each edge perhaps weighted with a cost. Every game world, once you squint at it, is a graph. A tilemap is a graph whose vertices are the passable tiles and whose edges connect each passable tile to its neighbours. A road network is a graph. A dungeon is a graph. Even a 3D mesh of walkable ground, once it has been cut into a navigation grid, is a graph. And the question "how do I get from here to there?" is the question of shortest path on a graph.

**Dijkstra's algorithm**, devised by the Dutch computer scientist Edsger Dijkstra in 1956, solves the shortest-path problem in any weighted graph without negative edges. It works outward from the starting vertex like a flood — visiting the closest unvisited vertex, updating the cost to each of its neighbours, and repeating until it has reached the goal. It always finds the true shortest path. It is also, on a large map, slow, because it explores in every direction equally, including directions that clearly lead away from the goal. For a game that must compute paths sixty times a second, Dijkstra alone is often too wasteful.

A-star adds a single insight that makes the search focused instead of blind: a **heuristic**, which is an educated guess at the remaining distance from any vertex to the goal. For a grid map, the heuristic is usually the straight-line distance from the vertex to the goal (**Euclidean distance**) or the sum of the horizontal and vertical differences (**Manhattan distance**). At each step, A* explores the vertex whose total cost — actual cost so far plus heuristic estimate to the goal — is smallest. If the heuristic never overestimates the true remaining cost, A* is guaranteed to find the shortest path, and it does so by exploring far fewer vertices than Dijkstra. The straight-line estimate *pulls* the search toward the goal like a magnet, and the search leans into its pull. It is one of the most elegant small ideas in all of computing.

```javascript
// A* on a grid. `start` and `goal` are {x, y}. `isWalkable(x, y)` is provided.
function aStar(start, goal, isWalkable) {
    const key = (p) => p.x + ',' + p.y;
    const h   = (p) => Math.abs(p.x - goal.x) + Math.abs(p.y - goal.y);

    const open = new Map();                     // frontier: key → node
    const closed = new Set();                   // already examined

    const startNode = { ...start, g: 0, f: h(start), parent: null };
    open.set(key(startNode), startNode);

    while (open.size > 0) {
        // Pick the open node with the smallest f = g + h
        let current = null;
        for (const node of open.values()) {
            if (current === null || node.f < current.f) current = node;
        }

        if (current.x === goal.x && current.y === goal.y) {
            // Reconstruct the path by walking parents back to the start
            const path = [];
            for (let n = current; n; n = n.parent) path.push({ x: n.x, y: n.y });
            return path.reverse();
        }

        open.delete(key(current));
        closed.add(key(current));

        const neighbours = [
            { x: current.x + 1, y: current.y     },
            { x: current.x - 1, y: current.y     },
            { x: current.x,     y: current.y + 1 },
            { x: current.x,     y: current.y - 1 },
        ];

        for (const n of neighbours) {
            if (!isWalkable(n.x, n.y)) continue;
            if (closed.has(key(n)))    continue;
            const tentativeG = current.g + 1;
            const existing = open.get(key(n));
            if (!existing || tentativeG < existing.g) {
                open.set(key(n), {
                    x: n.x, y: n.y,
                    g: tentativeG,
                    f: tentativeG + h(n),
                    parent: current,
                });
            }
        }
    }

    return null;   // no path exists
}
```

Read this code slowly. The `open` set holds the frontier of the search — the vertices we know about but have not yet committed to exploring further. The `closed` set holds those we are done with. At each step we pluck from the open set the vertex with the smallest value of `f`, which is the sum of `g` (the true distance from the start, known by accumulation) and `h` (the heuristic estimate to the goal, computed on the fly). If we have reached the goal, we walk the parent pointers backward to reconstruct the path. Otherwise we examine each walkable neighbour and, if we have found a cheaper way to reach it than any we knew before, we update the open set. The whole algorithm is about a hundred lines, and it is enough to let every enemy in your game navigate any dungeon you can draw.

The isomorphism to the *okada* driver is now nearly literal. The driver's `g` is the fuel and time already spent; his `h` is the rough "I know Surulere is that way" instinct; his `f` is the balance of the two that his weather-beaten mind constantly updates as he turns at each junction. He will abandon a shorter-in-distance route if it is too congested, just as A* will abandon a path whose `g` has grown too large. He will follow a detour that, on paper, looks longer if its total predicted cost is smaller, just as A* will prefer a longer path with cheaper edges. The only difference is that the driver's heuristic has been tuned by a decade of traffic, and ours is a single line of code. But the shape of the computation is identical, and this is not a coincidence: A* is, formally, a model of exactly the kind of goal-directed, cost-aware search that human beings perform whenever they navigate a changing environment toward a destination they cannot yet see. Euler started it with his bridges. Dijkstra formalised it. The *okada* driver runs it in his head every afternoon. You will now run it in your game.

We have reached the end of the geometric foundations. We have vectors to move things, the dot product to align them, collision to make them touch, transforms to nest them inside one another, cameras to look at them, tilemaps to arrange their worlds, and pathfinding to give them the beginnings of purposeful motion. What we do not yet have is anything that feels *alive*. A sprite that runs along an A* path toward the player is not an opponent; it is a line on a map. To turn the line into a living thing — to give the sprite a body, a behaviour, a voice, a small soul — we must leave pure geometry behind and enter the realm of entities, systems, and state machines. That is the subject of Part III, where we shall discover that the soul of a sprite is a smaller and stranger thing than you might think, and more beautiful.

---

## Part III: The Soul of the Sprite

### Letter 14: On Entities, Components, and the Age-Grade

Dear Reader, we have spent two parts building the body of the world — the loop that beats, the vectors that measure, the collisions that bite. Now we must address a subtler question. When a game grows beyond a single bouncing ball, when it must hold fifty enemies and a hundred bullets and a dozen pickups and three NPCs and a player, how shall we *arrange* all this data in the memory of the machine? The naive answer, taught in every introductory book on object-oriented programming, is to make each thing a class — `class Enemy`, `class Bullet`, `class Player` — and to give each class its own fields and its own methods. This is how games were built for thirty years. It is not how the best games are built today. The modern answer is stranger, older, and, I shall argue, deeply African.

Consider the village of Umuofia as Chinua Achebe painted it, or any Igbo community as it still organises itself today. Every man in the village belongs to several overlapping groups. He belongs to his *umunna* — his patrilineage. He belongs to his *otu ogbo* — his age-grade, the cohort of men born within the same three or four years, who will pass through life's initiations together. He belongs to his *ndi oru* — his occupational guild, whether he is a smith, a farmer, a trader, or a carver. He may belong to a title society, a masquerade society, a church, a credit club, a wrestling association. None of these memberships is his *identity*; his identity is simply his name, his face, his existence. The memberships are *components* attached to that existence. And when the village must act collectively, it does not act through individuals. It issues a call by group: "*Let all the men of the Odimegwu age-grade, aged thirty to forty, gather at dawn to clear the path to the stream.*" The elders do not enumerate every man by name. They name a component, and every individual who possesses that component responds.

This is precisely the architecture of the **Entity-Component-System**, known in the trade as **ECS**. An **entity** is nothing but an identity — a name, a number, a bare hook on which things can be hung. A **component** is a piece of data — a *Position*, a *Velocity*, a *Health*, a *Sprite*, a *Weapon* — attached to an entity. A **system** is a function that asks the world a question ("which entities have both a Position and a Velocity?") and then operates on every entity that answers yes. The inversion from object-oriented thinking is total. In OO, the noun comes first and the verbs hang off it as methods: *the enemy moves itself, draws itself, takes damage from itself*. In ECS, the verbs come first and iterate over nouns that qualify: *the movement system moves everything with a Position and a Velocity, the render system draws everything with a Position and a Sprite, the damage system deducts health from everything with a Health that was hit*. The verb calls the age-grade; the age-grade assembles.

Why does this matter? Three reasons, each profound. **First**, it is fast. Modern processors love to chew through long arrays of identical data — position, position, position, position — and hate to jump from object to scattered object. ECS lays out components in tight arrays, and systems eat them like a combine harvester eats millet. **Second**, it is flexible. To make an enemy that can also be possessed by the player, you do not rewrite the class hierarchy; you simply attach a `PlayerControlled` component to the enemy entity, and the input system immediately starts steering it. **Third**, it is honest. Objects in games rarely fit into tidy inheritance trees. Is a flying boss enemy a subclass of `Enemy`, of `Flyer`, of `Boss`? All three? ECS dissolves the question by refusing to ask it. The boss is an entity with `Enemy`, `Flyer`, and `Boss` components. Nothing is inherited. Everything is composed.

Let us build the smallest possible ECS, in plain JavaScript, so that you may feel its bones.

```javascript
// Entities are just numbers
let nextId = 0;
const entities = new Set();

// Components are maps from entity id to data
const Position = new Map();
const Velocity = new Map();
const Sprite   = new Map();
const Health   = new Map();

function createEntity(components) {
    const id = nextId++;
    entities.add(id);
    for (const [store, data] of components) store.set(id, data);
    return id;
}

// A system: "for every entity that has BOTH Position and Velocity..."
function movementSystem(dt) {
    for (const id of entities) {
        const p = Position.get(id);
        const v = Velocity.get(id);
        if (!p || !v) continue;      // the age-grade filter
        p.x += v.x * dt;
        p.y += v.y * dt;
    }
}

// Making a player: a bare id with four components hung on it
const player = createEntity([
    [Position, { x: 100, y: 100 }],
    [Velocity, { x: 0,   y: 0   }],
    [Sprite,   { image: 'hero.png', frame: 0 }],
    [Health,   { hp: 100, max: 100 }],
]);
```

Notice what the player *is*. The player is the number, say, `0`. That is all. The number is not even stored in a variable called `player` except for our convenience; it could live anywhere. The player's position is in a map somewhere else. The player's health is in a different map. If we wish to kill the player, we do not destroy an object — we simply remove `0` from the `entities` set, and by the next frame the movement system will not find it, the render system will not find it, the input system will not find it, and the player will be gone. Identity has been separated from data, and data has been separated from behaviour, and the three now move independently like the three legs of a tripod.

This is not a clever trick invented by game programmers in 2005. It is the data philosophy of the village rendered in code. The Igbo village did not have `class Nwoye extends Man extends Villager`. The village had Nwoye — a name — and the village had age-grades and lineages and guilds, each of which iterated over its members when it needed to act. Four hundred years of colonial education tried to convince us that the object-oriented way was the natural way, the modern way, the only serious way. It was neither natural nor only. The ECS was always there, in the *obi* of every compound, waiting patiently for us to recognise it on the page. Having recognised the data, we are now ready to make it dance — which is the subject of the next letter.

### Letter 15: On Animation and the Dance of the Masquerade

Dear Reader, a sprite sitting still on the screen is a photograph. A sprite that moves from one coordinate to another is already a small miracle, but it is a photograph sliding on a table — the hero is *translating*, but he is not *alive*. What separates life from mere translation is the *articulation of the body itself*: the arms swinging as the legs run, the cloth lifting as the body turns, the moment of suspension at the top of the jump before gravity claims its due. This articulation, in a two-dimensional game, is produced by **sprite animation** — by cycling through a sequence of still images so quickly that the eye stitches them into motion. Every running hero in every side-scroller you have ever seen is, in truth, a deck of cards being shuffled in front of your face.

The Nigerian *Egungun* masquerade offers the clearest isomorphism I know. When the *Egungun* dancer emerges from behind the shrine in full regalia, the audience does not see a man — they see an ancestor made momentarily visible, a spirit walking on earth. And yet if you could pause the dance frame by frame, as a photograph can, you would see not fluid motion but a sequence of discrete *poses*: the crouch, the lifted foot, the twist of the waist, the arms flung high, the whirl of the *aso oke* cloth. Each pose is held for a breath and then the body snaps to the next. It is the *bata* drums — the master drum and its chorus — that set the rhythm, calling for this pose, then that, in strict tempo. The dancer has practised each pose for years as a still shape. What the audience sees is the *interpolation their own eye performs* between the still shapes, at the speed the drum commands. The dance is a flipbook of postures played at the frame rate of the drum.

A **sprite sheet** is the programmer's flipbook. It is a single image file that contains, arranged in a grid, every frame of every animation the character will perform — the running cycle, the jumping cycle, the idle breath, the attack swing, the death spasm. If each frame is 32 pixels wide and 32 tall, and the run cycle has eight frames, then the run cycle occupies a strip 256 pixels wide and 32 tall in the sheet. At render time, instead of drawing the whole image, we draw only the rectangle containing the current frame. To animate, we advance the frame index over time, wrapping around at the end.

```javascript
const sheet = new Image();
sheet.src = 'hero.png';          // 8 frames, each 32x32

const FRAME_W = 32, FRAME_H = 32;
const FRAMES  = 8;
const FPS     = 12;              // animation clock, not render clock

let animTime = 0;

function updateAnim(dt) {
    animTime += dt;                             // seconds
}

function drawHero(x, y) {
    const frame = Math.floor(animTime * FPS) % FRAMES;
    ctx.drawImage(
        sheet,
        frame * FRAME_W, 0,        // source rect in the sheet
        FRAME_W, FRAME_H,
        x, y,                      // destination on screen
        FRAME_W, FRAME_H
    );
}
```

Observe that the animation has its *own* clock, ticking at twelve frames per second, entirely decoupled from the sixty-frames-per-second of the render loop. This decoupling is essential. The render loop paints as fast as the monitor allows; the animation cycles at the speed the character *should move*. If you tied the animation rate to the render rate, then a player on a 120 Hz monitor would see the hero's legs churn twice as fast as a player on a 60 Hz monitor, which is absurd. The *bata* drums do not speed up when the audience's eyes are sharper. Each clock keeps its own time. The render clock paints what is. The animation clock decides what is to be painted.

Yet discrete frames alone are not enough. When the hero leaps across a chasm, we do not want him to jerk linearly from ground to apex to ground. We want him to *rise quickly and slow at the top*, the way all thrown bodies do, and then *fall quickly as gravity reclaims him*. This shaping of motion is the work of **easing functions**. An easing function takes a parameter `t` running from 0 to 1 — the fraction of the way through a movement — and returns a modified fraction that bends the motion. Linear easing returns `t` unchanged; the motion is mechanical and dead. *Ease-in* returns `t * t`, starting slow and accelerating; good for a falling object. *Ease-out* returns `1 - (1 - t) * (1 - t)`, starting fast and decelerating; good for a sliding door that must not slam. *Ease-in-out* combines both, producing the graceful S-curve that every well-made menu transition uses. And the mischievous *bounce* function causes the value to overshoot and oscillate, which is why cartoon characters land, bob, and settle.

```javascript
const linear    = t => t;
const easeIn    = t => t * t;
const easeOut   = t => 1 - (1 - t) * (1 - t);
const easeInOut = t => t < 0.5 ? 2*t*t : 1 - Math.pow(-2*t + 2, 2) / 2;

// Move the hero from A to B over 'duration' seconds, with easing
function lerp(a, b, t) { return a + (b - a) * t; }

let start = { x: 0, y: 300 }, end = { x: 400, y: 300 };
let tween = 0;                            // seconds elapsed
const duration = 0.6;

function updateJump(dt) {
    tween = Math.min(tween + dt, duration);
    const u = tween / duration;           // 0..1 linear
    const eased = easeOut(u);             // bend the curve
    hero.x = lerp(start.x, end.x, eased);
    hero.y = lerp(start.y, end.y, eased);
}
```

The great lesson of easing is that *nothing in nature moves linearly*. The *Egungun* dancer does not rise to the full height of his leap at a constant rate; his body accelerates away from the ground and decelerates at the peak, and this is precisely what makes the leap feel weighted, feel *bodied*, feel alive. When you ease your sprites, you are not decorating motion. You are telling the player's ancient animal brain that the object on screen obeys the same physical laws as the human body it inhabits. The brain, recognising the signature, grants the sprite the loan of a soul. Having given the body its posture and its rhythm, we must next give it a *mind*, however small — and that is where behaviour trees come in.

### Letter 16: On Behavior Trees and the Decision of the Trader

Dear Reader, a sprite that moves on a scripted path is a puppet. A sprite that *decides* what to do next, in response to the changing world around it, is an **agent** — and giving agents minds is the oldest and most difficult art in game programming. The question is not how to make an enemy smart; the question is how to make it *comprehensibly* smart, so that when the designer wishes to change its behaviour ("if the player is healing, interrupt them; otherwise continue the patrol") the change is local and legible. The enemy's mind must be a *document the designer can read*, not a tangle of conditionals buried in code.

The modern solution, used by nearly every large game from *Halo* onward, is the **behavior tree**. A behavior tree is a tree of nodes, and each node, when asked to run, returns one of three values: **Success**, **Failure**, or **Running**. The leaves of the tree are **action nodes** — they actually *do* things, like "walk to the player" or "shoot". The interior nodes are **composites** that arrange their children into meaningful structures. The two most important composites are the **Sequence** and the **Selector**. A *Sequence* executes its children in order, and succeeds only if all of them succeed; if any child fails, the sequence aborts and reports failure. It is a chain: "do this *and* this *and* this". A *Selector* executes its children in order, and succeeds as soon as any of them succeeds; it is a list of alternatives: "try this *or* this *or* this". Between these two primitives, almost any AI behaviour can be expressed as a simple tree that a designer can read top to bottom.

The isomorphism I love most is the *Onitsha* market trader. Stand for ten minutes in the great market at Onitsha, or at Balogun in Lagos, or at Kariakoo in Dar es Salaam, and watch how a trader calls to passing customers. The trader is not random. The trader is running a behaviour tree, refined by fifty years of practice, and the tree looks like this. First, **sequence — engage a promising customer**: is someone walking by? *Yes* — succeed; continue. Is that someone slowing down, or turning their head toward my wares? *Yes* — succeed; continue. Is their face showing any flicker of interest? *Yes* — succeed; continue. Then call out: "*Madam, come see, quality fabric, price small-small*!" If any check fails — the customer is hurrying past, the eyes are fixed forward, the face is closed — the sequence aborts and the trader conserves energy for the next. Above this sequence hangs a **selector — maximise income**: first try to engage a promising customer; if that fails, try to restock the display; if that fails, rest. The trader runs this tree many times a minute. The tree has no loops and no goto; it simply executes, reports up or down, and begins again.

Let us write a behaviour tree for a simple guard enemy, whose brief is: *if I see the player, chase; otherwise patrol my post; if I lose sight of the player, return to my post*. We shall keep the framework as small as honesty allows.

```javascript
const SUCCESS = 'success', FAILURE = 'failure', RUNNING = 'running';

// Composites
function sequence(...children) {
    return (ctx) => {
        for (const child of children) {
            const r = child(ctx);
            if (r !== SUCCESS) return r;    // fail or running propagates up
        }
        return SUCCESS;
    };
}

function selector(...children) {
    return (ctx) => {
        for (const child of children) {
            const r = child(ctx);
            if (r !== FAILURE) return r;    // success or running propagates up
        }
        return FAILURE;
    };
}

// Leaves — actual actions and checks
const canSeePlayer = (ctx) =>
    distance(ctx.self, ctx.player) < 200 ? SUCCESS : FAILURE;

const chasePlayer = (ctx) => {
    moveToward(ctx.self, ctx.player, ctx.dt);
    return RUNNING;                         // chasing is ongoing
};

const patrol = (ctx) => {
    moveToward(ctx.self, ctx.post, ctx.dt);
    return RUNNING;
};

// The guard's mind: try to chase, else patrol
const guardMind = selector(
    sequence(canSeePlayer, chasePlayer),
    patrol
);

// Called every frame
function tickGuard(self, player, post, dt) {
    guardMind({ self, player, post, dt });
}
```

Read the tree aloud and you will hear the trader in Onitsha. "Can I see the player? Yes? Then chase. No? Then patrol." The sequence `(canSeePlayer, chasePlayer)` means *both checks must proceed* — we only chase if we can see. The outer selector means *chase is preferred, patrol is the fallback*. To make the guard more cautious, we can insert new checks as sequence children: `(canSeePlayer, isHealthy, chasePlayer)` means "chase only if I see the player *and* I am not wounded". To make the guard call for help, we add another branch to the selector: `selector(callForHelp, chase, patrol)`. Each change is a small, local edit to a small, local tree. Nothing elsewhere in the codebase breaks.

The beauty of the behaviour tree is not that it is clever; it is that it is *boringly legible*. A designer with no programming skill can read it, point to a node, and say "put a check here". The code beneath each leaf is simple enough for a junior programmer to write in an afternoon. The whole discipline of game AI has swung toward behaviour trees over the last twenty years precisely because they humble the programmer: they say *the interesting part of intelligence is arrangement, not algorithm*. A guard who chases, patrols, and calls for help is not solving any hard computational problem. He is doing what the Onitsha trader does — running through a fixed list of priorities in order, abandoning each when it fails, committing to the first that works. From such humble trees, whole kingdoms of emergent behaviour grow. And when we ask many such agents to act together, without a central commander, we arrive at one of the most beautiful phenomena in all of game programming — which is the subject of the next letter.

### Letter 17: On Steering, Flocking, and the Herd of Cattle

Dear Reader, there is a kind of motion in the world that no single mind designs and no single hand directs, and yet which appears, to the watching eye, as perfectly coordinated as a choir. Consider a flock of starlings at dusk over the Serengeti, or the pulsing shoal of sardines that draws the dolphins in off the Mozambique channel, or — and this is my favourite example — a *Fulani* herder walking his cattle across the Sahel at the end of the day. The herder has perhaps two hundred cattle. He does not speak to them individually. He does not drive them like a car. He walks at the back and the flanks with a long stick, and the herd *flows* forward like a single slow river of hide and horn. The herd knows where to go. The herd knows not to trample itself. The herd knows to close its ranks when a hyena calls from the grass. And yet the herd has no herd-mind; it has only two hundred cow-minds, each obeying a few simple rules about its immediate neighbours.

In 1986, a computer scientist named Craig Reynolds realised that if he gave simulated bird-like agents — which he called **boids** — three simple rules about their neighbours, they would flock. The rules, in order of subtlety, are these. **Separation**: steer away from any neighbour who has come too close, to avoid crowding and collision. **Alignment**: steer so that your own direction of motion matches the average direction of your neighbours. **Cohesion**: steer toward the average *position* of your neighbours, so that you do not drift out of the group. Nothing more. No leader, no destination, no shared mind. Each boid, every frame, looks at the handful of others within some small radius, computes three vectors, adds them up, and uses the sum as a steering force on its own velocity. Reynolds ran the simulation, and the birds flocked. The emergence was so complete, so convincing, that the same three rules are now used in every game crowd, every fish school, every swarm of bats in every fantasy dungeon. They are the backbone of mob behaviour.

The *Fulani* herder is the isomorphism. The herder does not micromanage. Each cow, left to itself, runs a three-rule program: *do not bump the cow next to me* (separation), *walk the way my neighbours are walking* (alignment), *do not wander so far that I can no longer see them* (cohesion). The herder merely perturbs the herd from the edges — a tap here, a call there, a correction of the direction the *lead cows* happen to be facing. The macro-behaviour of the herd is not in the herder's head; it is in the emergent sum of the cow-rules. The same is true of a morning crowd at *Balogun* market in Lagos or *Kariakoo* in Dar es Salaam — a thousand people, none of whom has a map of the crowd, and yet lanes form, the flow shifts around obstacles, small eddies appear at the stall doors. Micro-rules, macro-flow. This is the deep structural signature of life.

Let us write the three rules. We shall assume a small vector helper — `Vec2` with `add`, `sub`, `mul`, `normalize`, and `length` — which we built in Part II.

```javascript
const PERCEPTION = 50;   // how far a boid sees
const SEP_W = 1.5, ALI_W = 1.0, COH_W = 1.0;

function steer(boid, flock) {
    let sep = new Vec2(0, 0), ali = new Vec2(0, 0), coh = new Vec2(0, 0);
    let nSep = 0, nAli = 0, nCoh = 0;

    for (const other of flock) {
        if (other === boid) continue;
        const diff = boid.pos.sub(other.pos);
        const d    = diff.length();
        if (d > PERCEPTION) continue;

        // Separation: push away from near neighbours, weighted by 1/d
        if (d < 25 && d > 0) {
            sep = sep.add(diff.normalize().mul(1 / d));
            nSep++;
        }
        // Alignment: sum neighbours' velocities
        ali = ali.add(other.vel);
        nAli++;
        // Cohesion: sum neighbours' positions
        coh = coh.add(other.pos);
        nCoh++;
    }

    if (nSep) sep = sep.mul(1 / nSep);
    if (nAli) ali = ali.mul(1 / nAli).sub(boid.vel);
    if (nCoh) coh = coh.mul(1 / nCoh).sub(boid.pos);

    // The total steering force
    const force = sep.mul(SEP_W).add(ali.mul(ALI_W)).add(coh.mul(COH_W));
    boid.vel = boid.vel.add(force.mul(0.05));   // integrate gently
    boid.pos = boid.pos.add(boid.vel);
}
```

Run this on fifty boids placed at random, give them random initial velocities, and you will watch, with the same astonishment Reynolds felt forty years ago, a flock assemble itself out of nothing. The three weights — `SEP_W`, `ALI_W`, `COH_W` — are the only levers. Crank separation up and the flock becomes airy, suspicious, wide-spaced. Crank cohesion up and it becomes tight and bulbous, like a shoal of fish bracing for a shark. Crank alignment up and you get neat military formations. The artistic range of the algorithm is enormous, and it all emerges from three short vector sums applied locally.

The lesson for the game designer is not merely technical. It is cosmological. A great deal of the apparent order in the living world is *emergent*: it arises from the many, acting locally on simple rules, without any central authority holding the plan. The herd is wiser than the herder. The market is wiser than any trader. The village is wiser than any elder. When you build a game with flocking enemies, or with a crowd of villagers moving through a marketplace, you are not imitating intelligence — you are *staging the conditions under which intelligence arises*. You are building the palaver tree. You do not need to give each agent a behaviour tree at all if three rules suffice. And when three rules do not suffice — when the agents must *speak* to the player, must make offers and refusals and jokes and threats — we must reach for a different and older tool, which we shall meet next.

### Letter 18: On Dialogue and the Palaver Tree

Dear Reader, when two minds meet under the great *iroko* tree in the centre of a Yoruba village, or beneath the *baobab* in a Senegalese compound, or at the men's *fada* in a Hausa quarter, what passes between them is not a list of facts. It is a conversation — a branching thing, where each utterance invites several possible replies, and each reply forks the path of the dialogue into a new set of possibilities. An elder begins with a proverb. The listener chooses which of several responses to give — agreement, gentle disagreement, a counter-proverb, a shift of topic. Each response leads to a different continuation. Eventually, after perhaps ten or twenty such exchanges, the conversation resolves into some shared understanding, some decision, some parting formula. Every *palaver* — the West African word for a formal village deliberation — has this structure. It is a walk through a graph whose nodes are utterances and whose edges are the choices made by the speakers at each junction.

A **dialogue tree** in a game is precisely a formalised palaver. It is a directed graph where each node contains a line of text to display, a speaker to display it as, and a list of possible responses the player can give. Each response, in turn, specifies the next node the dialogue moves to. When the player enters conversation with a character, the game displays the node's text, presents the list of responses as buttons, and, when the player clicks one, advances to the linked node. The great narrative games of our era — *Mass Effect*, *The Witcher*, *Planescape: Torment*, *Disco Elysium* — are all, at their core, enormous dialogue graphs, some containing tens of thousands of nodes. But the structure of a ten-thousand-node graph and a ten-node graph is identical. If you understand the small one, you understand the large one.

Let us describe our dialogue data in the simplest form imaginable: a JSON object. Each node has an `id`, a line of `text`, and an array of `options`, each of which has its own text and a `next` pointing to another node id.

```javascript
const dialogue = {
    start: {
        text: "Greetings, traveller. You seem far from your compound.",
        options: [
            { text: "I seek the shrine of the ancestors.",    next: "shrine" },
            { text: "I am lost. Which way to the market?",    next: "market" },
            { text: "That is my business, not yours.",        next: "rude"   },
        ],
    },
    shrine: {
        text: "The shrine lies beyond the iroko tree. But it is closed to outsiders.",
        options: [
            { text: "I am of the Nwankwo lineage.",           next: "kin"    },
            { text: "Then I shall turn back.",                next: "end"    },
        ],
    },
    market: {
        text: "Follow the red earth road until the third compound, then turn left.",
        options: [
            { text: "Thank you, friend.",                     next: "end"    },
        ],
    },
    rude: {
        text: "Then walk in peace. But quickly.",
        options: [ { text: "...",                             next: "end"    } ],
    },
    kin: {
        text: "Ah! Then welcome, child of Nwankwo. Enter freely.",
        options: [ { text: "I am honoured.",                  next: "end"    } ],
    },
    end: null,
};

let current = 'start';

function renderDialogue() {
    const node = dialogue[current];
    if (!node) { closeDialogue(); return; }
    setText(node.text);
    setOptions(node.options.map(opt => ({
        label: opt.text,
        onClick: () => { current = opt.next; renderDialogue(); },
    })));
}
```

Read this data carefully. There is no *code* in it. There is only structure — nodes, text, options, edges. And yet this structure, rendered by the eight-line `renderDialogue` function, is already a functioning conversation. You can hand the JSON to a writer who has never seen JavaScript and the writer can add a hundred branches in an afternoon. You can translate the `text` fields into Igbo, Hausa, Swahili, Wolof without touching the code. You can import and export the whole dialogue to a visual editor. You have made the *palaver* into *data*, and data is the most portable substance in the world.

There is a subtlety that separates a toy dialogue from a living one: **memory**. In a real palaver, what has already been said matters. Once the elder has told you his name, he does not tell you again. Once you have insulted him, he remembers. To support memory, we augment the dialogue system with a small set of **facts** — a store of flags that the dialogue can both read and write. An option might carry a `setFact` ("the player now knows the elder's name") and another option might carry a `requireFact` ("only show this option if the player is of the Nwankwo lineage"). With facts added, the dialogue is no longer a tree — it has become a graph with persistent state, and the same node, visited twice, may now behave differently. This small addition is what separates *Planescape: Torment* from a children's choose-your-own-adventure.

```javascript
const facts = new Set();

function canShow(option) {
    if (option.require && !facts.has(option.require)) return false;
    return true;
}

function choose(option) {
    if (option.set) facts.add(option.set);
    current = option.next;
    renderDialogue();
}
```

The philosophical point, which I have been edging toward, is this: the palaver tree is not a metaphor for the dialogue system — the dialogue system is a *digital palaver tree*, rendered in code because the cloth of wood and shade cannot be shipped through a browser. The structure is identical. The village elders have been running dialogue graphs, with facts, with guards, with branching paths, since before writing was invented. What we add is not intelligence; what we add is *persistence* — we can record the palaver, replay it, translate it, share it across the continent. We have turned a transient art into an enduring one. And when we turn next to the question of *generating* content instead of authoring it, we shall see that Africa has been doing *that* for even longer.

### Letter 19: On Procedural Generation and the Weaving of Adinkra

Dear Reader, there is an art, older than any code, of making infinite variety from a finite vocabulary. In Ghana, the *Adinkra* cloth is stamped with a small set of symbols — perhaps sixty in common use — each with a name and a meaning: *Sankofa*, the bird looking backward ("return and fetch it"); *Gye Nyame*, the supremacy of God; *Funtunfunefu Denkyemfunefu*, the crocodiles with a shared stomach (unity in diversity); *Nyame dua*, the altar of the sky god. The cloth-maker dips a wooden stamp into the *badie* dye, presses it to the cloth, lifts, moves, presses again. A grid. A border. A centre. A scattering of smaller stamps in the spaces. From sixty glyphs and a handful of compositional rules — repetition, symmetry, framing, filling — an *Adinkra* master produces cloths that no two of which are alike, each one telling its own proverb through the arrangement of inherited symbols. This is **procedural generation** of the purest kind, and it has been practised in Africa for at least four hundred years.

**Procedural generation**, in the programmer's sense, is the production of content from rules rather than from handcrafted authorship. Instead of an artist placing every tree in a forest, a rule generates the forest: *place a tree every few metres, jitter the position, vary the height, cluster them near water*. Instead of a designer drawing every dungeon, an algorithm carves one: *pick rooms at random, connect them with corridors, place a stair up and a stair down*. Instead of a composer writing every melody, a grammar produces them: *a verse is two phrases, a phrase is three bars, a bar obeys the scale*. The gain is obvious — a small rule can generate a vast quantity of content — but the gain is not the point. The point is that *the rule is the art*. The cloth-maker is not trying to draw every possible cloth; she is trying to *design the rule* that will produce cloths she would be proud of. The programmer does the same.

There are several celebrated procedural techniques in the modern game-maker's toolbox. **Wave Function Collapse** (WFC) treats generation as a constraint satisfaction problem: give it a small set of tile types and the rules for which tiles may neighbour which, and it will collapse a grid of possibilities into a coherent arrangement, much as *Adinkra* symbols collapse onto cloth under the rule that certain symbols go near certain others. **L-systems**, invented by the Hungarian biologist Aristid Lindenmayer, grow plants and fractals from string-rewriting rules: start with `F`, apply the rule `F → F[+F]F[-F]F`, and in five iterations you have a bush. **Perlin noise** produces smooth pseudo-random heightmaps and is the backbone of nearly every modern terrain generator. And the **Mandelbrot set**, that strange and infinitely detailed fractal we met briefly in the preface, is perhaps the smallest example in mathematics of infinite content arising from a rule so small it fits on a napkin: `z → z² + c`.

Let us build a tiny procedural generator ourselves. The one I love is **Rule 30**, Stephen Wolfram's famous one-dimensional cellular automaton, which produces astonishingly complex patterns from the simplest possible rules. We have a row of cells, each either 0 or 1. Each new row is computed from the row above: a cell's new value depends on itself and its two neighbours, according to a three-bit lookup table. Rule 30's table says: `111→0, 110→0, 101→0, 100→1, 011→1, 010→1, 001→1, 000→0`. Eight cases, one bit each. That is the entire rule.

```javascript
const WIDTH = 81;
const rows = [];
let row = new Array(WIDTH).fill(0);
row[Math.floor(WIDTH / 2)] = 1;          // seed: a single '1' in the middle
rows.push(row);

function ruleThirty(a, b, c) {
    const pattern = (a << 2) | (b << 1) | c;
    // 00011110 in binary is 30: the bits are the outputs for patterns 7..0
    return (30 >> pattern) & 1;
}

for (let r = 0; r < 40; r++) {
    const prev = rows[rows.length - 1];
    const next = new Array(WIDTH);
    for (let i = 0; i < WIDTH; i++) {
        const a = prev[(i - 1 + WIDTH) % WIDTH];
        const b = prev[i];
        const c = prev[(i + 1) % WIDTH];
        next[i] = ruleThirty(a, b, c);
    }
    rows.push(next);
}

// Render: draw each row as a line of black and white squares
function draw() {
    for (let r = 0; r < rows.length; r++) {
        for (let i = 0; i < WIDTH; i++) {
            ctx.fillStyle = rows[r][i] ? '#1a1a1a' : '#f5f1e8';
            ctx.fillRect(i * 6, r * 6, 6, 6);
        }
    }
}
```

Run this and you will see, growing downward from the single seed cell, a triangular pattern so irregular and so self-similar that cryptographers have used its central column as a source of pseudo-random numbers. One rule, eight cases, sixteen bits of information — and an inexhaustible fountain of complexity pours out. This is the deep magic of procedural generation. The *Adinkra* cloth-maker, the *Ndebele* muralist painting geometric patterns on her hut, the *Kente* weaver counting threads — all of them know this magic instinctively. Africa has been running cellular automata by hand, in cloth and clay and wood, for centuries. The computer did not invent procedural art. The computer *recognised* an art already widespread on the continent, and gave it a faster loom.

The lesson for the game-maker is twofold. First, *design the rule, not the result*. If your dungeon is handcrafted, you have one dungeon. If your rule is well-designed, you have ten thousand dungeons, each different, each playable, each surprising even to you. Second, *prefer a small vocabulary of strong elements to a large vocabulary of weak ones*. Sixty *Adinkra* symbols are enough for an infinity of cloths because each symbol is meaningful; six thousand meaningless shapes would produce boring mush. The same holds in games. A small set of tile types, well-chosen, yields richer procedural worlds than a sprawling asset library. Once the world has been generated, however, we must eventually face the mundane but essential question of how to *save* it — how to pluck the living state of our game from memory and preserve it for tomorrow. That is the last letter of Part III.

### Letter 20: On Save, Load, and the Scroll You Can Roll Up

Dear Reader, there is a deceptively simple question that every game must answer before it can be taken seriously: *what happens when the player closes the window*? If the answer is "all progress is lost," the game is a toy. If the answer is "the world resumes precisely as the player left it," the game is a medium, a place, a possession. The difference between a toy and a medium is **serialization** — the ancient art of turning the living state of a running program into a sequence of bytes that can be written to disk, carried across machines, and later read back into life. A game that can be saved and loaded is a game that can be paused, shared, versioned, translated, backed up. A game that cannot be saved is a dream — vivid while it lasts, gone when you blink.

If you have followed the earlier letters carefully, you already hold the key to saving. In Letter 4, I insisted that the state of your game must live in a single, well-defined data structure — an object (or a set of component arrays) that holds *everything* the world is, and *nothing* the world is not. If you obeyed that discipline, then saving the game is nearly trivial: you convert the state object to a string, you write the string to disk, and you are done. If you disobeyed it — if the state of your world is scattered across local variables, closure captures, DOM elements, and module-level singletons — then saving becomes an archaeology of debugging, and I can only offer condolences. The discipline pays its debt exactly here. Good data design is not a luxury; it is the precondition of persistence.

The cleanest African isomorphism I know is the *Timbuktu manuscript*. For five hundred years, the scholars of Timbuktu in Mali — in the libraries of Sankoré and Djingarey Ber — wrote treatises on astronomy, jurisprudence, medicine, and theology on parchment made from goatskin, in elegant Arabic script. These manuscripts were not flat, expendable sheets. They were *rolled*, stored in goatskin cases, handed down from scholar to scholar, and when a later reader wished to consult the knowledge, the scroll was unrolled and the text read. The *state of a mind* — what one man thought about Ptolemaic astronomy in the year 1450 — was serialized into ink on parchment, rolled up for five hundred years, and can be read today in the Ahmed Baba Institute. That is serialization on the scale of empires. A closer cousin is the *Ifa* divination corpus of the Yoruba — 256 *Odu*, each a fully defined body of verses, encoded in an eight-bit pattern of palm nuts, memorised by the *babalawo* across generations, and now increasingly written down. The *Ifa* corpus is a saved state: knowledge that survives its bearer.

The modern programmer has a humbler medium. In the browser, the simplest save destination is **LocalStorage** — a small persistent key-value store, unique to each origin, that survives across page reloads and browser restarts. Its capacity is limited (a few megabytes) and its interface is embarrassingly simple: `localStorage.setItem(key, stringValue)` and `localStorage.getItem(key)`. Combined with `JSON.stringify` and `JSON.parse`, it is enough for any game whose state is not colossal.

```javascript
const SAVE_KEY = 'my-game:save';

function saveGame() {
    const state = {
        version: 1,
        player: {
            pos: { x: player.pos.x, y: player.pos.y },
            hp:  player.hp,
            inventory: player.inventory,
        },
        facts: Array.from(facts),         // Sets must become arrays
        scene: currentScene,
        seed:  worldSeed,
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}

function loadGame() {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return false;
    const state = JSON.parse(raw);
    if (state.version !== 1) return migrate(state);
    player.pos       = new Vec2(state.player.pos.x, state.player.pos.y);
    player.hp        = state.player.hp;
    player.inventory = state.player.inventory;
    facts.clear();
    for (const f of state.facts) facts.add(f);
    currentScene = state.scene;
    worldSeed    = state.seed;
    return true;
}
```

Notice two small but important disciplines. **First**, we give the save a `version` field. The very first save of our first game is version 1. When the game updates and the shape of the state changes — perhaps we add a *stamina* field to the player, or split the inventory into weapons and items — we bump the version, and we write a `migrate` function that takes an old save and upgrades it to the new shape. Without this discipline, every update of your game will invalidate every player's save, which is the single most enraging experience a player can have with a persistent game. With it, a player who returns to your game after two years, on a device they have owned the whole time, will find their world exactly as they left it, seamlessly translated to the new format. **Second**, we are explicit about converting non-JSON-friendly types — a `Set` must become an array, a `Map` must become an array of pairs, a class instance must become a plain object. JSON is the lingua franca of saved data precisely because it is humble; everything must be expressible in its small vocabulary.

There is a still deeper principle hiding in this letter, which I want you to carry with you into Part IV. It is this: *if the state of your world is data, then everything is trivial*. Save is trivial. Load is trivial. Undo is trivial — just keep the last N states in a ring buffer. Replay is trivial — record the sequence of inputs and re-run the simulation from the initial state. Multiplayer is *almost* trivial — ship the state diffs over the network. Debugging is trivial — dump the state to a file and inspect it in a text editor. Every hard problem in game engineering becomes easy the moment you are willing to treat your world as data rather than as a tangled object graph. The ancient scholars of Timbuktu understood this in their bones: they kept their knowledge as *text*, not as *memorised performances*, because text can be copied, carried, and outlived. Your game's state is your manuscript. Keep it clean enough to roll up.

Thus ends Part III. We have given our sprites an architecture (the age-grade of ECS), a body in motion (the dance of the masquerade), a mind of priorities (the trader's decision), a shared life (the herd that flocks), a voice (the palaver tree of dialogue), a world that generates itself (the loom of *Adinkra*), and finally a soul that can be rolled up and set aside until tomorrow (the Timbuktu scroll). What remains is the *surface* on which all of this becomes visible to the player — the pixels that shine, the shaders that bend light, the sounds that strike the ear. Part IV turns to the senses, and we shall begin with the pixel itself: the smallest luminous dot on the screen, and the long, strange road by which a number in a memory cell becomes a point of coloured light in a child's eye in Bamako.

---

## Part IV: Senses and Surfaces

### Letter 21: On Pixels and the Atomic Mark

We have spent twenty letters speaking of loops, vectors, entities, and behaviours — abstractions that live in the memory of the machine and have no colour, no shape, no surface. But a game must be *seen*. At the end of every frame, some quantity of light must leave the screen and enter the player's eye, or else the whole edifice of state and simulation might as well not exist. In this fourth part we descend to the skin of the game — to pixels, sprites, shaders, lighting, particles, sound, and the heads-up display — and we discover that each of these surfaces has been rehearsed, for centuries, in the craft traditions of the African continent.

Begin with the smallest of them. A **pixel** — the word is a contraction of *picture element* — is the indivisible atom of the screen. Each pixel is a tiny square (or, on some displays, a thin rectangle) that can emit one colour at one intensity, and nothing smaller. A modern phone screen is a grid of them, millions of them, arranged so densely that the eye, at normal reading distance, cannot resolve the gaps between them, and so the grid appears to the mind as a continuous image. But it is not continuous. It is a mosaic. Every picture you have ever seen on a screen is built from hundreds of thousands of tiny, discrete, coloured squares obeying a single rule each.

If this sounds familiar, it is because the same architecture governs the *Yoruba beadwork* of Oyo and Ilé-Ifẹ̀. The *adé* — the beaded crown of a Yoruba *ọba* — is built from tens of thousands of glass beads, each a single colour, each threaded on a string, each occupying one fixed position in a grid of warps and wefts. No bead mixes colours. No bead takes on two hues at once. The bead is the atom of the crown, and the crown is nothing but the arrangement of its atoms. When the master beader wishes to depict the face of an ancestor, he does not paint. He selects beads. He places a blue bead where the eye must be cool and a red bead where the mouth must be warm, and when the crown is held at a distance the discrete atoms blur into a face, a bird, a pattern of power. A pixel is a bead of light. A screen is a crown the machine wears on your behalf.

Or consider the *mosaics* of Roman North Africa — the floors of Volubilis in Morocco, of Carthage in Tunisia, of Bulla Regia and Leptis Magna. Each mosaic is composed of tens of thousands of *tesserae*, small cut squares of marble, glass, or terracotta, each one a single colour, each one pressed into wet mortar in a precise position. The *tessera* is the pixel of the mosaic. The composition — Orpheus, Neptune, a hunting scene — emerges only when enough *tesserae* are arranged correctly. Walk too close and you see only coloured stones. Step back and the image appears. Your phone screen obeys the identical mathematics: too close, you see the grid; at reading distance, you see a face.

Two numbers describe a screen: its **resolution** (how many pixels wide and tall) and its **pixel density** (how many pixels per physical inch, usually written as DPI or PPI). A typical mid-range African Android phone — the phones actually in the pockets of your future players from Kano to Kisumu — is roughly 720 pixels wide, 1600 pixels tall, at about 270 pixels per inch. A flagship phone may double these numbers. A cheap tablet may halve them. Your game must look correct on all of them, and this is where the distinction between **logical pixels** and **physical pixels** becomes critical. Logical pixels are the units in which you write your code: *draw a button 100 pixels wide*. Physical pixels are the actual hardware squares of light: *that button is 200 hardware pixels wide on a HiDPI screen, 100 on a low-DPI one*. The browser mediates between them through a ratio called `devicePixelRatio`. If you ignore it, your game is sharp on old phones and fuzzy on new ones. If you honour it, the same code renders crisply everywhere.

The third number you must respect is **aspect ratio** — the ratio of width to height. A desktop monitor is typically 16:9. An African Android phone, held vertically, is closer to 9:20. A tablet in landscape is 4:3. A game that locks itself to one aspect ratio will always be letterboxed or cropped on the others. The design rule for this continent is simple: **mobile-first, portrait-first, 720×1600 as your baseline**, and let the canvas scale up for anyone lucky enough to have more.

Here is how to set up a canvas that is both mobile-aware and HiDPI-correct:

```javascript
function setupCanvas(canvas) {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    // Physical pixels: the real grid of the screen
    canvas.width  = Math.round(rect.width  * dpr);
    canvas.height = Math.round(rect.height * dpr);

    // Logical pixels: the units our game code uses
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    return { ctx, width: rect.width, height: rect.height };
}

// In your HTML, set:
// <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
// <canvas style="width:100vw; height:100vh"></canvas>
```

The `viewport` meta tag tells the browser not to pretend the phone is a tiny desktop — a historical default from the earliest iPhones that still haunts us today. Without it, your 720-pixel phone reports itself as 980 pixels wide, everything scales, and text becomes unreadable. With it, logical pixels and CSS pixels align, and your game speaks honestly to the device. Every Yoruba beader knows the size of his beads before he begins the crown. Every Roman mosaicist knew the dimensions of his *tesserae*. The game developer must know, with equal certainty, the size and density of the pixels on which the world will appear.

Now that we know the atom, let us see how thousands of them can be bundled into a single image and drawn with one stroke — the art of the sprite and its atlas.

### Letter 22: On Sprites and the Atlas

The pixel is the atom; the **sprite** is the molecule. A sprite is a small image — a character, an enemy, a tile of grass, a coin, a button — stored as a rectangular grid of pixels and drawn at some position on the canvas each frame. When you see a small hero running across a platformer, you are watching the same sprite being blitted to a different screen position every tick, perhaps cycled through four or five slightly different poses to suggest running. The word *sprite* comes from the early hardware of arcade machines, where a small dedicated chip could overlay a mobile image on a stationary background without redrawing everything — a "spirit" moving across the scene. Our software sprites are the descendants of those hardware ghosts.

If you stored each sprite as its own separate image file, you would pay a heavy price: every image must be decoded, uploaded to the GPU as a texture, and each time you draw from a different texture the renderer must stop what it is doing and switch. This stopping-and-switching is called a **draw call**, and draw calls are the single greatest bottleneck in 2D game rendering. A game that tries to draw a thousand grass tiles from a thousand separate textures will crawl on even a powerful phone. A game that draws the same thousand tiles from a *single* texture — selecting a different sub-rectangle for each tile — can render them in a handful of calls, with no perceptible cost.

The single texture that holds all the sprites is called a **sprite sheet**, or, in more modern parlance, a **texture atlas**. It is simply a larger image into which all of the game's small images have been packed, side by side, with some bookkeeping that records where each sprite lives inside the atlas. When you want to draw the hero's running frame, you do not load a new file — you draw the same atlas you have always had, but you copy only the small rectangle that contains the running frame. The GPU never has to switch textures. The draw call count collapses. The frame rate holds.

The isomorphism is the *market stall* of any African *mama put* or cloth trader. Walk into Balogun Market in Lagos, Mile 12, Kejetia in Kumasi, Kariakoo in Dar es Salaam. The trader does not hold up one product at a time for you to consider. She spreads her mat and arranges dozens of goods on it simultaneously — twenty shades of *ankara*, a column of soaps, a row of bottles, a stack of onions. You, the customer, stand before the mat and select with your eyes. The mat is the atlas. Each product is a sprite. The act of selection — *pointing to that one there, in the third row, second from the left* — is the draw call that copies the sub-rectangle you want. The trader does not hand you one product at a time, walk away, and return with another. Everything is already on the mat. Your eye does the routing. This is exactly how the GPU draws a tile map from an atlas: the atlas is already loaded, the trader-shader points into it, and the mat fills the screen.

The Canvas 2D API has, buried in its `drawImage` function, a nine-argument form that is the bridge between atlas and screen. You give it the source image, the rectangle inside that image to copy from, and the rectangle on the canvas to copy to. This is the whole of 2D sprite rendering:

```javascript
// ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh)
//
//   sx, sy, sw, sh  — the sub-rectangle inside the atlas (source)
//   dx, dy, dw, dh  — where to draw it on the canvas (destination)

const atlas = new Image();
atlas.src = 'sprites.png';  // e.g. 256×256 atlas with 32×32 tiles

// A sprite map: name → (x, y, w, h) inside the atlas
const SPRITES = {
    hero_idle:  { x:   0, y:  0, w: 32, h: 32 },
    hero_run1:  { x:  32, y:  0, w: 32, h: 32 },
    hero_run2:  { x:  64, y:  0, w: 32, h: 32 },
    coin:       { x:   0, y: 32, w: 16, h: 16 },
    grass_tile: { x:  64, y: 32, w: 32, h: 32 },
};

function drawSprite(ctx, name, x, y) {
    const s = SPRITES[name];
    ctx.drawImage(atlas, s.x, s.y, s.w, s.h, x, y, s.w, s.h);
}

// Draw a row of grass — one atlas, many sprites, no texture swaps
for (let i = 0; i < 20; i++) {
    drawSprite(ctx, 'grass_tile', i * 32, 400);
}
drawSprite(ctx, 'hero_run1', 160, 368);
```

The sprite map above is written by hand, which is fine for ten sprites. For a hundred, use a tool: **TexturePacker**, **free-tex-packer**, or the sprite packer built into most game engines will take a folder of images, pack them into a single atlas, and emit a JSON file with exactly the coordinates shown above. You then load the JSON at startup and call `drawSprite` by name thereafter. The artist works in individual files; the runtime sees one atlas. This is the division of labour the market trader discovered long before us — arrange everything on one mat at dawn, sell from that mat all day.

One warning about atlas layout: leave a one-pixel transparent border around each sprite. Without it, the bilinear filtering the GPU uses when scaling will "bleed" adjacent sprites into each other, producing a thin fringe of the wrong colour along every edge. The Roman mosaicist left a thin line of mortar between *tesserae* for the same reason — without separation, the stones would crack each other. Always pad your atlas. Always test your edges.

A single drawn sprite is an image; a series of sprites drawn in sequence is the beginning of animation, which we have already met. But the deeper question — *how does the GPU draw any of this at all?* — brings us to the great parallel engine at the heart of every modern device: the shader.

### Letter 23: On Shaders and the Million Painters

Until now we have treated the canvas as a flat surface on which a single invisible hand draws rectangles, images, and text, one command at a time. This is a useful fiction, and the `ctx.drawImage` call of the last letter honours it faithfully. But beneath the fiction, the actual work of colouring pixels is done not by one hand but by a thousand. Or a million. Or a hundred million. The device in your pocket contains, alongside its ordinary **central processing unit** (CPU), a second, stranger kind of processor: the **graphics processing unit**, or **GPU**. Where the CPU is a single genius that does one thing at a time very quickly, the GPU is a great hall of apprentices, each slower than the CPU individually but numbering in the thousands, all working on different pixels at the same moment. The CPU is the master scholar; the GPU is the workshop.

To command this workshop, you do not give it a sequence of drawing calls. You give it a program, called a **shader** — a small piece of code that runs once per pixel (or once per vertex), in parallel, across the whole of the workshop. Every apprentice receives the same program and executes it on his own little patch of the canvas, at the same moment as all the others. The GPU then assembles their work into a finished image and shows it to you. A single shader, running on a modern phone, can colour two million pixels in less than one sixtieth of a second. A CPU attempting the same work, pixel by pixel, would take ten times longer.

There are two principal kinds of shader you must know. A **vertex shader** runs once per corner of each triangle being drawn — once per *vertex* — and its job is to transform that vertex from whatever coordinate system the game uses (world coordinates, perhaps) into screen coordinates. It is the geometry of where-things-are. A **fragment shader** (also called a *pixel shader*) runs once per pixel on the surface of each triangle, and its job is to decide what colour that pixel should be. It is the chromatics of what-things-look-like. Between the two of them — geometry first, colour second — the whole of modern rendering is performed. WebGL and WebGPU are the two APIs by which the browser gives your JavaScript code access to this parallel workshop.

The isomorphism belongs to the *Asafo flag makers* of Fante coastal Ghana — the quilted, appliquéd banners carried by the military companies of Cape Coast and Elmina. An Asafo flag is enormous, sometimes six feet on a side, covered in figures cut from bright cloth and sewn onto a ground. A single tailor working alone might take months to finish one. But Asafo workshops do not work alone. A master designs the cartoon — the overall composition, the placement of the warrior, the lion, the ship, the proverb woven around the border — and then ten or twenty apprentices take different regions of the flag and work on them *simultaneously*. The apprentice in the corner is sewing the tail of the lion while the apprentice at the centre is stitching the warrior's shield, and all of them are stitching at the same moment. The cartoon is the program. Each apprentice is a GPU core. The flag is the framebuffer. And the whole magnificent banner is finished in a day. This is exactly what a shader does with your screen.

Or take the wedding feast in a Mende village in Sierra Leone. You cannot feed three hundred guests with one pot of *jollof* cooked by one cook. You build three fires, you set three pots, you assign three cooks — or thirty — and each cooks her own portion according to the same recipe at the same time. The recipe is the shader program. Each cook is a shader core. The feast is the rendered frame. When the GPU "runs a fragment shader across the screen," it is running the same recipe, in parallel, across thousands of cooks, so that the feast is ready when the guests arrive.

Here is a tiny fragment shader — smaller than anything you would ship, but large enough to see. It paints the screen with a gradient from red in one corner to green in another:

```glsl
// Fragment shader — runs once per pixel, in parallel, on the GPU
#version 300 es
precision mediump float;

in vec2 v_uv;          // normalized position of this pixel, 0..1
out vec4 fragColor;

void main() {
    // v_uv.x is how far right we are (0 = left edge, 1 = right edge)
    // v_uv.y is how far down we are (0 = top,        1 = bottom)
    //
    // Colour = (red = x, green = y, blue = constant, alpha = 1)
    fragColor = vec4(v_uv.x, v_uv.y, 0.5, 1.0);
}
```

Read this program carefully and then remember that it will run, simultaneously, on every one of the two million pixels of a modern phone screen. The pixel in the top-left receives `v_uv = (0, 0)` and becomes black-ish. The pixel in the top-right receives `v_uv = (1, 0)` and becomes red. The pixel in the bottom-right receives `v_uv = (1, 1)` and becomes yellow. Each pixel's apprentice runs the same four lines of code and produces a different result because each one has a different input. This is **data parallelism**, and it is the secret of everything fast in graphics.

You do not need to write shaders from scratch to make games — the Canvas 2D API we have been using hides them inside its `drawImage`, and a library like PixiJS or Three.js will generate them for you. But you must know that they exist, and you must know that every frame of every game you have ever admired — from the shimmering water of a coastal level to the rolling fog of a horror game to the bloom of a magic spell — is a shader doing its patient parallel work. And once you know that such a tool is available, you will begin to ask what *light* looks like to a shader, which is the mathematics of the next letter.

### Letter 24: On Lighting and the Saharan Sun

A flat sprite drawn with a constant colour is legible, but dead. A sphere rendered without lighting looks like a disc. A cube without lighting looks like a hexagon. What distinguishes a living surface from a dead shape is the variation of brightness across the surface — the gradient from the sunlit side to the shadowed side, the bright rim where a highlight catches the eye, the soft darkness of the parts that face away from the sun. This variation is called **shading**, and it is governed by mathematics so simple and so beautiful that once you see it you will not unsee it.

Three components are mixed together to make realistic shading. The first is **ambient light** — the background illumination that reaches every surface from every direction, produced by light scattering off walls, off dust, off the sky itself. Ambient light has no source; it just *is*. In the mathematics of the shader it is a constant added to every pixel: *brightness_base = 0.2* or so, meaning "nothing is ever completely black, because photons bounce." The second is **diffuse light** — the light that strikes a surface directly from a particular source (the sun, a lamp, a torch) and is scattered equally in all directions by the microscopic roughness of the surface. Diffuse light is what gives a matte wall its sunny side and its shady side. The third is **specular light** — the sharp, mirror-like highlight that appears on a shiny surface when the reflection of the light source falls directly into your eye. Specular is what turns wet stone into wet stone, what puts the gleam on a polished brass bell.

The diffuse component obeys a law discovered by Johann Heinrich Lambert in 1760 and now named after him. **Lambert's cosine law** says: the brightness of a diffusely-lit surface is proportional to the cosine of the angle between the surface **normal** (the arrow pointing straight out of the surface) and the direction to the light source. When the surface faces the light squarely, the angle is zero, the cosine is one, the surface is at full brightness. When the surface is edge-on to the light, the angle is ninety degrees, the cosine is zero, the surface is black. In between, the brightness varies smoothly as the cosine, which is exactly the **dot product** of the two unit vectors. We met the dot product four letters ago as a measure of alignment. Here it is again, doing the same work: measuring how aligned a surface is with the sun.

The isomorphism is the *Tuareg tent* under the Saharan sun. A Tuareg *khaïma* is a low dome of goat hair, pitched in the open desert, facing no particular direction because the sun will sweep around it over the course of the day. In the early morning, the sun is low in the east, and its rays strike the eastern side of the dome at a shallow grazing angle — the normal of that side is almost perpendicular to the light, the dot product is small, and the cloth there is cool, dimly lit, in blue shadow. By noon the sun is overhead, striking the top of the dome directly — the normal of the top is parallel to the light, the dot product is one, and the cloth there is hot, bright, almost white in the glare. By late afternoon the sun has moved west, and the pattern reverses. At every moment, every patch of cloth on the dome is being lit according to Lambert's cosine law, and you can read the law in the temperature of the cloth and in the colour the eye sees. The Tuareg did not need to know the equation. But the equation was already governing the pitching of his tent.

Here is the calculation, written as a fragment shader for clarity:

```glsl
// Per-pixel lighting: ambient + Lambertian diffuse
precision mediump float;

in  vec3 v_normal;      // unit vector perpendicular to the surface
in  vec3 v_worldPos;    // world-space position of this pixel
out vec4 fragColor;

uniform vec3 u_lightDir;   // unit vector pointing TOWARD the light
uniform vec3 u_lightColor; // e.g. (1.0, 0.95, 0.85) — warm sun
uniform vec3 u_surfaceColor;

void main() {
    // Ambient: a small constant so nothing is ever fully black
    vec3 ambient = 0.15 * u_surfaceColor;

    // Diffuse: Lambert's cosine law
    float cosTheta = max(0.0, dot(normalize(v_normal), u_lightDir));
    vec3 diffuse = cosTheta * u_lightColor * u_surfaceColor;

    fragColor = vec4(ambient + diffuse, 1.0);
}
```

The single line `float cosTheta = max(0.0, dot(v_normal, u_lightDir))` is the whole of Lambert's law, expressed in as little code as a single proverb expresses a whole philosophy. The `max(0.0, …)` is there because when the surface faces *away* from the light, the dot product goes negative, and a surface cannot be darker than black — the back of the tent does not glow with anti-sunlight; it simply stops receiving any. The `normalize` on the normal ensures we are measuring pure angle, not a mixture of angle and magnitude. And the multiplication of the three vectors at the end produces the coloured light that is actually painted onto the pixel.

The specular component, which we have not coded, adds one more term: the **Phong highlight**, due to Bui Tuong Phong in 1975. Its formula computes the reflection of the light direction about the surface normal, takes its dot product with the direction to the viewer, raises the result to a high power (16, 64, 256), and adds that as a white spot. The high power is what makes the highlight small and sharp on a polished surface and broad and dull on a matte one. It is the same mathematics as Lambert, applied not to the light-and-surface angle but to the reflection-and-eye angle. Together, ambient, diffuse, and specular make the difference between a disc that looks like a disc and a disc that looks like a moon.

In a 2D game you may think you need none of this, but you would be wrong. A shadow underneath a character is an ambient term; a sun gradient across a map is a diffuse term; a shimmer on a coin is a specular term. Whether you compute them in a shader or paint them by hand into a sprite, the mathematics is the same, because the physics of light is the same, whether you are lighting a Tuareg tent, a shaded sphere, or a flat pixel image of a mango. And once you understand that light obeys rules simple enough to fit on one line, you can begin to simulate hundreds or thousands of *small* luminous things at once — which is the art of particles.

### Letter 25: On Particles and the Spray of the Atlantic

Until now, every entity we have animated has been a single, substantial thing: a ball, a hero, a platform. There is a second kingdom of entities — the kingdom of the small, the swarming, the ephemeral — that no game can do without. Fire. Smoke. Dust. Rain. Sparks. Blood. Magic. Confetti. Pollen. None of these is a single object; each is a *cloud* of tiny independent objects, each born at some instant, each living for a fraction of a second, each dying and being replaced. A game that renders fire as a single animated sprite looks cartoonish. A game that renders it as a *particle system* — a crowd of a hundred tiny flame-puffs, each rising, fading, and being replaced by new ones — looks alive.

A **particle system** is an entity whose job is to manage a pool of small sub-entities called **particles**. Each particle has, at minimum, a position, a velocity, a lifetime (how long it has lived so far), and a maximum lifetime (how long it is permitted to live). Every frame, the system does three things: it *updates* every living particle (moving it by its velocity, ageing it, fading its colour), it *kills* every particle whose lifetime has exceeded its maximum, and it *spawns* new particles from its **emitter** to replace the dead ones. The whole crowd churns continuously, with the population roughly constant and the individuals constantly cycling.

The isomorphism is the *Atlantic spray* at Cape Coast Castle, or Elmina, or Gorée — any point on the West African coast where the ocean beats against rock. Stand on the wall of the castle and watch a wave strike the stones below. The impact hurls ten thousand tiny water droplets into the air. Each droplet is born at the instant of impact, given a velocity by the force of the collision, and then released to fall under gravity alone. No droplet talks to any other. Each droplet lives for perhaps half a second — just long enough to rise, arc, and fall back into the sea. The whole cloud of droplets produces, in the eye of the watcher, a coherent visual phenomenon called "the splash" — a shape with character, even personality — that no single droplet contains. The splash is an emergent property of thousands of independent, simple lives. Replace "droplet" with "particle" and "wave" with "emitter" and you have the whole architecture of a particle system.

Or consider the *Harmattan dust*, the dry wind that blows each December from the Sahara south to the Gulf of Guinea, carrying clouds of fine red dust across the entire continent. The individual grain of dust obeys only two rules: be pushed by the wind, and fall slowly under gravity. No grain knows about any other grain. Yet in aggregate the cloud veils the sun over Lagos, reddens the sky in Accra, coats the windshields of Ouagadougou. A few rules per particle, multiplied by a few million particles, produces a continental weather event. The same mathematics, in miniature, produces every puff of smoke, every trail of sparks, every drifting leaf in the games you will write.

Here is a minimal particle system in JavaScript. Read it slowly:

```javascript
class Particle {
    constructor(x, y, vx, vy, life, color) {
        this.x = x; this.y = y;
        this.vx = vx; this.vy = vy;
        this.age = 0;
        this.life = life;   // seconds
        this.color = color;
    }
}

class Emitter {
    constructor(x, y) {
        this.x = x; this.y = y;
        this.particles = [];
    }

    spawn() {
        // Random direction, random speed — a puff of fire
        const angle = -Math.PI/2 + (Math.random() - 0.5) * 0.6;
        const speed = 80 + Math.random() * 60;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        this.particles.push(new Particle(
            this.x, this.y, vx, vy,
            0.6 + Math.random() * 0.4,   // lifetime 0.6–1.0s
            [255, 180 + Math.random()*60, 40]
        ));
    }

    update(dt) {
        // Birth
        for (let i = 0; i < 5; i++) this.spawn();

        // Life — in reverse so we can splice the dead
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.age += dt;
            if (p.age >= p.life) { this.particles.splice(i, 1); continue; }

            p.vy += 200 * dt;          // gravity, but upward-ish fire rises less
            p.x  += p.vx * dt;
            p.y  += p.vy * dt;
        }
    }

    render(ctx) {
        for (const p of this.particles) {
            const t = 1 - p.age / p.life;   // 1 at birth, 0 at death
            ctx.globalAlpha = t;
            ctx.fillStyle = `rgb(${p.color[0]},${p.color[1]},${p.color[2]})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 2 + 4 * t, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    }
}
```

Notice that nothing in this code knows it is fire. The same architecture, with different parameters, becomes rain (downward velocity, long life, blue colour), smoke (slow rise, growing radius, grey fading to black), explosion (outward radial velocity, short life, bright colour fading to dark). The *pattern* of birth-life-death is universal; the *parameters* change per effect. A single Emitter class, well-written, can be the skeleton of every particle effect in your game.

One performance note: **object allocation is slow in a hot loop**. Creating a thousand new `Particle` objects every second will cause the JavaScript garbage collector to hitch, and your frame rate will stutter. The professional solution is a **particle pool** — pre-allocate an array of, say, two thousand particle slots at startup, mark each one as alive or dead, and reuse dead slots for new particles instead of creating new objects. The Atlantic does not allocate droplets; it recycles the same water endlessly. Your particle system should do the same.

Particles give you the small, seen world. But a game without sound is a silent film, and silent film is a ghost. The next letter descends from the eye to the ear.

### Letter 26: On Audio and the Talking Drum

You can build a complete game that is never heard — a puzzler with silent pieces, a chess clone with silent moves — and it will be playable. But it will not be alive. Sound is half of the information a game delivers. The crunch of a footstep tells you the surface is gravel. The rising whine of an engine tells you the car is about to overheat. The high, clear ring of a collected coin is the single sharpest feedback signal in the history of game design. When a good game removes sound, the player feels, within seconds, that something has died. When a silent prototype gains its first audio cue, the prototype becomes a game.

What is sound, mathematically? It is a **waveform** — a continuous function of time whose value represents the air pressure at the listener's ear. When the pressure rises and falls, the eardrum vibrates, and the brain interprets the vibration as noise, tone, or music. The computer cannot store a continuous function, so it samples it: it measures the pressure forty-four thousand one hundred times per second and stores the measurements as a long list of numbers. This rate, **44.1 kHz**, is the standard of the audio CD and the default of the Web Audio API, chosen because the human ear tops out around 20 kHz and the Nyquist theorem requires that you sample at more than twice the highest frequency you wish to reproduce. Your phone's speakers take that list of numbers and drive a small electromagnet that pushes a paper cone back and forth in synchrony with them. The cone pushes the air. The air pushes your ear. Your ear pushes a nerve. The nerve tells your mind *coin*.

Mixing two sounds together is simply adding their waveforms, sample by sample. If the music is playing a waveform `M[i]` and a coin collects and contributes a waveform `C[i]`, the speaker receives `M[i] + C[i]`, clipped to the permissible range. Panning a sound left or right is sending a bigger fraction of its waveform to the left speaker and a smaller fraction to the right, or vice versa. Fading distance is multiplying the whole waveform by a number that falls from one (close) to zero (far). Every audio effect in every game you have ever heard is composed of these few operations — add, scale, delay, filter — applied to lists of numbers at forty-four thousand numbers per second.

The African isomorphism for all of this — and for the more sophisticated art of **procedural sound**, which synthesises waveforms at runtime instead of sampling them from a file — is the *talking drum*. The *dùndún* of the Yoruba, the *donno* of the Akan, the *tama* of the Wolof, the *kalangu* of the Hausa. Every one of these is an hourglass-shaped drum with two heads, strung together by leather thongs running down the body. The drummer holds the drum tucked beneath his upper arm. When he squeezes his arm, the thongs tighten, the heads stretch, and the pitch of the drum rises. When he relaxes, the pitch falls. And the Yoruba and Akan and Wolof and Hausa languages are **tonal** — the meaning of a word depends on the pitch pattern across its syllables. So the drummer, by striking the drum in rhythm and continuously varying its pitch with his arm, can reproduce the tonal contour of speech itself. The drum *talks*. Across the savannah, messages can be drummed from one village to the next at the speed of sound.

Consider what the drummer is doing, in the language of digital audio. He is running a **real-time oscillator** (the vibrating membrane) whose **frequency is modulated** by a **continuous envelope** (the squeeze of his arm). Each strike of the beater is a **trigger**. The attack of each syllable is shaped by the force of the strike. This is a Yamaha DX7 implemented in goat-skin and leather. The *dùndún* is the most sophisticated procedural-audio synthesiser ever built by human hands, and it predates transistors by at least seven hundred years. When you write your first oscillator in the Web Audio API, you are writing the digital cousin of an instrument whose mathematics the Yoruba had mastered before Descartes drew his first axis.

Here is the Web Audio API at its smallest. This four-line program plays a pure 440 Hz tone — the A above middle C, the concert-pitch note:

```javascript
// One-time setup (must be triggered by a user gesture: tap, click, keydown)
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playCoinBeep() {
    const osc  = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'square';                  // square wave — bright, 8-bit flavour
    osc.frequency.value = 880;            // A5
    gain.gain.value = 0.15;

    // A talking-drum pitch envelope: slide down over 80 ms
    osc.frequency.exponentialRampToValueAtTime(
        440, audioCtx.currentTime + 0.08);

    // A quick fade-out so the note doesn't click at the end
    gain.gain.exponentialRampToValueAtTime(
        0.001, audioCtx.currentTime + 0.15);

    osc.connect(gain).connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.2);
}

// Call playCoinBeep() whenever the hero picks up a coin
```

Read the middle of the function: `exponentialRampToValueAtTime(440, ...)`. This is the line that turns a dead beep into a living sound. It tells the oscillator to slide its frequency from 880 Hz down to 440 Hz over eighty milliseconds — a little descending whistle. This is *exactly* what the *dùndún* drummer does with his arm when he drops the pitch to end a phrase. Without the ramp, the beep sounds like a doorbell. With it, the beep sounds like *reward*. Game feel is, to a surprising degree, the art of applying pitch envelopes to short tones.

One more thing. Browsers refuse to play audio until the user has interacted with the page at least once — a defence against websites that blare adverts the moment they load. This means you must create the `AudioContext` inside a click or tap handler, not at page load. It is a small inconvenience that saves the world from a great deal of annoyance, and it is worth every line of code it costs you. Your players' ears are a trust. With sound in place, the game now touches the senses from both sides, eye and ear. What remains is to let the player touch back — which is the art of the interface.

### Letter 27: On UI and the Dashboard of the Small Universe

A game is a conversation. The simulation speaks to the player through pixels and sound; the player speaks back through taps, swipes, and presses. The machinery through which the conversation flows — the score in the corner, the pause button, the inventory panel, the dialogue modal, the settings menu — is called the **user interface**, abbreviated **UI**, and its small, active regions on top of the game world are called the **heads-up display**, or **HUD**. Everything else in this treatise is about the world the game simulates. UI is about the window through which the player sees the world and the handles by which the player moves it.

UI is often treated as the easy part of game development. It is not. It is among the hardest, for a reason that matters very much in Africa: the UI of your game must be readable on a five-inch phone in the direct noon sunlight of Lagos, by a player wearing gloves at a market stall in Dakar, operated by a single calloused thumb moving across a cracked screen protector in a *matatu* bouncing down a potholed road in Nairobi. The flagship design conventions of Silicon Valley — thin grey text on white, tiny icons, pastel hover states — are designed for climate-controlled offices and brand-new laptops. They fail here. A UI that works for the African builder must be *louder* than a UI that works for a San Francisco reviewer. Louder means: bigger, higher-contrast, more redundant, more forgiving.

Three rules govern touch UI, and every good game on mobile obeys them. First, **touch targets must be at least forty-four pixels square** — this is the minimum size, in logical pixels, at which the average adult thumb can reliably hit a target without missing. This is not a preference; it is the approximate width of a human fingertip when pressed against glass. Smaller than this and your players will miss, curse, and quit. Second, **contrast must be at least 4.5:1** between text and background — the ratio the Web Content Accessibility Guidelines declare legible in sunlight by the average eye. Grey-on-grey is pretty in a design studio; it is invisible on a phone in direct sun. Third, **reduce motion and animation for players who need it** — some players get motion-sick, some have epilepsy sensitive to flashes, some simply hate jitter. The `prefers-reduced-motion` media query lets the browser tell you this and you must listen.

The isomorphism is the **dashboard of the *trotro***, the shared minibus of Ghana (in Nigeria, the *danfo*; in Kenya, the *matatu*; in Senegal, the *car rapide*). Open the driver's door of any *trotro* and look at what is in front of him. The speedometer is large, centred, and rimmed in bright paint. The fuel gauge is nearly as large, beside it. The gear stick and handbrake are within easy reach, oversized from years of use. Around the gauges, wedged into the dashboard with tape and wire, are the things the driver added himself: a small radio, a rosary or a Qur'anic charm, a photograph of his children, a horn button the factory never intended. Every one of these objects is exactly where the driver's hand falls when it needs to. Nothing is hidden in a menu. Nothing requires two actions. A glance at the dashboard — one glance, not a study — tells the driver speed, fuel, gear, and song. This is the UI standard you must meet. Your HUD is a *trotro* dashboard: oversized, redundant, arranged so the eye reads it in a single sweep at sixty kilometres an hour on a bad road.

Or, in a deeper register, take the *Kongo nkisi* — the wooden ritual figure of the Bakongo people, studded from head to foot with iron nails, each nail driven in by a petitioner to mark a vow, a grievance, a prayer. The priest, reading the *nkisi*, sees at a glance which petitions are active and which have been resolved. Each nail is an "active state," a flag, a pending item. The figure is a **status display** for an entire community's unfinished business. Your HUD does the same for an entire game world's unfinished business: how many lives remain, how much mana, how close to the next level, how many quests are active. Each icon is a nail. The player's eye reads the whole *nkisi* in a single glance.

A HUD button on a canvas-based game is surprisingly simple to build by hand — no HTML, no React, no framework. It is a rectangle, a label, and a hit test:

```javascript
class Button {
    constructor(x, y, w, h, label, onClick) {
        this.x = x; this.y = y; this.w = w; this.h = h;
        this.label = label;
        this.onClick = onClick;
        this.hover = false;
        this.pressed = false;
    }

    contains(px, py) {
        return px >= this.x && px <= this.x + this.w
            && py >= this.y && py <= this.y + this.h;
    }

    render(ctx) {
        // Background — darken when pressed, lighten when hovered
        ctx.fillStyle = this.pressed ? '#c44a2a'
                      : this.hover   ? '#ff7a4a'
                      : '#ec5d3a';
        ctx.fillRect(this.x, this.y, this.w, this.h);

        // Label — big, bold, high contrast
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.label,
                     this.x + this.w / 2,
                     this.y + this.h / 2);
    }
}

// Wiring it up
const startBtn = new Button(40, 500, 240, 64, 'START', () => startGame());

canvas.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect();
    startBtn.hover = startBtn.contains(e.clientX - r.left, e.clientY - r.top);
});

canvas.addEventListener('pointerdown', (e) => {
    const r = canvas.getBoundingClientRect();
    if (startBtn.contains(e.clientX - r.left, e.clientY - r.top)) {
        startBtn.pressed = true;
    }
});

canvas.addEventListener('pointerup', (e) => {
    const r = canvas.getBoundingClientRect();
    if (startBtn.pressed && startBtn.contains(e.clientX - r.left, e.clientY - r.top)) {
        startBtn.onClick();
    }
    startBtn.pressed = false;
});
```

Notice the width of the button: 240 by 64 logical pixels. That is a *trotro* dashboard gauge, not a Silicon Valley micro-control. Notice the font: twenty-pixel bold, white on a saturated orange. That is readable in noon sunlight in Kaduna. Notice the three visual states — idle, hover, pressed — that confirm to the player's eye that the touch was received. In a world where the nerves of the hand and the pixels of the screen are separated by glass, plastic, and dust, feedback is not optional; feedback is the only proof the player has that the machine heard.

The `pointer` events (`pointerdown`, `pointermove`, `pointerup`) are worth choosing over the older `mouse` and `touch` events because they unify both input styles with one interface — your button works for a thumb on a phone, a stylus on a tablet, and a mouse on a laptop, with no branching code. Modern browsers everywhere support them. Use them always.

Good UI also means knowing what *not* to show. Hide the pause button during cutscenes. Hide the score when the score does not matter. Let the game world breathe. The *nkisi* is powerful because it is covered only in the nails the community has driven; nails that do not correspond to an active petition would dilute the rest. Your HUD is powerful because each element on it corresponds to something the player actually needs right now.

We have now completed Part IV. You understand the atoms (pixels), the molecules (sprites), the parallel painters (shaders), the play of light across a surface (lighting), the swarming small (particles), the vibrating air (audio), and the dashboard through which the player commands the whole (UI). The game has become a thing of senses and surfaces — something the body can meet. But a body requires *laws* to meet things by: the invisible rules of gravity, momentum, friction, and restitution, without which no dropped object falls, no thrown stone arcs, no boxing glove hits. In Part V we turn to physics — not the physics of textbooks, which is correct, but the physics of games, which is the strange and wonderful art of being *wrong* in exactly the ways that feel right.

---

## Part V: The Physics That Convince

### Letter 28: On Gravity, Drag, and the Falling Mango

Stand beneath a mango tree in the orchards of Wenchi, in the Brong-Ahafo region of Ghana, and wait. Sooner or later a ripe fruit will detach from its stem and fall. If you watch carefully — and a patient child in Wenchi has watched this a thousand times — you will notice that the mango does not fall at a constant speed. It begins slowly, almost gently, as if reluctant to leave the branch, and then it accelerates, and by the time it strikes the earth with that dull, satisfying thump, it is moving much faster than it began. Newton, writing in a Lincolnshire orchard three centuries ago, gave the name **gravity** to whatever invisible hand was pulling the fruit, and he gave its magnitude a number: about 9.81 metres per second, added to the fruit's downward velocity each second it falls. Not a fixed speed, then, but a fixed *acceleration*. The longer the fruit falls, the faster it falls. This is the first law of every game world that wishes to be believed.

In code, gravity is almost embarrassingly simple. We keep two numbers for each falling object — its **position** (where it is) and its **velocity** (how fast it is moving, and in which direction) — and each frame we perform two small additions. First, we increase the velocity by gravity times the time step. Second, we increase the position by the velocity times the time step. That is the whole of it. A single constant, two additions, and suddenly mangos fall, arrows arc, coins leap and tumble back to the coffer.

```javascript
const GRAVITY = 980;  // pixels per second squared — 9.8 m/s² at 100 px/m
const DRAG = 0.99;    // velocity retained per frame (air resistance)

let mango = { x: 200, y: 50, vx: 0, vy: 0 };

function updateMango(dt) {
    // 1. Gravity adds to velocity
    mango.vy += GRAVITY * dt;

    // 2. Drag removes a little each frame
    mango.vx *= DRAG;
    mango.vy *= DRAG;

    // 3. Velocity adds to position
    mango.x += mango.vx * dt;
    mango.y += mango.vy * dt;
}
```

You will notice that we are integrating Newton's equations by the crudest method known to mathematics. We are pretending that within a single frame the velocity is constant, and within the next frame it is also constant but slightly larger, and so on. This is called **Euler integration** (named for the same Euler whose ghost presides over this entire treatise, though he would scowl at the liberties we take with his name). It has sins. For a purely gravitational fall over a short time it is nearly exact; for orbits, for tight springs, for long simulations, it drifts and accumulates error. In the next letter, when we meet springs that must not explode, we shall meet its better-behaved cousins. For now it is more than adequate, because a player watching a coin fall for half a second cannot tell the difference between a mathematically perfect trajectory and a slightly wrong one. The eye does not integrate; the eye sees mango, falling.

The second phenomenon to attend to is **drag**, also called air resistance. A falling mango does not accelerate forever. If it did, by the time it reached the ground from a tall enough tree it would be moving faster than a bullet, and orchards would be battlegrounds. What saves us is that the air pushes back against the falling fruit with a force proportional to its speed — faster the mango, harder the push. Eventually the upward push of the air exactly cancels the downward pull of gravity, and the mango stops accelerating. It has reached **terminal velocity**. A ripe mango's terminal velocity in still air is about fifteen metres per second; a skydiver's, about fifty; a feather's, less than one. In code, we model this not by computing forces at all but by a single tiny multiplication: each frame, we multiply the velocity by a number just less than one — say 0.99, or 0.995, or 0.999 depending on how thick we wish the air to be. The slower the number, the thicker the air. Terminal velocity emerges by itself: the point at which `gravity * dt` added equals `(1 - DRAG)` of velocity lost. No player will ever thank you for this multiplication, but every player will feel wrong without it.

Consider now the *Kalahari* sand pouring through a closed fist. Each grain, in the brief moment between leaving the fist and joining the pile below, is a tiny mango in free fall, accelerated by gravity and resisted by the air. Because the grains are light and the fall is short, they reach terminal velocity almost instantly — which is why sand appears to fall at a steady speed rather than accelerating visibly. Mango and sand are the same physics tuned by different parameters. One constant, one multiplication, and you can simulate anything from a boulder crashing down a cliff to a snowflake drifting through a window.

There is a pleasant lesson hidden in all this, which is that a great deal of what feels true in games is produced by very little mathematics. The whole of gravity, in our code, is one addition. The whole of air resistance is one multiplication. Between them they give us falling fruit, arcing arrows, jumping characters, settling dust, and the unmistakable weight that distinguishes a world from a flat screen. In the next letter we shall meet a slightly richer object — the spring — and with it we shall discover how to make a camera follow a character, how to make a menu bounce as it opens, and how to turn the rhythm of pounding *fufu* into the most useful piece of code in interactive design.

### Letter 29: On Springs, Constraints, and the Pestle and Mortar

In every Yoruba courtyard at evening, before the short tropical twilight gives way to night, one may hear a sound that has not changed in a thousand years: the rhythmic thud, thud, thud of the *odo* — the pestle and mortar — pounding yam into *fufu*. A woman stands above a deep wooden mortar holding a long pestle in both hands. She lifts the pestle high, lets it fall under its own weight, pushes it down the last handspan with the strength of her arms, and then the pestle rebounds — driven back up partly by the springiness of the yam, partly by the compression of her own arms, partly by the elastic pull of her shoulders and back. She does not consciously lift it; the return is half automatic, a recoil built into the system. The pestle wants to go back up. Then it falls again, and again, and again, with a rhythm so steady you could set a metronome by it.

This is the most useful object in all of interactive design, and it has a name: the **spring-mass-damper system**. Robert Hooke, examining real metal springs in 1676, observed that the force a spring exerts is proportional to how far it has been stretched or compressed from its resting length. A spring stretched twice as far pulls twice as hard. A spring compressed three times as much pushes three times as hard. This is **Hooke's law**, and it is so simple and so useful that physicists almost blush when they teach it. In symbols: `F = -k * x`, where `x` is the displacement from rest and `k` is the stiffness. The minus sign says the force always points back toward rest — the spring wants to return home.

On its own, a spring is an annoying citizen. Stretch it and let go, and it will overshoot the resting position, compress, overshoot the other way, extend, and continue oscillating forever. Real springs, of course, do not do this — they gradually lose energy to heat and air and come to rest. We model this loss with a second term called **damping**, which is a force proportional to the velocity and opposite to it. The faster the spring moves, the harder the damper pulls back. The whole equation becomes: `force = -k * (position - rest) - c * velocity`. Two numbers — stiffness and damping — and you have a complete spring.

```javascript
// Smoothly chase a target position with a spring-damper
function springUpdate(obj, target, dt) {
    const STIFFNESS = 120;   // k — how eagerly it pulls toward target
    const DAMPING = 14;      // c — how quickly oscillation dies

    const displacement = obj.x - target;
    const force = -STIFFNESS * displacement - DAMPING * obj.vx;

    obj.vx += force * dt;       // integrate force into velocity
    obj.x  += obj.vx * dt;      // integrate velocity into position
}

// Usage: each frame, make the camera chase the player
springUpdate(camera, player.x, dt);
```

Read the code once more and notice what it does. It does not jump to the target. It does not linearly interpolate toward the target. It *chases* the target with inertia — overshooting slightly if the target moves abruptly, settling gently if the target rests, lagging behind during fast movement and then catching up. This is exactly how the pestle behaves above the mortar, exactly how a praise-singer's body sways behind the rhythm of the drum, exactly how a hand reaching for a cup overshoots and then corrects. It is the signature of life. A target that is pursued without a spring feels dead; a target pursued with a well-tuned spring feels alive.

The first place every serious game developer discovers this is in **camera follow**. A beginner's camera snaps rigidly to the player's position — as the player moves, the camera moves the same amount, instantly. The result is nauseating; the player's eyes and inner ear disagree, and the game feels glued to the face. The cure is a spring. Instead of snapping, the camera's position is updated each frame by a spring-damper pointed at the player's position. When the player jumps, the camera lags a fraction of a second behind and catches up smoothly. When the player lands, the camera settles with a barely perceptible bounce. The player's brain interprets this as *weight* — the camera feels heavy, and therefore the world feels heavy, and therefore the game feels real. Every great platformer in history, from *Super Mario World* to *Celeste* to *Hollow Knight*, uses a spring camera. It is the single cheapest upgrade from amateur to professional you can apply to any game.

Springs do much more than cameras. They animate menus that bounce open. They make ropes swing. They simulate cloth — a sheet of virtual fabric is simply a grid of point masses connected by springs. They model soft bodies — a blob of jelly is a cluster of masses held together by springs stiff enough to preserve shape but soft enough to wobble. In a certain sense, nearly all of the visual charm of a modern game is springs and damping, applied at different scales. The stiffer the spring, the more rigid the object; the softer the spring, the more rubbery; the heavier the damping, the more sluggish; the lighter the damping, the more jittery. Two numbers, and you have built a universe of textures.

The *odo* in the courtyard teaches the same lesson with flour and sweat. The woman who pounds *fufu* well does not fight the pestle; she cooperates with its spring. She lets gravity and the recoil do half her work. Her arm is the stiffness; the yam is the damping; the mortar is the rest position; the rhythm is the natural frequency of the whole system. In the next letter we shall watch what happens when two masses meet — when the pestle strikes the yam, when one seed in *Ayo* falls into another, when a calabash dropped on dry earth bounces three times and rests. That is the physics of **collision**, and with it our world will gain its first hint of consequence.

### Letter 30: On Rigid Bodies and the Bouncing Calabash

Drop a dried calabash from shoulder height onto the hard red earth of a Hausa compound and watch what happens. The calabash strikes the ground with a hollow *pop*, bounces upward perhaps half as high as it was dropped, pauses briefly at the top of its small bounce, falls again, bounces again — this time only a third as high as before — falls, bounces, a weaker bounce each time, until after four or five attempts it comes to rest, rolling a little and then lying still. A child watching this notices immediately that each bounce is smaller than the last. No bounce restores all the height of the previous drop. Energy is leaking out of the calabash on every impact — partly into heat, partly into the sound of the pop, partly into a tiny elastic deformation of the shell that does not perfectly rebound. The world is quietly draining the calabash of its ability to jump.

Newton codified this with two principles. The first is **conservation of momentum**: when two bodies collide, the total momentum (mass times velocity) before the collision equals the total momentum after. The second is **restitution**: the ratio of the speed after the collision to the speed before is a number between zero and one, called the **coefficient of restitution**, and written `e`. If `e = 1`, the collision is perfectly elastic — no energy lost, the calabash would bounce to its original height forever. If `e = 0`, it is perfectly inelastic — the calabash sticks to the ground on first contact, a dead thud with no bounce at all. Real calabashes live somewhere in between, typically `e ≈ 0.5`: each bounce retains half the downward speed as upward speed.

For the simplest case of a ball bouncing against a static floor, the code is almost trivial. Detect the moment the ball's position crosses the floor, reverse the vertical velocity, and multiply by the restitution.

```javascript
const RESTITUTION = 0.5;    // e — 1 is superball, 0 is wet clay
const FLOOR_Y = 600;

function updateCalabash(c, dt) {
    c.vy += GRAVITY * dt;
    c.y  += c.vy * dt;

    if (c.y > FLOOR_Y) {
        c.y = FLOOR_Y;              // don't sink through the floor
        c.vy = -c.vy * RESTITUTION; // bounce, losing some energy
    }
}

// A one-dimensional elastic collision between two moving masses
function collide1D(a, b) {
    const m1 = a.mass, m2 = b.mass;
    const v1 = a.vx,  v2 = b.vx;
    a.vx = ((m1 - m2) * v1 + 2 * m2 * v2) / (m1 + m2);
    b.vx = ((m2 - m1) * v2 + 2 * m1 * v1) / (m1 + m2);
}
```

The second function above deserves attention. It is the one-dimensional elastic collision formula, and it tells you how the velocities of two bodies of different masses should exchange when they meet head-on. You can verify a beautiful special case by hand: if the two masses are equal, the formula collapses to `a.vx = v2` and `b.vx = v1` — the velocities simply swap. This is exactly what you observe on a Newton's cradle, the famous desk toy of five steel balls in a row: pull one aside and release, and the ball on the far end leaps out with the original speed while the rest remain still. The middle balls do nothing because the velocities pass through them as if they were transparent. The mathematics knows this; we merely write it down.

Now think of the *Ayo* board, with its carved cups and its polished palm kernels. When the player sows a handful of seeds, they fly along the row and drop one by one into successive cups. Each landing is a tiny inelastic collision — the seed hits the wooden cup, loses nearly all its vertical velocity to the heavy unmoving board, and comes to rest. The restitution coefficient of a palm kernel against dry wood is small, perhaps 0.15, which is why the seeds thud rather than bounce. If the cups were made of bronze, you would hear a very different game — the seeds would rattle like bells, each one bouncing twice before settling. Material determines restitution; restitution determines feel; feel determines the game.

Writing the full mathematics of rigid body dynamics from scratch is possible but painful. Once you move beyond balls on flat floors — once you wish to rotate bodies, to handle friction properly, to detect collisions between arbitrary polygons, to simulate chains and hinges and ragdolls — the bookkeeping grows immense. Entire careers have been spent perfecting it. Fortunately, other careers have produced free gifts: **Box2D**, the C++ library written by Erin Catto that powers *Angry Birds*, *Crayon Physics Deluxe*, and thousands more. **Chipmunk**, its slightly lighter cousin. **Rapier**, a modern Rust physics engine that compiles beautifully to WebAssembly and runs in any browser. Any of these will give you rigid bodies, joints, motors, friction, sleeping objects, and continuous collision detection for fast-moving projectiles, in exchange for learning a small API. For most games, you should not write a physics engine; you should use one.

But you should still understand what it is doing. The best games cheat their physics engines — turn off rotation on the player character so it does not fall over, reduce friction on walls so the player can slide, crank up restitution on enemies so they bounce away dramatically when struck. These tunings are choices, not accidents, and they require you to know what restitution and friction and mass mean. The *calabash* has taught you the vocabulary; the engine provides the grammar. In the next letter we shall meet a much deeper lesson: that the physics a player experiences is not the physics the engine computes, because between the two there is a designer whose job is forgiveness.

### Letter 31: On Coyote Time and the Forgiveness of the Designer

Here is the most important letter in this entire part of the book, and it is a letter about a lie.

Imagine you are playing a platformer. Your character runs along a ledge. You see the edge approaching and, with the reflexes of a practised player, you press the jump button at what feels like the exact right moment. But the screen shows your character toppling over the edge into the chasm below. You die. Confused, you try again. Same result. You begin to suspect the game has betrayed you — that its physics are somehow crueler than your hand. You are right. And in a badly made game, you would be right to quit. In a well-made game, however, the designer has anticipated this exact moment and quietly arranged a conspiracy on your behalf. The game has been lying to you all along, and the lie is the reason you still love it.

The truth is that between your brain's decision to jump and your thumb's actual press of the button, between forty and eighty milliseconds elapse. Between the press of the button and the game's next frame, another sixteen milliseconds. Between the frame and the screen's refresh, another few. The player's reaction time and the machine's latency together conspire to ensure that when the player *believes* they pressed jump before leaving the ledge, they very often pressed it a hair after. A simulation that is strictly correct will therefore mark a great many jumps as failed that the player experienced as successful. The player's memory and the machine's memory will disagree about what happened, and the player will always, always blame the machine — because the player's memory is the thing the player lives inside.

The cure is a lie called **coyote time**, named after the Wile E. Coyote cartoons in which the hapless coyote runs off a cliff and hangs in the air for a moment of dignity before noticing and falling. In coyote time, the game grants the player a brief grace period — typically between 60 and 150 milliseconds — after walking off a ledge, during which a jump press still registers as a valid jump from the ledge. The player, having pressed jump a few milliseconds after the edge, feels their character leap cleanly into the air and marvels at the tight controls. The game, internally, is running a small mercy: it records the time of leaving the ground, and when the jump button is pressed, it checks whether that time was less than 100 milliseconds ago, and if so, it counts the character as if still grounded.

```javascript
const COYOTE_TIME = 0.10;   // seconds of grace after leaving ground
const JUMP_BUFFER = 0.10;   // seconds of grace before touching ground

let lastGroundedAt = -Infinity;
let lastJumpPressedAt = -Infinity;

function update(now, dt, input, player) {
    // Record moments of truth
    if (player.onGround) lastGroundedAt = now;
    if (input.jumpPressedThisFrame) lastJumpPressedAt = now;

    const inCoyoteWindow = (now - lastGroundedAt) < COYOTE_TIME;
    const recentlyTriedToJump = (now - lastJumpPressedAt) < JUMP_BUFFER;

    if (inCoyoteWindow && recentlyTriedToJump) {
        player.vy = -JUMP_STRENGTH;
        lastJumpPressedAt = -Infinity;  // consume the input
        lastGroundedAt    = -Infinity;  // consume the grace
    }

    // ... gravity, movement, collisions ...
}
```

Notice that the code does not simply ask *"are you on the ground?"* and *"did you press jump this frame?"*. Both of those questions are too cruel. It asks *"were you on the ground recently?"* and *"did you press jump recently?"* — and only if both answers are yes does it fire the jump. The first half of this pair is coyote time. The second half is its twin, **jump buffering**: if the player presses jump in the air, 80 milliseconds before landing, the game remembers the press, and the moment their feet touch down it fires the jump automatically. Without jump buffering, the player lands, pauses for a confused instant, and then tries again; with jump buffering, the player lands and leaps in a single fluid motion that feels like choreography. Neither hack is a large amount of code. Both are the difference between a game that frustrates and a game that sings.

The African isomorphism is the *elder's mercy*, and once you see it you will never play a platformer the same way again. In a Yoruba village court, a young man stands accused of a small theft. The strict letter of the customary law would convict him and impose a fine he cannot pay, and his family would suffer. But the elder hearing the case pauses. He considers that the young man's father was recently ill; that the harvest was poor; that the accused returned the stolen goods without being asked. He rules with a small grace — a warning, a period of communal labour, a reconciliation meal with the aggrieved party. The strict law is bent by a hundred milliseconds of wisdom, and the result is a justice the community can live with. The young man does not know he was almost convicted. He knows only that the court was fair. This is exactly coyote time. The law is the simulation; the mercy is the forgiveness; the community's sense of fairness is the player's sense of feel.

Or picture the *trader's discount* at Onitsha market. A customer hesitates over a pair of sandals, clearly wanting them but reluctant at the price. The trader, without being asked, drops the price by a hundred naira. The discount costs the trader almost nothing; it wins the sale and the customer's return visits for years. The customer walks away feeling they struck a shrewd bargain. They did not; the trader gave them the margin. But the perception of fairness — the sense of being treated generously — is what the trader has built, and perception is the whole of commerce. A game that gives the player coyote time is a trader that drops the price.

Let us now say the deeper principle out loud, because it is the axis upon which this entire part of the book turns: **the player's perception of fairness is more important than the simulation's correctness**. A strictly correct simulation will feel cruel. A slightly forgiving simulation will feel honest. Your job as a designer is not to build a world that is mathematically true; it is to build a world that the player can *trust*. Every great game is full of quiet lies told on the player's behalf — widened hit-boxes on enemies, narrowed hit-boxes on the player, extra ammunition in the last magazine, slightly downhill cover fire, difficulty that secretly eases when the player keeps dying. None of these are honest. All of them are merciful. They exist because the players who did not complain were the players who did not notice, and the players who did not notice were the players who were having fun. In the next letter we shall meet the second great category of mercy, which is not about the physics of the world but about the feel of every action within it. We shall meet **juice**.

### Letter 32: On Juice and the Punch That Lands

When a Yoruba chief enters the compound on a festival day, a remarkable amount of noise happens around him for a man who is only walking. The *gangan* drums thunder in syncopation; the *shekere* gourds rattle; the praise-singer calls out his lineage in a voice half sung and half shouted; the dancers around him leap as if lifted; children scatter and laugh; an attendant waves a horsetail whisk through the air as though conducting weather. The chief himself is doing nothing unusual. He is placing one foot in front of the other at an ordinary walking pace. And yet the air thickens around him; each step becomes an event; the compound seems to tilt toward him. Strip away the drums, the dancers, the praise-singer, the whisk, and the chief is merely a man walking. Add them back, and he is the king of the world.

This thickening of ordinary events into extraordinary ones has a name in game design, and the name is **juice**. The term was made famous by a 2012 talk at the Nordic Game Jam titled "Juice it or lose it", delivered by Martin Jonasson and Petri Purho, in which the two developers took a bare, mechanically correct breakout game and, in fifteen minutes of live coding, layered on screen shake, particles, bouncy animation, stretching paddles, squashing balls, colour flashes, and sound effects — at the end of which the game felt ten times better without a single change to its underlying mechanics. The Dutch studio Vlambeer, creators of *Nuclear Throne* and *Luftrausers*, built an entire aesthetic around this principle: every shot of their weapons is accompanied by a controller rumble, a muzzle flash, a plume of casings, a kick of recoil that pushes the player backward, a cloud of smoke, a blood spray on impact, a screen shake whose magnitude is tuned to the caliber. The bullet's actual damage number is not what the player feels. What they feel is the *occasion* the game made of firing.

Screen shake is the most famous juice of all, and the most misunderstood. Done badly it is nausea. Done well it is the difference between a bullet that tickles and a bullet that lands. The trick is that the shake must be brief — forty to eighty milliseconds — and must decay quickly. You simply add a small random offset to the camera position for a few frames after the impact, scaled by the severity of the impact.

```javascript
let shakeAmount = 0;
let shakeDecay = 0;

function triggerShake(magnitude, duration) {
    shakeAmount = Math.max(shakeAmount, magnitude);
    shakeDecay  = magnitude / duration;
}

function getCameraOffset(dt) {
    if (shakeAmount <= 0) return { x: 0, y: 0 };
    shakeAmount = Math.max(0, shakeAmount - shakeDecay * dt);
    return {
        x: (Math.random() - 0.5) * 2 * shakeAmount,
        y: (Math.random() - 0.5) * 2 * shakeAmount,
    };
}

// When a bullet hits an enemy:
triggerShake(8, 0.12);   // 8 pixels, 120 ms
```

Now let us meet shake's stranger and more powerful cousin: **hit-stop**, also called **hit freeze** or **hit pause**. When a sword in *Monster Hunter* connects with a monster, the entire game world freezes for a single frame — perhaps sixteen milliseconds — before resuming. The animation pauses. The monster's movement halts. The player's swing halts. For one sixtieth of a second, nothing advances. And then everything does. The effect is almost invisible to the conscious eye but unmistakable to the feel: the blow lands with *weight*. Without hit-stop, a sword stroke is a smooth arc. With hit-stop, a sword stroke is a smooth arc *interrupted* by contact — and the interruption is exactly what the player's body reads as mass. A boxer's glove stops the air for an instant at contact; so must a sword.

```javascript
let hitStopFrames = 0;

function onEnemyHit(severity) {
    hitStopFrames = Math.max(hitStopFrames, severity); // e.g. 3–6 frames
    triggerShake(6, 0.10);
    spawnParticles(enemy.x, enemy.y, 12);
    flashWhite(enemy, 0.08);
    playSound('impact-meaty');
}

function gameLoop(dt) {
    if (hitStopFrames > 0) {
        hitStopFrames--;
        render();               // still draw, but do not advance simulation
        return;
    }
    update(dt);
    render();
}
```

Study the combination in that code, because it is the recipe for the punch that lands. The blow happens. Immediately: a screen shake is fired, a shower of particles is spawned, the struck enemy is flashed white for a tenth of a second, and a meaty impact sound plays. Then the entire simulation pauses for three to six frames. Then the world resumes and the particles drift, the enemy tumbles, the flash fades, the shake decays. In perhaps a hundred and twenty milliseconds — less time than it takes to say *"oh"* — the player has received a coordinated assault of sight, sound, and physics that marks this one contact as an event. The damage number in the variable `enemy.hp` could be ten or ten thousand; the player's experience of landing that hit is the same. You have given the strike an occasion.

None of this — not the shake, not the stop, not the flash, not the particles, not the sound — changes the simulation in any meaningful way. The enemy still loses the same hit points. The physics are still computed the same way. The simulation is, if anything, slightly degraded by the three frames of hit-stop. But the player will rate the combat ten times better, and will say things about it that have no mechanical basis — *"the weapons feel meaty"*, *"the hits have impact"*, *"the combat is satisfying"*. These words are the player reporting the effects of the juice. The juice is to the simulation what the *gangan* drums are to the chief's footstep: it turns an act into an occasion. In the next and final letter of this part, we shall meet one more physical reality that refuses to be ignored — the physics of information itself, travelling across an imperfect world at a finite speed. We shall meet **networking**, and with it the last great lie a well-made game tells its players.

### Letter 33: On Networking and the Drunken Messenger

In the kingdoms of pre-colonial West Africa, news travelled by runner. When the Oba of Benin needed to send a message to a vassal town three days' walk away, a man with strong legs and a good memory was dispatched with the message memorised word for word. The runner departed at dawn. He arrived, if all went well, on the evening of the third day. The message he delivered was three days old. In those three days, the situation at both ends might have shifted — an enemy might have moved, a crop might have failed, a rival might have died. The Oba, dispatching the runner, could not know what the vassal would be facing when the message arrived; the vassal, receiving it, could not know what the Oba was facing now. The whole art of African statecraft, at distance, was the art of writing messages that would still be true when they arrived. One reasoned forward from the present into the probable future and wrote for that future rather than for the present. One made allowances for the delay.

This is the fundamental problem of every multiplayer game, and the runner's dilemma is every networked game's dilemma. When you and a friend play a fighting game from opposite sides of the Atlantic, your inputs take between 80 and 200 milliseconds to reach their server and between 80 and 200 milliseconds to come back — a round trip of sometimes half a second. Half a second is an eternity in a game that runs at sixty frames per second. In half a second you can win or lose a round, miss a jump, fire a shot that no longer points at anything. A naive multiplayer architecture — called **lockstep**, in which every client waits for every other client's input before advancing a single frame — is technically correct and experientially unbearable. Every press of a button lags by half a second. Every movement feels like wading through honey. No modern action game is built this way, because no modern player would tolerate it.

The solution every serious multiplayer game uses is a conspiracy of four lies, and the lies have names. The first is **client-side prediction**: when you press the jump button, your own game does not wait to hear from the server. It jumps you immediately, on the assumption that the server will agree. Ninety-nine times out of a hundred, the server will agree, because nothing unusual has happened; the prediction was correct. Your experience is instantaneous response. The second lie is **server reconciliation**: on the rare occasions when the server disagrees — because another player hit you on the way up, or a wall appeared where none was — the server sends a correction, and your client smoothly interpolates from where it thought you were to where you really are, over a few frames, so the correction is barely visible. The third lie is **interpolation**: other players' positions, as they appear on your screen, are always about a hundred milliseconds in the past, because your client is drawing them between known positions rather than guessing forward. This small deliberate lag makes their motion perfectly smooth even when network packets arrive jagged. The fourth lie, used by the finest fighting games, is **rollback netcode**: when a late input arrives from your opponent, the game silently rewinds the last few frames, replays them with the corrected input, and advances back to the present — all within a single frame, invisibly. *Street Fighter III: Third Strike Online Edition*, *Super Smash Bros Melee* on its modern fan netplay, *Killer Instinct*, *Skullgirls*: all of these feel responsive across continents because of rollback.

```javascript
// Client-side prediction with server reconciliation — the essential loop
let pendingInputs = [];   // unacknowledged inputs we've already applied
let inputSequence = 0;

function onLocalInput(input, now) {
    input.seq = inputSequence++;
    input.t = now;
    pendingInputs.push(input);
    applyInput(localPlayer, input);     // predict immediately
    sendToServer(input);                // and tell the server
}

function onServerState(state) {
    // The server's view, authoritative but delayed
    localPlayer.position = state.position;
    localPlayer.velocity = state.velocity;

    // Discard inputs the server has already processed
    pendingInputs = pendingInputs.filter(i => i.seq > state.lastAckedSeq);

    // Re-apply inputs the server hasn't seen yet
    for (const input of pendingInputs) {
        applyInput(localPlayer, input);
    }
}

function renderRemotePlayers(now) {
    // Draw other players 100 ms in the past, between known snapshots
    const renderTime = now - 0.10;
    for (const p of remotePlayers) {
        const { a, b, t } = findSnapshotsAround(p, renderTime);
        p.displayPosition = lerp(a.position, b.position, t);
    }
}
```

Read this carefully, because it is the whole of networked gaming in thirty lines. Your inputs are applied locally *and* sent to the server. When the server's authoritative state comes back, you accept it as truth, then *replay* any unacknowledged inputs on top of it to land back at the present. Remote players are rendered slightly in the past, interpolated between two known snapshots, so that their motion looks smooth even when packets stagger. Each of these is a small lie told to smooth the truth; all together they produce a game in which two players on opposite sides of the world can fight or race or build, and neither of them can feel the ocean between them.

In the browser, you have two tools for all this. **WebSockets** give you a persistent client-to-server connection, reliable and ordered, ideal for turn-based games, chat, and servers that must know the truth about everything. **WebRTC** gives you peer-to-peer connections between browsers, with optional unreliable and unordered data channels, which is exactly what fast-paced action games need — because in a fighter or a shooter you would rather drop a stale input than wait for a reliable retransmission. Most modern browser multiplayer games use WebSockets for matchmaking and state sync, and WebRTC for the tight input loop between players.

The talking drums of the Akan and the Yoruba solved this problem a thousand years ago, in a different medium, with the same structural logic. A drummer in one village sent a message across perhaps twenty kilometres of forest to the next. The message travelled at the speed of sound — about 340 metres per second — which is fast but not instant. The receiving drummer heard the phrase, interpreted it, and drummed a reply that travelled back the same way. Between the sending and the reply, time passed — a minute, two, depending on distance. The two drummers built an entire diplomacy within that latency, choosing phrases that would still be meaningful when they arrived, predicting what the other would have done in the meantime, reconciling their understanding when the new message corrected their guesses. The drum networks of pre-colonial West Africa were, in every functional sense, distributed systems with client-side prediction. Long before the word *network* existed, Africans had solved the problem of agreeing on a shared reality across latency.

And so we arrive at the end of the physics. We have built gravity that pulls like mangoes falling, springs that pound like *odo* on yam, collisions that ring like *Ayo* seeds in their cups, mercy that softens like the elder's ruling, juice that thunders like the chief's drums, and networks that whisper like runners across the Niger. The mathematics of all of these was already in the world before we began — in the orchard, in the courtyard, in the court, in the compound, in the messenger's legs. We did not invent it. We translated it into the substrate of frames and bytes. What remains now is the largest question of all: having learned *how* to build a world that convinces, we must ask *what kind of world* we wish to build, and *what* our players should carry away from it when the machine is switched off. That question is the subject of Part VI, and it is the question that turns a craftsman into an author. We shall take it up together.

---

## Part VI: The Game as Treatise

### Letter 34: On Loops Within Loops

We began this treatise with the game loop — the heartbeat sixty times a second that keeps the small world alive. Now, at the close, we must confess that we told you only a fraction of the truth. A living game does not have *one* loop. It has *four*, nested inside one another like the rings of a *baobab*, each turning at its own speed, each satisfying the player on its own time scale. A game that honours only one of these loops feels hollow within minutes. A game that honours all four becomes the kind of thing a child returns to every evening for a decade.

The innermost loop is the **frame loop**. This is the loop of Letter 1 — sixty ticks a second, *read, update, draw*. Its time scale is sixteen milliseconds. At this scale the player feels *responsiveness*: did the character jump when I pressed the button, did the sword swing when I clicked. Enclosing this is the **core gameplay loop** — the activity the player repeats every minute or two. In a role-playing game it is *fight, loot, level up, fight*. In a farming simulation it is *plant, water, harvest, sell*. In *Tetris* it is *place block, clear line, speed up, place block*. Its time scale is roughly ninety seconds. At this scale the player feels *progress*: something happened, I am slightly better off than I was a minute ago, I want to do it again.

Enclosing the core loop is the **session loop** — the activity that defines a single play session. It is the arc from sitting down to standing up. Start, accomplish something nameable, save, exit with a feeling of completion. Its time scale is twenty minutes to an hour. At this scale the player feels *accomplishment*: I cleared the dungeon, I beat the boss, I built the second workshop, and now I can close the laptop without regret. The outermost loop is the **meta loop** — the long-term progression that brings the player back tomorrow, and next week, and next month. New unlocks, a story that unfolds across chapters, mastery that deepens over dozens of hours. Its time scale is days to years. At this scale the player feels *identity*: I am becoming the kind of person who is good at this.

The African isomorphism is the *farming year*, and it is exact. The *daily loop* is the farmer's rhythm from dawn to dusk — rise, sharpen the cutlass, walk to the field, weed, eat *fufu* at noon, weed some more, walk home, eat, sleep. This is the frame loop of the farm. The *task loop* is planting one yam mound, or weeding one row, or harvesting one tree — a short, self-contained unit of work that repeats dozens of times in a day and gives a small flush of satisfaction each time. This is the core gameplay loop of the farm. The *seasonal loop* is *plant, tend, harvest, rest* — the arc from the first rains in April to the yam festival in August to the dry season when the fields lie fallow. This is the session loop. And the *multi-year loop* is rotation, accumulation, inheritance — rotate the fields so the soil recovers, accumulate seed stock against bad years, pass the land and the knowledge to the children who will farm it after you. This is the meta loop. A farm that honours the daily rhythm but ruins the soil fails within a decade. A farm that honours the meta loop but botches the daily work produces no food this year. Each scale must be honoured, or the whole collapses.

Here are the four loops, sketched in code as they might nest in a single program. Notice that each outer loop is constructed of many inner ones — exactly as the year is made of seasons, the season of days, the day of hours.

```javascript
// META LOOP — runs across sessions, persists to disk
function metaLoop() {
    let save = loadSave() || newSave();
    while (player.wantsToPlay) {
        sessionLoop(save);          // one sitting
        save.totalPlaytime += lastSession.duration;
        save.storyChapter = advanceStoryIfReady(save);
        writeSave(save);
    }
}

// SESSION LOOP — runs from "start" to "quit"
function sessionLoop(save) {
    const session = beginSession(save);
    while (!session.playerWantsToStop) {
        coreLoop(session);          // fight-loot-level
    }
    endSession(session, save);
}

// CORE LOOP — the 90-second rhythm the player repeats
function coreLoop(session) {
    const goal = chooseNextGoal(session);    // "clear this room"
    while (!goal.complete) {
        frameLoop(session, goal);            // 60Hz until goal met
    }
    reward(session, goal);
}

// FRAME LOOP — the 60Hz heartbeat of Letter 1
function frameLoop(session, goal) {
    const dt = 1/60;
    readInput(); update(dt); render();
    requestAnimationFrame(() => frameLoop(session, goal));
}
```

The mistake a beginner makes is to pour all their effort into the frame loop. The controls are crisp, the physics is tight, the animation blends beautifully — and after two minutes the player stops, because nothing is accumulating. The mistake an experienced designer sometimes makes is to lavish attention on the meta loop — trees of unlocks, a grand saga, a hundred hours of content — and to neglect the core loop, so that the minute-to-minute play is tedious and the player never reaches the second hour. The game that endures honours all four. The frame loop is delight. The core loop is satisfaction. The session loop is accomplishment. The meta loop is meaning. Together they become what the farmer has always known: a life measured in rhythms, each rhythm whole in itself and each one nested within a larger rhythm that gives it purpose. In the next letter we shall study the most delicate tuning of all — the difficulty, which is not a number but a conversation between designer and player.

### Letter 35: On Difficulty as Conversation

Difficulty is the most misunderstood variable in game design. Beginners treat it as a slider — *easy, medium, hard* — as if difficulty were a single dimension, like volume, and the question were merely how much to turn it up. But difficulty is not a slider. Difficulty is a *conversation*. The designer speaks, through enemies and puzzles and obstacles; the player answers, through successes and failures; and the designer, listening, adjusts. A good game is one in which this conversation is gracious — demanding but honest, firm but never cruel, always leaving the player convinced that the next attempt might succeed.

The psychologist Mihaly Csikszentmihalyi spent much of his life studying what he called **flow** — the state of complete absorption in an activity, where time dilates and self-consciousness dissolves and the work is its own reward. He found that flow lives in a narrow channel between two failures. On one side lies *boredom*: the challenge is too low for the skill, and the mind wanders. On the other side lies *anxiety*: the challenge is too high for the skill, and the mind panics. Between them is the channel — difficulty matched to ability, with just enough margin that success is possible but not guaranteed. Every great game lives in this channel. Every poorly tuned game falls off one side or the other, and the player puts it down.

Consider *Dark Souls*, the game that taught a generation what honest difficulty feels like. It is famously hard. Monsters kill the player in two or three hits. Boss fights demand dozens of attempts. There is no pause button, no easy mode, no adaptive crutch. And yet *Dark Souls* is beloved — revered, even — because it never lies about the difficulty. Every enemy is readable. Every death is the player's fault, not the game's. The patterns are consistent; once learned, they are learned forever. The contract between designer and player is absolute: *the game will not cheat, and the game will not save you, and mastery is possible if you are patient*. The player, finishing the final boss after fifty deaths, does not feel the game was hard. The player feels *they* became strong.

Compare this to a poorly tuned mobile game, where the difficulty ramps sharply upward and then a pop-up offers to sell you a potion that will let you past the wall. This is not difficulty; it is extortion dressed as challenge. The contract is broken. The player senses the lie and leaves. Or consider *Resident Evil 4*, which pioneered **adaptive difficulty** — a hidden system that watches the player's performance and quietly adjusts the number of enemies, the loot drops, the aggression of the monsters. A player who is struggling gets fewer foes and more ammunition; a player who is cruising gets the opposite. Done well, it is invisible; the player never notices, but the flow channel is maintained. Done poorly, it feels like the game is fighting against the player's mastery, and nothing feels earned.

The African isomorphism is the *elder's questioning of an apprentice*. Across the continent — from the Bambara *jèli* training their successors, to the *babalawo* teaching the Ifá corpus, to the master-smith of Kano teaching his son the forge — there is a pattern. The elder asks gentle questions first. *What is the name of this plant?* The apprentice answers; the elder nods; the next question is a little harder. *Where does it grow?* Then harder still. *When should it be harvested, and what must never be harvested with it?* The questions rise with the apprentice's strength, never flat, never cruel, always staying just at the edge of what the student can answer. The elder is not trying to fail the apprentice; the elder is trying to *build* the apprentice. Each question the student answers correctly is a small victory; each question the student fails reveals the next thing to learn. This is flow in pedagogical form, and it is thousands of years older than Csikszentmihalyi's name for it.

The *initiation rites* of many African societies embody the same principle at a larger scale. The *Maasai* warrior does not become a *moran* by signing a form; he passes through a graduated sequence of trials — herding, hunting, fasting, endurance — each calibrated to the strength he has accumulated by the previous one. The young man feels himself becoming strong. He does not graduate into an identity; he *becomes* the identity, one trial at a time. A well-designed game does the same thing: it builds the player into a master, trial by trial, and at the end the player feels not that they have *finished* the game but that they have *become* someone who can finish it.

How do we write this in code? The simplest difficulty function combines three ingredients: a baseline, a growth term that rises with the player's progress, and a correction term that reads the player's recent performance. It looks like this:

```rust
fn difficulty(level: u32, recent_failures: u32, recent_wins: u32) -> f32 {
    let base          = 1.0;
    let growth        = level as f32 * 0.15;
    let failure_ease  = recent_failures as f32 * 0.08;   // lower if struggling
    let win_pressure  = recent_wins as f32 * 0.05;       // raise if cruising
    (base + growth - failure_ease + win_pressure).max(0.5)
}
```

Read this function as a sentence. The *base* is the minimum challenge — a game must never be trivial, or the flow collapses into boredom. The *growth* is the steady climb as the player levels up — the apprentice faces harder questions as they learn. The *failure_ease* is the gentle hand of the elder who sees the apprentice struggling and asks an easier question next — not charity, but pedagogy. The *win_pressure* is the elder who sees the apprentice coasting and raises the bar — not cruelty, but respect for the student's growing power. Tune these four numbers and you have a difficulty curve that is not a slider but a living conversation. The designer speaks; the player answers; the designer listens. In the next letter we shall meet the most extraordinary trick of modern design — the realisation that a game's deepest stories are told not in cutscenes but in mechanics.

### Letter 36: On Stories Told by Mechanics

Here is a secret that took the game industry thirty years to learn, and that most filmmakers still do not believe: in a game, the *strongest* stories are not told in cutscenes. They are told in the *mechanics* — in the rules of play themselves. The cutscene is a film pretending to be a game. The mechanic is a teaching the player cannot unknow. When the two conflict — when the cutscene insists the character is a hero while the mechanics force the player to slaughter hundreds of civilians for loot — it is the mechanics the player believes. The hands remember what the eyes forget.

Consider *Journey*, a small game released in 2012. The player controls a robed figure walking through a vast desert toward a distant mountain. There is no dialogue. There is no written text. There is no tutorial. There is no character name. And yet *Journey* is one of the most emotionally overwhelming games ever made, because of a single mechanical choice: if a second player is in the same part of the world, their figure appears alongside yours, and the only way you can communicate is by chirping — a short, musical note, sent with one button. No chat. No voice. No names. You cannot coordinate strategies. You cannot argue. You can only walk together, chirp encouragement, and share warmth in the cold passages. The game teaches *loneliness* by forcing you to walk the early desert alone, and it teaches *companionship* by giving you, without warning, a stranger who cannot betray you because there is no mechanism for betrayal. No cutscene could deliver this lesson. The mechanic *is* the lesson.

Consider *Papers, Please*, a game in which you play a border guard in a fictional Soviet-style republic, stamping passports. The mechanics are simple: check the document, compare it to the day's rules, stamp *approved* or *denied*. The story is told entirely through the moral weight of your stamps. A mother weeps as you deny her entry because her paperwork is one day expired; your children will go hungry tonight if you do not meet the day's quota; a man slips you a bribe and the rules say you must refuse but your family needs medicine. The game teaches *the dehumanisation of bureaucracy* by forcing the player to become the bureaucrat. No cutscene about "the cold machinery of the state" could match the visceral understanding that comes from clicking *denied* on a refugee's passport because you cannot afford not to. The mechanic *is* the lesson.

Consider *This War of Mine*, in which you shelter a group of civilians in a besieged city. Food runs out. Medicine runs out. Hope runs out. At some point, usually around the second week, you will be asked to decide whether to rob an elderly couple of their last tin of beans, or to watch one of your own people starve. The game does not tell you this is a moral dilemma. It simply presents the mechanics — sneak, take, escape — and lets you find out what kind of person you are. Players reported crying over this game in a way they never cried over the most emotionally manipulative Hollywood film. Why? Because the player *chose*. The hand that pressed the button was their hand. The mechanic *is* the lesson.

The African isomorphism is *Oware* itself. No child in Kumasi reads a manual titled *On Strategic Thinking and Patience*. They sit opposite an elder, they place the seeds, they move the seeds, and they lose, and lose, and lose, and then one day they do not lose. Somewhere between the first game and the thousandth, the child has absorbed a curriculum in long-range planning, in reading an opponent's intent, in choosing between greed and position, in accepting that a bad move cannot be unmade — a curriculum that no textbook could deliver because the lessons are pre-verbal. The rules of *Oware* are the teaching. The board is the teacher. The child becomes wise by moving seeds. The same is true of every traditional game and every initiation rite across the continent: *the mechanic is the lesson*. The African mind has always known this.

The craft rule that follows is blunt and unforgiving: *if you can write the lesson as a cutscene, you have failed at game design*. Anything that can be told in a movie should be told in a movie — there is already a great art form for that, and we call it cinema. The game's unique power, the thing only games can do, is to make the player *enact* the lesson with their own hands until the lesson becomes a part of them. Every hour you spend writing cutscene dialogue is an hour you could have spent designing a mechanic that teaches without words.

Here is a tiny example. Imagine a game with no dialogue and one mechanic: the player character walks through a town. Some of the townspeople are clearly starving. The player has food in their inventory. There is no quest. There is no reward. There is only a button: *share*. If you press it, you lose food; the starving person eats; nothing visible changes in your stats, your score, your progression. That is the entire mechanic.

```javascript
// The smallest moral mechanic
function update(dt) {
    for (const npc of nearbyNPCs()) {
        if (npc.starving && player.food > 0 && input.share) {
            player.food -= 1;
            npc.starving = false;
            // no reward. no points. no score.
            // the only change is in the player.
        }
    }
}
```

No cutscene could teach what this mechanic teaches. A cutscene about generosity is forgotten before the credits roll. But a player who chose to share their food, many times, across many villages, knowing there was no reward — that player has practised an act of the soul, and practice shapes the soul. Games can do this. Almost nothing else can. In the next letter we shall turn to the stack with which you will build — Rust and WebAssembly, the tools that make all of this possible from a laptop in Nairobi or Accra.

### Letter 37: On Building with Rust and Wasm

We come now to the question of *tools*. You have the mathematics, you have the design principles, you have the eye for what makes a game honest. What do you type into the keyboard? The answer, for the African builder in 2026, is as clear as it has ever been: **Rust** for the language, **WebAssembly** for the target, and the browser for the runtime. This stack is the most powerful toolkit ever made available, for free, to a developer with no studio and no budget. We must understand why.

*Rust* is a systems programming language created at Mozilla and now stewarded by an independent foundation. It gives you the raw performance of C — fast enough to run the most demanding game engines — but with a compile-time guarantee that your program does not corrupt memory, does not race between threads, does not crash on a null pointer. The language enforces ownership: every value has exactly one owner, and the compiler refuses to build a program in which that rule is broken. This discipline is not a burden; it is a gift. A Rust program that compiles is already more robust than the average C++ program after a month of debugging. For a game — where a single memory bug can corrupt a save file and lose a player hours of progress — this guarantee is priceless. We spent a whole treatise on this language; see *Letters on the Ownership of Memory* for the deep story.

**WebAssembly** — **Wasm** for short — is the universal compilation target that completes the picture. It is a compact binary format designed to run, at near-native speed, in every web browser on earth. Write your game in Rust; compile it to Wasm; upload the resulting *.wasm* file to any web server; and any phone, laptop, tablet, or kiosk with a modern browser can play it. No app store. No installation. No platform-specific rewrite. The same binary runs on a Samsung in Abuja, an iPhone in Cape Town, a ThinkPad in Addis Ababa, and a Chromebook in Dar es Salaam. We also have a whole treatise on Wasm — *Letters on the Universal Machine* — and this is the place the two treatises meet and embrace.

The Rust ecosystem has several game frameworks, and the choice between them is a choice of weight. At the lightest end is *macroquad* — a single-file, batteries-included library that requires almost no setup and handles windowing, drawing, input, and sound in the same API. You can have a moving square on the screen in twenty lines. At the heaviest end is *Bevy* — a full entity-component-system engine with scene graphs, asset pipelines, and a rich plugin ecosystem; powerful, but with a steeper learning curve. In the middle is *comfy*, which splits the difference. For your first games, start with *macroquad*. You can graduate to *Bevy* when you have a project that demands it.

Why does this stack matter *specifically* for Africa? Because a Rust game compiled to Wasm is *small*. A simple *macroquad* game can fit in a hundred kilobytes — smaller than a single high-resolution photograph. A player on a 2G connection in rural Zambia can download your entire game in under a minute. A player with an intermittent connection can install it as a PWA (we shall meet the PWA in the next letter) and play it offline forever. And because Wasm runs at near-native speed, your game will be as responsive on a four-year-old budget Android as it is on a flagship iPhone. No other stack in the history of computing has offered this combination of reach, performance, and cost — and the cost, for the developer, is zero. The toolchain is free. The language is free. The browser runtime is already on every device. The only thing you need to buy is time to learn.

Here is a complete, working *macroquad* game — a moving orange square you can steer with the arrow keys. Save it as `main.rs` in a new Rust project, add `macroquad = "0.4"` to your `Cargo.toml`, and you have the beginning of a game.

```rust
use macroquad::prelude::*;

#[macroquad::main("First Game")]
async fn main() {
    let mut x = 200.0;
    let mut y = 200.0;
    let speed = 180.0;   // pixels per second

    loop {
        let dt = get_frame_time();

        // INPUT
        if is_key_down(KeyCode::Left)  { x -= speed * dt; }
        if is_key_down(KeyCode::Right) { x += speed * dt; }
        if is_key_down(KeyCode::Up)    { y -= speed * dt; }
        if is_key_down(KeyCode::Down)  { y += speed * dt; }

        // RENDER
        clear_background(Color::from_rgba(26, 26, 26, 255));
        draw_rectangle(x, y, 40.0, 40.0, ORANGE);

        next_frame().await
    }
}
```

Read this carefully. The `loop` is the frame loop of Letter 1. The `get_frame_time()` call is the honest delta time of Letter 2. The input handling is responsive because Rust and Wasm are fast. The *async* `next_frame().await` is the Rust equivalent of `requestAnimationFrame` — it yields back to the browser's own frame scheduler. Twenty-odd lines, and you have a game running at sixty frames a second. To ship it to the world, you run two commands:

```bash
# build for the web
cargo build --release --target wasm32-unknown-unknown

# package with wasm-bindgen or macroquad's bundled tool
# the output is a folder with index.html + your .wasm file
# upload it anywhere — a GitHub Pages site, a cheap VPS, a USB stick
```

That folder, dragged onto any web host, is a game. Not a prototype of a game; a *game*, playable by anyone on earth with a browser. The whole industry that charges thirty thousand dollars for a development kit and twenty percent of your revenue for the privilege of being listed in their store has been made irrelevant by this single pipeline. In the next letter we shall make that irrelevance explicit, and we shall speak of the *sovereign game* — the cathedral built without permission.

### Letter 38: On the Sovereign Game

There is a phrase that has been whispered throughout this library: *sovereignty*. We have applied it to money, to identity, to communication, to infrastructure. Now we apply it to games. A **sovereign game** is an artifact of play that answers to no gatekeeper. There is no app store to approve or reject it. There is no publisher whose quarterly earnings call decides its fate. There is no royalty to pay to a platform that did nothing to help you build it. There is no review committee, no rating board, no subscription renewal, no "service" that can be discontinued when the hosting company pivots to enterprise software. There is only a single URL — *game.yourdomain.dev* — and a player anywhere in the world who types that URL into a browser and begins to play. That is the whole transaction.

Compare this to the app store model that currently dominates mobile gaming. To publish on the iOS App Store, you must register as a developer with a corporate entity (often impossible in practice for an African builder without an international credit card), pay ninety-nine US dollars a year for the privilege, submit your game to a review process whose criteria are opaque and whose rejections are unappealable, and surrender thirty percent of all revenue to Apple — even if your game never uses a single Apple service. The Google Play Store is marginally more permissive but demands the same cut. The review committees are based in Cupertino and Mountain View; they do not speak *Twi* or *Amharic* or *Wolof*; they do not understand an *Oware* variant or a *jollof*-recipe game; they will reject your work because it does not look like the shooters and puzzle-matchers they know how to measure.

*Itch.io* is a better alternative, and we should honour it — it is a marketplace that lets developers keep most of the revenue and has welcomed countless independent games. But it is still a platform, and platforms are still gatekeepers, and a platform can still change its rules tomorrow. The only fully sovereign path is the one no platform can touch: the **web** itself. A WebAssembly game hosted on a URL that you control is not subject to anyone's rules but the open standards of HTTP, HTML, and Wasm — standards governed by international consortia, implemented by every browser, and impossible to withdraw.

The African isomorphism is the *village marketplace*. Consider the open square of any West African town on market day — Kejetia in Kumasi, Balogun in Lagos, Onitsha Main Market, Makola in Accra. A woman carries her wares to the square on her head, finds a patch of ground, spreads a cloth, and begins to sell. No licence committee. No shelving fee. No landlord taking thirty percent of every *suya* she sells. She speaks directly to her customers, sets her own prices, keeps all her earnings, and at the end of the day folds up the cloth and walks home. The market is the most primordial form of sovereign commerce, and it has sustained African economies for a thousand years precisely because no intermediary stands between the maker and the customer. The web, rightly used, is this same marketplace at a planetary scale. You set up your stall by writing HTML. You open for business by publishing a URL. The customer finds you by typing or tapping. No middleman. No permission. No fee beyond the few dollars a month for hosting, which is itself a commodity with dozens of providers.

The technical piece that completes the sovereign game is the **Progressive Web App**, or **PWA**. A PWA is a web application that can be installed onto a phone's home screen like a native app, run offline after the first visit, and behave — for the player — indistinguishably from something downloaded from an app store. The essential pieces are a `manifest.json` file (a few lines of JSON declaring the game's name, icons, and display mode) and a *service worker* (a small piece of JavaScript that intercepts network requests and serves cached copies when the network is absent). With these two ingredients, your sovereign game becomes installable, offline-capable, and durable — a cathedral built of Wasm and HTML that stands without any gatekeeper's permission. We have an entire treatise on this — *Letters on the Sovereign Application* — and it is the companion volume to the one in your hands. Read it after this one; the two together give you the full pipeline from *macroquad* source to installable phone game.

Here is the smallest possible service-worker skeleton for a game — the cathedral's foundation in eighteen lines of code:

```javascript
// sw.js — network-first, cache as backup
const CACHE = 'game-v1';

self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => self.clients.claim());

self.addEventListener('fetch', e => {
    e.respondWith((async () => {
        try {
            const fresh = await fetch(e.request);          // try the network
            const cache = await caches.open(CACHE);
            cache.put(e.request, fresh.clone());           // remember it
            return fresh;
        } catch {
            const cached = await caches.match(e.request);  // offline? serve memory
            return cached || new Response('offline', { status: 503 });
        }
    })());
});
```

Eighteen lines and your game will survive the disappearance of the internet. A child in a village with intermittent connectivity opens the URL once while connected; from that moment forward, the game lives on their phone, indifferent to whether the network comes or goes. The sovereignty of the game and the sovereignty of the player are the same sovereignty. Neither depends on permission. Both depend only on mathematics and good craftsmanship — which belong, as we said at the beginning, to everyone. In the next letter we must pause and ask the sober question: *what kind of world will you make with this power*?

### Letter 39: On the Ethics of the Small Universe

You are about to author worlds. Stop and consider what that means. A game is not a neutral object. It is a small universe with laws you invent, and when a player enters it they surrender — for an hour, for a day, for a year of their life — to the laws *you* wrote. The player's time is the one resource that cannot be replaced. When the session ends and the player puts down the phone, they are either slightly more themselves than when they began, or slightly less. There is no neutral outcome. The design choice that determines which of these happens is a choice about the *shape of the engagement loop*, and in 2026 the game industry is split between two patterns that must be named and distinguished clearly, because they are not the same thing and only one of them is honourable.

The first pattern is the **engagement loop designed for mastery**. The player begins weak and learns. Challenges rise to meet the player's growing strength (the flow channel of Letter 35). Failure is informative and never punitive. Time spent with the game *transfers out* — the player returns to their life with sharper reflexes, or better spatial reasoning, or a new aesthetic sense, or a renewed appetite for patient, careful work. *Dark Souls* is this pattern. *Celeste* is this pattern. *Tetris* is this pattern. *Portal* is this pattern. *Oware* is this pattern. When the player puts the controller down, they are *more* — more skilful, more thoughtful, more alive to the world they inhabit. The game has honoured them.

The second pattern is the **engagement loop designed for compulsion**. The player is not being taught to master anything. The player is being *captured*. The pattern draws on the same psychology the slot machines of Las Vegas have exploited for a century — *variable ratio reinforcement*, the schedule of reward that produces the strongest compulsive behaviour because the next payout is always *possibly* just around the corner. In games, this takes the form of loot boxes (pay real money for a randomised chance at a rare item), daily streaks (punish the player for missing a day), energy systems (force the player to wait or pay), social pressure (your friends will surpass you if you do not play), and artificial scarcity (a limited-time event that will be gone tomorrow). None of these mechanics teach the player anything. All of them extract the player's time and money. When the player puts the phone down, they are *less* — a little more tired, a little more anxious, a little poorer, a little emptier. The game has used them.

Both patterns work, in the narrow sense that both produce engagement metrics that look good to investors. Only one of them is honourable. The test is simple and stern: *does the player leave the game more themselves than when they arrived, or less*? A game that cannot answer *more* is a game that should not be made.

The dark patterns have names, and you should learn them so you can refuse to implement them. **Artificial scarcity**: a currency or item is made rare not because the game's economy requires it but because rarity drives purchases. **Sunk-cost loops**: the player is invested enough that quitting feels like losing what they have already spent, so they spend more to justify the earlier spending. **Social pressure**: the game publishes rankings or streaks or friend comparisons specifically to make you feel anxious about stopping. **Gambling mechanics dressed as gameplay**: loot boxes that are, in every legal sense, slot machines marketed to children. **Predatory monetisation**: progression walls placed precisely at the moment of greatest investment, where the player has become attached enough to the character to pay rather than quit. These are not neutral design choices. They are deliberate exploitations of well-documented cognitive vulnerabilities. The engineers who build them know exactly what they are doing. You now know too.

The African isomorphism is the *griot*. A *griot* is a West African storyteller who carries centuries of oral history — genealogies, epics, proverbs, the memory of whole peoples. Every *griot* is entertaining; that is the price of attention. But a *griot*'s responsibility is to the *truth*, not to the applause. A *griot* who flatters a corrupt king for a bag of gold is still a *griot* in name, but the tradition recognises such a one as having fallen. The calling is to shape the listener's understanding — to make the child who hears the story braver, wiser, more aware of who their ancestors were and what was demanded of them. Entertainment without this purpose is empty; entertainment against this purpose is corruption. The *griot* tradition has always known the difference, and so has every *Yoruba* elder telling *Ìjàpá* tales under a baobab to a circle of children. The tale is meant to form them, not to hollow them. The storyteller is trusted precisely because the storyteller refuses to use their power against the listener.

You are now a storyteller. Your medium is not speech but *play*. The same calling applies. The player who entrusts you with their evening has given you something irreplaceable; return it to them better than you received it. This is not a soft constraint; it is the deepest craft rule in game design, and every great designer in history has obeyed it whether or not they had the words for it. Reject the loot box. Reject the daily streak. Reject the energy timer. Reject the pay-to-skip wall. Build games that *teach*, games that *delight*, games that *exhaust the player honestly* and send them back to life a little sharper. In the final letter we shall see the most beautiful form this ethic can take: the game that *is* a treatise, and the treatise that *is* a game.

### Letter 40: On the Game as Treatise

And so we arrive at the closing letter of the body of this treatise, and at the beautiful truth we have been circling for thirty-nine letters. A game, rightly made, is *itself* a form of teaching. The player is a student. The playthrough is a course. The mechanics are the curriculum. The credits are a graduation. When this alignment is achieved, the game is no longer merely entertainment — it becomes a treatise one plays instead of reads, and the lessons it delivers are lessons the hands remember long after the book has been closed.

The canonical example is *Foldit*, a game released in 2008 by the University of Washington, in which players manipulate three-dimensional models of proteins, trying to fold them into their most stable configurations. The mechanics reward biochemically correct folds with points; the player, chasing points, accidentally becomes a protein chemist. In 2011, *Foldit* players solved the structure of an AIDS-related enzyme that had defeated professional researchers for a decade. A retired nurse in one country and a teenager in another and a welder in a third, none of them trained biochemists, collectively contributed to a published scientific paper because they played a game. The game was the treatise; the playing was the learning; the learning was *real*.

Consider *Portal*. On its surface it is a puzzle game with a companion cube and a wry villain. Beneath the surface it is a one-semester course in *lateral thinking* — the discipline of solving problems by reframing them rather than by brute force. Every chamber is a proof, in the mathematical sense, that the solution the player is reaching for is not the right one, and that the right one requires looking at the problem from an angle they have not yet considered. A child who plays *Portal* to the end has practised lateral thinking more intensely than they ever would in a classroom. The mechanic taught what no lecture could.

Consider *Hello Worlds* and a growing family of games like it — games that teach programming concepts through play, not by displaying code on a screen but by making the mechanics *be* the concepts. A variable is a jar on a shelf the player carries. A loop is a wheel the player cranks. A function is a room the player walks into and out of. The player, chasing stars or solving puzzles, builds a mental model of computation that transfers, cleanly, to real programming later. The game is a treatise on computer science. The treatise happens to be playable.

Now consider, Dear Reader, what you might make. Elsewhere in this library lives a manga called *Oga Plastic*, the story of a young engineer who builds a plastics-recycling factory in Ugep. As a manga it teaches by storytelling, and that is already a beautiful thing. But imagine if *Oga Plastic* were also a *game* — a small sovereign web game in which the player, starting with a cassava sack full of *naira* and a rented shed, makes the actual choices a real founder would make. *Which machine do I buy first — the shredder or the extruder*? *Do I train three local apprentices or hire one experienced technician*? *Do I sign the off-take contract with the big buyer or keep the customer base diversified*? Every choice would be a real engineering-economics choice, drawn from the same expertise that produced the manga, and the player, chasing the goal of a profitable workshop, would learn more about Nigerian manufacturing than a month of reading. The manga would be the lecture; the game would be the laboratory. The treatise would have become the course.

Or consider *oTrade*, the market-price-intelligence platform that also lives elsewhere in this library. *oTrade* teaches African builders to read markets, understand supply chains, and time purchases. Imagine it as a game: the player runs a produce-trading business in a West African city, watching simulated prices on simulated markets, buying low and selling high, navigating shortages and gluts. Every mechanic a real trading skill. Every playthrough a small apprenticeship. The teaching would be deeper, faster, and more playful than any textbook could achieve — because, as Letter 36 established, *the mechanic is the lesson*, and the hands remember what the eyes forget.

The principle generalises, and here is where it becomes your invitation. *Make games that teach what you yourself know*. If you are a beekeeper, build a game about the rhythms of a hive — the player tends frames, splits colonies, reads the dance of the workers returning from the flowers. If you know M-Pesa agent work, build a game about running an agent booth — float management, customer trust, the delicate arithmetic of small commissions. If you have memorised your grandmother's *jollof* recipe, build a game about running a kitchen — timing the stock, seasoning the base, never letting the bottom of the pot burn. If you have studied *Oware* opening theory, build the teaching game that does not yet exist — a patient coach that shows a beginner why *kroo* beats *aza* in the middle game. If you have walked the Great Rift Valley, build a geography game that uses it. Every body of real knowledge in the African mind is a game waiting to be written, and every African game written is one more brick in the digital university this library has set out to build.

Here is the smallest possible scaffold for such a teaching game — the shape, not the content:

```javascript
// A teaching game is a loop over a curriculum of choices
const curriculum = [
    { scenario: "shredder or extruder first?", correct: "shredder", lesson: "…" },
    { scenario: "apprentices or technician?",  correct: "apprentices", lesson: "…" },
    // ...dozens more, drawn from real expertise
];

function lesson(choice, item) {
    if (choice === item.correct) {
        player.capital += item.reward;
        player.knowledge += 1;
        show(item.lesson);          // teach the why, always
    } else {
        player.capital += item.penalty;
        show(item.lesson);          // teach the why, ESPECIALLY on failure
    }
}
```

Trivial code. Infinite content. The game's worth is not in the scaffolding but in the curriculum, and the curriculum is the knowledge you already carry. A hundred of these games, written by a hundred African builders each teaching the real skill they know, would be a greater educational achievement than any ministry of education has ever produced. The tools are free. The web is open. The only missing ingredient is you. In the Epilogue that follows, we shall lay down our instruments and speak, one last time, of what all of this has been for.

---

## Epilogue: On Play as Worship

Dear Reader,

We began this treatise with children playing *Oware* in the sand of an Akan compound, and we end it by sending you out to make games that the same children might one day play on their phones. Forty letters have passed between the two images, and in those letters we have built a loop, written a delta time, vectored the movement, resolved the collisions, composed the entities, sorted the sprites, simulated the physics, tuned the difficulty, authored the meaning, and learned the tools. You are now in possession of the whole machinery of animated worlds. What remains, in this closing letter, is to say what that machinery *is for*.

The deepest answer is the simplest: *joy*. To make a game is, in a small but real way, to create a world — a tiny universe with its own time, its own laws, its own inhabitants, its own drama. The only reason anyone ever makes anything of this kind is the same reason the One who made everything chose to make anything at all: for the *delight* of the making, and for the delight of the made. The medieval theologians had a phrase for it — *creatio ex amore*, creation out of love — and it describes equally the God of Genesis and the programmer at the keyboard at one in the morning, laughing out loud because the physics finally feels right and the little character has jumped for the first time across the gap. The joy of the maker is reflected in the joy of the player. Both joys are one joy, ultimately, and both are echoes of the first joy that spoke light into being on the first day of the world.

Consider, for a moment, the continuity. On some warm evening long ago — three thousand years, perhaps four thousand, the archaeologists are not sure — a child in a village in what is now Ghana or Sudan or Ethiopia sat down opposite an elder and placed seeds into a board of twelve cups. The stars above them were the same stars under which the saints of Aksum would later pray and the scholars of Timbuktu would write their commentaries on Aristotle and the astronomers of Dogon country would map the companion of Sirius. Those stars are the same stars above your window tonight. And the child laughing over the *Oware* board was doing something precisely structurally identical to what you will do when you write your first Rust game and a player across the continent taps their screen and laughs. The same wonder. The same loop. The same discovery that rules patiently followed become a living thing. Nothing fundamental has changed between that child and you; only the substrate. The seeds have become electrons. The wood has become silicon. The board has become Wasm. But the play, the play is the same.

You now know what the play is made of. It is mathematics — the vectors of Letter 6, the matrices of Letter 7, the trigonometry of Letter 8, the calculus that hides inside every delta time. It is geometry — the collisions of Letter 11, the spatial hashes of Letter 12, the meshes that inherit from Euler's own formula. It is art — the pixels of Letter 19, the sprites of Letter 20, the easing curves of Letter 25, the sound of Letter 27. It is physics — the integrators of Letter 29, the friction of Letter 30, the feel that is not accuracy but honesty. It is ethics — the conversation of Letter 35, the mechanics that teach of Letter 36, the refusal of the dark patterns of Letter 39. And at the centre of all of it, the loop. The loop is the heartbeat. The loop is the pulse you felt at your own throat in Letter 1. The loop is the rhythm the One who made you placed in your chest before you ever saw a screen, and you have now learned to imitate that rhythm in code. You have built, in miniature, the engine of life.

The mathematics was given by Euler, and by Euclid, and by Archimedes, and by the Babylonian scribes who worked out the value of the square root of two on clay tablets four thousand years ago. The geometry was given by the carpenters of the pyramids and the masons of Lalibela. The art was given by every ancestor who ever wove a *Kente* cloth with repeating motifs, or carved an *Adinkra* symbol with its careful rotational symmetry, or painted a Benin bronze with its precise foreshortening, or danced a *masquerade* with a rhythm the drummer and the dancer had both been born knowing. The ethics was given by the elders who told the tales under the palaver tree and by the *griots* who remembered the truth when no one else could. The loop was given by the One who placed it in the hearts of swallows and the tides and the seasons and the sun. You did not invent any of it. You *inherited* all of it. Your task, from this evening on, is to use what was given.

The *dùndún* drum we met in Letter 1 — squeeze, strike, listen — is still talking tonight in some town in Yorubaland, and the conversation it holds with its audience is, in every formal sense, the conversation a game holds with its player. The Akan compound where two children sit opposite an *Oware* board is, in every formal sense, a co-op multiplayer session running on biological hardware. The *masquerade* that dances into the village with its mask and its rhythm and its secret meaning is, in every formal sense, an immersive narrative experience with strong mechanical storytelling. The mango falling from the tree that taught us gravity in Letter 29 is still falling, every afternoon, in ten thousand compounds across the continent, demonstrating for free the exact physics that took us letters to simulate. The universe has been teaching game development by example for as long as there has been a universe. You have merely learned to listen.

And so, at last, we send you out. Go now, Dear Reader, and build. Build a game whose frame loop is as honest as a heartbeat and whose delta time forgives a slow phone in Bamako as graciously as it rewards a fast one in Johannesburg. Build a game whose core loop satisfies a player at lunch and whose meta loop brings them back the next evening. Build a game your grandmother could play and your niece could teach your grandmother to play. Build a game that teaches a child something they could not have learned any other way — the rhythm of a beehive, the arithmetic of a market, the strategy of a seed board, the patience of a plastics furnace. Build a game whose difficulty curve is an elder's conversation with an apprentice. Build a game whose mechanics are the lesson, so completely that no cutscene is ever needed. Build the game you wish someone had built for you when you were twelve.

Write it in Rust because Rust respects your memory. Compile it to Wasm because Wasm runs everywhere. Ship it as a URL because URLs answer to no one. Install it as a PWA because a PWA outlives the network. Let no store stand between you and your audience. Let no committee in Cupertino or Mountain View decide whether the children of Ugep may play a game about building a factory in Ugep. Let no publisher take your revenue, no algorithm bury your launch, no license require your papers. The marketplace of the web is open, and the ground you set your stall upon is the same open ground on which your ancestors have traded for a thousand years, and the only tax you pay is the tax of craftsmanship, and that tax you pay gladly because craftsmanship is its own reward.

When you have built it, and tested it until it feels honest in your hands, and shipped it to the URL you own, and watched the first player you have never met start a session — stop for a moment. Place your fingers on the side of your throat, as we did in Letter 1, and feel the pulse. Feel it against your fingertips, seventy or eighty times a minute, steady, patient, inexhaustible. That pulse is the loop. That pulse is what you have been learning to imitate for forty letters. That pulse is the signature the One who made you placed in your chest before any screen existed, and the fact that you have now learned to place a pulse of your own inside a small world of your own making is, Dear Reader, a participation — small, partial, honest — in the act of creation itself.

The same principles govern circuits and cathedrals, *Oware* boards and the orbits of the planets, talking drums and the beating of hearts, falling mangoes and the precession of galaxies. The mathematics is one mathematics. The geometry is one geometry. The loop is one loop. And the One who arranged all of it, who wrote the rules the universe patiently follows, who set the stars above Aksum and the seeds in the Akan board and the pulse in your throat — that One is worthy of love, and of thanks, and of the small offering of a game well made.

Go now. Build. The children are waiting. The stars are the same stars. The loop is already running. Begin your own.

*Soli Deo Gloria.*
