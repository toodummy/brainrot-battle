# Brainrot Battle

Fuse two absurd original creatures into one ridiculous fighter, then smash a 15-rung ladder **to the beat**.

- Drag one creature onto another (or tap two + FUSE) for a dramatic fusion reveal with a generated name, description, stats and a combined special move. ~8% chance of an **Absurd Legendary**.
- Battles: tap on the beat (PERFECT = 2x crit), swipe up/down (or arrow keys) to dodge red telegraphs, fire SPECIAL when charged. Random chaos events every few seconds.
- Single self-contained `index.html` (canvas + WebAudio, no external assets). Progress in localStorage.
- Monetization stubs: `showAd(onDone)` (free fusion, reroll, x2 coins) and `purchase(sku, cb)` (Cosmic Cursed Pack). Wire to CrazyGames/Poki SDK and Stripe later.
- Test hook `window.__test` only exists with `?debug`.

Keys: Space/J tap, Up/W jump, Down/S duck, E special, R retry, Esc quit.
