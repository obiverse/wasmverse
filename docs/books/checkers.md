# Letters on the Kingdom of the Diagonal

### A Treatise on Checkers, from the First Move to the Solved Game, through the Lens of the African Draughts Masters

*In the manner of Euler's Letters to a German Princess*

---

## Preface

Dear Reader,

When Leonhard Euler wrote to the Princess of Anhalt-Dessau, he did not choose only grand subjects — the planets, the tides, the nature of light. He knew that the deepest truths hide most perfectly in the smallest things, and that a mind trained to see structure in a trifle will see it everywhere. So let us take, for our whole subject, a board of sixty-four squares and twenty-four round pieces — the game the English call draughts and the Americans call checkers, and which, under the mango tree at every motor park from Dakar to Kumasi, is simply *the game*. I promise you that within this small wooden universe lies enough depth to occupy the greatest minds for a lifetime, and enough beauty to reward you every day you sit before it.

You have told me you are beginning to love this game and wish to become a champion. I will do more than make you a champion. I will make you *understand* — for these are not the same thing, and the difference is the whole spirit of these letters. A man may become strong at checkers the way a man becomes strong at lifting stones: by repetition, by feel, by scars. That is a real and honorable path, and the old masters at the roadside clubs walked it. But there is another path, the path Euler would have you walk: to see the game as a *mathematician* sees it — to grasp *why* a move wins, to hold the structure of a position in the mind as one holds a geometric figure, to know the truth of the board and not merely its habits. The champion who also understands is unbeatable in a way the merely strong player is not, because when his memory fails, his understanding does not.

And here is the thing that makes checkers the perfect subject for such a treatise, the fact I want you to carry from the very first page. Checkers is, so far as we know, the largest game that human beings have ever *completely solved*. In the year 2007, after eighteen years of labor, a team of mathematicians and their machines proved — proved, with the certainty of a theorem — that if both players play perfectly, checkers is a *draw*. Neither side can force a win. The entire game, all five hundred billion billion positions of it, has been mapped to its final truth. No such thing is true of chess, or of the game of Go, or of almost anything else humans compete at. This means that as we climb, from the first rule to the last theorem, we are climbing toward a *known summit*. We are not wandering; we are ascending a mountain whose peak has been surveyed. That is a rare and wonderful thing to be able to say of any human pursuit.

Do not let that trouble you, as it troubles the beginner who says, "if the game is a draw, why play?" I will answer that fully in its place, but hear the seed of the answer now: that a river is known to reach the sea does not row the boat, and does not spare the boatman from reading every bend. The truth of checkers lives at infinity, in the reach of perfect play; but you and I are finite, and our opponent across the board at the club is finite, and between two finite minds the game is as sharp, as fierce, and as beautiful as it ever was. Marion Tinsley, the greatest player who ever lived, knew the game was almost certainly a draw, and still he sat down over the board for fifty years and beat nearly every human he ever faced. The solved game and the living game are two different things, and you will come to love them both.

We stand also in a proud lineage, and I will not let you forget it. The strategic board game is not a European gift to Africa; the continent that gave the world *oware* and *ayo* — games of counting and foresight older than any European kingdom — took the draughts board when it arrived and made it utterly its own. In Senegal, a man named Baba Sy rose from the boards of Dakar to the summit of world draughts, reckoned the finest player alive in his day, the first African to sit at the top of the game before his life was cut short in 1978. Every roadside master who slaps his piece down with a crack and a laugh, surrounded by a leaning crowd, is an heir of that tradition — a mathematician who never called himself one. You are joining that company.

So here is our road, Dear Reader, from zero to archmage. We begin with the board and the humble man who may move only forward, on one color of square, into an unknown country. We will learn the tyranny of the forced capture, the arithmetic of material, the geometry of the opposition, the grammar of the tactical shot. We will study the openings that are named like caravan routes, the middlegame where plans are built stone by stone, and the endgame where — as at the storehouse after harvest — the single extra measure decides everything. Then we will turn and look at the game the way the machine looks at it: the vast branching tree of all possible games, the reasoning called minimax by which a mind chooses, and the great proof that closed the book. And we will end where you began — a human being, over the board, learning to win. The man crosses the whole board to be crowned a king. So will you.

Let us set out the pieces.

---

## Part I: The Board and the Kingdom of the Diagonal

### Letter 1: On the Board, the Thirty-Two Dark Squares, and Why Only the Diagonal Lives

Dear Reader,

Take out the board and set it between us, for we must begin exactly where the game begins — with the ground it is played upon. You see sixty-four squares, thirty-two light and thirty-two dark, arranged in the familiar checkered pattern. And your first lesson is a small shock: *half of this board does not exist.* The pieces of checkers live, move, capture, and are crowned entirely upon the thirty-two dark squares. The light squares are never touched by any piece in the whole course of any game. Two-thirds of the board's surface, by area, is pure decoration. We play on a kingdom of thirty-two, and the other thirty-two are only the spaces between.

Why should this be? It follows, with perfect inevitability, from a single rule you already half-know: *the pieces move diagonally.* A piece steps not straight ahead onto the next square, but slantwise, corner to corner. And here is the geometry that a mathematician's eye catches at once: on a checkered board, a diagonal step *always lands on a square of the same color.* Start on a dark square, step diagonally, and you arrive on a dark square; step again, dark again, forever. A piece that begins its life on a dark square can never, by any legal move, set foot on a light one. The color of the square you start on is a prison and a birthright — you belong to that color for the whole of the game. Because every piece begins on dark, every piece stays on dark, and the light squares stand empty from the first move to the last, like rooms in a house whose doors were bricked up before anyone moved in.

Let us fix the geography with names, for we cannot discuss a country whose places have no names. By long convention, the thirty-two dark squares are numbered 1 through 32, running left to right and top to bottom from Black's side of the board:

```text
    1   2   3   4        <- Black's back rank (Black's crowning row is far side)
  5   6   7   8
    9  10  11  12
  13  14  15  16
    17  18  19  20
  21  22  23  24
    25  26  27  28
  29  30  31  32         <- White's back rank
```

Black's twelve men begin on squares 1 through 12; White's twelve men begin on squares 21 through 32; and the eight squares in the middle — 13 through 20 — begin empty, the contested no-man's-land where the two armies will first meet. Black moves first, and Black's men advance toward the higher numbers, downward across the board; White's men advance toward the lower numbers, upward to meet them. Commit this numbering to memory as you would the map of your own town, for every move we ever discuss — every "11-15," every "22x15" — is spoken in this language, and by the end you will read a string of numbers and see a battle.

Here is the isomorphism, and it is worth pausing over, for it teaches a lesson far larger than checkers. **The dark-square kingdom is a walled quarter of the city in which every street runs on the diagonal, and no resident may ever step into the quarter next door.** Imagine a town divided into two interlocking neighborhoods, dark and light, so cunningly laced together that they share every corner yet no street crosses between them — every road runs slantwise, corner to corner, staying always within its own quarter. A person born in the dark quarter may walk its every street, meet its every neighbor, rise to its every honor — but the light quarter, though it is *right there*, close enough to touch at every corner, is a world he will never enter. The two quarters coexist on the same ground and never interact. This is precisely the life of a checker: the whole drama of its existence unfolds on thirty-two squares, and the thirty-two squares of the other color are a parallel world it cannot reach. When you understand this, you understand why checkers, for all it shares a board with chess, is a fundamentally *smaller and purer* universe — and it is that very smallness, that ruthless restriction to one color and one kind of step, that will let the game be understood, and one day solved, as chess never has been.

Sit with this first truth, Dear Reader, for it is the seed of the whole book: *constraint is not the enemy of depth; it is the source of it.* The game did not become shallow by throwing away half the board — it became deep. By forbidding the light squares, by permitting only the diagonal, the game concentrated all its force onto thirty-two points and made every one of them matter. The greatest beauty we will find in these letters — the forced captures, the opposition, the elegant endings, the very solvability of the game — all of it grows from this austere beginning: a kingdom of thirty-two dark squares, and a single law that you may travel only on the diagonal. From so little, so much. That is the signature of a thing designed with genius, and it is the first thing that should make you love the game.

### Letter 2: On the Men, the Kings, and the Two Laws of Motion

Dear Reader,

We have the board; now let us breathe life into the pieces that stand upon it, for a checker is not one kind of thing but two, and the transformation from the first kind into the second is the beating heart of the game and the central image of this entire treatise. There is the *man* — the ordinary piece, the single disc with which every piece begins its life — and there is the *king*, the crowned piece it may become. Almost everything you will ever learn about strategy flows from the difference between these two, so let us understand each precisely.

The **man** obeys a single, austere law of motion: *it moves one square diagonally forward, and forward only.* Never sideways, for there is no sideways on the diagonal. Never backward, not one step, not ever. A Black man on square 11 may step to 15 or to 16 — the two dark squares diagonally ahead of it — and to nowhere else. If those squares are occupied or off the edge, the man on 11 simply cannot move at all. The man is like an arrow already loosed: it knows only *ahead*. This forwardness is not a small detail; it is a profound limitation and a profound engine. It means every man is on a one-way journey across the board, spending itself as it advances, unable to retreat from a mistake, committed with every step to the country in front of it. A man is *youth*: it can only go forward into the world, and it cannot take back a single stride.

But let a man complete the crossing — let it reach the farthest row, the opponent's back rank, the row of squares 29-32 for a Black man or 1-4 for a White man — and something wonderful happens. It is **crowned**. A second piece is placed atop it (this is why you keep the captured pieces near the board), and it becomes a *king*. And the king obeys a new and larger law: *it moves one square diagonally, forward or backward, as it pleases.* The crown does not make the king faster — in our game, the English game, a king still moves just one square at a time, and does not go sliding down the whole diagonal as the "flying kings" of the international game do. What the crown grants is not speed but *freedom of direction*. The king can advance and retreat, come and go, control squares behind it as well as before. This one new power — to move backward — roughly doubles a piece's usefulness. A single king can often hold off two men; the side that crowns the first king frequently wins the whole game. The crown is the great prize, and the race to reach the back rank is the deep current running beneath the surface of every game you will ever play.

```text
   a Black MAN on 11 may go:        a Black KING on 11 may go:
        -> 15,  -> 16                   -> 15, -> 16  (forward)
        (forward only)                  -> 7,  -> 8   (backward too)
```

Here is the isomorphism, and it is the one I most want you to hold, for the whole book is built upon it. **The man is the youth who may travel only forward into the world; the king is the elder who has crossed the whole country and earned the right to look back.** Consider the young person who sets out from the compound — he goes forward, always forward, into the unknown territory of his life. He cannot un-live a year; he cannot step back into the past to repair a choice; each stride commits him further from home. But should he cross the whole of that country — should he complete the long journey, endure it, arrive at the far side — he is transformed. The community sets a crown upon him: he becomes an elder, and the elder possesses precisely the power the youth lacked. The elder can look *backward* as well as forward — can return in memory and in counsel to any part of the road, can guard the young coming up behind him as well as face what lies ahead. The elder's authority is not swiftness; it is *the freedom of both directions*, bought by the completed journey. This is exactly the man and the king. The man marches forward and cannot return; the king, having crossed, commands both directions. And you, Dear Reader, are the man at the start of this book: bound for now to go only forward, one hard-won letter at a time — until you have crossed the whole board of this subject and earned your crown.

Understand, then, that checkers has a *direction* to it, a grain, a current, that chess does not. The pieces flow forward, converting themselves from limited men into powerful kings, and the entire strategy of the game is shaped by this flow — by the race to crown, by the value of the back rank that stops the enemy from crowning, by the way a position "ages" as men advance and the board empties toward its decisive end. Every principle we will meet grows from these two laws of motion: forward-only for the man, both-ways for the king. Two rules, and from them an ocean. Hold them fast, for in the next letter we meet the third and strangest law of all — the law that a capture, once available, *must* be taken — and there the game will begin to show you its teeth.

### Letter 3: On the Forced Capture — the Tyranny That Is the Soul of the Game

Dear Reader,

We come now to the rule that transforms checkers from a gentle race across the board into a game of blades — the rule that, more than any other, gives the game its depth, its traps, its dazzling combinations, and its terror. It is the law of the *forced capture*, and I call it a tyranny because it strips from you, at the crucial moment, the very thing you most prize: your freedom to choose. Understand it deeply and you hold the key to every combination in the game. Understand it shallowly and you will be led, again and again, like an ox by the nose, into ruin.

First the mechanics, precisely. A piece captures by *jumping*: when an enemy piece sits on a square diagonally adjacent, and the square immediately beyond it — in the same diagonal line — is empty, you leap your piece over the enemy, landing on that empty square, and you remove the jumped enemy from the board. A man may only jump in its forward directions; a king may jump forward or backward. So far this is like any capture in any game. But now the tyranny: **if a capture is available to you, you are not permitted to decline it. You must jump.** You may not make a quiet developing move while a jump sits on the board; the jump compels you. And there is more: if, upon landing from a jump, your same piece finds *another* enemy it can jump, it must continue — jumping again, and again, chaining through as many captures as the position allows, all in a single turn, until no further jump is possible for that piece. The multiple jump is one move, and it is compulsory to its very end.

Let us see it on the board with a real and common sequence. Suppose the game opens:

```text
1.  11-15   22-18
```

Black advanced a man from 11 to 15; White advanced from 22 to 18. Now look: Black's man on 15 sits diagonally adjacent to White's man on 18, and the square beyond — 22, now vacant — is empty. A jump exists. Therefore Black *must* take it; no other move is legal:

```text
    15x22          (Black jumps 18, landing on 22; the man on 18 is removed)
```

And now it is White's turn, and behold — White's man on 25 sits adjacent to the Black man newly arrived on 22, with square 18 empty beyond. White, too, is compelled:

```text
                   25x18   (White jumps 22, landing on 18; recapturing)
```

An even exchange, one man for one man — but notice that *neither player chose it freely*. The forced-capture rule marched them both. Now imagine the enemy piece you are compelled to jump has been placed there *deliberately, as bait* — so that your forced leap carries your piece away from where it was guarding, or into a position where a second, larger capture crashes down upon you. That is the *shot*, the combination, the sacrifice, and it is the glory of checkers. A player gives you a man, knowing you *must* take it, precisely because taking it destroys you. The whole art of tactics, which we will study at length, rests on this single rule: because the jump cannot be refused, it can be *weaponized*.

Here is the isomorphism, and every trader and every householder will feel its truth. **The forced capture is the debt that must be settled before any other business of the day may proceed.** Imagine a rule of the marketplace so strict that if a creditor presents himself at your stall, you must pay him then and there, in full, before you may buy, sell, or move a single other thing — you have no choice, the debt seizes your hand first. Ordinarily this is merely the honest order of commerce: debts get paid, the books stay balanced, an even exchange. But now imagine a cunning rival who *contrives* to become your creditor at the exact moment when paying him will empty your purse just as the great opportunity of the year walks past — knowing that the rule will compel you to pay him and let the opportunity go, that your obligation will drag your hand exactly where he wishes it. He has not out-fought you; he has used *the rule that binds you both* against you alone. That is the forced jump. The compulsory capture is the debt you cannot defer, and the master is the one who arranges the board so that your unavoidable obligation becomes the instrument of your defeat. The tyranny that binds you binds your opponent too — and the deeper player is simply the one who sees, first, whose hand the rule will move, and to what end.

So do not think of the forced capture as a mere rule of removal, Dear Reader. Think of it as the *engine of compulsion* that runs beneath the whole game — the reason checkers rewards calculation over improvisation, foresight over reflex. In a game where you could always decline a bad trade, cunning would count for little. It is precisely because the jump *cannot* be refused that the board becomes a place of set traps and sprung snares, of sacrifices offered like poisoned gifts, of long forced sequences that a strong player sees to the end before touching a piece. The constraint that seems to rob you of freedom is the very thing that fills the game with depth. Once more the signature of genius: take something away — here, the freedom to refuse a capture — and receive, in exchange, a universe. In the next letter we give this universe its written language, so that we may speak of its wonders exactly.

### Letter 4: On Notation — Giving Every Square and Move a Name

Dear Reader,

Before we may study the great combinations and endings, we must be able to *write them down*, for a truth that cannot be recorded cannot be studied, compared, or taught. Euler could reason about the planets because he could write their positions as numbers; we shall reason about checkers because we can write every move as a number. This letter is short and practical, but do not skip it, for it hands you the key to every book of the game, every recorded match of the old masters, every problem and solution in the literature. Learn to read this language and the accumulated wisdom of two centuries opens to you.

You already have the foundation: the thirty-two dark squares, numbered 1 to 32, from Black's side downward. That numbering is the entire alphabet. Every move in checkers is written as two numbers — the square a piece leaves and the square it arrives on — joined by a mark that tells you *what kind* of move it was. A quiet move, a simple step, is written with a hyphen:

```text
    11-15      means: the piece on square 11 moves to square 15
    22-18      means: the piece on square 22 moves to square 18
```

A capture — a jump — is written with an "x" (for "takes") instead of a hyphen:

```text
    15x22      means: the piece on 15 jumps an enemy and lands on 22
                      (the jumped man, on 18, is removed)
```

And a multiple jump is written by naming each square the jumping piece lands on, in order, strung together with x's:

```text
    11x18x27   means: one piece jumps twice in a single move,
                      landing first on 18, then on 27,
                      removing an enemy at each leap
```

By convention we number the moves of the game and give Black's move first, then White's, just as in the sequence you saw in the last letter:

```text
    1.  11-15   22-18
    2.  15x22   25x18
```

Read that, and you can replay the exact position on any board in the world. That is the miracle of notation: four small numbers and two symbols have captured a complete sequence of events, transmissible across any distance and any span of time. A game played in a club in Accra in 1950 can be set up, move for move, on your board tonight, because someone wrote it in this language.

