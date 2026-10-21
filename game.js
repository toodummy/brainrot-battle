'use strict';
const SITE_URL='https://brainrot-battle-eight.vercel.app';
const DEBUG=/[?&]debug\b/.test(location.search);
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const rand=(a,b)=>a+Math.random()*(b-a),pick=a=>a[Math.floor(Math.random()*a.length)],clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),lerp=(a,b,t)=>a+(b-a)*t,sgn=v=>v<0?-1:1;
const easeOutBack=t=>{const c=2.2;return 1+(c+1)*Math.pow(t-1,3)+c*Math.pow(t-1,2)};
const nowS=()=>performance.now()/1000;

// ---------- FIGHTERS (original characters) ----------
const FIGHTERS={
 shark:{name:'Sharkopher',title:'Rushdown menace',pre:'Shark',suf:'opher',h:300,hp:1000,spd:430,pow:1.05,wt:1,jump:1250,col:'#4aa3ff',ai:'aggro',sp:{name:'SNEAKER TORNADO',type:'rush',desc:'Spins across the arena like a tornado, ending in a launcher.'},lines:['no brain just bite','fin-ished','ez snack','chomp chomp, bye']},
 cup:{name:'Buff Cappuccino',title:'Caffeinated bruiser',pre:'Cappu',suf:'ccino',h:300,hp:1100,spd:370,pow:1.15,wt:1.15,jump:1150,col:'#d79a5a',ai:'brawler',sp:{name:'ESPRESSO ERUPTION',type:'quake',desc:'Ground slam that erupts three pillars of hot espresso.'},lines:['decaf? DEcaf?!','brewed different','100% rage roast','espresso yourself']},
 duck:{name:'CEO Duck',title:'Corporate zoner',pre:'Quack',suf:'quarters',h:290,hp:950,spd:390,pow:.95,wt:.95,jump:1200,col:'#ffd23d',ai:'zoner',proj:'case',sp:{name:'HOSTILE TAKEOVER',type:'volley',proj:'case',desc:'Throws a five-briefcase barrage.'},lines:["you're fired",'synergy!','let us circle back','per my last quack']},
 toaster:{name:'Toaster Bro',title:'Carb artillery',pre:'Toast',suf:'inator',h:290,hp:1050,spd:360,pow:1,wt:1.1,jump:1120,col:'#d9dde6',ai:'zoner',proj:'toast',sp:{name:'TOAST BARRAGE',type:'volley',proj:'toast',desc:'Pops out a volley of scalding toast.'},lines:['you just got toasted','carb loaded','crumb and get it','butter luck next time']},
 cactus:{name:'Disco Cactus',title:'Spiky counter-puncher',pre:'Cact',suf:'isco',h:310,hp:1000,spd:390,pow:1,wt:1,jump:1200,col:'#3fcf5a',ai:'turtle',sp:{name:'NEEDLE DISCO',type:'aura',desc:'A spinning disco of needles that pulls you in, then bursts.'},lines:['stay prickly','disco never died','5, 6, 7, STAB','hug me. I dare you.']},
 banana:{name:'Banana Bandit',title:'Slippery speedster',pre:'Bana',suf:'ndit',h:300,hp:900,spd:500,pow:.95,wt:.85,jump:1300,col:'#ffe03d',ai:'aggro',sp:{name:'PEEL OUT',type:'teleport',desc:'Vanishes and reappears behind you with a three-hit slash.'},lines:['split happens','your wallet? mine','a-peeling, right?','slip slip hooray']},
 broc:{name:'Broccoli Beefcake',title:'Leafy tank',pre:'Brocco',suf:'beef',h:320,hp:1200,spd:340,pow:1.2,wt:1.3,jump:1050,col:'#6ae04a',ai:'turtle',sp:{name:'VITAMIN HAYMAKER',type:'haymaker',desc:'Super-armored wind-up into a giant haymaker.'},lines:['eat your greens','never skip leg day','fiber of my being','veggies? no. VEGGIES.']},
 toilet:{name:'Sir Flushalot',title:'Armored opera tank',pre:'Flush',suf:'alot',h:320,hp:1250,spd:320,pow:1.2,wt:1.45,jump:1000,col:'#9fe6ff',ai:'tank',armorH:1,sp:{name:'ROYAL FLUSH',type:'flush',desc:'A whirlpool that drags you in, then a geyser launch.'},lines:['I sing, you SINK','flushed with pride','that was a royal flush','skibbity... no. ROYALTY.']},
 pigeon:{name:'Sigma Pigeon',title:'Speedster',pre:'Pidge',suf:'ma',h:290,hp:850,spd:570,pow:.9,wt:.8,jump:1350,col:'#9a7cff',ai:'speed',sp:{name:'SIGMA GRINDSET',type:'flurry',desc:'Teleporting peck flurry from both sides.'},lines:['coo. then grind.','no breadcrumbs, no mercy','sigma rule #1: peck first','I wake up at 3am to coo']},
 frog:{name:'Rizz Frog',title:'Lounge-singer zoner',pre:'Rizz',suf:'ribbit',h:300,hp:950,spd:380,pow:.95,wt:.95,jump:1300,col:'#7dff5a',ai:'zoner',proj:'note',sp:{name:'SMOOTH OPERATOR',type:'volley',proj:'heart',stun:1,desc:'Serenades you with hearts; the last one charms (stuns).'},lines:['you just got RIZZED','ribbit, baby','this next one goes out to your HP bar','unspoken rizz, spoken KO']},
 potato:{name:'Spud Swole',title:'Grappler (command grab)',pre:'Spud',suf:'swole',h:310,hp:1150,spd:350,pow:1.15,wt:1.3,jump:1050,col:'#d9a35a',ai:'grappler',grab:1,sp:{name:'MASHED SUPLEX',type:'suplex',desc:'Charging command grab into a huge suplex. Unblockable.'},lines:['you got MASHED','carbs are a lifestyle','do you even starch, bro?','tater? I hardly know her']},
 cat:{name:'Sir Snoozles',title:'Bathtub trickster',pre:'Snooze',suf:'zles',h:270,hp:950,spd:430,pow:1,wt:1.05,jump:1150,col:'#ff9d3d',ai:'trick',sp:{name:'BUBBLE CLONES',type:'clone',desc:'Bubble clones charge from both sides, then a sneak attack.'},lines:['5 more minutes...','splish splash, you crash','nap time is KO time','I was asleep for that']},
 onion:{name:'Sobbing Onion',title:'Crybaby rushdown',pre:'Sob',suf:'nion',h:285,hp:950,spd:480,pow:1.05,wt:.9,jump:1250,col:'#c9409a',ai:'aggro',sp:{name:'TEAR TSUNAMI',type:'tsunami',desc:'Cries a wave that sweeps you across the arena.'},lines:["I'm not crying, YOU'RE crying",'layers of PAIN','*sniff* that was for my mom','emotional damage, literally']},
 hamster:{name:'Turbo Hamster',title:'Rolling rushdown',pre:'Ham',suf:'ster',h:270,hp:880,spd:540,pow:.95,wt:.8,jump:1320,col:'#ffb347',ai:'speed',sp:{name:'BALL ROLL',type:'rush',txt:'ROLLED!',desc:'Curls into a hamster ball and steamrolls across the arena, ending in a launcher.'},lines:['gamer fuel: sunflower seeds','wheel day every day','I go zoomies, you go boom','respawn? never heard of it']},
 microwave:{name:'Microwave Mage',title:'Popcorn zoner',pre:'Micro',suf:'mage',h:300,hp:980,spd:350,pow:1,wt:1.1,jump:1100,col:'#b28cff',ai:'sniper',proj:'popcorn',sp:{name:'POPCORN STORM',type:'rain',proj:'popcorn',n:10,txt:'POPPED!',desc:'Rains a storm of molten popcorn down on the opponent from above.'},lines:['ding! you are done','30 seconds on high','stand back from the door','reheated and defeated']},
 sock:{name:'Sock Samurai',title:'Spinning duelist',pre:'Sock',suf:'murai',h:300,hp:940,spd:450,pow:1.05,wt:.9,jump:1250,col:'#ff4d5e',ai:'trick',sp:{name:'SPIN CYCLE',type:'vortex',col:'#ff8a96',spin:1,txt:'SPIN CYCLE!',desc:'Becomes a washing-machine whirlwind that sucks you in, then blasts you out.'},lines:['my pair? lost in battle','the dryer took my brother','stitch by stitch','fresh out the wash']},
 avocado:{name:'Avo-Cardio',title:'Fitness boomeranger',pre:'Avo',suf:'cardio',h:300,hp:1000,spd:420,pow:1,wt:1,jump:1220,col:'#7bc043',ai:'zoner',proj:'pit',sp:{name:'PIT STOP',type:'boomerang',proj:'pit',txt:'PIT STOP!',desc:'Hurls two spinning avocado pits that fly out and come back for a second hit.'},lines:['healthy fats, deadly hands','no pit, no glory','feel the burn, toast','guac and roll']},
 cheese:{name:'Big Cheese',title:'Luchador grappler',pre:'Ched',suf:'dar',h:320,hp:1180,spd:340,pow:1.15,wt:1.35,jump:1020,col:'#ffcc33',ai:'grappler',grab:1,sp:{name:'FONDUE PILEDRIVER',type:'suplex',txt:'FONDUED!',desc:'A charging command grab ending in a molten piledriver. Unblockable.'},lines:['say cheese!','grate expectations','you are nacho champion','holes in my body, not my game']},
 cone:{name:'Cone Ranger',title:'Ground-wave sheriff',pre:'Cone',suf:'ranger',h:300,hp:1020,spd:380,pow:1.05,wt:1.05,jump:1150,col:'#ff7a1a',ai:'brawler',sp:{name:'ROAD WORK AHEAD',type:'shockwave',col:'#ff7a1a',txt:'DETOUR!',desc:'Slams the ground and sends a wall of erupting traffic cones racing across the floor.'},lines:['this town has a speed limit','yield, partner','road work ahead? uh, yeah','orange you glad I came']},
 dino:{name:'Office Rex',title:'Corporate meteor',pre:'Rex',suf:'ecutive',h:320,hp:1120,spd:360,pow:1.15,wt:1.25,jump:1150,col:'#2fa59a',ai:'rage',sp:{name:'METEOR MEETING',type:'meteor',col:'#ff7a1a',txt:'EXTINCT!',desc:'Leaps sky high, then crashes down like an asteroid. Huge area slam.'},lines:['this meeting could have been a roar','per my last email: RAWR','coffee first, carnage second','I report to no one']},
 jelly:{name:'Wobble Jelly',title:'Bouncy bruiser',pre:'Jel',suf:'lybean',h:290,hp:1060,spd:400,pow:1.05,wt:.95,jump:1380,col:'#ff3355',ai:'brawler',sp:{name:'WOBBLE QUAKE',type:'quake',txt:'WOBBLED!',desc:'Belly-flops so hard the ground erupts in three jiggly shock pillars.'},lines:['I wobble, you topple','set and ready','cherry on top of your loss','jiggle physics: maxed']},
 sloth:{name:'DJ Sloth',title:'Slow-mo counter DJ',pre:'Slo',suf:'th',h:290,hp:1080,spd:300,pow:1.05,wt:1.15,jump:1050,col:'#8bc34a',ai:'turtle',sp:{name:'BASS DROP',type:'aura',col:'#2ec5ff',txt:'BASS DROP!',desc:'Spins a crushing bass field that pulls you in, then drops a huge sound blast.'},lines:['...wait for it...','dropping the bass. slowly.','chill is a weapon','unhurried, unbothered, undefeated']},
 lamp:{name:'Lava Lamp Larry',title:'Groovy laser zoner',pre:'La',suf:'vamp',h:300,hp:960,spd:370,pow:1,wt:1,jump:1180,col:'#ff4fb8',ai:'sniper',proj:'orb',pcol:'#ff8a3d',sp:{name:'GROOVY BEAM',type:'beam',col:'#ff8a3d',txt:'FAR OUT!',desc:'Fires a full-screen beam of molten groovy lava.'},lines:['peace, love, and lasers','far out, man','your vibe is off','lava you, mean it']},
 gnome:{name:'Neon Gnome Ninja',title:'Electric assassin',pre:'Gno',suf:'minja',h:270,hp:900,spd:520,pow:.95,wt:.85,jump:1350,col:'#2ec5ff',ai:'speed',prem:'epic',sp:{name:'LAWN LIGHTNING',type:'lightning',n:3,col:'#7fe8ff',txt:'ZAPPED!',desc:'Calls three tracking lightning strikes down on the opponent.'},lines:['get off my lawn. permanently.','silent, but glowing','garden variety pain','I plant the hurt']},
 nugget:{name:'Sir Nugget the Golden',title:'Golden knight',pre:'Nug',suf:'galot',h:300,hp:1100,spd:370,pow:1.1,wt:1.15,jump:1120,col:'#ffc400',ai:'tank',armorH:1,prem:'epic',sp:{name:'DIPPING SAUCE SLASH',type:'haymaker',txt:'DIPPED!',desc:'Powers up with super armor, then lunges with a sauce-soaked golden sword slash.'},lines:['for honor and dipping sauce','twenty piece, zero mercy','golden brown, golden crown','you have been battered']},
 croissant:{name:'Captain Croissant',title:'Pirate artillery',pre:'Crois',suf:'sant',h:300,hp:1000,spd:370,pow:1,wt:1.05,jump:1150,col:'#2b5fd9',ai:'zoner',proj:'cannon',prem:'epic',sp:{name:'BUTTER BROADSIDE',type:'volley',proj:'cannon',txt:'BROADSIDE!',desc:'Fires a five-cannonball broadside of buttery cannon fire.'},lines:['all flakes on deck','ye be toast','pastry plunder!','a buttery grave awaits']},
 monk:{name:'Morel Monk',title:'Zen counter master',pre:'Mor',suf:'el',h:300,hp:1000,spd:400,pow:1,wt:.95,jump:1200,col:'#e0a040',ai:'turtle',prem:'epic',sp:{name:'SPORE ZEN',type:'aura',col:'#ffe066',txt:'ENLIGHTENED!',desc:'A spinning meditation of golden spores drags you in, then bursts.'},lines:['be like the mushroom: grounded','inner peace, outer pain','I grew in the dark','spore you the details']},
 goose:{name:'Warlord Goose',title:'Chaos speedster',pre:'Goo',suf:'sar',h:310,hp:980,spd:500,pow:1.05,wt:.95,jump:1300,col:'#f5f5f5',ai:'rage',prem:'epic',sp:{name:'HONK OF DOOM',type:'flurry',txt:'HONKED!',desc:'Teleporting peck flurry from every side, finished by a doom honk.'},lines:['HONK.','peace was never an option','I choose violence','bread? I take EVERYTHING']},
 vacuum:{name:'Vac-9000',title:'Suction tank',pre:'Vac',suf:'tron',h:320,hp:1180,spd:330,pow:1.1,wt:1.4,jump:1000,col:'#a64dff',ai:'tank',armorH:1,prem:'epic',sp:{name:'SUCTION SINGULARITY',type:'vortex',col:'#c070ff',txt:'VACUUMED!',desc:'Opens a black-hole vortex that vacuums you in, then ejects you.'},lines:['dust to dust','you have been cleaned','suction level: OVER 9000','beep. boop. bye.']},
 snail:{name:'Astro Snail',title:'Rocket rushdown',pre:'Sna',suf:'stro',h:300,hp:1000,spd:460,pow:1,wt:1,jump:1200,col:'#4caf50',ai:'aggro',prem:'epic',sp:{name:'NITRO SLIME',type:'rush',txt:'SLIMED!',desc:'Ignites the shell rocket and blasts through the opponent on a slime trail.'},lines:['slow? not in zero G','houston, you have a problem','one small slime for snail','the shell is a rocket now']},
 cloud:{name:'Storm Cloud Stu',title:'Weather bruiser',pre:'Storm',suf:'stu',h:310,hp:1060,spd:380,pow:1.05,wt:1.1,jump:1250,col:'#6b7a99',ai:'brawler',prem:'epic',sp:{name:'THUNDER TANTRUM',type:'lightning',n:5,col:'#ffe066',txt:'THUNDERSTRUCK!',desc:'Throws a tantrum of five rapid lightning bolts around the opponent.'},lines:['100% chance of pain','I am under the weather. YOU are under ME','rain check? denied','forecast: knockout']},
 dragon:{name:'Maki Dragon',title:'Wasabi beam zoner',pre:'Ma',suf:'kidragon',h:320,hp:1040,spd:390,pow:1.05,wt:1.1,jump:1200,col:'#3aa655',ai:'sniper',proj:'orb',pcol:'#9cff3d',prem:'legendary',sp:{name:'WASABI BREATH',type:'beam',col:'#9cff3d',txt:'TOO SPICY!',desc:'Breathes a screen-long stream of blazing wasabi fire.'},lines:['roll with it','extra wasabi, no mercy','I am the chef now','soy sorry for you']},
 hippo:{name:'Pharaoh Hippo',title:'Sand tank',pre:'Hippo',suf:'tep',h:320,hp:1160,spd:340,pow:1.15,wt:1.4,jump:1020,col:'#8e44ad',ai:'tank',prem:'legendary',sp:{name:'SANDSTORM DYNASTY',type:'tsunami',col:'#e6c27a',txt:'ENTOMBED!',desc:'Summons a rolling dune of sand that sweeps you across the arena.'},lines:['bow before the river king','your tomb is ready','I built pyramids for fun','sand in your eyes, forever']},
 phoenix:{name:'Blaze Phoenix',title:'Fire diver',pre:'Phoe',suf:'nix',h:310,hp:960,spd:470,pow:1.05,wt:.9,jump:1400,col:'#ff8a00',ai:'aggro',prem:'legendary',sp:{name:'REBIRTH DIVE',type:'meteor',col:'#ff5a00',txt:'REBORN!',desc:'Soars up in flames and dive-bombs the opponent with a fiery crash.'},lines:['I rise. you fall.','squeak of fire','ashes to ashes, you to dust','born again, hit again']},
 unicorn:{name:'Prism Unicorn',title:'Rainbow charger',pre:'Uni',suf:'corn',h:310,hp:1040,spd:450,pow:1.05,wt:1.05,jump:1250,col:'#d6b8ff',ai:'rage',prem:'legendary',sp:{name:'PRISM CHARGE',type:'rush',txt:'PRISMATIC!',desc:'A horn-first rainbow charge that refracts straight through the opponent.'},lines:['taste the rainbow beam','horn of plenty (of pain)','magic? no. muscle.','glitter is my war paint']},
 shrimp:{name:'Tempura Ronin',title:'Iaido duelist',pre:'Tem',suf:'pura',h:300,hp:960,spd:470,pow:1.05,wt:.95,jump:1250,col:'#ff9a3c',ai:'trick',prem:'legendary',sp:{name:'TEMPURA IAI',type:'teleport',txt:'BATTERED!',desc:'Vanishes in a puff of batter and reappears behind you with a three-cut draw.'},lines:['one cut, crispy','the blade is hot oil','I was fried for this','your guard is soggy']},
 kraken:{name:'DJ Kraken Jr.',title:'Eight-arm trickster',pre:'Krak',suf:'en',h:290,hp:980,spd:420,pow:1,wt:1,jump:1200,col:'#1abc9c',ai:'trick',proj:'disc',prem:'legendary',sp:{name:'TENTACLE REMIX',type:'clone',txt:'REMIXED!',desc:'Drops ink clones that charge in from both sides, then strikes from behind.'},lines:['eight arms, eight decks','drop the beat, and you','ink-credible','release the remix']},
 owl:{name:'Galaxy Owl Archmage',title:'Starfall sniper',pre:'Ow',suf:'lmage',h:310,hp:940,spd:360,pow:1,wt:.95,jump:1200,col:'#6a3df0',ai:'sniper',proj:'star',prem:'legendary',sp:{name:'STARFALL',type:'rain',proj:'star',n:9,txt:'STARSTRUCK!',desc:'Calls a meteor shower of stars down on the opponent.'},lines:['who? YOU. you lose.','the stars have spoken','wisdom hits different','night shift starts now']},
 golem:{name:'Trophy Titan',title:'Championship tank',pre:'Tro',suf:'phytan',h:330,hp:1200,spd:320,pow:1.15,wt:1.5,jump:980,col:'#ffcc00',ai:'tank',armorH:1,prem:'legendary',sp:{name:'VICTORY QUAKE',type:'quake',txt:'CHAMPION!',desc:'A golden ground-pound that erupts three pillars of glory.'},lines:['participation trophy? never.','I am the prize','gold medal in pain','polished and undefeated']},
 duckgod:{name:'Quackzilla Prime',title:'Cosmic duck god',pre:'Quack',suf:'zilla',h:320,hp:1060,spd:390,pow:1.05,wt:1.15,jump:1200,col:'#a06bff',ai:'boss',proj:'orb',pcol:'#c38bff',prem:'mythic',sp:{name:'QUACKSAR',type:'beam',col:'#c38bff',w:200,txt:'QUACKSAR!',desc:'Unleashes a cosmic quasar beam from its beak. Wider than normal beams.'},lines:['ascended beyond bread','the pond is infinite','one quack to rule them all','kneel, mortal mallard']},
 angel:{name:'Seraph Toast',title:'Holy paladin',pre:'Sera',suf:'phtoast',h:310,hp:1080,spd:380,pow:1.05,wt:1.1,jump:1200,col:'#ffe08a',ai:'brawler',prem:'mythic',sp:{name:'HOLY CRUMBS',type:'aura',col:'#fff2a8',txt:'BLESSED!',desc:'A radiant halo of holy crumbs drags you in, then explodes in divine light.'},lines:['buttered by the heavens','golden brown and glowing','repent, you crumb','toasted. blessed. undefeated.']},
 jester:{name:'Void Jester',title:'Chaos trickster',pre:'Jes',suf:'ter',h:300,hp:940,spd:480,pow:1,wt:.9,jump:1320,col:'#8a2be2',ai:'trick',proj:'orb',pcol:'#b44dff',prem:'mythic',sp:{name:'INFINITE PRANK',type:'clone',txt:'PRANKED!',desc:'Splits into void clones that rush from both sides, then pops up behind you.'},lines:['the joke is infinite','hahaha... ha.','reality is my whoopee cushion','you laughed? you lost']},
 corgi:{name:'Mecha Corgi Omega',title:'Laser mech',pre:'Cor',suf:'gimech',h:320,hp:1100,spd:380,pow:1.05,wt:1.25,jump:1150,col:'#ffb300',ai:'sniper',proj:'laser',prem:'mythic',sp:{name:'CORGI CANNON',type:'volley',proj:'laser',txt:'GOOD BOY!',desc:'Fires a five-shot laser barrage from the mech arm cannons.'},lines:['who is a good boy? ME. with lasers.','fetch THIS','short legs, long range','bark. boom. done.']},
 boss:{name:'The Omega Brainrot',title:'Final boss',pre:'Brain',suf:'rot',h:380,hp:1500,spd:370,pow:1.25,wt:1.6,jump:1080,col:'#c13bff',ai:'boss',proj:'orb',sp:{name:'BRAIN BLAST',type:'beam',desc:'A screen-wide beam of pure brainrot.'},lines:['I AM THE FEED','scroll forever','your attention is mine','like, subscribe, perish'],boss:1},
};
const IDS=Object.keys(FIGHTERS);IDS.forEach(k=>FIGHTERS[k].id=k);
const START=['shark','cup','duck'];
const LADDER=['banana','pigeon','hamster','duck','sock','onion','jelly','cactus','frog','lamp','toaster','cone','cat','avocado','cup','dino','microwave','potato','sloth','broc','cheese','toilet','shark','boss'];
const LAST=LADDER.length-1,DIFF=LADDER.map((_,i)=>+(.1+.82*i/LAST).toFixed(2));
const RUNG_TAG=['Warm-up','Grindset','Wheel day','Middle management','Spin cycle','Emotional damage','Jiggle physics','Prickly','Rizz check','Lava lounge','Carb loaded','Road work','Nap trap','Guac day','Pre-workout','Board meeting','Ding!','Starch slam','Bass drop','Leg day','Cheese grater','Throne room','Apex snack','FINAL BOSS'];
const UNLOCK_COST=250;

