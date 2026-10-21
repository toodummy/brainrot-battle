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

## Fighters, Premium Shop & Gauntlet
- 44 fighters: 24 on the ladder (boss last), unlocked by beating them or with coins; 20 premium fighters (Epic $0.99 / Legendary $1.99 / Mythic $2.99) with a gold aura and trail, a sky-drop intro and a KO burst. Premium is cosmetic only: stats stay inside the regular range.
- SHOP: animated holo cards, stats, special, TRY IT (1-round free trial), bundles (all 20 for $9.99, starter 5 for $3.99), restore purchases.
- **Payments are a TEST stub** (`PAYMENTS.mode='test'` in game.js). `purchase(productId)` records a simulated receipt. To go live, put Stripe Payment Links in `PAYMENTS.stripeLinks[productId]` and grant the fighter on your success redirect or webhook.
- GAUNTLET: random opponents and a win streak. Beating a regular fighter unlocks it.
- Sprites lazy-load per fighter.

## Levels & evolution
- Every fighter earns XP per fight (win 50+, loss 20, perfect +30, combo up to +30, underdog bonus). LV 1-10, +2.5% HP / +2% power per level.
- LV5 = EVOLVED (stage 2), LV10 = ASCENDED (stage 3) with a full-screen evolution cutscene.
- Real evolved art (assets/*_s2_idle.webp, *_s3_idle.webp, meta in assets/evo.json) for 14 core fighters; others get a procedural glow/tint/crown/particles upgrade.
- Ladder/Gauntlet opponents scale in level with rung/streak and your level.
- Debug (`?debug`): `__test.grantXP(id,n)`, `__test.setXP(id,n)`, `__test.evolve(id,from,to)`.