Here is the isomorphism, and it is one of the oldest and most powerful ideas humankind ever seized. **Checkers notation is writing itself — the capturing of a fleeting event in permanent, transmissible marks.** Consider what happened when human beings first learned to write: a spoken word vanishes the instant it is uttered, alive only in the fragile memory of those who heard it, dying with them. But a *written* word endures — it can be carried to a person who was not present, kept for a person not yet born, compared against a thousand other words, studied, corrected, built upon. Writing did not add a new sound to speech; it made speech *permanent and portable*, and in doing so it created history, law, mathematics, and science — for none of these can exist without a record that outlives the moment. Checkers notation is this same act, performed upon the moves of a game. A move made and unmade upon the board is a spoken word, gone the instant the hand lifts. Written as "11-15," it becomes permanent: it can be sent to a master across the sea, preserved for a student across the century, laid beside ten thousand other games to reveal which openings win and which lose. The griot held the history of a people in living memory, and it was a marvel; but the written record holds it against forgetting forever. Notation is the griot of the checkerboard, and once you can write the game, you inherit everyone who ever wrote it before you.

So take an hour, Dear Reader, and make this alphabet your own: sit before the board and read the numbers 1 to 32 until you can find any square without counting, until "15" leaps to your eye as a face leaps from a crowd. It is the least glamorous labor in this whole book and among the most important, for it is the difference between a player who must reinvent the game from nothing and a player who stands on the shoulders of every master who recorded a game before him. We have now the board, the pieces, the two laws of motion, the tyranny of the capture, and the written language to speak of them all. The foundation is laid. In the letters that follow we begin to *build* — to learn the arithmetic of material, the geometry of the opposition, and the grammar of the tactics by which games are won. The pieces are set; the language is ours; let us begin, at last, to play.

## Part II: The Elements of Force

### Letter 5: On Counting Material and the Value of a Man

Dear Reader,

Before a player learns the deep music of tempo and opposition, he must learn to count. Material — the simple number of men each side commands — is the first and truest compass a beginner can hold. You begin with twelve; your opponent begins with twelve. Every capture shifts this balance, and the balance, more than any single square or clever thrust, tends to decide who walks away the master. When two players of equal skill sit under the mango tree, the one who ends a man ahead almost always wins. This is not a rule of thumb only; it is a near-law of the board, and understanding *why* it holds will teach you more than a hundred memorized traps.

Here is the thing the beginner does not expect: an advantage of one man is worth almost nothing in the opening crowd and nearly everything in the empty endgame. Consider the arithmetic of the crowd. Twelve against eleven is a ratio of about twelve to eleven — a mere ninth, a whisper. With twenty-three men jostling on thirty-two squares, that one extra fellow can scarcely find room to matter; he is one voice in a shouting market. But watch what happens as the board empties. Trade evenly, man for man, and the ratio grows:

```
   crowd:   12 : 11   (edge  ~ 9%)
   midgame:  6 :  5   (edge   20%)
   endgame:  3 :  2   (edge   50%)
   the end:  2 :  1   (edge  100%)
   truth:    1 :  0   (the win)
```

Notice the paradox, and let it sink in, for it is the secret hidden inside every even exchange: **the side that is ahead should trade, and the side that is behind should refuse.** Each fair swap — one of yours for one of his — leaves the same numerical gap but *magnifies* its proportion. The extra man grows in power the fewer his companions become, until at last he is the only man on an open board, free to hunt down the enemy's final piece and pin it in a corner where it cannot move. A player with no legal move loses; the lone extra man is the one who delivers that verdict. So the equal trade is never truly equal — it quietly serves whoever already leads.

Here is the isomorphism, and it comes straight from the farm at the two ends of the season. **The extra man IS the extra hand at harvest — small in the crowded field, decisive at the near-empty storehouse.** Picture the planting season, when the whole village works the land: fifty hands or fifty-one, who could tell the difference? One more back bent among fifty is lost in the throng; the field is vast and the labour shared thin. But now come to the last cold week of the harvest, when the granary is nearly full and only two workers remain to carry the final sacks up the ladder before the rains. Now let one household have *two* workers and the other only *one*. The difference is no longer a whisper — it is everything. The two finish and seal the grain; the one is caught by the rain and loses the crop. The same single hand that vanished in the crowd of planting becomes the master of the storehouse when the crowd has gone home. The board empties exactly as the season empties, and the extra man ripens into a king-maker precisely as his fellows fall away.

This is why the material count is the beginner's compass and never a beginner's crutch to be outgrown. The grandmaster still counts; he has merely learned to count further ahead, to see the man he will be up *after* the coming storm of exchanges. When you sit down to play, let this be your first discipline: after every flurry of captures, pause and count. Twelve and twelve — dead level, all to play for. Twelve and eleven — you hold a seed that the endgame will grow into a tree. And when you are the one behind, do not despair, but do not simplify: keep the men on, keep the field crowded, deny your enemy the empty storehouse where his extra hand would reign. To count material is to read the future weather of the game while the sky is still clear — and there is a quiet awe in that, that so vast a struggle should, at its root, obey a truth as plain as counting hands at harvest.

### Letter 6: On the King — the Piece That Sees Both Ways

Dear Reader,

Every man on the board is born under a hard law: he may move only *forward*. A black man walks toward the higher numbers, a white man toward the lower, one diagonal step at a time, and he may never retreat — not to escape danger, not to answer a threat behind him, not for any reason under heaven. He is like a traveller on a road with no return, committed wholly to the country ahead. And yet this same bound and forward-only creature carries within him the possibility of transfiguration. Let him but cross the entire board and set foot on the farthest rank — the enemy's home row — and he is crowned. He becomes a *king*.

Watch the crowning itself, for it is the beating heart of this whole book. A black man stands on square 26, two steps from the enemy's king-row, which for Black is the row of squares 29 to 32:

```
 .  .  b  .      (25-28: b on 26)
.  .  .  .       (29-32: empty, the king-row)

        after 26-30:

 .  .  .  .      (25-28)
.  B  .  .       (29-32: B on 30 — crowned)
```

He steps to 30, and in that instant the humble `b` becomes a royal `B`. What has he gained? The one thing he never had: the power to look back. A king moves and captures diagonally *forward and backward* — one square in any of the four diagonal directions. (Our English king is a modest sovereign; he steps a single square, not the long-gliding "flying king" of the international ten-by-ten game. But even one step in every direction is a mighty gift.) The man could threaten only the country ahead; the king commands the whole compass of the diagonals, and no enemy can any longer creep up behind him in safety.

This is why a king is worth not one man but roughly one and a half, and often more when the board is open. A man is a spear that points only one way; a king is a spear that points four ways at once. In the endgame his value swells further, for a lone king can chase, corner, and trap men who cannot turn to face him. And here is a truth that decides countless games between good players: **the first king often wins.** When the men have thinned and both sides race a runner toward the crowning row, the player who crowns *first* gains a piece that can range the board and harry the enemy's runner before it, too, is crowned. The race to the king-row is therefore not a sideshow but frequently the main event; a single tempo in that race can be the difference between a monarch and a subject.

Here is the isomorphism, and it is the very shape of a human life in the village. **The man is the youth who may only go forward into the world; the king is the elder who can also look back.** The young man leaves his father's compound and walks into life — he takes a trade, a wife, a farm — and every step commits him further; he cannot un-marry, un-plant, un-live the years. Like the man on the board he knows only the country ahead, and his strength is his forward hunger. But let him cross the long board of a whole life and reach the far rank of age, and he is *crowned* with something the youth could never possess: the power to look *both* ways. The elder under the palaver tree sees the road ahead as all men do — but he also sees the road *behind*, the pattern of what has been, the memory of how this same quarrel ended the last time it was fought. That double sight — foresight married to hindsight — is precisely the king's power to strike forward and backward alike. The community crowns its elders for the same reason the board crowns its men: because a creature that sees only forward is strong, but a creature that also sees back is *wise*, and wisdom, on the board as in the village, tends to win.

So when you push a man toward that farthest row, know that you are not merely gaining a stronger piece — you are enacting the oldest drama there is, the passage from the forward hunger of youth to the two-eyed wisdom of the elder. The whole book is this single march. You are the man; the crown is waiting on the far rank; and the awe of the game is that so small a wooden disc, by crossing a board, should teach the deepest thing we know about becoming wise.

### Letter 7: On Tempo and the Move as a Resource

Dear Reader,

We have counted men as though they were the only wealth on the board. But there is a second treasury, invisible to the beginner, that the master guards as jealously as any man: *tempo* — the move itself, considered as a thing that can be spent well, spent poorly, or squandered altogether. In checkers you and your opponent move strictly in turn; you get one move, then he gets one, forever. Each of these turns is a coin. You will be handed a fixed and precious allowance of them across the game, and the whole art of position is the art of spending your coins to buy something while your opponent spends his to buy nothing.

Consider two black men, equal in material, unequal in worth. One player advances his men toward the crowning row along a purposeful line, each step bringing a runner closer to a king or seizing a central square that cramps the enemy. The other shuffles a man back and forth on the flank — 22 to 25, then, next chance, back the way development would have gone — accomplishing nothing, marking time, burning coins for no goods. After ten moves the two boards may hold the same twelve-and-twelve of material, yet one position is winning and the other is lost, and the entire difference is *tempo well spent versus tempo wasted*. A move given to a square that does no work is a coin dropped in the gutter; you will not be handed a spare to replace it.

But tempo carries a darker face, and I raise it now only to name it, for it will command a whole letter of its own. Sometimes the burden is not that you *waste* a move but that you are *forced to make one at all*. There come positions — you will meet them at the empty end of the board — where every legal move you own makes your position worse, where you would give anything to *pass* and simply stand still, and the iron law of the game forbids it: you must move. To be compelled to move when all moves are poison is the deepest curse in checkers, and it has a name we will honour next: the opposition, the tyranny of "the move." For now, only hold this seed — that a move is not always a gift; sometimes it is a debt you are dragged forward to pay.

Here, then, is the isomorphism, and it belongs to the palaver tree where our elders settle the affairs of the village. **Tempo IS the turn to speak at the palaver — each turn is precious, and the one who squanders his turns loses the debate though his cause be just.** Watch how a matter is decided under the tree. The council does not let all men speak at once; each in turn is given the floor, and while he holds it, he alone may shape the argument. A wise elder, granted his turn, advances the cause — he lays down a fact, binds an agreement, moves the whole assembly one step toward the verdict he seeks. A foolish man, given the very same turn, wastes it: he repeats what is known, boasts, circles back to where he began, and sits down having moved nothing. Turn after turn the wise man's cause creeps forward and the fool's stands still, until the sun goes down and the matter is settled — and it is settled for the one who *used* his turns, not for the one who merely *had* them. A just cause, poorly spoken across many wasted turns, loses to a lesser cause pressed home. The floor of the palaver and the move of the board are the same coin: a strictly rationed chance to change the world by one step, given and gone, never refundable.

So learn to spend your moves the way the good elder spends his words — never idly, always toward the verdict. Before you touch a piece, ask what this move *buys*: a square, a tempo in the crowning race, a threat the enemy must answer and thereby lose his own turn to. If it buys nothing, look harder, for a nothing-move is a silent gift to your foe. The board, you begin to see, is not merely a field of pieces but a shared and dwindling account of turns, and mastery is thrift — the patient, unglamorous thrift of never wasting a single coin of time. There is a quiet grandeur in this: that a game so bounded, where each side gets exactly one move and then must yield, should reward not the loud hand but the frugal one, the elder who knew that a turn to speak, like a move on the board, is a small eternity you are given only once.

### Letter 8: On the Opposition and the Geometry of Whose Turn It Is

Dear Reader,

Now we arrive at the concept that separates the club player from the man who merely knows the rules — the deepest and most beautiful idea in the endgame of checkers. It is called *the opposition*, or simply "the move," and it is the art of arranging matters so that it is your opponent's turn precisely when every turn is a wound. Recall the dark face of tempo from the last letter: the position where you long to pass but the law forbids it. The opposition is the science of *forcing that curse upon the enemy* — of standing your pieces so that he, not you, is the one compelled to move into ruin. This is *zugzwang*, the "compulsion to move," and mastering it is mastering the end of the game, where the truth of a single extra man is finally cashed.

Let me show you its bones with two kings on a single diagonal. Black holds 14; White holds 23; the square 18 lies empty between them, and 14, 18, 23 are three points of one diagonal line:

```
 .  B  .  .      (13-16: B on 14)
 .  .  .  .      (17-20: 18 empty, between)
.  .  W  .       (21-24: W on 23)
```

The two kings face each other across the empty square like two men across a narrow doorway. Now ask the only question that matters: *whose turn is it?* Suppose it is White's. White must move — the law allows no pass. If he advances into the doorway, 23-18, he steps onto a square where the Black king jumps him: Black plays 18-jump and White is gone. So White dares not advance; he must step aside instead, giving ground, retreating, surrendering the confrontation — and in a confined corner, with no safe square to step to, giving ground means losing the piece or being pinned into a position with no move at all. The player who does *not* have to move holds the opposition; the player forced to move first must yield. Whoever can arrange that the *other* man moves first, into a losing shift, wins.

Now I must be honest with you, as one climber to another, for the beauty of this idea lives in its exactness. On the wide-open board, the king forced to move often simply walks away to a far, safe square, and the position is a draw — this is why a lone king can save himself by fleeing to the double corner, that snug fortress of two diagonally joined squares where he shuttles forever and cannot be trapped. The opposition *bites* — it becomes a win rather than a mere staring contest — only where the edge of the board or the walls of a corner have stripped away the escape squares, so that "step aside" means "step into loss." The two most famous winning endings in all of checkers, the ancient studies called **First Position** and **Second Position**, are nothing but the opposition applied with perfect confinement: the stronger side maneuvers until the weaker king, trapped against the edge, has no move that does not open the door to his own destruction. The winning *idea* is always the same — hand your opponent the move when the move is poison.

And here is a gift for the calculating mind: whether you hold the opposition can be *counted*, not merely felt. There is an arithmetic of "the move" — a method of counting the men in a defined system of squares and reading the parity to know, before you even begin the maneuver, whether the opposition is yours or your enemy's. Masters count it as surely as you count material; the number tells them who is doomed to move first. I will not drown you in the tally here, only assure you that the staring contest is governed by a hidden parity you can learn to compute, and that this is one of the places where checkers reveals itself, quietly, as pure mathematics.

Here is the isomorphism, and it is written in the bodies of two elders and two wrestlers. **The opposition IS two elders in a silent staring contest — two wrestlers each waiting for the other to shift his weight — and the one forced to move first concedes his balance.** Watch the wrestlers at the village festival before the lock: they stand gripped, motionless, each perfectly poised, and each *waiting*, because both know a secret older than the board — that the man who shifts his weight first opens a line the other will exploit; to move is to commit, and to commit before your enemy is to be thrown. So they wait, and wait, and the whole contest is decided not by who moves best but by who is *forced* to move first. So too the two elders locked eye to eye in a matter of honour: the one whose nerve breaks, who must speak or look away first, has already conceded. Stillness is strength; the compulsion to break stillness is defeat. The board makes this ancient truth into geometry: he who must move first steps off his balance, and the patient one, who arranged to move second, throws him. Sit with the wonder of it — that the end of a game of checkers should come to rest on the very same knife-edge as two wrestlers in the dust, where victory belongs not to the stronger push but to the one who was not forced to push at all.

## Part III: The Grammar of Tactics

### Letter 9: On the Shot — the Combination That Wins Material by Force

Dear Reader,

We have spoken of winning a man slowly, by thrift and by opposition. Now I will show you how to win two men in a single stroke, by *force*, so that your opponent, no matter how he wishes otherwise, is dragged into his own ruin. This is the *shot* — a combination, usually begun with a sacrifice, that wins material because the enemy's replies are not free. And the engine that makes the shot possible, the single rule without which none of this would work, is the law we met at the start: **captures are compulsory.** When a jump is available, your opponent *must* take it. He cannot decline. He cannot play elsewhere. That iron obligation is the lever by which you will move him exactly where you want him.

Study this position. Black is to move. Black owns two men, on 6 and 9; White owns two men, on 17 and 19:

```
 .  .  .  .      (1  2  3  4)
.  b  .  .       (5  6  7  8)
 b  .  .  .      (9 10 11 12)
.  .  .  .       (13-16)
 w  .  w  .      (17-20)
.  .  .  .       (21-24)
 .  .  .  .      (25-28)
.  .  .  .       (29-32)
```

Materially the sides are dead level, two men each. Yet Black is about to win, and win by force. He plays the sacrifice:

```
   1.  9-14         (Black offers the man to White)
```

Black has thrust a man to 14, planting it directly in the path of White's man on 17. Now the compulsory-capture law seizes White by the collar. White's man on 17 *must* jump the offered man — there is no other capture on the board, and a capture cannot be refused:

```
   2.  17x10        (White is FORCED to jump, landing on 10)
```

And this is the whole point of the sacrifice: White's forced jump has carried his own man from the safety of 17 into the fatal square 10. Now Black springs the trap. His waiting man on 6 leaps:

```
   3.  6x15x24      (Black jumps 10, then jumps 19 — a double)
```

The man on 6 jumps the White man now sitting on 10, lands on 15, and from 15 finds a *second* White man on 19 waiting to be taken — one continuous, compulsory chain, 6 to 15 to 24. When the dust settles, Black has given up one man (the bait on 14) and captured two (the men that were on 17 and on 19). Black is a clean man ahead, and by the last letter's teaching, a man ahead in a thinning board is a win. Black did not *hope* White would cooperate; the rules left White no choice. That is the difference between a threat and a shot: a threat can be answered, a shot cannot.

Here is the isomorphism, and every hunter of the savanna knows it in his bones. **The shot IS the trap-pit dug for game — you bait it so that the prey's own forward rush carries it into the deeper capture.** The hunter does not chase the antelope down; he cannot outrun it. Instead he studies the path the animal must take, and there he digs a pit, covers it with light branches, and lays the bait. When the antelope comes and sees the bait, its own nature — its forward hunger, its rush toward the offered thing — carries it onto the false ground, and the very momentum of its lunge drops it into the pit where the hunter waits below. The animal is not defeated by the hunter's strength but by its own compelled motion. The forced jump is exactly this compelled lunge: the sacrifice is the bait, the compulsory-capture rule is the animal's unstoppable forward rush, and the double jump waiting beyond is the deep pit. You do not overpower your opponent; you arrange the ground so that his own obligatory movement destroys him. The best hunters and the best draughts players share a single secret — that a creature *forced* to move toward the bait can be caught by a child, where a free creature could never be caught at all.