// ---------- PREMIUM CATALOG ----------
// Cosmetic-premium: premium fighters get flashier FX (aura, intro, KO, SFX) but stats are in the same range as regulars.
const TIERS={epic:{label:'EPIC',price:.99},legendary:{label:'LEGENDARY',price:1.99},mythic:{label:'MYTHIC',price:2.99}};
const PREM_IDS=IDS.filter(i=>FIGHTERS[i].prem);
const CATALOG={};
PREM_IDS.forEach(id=>{const t=FIGHTERS[id].prem;CATALOG['fighter_'+id]={id:'fighter_'+id,kind:'fighter',title:FIGHTERS[id].name,tier:t,price:TIERS[t].price,currency:'USD',grants:[id]}});
CATALOG.premium_omega_brainrot={id:'premium_omega_brainrot',kind:'fighter',title:'The Omega Brainrot',tier:'boss',price:1.99,currency:'USD',grants:['boss']};
CATALOG.bundle_all20={id:'bundle_all20',kind:'bundle',title:'Premium Pack: all 20',price:9.99,currency:'USD',grants:[...PREM_IDS]};
CATALOG.bundle_starter5={id:'bundle_starter5',kind:'bundle',title:'Starter 5-pack',price:3.99,currency:'USD',grants:['gnome','goose','dragon','unicorn','corgi']};
const productFor=id=>id==='boss'?'premium_omega_brainrot':'fighter_'+id;

// ---------- ASSETS (lazy: sprites load per fighter, on demand) ----------
const SPR={},META={},SIL={},LOADING={};let BG=null,assetsReady=false;
function loadImg(src){return new Promise((res,rej)=>{const i=new Image();i.onload=()=>res(i);i.onerror=()=>rej(new Error('load '+src));i.src=src})}
function silhouette(img,col){const k=.5,c=document.createElement('canvas');c.width=Math.ceil(img.width*k);c.height=Math.ceil(img.height*k);const x=c.getContext('2d');x.drawImage(img,0,0,c.width,c.height);x.globalCompositeOperation='source-in';x.fillStyle=col;x.fillRect(0,0,c.width,c.height);return c}
const imgSrc=(id,p='idle')=>`assets/${id}_${p}.webp`;
const isLoaded=id=>!!(SPR[id]&&SPR[id].idle&&SPR[id].attack&&SPR[id].hurt);
function ensureFighter(id){if(isLoaded(id))return Promise.resolve();if(LOADING[id])return LOADING[id];
 return LOADING[id]=Promise.all(['idle','attack','hurt'].map(p=>loadImg(imgSrc(id,p)))).then(ims=>{SPR[id]={};SIL[id]={};['idle','attack','hurt'].forEach((p,i)=>{SPR[id][p]=ims[i];SIL[id][p]={w:silhouette(ims[i],'#fff'),r:silhouette(ims[i],'#ff2040')}})}).catch(e=>{delete LOADING[id];throw e})}
async function loadAssets(){const m=await fetch('assets/sprites.json').then(r=>r.json());Object.assign(META,m);
 await Promise.all([loadImg('assets/arena.webp').then(i=>BG=i),ensureFighter(owned(S.pick)?S.pick:'shark')]);assetsReady=true}

// ---------- AUDIO ----------
let AC=null,master=null,NB=null;
function audio(){if(!AC){try{AC=new(window.AudioContext||window.webkitAudioContext)();const comp=AC.createDynamicsCompressor();comp.threshold.value=-12;comp.ratio.value=5;master=AC.createGain();master.gain.value=S.muted?0:.6;master.connect(comp);comp.connect(AC.destination);NB=AC.createBuffer(1,AC.sampleRate,AC.sampleRate);const d=NB.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1}catch(e){AC=null}}if(AC&&AC.state==='suspended')AC.resume();return AC}
function tone(type,f1,f2,dur,vol,when=0,lp=0){if(!AC)return;const t=when||AC.currentTime,o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.setValueAtTime(f1,t);if(f2!==f1)o.frequency.exponentialRampToValueAtTime(Math.max(20,f2),t+dur);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+.005);g.gain.exponentialRampToValueAtTime(.0008,t+dur);let n=o;if(lp){const f=AC.createBiquadFilter();f.type='lowpass';f.frequency.value=lp;o.connect(f);n=f}n.connect(g);g.connect(master);o.start(t);o.stop(t+dur+.02)}
function noise(dur,vol,fq,when=0,type='bandpass',q=1,f2=0){if(!AC)return;const t=when||AC.currentTime,s=AC.createBufferSource(),f=AC.createBiquadFilter(),g=AC.createGain();s.buffer=NB;f.type=type;f.frequency.setValueAtTime(fq,t);if(f2)f.frequency.exponentialRampToValueAtTime(f2,t+dur);f.Q.value=q;g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.0008,t+dur);s.connect(f);f.connect(g);g.connect(master);s.start(t,Math.random()*.5);s.stop(t+dur+.02)}
const T=()=>AC?AC.currentTime:0;
const SFX={
 click(){tone('square',660,880,.05,.1)},
 light(){noise(.07,.55,1800);tone('sine',220,70,.1,.7);tone('square',700,250,.04,.1)},
 heavy(){noise(.18,.9,700,0,'lowpass');tone('sine',140,35,.25,1);tone('sawtooth',300,80,.12,.15,0,1500)},
 whiff(){noise(.12,.25,600,0,'bandpass',2,2500)},
 dash(){noise(.18,.35,300,0,'bandpass',2,3000)},
 jump(){tone('sine',260,520,.12,.25)},
 land(){noise(.06,.3,300,0,'lowpass')},
 block(){tone('triangle',1200,900,.08,.25);noise(.05,.3,4000,0,'highpass')},
 parry(){tone('triangle',1568,1568,.25,.3);tone('triangle',2093,2093,.35,.25,T()+.06);noise(.1,.5,6000,0,'highpass')},
 charge(){tone('sawtooth',120,600,.5,.12,0,1200)},
 super(){tone('sawtooth',150,1600,.5,.2,0,2500);noise(.5,.3,500,0,'bandpass',3,6000);setTimeout(()=>{noise(.6,.9,900,0,'lowpass',1,80);tone('sine',90,30,.6,1)},450)},
 boom(){noise(.7,1,900,0,'lowpass',1,80);tone('sine',90,30,.7,1)},
 proj(){tone('square',500,900,.08,.12)},
 wall(){noise(.2,.8,400,0,'lowpass');tone('square',90,50,.2,.3)},
 coin(){tone('square',988,988,.06,.12);tone('square',1319,1319,.12,.12,T()+.06)},
 bell(){[0,.18,.36].forEach(d=>tone('triangle',1046,1046,.4,.3,T()+d))},
 fanfare(){const t=T();[[523,0],[659,.12],[784,.24],[1047,.36],[784,.5],[1047,.62]].forEach(([f,d])=>{tone('square',f,f,.2,.13,t+d,2500);tone('triangle',f/2,f/2,.3,.2,t+d)})},
 flush(){noise(1.1,.8,300,0,'bandpass',1,2600);tone('sine',220,55,1,.45);setTimeout(()=>noise(.5,.6,1200,0,'highpass'),700)},
 coo(){tone('sine',620,480,.14,.35);tone('sine',480,640,.18,.35,T()+.16);tone('sine',640,470,.2,.3,T()+.36)},
 croon(){[392,494,587,784,740,784].forEach((f,i)=>{tone('triangle',f,f*1.01,.28,.25,T()+i*.11);tone('sine',f*2,f*2,.2,.06,T()+i*.11)})},
 grunt(){tone('sawtooth',150,85,.3,.45,0,800);noise(.2,.5,500,0,'lowpass');tone('sawtooth',120,70,.35,.4,T()+.35,700)},
 meow(){tone('triangle',700,1150,.14,.3);tone('triangle',1150,480,.35,.3,T()+.14);noise(.4,.2,3000,T()+.1,'highpass')},
 sob(){[0,.24,.48].forEach(d=>tone('sawtooth',540,360,.2,.16,T()+d,1500));noise(.8,.3,2000,T()+.2,'bandpass',2,600)},
 zap(){noise(.3,.9,2500,0,'highpass');tone('sawtooth',1400,60,.32,.28);noise(.4,.5,400,T()+.05,'lowpass')},
 choir(){const t=T();[523,659,784,1046].forEach((f,i)=>{tone('sine',f,f*1.003,1.1,.07,t+i*.04);tone('triangle',f*2,f*2,.8,.02,t+.1+i*.04)})},
 sparkle(){const t=T();[1568,2093,2637,3136,2637].forEach((f,i)=>tone('triangle',f,f,.12,.07,t+i*.05))},
 womp(){const t=T();[294,277,262,233].forEach((f,i)=>tone('sawtooth',f,i==3?180:f*.97,i==3?.8:.32,.2,t+i*.34,900))},
};
function say(txt){if(S.muted||!window.speechSynthesis)return;try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(txt);u.pitch=.6;u.rate=1.05;speechSynthesis.speak(u)}catch(e){}}
const MUS={on:false};
function musicStart(){audio();if(!AC)return;MUS.on=true;MUS.n=0;MUS.t0=AC.currentTime+.1;MUS.spb=60/128;MUS.root=pick([55,58.3,49])}
function musicStop(){MUS.on=false}
function musicTick(){if(!MUS.on||!AC)return;while(MUS.t0+MUS.n*MUS.spb/2<AC.currentTime+.2){const w=MUS.t0+MUS.n*MUS.spb/2,i=MUS.n%8,bar=Math.floor(MUS.n/8),f=MUS.root*Math.pow(2,[0,0,3,-2][bar%4]/12);
 if(i%2===0)tone('sine',150,40,.16,.7,w);if(i===2||i===6)noise(.12,.3,1800,w);noise(.03,i%2?.12:.06,9000,w,'highpass');if([0,3,6].includes(i))tone('sawtooth',f,f,.2,.16,w,600);if(i===7&&bar%2)tone('square',f*4,f*3,.1,.03,w,2000);MUS.n++}}

// ---------- SAVE ----------
const SAVE_KEY='brainrot_brawler_v1';
function freshSave(){return{v:1,coins:50,unlocked:[...START],rung:0,pick:'shark',donor:null,fusions:[],bestCombo:0,wins:0,muted:false,prem:false,tab:'all',gStreak:0,gBest:0,lv:3}}
let S=(()=>{try{const d=JSON.parse(localStorage.getItem(SAVE_KEY));if(d&&d.v===1)return Object.assign(freshSave(),{lv:0},d)}catch(e){}return freshSave()})();
// migrations: lv0 = 8-rung ladder, lv2 = 14-rung ladder, lv3 = 24-rung ladder. Rung is remapped by opponent id; a cleared ladder stays cleared.
if(!S.lv){if(S.rung>0){const OLD=['banana','duck','cactus','toaster','cup','broc','shark','boss'];S.rung=S.rung>=OLD.length?LADDER.length:LADDER.indexOf(OLD[S.rung])}S.lv=3}
if(S.lv===2){if(S.rung>0){const OLD2=['banana','pigeon','duck','onion','cactus','frog','toaster','cat','cup','potato','broc','toilet','shark','boss'];S.rung=S.rung>=OLD2.length?LADDER.length:Math.max(0,LADDER.indexOf(OLD2[S.rung]))}S.lv=3}
if(S.prem&&!S.unlocked.includes('boss'))S.unlocked.push('boss');
S.unlocked=S.unlocked.filter(id=>FIGHTERS[id]);if(!FIGHTERS[S.pick])S.pick='shark';
try{localStorage.setItem(SAVE_KEY,JSON.stringify(S))}catch(e){}
function save(){try{localStorage.setItem(SAVE_KEY,JSON.stringify(S))}catch(e){}}

// ---------- STUBS ----------
// Replace with CrazyGames/Poki rewarded ad. onDone only fires if the ad completed.
function showAd(onDone){const o=$('#adOverlay');let n=DEBUG?1:3;o.style.display='flex';$('#adCount').textContent=n;const iv=setInterval(()=>{n--;$('#adCount').textContent=n;if(n<=0){clearInterval(iv);o.style.display='none';onDone&&onDone()}},DEBUG?120:1000)}

// ====================== PAYMENTS: TEST STUB (NO REAL CHARGES) ======================
// purchase(productId) is the ONLY function that talks to a payment provider. Product ids/prices live in CATALOG.
// mode 'test'  : simulates a successful checkout locally and writes a fake receipt. Nobody is charged.
// mode 'stripe': redirects to the Stripe Payment Link in stripeLinks[productId] (client_reference_id = productId).
//   For production, grant fighters only after your server confirms payment (Stripe webhook or Checkout Session
//   lookup on the success_url), and make restorePurchases() ask that server instead of localStorage.
const PAYMENTS={mode:'test',stripeLinks:{/* fighter_dragon:'https://buy.stripe.com/...', bundle_all20:'https://buy.stripe.com/...' */}};
const RECEIPT_KEY='brainrot_receipts';
function receipts(){try{return JSON.parse(localStorage.getItem(RECEIPT_KEY))||[]}catch(e){return[]}}
async function purchase(productId){const P=CATALOG[productId];if(!P)return{ok:false,error:'Unknown product'};
 if(PAYMENTS.mode==='stripe'){const link=PAYMENTS.stripeLinks[productId];if(!link)return{ok:false,error:'Store not connected yet'};location.href=link+(link.includes('?')?'&':'?')+'client_reference_id='+encodeURIComponent(productId);return{ok:false,pending:true}}
 await new Promise(r=>setTimeout(r,DEBUG?150:900)); // TEST MODE: fake network delay, always succeeds
 const receipt={id:'test_'+Date.now().toString(36)+Math.random().toString(36).slice(2,7),productId,price:P.price,currency:P.currency,test:true,at:new Date().toISOString()};
 const R=receipts();R.push(receipt);try{localStorage.setItem(RECEIPT_KEY,JSON.stringify(R))}catch(e){}return{ok:true,receipt}}
function grant(ids){let n=0;for(const id of ids)if(FIGHTERS[id]&&!S.unlocked.includes(id)){S.unlocked.push(id);n++}save();return n}
function restorePurchases(){let n=0;for(const r of receipts()){const P=CATALOG[r.productId];if(P)n+=grant(P.grants)}SFX.click();toast(n?`Restored ${n} fighter${n>1?'s':''}!`:'Nothing new to restore');if($('#shop').classList.contains('on'))renderShop()}

// ---------- MENUS ----------
function toast(m,ms=1800){const t=$('#toast');t.textContent=m;t.style.display='block';clearTimeout(toast.h);toast.h=setTimeout(()=>t.style.display='none',ms)}
function modal(h,cls=''){$('#mbox').innerHTML=h;$('#mbox').className='box '+cls;$('#modal').style.display='flex'}
function closeModal(){$('#modal').style.display='none'}
function setCoins(){$$('.coins').forEach(e=>e.textContent=S.coins)}
function screen(id){$$('.scr').forEach(s=>s.classList.toggle('on',s.id===id));if(id==='home')renderHome();if(id==='select')renderSelect();if(id==='shop')renderShop()}
const fname=(body,donor)=>donor&&donor!==body?FIGHTERS[body].pre+FIGHTERS[donor].suf:FIGHTERS[body].name;
const fmt=p=>'$'+p.toFixed(2);
const tierOf=id=>FIGHTERS[id].prem||(id==='boss'?'boss':null);
const TLABEL=t=>t==='boss'?'BOSS':TIERS[t].label;
const pimg=(id,cls='')=>`<img loading="lazy" class="${cls}" src="${imgSrc(id)}" alt="${FIGHTERS[id].name}">`;
function owned(id){return S.unlocked.includes(id)}
function renderHome(){setCoins();$('#hero').innerHTML=['cup','shark','duck'].map(i=>`<img src="${imgSrc(i)}" alt="">`).join('');
 $('#ladderTxt').textContent=S.rung>LAST?'CLEARED!':`rung ${S.rung+1}/${LADDER.length}`;
 $('#ladder').innerHTML=LADDER.map((id,i)=>`<div class="rung ${i<S.rung?'done':i===Math.min(S.rung,LAST)?'cur':''} ${i>S.rung?'lock':''}"><div class="pic">${pimg(id)}</div>${i>S.rung?'???':FIGHTERS[id].name}<br><span style="color:#d9c6ff">${RUNG_TAG[i]}</span></div>`).join('');
 $('#gBest').textContent=S.gBest?`BEST STREAK ${S.gBest}`:'random foes, win streaks';
 $('#bannerImgs').innerHTML=['nugget','duckgod','dragon'].map(i=>pimg(i)).join('');
 $('#muteBtn').textContent=S.muted?'SOUND OFF':'SOUND ON'}
