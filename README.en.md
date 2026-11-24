# Tumble

A pixel art skill game: a water bottle jumps from furniture to furniture, from the living room to the kitchen, the bedroom and the garden, spinning as it goes. It must always land upright.

*Version française : [README.md](README.md)*


## Phone version

You play with one finger: hold it on the game to charge the jump, release to throw the bottle, and in expert mode keep holding in the air to make it spin faster. NEW GAME, PAUSE and FULL SCREEN sit right under the game; the game pauses by itself when you leave the app (on landing if the bottle is in the air). The object buttons wrap to fit the small screen.

## Easy mode, objects and tricks (new in 1.2.0)

- **Easy mode** (the default): a single move. Hold to aim, release to jump, and the spin adjusts itself so the object lands upright. Five tries, furniture closer together, its own record. **Expert mode** keeps the old way to play.
- **Four objects**, each with its own physics: the bottle, the can (spins fast, also stands upside down), the book (slow, lands on either face) and the phone (fast and demanding). They unlock with flips (15, 40, 80).
- **Scored tricks**: two full turns in the air is a DOUBLE (points ×2); three, a TRIPLE (×3).
- **Starting room**: a room reached once (kitchen, bedroom, garden) can be used as the start.

## Controls

- **Space**, **↑** or **click**: hold to charge the jump, release to throw the bottle.
- **In the air**, hold again: the bottle spins twice as fast.
- **P** or **Esc**: pause (not mid-jump).
- **Gamepad**: hold A (or B, RB, RT, d-pad up) to charge then to spin, **Start** to pause.
- **FULLSCREEN**: the button under the game.

## How it works

- The longer you hold, the **further and higher** the jump. The gauge next to the bottle and white dots show the whole jump.
- An **arrow** and a **ghost** of the bottle show where it will land and which way up, even in flight: **green**, it will land upright; **orange**, hold to make it spin faster; **red**, it will miss. The top of the target furniture lights up in the same colour.
- In the air, the bottle spins slowly by itself. **Holding** makes it spin faster: judge it so it has made one turn (or two) when it arrives.
- It must land **upright** on top of a piece of furniture, within 46°. Almost straight (within 14°) is **PERFECT**: slow motion, flash, stars, and points count double. The game also slows down just before a good landing.
- Jumping **over** a piece of furniture to reach the next scores more. Each flip landed in a row adds a bonus.
- If it lands back on the starting piece, nothing is lost. If it **tips over** or falls **on the floor**, you lose one of your **three bottles** and start again from the same piece. On the third, the game is over.
- Every 15 pieces, you go through a door into another **room**: the **living room** (tables, stools, books, chests, crates), the **kitchen** (counters, fridge, chairs), the **bedroom** (bed, wardrobe, nightstand, chest), then the **garden** (bench, barrel, pots, stumps, wall), and round again. Furniture gets smaller and further apart as you go. A number marks every tenth piece.

## Stats

The Records panel keeps your **best score**, the number of **games**, **flips** and **perfect** flips.

## Data and sync

Your best score and totals are saved by NeoDex, backed up and synced between your PCs if sync is on.

## Install

In NeoDex: **NeoStore → Discover → Tumble → Install**.

Making a plugin: see the [NeoDex SDK](https://github.com/NDesumeur/neodex-sdk).