So do not think of the sacrifice as a gift; think of it as bait laid over a pit. When you learn to see shots, you stop pushing your pieces and start *setting* them, reading two and three moves ahead to find the offered man that compels the fatal jump. And feel the awe in the mechanism: it is the very rule that seems to bind *you* — the law that you too must capture when you can — that becomes, in the hands of one who sees, the deadliest weapon on the board. The compulsion is the trap. The One who framed the game hid the sword inside the chain.

### Letter 10: On the Two-for-One and the Trade That Isn't Equal

Dear Reader,

The shot in its purest and most common form has a name every motor-park master pronounces with relish: the *two-for-one*. You give one man; you take two. It is the workhorse of winning combinations, the pattern you will spring and suffer more than any other, and once your eye is trained to it you will see its shape glinting in positions that looked, a moment before, entirely calm. Its whole logic rests on the same compulsory law as before, but arranged so plainly that I want you to hold the contrast between a *fair* exchange and this *unfair* one side by side in your mind.

First, the fair exchange, the honest one-for-one. You have a man attacked; you have a man that can recapture. He takes yours, you take his, and the board is one man lighter on each side — a clean swap, no profit, no loss, useful only for the thrift of gaining the opposition or opening a line. That is trade among equals. The two-for-one is a swindle dressed as a trade: you offer what looks like a fair one-for-one, but when the enemy accepts, his forced jump lines up a *second* victim, and you collect twice for what you paid once.

Here is the pattern, seen from the White side so you learn it from both directions. White is to move; Black holds men on 14 and 16; White holds men on 24 and 27:

```
 .  .  .  .      (1  2  3  4)
.  .  .  .       (5  6  7  8)
 .  .  .  .      (9 10 11 12)
.  b  .  b       (13-16: b on 14, 16)
 .  .  .  .      (17-20)
.  .  .  w       (21-24: w on 24)
 .  .  w  .      (25-28: w on 27)
.  .  .  .       (29-32)
```

White spots that Black's man on 16 is the lever. He offers:

```
   1.  24-19        (White advances the man into Black's reach)
```

Black's man on 16 now *must* jump it — the only capture on the board, and captures are compulsory:

```
   2.  16x23        (Black is forced to take, landing on 23)
```

But see what the forced jump has done: it has dragged Black's man to 23, and 23 sits on the same diagonal as Black's other man back on 14, with White's man on 27 poised behind both. White strikes:

```
   3.  27x18x9      (White jumps 23, then jumps 14 — two in one)
```

White gave one man (the offering on 24, taken as it stood on 19) and captured two (the men that were on 16 and on 14). The trade was never equal. This is how you *spot* the two-for-one: look for an enemy man that, the instant it is *compelled* to jump, will land where it exposes a second man behind it — where its own forced motion opens a second door. Whenever an enemy piece can be forced onto a square that lines up two of his men for one of your jumpers, the two-for-one is lurking.

Here is the isomorphism, and it lives in the law of every African market. **The two-for-one IS the merchant who gives a small gift that obliges a larger return.** Go to any great market — Kejetia in Kumasi, Onitsha on the river — and watch the seasoned trader receive a valued customer. He does not haggle first; he *gives* — a handful of extra pepper dropped into the basket, a cold drink pressed into the hand, a small unasked kindness. This gift is not charity; it is strategy older than coin. For by the deep law of reciprocity that binds the marketplace, the one who receives a gift is *obliged* — not by written rule but by a compulsion as binding as any capture law — to return more than he was given, to buy the larger sack, to come back tomorrow, to send his kinsmen. The small gift *forces* the larger return. The merchant loses a pinch of pepper and gains a season's custom. So it is with the sacrificed man: you give the small thing freely, and the enemy, bound by an obligation he cannot refuse — his by the law of the market, the opponent's by the law of the jump — must repay you with two. The wisest traders and the wisest players both know that the surest way to *take* two is to *give* one first.

Sit with the elegance of it. An even trade changes nothing; but a trade made *unequal by force* is the whole engine of victory, and it turns on giving before you take. On the board and in the market alike, generosity with a hidden hook is the deepest cunning there is — and there is a strange grace in a game that rewards the open hand that offers, over the closed fist that merely grabs.

### Letter 11: On the Breeches, the In-and-Out, and the Fork

Dear Reader,

The shot and the two-for-one are the great combinations; but beneath them runs a family of smaller tactical shapes, the everyday tools of the trade, and a player who knows their names sees them the way a carpenter sees joints in timber. I will give you three today — the *breeches*, the *in-and-out*, and the *fork* — and show you at least one alive on the board, so that names become sight.

Begin with the **breeches**, sometimes called the "breeks" for the two legs of a pair of trousers. It is a formation in which two of your men stand a little apart, both aiming at the single square an enemy piece must cross, so that whichever way the trapped man goes, one of your two legs closes on him. Picture two Black men set like the top of a wide "V," with an enemy man caught in the crotch of the breeches between and ahead of them: he steps left, the left leg jumps him; he steps right, the right leg jumps him; he is a man wearing trousers that capture him whichever way he walks. The breeches wins because it removes *choice* — the enemy's freedom to pick a safe square is exactly what has been taken from him.

Next, the **in-and-out**, the darting motif of kings above all. A piece dives *into* the enemy's ranks with a capturing jump and, in the same compulsory chain, jumps *out* again, carrying its plunder and emerging safe on the far side. A king on 14, say, jumps a man on 18 to land on 23, and finding a second man on 27, jumps *out* to 32 — in with one capture, out with the next, the whole raid a single unbroken turn. The beauty of the in-and-out is that the raider is never left standing among enemies to be taken in reply; the same chain that carries him in carries him back out, so he raids without exposure.

But the motif I most want you to *see*, because it is the purest, is the **fork** — one move that threatens two things at once, so that the enemy, able to answer only one per turn, must lose the other. Here is a fork of surpassing cleanliness, using the peculiar power of the king. Black is to move, with a king on 31; White has two men, on 23 and 24:

```
 .  .  .  .      (1-4)
.  .  .  .       (5-8)
 .  .  .  .      (9-12)
.  .  .  .       (13-16)
 .  .  .  .      (17-20)
.  .  w  w       (21-24: w on 23, 24)
 .  .  .  .      (25-28)
.  .  B  .       (29-32: B on 31)
```

Black plays the fork:

```
   1.  31-27        (the king slides between the two men)
```

Now the king on 27 threatens both at once: 27x18 would seize the man on 23, and 27x20 would seize the man on 24. White cannot save both in one move — and here is the sweetness: the two White *men* cannot capture the offending king in reply, for to jump it they would have to move *backward*, down the board, which men are forbidden to do. The king forks with impunity. White rescues one man; Black takes the other; Black wins material by force.

Here is the isomorphism, and it belongs to the hunt at the narrow pass. **The fork IS the hunter who drives two antelope toward one narrow gap in the ridge — both cannot escape at once.** The clever hunter does not pursue two fleeing animals across the open plain, for he would catch neither. Instead he reads the land and finds the single defile through which both must pass to reach safety, and he positions himself where his one spear commands that one gap. Now the two antelope, fleeing together, arrive at the pass where only one can slip through at a time — and while the first squeezes past, the hunter takes the second; his single presence at the chokepoint has doubled his reach, because he chose the one square that governs two escapes. The forking king on 27 stands in exactly that defile: it commands the two diagonals down which both White men would flee, and by occupying the single point that threatens both, it makes the enemy's very plurality his weakness. One spear, one square, two quarries — and only one can be saved.

Learn these three shapes until your eye catches them unbidden, for they are the grammar beneath the poetry of the shot. And marvel that the board should hold, in its thirty-two small squares, the very tactics of the hunt and the harvest — the pincer of the breeches, the raid of the in-and-out, the chokepoint of the fork — as though the game were a field guide to strategy itself, written in wood and diagonal light.

### Letter 12: On the Steal, the Deflection, and Seeing Three Moves as One

Dear Reader,

We have gathered the pieces of the tactician's art — the shot, the two-for-one, the breeches and in-and-out and fork. Now I must teach you the faculty that binds them all, without which every pattern is useless: *calculation*. For a combination is not a thing you stumble into move by move, hoping it works; it is a forced sequence you must **see whole, as a single object, before you commit your first piece.** The master does not touch the sacrifice and then wonder what comes next. He has already walked the entire line to its end — every forced reply, every compulsory jump — and *counted the material at the leaf*, the final position, before his hand leaves his lap. Only then, knowing the outcome with certainty, does he play move one.

Two further motifs will sharpen this seeing. The **deflection** is a forcing move that pulls an enemy man *away from a duty* — away from guarding a square, from blocking a diagonal, from defending a crowning line. You threaten something the enemy must answer, and when his defender leaves its post to answer, the post falls. The **steal** (the "in-and-out's" cousin in spirit) is the quiet theft of a man that seemed protected, won because a preliminary forcing move has stripped its guard. Both depend on the same discipline: you must see, before you begin, that move one *forces* move two, which *permits* move three, which wins. Consider how such a line is held in the mind as one unit:

```
   1.  I threaten     -> he is FORCED to answer (his guard deflects)
   2.  I sacrifice    -> he is FORCED to capture (the law compels him)
   3.  I jump through  -> and at the leaf I count: +1 man.
```

You do not play move 1 to "see what happens." You play it because you have already stood at the leaf — the final board after move 3 — counted the men, seen your advantage, and confirmed that every enemy reply between here and there was *forced*, not chosen. That is calculation: not guessing forward, but reasoning to the end and reading the total, then trusting the chain of compulsion to carry you there. If even one enemy reply is free rather than forced, the combination has a hole and you must not enter it. The whole skill is to distinguish the line where every reply is compelled — where the enemy is a passenger — from the line where he has a choice and can refuse you.

Here is the isomorphism, and it is the very craft of the keeper of the people's memory. **Seeing a combination IS the griot who holds the whole proverb in his mind before the first word leaves his lips.** Watch the griot rise at the gathering to deliver a saying that will settle a dispute or crown a marriage. He does not begin speaking and hope the proverb finds its own ending; that is the babble of a child. Before his first syllable, the entire structure stands complete in his mind — the opening image, the turn in the middle, the closing line that lands like a verdict — the whole arc held as one shape, so that every word he speaks is already bent toward an ending he has *already seen*. He commits to the first word only because he has stood at the last. So too the master calculates the final capture before he touches the first piece: the sacrifice on move one is spoken with total confidence precisely because the counting at the leaf is already done, the ending already known. The griot who improvises blindly and the player who pushes wood hopefully are the same failing man; the griot who sees the whole proverb and the player who sees the whole combination are the same master. Both hold the end in mind before the beginning, and both, for that reason, land like a verdict.

And so, Dear Reader, we close this part of our journey where the tactics become a *grammar* — the grammar you must now internalize until it is silent and automatic, the way the griot no longer thinks of the shape of the proverb but simply *is* the proverb as he speaks it. Material, the king, tempo, the opposition, the shot, the two-for-one, the fork, the deflection: these are no longer curiosities to admire but the living language in which the truth of a position is written. When you can read a forced line to its leaf and count the men there before you have moved, you have crossed a threshold — you have begun to see the board as it *is*, as the mathematician sees it, as the truth of the position existed before any player arrived to find it. The pieces have not changed; your eyes have. And there is a deep awe in that crossing: that a game of wooden discs on a checkered field should demand of its master the very same gift as the griot and the sage — to hold the whole in mind before committing the part, to know the ending before speaking the beginning, and so to move through the world not by hope but by sight.

## Part IV: Positional Wisdom

### Letter 13: On the Center and the Control of the Board

Dear Reader,

We have learned the pieces and their laws; now we must learn the *land* on which they contend, for a draughts board is not a featureless plain. It has a heart and it has edges, and the difference between them decides more games than any single clever stroke. Today we study the center — squares 14, 15, 18, and 19 and the ring around them — and why every master, from the boy under the mango tree to Baba Sy himself, reaches for it from the very first move.

Begin with a truth about the man that we have not yet weighed fully: his power *is his choices*. A man in the belly of the board, on square 15, has before him two forward squares to move into — 18 and 19 — and, should an enemy blunder within reach, two directions in which to strike. But drive that same man to the wall — to square 12, or 21, or any square on the outer edge — and watch half of him die. An edge man has only *one* forward square, only *one* line of capture. He cannot be attacked from the side that does not exist, true, but neither can he attack there, nor flee there, nor support a comrade there. The wall that shelters him also imprisons him. This is the first law of position: **the value of a man is the number of his options, and the center multiplies options while the edge halves them.**

Look at the two men and count for yourself:

```
 .  .  .  .      (1  2  3  4)
.  .  .  .       (5  6  7  8)
 .  .  .  b      (9 10 11 12)   <- edge man on 12: moves only to 16
.  .  b  .       (13-16)        <- center man on 15: moves to 18 OR 19
 .  .  .  .      (17-20)
.  .  .  .       (21-24)
 .  .  .  .      (25-28)
.  .  .  .       (29-32)
```

The man on 15 commands two roads forward; the man on 12 commands one. And what is true of a single man is true of an army: the side whose men stand in the center can swing to either wing, threaten on either diagonal, and answer a thrust wherever it comes. The side pinned against the edges must commit early, telegraph its intentions, and shuffle its cramped men along a single file. Mobility is not a luxury in draughts — it is the very substance of advantage before any piece is won, because the player with more choices will, given equal skill, find the good move that his cramped opponent cannot even reach.

Here is the isomorphism, and it is written into the very shape of every African town. **The center of the board IS the market square, and the roads that run from it to every quarter.** Consider Kumasi, or Onitsha, or Kejetia — the great market at the heart, and from it the roads spreading like spokes to every neighborhood, every gate, every farm road beyond the wall. The trader who commands a stall in the central market touches every quarter of the town: goods flow to him from all directions, and from him to all directions, and whatever happens at any gate, he can reach it. Now picture the trader pushed to the outskirts, to a single dusty lane at the town's edge. One road serves him. He can reach what lies along that one road and nothing else; the life of the town flows past him on channels he cannot touch. He is not poorer in goods, perhaps, but he is poorer in *reach* — and reach is the true wealth of commerce. The center man is the central trader with roads to every quarter; the edge man is the trader stranded on the one lane at the wall. Both may hold the same wares, but only one commands the town.

This is why the contest for the center begins on move one and never truly ends. When Black opens 11-15, the most classic first move in all of draughts, he is not attacking anything — he is *marching to the market square*, planting a man in the heart of the board where it commands the most roads. When White answers 22-18 or 23-19, he contests the same ground. The whole opening, which we shall study soon, is at bottom a quiet war for these central squares, fought with exchanges and threats, each side trying to be the one who commands the crossroads while the other is pressed to the wall.

And so the humblest positional truth turns out to be the deepest. The man who would be crowned must first learn to *stand where he can go*, for the crown is won by mobility as surely as by force. A draughts board is a small country with a market at its heart, and the whole art of position begins with a single question the elders of every trading town have always known to ask: not *what do you hold*, but *what can you reach*? Command the center, and you command the roads to every corner of the kingdom of the diagonal.

### Letter 14: On the Back Rank, the Bridge, and the Dog-Hole

Dear Reader,

We turn now from the market at the board's heart to the wall at its back — for while you press forward toward the crown, an enemy is pressing toward *his* crown on the row behind you, and the row you defend most jealously is your own king-row. Today we learn the architecture of the back rank: how holding it denies the enemy a king, how the formation called the *bridge* guards it, and how a man abandoned in a corner becomes that pitiable thing the old players call a *dog-hole*.

Recall the geography. For White, whose men climb toward the low numbers, the king-row he must defend is squares 1, 2, 3, 4 — for if a Black man reaches any of them, Black gains a king, a piece that sees both ways and roams the whole board. So White has a powerful reason to keep men standing on that back row as long as he can: **an occupied crowning square cannot be crowned upon.** A Black man cannot become a king on square 1 if a White man already sits there blocking it. The back rank is thus not idle — those men are sentries, and every square they hold is a crown denied to the enemy.

But you cannot hold all four squares forever; the men are needed elsewhere, and to nail your whole back row down is its own kind of paralysis. The masters discovered which squares matter most, and the answer is the formation called the *bridge*. For White it is holding squares **30 and 32** — the two squares that stand astride the double corner — while the squares between and before may come and go. Look at it on the board:

```
 .  .  .  .      (1  2  3  4)
.  .  .  .       (5  6  7  8)
 .  .  .  .      (9 10 11 12)
.  .  .  .       (13-16)
 .  .  .  .      (17-20)
.  .  .  .       (21-24)
 .  .  .  .      (25-28)
w  .  w  .       (29-32)   <- the bridge: White men on 30 and 32
```

Why these two? Because 30 and 32 command the approaches to White's double corner — squares 28 and 32 area — the region where, as we shall learn in the endgames, a lone king can shuffle and *draw*. The bridge keeps the gate of the double corner watched from both sides. An enemy man trying to force his way in to be crowned finds that whichever square he lands on, a bridge-man stands ready to answer. For Black, the very same defense stands mirrored at the other end: men on **1 and 3**, guarding Black's own double corner and king-row. The bridge is the classic, sober defense of the back — two watchmen posted, not a whole garrison wasted.

Here is the isomorphism, and every reader who grew up behind a compound wall will feel it in the bone. **The back rank IS the compound wall, and the crowning square IS the gate.** A family's compound is ringed by its wall, and the wall has one weakness that is also its only usefulness: the gate, the gap through which all must pass. Leave the gate unwatched, and it does not matter how high the wall stands elsewhere — the stranger walks straight in, and worse, he walks in *elevated*, as an honored guest with the run of the house, going where he pleases into every room. That is exactly what a crowning is: the enemy man who reaches your unguarded king-row does not merely enter — he enters *as a king*, promoted at your threshold, free thereafter to move backward and forward through your whole position. And the bridge? The bridge is the wise householder posting a watchman on each side of the gate, so that whoever approaches the opening is met from both hands and cannot slip through to be crowned lord of the compound.

Against this stands the sorry figure of the *dog-hole* — a man driven into a corner square, 1 or 32, or trapped in the single corner, with no move and no use. He is not a sentry; he is a prisoner. He blocks nothing that matters, defends no gate, and often cannot move at all without being lost, so that his own player must nurse him or abandon him. The dog-hole is the cousin of the edge man from our last letter, but worse — the edge man had one road; the man in the dog-hole may have none. He is the watchman who has fallen asleep in the ditch outside the wall, useful to no one, a body to be counted against you.