const st=(k,v,m)=>`<div class="stat"><span>${k}</span><div><i style="width:${clamp(v/m*100,8,100)}%"></i></div></div>`;
function renderSelect(){setCoins();if(!owned(S.pick))S.pick='shark';const F=FIGHTERS[S.pick],donor=S.donor&&owned(S.donor)?S.donor:null,sp=donor?FIGHTERS[donor].sp:F.sp,t=tierOf(S.pick);
 $('#info').className='info'+(t?' prem t-'+t:'');
 $('#info').innerHTML=`<img src="${imgSrc(S.pick)}" alt=""><div class="t">${t?`<span class="chip t-${t}">${TLABEL(t)}</span>`:''}${fname(S.pick,donor)}<small>${F.title}${donor?' + '+FIGHTERS[donor].name+' special':''}</small>${st('HP',F.hp,1500)}${st('SPEED',F.spd,570)}${st('POWER',F.pow,1.3)}${st('WEIGHT',F.wt,1.6)}<small style="color:#ff3df2">SPECIAL: ${sp.name}</small><small class="desc">${sp.desc||''}</small>${F.proj?'<small style="color:#ffd23d">HEAVY fires a projectile</small>':''}${F.grab?'<small style="color:#ffd23d">HEAVY is a command GRAB (unblockable)</small>':''}${F.armorH?'<small style="color:#ffd23d">HEAVY has super armor</small>':''}</div>`;
 const r=Math.min(S.rung,LAST),opp=LADDER[r];$('#goBtn').textContent=`LADDER ${r+1}/${LADDER.length}: VS ${FIGHTERS[opp].name.toUpperCase()}`;
 const tab=S.tab||'all',list=IDS.filter(id=>tab==='all'||(tab==='unlocked'?owned(id):!!tierOf(id)));
 $('#tabs').innerHTML=[['all','ALL',IDS.length],['unlocked','UNLOCKED',IDS.filter(owned).length],['premium','PREMIUM',PREM_IDS.length+1]].map(([k,l,n])=>`<button class="tab ${tab===k?'on':''}" data-tab="${k}">${l} <b>${n}</b></button>`).join('');
 $('#grid').innerHTML=list.map(id=>{const o=owned(id),t=tierOf(id),P=t?CATALOG[productFor(id)]:null;return`<div class="fc ${S.pick===id?'sel':''} ${o?'':'lock'} ${t?'prem t-'+t:''}" data-id="${id}">${pimg(id)}<div class="nm">${o?FIGHTERS[id].name:t?fmt(P.price):`BEAT or ${UNLOCK_COST}c`}</div>${t?`<span class="tag">${TLABEL(t)}</span>`:''}${!o?'<span class="lk">LOCKED</span>':''}</div>`}).join('')||'<p class="hint">Nothing here yet.</p>';
 const cost=60;$('#fuseHint').textContent=S.unlocked.length<2?'Unlock more fighters to fuse.':`Pick a donor: your fighter keeps its body and gets the donor's special. ${cost} coins each (first one free). Tap again to remove.`;
 $('#donors').innerHTML=IDS.filter(id=>owned(id)&&id!==S.pick).map(id=>`<div class="fc ${S.donor===id?'sel':''}" data-donor="${id}">${pimg(S.pick)}<div class="badge">${pimg(id)}</div><div class="nm">${fname(S.pick,id)}<br><span style="color:#ff3df2;font-size:9px">${FIGHTERS[id].sp.name}</span></div></div>`).join('')}
$('#tabs').addEventListener('click',e=>{const b=e.target.closest('[data-tab]');if(!b)return;SFX.click();S.tab=b.dataset.tab;save();renderSelect();$('#grid').scrollTop=0});
$('#grid').addEventListener('click',e=>{const c=e.target.closest('.fc');if(!c)return;audio();SFX.click();const id=c.dataset.id;if(owned(id)){if(S.pick!==id){S.pick=id;S.donor=null}save();renderSelect();ensureFighter(id).catch(()=>{})}else if(tierOf(id))openShop(id);else{const ri=LADDER.indexOf(id);modal(`<h1>LOCKED</h1><img class="pf" src="${imgSrc(id)}" alt=""><p><b>${FIGHTERS[id].name}</b> - ${FIGHTERS[id].title}<br>Special: ${FIGHTERS[id].sp.name}</p><p>Beat them on ladder rung ${ri+1} (or in the Gauntlet), or unlock now.</p><div class="row"><button class="btn gold" id="unlockBtn" ${S.coins<UNLOCK_COST?'disabled':''}>UNLOCK - ${UNLOCK_COST} COINS</button><button class="btn grey" onclick="closeModal()">LATER</button></div>${S.coins<UNLOCK_COST?`<p style="font-size:12px">You have ${S.coins} coins. Win fights to earn more.</p>`:''}`);$('#unlockBtn').onclick=()=>{if(S.coins<UNLOCK_COST)return;S.coins-=UNLOCK_COST;S.unlocked.push(id);S.pick=id;S.donor=null;save();closeModal();SFX.fanfare();toast(FIGHTERS[id].name+' unlocked!');renderSelect()}}});
$('#donors').addEventListener('click',e=>{const c=e.target.closest('.fc');if(!c)return;audio();const d=c.dataset.donor,key=S.pick+'+'+d;if(S.donor===d){S.donor=null;save();renderSelect();return}
 if(!S.fusions.includes(key)){const cost=S.fusions.length?60:0;if(S.coins<cost){toast(`Need ${cost} coins. Win fights!`);return}S.coins-=cost;S.fusions.push(key);SFX.fanfare();toast('FUSED: '+fname(S.pick,d)+'!')}else SFX.click();S.donor=d;save();renderSelect()});

// ---------- SHOP ----------
const FXLIST={epic:'Neon aura + sparkle trail, sky-drop intro, holo KO burst',legendary:'Golden aura + star trail, light-pillar intro, gold-coin KO shower',mythic:'Rainbow holo aura, light-pillar intro, rainbow lightning KO'};
function shopCard(id){const F=FIGHTERS[id],t=tierOf(id),pid=productFor(id),P=CATALOG[pid],o=owned(id);
 return`<div class="pcard t-${t} ${o?'own':''}" id="pc-${id}" data-id="${id}"><div class="pin"><div class="shine"></div>
 <div class="ptop"><span class="chip t-${t}">${TLABEL(t)}</span>${o?'<span class="ownd">OWNED</span>':`<span class="pprice">${fmt(P.price)}</span>`}</div>
 <div class="pprev"><div class="aura"></div><i class="sp1"></i><i class="sp2"></i><i class="sp3"></i>${pimg(id)}</div>
 <div class="pname">${F.name}</div><div class="ptitle">${F.title}</div>
 <div class="pstats">${st('HP',F.hp,1500)}${st('SPEED',F.spd,570)}${st('POWER',F.pow,1.3)}</div>
 <div class="psp"><b>${F.sp.name}</b><span>${F.sp.desc||''}</span></div>
 <div class="pfx">${t==='boss'?'Final boss. Also unlocks free by clearing the ladder.':FXLIST[t]}</div>
 <div class="prow"><button class="btn grey" data-try="${id}">TRY IT</button>${o?`<button class="btn" data-play="${id}">PLAY</button>`:`<button class="btn gold" data-buy="${pid}">BUY ${fmt(P.price)}</button>`}</div></div></div>`}
function bundleCard(pid,label){const P=CATALOG[pid],all=P.grants.every(owned),worth=P.grants.reduce((s,id)=>s+CATALOG[productFor(id)].price,0),off=Math.round((1-P.price/worth)*100),show=P.grants.slice(0,pid==='bundle_all20'?7:5);
 return`<div class="bundle ${pid}"><div class="shine"></div><div class="btag">${label}</div><div class="bimgs">${show.map(id=>pimg(id)).join('')}${P.grants.length>show.length?`<span class="more">+${P.grants.length-show.length}</span>`:''}</div>
 <div class="binfo"><div class="bname">${P.title}</div><div class="bsub">${P.grants.length} fighters | worth ${fmt(worth)} | <b>SAVE ${off}%</b></div>
 <button class="btn ${all?'':'gold'}" ${all?'disabled':''} data-buy="${pid}">${all?'OWNED':'BUY '+fmt(P.price)}</button></div></div>`}
function renderShop(){setCoins();const f=S.shopTier||'all',ids=[...PREM_IDS,'boss'].filter(id=>f==='all'||tierOf(id)===f);
 $('#shopBundles').innerHTML=bundleCard('bundle_all20','BEST VALUE')+bundleCard('bundle_starter5','STARTER');
 $('#tierChips').innerHTML=[['all','ALL'],['epic','EPIC $0.99'],['legendary','LEGENDARY $1.99'],['mythic','MYTHIC $2.99']].map(([k,l])=>`<button class="tab ${f===k?'on':''} ${k!=='all'?'t-'+k:''}" data-tier="${k}">${l}</button>`).join('');
 $('#shopGrid').innerHTML=ids.map(shopCard).join('');
 $('#shopOwned').textContent=`${PREM_IDS.filter(owned).length}/${PREM_IDS.length} premium owned`}
function openShop(focus){audio();closeModal();S.shopTier='all';screen('shop');if(focus){const el=$('#pc-'+focus);if(el){el.scrollIntoView({block:'center'});el.classList.add('focus');setTimeout(()=>el.classList.remove('focus'),2200)}}else $('#shop').scrollTop=0}
function buyFlow(pid){const P=CATALOG[pid];if(!P)return;audio();SFX.click();if(P.grants.every(owned)){toast('Already owned!');return}
 const tier=P.kind==='bundle'?'mythic':P.tier;
 modal(`<h1>CONFIRM PURCHASE</h1><div class="cthumbs">${P.grants.slice(0,10).map(id=>pimg(id)).join('')}${P.grants.length>10?`<span class="more">+${P.grants.length-10}</span>`:''}</div><p><b>${P.title}</b>${P.kind==='fighter'?`<br><span class="chip t-${tier}">${TLABEL(tier)}</span>`:`<br>${P.grants.length} premium fighters`}</p><p class="bigprice">${fmt(P.price)}</p>${PAYMENTS.mode==='test'?'<p class="testnote">TEST MODE - no real money is charged.</p>':''}<div class="row"><button class="btn gold" id="cfBuy">BUY ${fmt(P.price)}</button><button class="btn grey" id="cfCancel">CANCEL</button></div>`,'buybox');
 $('#cfCancel').onclick=()=>{SFX.click();closeModal()};
 $('#cfBuy').onclick=async()=>{const b=$('#cfBuy');b.disabled=true;$('#cfCancel').disabled=true;b.textContent='PROCESSING...';let r;try{r=await purchase(pid)}catch(e){r={ok:false,error:'Purchase failed'}}
  if(!r.ok){if(!r.pending){toast(r.error||'Purchase cancelled',2500);closeModal()}return}const fresh=P.grants.filter(id=>!owned(id));grant(P.grants);celebrate(P,fresh)}}
function celebrate(P,fresh){SFX.fanfare();setTimeout(()=>SFX.choir(),300);const ids=fresh.length?fresh:P.grants,one=ids.length===1?ids[0]:null;
 const conf=Array.from({length:36},(_,i)=>`<i style="left:${(i*97)%100}%;background:hsl(${i*37%360},100%,60%);animation-delay:${(i%9)*.08}s;animation-duration:${1.4+(i%5)*.25}s"></i>`).join('');
 modal(`<div class="confetti">${conf}</div><h1 class="yay">UNLOCKED!</h1>${one?`<div class="celeb t-${tierOf(one)}"><div class="aura"></div>${pimg(one)}</div><p><b>${FIGHTERS[one].name}</b> joined your roster!</p>`:`<div class="cthumbs big">${ids.map(id=>pimg(id)).join('')}</div><p><b>${ids.length} fighters</b> joined your roster!</p>`}<p class="testnote">${PAYMENTS.mode==='test'?'Test purchase - receipt saved locally.':''}</p><div class="row">${one?`<button class="btn big" id="cbPlay">PLAY AS ${FIGHTERS[one].name.toUpperCase()}</button>`:'<button class="btn big" id="cbPlay">PICK A FIGHTER</button>'}</div><div class="row"><button class="btn grey" id="cbShop">KEEP SHOPPING</button></div>`,'celebox');
 $('#cbPlay').onclick=()=>{closeModal();if(one){S.pick=one;S.donor=null;save()}else{S.tab='premium';save()}screen('select')};
 $('#cbShop').onclick=()=>{closeModal();renderShop()};if($('#shop').classList.contains('on'))renderShop()}
$('#shop').addEventListener('click',e=>{const b=e.target.closest('[data-buy],[data-try],[data-play],[data-tier]');if(!b)return;audio();
 if(b.dataset.buy)buyFlow(b.dataset.buy);
 else if(b.dataset.try){SFX.click();startMatch(0,false,{trial:b.dataset.try})}
 else if(b.dataset.play){SFX.click();S.pick=b.dataset.play;S.donor=null;save();screen('select')}
 else if(b.dataset.tier){SFX.click();S.shopTier=b.dataset.tier;renderShop()}});
$('#restoreBtn').onclick=()=>{audio();restorePurchases()};
$('#shopBack').onclick=()=>{SFX.click();screen('home')};
$('#playBtn').onclick=()=>{audio();SFX.click();screen('select')};
$('#backBtn').onclick=()=>{SFX.click();screen('home')};
$('#goBtn').onclick=()=>{audio();startMatch(Math.min(S.rung,LAST))};
$('#gauntletBtn').onclick=$('#gauntletHome').onclick=()=>{audio();S.gStreak=0;save();startMatch(0,false,{gauntlet:1})};
$('#shopBtn').onclick=$('#shopBanner').onclick=$('#shopSel').onclick=()=>openShop();
$('#muteBtn').onclick=()=>{S.muted=!S.muted;save();audio();if(master)master.gain.value=S.muted?0:.6;renderHome()};
$('#shareHome').onclick=()=>shareCard();
$('#modal').addEventListener('pointerdown',e=>{if(e.target.id==='modal'&&!$('#modal').dataset.lock)closeModal()});
// ---------- JUICE ----------
const cv=$('#cv'),X=cv.getContext('2d');let W=0,H=0,DPR=1;
function resize(){DPR=Math.min(2,devicePixelRatio||1);W=innerWidth;H=innerHeight;cv.width=Math.round(W*DPR);cv.height=Math.round(H*DPR)}
addEventListener('resize',resize);resize();
const FONT=s=>`900 ${s}px "Arial Black",Impact,"Segoe UI",sans-serif`;
const J={trauma:0,stop:0,slow:1,slowT:0,parts:[],texts:[],flash:0,flashCol:'#fff'};
const shake=a=>J.trauma=Math.min(1.3,J.trauma+a),hitstop=s=>J.stop=Math.max(J.stop,s),slowmo=(f,s)=>{J.slow=f;J.slowT=s};
// particles/texts live in world coords with y DOWN (py=-height)
function burst(x,py,n,cols,o={}){for(let i=0;i<n&&J.parts.length<600;i++){const a=o.ang!=null?o.ang+rand(-(o.spread||1),o.spread||1):rand(0,7),v=rand(.3,1)*(o.spd||500);J.parts.push({x,y:py,vx:Math.cos(a)*v,vy:Math.sin(a)*v-(o.up||0),life:0,max:rand(.35,.8)*(o.life||1),size:rand(.6,1.3)*(o.size||9),col:pick(cols),g:o.g!=null?o.g:1600,k:o.k||'sq',rot:rand(0,7),vr:rand(-12,12)})}}
function ring(x,py,col,r=140,w=12){J.parts.push({x,y:py,vx:0,vy:0,life:0,max:.3,size:r,col,g:0,k:'ring',w})}
function popText(x,py,txt,col,size,o={}){J.texts.push({x,y:py,txt,col,size,t:0,life:o.life||.9,vy:o.vy!=null?o.vy:-160,rot:o.rot!=null?o.rot:rand(-.12,.12),hud:o.hud})}
function updJuice(dt,rdt){J.trauma=Math.max(0,J.trauma-rdt*1.7);J.flash=Math.max(0,J.flash-rdt*3.5);if(J.slowT>0){J.slowT-=rdt;if(J.slowT<=0)J.slow=1}
 for(const p of J.parts){p.life+=dt;p.vy+=p.g*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=1-dt*1.5;p.rot+=p.vr*dt}J.parts=J.parts.filter(p=>p.life<p.max);
 for(const t of J.texts){t.t+=rdt;t.y+=t.vy*rdt;t.vy*=1-rdt*2.5}J.texts=J.texts.filter(t=>t.t<t.life)}
function drawParts(c){for(const p of J.parts){const a=1-p.life/p.max;c.globalAlpha=Math.min(1,a*1.5);c.fillStyle=c.strokeStyle=p.col;
 if(p.k==='ring'){c.lineWidth=p.w*a;c.beginPath();c.arc(p.x,p.y,p.size*(1-a*.8)+10,0,7);c.stroke()}
 else if(p.k==='spark'){c.lineWidth=p.size*.5;c.lineCap='round';c.beginPath();c.moveTo(p.x,p.y);c.lineTo(p.x-p.vx*.04,p.y-p.vy*.04);c.stroke()}
 else{c.save();c.translate(p.x,p.y);c.rotate(p.rot);const s=p.size;if(p.k==='star'){c.beginPath();for(let i=0;i<10;i++){const r=i%2?s*.45:s,an=i*Math.PI/5;c.lineTo(Math.cos(an)*r,Math.sin(an)*r)}c.fill()}else if(p.k==='circle'){c.beginPath();c.arc(0,0,s,0,7);c.fill()}else if(p.k==='coin'){c.fillStyle='#ffc400';c.beginPath();c.ellipse(0,0,s*Math.abs(Math.cos(p.rot*2))+1,s,0,0,7);c.fill()}else c.fillRect(-s/2,-s/2,s,s*.6);c.restore()}}c.globalAlpha=1}
function txt(c,t,x,y,size,fill,o={}){c.font=FONT(size);c.textAlign=o.align||'center';c.textBaseline='middle';c.lineJoin='round';c.lineWidth=o.lw!=null?o.lw:size*.18;c.strokeStyle=o.stroke||'#14002b';if(c.lineWidth)c.strokeText(t,x,y);c.fillStyle=fill;c.fillText(t,x,y)}
function fitSize(c,t,size,maxW){c.font=FONT(size);const w=c.measureText(t).width;return w>maxW?size*maxW/w:size}
function drawTexts(c,hud){for(const t of J.texts){if(!!t.hud!==hud)continue;const p=t.t/t.life,s=t.t<.14?easeOutBack(t.t/.14):1;c.save();c.globalAlpha=p>.7?(1-p)/.3:1;c.translate(t.x,t.y);c.rotate(t.rot);c.scale(s,s);txt(c,t.txt,0,0,t.size,t.col);c.restore()}c.globalAlpha=1}

