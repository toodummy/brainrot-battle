# Brainrot Battle

Real-time 1v1 brawler starring absurd original creatures. Vanilla JS + canvas, no build step.

Live: https://brainrot-battle-eight.vercel.app

## Controls
- Desktop: A/D or arrows move (double-tap = dash), W / Space / Up jump, J punch (3-hit string), K heavy (hold to charge, launches; in air = meteor spike), L block (tap just before a hit = parry, stuns), U special (when meter full), Esc menu.
- Mobile: drag the left side to move (flick up = jump, double-flick = dash); PUNCH / HEAVY / BLOCK / SPECIAL buttons on the right. Multitouch.

## Game
- Best of 3, 60s rounds. Ladder of 14 opponents (difficulty ramps) ending with The Omega Brainrot.
- 14 fighters: Sharkopher, Buff Cappuccino, CEO Duck, Toaster Bro, Disco Cactus, Banana Bandit, Broccoli Beefcake, Sir Flushalot (armored tank), Sigma Pigeon (speedster), Rizz Frog (zoner), Spud Swole (grappler, command grab), Sir Snoozles (bathtub trickster), Sobbing Onion (rushdown), The Omega Brainrot (boss).
- Unlocks: start with 3; beat a fighter on the ladder to unlock it, or unlock any for 250 coins. Boss: clear the ladder or premium.
- Juggles, ground bounce, wall bounce, combo scaling, chip damage, projectiles that can be swatted, super-flash specials.
- Fusion Lab (light): your fighter keeps its body and borrows another fighter's special.
- Stubs: `showAd()` (continue / double coins) and `purchase()` (premium fighter) in game.js.

## Files
- `index.html`: UI and styles. `game.js`: the game. `assets/`: webp sprites (idle/attack/hurt) + arena, plus `sprites.json` anchors.
- `?debug` exposes `window.__test` hooks for automated tests.