So learn to read your own back as carefully as you read the enemy's front. The march to the crown is a race run in both directions at once, and while you drive forward you must keep the watchmen at your gate. The bridge on 30 and 32, or 1 and 3, is one of the oldest wisdoms of the board precisely because it is one of the oldest wisdoms of the household: a wall is only as strong as its gate is watched, and a kingdom is lost not where its defenses are thickest, but at the one opening left unguarded. Guard your gate, and no enemy is crowned in your house.

### Letter 15: On the Phalanx, the Chain, and Structure

Dear Reader,

We have spoken of single men — one in the center, one at the wall, one asleep in the dog-hole. But men do not fight alone, and today we learn the deepest secret of the draughts board's health: that pieces standing in the right relation to one another are strong beyond the sum of their number, while pieces standing wrongly are weak beyond their poverty. This is the study of *structure* — the phalanx, the chain, and the fatal hole.

Recall first how capture works, for structure grows entirely from it. A man is taken when an enemy sits diagonally adjacent and the square *beyond* him is empty. It follows that a man is *safe* from capture along a given diagonal if the square behind him is occupied — by friend or foe, it does not matter, so long as the landing square for the jumper is denied. From this single fact springs the whole art of formation: **men that stand behind one another on a diagonal defend one another, because there is no empty square for the enemy to land upon.** Two men in a file are not merely two men; they are a mutually-supporting pair, each closing the door behind the other.

Consider a connected structure — call it a phalanx, or a chain:

```
 .  .  .  .      (1  2  3  4)
.  .  .  .       (5  6  7  8)
 .  .  .  .      (9 10 11 12)
.  .  .  .       (13-16)
 .  .  w  .      (17-20)   <- man on 19
w  .  w  .       (21-24)   <- men on 21 and 23
 w  .  .  .      (25-28)   <- man on 26
w  .  .  .       (29-32)
```

See how the men on 26, 23, and 19 stand in a supporting diagonal line, each covering the square behind the one ahead, presenting no empty landing square to an attacker who would jump them. This is a chain: a rope of men, each knotted to the next, that an enemy cannot easily cut because to jump any link he needs a vacancy the next link denies him. Now set beside it the picture of weakness:

```
 .  .  .  .      (1  2  3  4)
.  .  .  .       (5  6  7  8)
 .  .  .  .      (9 10 11 12)
.  .  .  .       (13-16)
 .  .  w  .      (17-20)   <- lone man on 19
.  .  .  .       (21-24)   <- the hole: 23 is empty behind him
 .  w  .  .      (25-28)   <- man on 26, unconnected
w  .  .  .       (29-32)
```

The man on 19 is now *loose*. The square behind him, 23, is a hole — empty ground that offers an enemy the very landing place he needs. This man defends no one and is defended by none; he is the strayer, and the strayer is taken. The difference between the two pictures is not the number of men — three in each — but their *relation*. Structure is not material; it is the geometry of mutual support, and the same pieces can form a fortress or a scattering of victims depending only on how they stand.

Here is the isomorphism, and it is the very meaning of community. **The phalanx IS the age-grade working the field shoulder to shoulder.** In the villages of the Igbo, the Akan, the Zulu, the young men of one age-set go out to the farm or the wall or the harvest *together*, ranged side by side, each within reach of his neighbor's hand. When they work so, no single man can be surrounded, no one cut off and overwhelmed, for to reach one you must pass his brother, and behind that brother stands another. Their strength is not merely twelve pairs of arms; it is twelve pairs of arms *arranged* so that none is exposed. But let one youth wander off alone to a far corner of the bush — proud, impatient, sure of himself — and he is the one the leopard takes, or the one the raiders seize, precisely because no brother stands behind him to close the door. The chain of men on the board is the age-grade in the field: connected, each covering the next, unbreakable while they hold formation; and the loose man on 19 with the hole behind him is the youth who strayed from the line, strong in himself and doomed by his solitude.

This gives you a new eye for the board, and it is the eye of the master. Where the beginner counts pieces, the master reads *relations* — asking of every man: who stands behind you? What lands beside you? Is there a hole at your back? He builds his men into chains and phalanxes that offer the enemy no vacant square to exploit, and he probes the enemy's ranks for the one loose man, the one unfilled hole, the single link not knotted to the rest. For the draughts board obeys the law that governs every people who have survived: that we are strong not as a heap of individuals but as a formation of mutual keeping, and that the one who strays from the line, however brave, is the one the board will take. Stand your men shoulder to shoulder, and they become more than their number; that is the quiet arithmetic of brotherhood, written in wood on thirty-two squares.

### Letter 16: On Weak Squares, Exposed Men, and the Anatomy of a Bad Position

Dear Reader,

We have built the phalanx and honored the chain; now we must learn to perform the harder and more valuable act — to *diagnose*, to look at a position and see its sickness before a single piece is lost. This is the crown of positional judgment, and with it we close our study of structure. For the beginner sees a bad position only after his men are gone; the master sees it while they yet stand, reads the disease in the arrangement, and either avoids it or inflicts it. Today we learn the anatomy of a bad position.

A position sickens in a small number of recognizable ways, and you must learn each by its face. First, the **exposed man** — a piece that stands where the enemy threatens it and that must therefore be *defended*, spending a move or a comrade to keep it alive. One exposed man is a nuisance; two at once are often fatal, for you cannot defend both. Second, the **hole** — a square within your own ranks that you cannot fill, an empty landing-place behind your men that invites the jump, of the kind we saw behind the loose man on 19. Some holes can be filled by bringing a man up; the deadly hole is the one *that cannot be filled*, because every man who might fill it is needed elsewhere or cannot legally reach it. Third, the **self-blocking man** — a piece that stands in the path of its own advance, or jams its own comrades so that they cannot move forward, turning your own army into your own wall. Fourth, the **loose piece** — the man connected to nothing, defended by nothing, whose only future is to be taken or to flee.

Let us diagnose one position together, that you may see how the master reads:

```
 .  .  .  .      (1  2  3  4)
.  b  .  .       (5  6  7  8)   <- man on 6
 .  b  .  b      (9 10 11 12)   <- men on 10 and 12
.  .  b  .       (13-16)        <- man on 15, exposed
 .  w  .  .      (17-20)        <- White man on 18 attacks
w  .  w  .       (21-24)
 .  .  .  .      (25-28)
.  .  .  .       (29-32)
```

Read it as a physician reads a body. The Black man on 15 is *exposed* — the White man on 18 stands ready, and behind 15, the square 19 is empty, a hole; if Black is careless the man on 15 is loose and lost. The man on 12 sits at the edge, half its power gone, and near the dog-hole. The men on 6, 10, and 12 are not knotted into any chain; they are a scatter, not a phalanx. This position is *sick* — not yet dead, for no man is captured, but ailing in three places at once, and against good play it will not survive. That is the whole art: to have named the illness before the funeral.

Here is the isomorphism, and every keeper of animals knows it in his sleep. **A weak square IS the unmended gap in the fence.** A herdsman may have a fence that runs a mile, strong and tall along its whole length but for one place where a post has fallen and left a gap a goat could pass. All night the herd is safe — safe, safe, safe along the whole mile — and it means *nothing*, for the whole safety of the herd is decided not by the mile of good fence but by the single bad gap. The leopard does not test the strong posts; he walks the line until he finds the one opening, and there he enters, and the mile of good fence saves not one goat. So it is with a position: you may have eleven men beautifully placed and one loose man with a hole behind him, and it is the *one* that decides the game, for your opponent, like the leopard, will not batter the strong squares — he will probe patiently until he finds the single gap, and through that gap the whole position is lost. The health of a position, like the safety of a herd, is measured not by its strongest point but by its weakest.

And so positional judgment, the highest of the quiet skills, turns out to be a single discipline: *learning to find your own gap before the enemy does.* The master, before he makes a move, walks his own fence-line — every man, every square behind every man, every road not watched — hunting the one weakness as ruthlessly in his own camp as in his enemy's, and mending it while there is time. This is why two players of equal calculation are not equal at all: the one who *sees the board's health at a glance* has already won the games the other does not yet know he is losing. Learn to read the position as the physician reads the pulse and the herdsman reads the fence, and you will have gained the eye that no memorized line can give — the eye that sees, in a board where nothing has yet happened, everything that is about to.

## Part V: The Openings — the Three-Move Ballot

### Letter 17: On How Games Begin and the Problem of the Draw

Dear Reader,

We have learned to read a position; now we must learn how positions are *born*, and in learning it we shall meet a problem so strange and so beautiful that the elders of the game were forced to change its very laws to solve it. It is the problem of the draw — the discovery that draughts, played perfectly, does not end in triumph but in *balance*, and that this balance, far from being the game's glory, nearly became its death. To understand why tournaments do what they do, you must first feel this problem in your bones.

Begin with the shape of a game. It has three ages, as a life does. The **opening** is the first dozen moves or so, in which the men march out from their home rows and contest the center — the marshalling of forces before real blood is drawn. The **middlegame** is the clash: the exchanges, the shots, the winning and losing of men. The **endgame** is the sparse and truthful finish, few pieces left, where a single man's advantage is ground out to victory by the opposition and the march to the crown. Every game passes through these ages, and the opening — where we now stand — is the setting of the stage, the choosing of the ground on which the later battle will be fought.

Now here is the deep and troubling fact. Draughts, unlike many games, is *nearly balanced from the start* — the two armies are equal, the board symmetric, and neither side begins with more than the small tempo of the first move. And it turns out — this was proven at last in our own age, as we shall learn in the final letters — that with perfect play by both sides, that small first-move edge is not enough to win. The game is a **draw**. Neither the player who moves first nor the player who moves second can force a victory against an opponent who never errs. Between two masters who have studied the same lines, who know the same exchanges, who make no mistake — the game comes, again and again, to a balanced ending that neither can break, and the pieces are gathered up with no victor.

This was, for the strong players of the eighteenth and nineteenth centuries, a slow catastrophe. As knowledge deepened, the best games stopped being *contests* and became *recitations*. Two masters would sit, and each would play the known best moves, and the game would trace a groove worn smooth by a thousand prior games, arriving with dull inevitability at the drawn ending both had seen coming from the first move. The unrestricted opening game — later named **GAYP**, "Go As You Please," because each player was free to open however he wished — collapsed into a small number of deeply-studied lines that all led to draws. The players were not lazy; they were too good. They had, between them, so thoroughly mapped the opening that there was no undiscovered country left in it, and a game with no undiscovered country is a game already over before it starts.

Here is the isomorphism, and it is the truth of every contest between equals who have learned everything. **The drawn master game IS two great wrestlers who know every hold, gripping and standing still.** Watch two champion wrestlers who have trained together for twenty years, who have felt every throw the other knows, who can read a shift of weight before it becomes a move. They lock hands — and nothing happens. Not from cowardice, but from perfection: each knows that any attack he begins, the other has already answered a thousand times in practice; each throw he might attempt leads to a counter he has himself been thrown by; so both stand, muscles straining, in a perfect and motionless balance, and the match is declared even. Their very mastery has frozen them. The more completely two contestants know the same art, the less the art can decide between them — and a contest that cannot decide is no contest at all. That is the drawn game of the masters: not a failure of skill, but skill so complete on both sides that it cancels, leaving two men gripping in stillness where a crowd came to see a fall.

And so the elders faced a choice that every living tradition eventually faces: to let the perfected game calcify into a museum of memorized draws, or to *change the rules to make the contest live again*. They chose life. If unrestricted play had been mapped to death, then play must be *un-mapped* — the players forbidden their comfortable grooves and forced onto fresh ground where memory could not carry them and true skill must speak once more. How the elders did this — by drawing the opening moves from a hat, by the ballot of forced openings — is the subject of our next letter, and it is one of the wisest acts of stewardship any game has ever performed upon itself. For now, hold the wonder of it: that a game could become *too well understood*, that perfection could be a disease, and that the cure was to deliberately reintroduce the unknown. The draw is not the enemy of draughts; it is the proof of its depth. But a depth so fully charted that no one can be lost in it is a depth no longer worth diving — and the elders, loving the game, threw the players back into deep water on purpose.

### Letter 18: On the 3-Move Restriction and the Ballot of Openings

Dear Reader,

We ended with the elders facing a perfected, dying game and choosing to make it live again. Today we learn *how* they did it — the elegant, almost mischievous device by which the masters were torn from their memorized grooves and thrown back onto honest ground. It is called the **restriction**, or the **ballot**, and it is one of the finest examples I know of a community reforming its own laws to preserve the soul of a thing. Understand it, and you understand why serious draughts today is played the way it is.

The device is simple to state and profound in effect: **the first moves of the game are no longer chosen by the players, but drawn by lot from a fixed list of accepted, balanced openings.** The reform came in stages. First came the **two-move restriction**, in which the opening move for each side was decided by ballot before play began. When even that proved insufficient to defeat the deepening memory of the masters, the **three-move restriction** was adopted: the first *three* moves — Black's first, White's first, Black's second — are drawn at random from an approved list, and only then do the players take command of their own destinies. In modern championship play, that list holds **156 three-move openings**, each one tested and accepted as giving neither side a decisive advantage. The players sit; a card is drawn; and they are told, "You will begin thus," and thus they must begin, whether the opening suits their taste or terrifies them.

Consider what this accomplishes. Suppose the ballot deals an opening that plunges a man into a sharp, dangerous position he would never have chosen — a line where one side is cramped, or an exchange looms, or the center is contested in an unfamiliar way. He cannot avoid it; he must play it, and play it *well*, on both sides of the board, for over a match he will be dealt each balloted opening from both colors. He cannot lean on a single beloved line memorized to the endgame. He must understand *many* openings, and understand them deeply enough to survive being thrown into the middle of one at random. The three-move restriction does not reward the man who has memorized the most; it rewards the man who *understands* the most — who can take an unfamiliar, even uncomfortable, position and navigate it by principle and skill rather than by recitation. The game was made rich again by being made unpredictable, and it was made fair again by refusing any player the shelter of his favorite ground.

Here is the isomorphism, and it is drawn from the oldest wisdom of the farming village. **The ballot IS the drawing of lots for which field each farmer works this season.** In many African villages the land is held by the community, and each season the plots are *reassigned by lot* — a farmer does not keep forever the same easy, well-watered field near the stream. Why do the elders do this? Because if the strongest or most favored man always claimed the richest ground, his harvest would prove nothing about his skill and everything about his plot, and the poorer land would never be worked well. By drawing lots, the elders ensure that this season the great farmer may draw the stony upland and the humble farmer the fertile bottom, and *now* we shall see who is truly the better cultivator — for the man who brings a good harvest from hard ground has shown a mastery the man on the easy field never had to prove. The ballot of openings does exactly this to the players: it takes away the well-watered field of the memorized favorite line and deals each master a random plot, easy or hard, so that the game may reveal not who has claimed the best ground but who can cultivate *any* ground. It is the same justice — the justice that separates true skill from mere advantage of position — enacted on the board instead of the land.

And so a game saved itself by an act of humility, and there is a lesson in it that reaches far beyond draughts. The masters could have clung to Go-As-You-Please and to their memorized draws, defending the old law because it favored the learned. Instead they submitted themselves to the lot, accepting discomfort and risk for the sake of a living contest — choosing to be tested on hard ground rather than to reign undisturbed on easy. The three-move ballot made the game harder for the strong, and in doing so made it *deeper* for everyone, opening 156 doors where habit had narrowed the game to a handful. There is no finer thing a tradition can do than to bind its own champions to the lot, and no surer sign that a people love a game more than they love their own advantage in it. The elders threw the players back into deep water; the ballot is the hand that keeps throwing, season after season, so that no one may drown in the shallows of what he already knows.

### Letter 19: On the Great Openings — the Single Corner, the Cross, and Naming the Roads

Dear Reader,

The ballot deals us an opening; now we must learn that these openings are not a formless mass but a mapped country, with named roads, known terrains, and characters as distinct as the faces of men. For centuries the masters have studied the branching paths of the first moves and given them names, so that a player may speak of "the Single Corner" or "the Cross" and be understood exactly, as a caravan-master names the routes across the desert. Today we walk a few of these roads, that you may know they exist and that a lifetime's study lies along each.

Begin where nearly every game of draughts has begun since the game was young: with Black's move **11-15**, the man stepping from square 11 into the center square 15. This is the classic first move, the march to the market square we studied before, and it is the trunk from which the greatest family of openings branches. What White plays in reply names the road. Consider the choices:

```
Black: 11-15    (the classic center move)

White has many replies, each a named road:
   22-18   ->  a sharp, contesting line
   23-18   ->  the "Cross" family     (White crosses to 18 from the other side)
   24-19   ->  a solid developing line
   23-19   ->  another central contest
   22-17   ->  the "Old Fourteenth" family
```

Each of these White replies opens onto different country. When White answers 23-18, cutting *across* the board to meet Black's man, the resulting struggle is called the **Cross** — sharp, tactical, full of early exchanges, a road with ambushes on it, favored by the player who loves complication. When the play develops more quietly, with the men filing out to hold the center without immediate collision, we are in the calmer country of openings like the **Single Corner**, so named for the region of the board around which the early struggle turns — a solid, positional road, favored by the player who trusts patience over fireworks. And the venerable line beginning 11-15, 22-17 has been studied so long under the name the **Old Fourteenth** that its main paths are known many moves deep, a well-trodden highway with famous wells and famous graves along it.

What matters for you, Dear Reader, is not to memorize these lines today — that is the labor of years — but to grasp *what a named opening is*. It is a road whose **character** is known. Some openings are **sharp**: they force early exchanges and tactical crises, and a small mistake is punished at once — these are the mountain passes, quick to reward daring and quick to kill. Others are **solid**: they develop slowly, the men holding hands in chains, the crisis deferred — these are the long steady roads across the plain, where the game is decided by accumulated small advantages rather than a single ambush. A master, dealt an opening by the ballot, knows at once whether he has been placed on a sharp road or a solid one, and shapes his whole plan accordingly, as a traveler told his route knows already whether to expect cliffs or open country.