// ---------- MOVES ----------
// st/ac/rc = startup/active/recovery seconds; r = reach (forward from center), yb = height band (scaled by fighter height/300)
const MV={
 L1:{st:.06,ac:.08,rc:.14,dmg:36,kx:140,ky:0,hs:.34,r:[10,165],yb:[90,240],lunge:200,next:'L2',hstop:.05,sfx:'light',shake:.12},
 L2:{st:.06,ac:.08,rc:.16,dmg:40,kx:150,ky:0,hs:.36,r:[10,170],yb:[80,240],lunge:220,next:'L3',hstop:.06,sfx:'light',shake:.14},
 L3:{st:.1,ac:.1,rc:.3,dmg:60,kx:640,ky:560,hs:.5,r:[10,185],yb:[60,250],lunge:300,launch:1,hstop:.11,sfx:'heavy',shake:.35,txt:'SMACK!'},
 H:{st:.17,ac:.12,rc:.36,dmg:85,kx:300,ky:1250,hs:.6,r:[20,195],yb:[30,270],lunge:320,launch:1,charge:1,hstop:.13,sfx:'heavy',shake:.5,txt:'LAUNCH!'},
 HP:{st:.16,ac:.05,rc:.34,proj:1,charge:1},
 GR:{st:.1,ac:.09,rc:.45,grab:1,dmg:125,kx:700,ky:1000,hs:.6,r:[0,135],yb:[0,280],lunge:150,launch:1,hstop:.22,shake:.8,sfx:'heavy',txt:'SUPLEX!'},
 AL:{st:.05,ac:.2,rc:.12,dmg:40,kx:220,ky:420,hs:.36,r:[0,160],yb:[-50,160],air:1,hstop:.05,sfx:'light',shake:.12},
 AH:{st:.12,ac:.16,rc:.22,dmg:70,kx:180,ky:-1500,hs:.5,r:[-30,165],yb:[-80,150],air:1,spike:1,launch:1,hstop:.12,sfx:'heavy',shake:.45,txt:'METEOR!'},
};
const GRAV=2900,WL=70,WR=1530;
let G=null;
function newCtl(){return{l:0,r:0,blk:0,hvy:0,jumpE:0,lightE:0,heavyE:0,specE:0,dashE:0,blkE:0}}
function mkFighter(id,donor,side,x){const F=FIGHTERS[id];return{id,F,sp:donor?FIGHTERS[donor].sp:F.sp,donor,side,x,y:0,vx:0,vy:0,dir:side?-1:1,hp:F.hp,max:F.hp,ghost:F.hp,meter:0,st:'idle',t:0,mv:null,mvT:0,hit:new Set,buf:null,chg:0,charging:false,blkT:-9,hs:0,combo:0,comboT:0,sq:0,sqv:0,flash:0,airHits:0,wallB:false,bounced:false,inv:0,trail:[],trailT:0,ctl:newCtl(),ai:side?{next:0,blkUntil:0,hvyUntil:0,moveUntil:0,moveDir:0,reacted:false,reactAt:-1}:null,spS:{},armor:0,rot:0,ko:false,maxCombo:0,taken:0,sc:F.h/300}}
const isAir=f=>f.y>.5||f.vy>0;
function hurtBox(d){const s=d.sc;return d.st==='down'?{x0:d.x-70*s,x1:d.x+70*s,y0:d.y,y1:d.y+70}:{x0:d.x-50*s,x1:d.x+50*s,y0:d.y,y1:d.y+d.F.h*.86}}
const overlap=(a,b)=>a.x0<b.x1&&a.x1>b.x0&&a.y0<b.y1&&a.y1>b.y0;
function fbox(f,r0,r1,y0,y1){const s=f.sc,a=f.x+f.dir*r0*s,b=f.x+f.dir*r1*s;return{x0:Math.min(a,b),x1:Math.max(a,b),y0:f.y+y0*s,y1:f.y+y1*s}}
function startMove(f,name){const m=MV[name];f.st='attack';f.mv=m;f.mvN=name;f.mvT=0;f.hit=new Set;f.chg=0;f.fired=0;f.buf=null;f.charging=!!(m.charge&&f.ctl.hvy);f.t=0;
 if(m.charge){f.sq=.2;if(f.side===1)popText(f.x,-(f.y+f.F.h+40),'!','#ff3d3d',64,{vy:-40,life:.6})}if(m.air&&name==='AH'){f.vy=Math.min(f.vy,250)}}
function updMove(f,o,dt){const m=f.mv;
 if(f.charging){if(f.ctl.hvy&&f.chg<.85){if(f.chg===0)SFX.charge();f.chg+=dt;f.vx*=Math.exp(-12*dt);if(Math.random()<.4)burst(f.x+rand(-60,60),-(f.y+rand(20,f.F.h)),1,['#ff3d3d','#ffd23d'],{spd:120,g:-600,k:'spark',life:.5});return}f.charging=false}
 f.mvT+=dt;const t=f.mvT;
 if(t<m.st){if(m.lunge)f.vx=f.dir*m.lunge*(f.F.spd/430)*(1+f.chg*.4)}
 else if(t<m.st+m.ac){if(!f.fired){f.fired=1;SFX.whiff();f.sq=-.22;if(m.proj)spawnProj(f,{});if(f.mvN==='AH')f.vy=-1100}if(m.lunge)f.vx*=Math.exp(-6*dt)}
 else f.vx*=Math.exp(-10*dt);
 if(f.ctl.lightE&&m.next&&t>m.st*.5)f.buf=m.next;
 if(f.buf&&t>=m.st+m.ac*.6){startMove(f,f.buf);return}
 if(t>=m.st+m.ac+m.rc){f.st=isAir(f)?'air':'idle';f.mv=null}}
function hitInfo(f,m){const c=f.chg/.85;return{dmg:m.dmg*(m.charge?1+c*.9:1),kx:m.kx*(1+c*.4),ky:m.ky*(1+c*.25),hs:m.hs,launch:m.launch,spike:m.spike,hstop:m.hstop+c*.07,shake:(m.shake||.1)+c*.3,sfx:m.sfx,txt:c>.9?'FULL CHARGE!':m.txt,fromX:f.x}}
function resolveHit(a,d,h){if(d.inv>0||d.ko)return false;const dirAD=sgn(d.x-h.fromX)||a.dir,P=d.y,hy=-(d.y+d.F.h*.6);
 const blocking=(d.st==='block'||d.st==='blockstun')&&!isAir(d)&&sgn(h.fromX-d.x)===d.dir&&!h.unblockable;
 if(blocking){if(G.time-d.blkT<.16&&a!==d){parry(d,a);return true}const chip=Math.max(1,Math.round(h.dmg*.12));d.hp-=chip;d.st='blockstun';d.t=0;d.vx=dirAD*Math.min(600,h.kx*.6+150);if(a.st==='attack')a.vx=-dirAD*120;d.meter=Math.min(100,d.meter+5);SFX.block();hitstop(.04);shake(.08);burst(d.x+d.dir*40*d.sc,hy,10,['#2ec5ff','#fff'],{spd:500,k:'spark',g:0});ring(d.x+d.dir*40*d.sc,hy,'#2ec5ff',90,8);popText(d.x,hy-60,'BLOCK','#2ec5ff',30);if(d.hp<=0){d.hp=0;roundKO(a,d)}return true}
 const combo=['hitstun','launched','parried','down'].includes(d.st)||isAir(d);a.combo=combo?a.combo+1:1;a.comboT=G.time;a.maxCombo=Math.max(a.maxCombo,a.combo);
 const scale=Math.max(.35,1-(a.combo-1)*.08),dmg=Math.max(1,Math.round(h.dmg*a.F.pow*scale*(G.dmgMul||1)));
 if(d.armor){d.hp-=Math.round(dmg*.6);d.flash=1;SFX.block();popText(d.x,hy-40,'ARMOR','#ffd23d',28);hitstop(.05);if(d.hp<=0){d.hp=0;roundKO(a,d)}return true}
 d.hp-=dmg;d.taken++;d.flash=1;d.t=0;d.mv=null;d.charging=false;d.sq=.35;
 a.meter=Math.min(100,a.meter+dmg*.35+3);d.meter=Math.min(100,d.meter+dmg*.22);
 if(h.launch||isAir(d)){d.st='launched';d.bounced=false;d.airHits++;const decay=Math.max(.35,1-d.airHits*.13);d.vy=h.spike?h.ky:Math.max(h.ky/d.F.wt,isAir(d)?520:0)*decay;if(!h.spike&&d.vy<300)d.vy=300;d.vx=dirAD*h.kx/d.F.wt;if(h.kx>480)d.wallB=false}
 else{d.st='hitstun';d.hs=h.hs;d.vx=dirAD*h.kx/d.F.wt}
 hitstop(h.hstop);shake(h.shake||.12);SFX[h.sfx||'light']();
 const big=h.dmg>=60;burst(d.x-dirAD*20,hy,big?30:14,['#fff','#ffd23d',a.F.col,'#ff3df2'],{spd:big?900:600,g:900,k:big?'star':'spark',size:big?14:9});ring(d.x-dirAD*20,hy,big?'#ffd23d':'#fff',big?170:100,big?14:9);
 popText(d.x+rand(-30,30),hy-d.F.h*.35,''+dmg,big?'#ffd23d':'#fff',big?78:54,{vy:-220});
 if(h.txt)popText(d.x,hy-d.F.h*.65,h.txt,'#b6ff2e',38,{vy:-90});
 if(a.combo>=2&&a.combo%5===0){J.flash=.18;J.flashCol=a.F.col}
 if(d.hp<=0){d.hp=0;roundKO(a,d)}return true}
function parry(d,a){a.st='parried';a.t=0;a.mv=null;a.charging=false;a.vx=-a.dir*250;d.st='idle';d.meter=Math.min(100,d.meter+25);slowmo(.25,.45);hitstop(.1);shake(.3);J.flash=.35;J.flashCol='#2ec5ff';SFX.parry();const hy=-(d.y+d.F.h*.7);popText(d.x,hy-40,'PARRY!','#2ec5ff',56,{vy:-60,life:1.1});ring(d.x+d.dir*40,hy+60,'#fff',220,14);burst(d.x+d.dir*40,hy+60,24,['#2ec5ff','#fff'],{spd:800,g:0,k:'spark'})}
function hitCheck(a,d){if(a.st!=='attack'||!a.mv||a.charging)return;const m=a.mv,t=a.mvT;if(t<m.st||t>=m.st+m.ac||m.proj)return;const hb=fbox(a,m.r[0],m.r[1],m.yb[0],m.yb[1]);
 for(const p of G.projs)if(p.owner!==a&&!p.dead&&p.x>hb.x0-p.r&&p.x<hb.x1+p.r&&p.y>hb.y0-p.r&&p.y<hb.y1+p.r){p.dead=1;burst(p.x,-p.y,16,['#fff','#ffd23d'],{spd:600,k:'spark',g:0});popText(p.x,-p.y-40,'SWAT!','#ffd23d',30);SFX.block();hitstop(.05)}
 if(!a.hit.has('o')&&overlap(hb,hurtBox(d))){if(m.grab&&(isAir(d)||d.st==='down'))return;a.hit.add('o');const h=hitInfo(a,m);if(m.grab){h.unblockable=1;h.fromX=a.x+a.dir*500;d.x=clamp(a.x+a.dir*30,WL,WR);SFX.grunt();burst(d.x,-(d.F.h*.5),20,['#d9a35a','#fff'],{spd:600,k:'star'})}resolveHit(a,d,h)}}
// ---------- PROJECTILES ----------
const PJ={case:{vx:820,vy:260,g:900,r:34,dmg:52},toast:{vx:640,vy:640,g:1500,r:30,dmg:50},orb:{vx:620,vy:0,g:0,r:46,dmg:64},note:{vx:720,vy:0,g:0,r:28,dmg:44},heart:{vx:620,vy:0,g:0,r:32,dmg:34},bubble:{vx:520,vy:0,g:0,r:34,dmg:30},
 popcorn:{vx:700,vy:520,g:1400,r:24,dmg:42},pit:{vx:820,vy:300,g:1100,r:24,dmg:46},cannon:{vx:860,vy:280,g:900,r:32,dmg:50},laser:{vx:1250,vy:0,g:0,r:24,dmg:40},star:{vx:780,vy:0,g:0,r:30,dmg:44},disc:{vx:800,vy:0,g:0,r:32,dmg:42}};
function spawnProj(f,o){const k=o.kind||f.F.proj||'case',c=f.chg/.85,P=PJ[k]||PJ.orb;
 G.projs.push({kind:k,owner:f,col:f.F.pcol||f.sp.col,x:o.abs?o.x:f.x+f.dir*80*f.sc,y:o.abs?o.y:f.y+f.F.h*(o.yk||.55),vx:o.abs?o.vx:f.dir*(o.vx||P.vx)*(1+c*.5),vy:o.vy!=null?o.vy:P.vy,g:o.g!=null?o.g:P.g,r:P.r*(1+c*.3),dmg:(o.dmg||P.dmg)*(1+c*.8),ky:o.ky||0,rot:0,life:0,stun:o.stun||0,boom:o.boom?f.dir:0,hits:0,cd:0});SFX.proj()}
function updProjs(dt){for(const p of G.projs){p.life+=dt;p.cd=Math.max(0,p.cd-dt);if(p.boom){p.vx-=p.boom*2400*dt;if(p.life>1.5)p.dead=1}p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy-=p.g*dt;if(p.kind==='note'||p.kind==='heart')p.y+=Math.cos(p.life*14)*200*dt;p.rot+=dt*10*sgn(p.vx);const t=p.owner===G.p1?G.p2:G.p1;
 if(p.y<p.r*.4){p.dead=1;burst(p.x,-10,10,['#fff8','#b88'],{spd:300,up:200})}
 if(p.x<-300||p.x>1900||p.life>4)p.dead=1;
 if(!p.dead&&!(p.cd>0)){const hb=hurtBox(t);if(p.x+p.r>hb.x0&&p.x-p.r<hb.x1&&p.y+p.r>hb.y0&&p.y-p.r<hb.y1){if(p.boom&&++p.hits<2)p.cd=.4;else p.dead=1;const ok=resolveHit(p.owner,t,{dmg:p.dmg,kx:260,ky:p.ky,launch:p.ky>0,hs:.4,hstop:.06,shake:.2,sfx:'light',fromX:p.x-p.vx*.05});if(ok&&p.stun&&t.st==='hitstun'){t.st='parried';t.t=.2;t.vx=0;popText(t.x,-(t.y+t.F.h+30),'CHARMED!','#ff6ad5',40);burst(t.x,-(t.y+t.F.h*.7),16,['#ff6ad5','#fff'],{spd:400,g:-300,k:'circle',size:12})}}}}
 for(const a of G.projs)for(const b of G.projs)if(a!==b&&!a.dead&&!b.dead&&a.owner!==b.owner&&Math.hypot(a.x-b.x,a.y-b.y)<a.r+b.r){a.dead=b.dead=1;burst((a.x+b.x)/2,-(a.y+b.y)/2,20,['#fff','#ff3df2'],{spd:700,k:'spark',g:0});SFX.block()}
 G.projs=G.projs.filter(p=>!p.dead)}
// ---------- SPECIALS ----------
function startSpecial(f,o){f.meter=0;f.st='special';f.t=0;f.spS={};f.mv=null;f.rot=0;G.freeze=.65;G.superF=f;f.inv=.1;SFX.super();shake(.3);J.flash=.4;J.flashCol=f.F.col;if(f.sp.type==='quake')f.vy=900;const ss={flush:'flush',flurry:'coo',suplex:'grunt',clone:'meow',tsunami:'sob',lightning:'zap'}[f.sp.type]||(f.sp.stun?'croon':null);if(ss)setTimeout(()=>SFX[ss](),250);if(f.F.prem){setTimeout(()=>{SFX.choir();SFX.sparkle()},120);burst(f.x,-(f.y+f.F.h*.5),40,premCols(f.F.prem),{spd:900,g:0,k:'star',size:12})}}
function areaHit(f,o,key,box,h,interval){if(f.sp.txt&&h.txt)h.txt=f.sp.txt;const last=f.spS['h'+key];if(last!=null&&G.time-last<interval)return false;if(!overlap(box,hurtBox(o)))return false;f.spS['h'+key]=G.time;h.fromX=h.fromX!=null?h.fromX:f.x;return resolveHit(f,o,h)}
function updSpecial(f,o,dt){const t=f.t,s=f.spS,A=f.F.pow,ty=f.sp.type;let end=1;
 if(XSP[ty])end=XSP[ty](f,o,dt,t,s);
 else if(ty==='rush'){end=.9;if(t<.62){f.vx=f.dir*1350;f.rot+=dt*30;if(areaHit(f,o,'r',fbox(f,-70,120,0,f.F.h/f.sc),{dmg:26,kx:300,ky:250,hs:.3,hstop:.04,shake:.15,sfx:'light'},.085))o.vx=f.vx*.95}else{f.vx*=.9;f.rot=0;if(!s.fin){s.fin=1;s.h0=G.time}areaHit(f,o,'rf',fbox(f,-40,190,0,300),{dmg:90,kx:500,ky:1350,launch:1,hs:.6,hstop:.18,shake:.6,sfx:'heavy',txt:'TORNADO!'},99)}}
 else if(ty==='quake'){end=1.05;if(!s.slam&&t>.12&&f.y<=0){s.slam=G.time;SFX.boom();shake(.9);ring(f.x,0,'#ffd23d',260,20)}if(s.slam)for(let i=0;i<3;i++){const gt=G.time-s.slam-i*.1;if(gt>0&&gt<.3){const gx=f.x+f.dir*(170+i*170);if(!s['g'+i]){s['g'+i]=1;burst(gx,0,26,['#6b3b1c','#c98a4a','#fff'],{ang:-Math.PI/2,spread:.4,spd:1300,size:14});SFX.heavy()}areaHit(f,o,'g'+i,{x0:gx-80,x1:gx+80,y0:0,y1:340},{dmg:80,kx:150,ky:1350,launch:1,hs:.6,hstop:.12,shake:.5,sfx:'heavy',txt:'ERUPTION!',fromX:f.x},99)}}}
 else if(ty==='volley'){end=.75;for(let i=0;i<5;i++)if(t>.04+i*.1&&!s['v'+i]){s['v'+i]=1;f.sq=-.2;spawnProj(f,f.sp.stun?{kind:f.sp.proj,vx:600+i*40,vy:0,dmg:34,stun:i===4}:{kind:f.sp.proj,vx:850+i*60,vy:(PJ[f.sp.proj]||PJ.case).g?(i%2?420:200):0,yk:(PJ[f.sp.proj]||PJ.case).g?.55:.35+i*.1,dmg:44,ky:i===4?900:0})}}
 else if(ty==='aura'){end=1.15;if(t<.9){f.rot+=dt*24;o.vx+=sgn(f.x-o.x)*900*dt;if(Math.random()<.6)burst(f.x,-(f.y+f.F.h*.5),2,f.sp.col?[f.sp.col,'#fff',f.F.col]:['#3fcf5a','#e8ffcf','#ff3df2','#ffd23d'],{spd:900,g:0,k:'spark'});areaHit(f,o,'a',{x0:f.x-230,x1:f.x+230,y0:f.y-20,y1:f.y+f.F.h*1.1},{dmg:18,kx:60,ky:0,hs:.25,hstop:.03,shake:.1,sfx:'light'},.1)}else{f.rot=0;if(!s.b){s.b=1;ring(f.x,-(f.F.h*.5),f.sp.col||'#ff3df2',320,24);SFX.boom()}areaHit(f,o,'ab',{x0:f.x-260,x1:f.x+260,y0:0,y1:f.F.h*1.2},{dmg:80,kx:620,ky:1150,launch:1,hs:.6,hstop:.16,shake:.6,sfx:'heavy',txt:'DISCO INFERNO!'},99)}}
 else if(ty==='teleport'){end=.85;if(!s.tp&&t>.12){s.tp=1;burst(f.x,-(f.F.h*.5),24,['#fff','#ffe03d','#888'],{spd:500,g:-200,size:18,k:'circle'});const side=sgn(o.x-f.x);f.x=clamp(o.x+side*120*f.sc,WL,WR);f.dir=sgn(o.x-f.x);burst(f.x,-(f.F.h*.5),24,['#fff','#ffe03d'],{spd:500,g:-200,size:18,k:'circle'});SFX.dash()}
  if(s.tp)for(let i=0;i<3;i++)if(t>.22+i*.12)areaHit(f,o,'t'+i,fbox(f,-20,200,0,280),i<2?{dmg:42,kx:80,ky:0,hs:.4,hstop:.07,shake:.2,sfx:'light',txt:'SLASH'}:{dmg:70,kx:650,ky:800,launch:1,hs:.6,hstop:.16,shake:.5,sfx:'heavy',txt:'SLIPPED!'},99)}
 else if(ty==='haymaker'){end=.95;if(t<.4){f.armor=1;f.vx=0;if(Math.random()<.5)burst(f.x+rand(-60,60),-(rand(0,f.F.h)),1,['#b6ff2e','#fff'],{spd:200,g:-800,k:'spark'})}else if(t<.66){f.armor=0;f.vx=f.dir*1150;areaHit(f,o,'hm',fbox(f,0,200,0,280),{dmg:230,kx:1500,ky:520,launch:1,hs:.7,hstop:.26,shake:1.1,sfx:'heavy',txt:'VITAMIN K.O.!'},99)}else{f.armor=0;f.vx*=.85}}
 else if(ty==='beam'){end=1.2;if(t<.3){f.vx=0;if(Math.random()<.7)burst(f.x+f.dir*90,-120,2,[f.sp.col||'#ff3df2','#fff'],{spd:300,g:0,k:'spark'})}else if(t<1.05){shake(.06);areaHit(f,o,'bm',{x0:f.dir>0?f.x+40:f.x-1500,x1:f.dir>0?f.x+1500:f.x-40,y0:0,y1:f.sp.w||150},{dmg:22,kx:220,ky:0,hs:.25,hstop:.03,shake:.1,sfx:'light'},.08)}}
 else if(ty==='flush'){end=1.3;if(t<.6){f.armor=1;f.vx=0;const dx=f.x-o.x;if(Math.abs(dx)<750&&!isAir(o))o.vx+=sgn(dx)*1500*dt;for(let i=0;i<3;i++){const a=G.time*9+i*2.1,r=120+60*Math.sin(G.time*3+i);burst(f.x+Math.cos(a)*r,-(40+Math.abs(Math.sin(a))*180),1,['#9fe6ff','#fff','#4aa3ff'],{spd:120,g:-200,k:'circle',size:10,life:.5})}areaHit(f,o,'fv',{x0:f.x-240,x1:f.x+240,y0:0,y1:320},{dmg:14,kx:30,ky:0,hs:.3,hstop:.02,shake:.08,sfx:'light'},.12)}
  else{f.armor=0;if(!s.gy){s.gy=1;SFX.boom();shake(1);ring(f.x,-30,'#9fe6ff',320,24);burst(f.x,0,60,['#9fe6ff','#fff','#4aa3ff'],{ang:-Math.PI/2,spread:.5,spd:1700,size:14,k:'circle'})}areaHit(f,o,'fg',{x0:f.x-290,x1:f.x+290,y0:0,y1:520},{dmg:150,kx:300,ky:1600,launch:1,hs:.7,hstop:.2,shake:.8,sfx:'heavy',txt:'ROYAL FLUSH!'},99)}}
 else if(ty==='flurry'){end=1.25;const idx=Math.floor(t/.12);if(idx<6&&!s['f'+idx]){s['f'+idx]=1;const side=idx%2?1:-1;f.x=clamp(o.x+side*150*f.sc,WL,WR);f.dir=sgn(o.x-f.x);f.y=Math.max(0,o.y-20);f.vy=0;f.vx=f.dir*150;f.trail.push({x:f.x-f.dir*80,y:f.y,pose:'attack',dir:f.dir,rot:0,a:.6});burst(f.x,-(f.y+f.F.h*.5),10,['#9a7cff','#ccc','#fff'],{spd:500,k:'spark'});SFX.dash();
   areaHit(f,o,'f'+idx,{x0:o.x-220,x1:o.x+220,y0:-50,y1:3000},{dmg:22,kx:40,ky:isAir(o)?380:120,hs:.4,hstop:.04,shake:.15,sfx:'light',fromX:f.x},99)}
  if(t>.8&&!s.ff){s.ff=1;f.x=clamp(o.x-sgn(o.x-f.x)*130*f.sc,WL,WR);f.dir=sgn(o.x-f.x);areaHit(f,o,'ff',{x0:o.x-250,x1:o.x+250,y0:-50,y1:3000},{dmg:95,kx:900,ky:1000,launch:1,hs:.7,hstop:.2,shake:.7,sfx:'heavy',txt:'SIGMA!',fromX:f.x},99)}}
 else if(ty==='suplex'){end=s.miss?.7:1.5;if(!s.g&&!s.miss){if(t<.4){f.vx=f.dir*1250;if(Math.random()<.5)burst(f.x-f.dir*60,-20,2,['#fff8'],{spd:200,g:0,k:'circle',size:14});if(overlap(fbox(f,0,170,0,280),hurtBox(o))&&o.st!=='down'&&!o.ko){s.g=t;f.vx=0;f.vy=1400;SFX.grunt();popText(o.x,-(o.y+o.F.h+40),'GRABBED!','#ffd23d',40)}}else{s.miss=1;f.vx*=.3}}
  if(s.g&&!s.slam){o.x=clamp(f.x+f.dir*30,WL,WR);o.y=f.y+f.F.h*.75;o.vx=o.vy=0;o.st='hitstun';o.t=0;o.hs=1;o.inv=0;f.rot=-f.dir*Math.min(3.1,(t-s.g)*7);if(t-s.g>.2&&f.y<=0){s.slam=1;f.rot=0;o.y=0;o.x=clamp(f.x-f.dir*90,WL,WR);o.st='idle';SFX.boom();shake(1.2);ring(o.x,-20,'#d9a35a',300,24);burst(o.x,0,40,['#d9a35a','#fff3c4','#fff'],{ang:-Math.PI/2,spread:1.2,spd:1200,size:14,k:'star'});resolveHit(f,o,{dmg:230,kx:500,ky:900,launch:1,hs:.8,hstop:.3,shake:1,sfx:'heavy',txt:f.sp.txt||'MASHED!',unblockable:1,fromX:f.x})}}}
 else if(ty==='clone'){end=1.15;if(!s.c&&t>.08){s.c=1;for(const side of [-1,1]){const x=clamp(o.x+side*560,WL-200,WR+200);G.projs.push({kind:'clone',owner:f,x,y:f.F.h*.5,vx:-side*1000,vy:0,g:0,r:70,dmg:50,ky:side>0?700:0,rot:0,life:0,stun:0})}burst(f.x,-(f.F.h*.5),30,['#fff','#bfe9ff'],{spd:500,g:-300,k:'circle',size:16})}
  if(t>.45&&!s.tp){s.tp=1;burst(f.x,-(f.F.h*.5),24,['#fff','#bfe9ff'],{spd:500,g:-200,size:18,k:'circle'});const side=sgn(f.x-o.x)*-1;f.x=clamp(o.x+side*110*f.sc,WL,WR);f.dir=sgn(o.x-f.x);SFX.dash()}
  if(s.tp&&t>.6)areaHit(f,o,'cs',fbox(f,-20,220,0,300),{dmg:80,kx:700,ky:900,launch:1,hs:.6,hstop:.16,shake:.5,sfx:'heavy',txt:'SPLASH!'},99)}
 else if(ty==='tsunami'){end=1.25;if(t<.25){f.vx=0;burst(f.x+f.dir*20,-(f.y+f.F.h*.7),3,['#9fe6ff','#fff'],{spd:700,up:300,k:'circle',size:9})}else if(t<1.05){f.vx=f.dir*450;s.wx=f.x+f.dir*(80+(t-.25)*1500);const x0=f.dir>0?s.wx-160:s.wx-60,x1=f.dir>0?s.wx+60:s.wx+160;if(Math.random()<.8)burst(s.wx,-rand(20,200),2,[f.sp.col||'#9fe6ff','#4aa3ff','#fff'],{spd:400,up:300,k:'circle',size:12});
   if(areaHit(f,o,'tw',{x0,x1,y0:0,y1:260},{dmg:24,kx:700,ky:150,hs:.35,hstop:.03,shake:.15,sfx:'light'},.1))o.vx=f.dir*1100;if(t>.85)areaHit(f,o,'tb',{x0:Math.min(f.x,s.wx)-60,x1:Math.max(f.x,s.wx)+60,y0:0,y1:320},{dmg:85,kx:700,ky:1250,launch:1,hs:.7,hstop:.18,shake:.6,sfx:'heavy',txt:'TEAR TSUNAMI!'},99)}else{s.wx=null;f.vx*=.8}}
 if(t>=end){f.st=isAir(f)?'air':'idle';f.rot=0;f.armor=0}}
// ---------- FIGHTER UPDATE ----------
function updF(f,o,dt){const c=f.ctl,F=f.F;f.t+=dt;if(F.prem&&!f.ko&&Math.random()<dt*(Math.abs(f.vx)>300?40:14))burst(f.x+rand(-55,55)*f.sc,-(f.y+rand(10,F.h*.95)),1,premCols(F.prem),{spd:70,g:-260,k:Math.random()<.6?'star':'circle',size:rand(5,9),life:.9});f.inv=Math.max(0,f.inv-dt);f.flash=Math.max(0,f.flash-dt*6);f.sqv+=(-300*f.sq-15*f.sqv)*dt;f.sq+=f.sqv*dt;
 if(c.blkE)f.blkT=G.time;const ground=!isAir(f),fight=G.phase==='fight';
 if(fight&&['idle','walk','air','block'].includes(f.st)){
  if(ground)f.dir=sgn(o.x-f.x)||f.dir;
  if(c.specE&&f.meter>=100)startSpecial(f,o);
  else if(c.lightE)startMove(f,ground?'L1':'AL');
  else if(c.heavyE)startMove(f,ground?(F.grab?'GR':F.proj?'HP':'H'):'AH');
  else if(ground&&c.blk){f.st='block';f.vx*=Math.exp(-14*dt)}
  else if(ground&&c.dashE){f.st='dash';f.t=0;f.vx=c.dashE*1000*(F.spd/430);f.sq=-.2;SFX.dash();burst(f.x-c.dashE*40,-10,10,['#fff8'],{spd:300,ang:Math.PI+(c.dashE>0?0:Math.PI),spread:.5,g:0,size:14,k:'circle'})}
  else if(ground&&c.jumpE){f.vy=F.jump;f.vx=(c.r-c.l)*F.spd*1.05;f.st='air';f.sq=-.3;SFX.jump();burst(f.x,-5,10,['#fff8'],{spd:250,ang:-Math.PI/2,spread:1.4,g:0,size:12,k:'circle'})}
  else if(ground){const m=c.r-c.l;f.vx=m*F.spd*(f.st==='block'?0:1);f.st=m?'walk':'idle'}
  else{f.vx=lerp(f.vx,(c.r-c.l)*F.spd,Math.min(1,dt*4));f.st='air'}
  if(f.st==='block'&&!c.blk)f.st='idle'}
 else if(!fight&&ground&&['walk','block','dash'].includes(f.st)){f.st='idle';f.vx=0}
 if(F.armorH&&f.st!=='special')f.armor=(f.st==='attack'&&f.mvN==='H'&&(f.charging||f.mvT<f.mv.st+f.mv.ac))?1:0;
 switch(f.st){
  case 'dash':if(f.t>.2){f.st='idle';f.vx*=.3}break;
  case 'attack':updMove(f,o,dt);break;
  case 'hitstun':if(f.t>f.hs)f.st=isAir(f)?'air':'idle';break;
  case 'blockstun':if(f.t>.2)f.st='idle';break;
  case 'parried':if(f.t>.9)f.st='idle';break;
  case 'down':if(f.t>.6&&!f.ko){f.st='idle';f.inv=.3;f.airHits=0}break;
  case 'special':updSpecial(f,o,dt);break}
 // trail (afterimages)
 f.trailT-=dt;if(f.trailT<=0){f.trailT=.03;if(f.st==='dash'||f.st==='special'||(f.st==='launched'&&Math.abs(f.vx)>500))f.trail.push({x:f.x,y:f.y,pose:poseOf(f),dir:f.dir,rot:f.rot,a:.5});}
 for(const tr of f.trail)tr.a-=dt*2.2;f.trail=f.trail.filter(tr=>tr.a>0);
 // physics
 if(isAir(f))f.vy-=GRAV*dt*(f.st==='launched'?1+f.airHits*.06:1);
 f.x+=f.vx*dt;f.y+=f.vy*dt;
 if(f.y<=0){f.y=0;if(f.vy<0){const v=f.vy;f.vy=0;
  if(f.st==='launched'){if(v<-650&&!f.bounced){f.vy=-v*.38;f.y=.6;f.bounced=true;shake(.25);SFX.land();burst(f.x,-5,14,['#fff8','#ff3df2'],{spd:400,ang:-Math.PI/2,spread:1.3,g:600,size:12,k:'circle'});if(-v>1100)popText(f.x,-60,'GROUND BOUNCE!','#ffd23d',30)}else{f.st='down';f.t=0;f.inv=f.ko?99:.65;f.sq=.4;SFX.land();shake(.15)}}
  else{if(v<-400){f.sq=.28;SFX.land()}if(f.introDrop){f.introDrop=0;premLand(f)}if(f.st==='air')f.st='idle';if(f.st==='attack'&&f.mv&&f.mv.air){if(f.mvN==='AH'){shake(.3);ring(f.x,0,'#fff',140,10)}f.st='idle';f.mv=null}}}}
 if(!isAir(f)&&['hitstun','blockstun','down','parried','launched','idle'].includes(f.st))f.vx*=Math.exp(-9*dt);
 if(f.x<WL||f.x>WR){const side=f.x<WL?1:-1;f.x=clamp(f.x,WL,WR);if(f.st==='launched'&&Math.abs(f.vx)>480&&!f.wallB){f.wallB=true;f.vx=side*Math.abs(f.vx)*.45;f.vy=Math.max(f.vy,700);shake(.5);hitstop(.08);SFX.wall();f.hp=Math.max(f.ko?0:1,f.hp-20);popText(f.x+side*60,-(f.y+f.F.h*.7),'WALL BOUNCE!','#ff3df2',34,{vy:-60});burst(f.x-side*40,-(f.y+f.F.h*.5),24,['#fff','#ff3df2','#ffd23d'],{spd:700,ang:side>0?0:Math.PI,spread:1.2,k:'star'})}else f.vx=0}
 f.ghost=f.ghost>f.hp?Math.max(f.hp,f.ghost-f.max*dt*.5):f.hp}
function pushApart(a,b){if(isAir(a)&&isAir(b))return;const min=48*(a.sc+b.sc),dx=b.x-a.x;if(Math.abs(dx)<min&&Math.abs(a.y-b.y)<150){const p=(min-Math.abs(dx))/2,s=sgn(dx)||1;a.x=clamp(a.x-s*p,WL,WR);b.x=clamp(b.x+s*p,WL,WR)}}
function poseOf(f){if(['hitstun','launched','down','parried'].includes(f.st)||f.ko)return'hurt';if(f.st==='attack'&&f.mv&&!f.charging&&f.mvT>=f.mv.st*.6&&f.mvT<f.mv.st+f.mv.ac+f.mv.rc*.6)return'attack';if(f.st==='special'&&f.t>.1)return'attack';return'idle'}
// ---------- AI ----------
const PERS={aggro:{dist:130,atk:.85,blk:.25,parry:.12,jump:.2,dash:.4,proj:0,heavy:.25},brawler:{dist:150,atk:.7,blk:.4,parry:.15,jump:.12,dash:.2,proj:0,heavy:.45},zoner:{dist:540,atk:.5,blk:.45,parry:.15,jump:.15,dash:.3,proj:.8,heavy:.25},turtle:{dist:210,atk:.45,blk:.8,parry:.4,jump:.05,dash:.1,proj:0,heavy:.55},tank:{dist:180,atk:.6,blk:.5,parry:.15,jump:.03,dash:.1,proj:0,heavy:.6},speed:{dist:120,atk:.85,blk:.3,parry:.2,jump:.35,dash:.75,proj:0,heavy:.2},grappler:{dist:105,atk:.8,blk:.35,parry:.1,jump:.05,dash:.55,proj:0,heavy:.65},trick:{dist:240,atk:.6,blk:.4,parry:.3,jump:.3,dash:.65,proj:0,heavy:.3},boss:{dist:220,atk:.75,blk:.55,parry:.3,jump:.12,dash:.3,proj:.55,heavy:.5},rage:{dist:115,atk:.93,blk:.12,parry:.05,jump:.25,dash:.6,proj:0,heavy:.6},sniper:{dist:640,atk:.45,blk:.5,parry:.2,jump:.12,dash:.35,proj:.95,heavy:.2}};
function aiUpdate(f,o){const c=f.ctl,A=f.ai,d=G.diff,P=PERS[f.F.ai]||PERS.brawler,T=G.time;
 c.l=c.r=0;if(G.phase!=='fight'||G.aiOff){c.blk=c.hvy=0;return}
 const dist=Math.abs(o.x-f.x),to=sgn(o.x-f.x);c.blk=A.blkUntil>T?1:0;c.hvy=A.hvyUntil>T?1:0;if(A.moveUntil>T){if(A.moveDir>0)c.r=1;else c.l=1}
 const threat=(o.st==='attack'&&o.mv&&!o.mv.proj&&dist<320)||o.st==='special'||G.projs.some(p=>p.owner===o&&Math.abs(p.x-f.x)<300&&sgn(f.x-p.x)===sgn(p.vx));
 if(threat&&!A.reacted){A.reacted=true;A.reactAt=T+lerp(.4,.1,d)*rand(.8,1.25);A.rb=Math.random()<P.blk*(.3+.7*d);A.rp=Math.random()<P.parry*d}
 if(!threat)A.reacted=false;
 if(A.reactAt>0&&T>=A.reactAt){A.reactAt=-1;if(['idle','walk','block'].includes(f.st)){if(A.rp){c.blkE=1;A.blkUntil=T+.28;c.blk=1}else if(A.rb){c.blkE=1;A.blkUntil=T+rand(.35,.6);c.blk=1}else if(Math.random()<P.jump*d)c.jumpE=1}}
 if(T<A.next||c.blk)return;A.next=T+lerp(.4,.12,d)*rand(.7,1.3);
 if(f.st==='attack'&&f.mv&&f.mv.next&&f.hit.size&&Math.random()<.35+.6*d){c.lightE=1;return}
 if(!['idle','walk','air'].includes(f.st))return;
 const hold=s=>{A.hvyUntil=T+s;c.hvy=1;c.heavyE=1};
 if(f.meter>=100&&Math.random()<.35+.5*d&&(dist<360||['volley','beam','teleport','flurry','clone','tsunami','flush','rain','lightning','boomerang','shockwave','meteor','vortex'].includes(f.sp.type))){c.specE=1;return}
 if(o.st==='parried'&&dist<280){hold(.05);return}
 if(isAir(o)&&o.y>100&&dist<230&&Math.random()<.25+.5*d){hold(.05);return}
 if(f.F.proj&&P.proj&&dist>330&&Math.random()<P.proj){hold(rand(.05,.55)*d);return}
 if(dist>P.dist+60){if(Math.random()<P.dash*d&&!isAir(f))c.dashE=to;else{A.moveDir=to;A.moveUntil=T+rand(.2,.5)}if(Math.random()<P.jump*.4)c.jumpE=1;return}
 if(P.dist>300&&dist<P.dist-170){if(Math.random()<.45)c.dashE=-to;else{A.moveDir=-to;A.moveUntil=T+.35}if(Math.random()<.2)c.jumpE=1;return}
 if(dist<240){if(Math.random()<P.atk*(.55+.45*d)){if(Math.random()<P.heavy)hold(rand(.1,.6));else c.lightE=1}else if(Math.random()<.4){A.moveDir=-to;A.moveUntil=T+.22}else if(Math.random()<P.blk*.5){c.blkE=1;A.blkUntil=T+.4}return}
 A.moveDir=to;A.moveUntil=T+.2}