Here is the isomorphism, and it belongs to the deep memory of the continent. **The named openings ARE the known trade routes across the Sahara.** For a thousand years the caravans crossed the great desert not by wandering but by *named roads* — the route through the salt-pans, the route by the string of oases, the road to Timbuktu, the road to the Bilma wells. Each route had its own character, learned and taught across generations: this one has water here and here but a three-day dry stretch between; that one is shorter but passes the pass where raiders wait; this other is longer but sure. The caravan-master did not know every grain of sand in the Sahara — no man could — but he knew the *roads*: their wells, their dangers, their terrain, their reputation for safety or peril. So it is with the draughts openings. The board holds an ocean of possible games, more than any mind could hold, but the masters have charted the *routes* through the opening — this one sharp with early ambush, that one solid with sure water, this other short but perilous — and named them, so that the knowledge could be carried by the name and passed from master to student like a route passed from father to son. To learn the openings is not to memorize the desert; it is to learn the roads across it.

And so the opening reveals its final beauty: that beneath its apparent freedom lies a mapped and named order, patiently charted by generations who loved the game enough to remember its roads. When you sit to play and the ballot names your opening, you are not stepping into trackless waste — you are setting out on a road that a hundred masters have walked before you, whose wells and ambushes they have marked for your safety, whose character you may learn as the caravan-master learns his route. There is a humbling wonder in this: that the game is at once inexhaustible and mapped, an ocean of sand crossed by known roads, and that to become a master is to become a keeper of those roads, learning them one by one until the whole desert of the opening is, to your eye, a country of named and familiar paths.

### Letter 20: On Opening Principles When You Don't Know the Book

Dear Reader,

We have seen that the openings are named roads, charted across generations — and you may now feel a quiet despair, for there are 156 balloted openings and endless branchings beyond, and you have memorized none of them. Take heart. This final letter of our study of beginnings gives you the thing worth more than any memorized line: the *principles* by which a sound player navigates an opening he has never seen. For the truth the masters know is that you need not memorize the road if you carry the wisdom that keeps a traveler safe on *any* road. Here, gathered, are those principles.

**First: develop toward the center.** We learned it in our very first positional letter and it governs the opening above all — move your men so that they command the central squares, 14, 15, 18, 19 and the roads around them, for the man in the center commands the whole board and the man at the wall commands half of it. When in doubt, march toward the market square. **Second: do not waste tempo.** Every move is a step, and the opening is a race to marshal your forces; do not move the same man twice without cause, do not make idle shuffles, do not spend a move accomplishing nothing while your opponent brings out a new man. The player who develops with purpose arrives at the middlegame with his army in hand while the waster still fumbles at home. **Third: do not expose men.** We learned to read the loose piece and the hole behind it — in the opening, above all, keep your men connected, offer no vacant landing-square to a jumper, advance no man so far ahead of his fellows that he stands alone and undefended. **Fourth: keep your back rank.** Do not, in your eagerness to attack, strip the watchmen from your own gate; hold the bridge, guard the crowning squares, and let no enemy be crowned in your house through a door you opened yourself. **Fifth: avoid early weaknesses** — the hole that cannot be filled, the self-blocking man, the piece driven to the dog-hole. A weakness made in the opening is a debt paid in the endgame, with interest. And **sixth: trade when ahead.** This one is subtle and precious — when you hold an extra man or a better position, *exchange pieces*, for every pair of men swapped brings the sparse endgame nearer, where your one extra man decides everything; the player who is behind seeks complications, the player ahead seeks simplicity.

Notice what these six principles have in common: not one of them requires you to know *which* opening you are playing. They are true on the sharp road and the solid road, in the Cross and the Single Corner and the Old Fourteenth alike. They are not a map of any one route; they are the traveler's own good sense, which keeps him safe on every route. A player armed with these principles and ignorant of every named line will play a *sound* opening — not a brilliant one, perhaps, not the deep prepared novelty of the champion, but sound, safe, and entirely playable against anyone who is not himself a master. And that is the whole aim: to begin *soundly*, so that you reach the middlegame with a healthy position and a fighting chance, whatever opening the ballot deals you.

Here is the isomorphism, and it is the very form in which the wisdom of the continent has always been carried. **The opening principles ARE the elder's proverbs for the young traveler setting out into unknown country.** When a young man of the village prepares to journey to a place none of his family has been, the elders do not give him a map of roads they have never walked — they cannot, for they do not know that country either. What they give him instead is *proverbs*: "Greet the first person you meet in a strange town." "Do not eat where you have not seen others eat." "Sleep with your back to a wall." "Keep your money in more than one place." These sayings are not directions to any particular road; they are compressed wisdom that keeps a man safe on *any* road, in any country, among any people — rules distilled from ten thousand journeys into a form small enough to carry and general enough to apply everywhere. The six principles of the opening are exactly such proverbs, distilled from ten thousand games into rules that keep a player safe on any of the board's roads. The champion knows the map of his chosen routes; but even the champion, thrown by the ballot onto a road he has not studied, falls back on the proverbs — for the proverb reaches where the map runs out.

And so we close our study of beginnings not with a burden of memory but with a gift of wisdom, and it is the better gift. You cannot yet walk every named road of the opening — that mastery is the labor of a life — but you can now set out on *any* road soundly, carrying six proverbs that no ballot can take from you: command the center, waste no tempo, expose no man, guard your gate, make no weakness, and simplify when ahead. With these you may sit against any opponent, receive any opening the lot deals you, and begin as a sound player begins. The march to the crown starts here, at the first move, and you now know how to take that first step well on ground you have never seen — which is, in the end, the only kind of ground any of us ever truly walks. Carry the proverbs, and the unknown country holds no terror; for the wisdom that keeps a traveler safe on every road is worth more than the map of any single one.

## Part VI: The Middlegame

### Letter 21: On Planning — From Tactics to Strategy

Dear Reader,

You have learned to see the shot — the sudden combination that wins a man by force. But a shot is lightning, and lightning does not strike on command. Most of the game is not lightning; it is weather. Between the opening, where the pieces are still being deployed, and the endgame, where the truth is counted, lies the great middle sea of the game, and here the master is not a marksman but a *planner*. Today I will teach you the hardest and most beautiful lesson in the whole art: how to form a plan when nothing forces your hand.

Begin with the question the weak player never asks. He looks at the board and thinks, "What can I do *this move*?" The master looks at the same board and thinks, "What do I want the board to *become*, five moves from now, and what small step brings it nearer?" A tactic answers *what now*; a strategy answers *toward what*. And a strategy is built from three humble questions, asked in order. First: *where is my opponent weak?* — a man that cannot easily be defended, a square he has been forced to abandon, a king-row he has broken open, a cramped wing where his men trip over one another. Second: *how do I aim my force at that weakness?* — not in one blow, but by slowly turning every man's face toward it. Third: *which of my own men is worst placed?* — for the surest improvement of a position is almost never the advance of your best piece, but the rescue of your worst.

Consider a middlegame position. Black has pushed his men forward on the right and left a straggler behind on square 5, in his own double corner, doing nothing. White's men on the left wing are cramped, three of them jostling for two good squares.

```
 .  b  .  b      (1  2  3  4)
b  .  b  .       (5  6  7  8)
 .  b  b  .      (9 10 11 12)
.  .  b  .       (13-16)
 .  w  .  .      (17-20)
w  w  .  w       (21-24)
 .  w  w  .      (25-28)
w  .  .  w       (29-32)
```

Black should not go hunting for a trick. He should *make a plan*: the man on 5 is his worst-placed piece, so he brings it into the game — 5-9, then toward the centre — while keeping his eye on White's cramped left, where sooner or later a man must move badly and offer a target. No single move here wins. But move by move, Black improves his worst man, keeps White's weakness fixed, and steers toward an endgame where he stands better. Strategy is the accumulation of small advantages, each too tiny to name, that together become a mountain no defence can climb.

Here is the isomorphism, and it is written into the very soil your people have farmed for ten thousand years. **A plan IS the farmer's season.** The farmer does not walk into an empty field in the dry months and demand a harvest today; the field would only laugh at him. He knows that the harvest is a thing chosen in advance and then *earned by a sequence*, each act preparing the ground for the next. First he clears — burning the old growth, so the soil can breathe. Then he plants, but only after clearing, for seed on choked ground yields nothing. Then he weeds, again and again, for the weed is the field's weakness and the farmer aims his labour precisely at it. Then he waters, guarding what the weeding preserved. No single act is the harvest; the clearing does not fill the barn, nor does the weeding. Yet remove any one, or do them out of order, and the season fails. The farmer's genius is not strength but *sequence held toward a chosen end*. So it is on the board: you clear your worst man out of its dog-hole, you plant your force against the enemy's weakness, you weed away his defenders by exchange, you water your advantage by keeping his weakness fixed — and the harvest, the won endgame, ripens because you planned the whole season before you turned the first sod.

This is why the old men under the mango tree at the motor park, who never opened a book on the game, can crush a clever young player who knows a hundred tricks. The young man plays move to move, hunting lightning. The elder plays season to season. He has already decided, while the board is still full, what kind of ending he wants — a man up on the side where his opponent is thin — and every quiet move he makes is a hoe-stroke toward that distant barn. When you learn to hold a whole season in your mind, to see the harvest before the first rain, you have stopped merely playing checkers and begun to *compose* it. And that is a foretaste of the highest awe this game offers: that a position too complex for any eye to calculate to its end can nonetheless be *steered*, by a mind that knows where it is going, as surely as a farmer steers a wild field into bread.

### Letter 22: On the Exchange — Simplification as a Weapon

Dear Reader,

There is a move that beginners fear and masters cherish, and it looks, to the untrained eye, like doing nothing at all: the *exchange*, the trade of one man for one man, so that after the smoke clears each side has lost exactly the same. "Why trade?" the beginner asks. "Nothing was gained." But everything was gained, for the value of an exchange is never in the material — that stays equal — but in what the board *becomes* once two men have left it. To trade with purpose is one of the deepest arts of the game, and today I will place three purposes in your hand.

The first purpose: *when you are ahead, trade to simplify.* Suppose you are a man up — twelve against eleven, or three kings against two. Every exchange removes one of your men and one of his, but the ratio of your advantage grows. Three against two is a slender edge; but trade a pair away and it becomes two against one, and two against one is a landslide, for now your extra man can never be answered. The winning side seeks exchanges the way a wrestler who has his opponent off-balance seeks to close the distance; the losing side flees them, keeping men on the board to fish in muddy water. *When ahead, simplify. When behind, complicate.* Engrave it.

The second purpose, and the subtlest: *trade to gain the move.* We have spoken of the opposition, "the move" — that system of zugzwang by which one side is forced to yield first and worsens his position by the mere obligation to step. Whether you hold the move or your opponent does is decided by *counting*, and an exchange changes the count. By choosing to trade — or refusing to — you can flip the opposition into your hands, so that when the men grow few your opponent is the one condemned to move first. A single well-timed exchange in the middlegame can hand you a winning ending twenty moves before it arrives.

The third purpose: *trade to remove a defender, or to open a road.* Often one enemy man is the keystone — it guards a crowning square, it plugs the lane your king wishes to travel, it holds his whole formation together. Trade it off, even at no material gain, and the wall it anchored falls. Watch a purposeful exchange. Black wishes to march a man to the king-row at 29–32, but White's man on 25 guards the road.

```
 .  .  .  .      (1  2  3  4)
.  .  .  .       (5  6  7  8)
 .  .  .  .      (9 10 11 12)
.  .  .  .       (13-16)
 b  .  .  .      (17-20)
b  .  .  .       (21-24)
 w  .  .  .      (25-28)
.  .  .  .       (29-32)
```

Black plays 21-25? No — he offers the trade by 17-22, and if White's guard is drawn into the exchange, the crowning road to 29 opens and Black's remaining man walks in to be crowned. He gave a man to take a man — even material — but *unequal position*: he emerged with a king and White did not. The exchange was the crowbar that pried open the door.

And know, too, *when NOT to trade*. When you are behind, trades hasten your death. When your man is well-placed and his is badly placed, a trade throws away your positional wealth for nothing. When the exchange opens a road for *him* and not for you, it is a gift to the enemy. The rule is not "trade" nor "don't trade" but "trade only toward the position you want."

Here is the isomorphism, and it lives in every market from Kumasi to Dakar as the traders pack up at dusk. **The exchange IS the wise trader converting many small goods to one durable asset as the market closes.** All day the trader has held a stall full of perishable things — tomatoes softening, fish that will not last the night, small coins that scatter and get lost. As the light goes and the crowd thins, the shrewd one does not cling to his heap of little wares hoping for one more sale in the dark. He *simplifies*: he sells the tomatoes at a fair price, converts the fish, gathers the scattered coins, and turns the whole restless pile into a single thing that keeps — a measure of gold, a note that holds its worth, one durable asset he can carry home and count on. He has not increased his wealth by the conversion; a fair trade adds nothing. But he has *locked in* what the day earned, changing many fragile advantages that could still spoil into one solid advantage that cannot. The player a man ahead does exactly this as the board empties: he trades the restless many-piece position, where anything might still go wrong, for the few-piece position where his single extra man is a bar of gold that no dusk can rot. Simplification does not win the lead — it *keeps* it.

So do not fear the trade that gains nothing in men, Dear Reader, for it may gain everything in truth. The master's exchanges are not surrenders of material but conversions of advantage — perishable into permanent, muddy into clear, the many into the decisive one. And there is an awe in this that reaches past the board: that the way to secure a good thing is often not to grasp more, but to let go of what you do not need, until only the essential remains, plain and unassailable, ready to be counted.

### Letter 23: On Building a Winning Position Stone by Stone

Dear Reader,

We come now to the summit of the middlegame, and to the quality that most divides the master from the amateur. The amateur wins, when he wins, by a single blow — a shot, a trap, a blunder pounced upon. The master wins by *construction*: he lays advantage upon advantage until the enemy, though he was never struck a mortal blow, finds himself in a position that is simply lost, with no door left to walk through. This slow strangling has a name among players — *the squeeze* — and to learn it is to learn how small things compound into inevitable things.

The method has a shape. First, *restrict his mobility.* A man with few moves is a man being slowly buried; a man with no legal move at all is a man who has lost, for in this game to be unable to move is to be defeated. So you place your men to take squares away from his — not capturing, merely *forbidding*, standing where his men would wish to go. Second, *gain squares.* Every square you control and he does not is a small coin of territory; hoard them. Play toward the centre, from which your men radiate influence, and press him toward the walls, where his men grow cramped and step on one another's feet. Third, *force him to weaken.* A man squeezed for space must eventually make a move he hates — advance a piece that should have stayed home, break a formation that should have held, abandon a square he needed. You do not seize the weakness; you *manufacture* it, by leaving him no good move. Fourth, and only now, *convert*: when his position has been bent far enough, the tactic that was impossible at the start becomes forced, and you cash your accumulated pressure into a won man or a broken king-row.

See the whole board while you do this, for the squeeze fails if you press on one wing and forget the other. Consider Black slowly cramping White's left.

```
 .  .  .  .      (1  2  3  4)
.  .  .  .       (5  6  7  8)
 b  b  .  .      (9 10 11 12)
b  b  b  .       (13-16)
 .  .  b  .      (17-20)
w  w  .  .       (21-24)
 w  w  .  .      (25-28)
w  .  .  .       (29-32)
```

Black's men on 13, 14, 17, 19 crowd every square White's left-wing men wish to advance to. White is not losing a man — yet. But count his moves: fewer each turn. His pieces on 21, 22, 25, 26, 29 are a knot that cannot untie, each blocking the other's retreat and forbidden every advance by a black man watching the square. Soon White must move a piece he wished to keep still, the knot loosens at exactly the wrong place, and Black's patient pressure finds the man it has been squeezing toward all along. No single black move was a threat. Together they were a vice.

Here is the isomorphism, and it stands in every village and every ancient city wall from Kano to Great Zimbabwe. **Building a winning position IS raising a mud-brick wall course by course.** The builder does not raise a wall with one great stone, for no man could lift it and no single stone is a wall. He lays one humble brick of mud and straw, then beside it another, then a third — a first course along the whole line of the foundation, low and unimpressive, a thing a child could step over. Then upon that course he lays a second, each brick bedded on the one below and bound to its neighbours, and upon that a third, and a fourth. No single brick keeps anyone out; each is soft, small, forgettable. But laid patiently, course upon course, bound and true, they rise into a wall that leaves the enemy *no door* — not because any one brick defeated him, but because the whole, assembled with patience, admits no passage. And note the builder's discipline: he does not race one section up to the sky and leave the rest at ankle height, for the enemy walks through the gap. He raises the *whole* wall together, course by even course, as the master presses the *whole* board, wing by wing, square by square. The squeeze is masonry. Restriction is the first course; gained squares are the second; the forced weakness is the third; the conversion is the coping stone that seals the top. And when it is done the enemy stands before a blank unbroken face and understands, too late, that he was walled in not by a blow but by a *thousand small patient labours* he never thought worth answering.

This is the truth that ends our study of the middlegame, Dear Reader, and it is the middlegame's deepest gift to the ending that follows. The patient accumulation — the worst man improved, the exchange timed, the square gained, the mobility choked — is not decoration. It is the *quarrying and laying of the bricks* from which a won endgame is built. The player who squeezes well in the middle arrives at the ending already a man up, or already holding the move, or already with the enemy's king-row in ruins, and there he has only to count the harvest that his masonry earned. The amateur waits for lightning and usually waits in vain. The master builds a wall, and behind a finished wall no lightning is needed. That the many-handed patience of the builder should defeat the single-handed hope of the gambler — on the board as in the world — is a thing worthy of long and quiet awe.

## Part VII: The Endgame — Where Truth Lives

### Letter 24: On the Endgame and Why It Is the Heart of Mastery

Dear Reader,

The board has emptied. Where twenty-four men once crowded the diagonals, now perhaps five remain, or four, or three — a scatter of pieces on a wide and lonely field. The beginner relaxes here, thinking the interesting part is over; the crowd at the motor park often drifts away, expecting a draw or a formality. They are all wrong, and their error is the greatest in the game. For the endgame is not the game's tired conclusion. It is the game's *supreme court* — the place where every claim made in the opening and the middlegame is finally tried, and where the truth, at last, cannot be hidden.

Understand why the ending is where truth lives. When the board is full, a mistake can be *concealed*: you blunder a square, but there are so many men, so many threats, so much noise, that the punishment gets lost in the crowd and the game staggers on. But strip the board to three men a side and there is nowhere to hide. Every move is naked. A single misplaced step, a single failure to take the opposition, is not softened by a hundred other pieces — it is the whole position, and it decides the whole result. Fewer pieces do not mean less to think about; they mean *more precision demanded of each thought*. In the opening you may play the tenth-best move and survive. In a king-and-man ending you must play the *only* move, and play it exactly, or the win dissolves into a draw and the draw collapses into a loss. The endgame is the game's mathematics laid bare, with the noise removed and only the structure remaining.

And here is the fact that should reorder your whole study. **The single extra man, invisible in the opening, is decisive in the ending.** When the board is full, being one man up among twenty-four is a whisper; the crowd absorbs it. But when the board is nearly bare, that one extra man is a giant. Three kings against two is often a clean win; two against one, almost always; for the lone defender cannot guard every road at once against a force that outnumbers him. The whole labour of the middlegame — the squeeze, the timed exchange, the patient masonry — exists to deliver you into the ending *one man ahead* or *holding the move*, because in the ending, and only there, that small advantage finally speaks with its full voice. The middlegame is where you earn the extra man. The endgame is where the extra man collects his debt.

This is why the greatest players revere the ending above all else. Consider Marion Tinsley, the American mathematician who was, by any honest reckoning, the finest player the game has ever known — a man who over some forty-five years of championship play lost only a mere handful of games, so few that his rivals spoke of him with something near dread. Wherein lay his terrible strength? Not chiefly in tricks or traps, but in the *depth of his endgame vision*. Tinsley could look at a thinned board and see, many moves ahead, the exact machinery by which one man's advantage would be converted or one defender's fortress would hold. Where other masters saw a probable draw, he saw a hidden win, or a hidden save, because he had studied the endings until their truth was as plain to him as arithmetic. The player who masters the ending has mastered the place where games are actually decided — and that is why Tinsley, who revered it most, ruled the game longest.

Here is the isomorphism, and your people know it in their bones from both the running-track and the harvest-field. **The endgame IS the last stretch of the long race, and the counting of the grain at the storehouse door.** For most of the long race the runners bunch together, and the crowd cannot tell who leads; the small differences in stride and breath are hidden in the press of the pack. It is only in the final stretch, when the field thins and the strong pull clear, that the truth of all those earlier miles is revealed — the runner who paced himself, who saved his strength, who ran the middle wisely, now shows what he built, and the one who spent himself early falls away. The race was decided in the middle, but it is *counted* at the end. And so with the harvest: all season the two farmers' fields looked much the same green, and no eye could say whose labour was greater. But at the storehouse door, when the grain is measured out into baskets and counted, the extra rows the diligent farmer weeded and watered become an *extra measure* of grain — small against the whole field, decisive at the door where the year is reckoned. The endgame is that storehouse door. The field looked even; here the extra measure decides everything.

So do not drift away when the board empties, Dear Reader, as the idle crowd drifts. Draw *closer*, for you are approaching the holy of holies. And take from this the counsel that every great teacher of the game has given: *study the endings first.* It seems backward — why learn the last part first? — but it is the deepest wisdom, for the endings are the game reduced to its skeleton, its pure logic, its truth without noise. Learn how three men defeat two, how the opposition forces a yielding, how a lone king saves itself in the corner, and you will play the crowded middlegame with new eyes, *steering always toward the endings you now understand*. The master reveres the ending not because it is easy but because it is *true*. And to stand where truth lives, and to have trained yourself to read it, is the nearest thing this game offers to the awe of the mathematician who, after all the noise of a long proof, arrives at the clean and unanswerable line: therefore, it is so.

### Letter 25: On First Position — the Most Famous Ending in Checkers

Dear Reader,

There are a few positions in this game so old, so studied, and so beautiful that they have been given names and passed down like heirlooms from master to master for two hundred years. The most famous of all is called simply *First Position*. It is an ending of king and man against a lone king — a position where the stronger side, played correctly, *wins*, though at a glance it looks as though the lone defender should slip away and draw. Generations of players have learned it by heart, for it is the very archetype of how a small advantage is converted into a whole point by pure technique. Let me teach you not a memorized move-list — those you can study from any endgame book — but the *winning idea*, which is worth a thousand memorized moves because it recurs everywhere.

First, the honest caveat, for I promised you a mathematician's honesty. First Position is a *precisely handled* ending; its exact winning line depends on whose move it is and on the exact squares, and mishandled by even one tempo the win becomes a draw. I will therefore give you a *representative* setting and teach the technique, not claim a single unique diagram as gospel. The classical arrangement is roughly this: the winning side has a king and a man positioned to confine the enemy king near the side of the board, while the enemy has only his lone king, hemmed toward a corner. Something in this spirit:

```
 .  .  .  .      (1  2  3  4)
.  .  .  .       (5  6  7  8)
 .  .  .  .      (9 10 11 12)
.  .  .  .       (13-16)
 .  W  .  .      (17-20)
.  .  b  .       (21-24)
 .  .  b  .      (25-28)
.  .  .  .       (29-32)
```

Here (a representative sketch, not an exact tournament diagram) White has the lone king; Black has a king on 23 and a man on 27 pressing forward. The truth of the position — and truth is the word, for it exists whether or not any player finds it — is that Black wins.

Now the winning idea, which you must grasp in principle. Black's man wishes to march to the king-row and be crowned, for a second king would settle the matter at once. White's lone king exists only to *stop* that man from crowning — to sit on the crowning road and block it. So the entire battle reduces to a single question: *can Black drive White's king off the crowning road?* And the tool that drives him off is the one we have studied — **the opposition, "the move," the mechanism of zugzwang.** Black manoeuvres his own king so as to *hand White the obligation to move* at the critical instant. White's king, guarding the road, is fine so long as he may stand still — but he may not stand still; the rules compel him to step. And Black arranges matters so that *every* step White can make either abandons the crowning road or walks into a fatal loss of ground. White is not defeated by a capture. He is defeated by being *forced to move when every move ruins him*. The man crowns; two kings against one; the win is gathered in.

That is the whole secret of First Position, stripped of its memorized detail: *confine the defender, then use the opposition to put him in zugzwang, so that the obligation to move — not any blow of yours — forces him off the square he must hold.* You do not chase the enemy king; you *close its room*, step by patient step, until movement itself becomes his executioner.

Here is the isomorphism, and it is as old as hunger and the hunt. **First Position IS the patient hunter cornering game against a cliff.** The hunter does not defeat the swift antelope by outrunning it — he cannot; the beast is faster. He defeats it by *closing the country*. He drives it, unhurried, toward the place where the land runs out — a cliff, a river, a thorn thicket — and then he does not lunge. He steadily blocks each remaining path, one at a time, taking away the left escape, then the right, narrowing the ground until the animal has no unhurried step left to take. And here is the deep parallel: it is the beast's own *need to keep moving* — its inability to simply stand frozen forever against the closing hunter — that undoes it. Movement, its great gift on the open plain, becomes its ruin against the cliff, for every direction it can bolt is already blocked, and stand still it cannot. The lone king in First Position is that cornered game: fast, free, uncatchable on the open board — but driven to the wall, stripped of safe squares, and destroyed at last not by the hunter's speed but by the simple, inescapable fact that *it is its turn, and there is nowhere good to go.*

This is why First Position has been treasured for two centuries, Dear Reader, and why every serious player commits its handling to memory as a griot commits the founding songs. It is not merely a way to win one arrangement of pieces. It is the *purest demonstration of zugzwang in the whole game* — the moment where the obligation to move, which we usually think a right, is revealed as a chain. A player who truly understands First Position understands the deepest engine of the endgame, and carries it into a hundred positions that wear a different face but share the same skeleton. And there is awe in this: that a position looking, to the untrained eye, like an easy escape should contain, hidden in its geometry from the beginning, a *forced* and inescapable defeat — a truth waiting two hundred years for the players who found it, and true, in silence, before any of them were born.

### Letter 26: On Second Position and the Key Winning Endings

Dear Reader,

If First Position is the most famous ending in the game, its twin — called, with the plainness masters love, *Second Position* — stands beside it as the other great classical heirloom, studied for centuries and known by heart to every player worthy of the name. Together they anchor a small, precious family of fundamental endings that a master carries in memory not as a burden but as a treasure, for they decide whole classes of games the instant they appear. Today I want to teach you two things: what Second Position teaches, and *why* the memorizing of a handful of exact endings is one of the wisest investments a player can make.

Second Position, like First, is an ending of king and man against king, but arising from a different arrangement — one where the defending king is driven toward the *double corner* and the winning side must combine the threat of crowning with the confinement of the enemy king, again wielding the opposition to force the defender into a losing step. I will not pretend to hand you its exact tournament diagram from memory, for these named positions have precise handling that fills pages and turns on a single tempo; to over-claim would betray the honesty I owe you. What matters for your mastery is the *shared engine*: like First Position, Second Position is won by *confinement plus zugzwang* — you shrink the defender's room and then use the move to compel him off the square he must hold. That two of the most celebrated endings in the game's history run on the very same mechanism should tell you how central zugzwang is to all endgame truth.

Let me instead teach you, exactly and honestly, one essential ending you can *fully* trust, for it is the workhorse behind so many others: **two kings against one king wins.** This is not a subtlety; it is a near-certainty, and its technique is worth engraving. The lone king cannot guard two roads at once. The winning method is to drive the single king toward the *side* of the board, and then toward a corner that is *not* the safe double corner, using your two kings as a moving fence.

```
 .  .  .  .      (1  2  3  4)
.  .  .  .       (5  6  7  8)
 .  .  .  .      (9 10 11 12)
.  .  .  .       (13-16)
 .  .  .  .      (17-20)
W  .  .  .       (21-24)
 .  .  .  .      (25-28)
B  B  .  .       (29-32)
```

Here Black's two kings on 29 and 30 press White's lone king on 21 toward the single corner and the edge. The idea: one king *drives* while the other *guards*, so that the lone king is always losing squares and never gaining them. You herd him to the wall where his mobility is least, and there — the wall having stolen half his escape routes and your second king covering the rest — he is left with no safe square when his turn falls. Two against one wins because *one defender cannot be in two places*, and the whole art is simply never to let your two kings guard the same road twice. Master this, and you master the payoff of every middlegame in which you fought to be a man up: the extra man becomes an extra king, two kings corner the one, and the point is yours.

Here is the isomorphism, and it sits under the palaver tree in every village where the old ones settle disputes. **The key endings ARE the handful of proverbs an elder knows perfectly.** The elder who judges the community's quarrels does not carry a thousand rulings in his head, each half-remembered and unsure. He carries a *small* number of proverbs — perhaps a few dozen — but each one *perfectly*, worn smooth by a lifetime, exact to the word. And each proverb is not a single ruling but a *master-key* to a whole class of disputes: one settles every quarrel over a borrowed thing, another every dispute between neighbours over a boundary, another every case of a promise broken. When a new quarrel is brought, the elder does not reason it out from nothing; he *recognizes its family*, reaches for the one proverb that governs that whole class, and applies it with the certainty of a man who has never once been wrong about that saying. So it is with the master's key endings. First Position, Second Position, two-against-one, king-and-man against king — these are the elder's proverbs of the board. They are few. But each is known *perfectly*, and each decides not one position but a whole *class* of positions that reduce to it. The master who reaches a thinned board does not calculate from zero; he *recognizes the family* — "ah, this is two-against-one; this is First Position; this is the double-corner draw" — and applies the known truth with the elder's certainty.

This is why memorizing a handful of endings *exactly* is worth more than half-knowing a hundred, Dear Reader. Half-knowledge in the endgame is worthless — worse than worthless, for it gives false confidence and then betrays you at the single precise move where a draw hides. But a few endings known to perfection are *load-bearing pillars*: every game you play, if you steer it wisely, flows down toward one of them, and to arrive at a position whose truth you *already hold with certainty* is to have won or drawn before you sit down. The great players are not those who calculate the most in the ending. They are those who *need to calculate least*, because they recognize the ancient families and know each family's proverb by heart. And there is a quiet awe in this economy of the mind: that the boundless ocean of possible positions should drain, in the end, into a few deep wells of known truth — and that the whole vast game should bow, at the last, to a handful of perfectly remembered words.

### Letter 27: On King Against King and the Double Corner Fortress

Dear Reader,

We arrive at the most elemental ending of all, and one of the most instructive: a single lone king facing a single lone king, or a lone king struggling to survive against a slightly stronger force. You might think that with so little on the board there is nothing left to know — surely a lone king simply wanders until the game peters out to a draw. But here lies one of the game's most elegant truths, and it will complete your education in where games are truly decided: *a lone king's survival is not a matter of luck or of aimless wandering. It is a matter of reaching the right corner.* There is a fortress on this board, and the defender who reaches it lives; the defender who fails to reach it may die. Today I give you the fortress.

Recall the geometry of the board's four corners, for it is the whole of the lesson. Two of the corners are *single corners* — the lone dark squares 4 and 29 — where a king has only *one* diagonal escape and can be pinned against the wall with no room to shuffle. But the other two are *double corners*: the pairs of adjacent dark squares in the regions around 1 and 5 at the top, and around 28 and 32 at the bottom. In a double corner, a king has *two* safe squares to shuttle between, protected by the walls on two sides. And this small difference — one escape square versus two — is the difference between a lost king and a saved one.

```
 .  .  .  .      (1  2  3  4)
.  .  .  .       (5  6  7  8)
 .  .  .  .      (9 10 11 12)
.  .  .  .       (13-16)
 .  .  .  .      (17-20)
.  .  .  W       (21-24)
 .  .  .  w      (25-28)
.  .  .  W       (29-32)
```

Here a lone White king has reached the bottom-right double corner, shuttling between 32 and 28 (with 27 and 24 nearby as further safe ground), while a stronger side approaches. Watch what the double corner grants him. When the attacker comes to drive him off 32, the defender steps to 28; when driven from 28, he steps back toward 32. The attacker can block *one* of these squares — but not both at once, for a single attacking king cannot stand on two squares in one move, and even a stronger force finds that the two safe squares, guarded by the converging walls, cannot both be sealed in time. The lone king shuttles forever in his little stronghold, and the game is a *draw*. Had he fled instead to the single corner at 29 or 4, the story would end in his death: driven against the wall with but one escape, that escape is blocked, and having no safe square on his turn — no move that does not step into capture or into the losing square — he falls. *The double corner draws; the single corner is a grave.* This is why, when your king is the lone survivor and the enemy is stronger, your entire strategy is a single word: *run for the double corner*, and once there, shuttle, and hold.

Here is the isomorphism, and it is carved into the history of every people who ever defended their freedom from a hill. **The double corner IS the mountain stronghold with two escape paths.** Consider the small band who defend their home not on the open plain, where numbers decide and the many crush the few, but in the mountains — the fastness of the Bandiagara escarpment, the crag-fortresses where a handful have held off armies since the beginning of war. Why does the mountain save them? Not by strength of arms; the attacker is stronger. It saves them by *geometry*. The stronghold has two paths of movement, two ways the defender can slip between defensible positions, sheltered on the other sides by sheer rock the enemy cannot cross. The attacker, however numerous, can block only *one* path with his force at a time; while he masses to seal the eastern way, the defender slips to the western, and while the enemy shifts to the west, the defender is back at the east. The lone defender is never caught, not because he is mighty, but because *the enemy can be in only one place, and the stronghold offers two.* The single-corner king is the fool who defends in a dead-end ravine with one mouth — block the mouth and he is finished. The double-corner king is the wise defender in the two-pathed fastness, holding forever against a stronger foe by the pure logic of the ground. The fortress is not made of the defender's power. It is made of the *shape of the place he chose to stand*.

And so we close our study of where games are truly decided, Dear Reader, and you now hold the map of that country. You know that the endgame is the supreme court where truth is finally tried; that the single extra man, a whisper in the crowd, becomes a giant when the board is bare; that the opposition and zugzwang are the deep engines by which First and Second Position force a defender to his ruin; that a few key endings, known perfectly like an elder's proverbs, decide whole classes of games; and now that a lone king, seemingly doomed, can save its life forever by reaching a corner with two paths where the single corner would be its grave. See what has happened to you across these letters. You began as a humble man, bound to move only forward on one colour of square. You have learned to plan a season, to trade like a closing market, to build a wall course by course, and at last to read the truth in the bare and honest endgame where the great Tinsley dwelt. The board has grown quiet, and in the quiet you can hear what the noise concealed: that this small kingdom of thirty-two dark squares contains, in perfect miniature, the whole drama of foresight and patience and the geometry of a place well chosen — the same wisdom by which farmers feed nations and defenders keep their freedom on a hill. That so much truth should live in so small a country, and wait so patiently for the mind prepared to see it, is a thing worthy of love.

## Part VIII: The Mathematics of the Game

### Letter 28: On the Game Tree — Every Possible Game as a Single Object

Dear Reader,

We have played the game move by move, as a man walks a road one step at a time, seeing only the bend before him. Today I ask you to rise above the road and behold the whole country at once — every path that any two players could ever walk from the opening slap of the first piece to the final block or capture. For there exists a single object that contains every possible game of checkers that ever was or ever could be played, and once you hold it in your mind, you hold the game as a mathematician holds it: not as a story unfolding, but as a finished, motionless whole.

Begin at the start. Black has seven legal opening moves. From each of those seven positions, White has his own replies; from each of those, Black replies again — and so the possibilities fan outward, branch upon branch, like a river delta seen from the sky, or like a tree whose every twig forks into smaller twigs without end until the end. We call this object the **game tree**. Each *position* on the board is a **node**; each *legal move* is an **edge** joining one node to the next; and at the very tips, where the game is won, lost, or drawn by the rules, are the **leaves**. A single game — the one you played last Sunday under the mango tree — is nothing but *one path*, traced from the root at the top to a single leaf at the bottom.

```
                 [start]              ← root: the opening position
              /    |    \    ...
        11-15   11-16   9-14   ...    ← Black's 7 possible first moves
         /|\     /|\     /|\
       ...  ...  ...  ...              ← White's replies to each
        |    |    |    |
       ...  branching continues...
        |
      [W wins] [draw] [B wins]        ← leaves: the game's verdict
```