// ---------- NEW SPECIAL TYPES ----------
const XSP={
 rain(f,o,dt,t,s){const n=f.sp.n||9;f.vx*=Math.exp(-8*dt);if(t<.25&&Math.random()<.7)burst(f.x,-(f.y+f.F.h),2,[f.F.col,'#fff'],{spd:500,ang:-Math.PI/2,spread:.3,g:-400,k:'star',size:9});
  for(let i=0;i<n;i++)if(t>.25+i*.07&&!s['r'+i]){s['r'+i]=1;const x=clamp(o.x+o.vx*.25+rand(-230,230),WL,WR),last=i===n-1;spawnProj(f,{kind:f.sp.proj,abs:1,x:last?o.x:x,y:1050+rand(0,220),vx:rand(-60,60),vy:-950,g:500,dmg:last?60:26,ky:last?900:0})}
  return .55+n*.07},
 boomerang(f,o,dt,t,s){f.vx*=Math.exp(-8*dt);[.1,.32].forEach((at,i)=>{if(t>at&&!s['b'+i]){s['b'+i]=1;f.sq=-.2;spawnProj(f,{kind:f.sp.proj||'disc',vx:1250,vy:0,g:0,yk:i?.75:.35,dmg:40,boom:1,ky:i?700:0})}});return .75},
 shockwave(f,o,dt,t,s){f.vx*=Math.exp(-10*dt);const C=f.sp.col||f.F.col;if(t>.18&&!s.sl){s.sl=1;s.x0=f.x;s.d=f.dir;SFX.boom();shake(.7);ring(f.x,0,C,240,18)}
  if(s.sl&&t<1.1){s.wx=s.x0+s.d*(t-.18)*1500;if(Math.random()<.9)burst(s.wx,-5,3,[C,'#fff','#6b3b1c'],{ang:-Math.PI/2,spread:.5,spd:900,size:12});
   areaHit(f,o,'sw',{x0:s.wx-90,x1:s.wx+90,y0:0,y1:220},{dmg:125,kx:500,ky:1300,launch:1,hs:.6,hstop:.16,shake:.6,sfx:'heavy',txt:'SHOCKWAVE!',fromX:s.wx-s.d*100},99)}else s.wx=null;return 1.15},
 meteor(f,o,dt,t,s){const C=f.sp.col||'#ff7a1a';if(!s.up){s.up=1;f.vy=1900;f.y=Math.max(f.y,1);f.vx=clamp((o.x-f.x)*1.1,-900,900)}
  if(t>.5&&!s.dive){s.dive=1;f.dir=sgn(o.x-f.x)||f.dir;f.vy=-3200;f.vx=clamp((o.x-f.x)*2.4,-1600,1600);SFX.dash()}
  if(s.dive&&!s.land){f.rot=f.dir*.6;burst(f.x,-(f.y+f.F.h*.5),3,[C,'#ffd23d','#fff'],{spd:300,ang:-Math.PI/2,spread:.6,g:0,k:'circle',size:14,life:.5});
   areaHit(f,o,'md',fbox(f,-80,120,0,f.F.h/f.sc),{dmg:55,kx:200,ky:-900,spike:1,launch:1,hs:.5,hstop:.08,shake:.4,sfx:'heavy'},99);
   if(f.y<=.5&&f.vy<=0){s.land=t;f.rot=0;f.vx=0;SFX.boom();shake(1.1);ring(f.x,-10,C,340,26);burst(f.x,0,50,[C,'#ffd23d','#6b3b1c','#fff'],{ang:-Math.PI/2,spread:1.3,spd:1400,size:15,k:'star'});
    areaHit(f,o,'ml',{x0:f.x-300,x1:f.x+300,y0:0,y1:360},{dmg:130,kx:700,ky:1300,launch:1,hs:.7,hstop:.2,shake:.8,sfx:'heavy',txt:'METEOR!'},99)}}
  return s.land!=null?s.land+.35:2},
 vortex(f,o,dt,t,s){const px=f.x+f.dir*170,C=f.sp.col||f.F.col;s.px=px;if(t<.95){f.vx*=Math.exp(-10*dt);if(f.F.armorH)f.armor=1;if(f.sp.spin)f.rot+=dt*22;const dx=px-o.x;if(Math.abs(dx)<820&&!o.ko)o.vx+=sgn(dx)*Math.min(2600,Math.abs(dx)*9)*dt;
   for(let i=0;i<2;i++){const a=G.time*10+i*3.1,r=rand(60,220);burst(px+Math.cos(a)*r,-(f.F.h*.5+Math.sin(a)*r*.5),1,[C,'#fff'],{spd:90,g:0,k:'spark',size:8,life:.35})}
   areaHit(f,o,'vt',{x0:px-200,x1:px+200,y0:-20,y1:f.F.h*1.2},{dmg:12,kx:20,ky:0,hs:.3,hstop:.02,shake:.08,sfx:'light'},.12)}
  else{f.rot=0;f.armor=0;if(!s.vb){s.vb=1;SFX.boom();shake(.8);ring(px,-(f.F.h*.5),C,330,24);burst(px,-(f.F.h*.5),40,[C,'#fff'],{spd:1300,g:0,k:'star',size:12})}
   areaHit(f,o,'vb',{x0:px-250,x1:px+250,y0:-20,y1:f.F.h*1.3},{dmg:110,kx:900,ky:1100,launch:1,hs:.7,hstop:.18,shake:.6,sfx:'heavy',txt:'VORTEX!',fromX:px-f.dir*50},99)}return 1.25},
 lightning(f,o,dt,t,s){const n=f.sp.n||3,gap=n>3?.16:.28,C=f.sp.col||'#7fe8ff';f.vx*=Math.exp(-8*dt);
  for(let i=0;i<n;i++){if(t>.12+i*gap&&!s['T'+i])s['T'+i]={x:clamp(o.x+o.vx*.2+(n>3?rand(-150,150):0),WL,WR),t:G.time};const L=s['T'+i];
   if(L&&!L.hit&&G.time-L.t>.3){L.hit=1;L.st=G.time;SFX.zap();shake(.35);J.flash=.12;J.flashCol=C;burst(L.x,0,22,[C,'#fff'],{ang:-Math.PI/2,spread:1.2,spd:900,k:'spark',g:600});const last=i===n-1;
    areaHit(f,o,'T'+i,{x0:L.x-85,x1:L.x+85,y0:-20,y1:1400},last?{dmg:90,kx:300,ky:1200,launch:1,hs:.6,hstop:.15,shake:.6,sfx:'heavy',txt:'ZAPPED!',fromX:L.x-sgn(o.x-f.x)}:{dmg:n>3?32:46,kx:80,ky:0,hs:.45,hstop:.06,shake:.25,sfx:'light',fromX:L.x-sgn(o.x-f.x)},99)}}
  return .12+(n-1)*gap+.6},
};
// ---------- PREMIUM FX ----------
function premCols(t){if(t==='mythic'){const h=(G?G.time:0)*300%360;return[`hsl(${h},100%,65%)`,`hsl(${(h+120)%360},100%,65%)`,`hsl(${(h+240)%360},100%,70%)`,'#fff']}return t==='legendary'?['#ffd23d','#ffb300','#fff6a8','#fff']:['#2ec5ff','#b44dff','#7fe8ff','#fff']}
function premLand(f){const t=f.F.prem;SFX.boom();SFX.choir();shake(.7);ring(f.x,-10,premCols(t)[0],300,22);ring(f.x,-10,'#fff',200,12);burst(f.x,0,46,premCols(t),{ang:-Math.PI/2,spread:1.4,spd:1200,size:13,k:'star'});popText(f.x,-(f.F.h+90),TIERS[t].label+'!',premCols(t)[0],46,{vy:-60,life:1.2})}
function premKO(a,d){const t=a.F.prem,cols=premCols(t),cx=d.x,cy=-(d.y+d.F.h*.5);SFX.choir();setTimeout(()=>SFX.sparkle(),300);
 if(t==='legendary'){burst(cx,cy,90,['#ffd23d'],{k:'coin',spd:1300,up:900,size:15});J.flashCol='#ffd23d'}
 else if(t==='mythic'){for(let i=0;i<6;i++)burst(cx,cy,14,[`hsl(${i*60},100%,62%)`],{k:'spark',spd:1800,g:0,size:16,ang:i*Math.PI/3,spread:.25});burst(cx,cy,70,cols,{k:'star',spd:1400,up:400,size:14});J.flashCol=`hsl(${G.time*300%360},100%,70%)`}
 else{burst(cx,cy,80,['#2ec5ff','#b44dff','#fff','#7fe8ff'],{k:Math.random()<.5?'star':'sq',spd:1300,up:700,size:12});J.flashCol='#7fe8ff'}
 ring(cx,cy,cols[0],420,30);popText(W/2,H*.52,TIERS[t].label+' K.O.!',cols[0],fitSize(X,'LEGENDARY K.O.!',60,W*.8),{hud:1,life:2,vy:0})}
// ---------- MATCH FLOW ----------
const isTouch=matchMedia('(pointer: coarse)').matches||/[?&]touch\b/.test(location.search);
let MATCH_TOKEN=0;
function pickOpp(me){const pool=IDS.filter(id=>id!=='boss'&&id!==me);return pick(pool)}
// kind: 'ladder' (rung), 'gauntlet' (random foes incl. premium, win streak), 'trial' (free 1-round test of a premium fighter, no rewards)
async function startMatch(rung,cont,opts={}){audio();closeModal();const tok=++MATCH_TOKEN,kind=opts.trial?'trial':opts.gauntlet?'gauntlet':'ladder';
 const me=opts.trial||(owned(S.pick)?S.pick:'shark'),opp=opts.opp||(kind==='ladder'?LADDER[rung]:pickOpp(me)),donor=kind==='trial'?null:(S.donor&&owned(S.donor)&&S.donor!==me?S.donor:null);
 if(!isLoaded(me)||!isLoaded(opp))toast('Loading fighters...',1200);
 try{await Promise.all([ensureFighter(me),ensureFighter(opp)])}catch(e){console.warn(e);toast('Could not load fighter art. Check your connection.',3000);return}
 if(tok!==MATCH_TOKEN)return;$('#toast').style.display='none';closeModal();$('#modal').dataset.lock='';$$('.scr').forEach(s=>s.classList.remove('on'));
 const diff=kind==='ladder'?DIFF[rung]:kind==='trial'?.3:Math.min(.92,.3+S.gStreak*.06);
 G={rung,kind,me,donor,opp,diff,need:kind==='trial'?1:2,round:cont?3:1,wins:cont?[1,1]:[0,0],time:0,cam:{x:800,w:1100},projs:[],freeze:0,mode:'fight',stats:{best:0,flawless:false},aiOff:false};
 startRound();musicStart();$('#pad').classList.toggle('on',isTouch);$('#pauseBtn').style.display='block'}
function startRound(){G.p1=mkFighter(G.me,G.donor,0,580);G.p2=mkFighter(G.opp,null,1,1020);
 if(G.round===1)for(const f of [G.p1,G.p2])if(f.F.prem){f.y=1150;f.vy=0;f.st='air';f.introDrop=1}G.timer=60;G.phase='intro';G.pt=0;G.s1=G.s2=G.s3=0;G.bubs=[];G.projs=[];G.freeze=0;G.superF=null;J.parts=[];J.texts=[];J.slow=1;J.slowT=0;clearEdges(PEND)}
function roundKO(a,d){if(G.phase!=='fight')return;d.ko=true;G.phase='ko';G.koT=0;G.winner=a.side;G.wins[a.side]++;d.st='launched';d.mv=null;d.vy=Math.max(d.vy,950);d.vx=sgn(d.x-a.x)*750;d.wallB=false;d.bounced=false;
 slowmo(.22,1.3);hitstop(.28);shake(1.3);J.flash=.9;J.flashCol='#fff';SFX.boom();popText(W/2,H*.36,'K.O.!',a.side?'#ff3d3d':'#b6ff2e',fitSize(X,'K.O.!',130,W*.8),{hud:1,life:2.2,vy:0,rot:-.06});say('K. O.');
 burst(d.x,-(d.y+d.F.h*.5),50,['#ffd23d'],{k:'coin',spd:900,up:600,size:12});burst(d.x,-(d.y+d.F.h*.5),60,['#ff3df2','#b6ff2e','#2ec5ff','#fff'],{spd:1200,up:300,k:'star'});if(a.F.prem)premKO(a,d);
 if(a.side===0){G.stats.best=Math.max(G.stats.best,a.maxCombo);if(a.taken===0){G.stats.flawless=true;setTimeout(()=>G&&popText(W/2,H*.5,'FLAWLESS!','#ffd23d',48,{hud:1,life:1.6,vy:0}),500)}}
 const line=pick(a.F.lines);setTimeout(()=>{if(G&&G.phase==='ko'){bubble(a,line,1.8);say(line)}},900)}