Let us be exact about the size of this tree, for the number is a marvel and you must respect it. The count of distinct positions reachable in checkers is roughly **five hundred quintillion — about 5 × 10²⁰**, which is a 5 followed by twenty zeros. To feel the weight of it: if every grain of sand on a great beach were a position, you would need many beaches. If a machine could examine a billion positions every second, tallying them all would still take longer than tens of thousands of years. And yet — mark this well — the tree is *finite*. It has an end. It is vast beyond a mortal's counting, but it is not infinite. This single fact, that the whole of checkers is a large-but-finite object, is the hinge on which everything in the coming letters turns. What is finite can, in principle, be *known completely*.

Here is the isomorphism, and it is the oldest picture in any African village. **The game tree IS the great genealogy — the family tree of a whole clan, every possible descent laid out at once.** When the griot recites the lineage of a people, he begins with the founding ancestor at the root and names the children, and from each child the grandchildren, and from each of these their children, the family fanning outward through the generations into thousands of living souls. The whole clan, from the first father to the newest infant, exists in that recital as a single branching structure — motionless, complete, holding every line of descent simultaneously. Now, any one living person is not the tree; he is a single *path* through it — a thread from the founding ancestor straight down to himself, one name at each generation. So it is with a game. The tree is the whole clan of all possible games; your Sunday match is one bloodline traced from the root to a single descendant at a leaf. The griot who holds the entire genealogy in his memory sees what no single family member walking his own life can see: the whole shape of the descent, all at once.

Fix this vision in your mind, Dear Reader, for it changes what a *move* is. When you push a man from 11 to 15, you are not merely shifting wood on a board — you are choosing one branch of an unimaginably vast but perfectly definite tree, and discarding, forever, all the games that would have grown from the branches you did not take. Every game ever played by every player in every roadside club of Accra and Dakar is a single traced path down this one silent object. The awe is this: the game you think you are inventing, move by move, already exists in full — every line, every trap, every quiet draw and brilliant win — waiting in the tree before your hand ever moves. You do not create the game. You discover your path through a country that was always there.

### Letter 29: On Minimax — How a Mind (or Machine) Chooses

Dear Reader,

We hold now the whole game tree — that vast, finite genealogy of every possible game. But holding it is not enough. A tree of five hundred quintillion positions tells you *what is possible*; it does not tell you *what is best*. The master under the baobab does not want to see all games; he wants to know, of the seven moves before him, which one *wins*. Today I give you the principle by which any mind, human or machine, extracts the single best move from the whole cloud of possibilities. It is called **minimax**, and it is the closest thing we have to a law of correct play.

The idea rests on one honest and unsentimental assumption: *your opponent is as clever as you, and wants exactly what you do not.* You wish to win; he wishes for you to lose. So when you plan, you must not dream that he will blunder. You must assume that at his every turn he will choose the reply that is *worst for you* — and plan to do well anyway. Minimax is simply this assumption carried all the way down the tree. Let us give the leaves numbers, from your point of view: a position where **you win** is worth **+1**; a **draw** is worth **0**; a position where **you lose** is worth **−1**. Now we ask: what is a *non*-leaf position worth? And the answer flows from who is to move.

When it is *your* turn, you will choose the move leading to the *highest* value — you **maximize**. When it is your *opponent's* turn, he will choose the move leading to the *lowest* value — from your point of view he **minimizes**. So the value of any position is not guessed; it is *computed* by backing up the known leaf-values, layer by layer, up the tree. Watch it on a small one:

```
              (you to move — take the MAX)
                       root
              /          |          \
          A               B              C
     (opp: MIN)      (opp: MIN)     (opp: MIN)
      /    \          /    \         /    \
    +1     -1       0      0       -1     -1
     \    /          \    /         \    /
      -1              0             -1        ← opponent picks the MIN under each
      A=-1            B=0            C=-1
       \              |              /
        \___________ MAX ___________/
                 root = 0            ← you pick the best available: B, a draw
```

Read what happened. Under move A, one leaf is a win (+1), but the *opponent* chooses there, and he takes the −1: so A is really worth −1 to you. He will never let you have the +1. Under B, both his replies draw, so B is worth 0. Under C, he can force −1. You, choosing at the top, take the *maximum* of {−1, 0, −1} — which is B, the draw. The value of the whole position is 0: with best play by both, this position is a draw. Notice that the tempting win under A was a mirage; it existed only if the opponent cooperated, and a strong opponent never does. This is *exactly* what a master does when he calculates: "If I go here, he goes there — his best — and then I am lost; so I do not go here." He is running minimax in his skull.

```
function minimax(position, side_to_move):
    if position is a leaf:
        return value_of(position)          # +1, 0, or -1
    if side_to_move is YOU:
        best = -infinity
        for each move from position:
            best = max(best, minimax(child, OPPONENT))
        return best
    else:                                   # opponent to move
        best = +infinity
        for each move from position:
            best = min(best, minimax(child, YOU))
        return best
```

Here is the isomorphism, drawn from the market and the compound. **Minimax IS bargaining foreseen to its end.** When you go to buy a goat from a shrewd trader, you do not name your first price by hoping he is a fool. You reason forward through the whole haggle: "If I offer this, he will counter with that — his best, not his kindest — and then I must answer so, and he so, and where does it truly settle?" You plan your opening figure by imagining the *entire* exchange played out with each side pressing for himself, and you choose the move that leaves you best *after* he has done his shrewd worst. The final price is not what either of you *wishes*; it is what both playing perfectly *yields* — the value that survives when hope is stripped away and only the structure remains. A weak buyer plans against the seller he wishes for; a strong buyer, like a strong player, plans against the seller who is truly there.

The awe, Dear Reader, is that this turns a game into a *theorem*. Once we assume best play by both, a position no longer merely *feels* good or bad — it *has* a value, a definite +1, 0, or −1, as fixed and discoverable as the value of a sum. The master's intuition and the machine's calculation are reaching for the very same number, the one that was already written in the tree. Minimax is the name of the truth a position holds when neither side is fooled.

### Letter 30: On Alpha-Beta Pruning — Searching Less to See More

Dear Reader,

Minimax gives us the truth, but at a ruinous price: to know a position's value it seems we must examine *every* branch beneath it, and beneath any real checkers position lie more branches than there are stars a man could count in ten lifetimes. If we had to look at all of them, no mind and no machine could ever see more than a few moves ahead. And yet the master under the mango tree calculates far and fast, and the machine calculates farther still. How? By a single, beautiful economy: *you need not examine what cannot change your decision.* This economy has a name — **alpha-beta pruning** — and it lets a searcher see twice as deep for the same labour, or the same depth for a fraction of it, while returning the *exact same answer* as full minimax. Nothing is sacrificed but wasted effort.

Grasp the core idea through one small scene. You are weighing move A against move B. You have finished studying A, and found that with best play it yields you a *draw* — value 0. Now you begin to study B. You look at the opponent's *first* reply to B, and you discover that this reply *loses for you* — value −1. Stop. You need look at no other reply to B. Why? Because the opponent, choosing among his replies to B, will take *at least* as bad as this one for you; B can therefore be worth no more than −1. But you already have A in hand, worth 0, which is better. B is dead. The moment one refutation is found, the whole move is condemned, and every unexamined reply beneath it is *pruned* — cut off unlooked-at, because no matter what it holds, it cannot rescue B nor change your choice of A. You do not need to know *how badly* B loses. One rotten reply is enough to reject it.

```
   You: MAX          root
                    /      \
                  A          B
              (opp:MIN)  (opp:MIN)
               /   \       /    \  \  \
             0     0     -1    ??  ?? ??   ← studying B, first reply = -1
             \____/       |     ↑___↑___↑
              A = 0    found -1   PRUNED — never examined
                       B <= -1, and A already = 0, so B loses. Cut.
```

Two running bounds carry this logic through the whole tree. We call them **alpha** — the best value *you* (the maximizer) are already assured of somewhere — and **beta** — the best the *opponent* (the minimizer) is already assured of. As the search descends, whenever it finds that a branch's value has fallen outside this window — when the opponent can already do better than alpha, or you can already do better than beta — it *cuts off*: it stops, because further looking cannot move the final decision.

```
function alphabeta(pos, side, alpha, beta):
    if pos is a leaf: return value_of(pos)
    if side is YOU:                          # maximizer
        for each move:
            v = alphabeta(child, OPP, alpha, beta)
            if v > alpha: alpha = v
            if alpha >= beta: return alpha   # CUTOFF: opponent won't allow this
        return alpha
    else:                                    # minimizer
        for each move:
            v = alphabeta(child, YOU, alpha, beta)
            if v < beta: beta = v
            if alpha >= beta: return beta     # CUTOFF: you won't allow this
        return beta
```

Here is the isomorphism, and it lives in every market in Africa. **Alpha-beta pruning IS the market-woman who stops tasting a sack of grain after the first rotten handful.** When the grain-seller at Kejetia offers her a hundred sacks, she does not empty each one and inspect every kernel — that would take till nightfall and she would buy nothing. She plunges her hand into a sack, and if the first fistful comes up mouldy and weevil-eaten, she does not dig deeper. She *rejects the whole sack on that one handful* and moves to the next, for she knows that one proof of rot is enough to condemn the sale; the rest of the sack cannot redeem it. She spends her precious attention only where the choice is still *live* — on the sacks not yet refuted — and so she surveys a hundred sacks in the time a foolish buyer would spend on ten. One refutation ends the inquiry. That is alpha-beta exactly: the first losing reply is the rotten handful, and the branch is dropped unexamined.

I will add one further economy the machines use, for you should know its name. In checkers, the *same* position can be reached by different orders of moves — you might arrive at an identical board by 11-15 then 22-18, or by 22-18 then 11-15. It would be waste to solve that position twice. So the searcher keeps a **transposition table** — a great book of positions it has already evaluated — and before working out a position afresh, it looks to see whether it has met this exact board before and already knows its value. It is the griot's memory folded into the search: *"I have seen this face before; I need not learn it again."*

The awe, Dear Reader, is that seeing *less* lets us see *more*. By refusing to examine what cannot matter, the searcher pours all its strength into what does — and so plunges twice as deep into the tree, reaching truths that brute, exhaustive looking could never afford. The market-woman's wisdom and the machine's pruning are one wisdom: attention is finite and sacred, and the master is not he who looks at everything, but he who knows the instant a thing has ceased to be worth looking at.

### Letter 31: On Endgame Databases — Solving Backward from the End

Dear Reader,

Everything so far has looked *forward* — from a position, down the branches, toward the leaves, straining to see the far-off end. Today I turn you around to face the other way, for there is a second and stranger kind of knowing: to begin *at the end* and reason *backward*. The endgame, as I have told you before, is where the truth of checkers lives — where a single man's advantage is finally cashed into a win. And it happens that the endgame can be *completely solved*, not by looking ahead from it, but by working back from the very last move to the first. The instrument of this backward knowing is called an **endgame database**, and the method that builds it is called **retrograde analysis**. It is one of the most powerful ideas in all of game theory.

Consider where forward search is weakest: deep in the tree, positions with few pieces, where a win might lie forty quiet moves away — too far for any forward search to see. Yet these very positions are *few enough to enumerate completely*. With only a handful of pieces on the 32 dark squares, the total number of arrangements, though large, is finite and countable. So instead of searching *forward* into them, we build a book that *already knows the answer* for every one of them. Here is the method, and it runs backward, against the current of the game:

```
RETROGRADE ANALYSIS — labeling every position by perfect-play value

STEP 1  Enumerate every position with N pieces (say, all 2-, 3-, ... piece boards).

STEP 2  Label the TERMINAL positions directly, by the rules alone:
          - side to move has NO legal move    -> LOSS for that side
          - side to move has no pieces left    -> LOSS for that side
        These need no search; the rulebook decides them.

STEP 3  Work BACKWARD. For every not-yet-labeled position, ask:
          - if the side to move has ANY move leading to a position
            already labeled LOSS-for-the-opponent  -> this position is a WIN
          - if EVERY move leads to a WIN-for-the-opponent
                                                    -> this position is a LOSS
          - otherwise, once all pieces-fewer cases are settled -> DRAW

STEP 4  Repeat until no new label can be added.
        Now EVERY position of N-or-fewer pieces has a proven value:
        WIN, LOSS, or DRAW — with perfect play.
```

Once this book is built, *perfect play needs no thought at all — only a lookup.* The machine reaches a position with, say, seven pieces; it does not calculate; it opens the database, reads "WIN in 23," and knows the outcome with the certainty of arithmetic. For checkers, such databases were computed for **every position with 10 or fewer pieces** — a store of some thirty-nine *trillion* positions, each with its verdict sealed. When a game reduces to ten pieces, the truth is no longer searched for; it is simply *known*.

Here is the isomorphism, and it wears the robe of the elder. **The endgame database IS the griot who has memorized the outcome of every dispute that ends a certain way, and reasons backward to judge the living quarrel.** In the palaver under the tree, the young are dazzled by the noise of the present argument; but the old judge has sat through ten thousand disputes across sixty years, and he has committed to memory not the shouting but the *endings* — how each kind of quarrel, once it reaches a certain shape, is *always* resolved. When a new dispute is brought, he does not reason forward through every angry word to guess where it might go. He recognizes the shape and reasons *backward from the known verdict*: "When it comes to two brothers and one inherited field, the settlement is already fixed — I have seen it end a hundred times, always so." And so he steers the living quarrel toward outcomes already solved in his memory, and the wisdom he applies is not calculation but *recollection of every ending*. The database is precisely this: a memory of every possible ending, sealed with its verdict, so that the player, like the elder, plays *toward* positions whose truth is already settled and needs no fresh discovery.

And now, Dear Reader, behold what we have assembled, for it is the great machine that closes upon the game's whole truth. From the opening we search *forward*, pruning the wasteful branches, plunging as deep as our strength allows. From the endings we reason *backward*, the databases carrying perfect knowledge up out of the deep. Forward search reaches down; the endgame database reaches up; and where the two meet — where a forward line runs into a position the backward book already knows — the game is *pierced through*, opening to ending, with certainty the whole way. These are the two jaws of a single trap. In the letters to come you will see them close upon the oldest question of all: not *how* to play checkers, but *what checkers truly is*. The awe is that a game so vast should be assailable from both ends at once — and that patience, running backward from the end, should turn out to be as mighty as vision running forward from the start.

## Part IX: The Solving of Checkers

### Letter 32: On Chinook, Marion Tinsley, and the Machine That Would Not Lose

Dear Reader,

We have built, in the letters before this, the two jaws of the machine that hunts the truth of checkers — forward search and backward databases. But before I show you the truth they caught, I must tell you a human story, for the solving of checkers is not only a tale of arithmetic. It is a tale of *one man* — the greatest player who ever lived — and of the machine that rose, patiently, over years, to meet him. It is a story of dignity, and of an ending that no one, human or program, would have chosen. Listen well, and honor both figures in it.

The man was **Marion Tinsley**, an American, born in 1927, a mathematician by training and a checkers player by vocation and, it is not too much to say, by divine gift. To understand his greatness you must abandon your ordinary measures. In the whole span of his competitive life — across roughly *forty-five years* against the finest players on Earth — Marion Tinsley lost, in serious play, only a *handful* of games. The number most often spoken is **about seven losses in forty-five years.** Read that again slowly. Not seven a year, nor seven a tournament — *seven, in a lifetime.* He was not merely the best; he stood so far above the second-best that the ordinary language of champions fails. He was, as near as any human has ever come in any game of pure skill, *unbeatable* — a man who had gazed into the tree of checkers so deeply and so long that opponents said playing him felt like being read.

Against this mountain came a machine. In 1989, at the **University of Alberta** in Canada, a computer scientist named **Jonathan Schaeffer** and his team began to build a checkers program. They named it **Chinook**. It was made of exactly the parts I have taught you: a forward search sharpened by alpha-beta, a store of opening knowledge, and — growing year by year — the endgame databases reasoning backward from the end. By 1990 Chinook had grown strong enough to *earn the right to challenge for the world championship* — and here the story turns painful, for the checkers federations were troubled that a machine should contest a human crown, and only Tinsley's own insistence that the machine be allowed to play preserved the contest's honor. The greatest champion wished to face the strongest opponent, whatever it was made of.

They met for the Man–Machine World Championship in **1992**. And Tinsley *won* — four games to two, with many draws besides. The mountain still stood. But every man in the hall could feel the ground shifting, for Chinook had drawn most of its games with the unbeatable man, and machines, unlike men, only grow stronger with each passing year while flesh does not. A **rematch** was set for **1994**. The two sat down again — and here the story breaks the heart. After a run of drawn games, Marion Tinsley withdrew from the match. He was ill. Within a short time it was found to be **pancreatic cancer**, and in **1995** Marion Tinsley died. Chinook was declared champion — but not across the board, not by defeating the man in play. The greatest player who ever lived was taken not by the machine but by his own mortality, mid-match, the question of who was truly stronger left forever unanswered on the board between them.

Here is the isomorphism, and I offer it with reverence. **Tinsley meeting Chinook IS the last great oral master meeting the written archive.** Think of the supreme griot of a people — the one living mind that holds the entire genealogy, every song, every judgment, every lineage, carried in a single human memory refined across a lifetime, deeper than any other soul alive. And think of the coming of the written archive: the patient, tireless record that at first knows *less* than the master, but that grows every year, forgets nothing, and will one day hold more than any single mind could ever contain. When the two meet, the master *still knows more* — the living memory is still the deeper — and yet everyone senses the turning of an age, for the master is mortal and the archive is not. Tinsley was that last great oral master, the whole of checkers held in one perishable human mind. Chinook was the written archive, rising. That the man still stood taller at the end, and was taken by death rather than defeat, is the very shape of every such meeting between a supreme living memory and the patient record that inherits the earth.

Honor both, Dear Reader. Do not let the machine's rise cheapen the man; and do not let love of the man deny the machine its due. Marion Tinsley proved how high a single human mind can climb toward the truth of a game — nearly to perfection, on nothing but a lifetime of thought. Chinook proved that the truth, pursued with patience and arithmetic, can be *captured entire*. The awe is not that the machine surpassed the man. It is that a man, alone, with only his mind, came so close to the very truth the machine needed trillions of positions and years of labor to seize. The tree of checkers had, in Marion Tinsley, very nearly grown itself a human oracle.

### Letter 33: On the 2007 Proof — Checkers Is a Draw

Dear Reader,

The man was gone, but the question he embodied remained, hanging over the game like a star not yet named: *what is the true value of checkers?* Not who plays it best on a given Tuesday — but what does the game *itself* yield, when neither side ever errs, from the very first move to the last? Minimax told us such a value *exists*, a single +1, 0, or −1 sealed in the tree from the beginning of time. But existing and being *known* are not the same. In **2007**, Jonathan Schaeffer and his team at the University of Alberta announced, in the journal *Science*, that they had found it. After eighteen years of computation, they declared: **checkers, with perfect play by both sides, is a draw.** The value of the game, that number written in the tree before any human ever pushed a piece, is **0**.

Let me show you *how* the truth was caught, for it is the two jaws closing exactly as I promised. From *below*, the **endgame databases** held the perfect value of every position with ten or fewer pieces — trillions of endings, each verdict sealed by backward reasoning. From *above*, a **forward search** set out from the standard opening position, exploring the branches of the tree with alpha-beta pruning, driving downward. The team did not need to examine all five hundred quintillion positions — and here is the subtlety you must grasp. They needed only to prove that *from the start*, Black cannot force a win, and White cannot force a win. To do this they followed every line by which one side might *try* to win, and showed that the other side always had a reply reaching a position the databases already knew to be a draw. Where a forward line met the backward book at a draw, that line was *closed*: proven. Branch by branch, the great forward search descended until every attempt by either side to escape the draw ran into a wall of proven equality. When the last such line was closed, checkers was solved.

You must understand precisely what was claimed, for the word matters. Checkers was **weakly solved** — not *strongly* solved. Hold the distinction clearly:

```
STRONGLY solved:  we know the perfect-play value of EVERY position
                  the game could ever present — a complete oracle.

WEAKLY solved:    we know the value of the game FROM THE STANDARD START
                  (it is a draw), AND we possess a strategy that
                  guarantees at least that value against any opponent.
                  We need NOT have evaluated every position individually —
                  only enough to prove the outcome from the beginning.
```

So the 2007 result does not mean every one of the 5 × 10²⁰ positions was labeled. It means the specific question — *what happens from the opening, with best play?* — was answered with the full force of a mathematical proof: **a draw, and here is how to secure it.** It was, at the time, by far the largest game ever solved — a problem a *million times* larger than any solved before it. A game that men had played for centuries, that the great Tinsley had spent a lifetime probing, was now closed as surely as a theorem of Euclid.

Here is the isomorphism, and it is the labor of the surveyor. **Solving checkers IS finally surveying and mapping a country that traders had crossed for centuries by feel.** For generations the caravans crossed the land — from the capital in the interior to the trading town on the far border — each caravan-master finding his way by memory, by the lay of the hills, by what his father taught him, by the feel of the route under his feet. They *knew* the country in the way a master knows a game: intimately, deeply, but never *completely*, never proven. Then one day the surveyors came with their chains and their instruments, and they measured every road and every branching of every road, and they drew the definitive map. The routes were always there — the surveyors invented nothing; the land did not change. But now the knowing was *total and provable*, and the map declared a plain truth the caravan-masters had long suspected but could never prove: *from the capital, every perfectly-chosen road, however it winds, arrives at the same border town.* The destination was fixed all along, sealed in the geography before any trader set out. Schaeffer's team were the surveyors; the map is the proof; and the border town, where every perfect road must end, is *the draw*.

The awe, Dear Reader, is the deepest we have yet touched. That draw was not made in 2007. It was *there* — present in the game's structure from the instant the rules were fixed, waiting in the tree through every century of play, through every match under every mango tree, through Tinsley's whole magnificent life. Every perfectly-played game that ever was had already arrived at that same border town without anyone being able to prove it must. The men of Alberta did not *decide* that checkers is a draw. They *discovered* a truth that was always so — surveyed a country that was always shaped exactly this way — and at last, after all the centuries of crossing it by feel, hung the finished map upon the wall for every eye to read.

### Letter 34: On What It Means for a Game to Be Solved

Dear Reader,

You have followed me to the summit, and there we found a strange sign planted in the rock: *checkers is a draw.* The game you have labored through this whole book to master has been proven, with the finality of mathematics, to yield nothing but a tie when both sides play perfectly. And a heavy question must now be pressing on you, the question every honest reader asks at this height: *then what was it all for? If the ending is fixed, is the game not dead? Have I climbed a mountain only to be told the peak was never worth reaching?* Let me answer you plainly, champion, for the answer is not sorrowful but liberating, and it is the truest thing I have to give you before we turn to the human path of mastery.

First, understand *how little* was actually settled for you, the living player. Checkers was **weakly solved** — the value from the opening is known, and a strategy exists to hold the draw against perfect play. But it was not **strongly solved**: we do not carry in our heads the verdict of every position, and even the machine's proof lives in databases and computations no human could ever hold. More to the point, *the proof was not a mind*. It does not teach you to see. It is a map so vast that no man can memorize it, of a country so large that no man can survey it by thought. You cannot play like the proof any more than you can walk to the horizon on a map. The truth at the summit is real, but it is not *yours to wield across the board* — and that changes everything about what it means for your play.

For here is the decisive fact: **you are not perfect, and neither is your opponent, and the tree is unfathomably vast to a mortal mind.** The draw is the value of checkers played *flawlessly, on both sides, forever.* But no game under any mango tree in Africa, no match at any motor park in Lagos or Kumasi, is ever played flawlessly on both sides. Every real game is a walk through the tree by two imperfect minds, and in that walk there are a thousand quiet branchings where one hand chooses well and the other poorly — and *there* the win still lives, as real and as winnable as it ever was. The proof says the *border town* is a draw *if* both travelers walk perfectly. It says nothing at all about the traveler who takes a wrong turn at the third bend — and against him, the man who knows the country wins, exactly as before. Mastery is not made worthless by the draw; it is made *decisive*, because it is precisely the master who does not take the wrong turn while his opponent does.

Here is the isomorphism, and it is the wisdom of the boatman. **Knowing checkers is a draw IS knowing that all rivers reach the sea.** It is a true thing, and a deep one — every river, however it winds, however many countries it crosses, arrives at last at the same great ocean; the destination is fixed by the shape of the world, settled before the first drop falls. And yet — ask the boatman whether this grand truth rows his boat. He knows the sea is where all water goes. But between him and the sea lie a thousand bends, each with its own current, its own hidden rock, its own shallow that will ground the careless. The fisherman who reads *this* bend, and the next, and steers true through each, brings home his catch and his life; the one who says "all rivers reach the sea" and lays down his oar is dashed upon the very first rock. The destination being fixed does not row the boat. That checkers ends in a draw is the sea; every game you will ever play is the river, full of bends that must still be read, one by one, by a mind that has not stopped caring because it heard where the water ends.

So do not grieve at the summit, Dear Reader — *rejoice* at it. You have been given the rarest thing a player of any game can possess: the knowledge of the truth at infinity, the fixed star above the board, the draw that waits at the end of perfect play. It costs you nothing and it dignifies everything, for it means that every game you win, you win by *virtue* — by seeing a bend your opponent did not, by remembering an ending he had forgotten, by the discipline of thought that is Africa's birthright as much as anyone's. The proof is the truth of forever; your Tuesday match at the motor park is the truth of *now*, and *now* is where men live and play and grow wise. The road to the crown was never a road to a prize the mathematicians had already spent. It was, all along, the making of a mind that can see. And that mind is what we turn to next — for having learned *what* checkers is, we may finally learn, as men learn, *how* to become its master.

## Part X: The Path to Mastery

### Letter 35: On Studying, Training, and Becoming a Champion

Dear Reader,

We have climbed to the summit of theory and seen the truth at infinity; now we must come down to the warm earth where champions are actually made — not in the proof, but in the person, over years, by labor. You told me at the outset that you wished to become a champion, and I have not forgotten it. This letter is the most practical in the whole book: it is the answer to the question *how does a human being, one who eats and sleeps and forgets, actually become strong at this game?* The answer is not mysterious, but it is demanding, and it is the same answer that has made masters in every discipline under the sun.

Let me first place before you the figure you should carry as a lamp: **Baba Sy** of Senegal. From the boards of Dakar — the roadside boards, the café boards, the boards under the trees where the crowd leans in — Mamadou "Baba" Sy rose, in the years around 1963, to be reckoned the finest draughts player alive, the first son of Africa to stand at the very summit of the game before a car accident took him in 1978. He did not descend from some academy; he ascended from the street, from the people's game, carrying the whole draughts tradition of his continent to the top of the world. I set him before you so that you never once believe that mastery is a foreign inheritance, or that the boy studying a board in Lagos or Kumasi or Kigali is doing anything less than what a world champion did. He is doing *exactly* what a world champion did. Baba Sy is the proof that the road from the roadside board to the summit is a real road, and that it begins where you are sitting now.

Now, how did such a man become such a player, and how will you? By four labors, and I will name them plainly. **First, study the endgame first.** This runs against every beginner's instinct — the beginner wants to learn dazzling opening traps — but every master will tell you the same: strength is built from the end backward. Learn the fundamental winning and drawing endings we studied — the opposition, First Position, the double-corner draw — until they are as automatic as your own name. A player who knows *exactly* what he is steering toward plays the whole game with a clarity the tactician-of-the-moment never has. **Second, play stronger opponents, and lose.** You do not improve by defeating the weak; you improve by being defeated by the strong and *understanding why*. Seek out the master at the club who beats you every time, and keep sitting down across from him, for each loss, examined, is a lesson no book can give.

**Third — and this is the secret at the heart of all mastery — analyze your own lost games.** When you lose, do not sweep the pieces away in shame and start another. *Stop.* Set the position back up. Find the move where it went wrong — not the move where you lost the last man, but the earlier, quieter move where the loss was truly born, the weakness made, the tempo squandered, the road not seen. This backward-searching of your own defeats is the single most powerful training there is, and almost no amateur does it, which is precisely why almost no amateur becomes a master. **Fourth, study the recorded games of the great players** in the notation you learned in Letter 4 — replay them move by move on your own board, and at each of the master's moves, cover the page and try to guess it yourself before you look. Where your guess differs from the master's, *there* is a gap in your understanding, and you have found exactly the thing you must learn.

Here is the isomorphism, and it is the making of every skilled hand in Africa. **Becoming a champion IS the apprenticeship at the master craftsman's bench.** The boy who would become a great smith at Suame Magazine, or a great weaver of kente, or a great carver, does not read a book and emerge a master. He *apprentices* — for years — beside a master, and his training has exactly the four parts we have named. He begins with the fundamentals drilled until they are reflex (the endgame studied first). He works under one more skilled than himself and is corrected, daily, sharply (playing and losing to the strong). When he ruins a piece, the master makes him *examine the ruined piece* until he sees the exact stroke that spoiled it (analyzing the lost game). And he studies the master's own finished works, tracing the craftsmanship, trying to reproduce it (replaying the great games). There is no other road to a skilled hand, in the forge or on the board — only the patient apprenticeship of drill, correction, examined failure, and imitation of the great, repeated over years until the skill has soaked into the bone. The champion is not born and not conjured; he is *apprenticed*, and the bench is any board you sit at with your whole attention.

So this is your training, Dear Reader, and it asks of you not genius but *devotion* — the willingness to study endings that seem dull, to lose to those stronger and thank them, to sit with your own defeats until they yield their lesson, and to replay the masters until their moves become your instincts. Do this, and you *will* grow strong; there is no player alive whom this labor did not make. Baba Sy walked this exact road from a Dakar street to the roof of the world, and the board you own tonight is the same board he owned. The crown is not given to the gifted; it is earned by the devoted. Sit down, set up an ending, and begin the apprenticeship — for the hand that would wear the crown must first, and for a long time, hold the humble tools with love.

### Letter 36: On the Archmage of the Diagonal

Dear Reader,

We have come to the last letter, and it is time to gather the whole journey into a single vision, as a man at the end of a long climb turns and sees the entire valley he has ascended laid out below him in the evening light. When we began, you knew only that you were beginning to love this game. Now you hold the board, the pieces, the laws of motion, the tyranny of the capture, the arithmetic of material, the geometry of the opposition, the grammar of tactics, the wisdom of position, the named roads of the openings, the patient building of the middlegame, the truth-bearing endings, the vast tree, the reasoning of minimax, the two jaws of forward search and backward database, the human grandeur of Tinsley, the surveyor's proof, and the apprentice's road to mastery. You set out a man; you stand ready to be crowned.

See the whole kingdom at once, for its layers are the very order of this book:

```text
   +--------------------------------------------------------------+
   |  THE TRUTH     checkers is a draw — the star at infinity      |  <- Part IX
   +--------------------------------------------------------------+
   |  THE MACHINE   the game tree, minimax, search, databases      |  <- Part VIII
   +--------------------------------------------------------------+
   |  THE ENDING    where a lone man's advantage becomes a win     |  <- Part VII
   +--------------------------------------------------------------+
   |  THE PLAN      openings, middlegame, structure, position      |  <- IV-VI
   +--------------------------------------------------------------+
   |  THE BLADE     material, the king, tempo, opposition, tactics |  <- II-III
   +--------------------------------------------------------------+
   |  THE GROUND    the board, the diagonal, the forced capture    |  <- Part I
   +--------------------------------------------------------------+
```

Everything you learned finds its place in that column. On the ground of the diagonal and the forced capture stand the blades of material and tactics; upon the blades, the plans of position and opening; upon the plans, the truth-bearing endgame; above the endgame, the machine's vast reckoning; and crowning all, the proven truth of the game itself. A single move — a man pushed from 11 to 15 — ripples through every one of these layers at once, and you now understand every one it touches.

Here is the last isomorphism, the one toward which the whole book has been marching. **The archmage of the diagonal is the man who has crossed the whole board and been crowned — who now sees, like the king, in both directions at once.** Recall the very center of our treatise: the man who may move only forward, bound to one color, unable to retreat, marching across an unknown country; and the king he becomes when he completes the crossing — the piece that sees and moves both ways, forward and back, commanding the whole board. You began this book as that man. You could move only forward — one letter at a time, into material you had not seen, unable to skip ahead, committed to the march. And now, having crossed the whole board of this subject, you are crowned: you can look *backward* down the game, from the endgame truth back to the opening principle, seeing how each layer rests on the one below; and you can look *forward*, from any position, down the branches toward the truth at their leaves. The apprentice saw only the move in front of him; the archmage sees in both directions at once, because he has made the full crossing. You are no longer the man. You are the king who sees both ways.

And what will you do with the crown, Dear Reader? You will sit down at the roadside board where the crowd leans in, and you will play — not perfectly, for no mortal plays perfectly, but *truly*, seeing the bends of the river one by one where your opponent sees only the water. You will win the games that are winnable, by virtue and not by luck: by holding the center, by guarding your gate, by keeping your men in their phalanx, by seeing the shot three moves before it lands, by steering toward the ending whose truth you already know. You will lose, sometimes, to those stronger, and you will thank them and study the loss and grow. And slowly, by the apprentice's road, you will become the master at the board that the young come to learn from — the elder under the tree, the keeper of the diagonal kingdom, the one who has crossed and been crowned.

Here, then, is the awe I have saved for the last page. This whole vast kingdom — the tree of five hundred quintillion positions, the game that defeated all but the greatest man who ever lived and was solved only after eighteen years of machine labor — this entire universe of depth and beauty and truth stands upon *one board, thirty-two dark squares, and a single law that you may travel only on the diagonal.* From so austere a beginning, so boundless a world. That the deepest things should grow from the simplest rules; that a game a child can learn in a minute should hold a truth that took the age of computing to prove; that a man may sit under a mango tree in Dakar or Kumasi with a wooden board and be engaged in something as profound as any theorem of Euler — this is the signature of the One who made a universe of atoms and stars from a handful of simple laws, and set in the human mind the capacity to cross any board and be crowned. Go now, and play. The kingdom of the diagonal is yours, and you have earned the crown.

---

## Epilogue: On the Small Board and the Boundless Mind

Dear Reader,

Euler closed his letters to the princess not with a final fact but with a widening of the view — a reminder that the same laws govern the falling apple and the wheeling moon, and that to have understood one small thing truly is to have touched the order of the whole. Let me close in his spirit.

You have learned, across these letters, a single truth wearing many masks. The diagonal kingdom was constraint breeding depth; the forced capture was the debt that becomes a weapon; the opposition was the geometry of who must move; the phalanx was the strength of brotherhood; the endgame was where the small advantage becomes decisive; the game tree was the genealogy of all possible games; the draw was the sea that all rivers reach. Not one of these truths was invented in a laboratory and carried to Africa as a gift. Every one of them is *already there*, in the game the people play under every tree, in the wisdom the elders already keep — for the draughts master at the motor park, calculating a shot four moves deep while the crowd holds its breath, is a mathematician who never needed the name. This is the deepest lesson of the book, and I would have you carry it above every tactic: *the discipline of profound thought is not foreign to your streets; it is native to them.* The board under the mango tree is a university, and always was.

And there is a final widening, the one Euler would insist upon. The same structure — that boundless depth may grow from a handful of austere rules, that a finite thing may hold more than any mind can exhaust, that patient thought may cross any tree toward its truth — governs the checkerboard and the cosmos alike. The physicist finds a universe of galaxies unfolding from a few equations; the mathematician finds infinities sleeping in the plainest definitions; and the draughts player finds five hundred quintillion games waiting in thirty-two dark squares and one diagonal law. It is all one signature, sounded in every key: that the world is deep beyond our exhausting and *ordered* enough for our understanding, so that a finite mind may sit before a small board, or a small equation, and touch something that goes on forever. That such a thing is possible at all — that the mind and the world should be so matched, the one able to comprehend the other — is not a fact about checkers. It is a fact about the ordered creation, and about the One who ordered it so that a child with a wooden board and a champion with a proof should both, in their measure, be gazing at the same beauty. Go and play, Dear Reader, in the joy of that order. The crown was never the prize. The seeing was the prize — and the seeing goes on forever.