function bubble(f,txt,life=1.6){G.bubs=(G.bubs||[]).filter(b=>b.f!==f);G.bubs.push({f,txt,t:0,life})}
function drawBubbles(c,dt){if(!G.bubs)return;for(const b of G.bubs){b.t+=dt;const f=b.f,s=1/VIEW.s,fs=Math.max(20,15*s);c.font=`900 ${fs}px system-ui,sans-serif`;const w=c.measureText(b.txt).width+fs*1.2,h=fs*1.9,x=clamp(f.x-w/2,VIEW.cx-W/VIEW.s/2+8*s,VIEW.cx+W/VIEW.s/2-w-8*s),y=-(f.y+f.F.h+40)-h,k=b.t<.12?easeOutBack(b.t/.12):1,a=b.t>b.life-.25?(b.life-b.t)/.25:1;c.save();c.globalAlpha=Math.max(0,a);c.translate(x+w/2,y+h);c.scale(k,k);c.translate(-(x+w/2),-(y+h));c.fillStyle='#fff';c.strokeStyle='#14002b';c.lineWidth=4*Math.min(2,s);c.beginPath();c.roundRect(x,y,w,h,h*.45);c.moveTo(f.x-12,y+h-2);c.lineTo(f.x,y+h+20);c.lineTo(f.x+12,y+h-2);c.fill();c.stroke();c.fillRect(f.x-10,y+h-6,20,6);c.fillStyle='#14002b';c.textAlign='center';c.textBaseline='middle';c.fillText(b.txt,x+w/2,y+h/2);c.restore()}G.bubs=G.bubs.filter(b=>b.t<b.life)}
function timeUp(){G.phase='ko';G.koT=0;const p=G.p1,q=G.p2,w=p.hp/p.max>=q.hp/q.max?0:1;G.wins[w]++;G.winner=w;popText(W/2,H*.36,'TIME!','#ffd23d',110,{hud:1,life:2,vy:0});SFX.bell();if(w===0)G.stats.best=Math.max(G.stats.best,p.maxCombo)}
function nextRound(){if(G.wins[0]>=G.need||G.wins[1]>=G.need)endMatch();else{G.round++;startRound()}}
function endMatch(){G.mode='result';G.phase='end';musicStop();$('#pad').classList.remove('on');$('#pauseBtn').style.display='none';const won=G.wins[0]>=G.need,r=G.rung,opp=G.opp,kind=G.kind,me=G.me;$('#modal').dataset.lock='1';
 if(kind==='trial'){const pid=productFor(me),P=CATALOG[pid],o=owned(me);won?SFX.fanfare():SFX.womp();
  modal(`<h1>${won?'TRIAL WON!':'TRIAL OVER'}</h1><div class="celeb t-${tierOf(me)}"><div class="aura"></div>${pimg(me)}</div><p><b>${FIGHTERS[me].name}</b> ${won?`beat ${FIGHTERS[opp].name}!`:`lost to ${FIGHTERS[opp].name}.`}<br>Free trial: no coins or progress.</p><div class="row">${o?`<button class="btn big" id="trPlay">OWNED - PLAY</button>`:`<button class="btn big gold" id="trBuy">GET ${FIGHTERS[me].name.toUpperCase()} - ${fmt(P.price)}</button>`}</div><div class="row"><button class="btn pink" id="retryBtn">TRY AGAIN</button><button class="btn grey" id="menuBtn">SHOP</button></div>`,'trialbox');
  if($('#trBuy'))$('#trBuy').onclick=()=>{quit();openShop(me);buyFlow(pid)};if($('#trPlay'))$('#trPlay').onclick=()=>{quit();S.pick=me;save();screen('select')};
  $('#retryBtn').onclick=()=>startMatch(0,false,{trial:me});$('#menuBtn').onclick=()=>{quit();openShop(me)};return}
 if(kind==='gauntlet'){if(won){S.gStreak++;S.gBest=Math.max(S.gBest,S.gStreak);const coins=30+S.gStreak*12+(G.stats.flawless?30:0);S.coins+=coins;S.wins++;let un=null;if(!FIGHTERS[opp].prem&&opp!=='boss'&&!owned(opp)){S.unlocked.push(opp);un=opp}S.bestCombo=Math.max(S.bestCombo,G.stats.best);save();SFX.fanfare();
   modal(`<h1>STREAK x${S.gStreak}!</h1><p>Beat ${FIGHTERS[opp].name} ${G.wins[0]} - ${G.wins[1]}${G.stats.flawless?' | FLAWLESS +30':''}<br>Best streak: ${S.gBest}</p><p style="font-size:22px;color:#ffd23d">+<span id="wonCoins">${coins}</span> COINS</p>${un?`<p style="color:#b6ff2e">NEW FIGHTER UNLOCKED!</p><img class="pf" src="${imgSrc(un)}" alt=""><p>${FIGHTERS[un].name}</p>`:''}${FIGHTERS[opp].prem&&!owned(opp)?`<p style="color:#ffd23d">Liked ${FIGHTERS[opp].name}? It's ${TLABEL(FIGHTERS[opp].prem)} in the shop.</p>`:''}
   <div class="row"><button class="btn big" id="nextBtn">NEXT OPPONENT</button></div><div class="row"><button class="btn gold" id="x2Btn">x2 COINS (AD)</button>${FIGHTERS[opp].prem&&!owned(opp)?'<button class="btn pink" id="seeShop">SEE IN SHOP</button>':''}<button class="btn grey" id="menuBtn">MENU</button></div>`);
   $('#nextBtn').onclick=()=>startMatch(0,false,{gauntlet:1});$('#x2Btn').onclick=()=>showAd(()=>{S.coins+=coins;save();setCoins();$('#wonCoins').textContent=coins*2;$('#x2Btn').disabled=true;SFX.coin();toast('Coins doubled!')});if($('#seeShop'))$('#seeShop').onclick=()=>{quit();openShop(opp)}}
  else{const streak=S.gStreak,c=5+streak*3;S.gStreak=0;S.coins+=c;save();SFX.womp();
   modal(`<h1>GAUNTLET OVER</h1><img class="pf" src="${imgSrc(opp,'attack')}" alt=""><p>${FIGHTERS[opp].name} ended your run. "${pick(FIGHTERS[opp].lines)}"</p><p style="font-size:20px;color:#ffd23d">STREAK: ${streak} | BEST: ${S.gBest}</p><p>+${c} coins</p><div class="row"><button class="btn pink" id="retryBtn">NEW RUN (R)</button><button class="btn grey" id="menuBtn">MENU</button></div>`);
   $('#retryBtn').onclick=()=>startMatch(0,false,{gauntlet:1})}
  $('#menuBtn').onclick=()=>{quit();screen('select')};return}
 if(won){const coins=40+r*9+(G.stats.flawless?30:0);S.coins+=coins;S.wins++;if(S.rung<=r)S.rung=r+1;let un=null;if(!S.unlocked.includes(opp)){S.unlocked.push(opp);un=opp}S.bestCombo=Math.max(S.bestCombo,G.stats.best);save();SFX.fanfare();
  modal(`<h1>${r===LAST?'LADDER CLEARED!':'VICTORY!'}</h1><p>${G.wins[0]} - ${G.wins[1]} vs ${FIGHTERS[opp].name}${G.stats.flawless?' | FLAWLESS +30':''}<br>Best combo: ${G.stats.best} hits</p><p style="font-size:22px;color:#ffd23d">+<span id="wonCoins">${coins}</span> COINS</p>${un?`<p style="color:#b6ff2e">NEW FIGHTER UNLOCKED!</p><img class="pf" src="${imgSrc(un)}" alt=""><p>${FIGHTERS[un].name}</p>`:''}
  <div class="row">${r<LAST?'<button class="btn big" id="nextBtn">NEXT FIGHT</button>':''}</div><div class="row"><button class="btn gold" id="x2Btn">x2 COINS (AD)</button><button class="btn blue" id="shareBtn">SHARE</button><button class="btn grey" id="menuBtn">MENU</button></div>`);
  if($('#nextBtn'))$('#nextBtn').onclick=()=>startMatch(r+1);
  $('#x2Btn').onclick=()=>showAd(()=>{S.coins+=coins;save();setCoins();$('#wonCoins').textContent=coins*2;$('#x2Btn').disabled=true;SFX.coin();toast('Coins doubled!')});
  $('#shareBtn').onclick=()=>{quit();screen('home');shareCard()}}
 else{const c=5+r*2;S.coins+=c;save();SFX.womp();
  modal(`<h1>BRAINROTTED</h1><img class="pf" src="${imgSrc(opp,'attack')}" alt=""><p>${FIGHTERS[opp].name} wins ${G.wins[1]} - ${G.wins[0]}. "${pick(FIGHTERS[opp].lines)}"</p><p style="color:#b6ff2e">TIP: ${pick(TIPS)}</p><p>+${c} pity coins</p><div class="row"><button class="btn gold" id="contBtn">CONTINUE (AD) - start at 1-1</button></div><div class="row"><button class="btn pink" id="retryBtn">RETRY (R)</button><button class="btn grey" id="menuBtn">MENU</button></div>`);
  $('#contBtn').onclick=()=>showAd(()=>startMatch(r,true));$('#retryBtn').onclick=()=>startMatch(r)}
 $('#menuBtn').onclick=()=>{quit();screen('select')}}
const TIPS=['Tap BLOCK right before a hit lands to PARRY: they get stunned, you get a free combo.','PUNCH x3 then HEAVY while they are in the air = juggle.','Hold HEAVY to charge. Full charge launches them sky high.','In the air, HEAVY is a meteor spike. Spike them into a ground bounce.','Knock them into the wall for a WALL BOUNCE and keep juggling.','Double-tap a direction to dash in (or out).','Special meter fills when you hit AND when you get hit. Use it!'];
function quit(){G=null;musicStop();closeModal();$('#modal').dataset.lock='';$('#pad').classList.remove('on');$('#pauseBtn').style.display='none';X.setTransform(1,0,0,1,0,0);X.clearRect(0,0,cv.width,cv.height)}
function leaveMatch(){if(!G)return;const k=G.kind,me=G.me;quit();if(k==='trial')openShop(me);else screen('select')}
$('#pauseBtn').onclick=leaveMatch;

// ---------- INPUT ----------
const KEYS={},PEND=newCtl(),TOUCH={l:0,r:0,blk:0,hvy:0};let lastTap={d:0,t:0};
const EDGES=['jumpE','lightE','heavyE','specE','dashE','blkE'];
function clearEdges(c){EDGES.forEach(e=>c[e]=0)}
function tapDir(d){const t=nowS();if(lastTap.d===d&&t-lastTap.t<.26){PEND.dashE=d;lastTap.t=0}else lastTap={d,t}}
addEventListener('keydown',e=>{const k=e.key.toLowerCase();if(G&&G.mode==='fight'&&[' ','arrowup','arrowdown','arrowleft','arrowright'].includes(k))e.preventDefault();if(e.repeat)return;audio();
 if(G&&G.mode==='result'&&k==='r'&&$('#retryBtn')){$('#retryBtn').click();return}
 if(k==='a'||k==='arrowleft'){KEYS.l=1;tapDir(-1)}else if(k==='d'||k==='arrowright'){KEYS.r=1;tapDir(1)}
 else if(k==='w'||k==='arrowup'||k===' ')PEND.jumpE=1;else if(k==='j'||k==='z')PEND.lightE=1;else if(k==='k'||k==='x'){PEND.heavyE=1;KEYS.hvy=1}else if(k==='l'||k==='c'){PEND.blkE=1;KEYS.blk=1}else if(k==='u'||k==='v'||k==='i')PEND.specE=1;
 else if(k==='escape'&&G&&G.mode==='fight')leaveMatch()});
addEventListener('keyup',e=>{const k=e.key.toLowerCase();if(k==='a'||k==='arrowleft')KEYS.l=0;if(k==='d'||k==='arrowright')KEYS.r=0;if(k==='k'||k==='x')KEYS.hvy=0;if(k==='l'||k==='c')KEYS.blk=0});
addEventListener('blur',()=>{for(const k in KEYS)KEYS[k]=0;TOUCH.l=TOUCH.r=TOUCH.blk=TOUCH.hvy=0});
function feedPlayer(f){const c=f.ctl;c.l=KEYS.l||TOUCH.l?1:0;c.r=KEYS.r||TOUCH.r?1:0;c.blk=KEYS.blk||TOUCH.blk?1:0;c.hvy=KEYS.hvy||TOUCH.hvy?1:0;EDGES.forEach(e=>c[e]=PEND[e])}
// touch stick
const ST={id:null,ox:0,oy:0,side:0,up:false,lastSide:{'1':0,'-1':0}};
const zone=$('#stickZone'),stick=$('#stick');
zone.addEventListener('pointerdown',e=>{e.preventDefault();audio();if(ST.id!==null)return;ST.id=e.pointerId;zone.setPointerCapture(e.pointerId);const r=zone.getBoundingClientRect();ST.ox=e.clientX;ST.oy=e.clientY;stick.style.left=(e.clientX-r.left)+'px';stick.style.top=(e.clientY-r.top)+'px';stick.style.display='block';$('#stickHint').style.display='none';stickMove(e)});
zone.addEventListener('pointermove',e=>{if(e.pointerId===ST.id)stickMove(e)});
function stickMove(e){const dx=e.clientX-ST.ox,dy=e.clientY-ST.oy,m=Math.min(1,46/Math.max(1,Math.hypot(dx,dy)));stick.firstChild.style.transform=`translate(${dx*m}px,${dy*m}px)`;
 const s=dx>22?1:dx<-22?-1:0;if(s!==ST.side){if(s){const t=nowS();if(t-ST.lastSide[s]<.3)PEND.dashE=s;ST.lastSide[s]=t}ST.side=s}TOUCH.r=s>0?1:0;TOUCH.l=s<0?1:0;
 if(dy<-48&&!ST.up){ST.up=true;PEND.jumpE=1}else if(dy>-24)ST.up=false}
function stickEnd(e){if(e.pointerId!==ST.id)return;ST.id=null;ST.side=0;ST.up=false;TOUCH.l=TOUCH.r=0;stick.style.display='none'}
zone.addEventListener('pointerup',stickEnd);zone.addEventListener('pointercancel',stickEnd);
$$('.tb').forEach(b=>{const k=b.dataset.k;b.addEventListener('pointerdown',e=>{e.preventDefault();audio();b.setPointerCapture(e.pointerId);b.classList.add('down');if(k==='light')PEND.lightE=1;if(k==='heavy'){PEND.heavyE=1;TOUCH.hvy=1}if(k==='block'){PEND.blkE=1;TOUCH.blk=1}if(k==='special')PEND.specE=1});
 const up=()=>{b.classList.remove('down');if(k==='heavy')TOUCH.hvy=0;if(k==='block')TOUCH.blk=0};b.addEventListener('pointerup',up);b.addEventListener('pointercancel',up)});

// ---------- UPDATE ----------
function updateGame(rdt){musicTick();if(G.freeze>0){G.freeze-=rdt;updJuice(0,rdt);if(G.freeze<=0)G.superF=null;return}
 let dt=rdt;if(J.stop>0){J.stop-=rdt;dt=0}else dt=rdt*J.slow;G.pt+=rdt;
 if(G.phase==='intro'){if(G.pt>.15&&!G.s1){G.s1=1;popText(W/2,H*.34,G.round===3?'FINAL ROUND':'ROUND '+G.round,'#fff',fitSize(X,'FINAL ROUND',84,W*.85),{hud:1,life:1.1,vy:0});SFX.bell();say(G.round===3?'Final round':'Round '+G.round)}
  if(G.pt>.35&&!G.s3&&G.round===1){G.s3=1;bubble(G.p2,pick(G.p2.F.lines),1.4)}
  if(G.pt>1.25&&!G.s2){G.s2=1;popText(W/2,H*.34,'FIGHT!','#b6ff2e',fitSize(X,'FIGHT!',120,W*.8),{hud:1,life:.9,vy:0,rot:-.05});shake(.4);SFX.heavy();say('Fight!')}if(G.pt>1.5)G.phase='fight'}
 if(dt>0){G.time+=dt;const p=G.p1,q=G.p2;if(G.phase==='fight'||G.phase==='intro'){feedPlayer(p);aiUpdate(q,p)}else{clearEdges(p.ctl);p.ctl.l=p.ctl.r=p.ctl.blk=0;q.ctl.l=q.ctl.r=q.ctl.blk=0;clearEdges(q.ctl)}
  updF(p,q,dt);updF(q,p,dt);pushApart(p,q);if(G.phase==='fight'){hitCheck(p,q);hitCheck(q,p)}updProjs(dt);clearEdges(p.ctl);clearEdges(q.ctl);clearEdges(PEND);
  if(G.phase==='fight'){G.timer-=dt;if(G.timer<=0){G.timer=0;timeUp()}}}
 if(G.phase==='ko'){G.koT+=rdt;if(G.koT>2.7)nextRound()}
 updJuice(dt,rdt);
 const b=$('#bU');b.classList.toggle('ready',!!(G.p1&&G.p1.meter>=100))}

// ---------- RENDER ----------
let VIEW={s:1,cx:800,fy:0};
function camera(){const p=G.p1,q=G.p2,portrait=H>W*1.1,fy=portrait?H*.58:H*.83,dist=Math.abs(p.x-q.x);G.cam.w=lerp(G.cam.w,clamp(dist+680,portrait?720:900,1600),.08);G.cam.x=lerp(G.cam.x,(p.x+q.x)/2,.12);
 let s=Math.min(W/G.cam.w,(fy-40)/590),cx=G.cam.x;if(G.freeze>0&&G.superF){s*=1.15;cx=lerp(cx,G.superF.x,.6)}const vw=W/s;cx=vw>=1600?800:clamp(cx,vw/2,1600-vw/2);VIEW={s,cx,fy}}
function drawBG(c){const {s,cx,fy}=VIEW;c.fillStyle='#0d0020';c.fillRect(0,0,W,H);if(!BG)return;const px=800+(cx-800)*.85,bw=1600*s,bh=900*s,bx=W/2-px*s,by=fy-790*s;
 c.drawImage(BG,bx,by,bw,bh);if(bx>0||bx+bw<W){c.save();c.scale(-1,1);c.drawImage(BG,-bx,by,bw,bh);c.drawImage(BG,-(bx+2*bw),by,bw,bh);c.restore()}
 if(by+bh<H){const g=c.createLinearGradient(0,by+bh-2,0,H);g.addColorStop(0,'#3a0d78');g.addColorStop(1,'#12002b');c.fillStyle=g;c.fillRect(0,by+bh-2,W,H-(by+bh)+2)}
 if(by>0){const g=c.createLinearGradient(0,0,0,by+2);g.addColorStop(0,'#05000f');g.addColorStop(1,'#0d0326');c.fillStyle=g;c.fillRect(0,0,W,by+2)}}
function drawSprite(c,f,pose,x,y,dir,rot,sx,sy,alpha,sil){if(!SPR[f.id])return;const img=sil?SIL[f.id][pose][sil]:SPR[f.id][pose],m=META[f.id][pose],k=f.F.h/META[f.id].idle.h;
 c.save();c.globalAlpha=alpha;if(f.st==='down'&&!sil){c.translate(x+dir*f.F.h*.42,-(y+26));c.rotate(-dir*1.42)}else{c.translate(x,-(y+f.F.h*.5));c.rotate(rot);c.translate(0,f.F.h*.5)}c.scale(dir*k*sx,k*sy);c.drawImage(img,-m.ax,-m.ay,m.w,m.h);c.restore()}
function drawPremAura(c,f){const T=G.time,t=f.F.prem,col=premCols(t)[0],cy=-(f.y+f.F.h*.5),R=f.F.h*.72*(1+.06*Math.sin(T*4+f.side));
 if(f.introDrop){const g=c.createLinearGradient(0,-2400,0,0);g.addColorStop(0,'#fff0');g.addColorStop(1,col);c.save();c.globalAlpha=.55;c.fillStyle=g;c.fillRect(f.x-90*f.sc,-2400,180*f.sc,2400);c.globalAlpha=.8;c.fillStyle='#fff';c.fillRect(f.x-18,-2400,36,2400);c.restore()}
 c.save();c.globalCompositeOperation='lighter';const g=c.createRadialGradient(f.x,cy,R*.15,f.x,cy,R);g.addColorStop(0,col.startsWith('hsl')?col.replace(')',',.55)').replace('hsl','hsla'):col+'88');g.addColorStop(1,'#0000');c.fillStyle=g;c.beginPath();c.ellipse(f.x,cy,R*.85,R,0,0,7);c.fill();
 c.globalAlpha=.6;c.strokeStyle=col;c.lineWidth=5;c.beginPath();c.ellipse(f.x,-4,95*f.sc,16,0,0,7);c.stroke();c.restore()}
function drawFighter(c,f){const pose=poseOf(f),T=G.time;if(f.F.prem&&!f.ko)drawPremAura(c,f);
 c.fillStyle='#0006';c.beginPath();c.ellipse(f.x,0,75*f.sc*(1-Math.min(.6,f.y/700)),13,0,0,7);c.fill();
 for(const tr of f.trail)drawSprite(c,f,tr.pose,tr.x,tr.y,tr.dir,tr.rot,1,1,tr.a*.55,'w');
 let sx=1+f.sq,sy=1-f.sq,rot=f.rot,x=f.x,y=f.y;
 if(f.st==='idle'||f.st==='block'){sy+=Math.sin(T*5+f.side*2)*.018;sx-=Math.sin(T*5+f.side*2)*.01}
 if(f.st==='walk'){y+=Math.abs(Math.sin(T*13))*10;rot=f.dir*sgn(f.vx)*f.dir*.07*f.dir}
 if(f.st==='dash')rot=sgn(f.vx)*.18;
 if(f.st==='air'){sy*=1+clamp(f.vy/4000,-.08,.12);rot=-f.dir*clamp(f.vy/5000,-.15,.15)}
 if(f.st==='launched')rot=-f.dir*clamp(.4+f.t*3,0,1.1)*(f.ko?1.4:1)+(f.ko?f.t*-f.dir*6:0);
 if(f.st==='hitstun')rot=-f.dir*.12;
 if(f.charging)x+=rand(-4,4);
 if(G.phase==='ko'&&f.side===G.winner&&G.koT>.9&&!f.ko){y+=Math.abs(Math.sin(T*8))*24}
 const P2=(G.phase==='ko'&&f.side===G.winner&&G.koT>.9)?'attack':pose;
 if(f.armor||(f.st==='special'&&f.t<.15)){c.save();c.globalAlpha=.5+.3*Math.sin(T*30);c.fillStyle=f.F.col;c.beginPath();c.arc(f.x,-(f.y+f.F.h*.5),f.F.h*.62,0,7);c.fill();c.restore()}
 drawSprite(c,f,P2,x,y,f.dir,rot,sx,sy,1);
 if(f.flash>0)drawSprite(c,f,P2,x,y,f.dir,rot,sx,sy,Math.min(1,f.flash),'w');
 if(f.charging||(f.st==='attack'&&f.side===1&&f.mv&&f.mv.charge&&f.mvT<f.mv.st))drawSprite(c,f,P2,x,y,f.dir,rot,sx,sy,.35+.25*Math.sin(T*40),'r');
 if(f.st==='block'||f.st==='blockstun'){const cx=f.x+f.dir*70*f.sc,cy=-(f.y+f.F.h*.5);c.save();c.strokeStyle='#2ec5ff';c.lineWidth=12;c.globalAlpha=f.st==='blockstun'?.95:.6;c.shadowColor='#2ec5ff';c.shadowBlur=20;c.beginPath();c.arc(f.x,cy,f.F.h*.55,f.dir>0?-1:Math.PI-1,f.dir>0?1:Math.PI+1);c.stroke();c.restore()}
 if(f.st==='parried')for(let i=0;i<3;i++){const a=T*6+i*2.1;c.fillStyle='#ffd23d';c.save();c.translate(f.x+Math.cos(a)*50,-(f.y+f.F.h+10)+Math.sin(a)*12);c.beginPath();for(let k=0;k<10;k++){const r=k%2?6:15,an=k*Math.PI/5;c.lineTo(Math.cos(an)*r,Math.sin(an)*r)}c.fill();c.restore()}}
function drawProj(c,p){if(p.kind==='clone'){const d=sgn(p.vx);drawSprite(c,p.owner,'attack',p.x,p.y-p.owner.F.h*.5,d,0,1,1,.6);drawSprite(c,p.owner,'attack',p.x,p.y-p.owner.F.h*.5,d,0,1,1,.35,'w');if(Math.random()<.5)burst(p.x,-p.y,1,['#bfe9ff'],{spd:80,g:-300,k:'circle',size:10,life:.6});return}c.save();c.translate(p.x,-p.y);c.rotate(p.rot*.3);const r=p.r;
 if(p.kind==='case'){c.fillStyle='#6b3b1c';c.strokeStyle='#1a0629';c.lineWidth=5;c.beginPath();c.roundRect(-r,-r*.7,r*2,r*1.4,8);c.fill();c.stroke();c.fillStyle='#ffcc00';c.fillRect(-6,-r*.25,12,10);c.beginPath();c.arc(0,-r*.7,r*.35,Math.PI,0);c.stroke()}
 else if(p.kind==='toast'){c.fillStyle='#e8b062';c.strokeStyle='#8a4a14';c.lineWidth=7;c.beginPath();c.roundRect(-r,-r,r*2,r*2,r*.5);c.fill();c.stroke();c.fillStyle='#f8d79a';c.fillRect(-r*.6,-r*.6,r*1.2,r*1.2)}
 else if(p.kind==='note'){c.rotate(-p.rot*.3+Math.sin(p.life*10)*.3);c.fillStyle='#ffd23d';c.strokeStyle='#14002b';c.lineWidth=5;c.beginPath();c.ellipse(-6,10,15,11,-.4,0,7);c.fill();c.stroke();c.fillRect(6,-28,6,38);c.strokeRect(6,-28,6,38);c.beginPath();c.moveTo(12,-28);c.quadraticCurveTo(30,-20,26,-4);c.stroke()}
 else if(p.kind==='heart'){c.rotate(-p.rot*.3);const k=r/30*(1+.12*Math.sin(p.life*20));c.scale(k,k);c.fillStyle='#ff4fb8';c.strokeStyle='#14002b';c.lineWidth=5;c.beginPath();c.moveTo(0,12);c.bezierCurveTo(-34,-10,-16,-34,0,-16);c.bezierCurveTo(16,-34,34,-10,0,12);c.fill();c.stroke();c.fillStyle='#fff8';c.beginPath();c.arc(-10,-14,5,0,7);c.fill()}
 else if(p.kind==='bubble'){c.fillStyle='#bfe9ff55';c.strokeStyle='#fff';c.lineWidth=4;c.beginPath();c.arc(0,0,r,0,7);c.fill();c.stroke()}
 else if(p.kind==='popcorn'){c.fillStyle='#fff6d6';c.strokeStyle='#14002b';c.lineWidth=4;for(const [dx,dy,k] of [[-8,4,.6],[8,4,.6],[0,-8,.7],[0,4,.75]]){c.beginPath();c.arc(dx*r/24,dy*r/24,r*k,0,7);c.fill();c.stroke()}c.fillStyle='#ffd23d';c.beginPath();c.arc(0,6,r*.35,0,7);c.fill()}
 else if(p.kind==='pit'){c.fillStyle='#8a4a14';c.strokeStyle='#14002b';c.lineWidth=5;c.beginPath();c.ellipse(0,0,r,r*.85,0,0,7);c.fill();c.stroke();c.fillStyle='#c98a4a';c.beginPath();c.arc(-r*.3,-r*.3,r*.3,0,7);c.fill()}
 else if(p.kind==='cannon'){c.fillStyle='#2b2b3a';c.strokeStyle='#000';c.lineWidth=4;c.beginPath();c.arc(0,0,r,0,7);c.fill();c.stroke();c.fillStyle='#ffd23d';c.beginPath();c.arc(-r*.35,-r*.35,r*.28,0,7);c.fill()}
 else if(p.kind==='laser'){c.rotate(-p.rot*.3);const g=c.createLinearGradient(0,-r,0,r);g.addColorStop(0,'#2ec5ff00');g.addColorStop(.5,'#fff');g.addColorStop(1,'#2ec5ff00');c.fillStyle='#2ec5ff88';c.beginPath();c.roundRect(-r*2.6,-r*.8,r*5.2,r*1.6,r*.8);c.fill();c.fillStyle=g;c.fillRect(-r*2.4,-r*.4,r*4.8,r*.8)}
 else if(p.kind==='star'){const k=r;c.fillStyle='#ffe066';c.strokeStyle='#6a3df0';c.lineWidth=5;c.beginPath();for(let i=0;i<10;i++){const rr=i%2?k*.45:k,an=i*Math.PI/5;c.lineTo(Math.cos(an)*rr,Math.sin(an)*rr)}c.closePath();c.fill();c.stroke()}
 else if(p.kind==='disc'){c.fillStyle='#111';c.strokeStyle='#2ec5ff';c.lineWidth=3;c.beginPath();c.arc(0,0,r,0,7);c.fill();c.stroke();c.strokeStyle='#333';c.beginPath();c.arc(0,0,r*.7,0,7);c.stroke();c.fillStyle=p.col||'#1abc9c';c.beginPath();c.arc(0,0,r*.3,0,7);c.fill()}
 else{const g=c.createRadialGradient(0,0,4,0,0,r*1.4);g.addColorStop(0,'#fff');g.addColorStop(.4,p.col||'#ff3df2');g.addColorStop(1,'transparent');c.fillStyle=g;c.beginPath();c.arc(0,0,r*1.4,0,7);c.fill()}
 c.restore();if(Math.random()<.5)burst(p.x,-p.y,1,[p.kind==='orb'?p.col||'#ff3df2':p.kind==='laser'?'#2ec5ff':'#fff8'],{spd:60,g:0,k:'circle',size:6,life:.5})}
function drawSpecialFX(c,f){if(f.st!=='special')return;const t=f.t,T=G.time,s=f.spS,ty=f.sp.type,C=f.sp.col||f.F.col;
 if(ty==='lightning')for(let i=0;i<(f.sp.n||3);i++){const L=s['T'+i];if(!L)continue;if(!L.hit){const k=(G.time-L.t)/.3;c.save();c.globalAlpha=.5+.4*Math.sin(T*40);c.strokeStyle=C;c.lineWidth=6;c.beginPath();c.ellipse(L.x,-4,40+60*k,10+8*k,0,0,7);c.stroke();c.globalAlpha=.25;c.fillStyle=C;c.fillRect(L.x-4,-1400,8,1400);c.restore()}
  else if(G.time-L.st<.28){c.save();c.globalAlpha=1-(G.time-L.st)/.28;c.lineJoin='round';for(const [w,col] of [[26,C],[9,'#fff']]){c.strokeStyle=col;c.lineWidth=w;c.shadowColor=C;c.shadowBlur=30;c.beginPath();let x=L.x;c.moveTo(x,-1400);for(let y=-1400;y<0;y+=110){x=L.x+((y*7919)%61-30)*1.8;c.lineTo(x,y)}c.lineTo(L.x,0);c.stroke()}c.restore()}}
 if(ty==='shockwave'&&s.wx!=null){const d=s.d,n=Math.floor(Math.abs(s.wx-s.x0)/70);for(let i=0;i<=n;i++){const x=s.x0+d*i*70,age=(n-i)*70/1500,h=Math.max(0,1-age*2.2)*(i===n?150:120);if(h<4)continue;c.fillStyle=C;c.strokeStyle='#14002b';c.lineWidth=4;c.beginPath();c.moveTo(x-30,0);c.lineTo(x,-h);c.lineTo(x+30,0);c.closePath();c.fill();c.stroke();c.fillStyle='#fff';c.fillRect(x-12,-h*.55,24,h*.14)}}
 if(ty==='vortex'&&t<.95&&s.px!=null){c.save();c.translate(s.px,-(f.F.h*.5));for(let i=0;i<4;i++){c.save();c.rotate(T*(6+i*2)*(i%2?-1:1));c.strokeStyle=i%2?'#fff':C;c.globalAlpha=.55;c.lineWidth=10-i*2;c.beginPath();c.ellipse(0,0,190-i*38,110-i*22,0,0,4.5);c.stroke();c.restore()}c.fillStyle='#000a';c.beginPath();c.arc(0,0,30+6*Math.sin(T*20),0,7);c.fill();c.restore()}
 if(ty==='meteor'&&s.dive&&!s.land){c.save();c.globalCompositeOperation='lighter';const g=c.createLinearGradient(f.x,-(f.y+f.F.h*2),f.x,-(f.y));g.addColorStop(0,'#0000');g.addColorStop(1,C);c.fillStyle=g;c.beginPath();c.moveTo(f.x-70,-(f.y+f.F.h*.5));c.lineTo(f.x-f.vx*.15,-(f.y+f.F.h*2.4));c.lineTo(f.x+70,-(f.y+f.F.h*.5));c.fill();c.restore()}
 if(f.sp.type==='tsunami'&&f.spS.wx!=null){const x=f.spS.wx,d=f.dir;c.save();c.translate(x,0);c.scale(d,1);const TC=f.sp.col||'#4aa3ff',g=c.createLinearGradient(-260,0,60,0);g.addColorStop(0,TC+'00');g.addColorStop(.6,TC+'cc');g.addColorStop(1,f.sp.col?'#fff8e0':'#e6f7ff');c.fillStyle=g;c.beginPath();c.moveTo(-300,0);c.quadraticCurveTo(-120,-60,-20,-230-Math.sin(T*20)*15);c.quadraticCurveTo(70,-250,90,-170);c.quadraticCurveTo(40,-200,30,-120);c.quadraticCurveTo(40,-40,80,0);c.closePath();c.fill();c.strokeStyle='#fff';c.lineWidth=8;c.stroke();c.restore()}
 if(f.sp.type==='flush'&&t<.6){c.save();c.translate(f.x,-10);c.scale(1,.28);for(let i=0;i<3;i++){c.strokeStyle=['#9fe6ff','#4aa3ff','#fff'][i];c.lineWidth=14;c.globalAlpha=.7;c.beginPath();c.arc(0,0,140+i*70,T*8+i,T*8+i+4);c.stroke()}c.restore()}
 if(f.sp.type==='beam'&&t>.25&&t<1.05){const x0=f.x+f.dir*40,len=1500*f.dir,h=f.sp.w||150,BC=f.sp.col||'#ff3df2';const g=c.createLinearGradient(0,-h,0,0);g.addColorStop(0,BC+'00');g.addColorStop(.3,BC);g.addColorStop(.5,'#fff');g.addColorStop(.7,BC);g.addColorStop(1,BC+'00');c.fillStyle=g;c.globalAlpha=.85+.15*Math.sin(T*60);c.fillRect(Math.min(x0,x0+len),-h-rand(0,10),Math.abs(len),h+10);c.globalAlpha=1}
 if(f.sp.type==='aura'&&t<.9){c.save();c.translate(f.x,-(f.y+f.F.h*.55));c.rotate(T*8);for(let i=0;i<12;i++){c.rotate(Math.PI/6);c.fillStyle=f.sp.col?(i%2?f.sp.col+'66':'#ffffff33'):(i%2?'#ff3df255':'#2ec5ff55');c.beginPath();c.moveTo(0,0);c.lineTo(-24,-240);c.lineTo(24,-240);c.fill()}c.restore()}}
function drawHud(c){c.setTransform(DPR,0,0,DPR,0,0);const top=8,bw=Math.min(W*.36,430),p=G.p1,q=G.p2;
 [p,q].forEach((f,i)=>{const px=i?W-36:36,py=top+30;c.save();c.beginPath();c.arc(px,py,27,0,7);c.fillStyle='#2a0a52';c.fill();c.clip();const img=SPR[f.id]&&SPR[f.id].idle,m=META[f.id].idle;const ph=m.h*.5,pw=ph;c.translate(px,py);if(i)c.scale(-1,1);if(img)c.drawImage(img,m.ax-pw/2,0,pw,ph,-30,-26,60,60);c.restore();c.lineWidth=4;c.strokeStyle='#000';c.beginPath();c.arc(px,py,27,0,7);c.stroke();
  const x=i?W-70-bw:70,y=top+10,h=20,fr=clamp(f.hp/f.max,0,1),gr=clamp(f.ghost/f.max,0,1);c.fillStyle='#000';c.beginPath();c.roundRect(x-3,y-3,bw+6,h+6,9);c.fill();c.fillStyle='#fff';c.fillRect(i?x+bw*(1-gr):x,y,bw*gr,h);const g=c.createLinearGradient(0,y,0,y+h);g.addColorStop(0,fr<.25?'#ff6a6a':i?'#ff6af2':'#7dff9a');g.addColorStop(1,fr<.25?'#c40000':i?'#a3009c':'#18a83a');c.fillStyle=g;c.fillRect(i?x+bw*(1-fr):x,y,bw*fr,h);c.fillStyle='#fff3';c.fillRect(x,y,bw,5);
  c.font='900 12px system-ui,sans-serif';c.textBaseline='top';c.textAlign=i?'right':'left';c.fillStyle='#fff';c.lineWidth=3;c.strokeStyle='#000';const nm=f.donor?fname(f.id,f.donor):f.F.name;c.strokeText(nm,i?x+bw:x,y+h+5);c.fillText(nm,i?x+bw:x,y+h+5);
  for(let k=0;k<2;k++){const cx=i?x+bw-110-k*18:x+110+k*18;c.beginPath();c.arc(i?x+bw-k*16-8:x+k*16+8,y+h+34,6,0,7);c.fillStyle=G.wins[i]>k?'#ffd23d':'#0008';c.fill();c.lineWidth=2;c.stroke()}
  const mw=bw*.62,mx=i?x+bw-mw:x,my=y+h+22;c.fillStyle='#000';c.fillRect(mx-2,my-2,mw+4,9);const mf=f.meter/100;c.fillStyle=mf>=1?`hsl(${G.time*400%360},100%,60%)`:'#ff3df2';c.fillRect(i?mx+mw*(1-mf):mx,my,mw*mf,5);if(mf>=1&&Math.sin(G.time*12)>0){c.font='900 10px system-ui';c.fillStyle='#fff';c.textAlign=i?'right':'left';c.fillText('SPECIAL READY'+(i?'':' (U)'),i?mx+mw:mx,my+8)}
  if(f.combo>=2&&G.time-f.comboT<1.1){const age=G.time-f.comboT,s=1+Math.max(0,.4-age*3);c.save();c.translate(i?W*.8:W*.2,H*(H>W?.2:.3));c.scale(s,s);c.rotate(i?.06:-.06);txt(c,f.combo+' HITS',0,0,fitSize(c,'00 HITS',44,W*.35),f.combo>=8?`hsl(${G.time*500%360},100%,62%)`:'#ffd23d');txt(c,'COMBO',0,30,16,'#fff');c.restore()}});
 c.fillStyle='#000a';c.beginPath();c.roundRect(W/2-30,top,60,44,10);c.fill();txt(c,Math.ceil(G.timer)+'',W/2,top+23,30,G.timer<10&&Math.sin(G.time*10)>0?'#ff3d3d':'#fff',{lw:5});if(G.kind!=='ladder')txt(c,G.kind==='trial'?'FREE TRIAL':'STREAK '+S.gStreak,W/2,top+58,13,G.kind==='trial'?'#ffd23d':'#b6ff2e',{lw:4});
 if(G.freeze>0&&G.superF){const f=G.superF,k=1-G.freeze/.65,L=f.side===0;c.fillStyle=`rgba(0,0,0,${.55})`;c.fillRect(0,0,W,H);c.save();c.translate(W/2,H*.42);c.rotate(-.12);c.fillStyle=f.F.col;c.fillRect(-W,-H*.13,W*2,H*.26);c.fillStyle='#000';c.fillRect(-W,-H*.13,W*2,6);c.fillRect(-W,H*.13-6,W*2,6);c.restore();
  const img=SPR[f.id].attack,m=META[f.id].attack,ih=H*.42,iw=ih*m.w/m.h,sl=easeOutBack(Math.min(1,k*3));c.save();c.translate(L?lerp(-iw,W*.04,sl):lerp(W+iw,W*.96,sl),H*.63);if(!L)c.scale(-1,1);c.drawImage(img,0,-ih,iw,ih);c.restore();
  txt(c,f.sp.name,W/2+(L?W*.12:-W*.12),H*.42,fitSize(c,f.sp.name,54,W*.6),'#fff',{lw:9})}
 drawTexts(c,true);if(J.flash>0){c.globalAlpha=Math.min(1,J.flash);c.fillStyle=J.flashCol;c.fillRect(0,0,W,H);c.globalAlpha=1}}
function render(){const c=X;camera();const {s,cx,fy}=VIEW,tr=J.trauma*J.trauma,shx=(Math.random()*2-1)*tr*24,shy=(Math.random()*2-1)*tr*24;
 c.setTransform(DPR,0,0,DPR,shx*DPR,shy*DPR);drawBG(c);
 c.setTransform(DPR*s,0,0,DPR*s,DPR*(W/2-cx*s+shx),DPR*(fy+shy));
 c.fillStyle='#ff3df233';c.fillRect(WL-60,-650,8,650);c.fillRect(WR+52,-650,8,650);
 const order=[G.p2,G.p1];if(G.p1.st==='attack'||G.p1.st==='special')order.reverse();
 for(const f of order)drawSpecialFX(c,f);for(const f of order)drawFighter(c,f);for(const p of G.projs)drawProj(c,p);drawParts(c);drawTexts(c,false);drawBubbles(c,1/60);
 drawHud(c)}

// ---------- SHARE CARD ----------
function makeCard(){const cv2=document.createElement('canvas');cv2.width=1080;cv2.height=1350;const c=cv2.getContext('2d'),id=owned(S.pick)?S.pick:'shark';
 if(BG){const k=1350/900;c.drawImage(BG,(1080-1600*k)/2,0,1600*k,1350)}const g=c.createLinearGradient(0,0,0,1350);g.addColorStop(0,'#14002bcc');g.addColorStop(.5,'#14002b33');g.addColorStop(1,'#14002bee');c.fillStyle=g;c.fillRect(0,0,1080,1350);
 c.textAlign='center';c.lineJoin='round';const out=(t,x,y,fill,s,lw=14)=>{c.font=FONT(s);c.lineWidth=lw;c.strokeStyle='#14002b';c.strokeText(t,x,y);c.fillStyle=fill;c.fillText(t,x,y)};
 out('BRAINROT',540,130,'#ff3df2',120);out('BATTLE',540,235,'#b6ff2e',100);
 const img=SPR[id]&&SPR[id].attack,m=META[id]&&META[id].attack;if(img){const ih=700,iw=ih*m.w/m.h;c.drawImage(img,540-iw/2,1000-ih,iw,ih)}
 const nm=fname(id,S.donor);let fs=80;c.font=FONT(fs);while(c.measureText(nm).width>980)fs-=4;out(nm,540,1080,'#ffd23d',fs,16);
 out(S.rung>LAST?'CLEARED THE LADDER':`LADDER ${S.rung}/${LADDER.length} | BEST COMBO ${S.bestCombo}`,540,1160,'#fff',44,10);
 c.font='bold 34px system-ui,sans-serif';c.fillStyle='#b6ff2e';c.fillText('Fight me: '+SITE_URL.replace('https://',''),540,1300);return cv2}
const shareText=()=>`I'm brawling as ${fname(S.pick,S.donor)} in Brainrot Battle${S.bestCombo?` (best combo: ${S.bestCombo} hits)`:''}. Beat that: ${SITE_URL}`;
let lastCard=null;
async function shareCard(){audio();SFX.click();await ensureFighter(owned(S.pick)?S.pick:'shark').catch(()=>{});const cv2=makeCard(),url=cv2.toDataURL('image/png');lastCard=url;const t=shareText();
 try{const blob=await new Promise(r=>cv2.toBlob(r,'image/png'));const file=new File([blob],'brainrot-battle.png',{type:'image/png'});if(!DEBUG&&navigator.canShare&&navigator.canShare({files:[file]})){await navigator.share({files:[file],title:'Brainrot Battle',text:t});return}}catch(e){if(e&&e.name==='AbortError')return}
 modal(`<h1>SHARE IT</h1><img id="shareImg" src="${url}" alt="card" style="width:100%;max-width:280px;border-radius:14px;border:3px solid #000"><p style="font-size:13px">${t}</p><div class="row"><a class="btn" download="brainrot-battle.png" href="${url}" style="text-decoration:none">DOWNLOAD</a><button class="btn blue" id="cpTxt">COPY TEXT</button></div><div class="row"><button class="btn grey" onclick="closeModal()">CLOSE</button></div>`);
 $('#cpTxt').onclick=()=>{(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(()=>toast('Copied!'),()=>toast('Copy failed'))}}

// ---------- LOOP / BOOT ----------
let last=nowS();
function loop(){const n=nowS(),rdt=Math.min(.05,n-last);last=n;try{if(G&&assetsReady){updateGame(rdt);if(G)render()}}catch(err){console.error(err)}requestAnimationFrame(loop)}
if(isTouch)$('#keysHelp').innerHTML='Left side: drag to move, flick UP to jump, double-flick to dash.<br>Right: PUNCH (x3 combo), HEAVY (hold to charge, launches), BLOCK (tap right before a hit = PARRY), SPECIAL.<br>Juggle them, spike them, bounce them off walls.';
document.addEventListener('visibilitychange',()=>{if(document.hidden){for(const k in KEYS)KEYS[k]=0}});
loadAssets().then(()=>{renderHome();requestAnimationFrame(loop)}).catch(e=>{console.error(e);toast('Failed to load art, check connection',5000)});
renderHome();

if(DEBUG){window.__test={get G(){return G},get S(){return S},get lastCard(){return lastCard},get ready(){return assetsReady},autoBuy:false,startMatch,
 setHp:(i,v)=>{const f=i?G.p2:G.p1;f.hp=f.ghost=v},aiOff:v=>{G.aiOff=v},fillMeter:i=>{(i?G.p2:G.p1).meter=100},
 koP2:()=>{const p=G.p1,q=G.p2;q.hp=1;resolveHit(p,q,{dmg:999,kx:600,ky:900,launch:1,hs:.5,hstop:.1,shake:.5,sfx:'heavy',fromX:p.x})},
 koP1:()=>{const p=G.p1,q=G.p2;p.hp=1;p.inv=0;p.st='idle';resolveHit(q,p,{dmg:999,kx:600,ky:900,launch:1,hs:.5,hstop:.1,shake:.5,sfx:'heavy',fromX:q.x,unblockable:1})},
 skipKO:()=>{if(G.phase==='ko')G.koT=9},place:(x1,x2)=>{G.p1.x=x1;G.p2.x=x2},makeCard:()=>makeCard().toDataURL().length,
 unlockAll:()=>{IDS.forEach(id=>{if(!S.unlocked.includes(id))S.unlocked.push(id)});save()},setPick:id=>{S.pick=id;S.donor=null;save()},ensureFighter,isLoaded,CATALOG,PAYMENTS,purchase,openShop,buyFlow,receipts,IDS,PREM_IDS,LADDER,special:()=>{PEND.specE=1}}}
