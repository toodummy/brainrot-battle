'use strict';
const SITE_URL='https://brainrot-battle-eight.vercel.app';
const DEBUG=/[?&]debug\b/.test(location.search);
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const rand=(a,b)=>a+Math.random()*(b-a),pick=a=>a[Math.floor(Math.random()*a.length)],clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),lerp=(a,b,t)=>a+(b-a)*t,sgn=v=>v<0?-1:1;
const easeOutBack=t=>{const c=2.2;return 1+(c+1)*Math.pow(t-1,3)+c*Math.pow(t-1,2)};
const nowS=()=>performance.now()/1000;

// ---------- FIGHTERS (original characters) ----------
const FIGHTERS={
 shark:{name:'Sharkopher',title:'Rushdown menace',pre:'Shark',suf:'opher',h:300,hp:1000,spd:430,pow:1.05,wt:1,jump:1250,col:'#4aa3ff',ai:'aggro',sp:{name:'SNEAKER TORNADO',type:'rush'},lines:['no brain just bite','fin-ished','ez snack']},
 cup:{name:'Buff Cappuccino',title:'Caffeinated bruiser',pre:'Cappu',suf:'ccino',h:300,hp:1100,spd:370,pow:1.15,wt:1.15,jump:1150,col:'#d79a5a',ai:'brawler',sp:{name:'ESPRESSO ERUPTION',type:'quake'},lines:['decaf? DEcaf?!','brewed different','100% rage roast']},
 duck:{name:'CEO Duck',title:'Corporate zoner',pre:'Quack',suf:'quarters',h:290,hp:950,spd:390,pow:.95,wt:.95,jump:1200,col:'#ffd23d',ai:'zoner',proj:'case',sp:{name:'HOSTILE TAKEOVER',type:'volley',proj:'case'},lines:["you're fired",'synergy!','let us circle back']},
 toaster:{name:'Toaster Bro',title:'Carb artillery',pre:'Toast',suf:'inator',h:290,hp:1050,spd:360,pow:1,wt:1.1,jump:1120,col:'#d9dde6',ai:'zoner',proj:'toast',sp:{name:'TOAST BARRAGE',type:'volley',proj:'toast'},lines:['you just got toasted','carb loaded','crumb and get it']},
 cactus:{name:'Disco Cactus',title:'Spiky counter-puncher',pre:'Cact',suf:'isco',h:310,hp:1000,spd:390,pow:1,wt:1,jump:1200,col:'#3fcf5a',ai:'turtle',sp:{name:'NEEDLE DISCO',type:'aura'},lines:['stay prickly','disco never died','5, 6, 7, STAB']},
 banana:{name:'Banana Bandit',title:'Slippery speedster',pre:'Bana',suf:'ndit',h:300,hp:900,spd:500,pow:.95,wt:.85,jump:1300,col:'#ffe03d',ai:'aggro',sp:{name:'PEEL OUT',type:'teleport'},lines:['split happens','your wallet? mine','a-peeling, right?']},
 broc:{name:'Broccoli Beefcake',title:'Leafy tank',pre:'Brocco',suf:'beef',h:320,hp:1200,spd:340,pow:1.2,wt:1.3,jump:1050,col:'#6ae04a',ai:'turtle',sp:{name:'VITAMIN HAYMAKER',type:'haymaker'},lines:['eat your greens','never skip leg day','fiber of my being']},
 boss:{name:'The Omega Brainrot',title:'Final boss',pre:'Brain',suf:'rot',h:380,hp:1500,spd:370,pow:1.25,wt:1.6,jump:1080,col:'#c13bff',ai:'boss',proj:'orb',sp:{name:'BRAIN BLAST',type:'beam'},lines:['I AM THE FEED','scroll forever','your attention is mine'],boss:1},
};
const IDS=Object.keys(FIGHTERS);IDS.forEach(k=>FIGHTERS[k].id=k);
const START=['shark','cup','duck'];
const LADDER=['banana','duck','cactus','toaster','cup','broc','shark','boss'];
const DIFF=[.12,.24,.34,.44,.54,.64,.76,.9];
const RUNG_TAG=['Warm-up','Middle management','Prickly','Carb loaded','Pre-workout','Leg day','Apex snack','FINAL BOSS'];

// ---------- ASSETS ----------
const SPR={},META={},SIL={};let BG=null,assetsReady=false;
function loadImg(src){return new Promise((res,rej)=>{const i=new Image();i.onload=()=>res(i);i.onerror=()=>rej(new Error('load '+src));i.src=src})}
function silhouette(img,col){const k=.5,c=document.createElement('canvas');c.width=Math.ceil(img.width*k);c.height=Math.ceil(img.height*k);const x=c.getContext('2d');x.drawImage(img,0,0,c.width,c.height);x.globalCompositeOperation='source-in';x.fillStyle=col;x.fillRect(0,0,c.width,c.height);return c}
async function loadAssets(){const m=await fetch('assets/sprites.json').then(r=>r.json());Object.assign(META,m);const jobs=[];
 for(const id of IDS){SPR[id]={};SIL[id]={};for(const p of['idle','attack','hurt'])jobs.push(loadImg(`assets/${id}_${p}.webp`).then(i=>{SPR[id][p]=i;SIL[id][p]={w:silhouette(i,'#fff'),r:silhouette(i,'#ff2040')}}))}
 jobs.push(loadImg('assets/arena.webp').then(i=>BG=i));await Promise.all(jobs);assetsReady=true}
const imgSrc=(id,p='idle')=>`assets/${id}_${p}.webp`;

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
function freshSave(){return{v:1,coins:50,unlocked:[...START],rung:0,pick:'shark',donor:null,fusions:[],bestCombo:0,wins:0,muted:false,prem:false}}
let S=(()=>{try{const d=JSON.parse(localStorage.getItem(SAVE_KEY));if(d&&d.v===1)return Object.assign(freshSave(),d)}catch(e){}return freshSave()})();
function save(){try{localStorage.setItem(SAVE_KEY,JSON.stringify(S))}catch(e){}}

// ---------- STUBS ----------
// Replace with CrazyGames/Poki rewarded ad. onDone only fires if the ad completed.
function showAd(onDone){const o=$('#adOverlay');let n=DEBUG?1:3;o.style.display='flex';$('#adCount').textContent=n;const iv=setInterval(()=>{n--;$('#adCount').textContent=n;if(n<=0){clearInterval(iv);o.style.display='none';onDone&&onDone()}},DEBUG?120:1000)}
// Replace with Stripe / store. cb(true) on success.
function purchase(sku,cb){if(DEBUG&&window.__test&&__test.autoBuy){cb(true);return}modal(`<h1>STORE SOON</h1><p>Payments for <b>${sku}</b> are not connected yet. This is a placeholder.</p><div class="row"><button class="btn" onclick="closeModal()">OK</button></div>`);cb(false)}

// ---------- MENUS ----------
function toast(m,ms=1800){const t=$('#toast');t.textContent=m;t.style.display='block';clearTimeout(toast.h);toast.h=setTimeout(()=>t.style.display='none',ms)}
function modal(h){$('#mbox').innerHTML=h;$('#modal').style.display='flex'}
function closeModal(){$('#modal').style.display='none'}
function setCoins(){$$('.coins').forEach(e=>e.textContent=S.coins)}
function screen(id){$$('.scr').forEach(s=>s.classList.toggle('on',s.id===id));if(id==='home')renderHome();if(id==='select')renderSelect()}
const fname=(body,donor)=>donor&&donor!==body?FIGHTERS[body].pre+FIGHTERS[donor].suf:FIGHTERS[body].name;
function renderHome(){setCoins();$('#hero').innerHTML=['cup','shark','duck'].map(i=>`<img src="${imgSrc(i)}" alt="">`).join('');
 $('#ladderTxt').textContent=S.rung>=8?'CLEARED!':`rung ${S.rung+1}/8`;
 $('#ladder').innerHTML=LADDER.map((id,i)=>`<div class="rung ${i<S.rung?'done':i===Math.min(S.rung,7)?'cur':''} ${i>S.rung?'lock':''}"><div class="pic"><img src="${imgSrc(id)}" alt=""></div>${i>S.rung?'???':FIGHTERS[id].name}<br><span style="color:#d9c6ff">${RUNG_TAG[i]}</span></div>`).join('');
 $('#muteBtn').textContent=S.muted?'SOUND OFF':'SOUND ON'}
function owned(id){return S.unlocked.includes(id)||(id==='boss'&&S.prem)}
function renderSelect(){setCoins();if(!owned(S.pick))S.pick='shark';const F=FIGHTERS[S.pick],donor=S.donor&&owned(S.donor)?S.donor:null,sp=donor?FIGHTERS[donor].sp:F.sp;
 const st=(k,v,m)=>`<div class="stat"><span>${k}</span><div><i style="width:${clamp(v/m*100,8,100)}%"></i></div></div>`;
 $('#info').innerHTML=`<img src="${imgSrc(S.pick)}" alt=""><div class="t">${fname(S.pick,donor)}<small>${F.title}${donor?' + '+FIGHTERS[donor].name+' special':''}</small>${st('HP',F.hp,1500)}${st('SPEED',F.spd,500)}${st('POWER',F.pow,1.3)}${st('WEIGHT',F.wt,1.6)}<small style="color:#ff3df2">SPECIAL: ${sp.name}</small>${F.proj?'<small style="color:#ffd23d">HEAVY fires a projectile</small>':''}</div>`;
 const r=Math.min(S.rung,7),opp=LADDER[r];$('#goBtn').textContent=`FIGHT RUNG ${r+1}: VS ${FIGHTERS[opp].name.toUpperCase()}`;
 $('#grid').innerHTML=IDS.map(id=>{const o=owned(id);return`<div class="fc ${S.pick===id?'sel':''} ${o?'':'lock'}" data-id="${id}"><img src="${imgSrc(id)}" alt=""><div class="nm">${o?FIGHTERS[id].name:id==='boss'?'PREMIUM $1.99':'BEAT TO UNLOCK'}</div>${id==='boss'&&!o?'<span class="tag">PREMIUM</span>':''}</div>`}).join('');
 const cost=60;$('#fuseHint').textContent=S.unlocked.length<2?'Unlock more fighters to fuse.':`Pick a donor: your fighter keeps its body and gets the donor's special. ${cost} coins each (first one free). Tap again to remove.`;
 $('#donors').innerHTML=IDS.filter(id=>owned(id)&&id!==S.pick).map(id=>`<div class="fc ${S.donor===id?'sel':''}" data-donor="${id}"><img src="${imgSrc(S.pick)}" alt=""><div class="badge"><img src="${imgSrc(id)}" alt=""></div><div class="nm">${fname(S.pick,id)}<br><span style="color:#ff3df2;font-size:9px">${FIGHTERS[id].sp.name}</span></div></div>`).join('')}
$('#grid').addEventListener('click',e=>{const c=e.target.closest('.fc');if(!c)return;audio();SFX.click();const id=c.dataset.id;if(owned(id)){if(S.pick!==id){S.pick=id;S.donor=null}save();renderSelect()}else if(id==='boss')buyPremium();else toast('Beat '+FIGHTERS[id].name+' on the ladder to unlock')});
$('#donors').addEventListener('click',e=>{const c=e.target.closest('.fc');if(!c)return;audio();const d=c.dataset.donor,key=S.pick+'+'+d;if(S.donor===d){S.donor=null;save();renderSelect();return}
 if(!S.fusions.includes(key)){const cost=S.fusions.length?60:0;if(S.coins<cost){toast(`Need ${cost} coins. Win fights!`);return}S.coins-=cost;S.fusions.push(key);SFX.fanfare();toast('FUSED: '+fname(S.pick,d)+'!')}else SFX.click();S.donor=d;save();renderSelect()});
function buyPremium(){purchase('premium_omega_brainrot',ok=>{if(!ok)return;S.prem=true;save();renderSelect();toast('The Omega Brainrot is now playable!')})}
$('#playBtn').onclick=()=>{audio();SFX.click();screen('select')};
$('#backBtn').onclick=()=>{SFX.click();screen('home')};
$('#goBtn').onclick=()=>{audio();startMatch(Math.min(S.rung,7))};
$('#shopBtn').onclick=()=>{audio();modal(`<h1>PREMIUM FIGHTER</h1><img class="pf" src="${imgSrc('boss')}" alt=""><p>Play as <b>The Omega Brainrot</b> right now: 1500 HP, projectiles, BRAIN BLAST beam. (Also unlocks free when you clear the ladder.)</p><div class="row"><button class="btn gold" id="buyNow">${S.prem?'OWNED':'UNLOCK - $1.99'}</button><button class="btn grey" onclick="closeModal()">LATER</button></div>`);$('#buyNow').onclick=()=>{if(!S.prem)buyPremium()}};
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
 if(!a.hit.has('o')&&overlap(hb,hurtBox(d))){a.hit.add('o');resolveHit(a,d,hitInfo(a,m))}}
// ---------- PROJECTILES ----------
function spawnProj(f,o){const k=o.kind||f.F.proj||'case',c=f.chg/.85,P={case:{vx:820,vy:260,g:900,r:34,dmg:52},toast:{vx:640,vy:640,g:1500,r:30,dmg:50},orb:{vx:620,vy:0,g:0,r:46,dmg:64}}[k];
 G.projs.push({kind:k,owner:f,x:f.x+f.dir*80*f.sc,y:f.y+f.F.h*.55,vx:f.dir*(o.vx||P.vx)*(1+c*.5),vy:o.vy!=null?o.vy:P.vy,g:P.g,r:P.r*(1+c*.3),dmg:(o.dmg||P.dmg)*(1+c*.8),ky:o.ky||0,rot:0,life:0});SFX.proj()}
function updProjs(dt){for(const p of G.projs){p.life+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy-=p.g*dt;p.rot+=dt*10*sgn(p.vx);const t=p.owner===G.p1?G.p2:G.p1;
 if(p.y<p.r*.4){p.dead=1;burst(p.x,-10,10,['#fff8','#b88'],{spd:300,up:200})}
 if(p.x<0||p.x>1600||p.life>4)p.dead=1;
 if(!p.dead){const hb=hurtBox(t);if(p.x+p.r>hb.x0&&p.x-p.r<hb.x1&&p.y+p.r>hb.y0&&p.y-p.r<hb.y1){p.dead=1;resolveHit(p.owner,t,{dmg:p.dmg,kx:260,ky:p.ky,launch:p.ky>0,hs:.4,hstop:.06,shake:.2,sfx:'light',fromX:p.x-p.vx*.05})}}}
 for(const a of G.projs)for(const b of G.projs)if(a!==b&&!a.dead&&!b.dead&&a.owner!==b.owner&&Math.hypot(a.x-b.x,a.y-b.y)<a.r+b.r){a.dead=b.dead=1;burst((a.x+b.x)/2,-(a.y+b.y)/2,20,['#fff','#ff3df2'],{spd:700,k:'spark',g:0});SFX.block()}
 G.projs=G.projs.filter(p=>!p.dead)}
// ---------- SPECIALS ----------
function startSpecial(f,o){f.meter=0;f.st='special';f.t=0;f.spS={};f.mv=null;f.rot=0;G.freeze=.65;G.superF=f;f.inv=.1;SFX.super();shake(.3);J.flash=.4;J.flashCol=f.F.col;if(f.sp.type==='quake')f.vy=900}
function areaHit(f,o,key,box,h,interval){const last=f.spS['h'+key];if(last!=null&&G.time-last<interval)return false;if(!overlap(box,hurtBox(o)))return false;f.spS['h'+key]=G.time;h.fromX=h.fromX!=null?h.fromX:f.x;return resolveHit(f,o,h)}
function updSpecial(f,o,dt){const t=f.t,s=f.spS,A=f.F.pow,ty=f.sp.type;let end=1;
 if(ty==='rush'){end=.9;if(t<.62){f.vx=f.dir*1350;f.rot+=dt*30;if(areaHit(f,o,'r',fbox(f,-70,120,0,f.F.h/f.sc),{dmg:26,kx:300,ky:250,hs:.3,hstop:.04,shake:.15,sfx:'light'},.085))o.vx=f.vx*.95}else{f.vx*=.9;f.rot=0;if(!s.fin){s.fin=1;s.h0=G.time}areaHit(f,o,'rf',fbox(f,-40,190,0,300),{dmg:90,kx:500,ky:1350,launch:1,hs:.6,hstop:.18,shake:.6,sfx:'heavy',txt:'TORNADO!'},99)}}
 else if(ty==='quake'){end=1.05;if(!s.slam&&t>.12&&f.y<=0){s.slam=G.time;SFX.boom();shake(.9);ring(f.x,0,'#ffd23d',260,20)}if(s.slam)for(let i=0;i<3;i++){const gt=G.time-s.slam-i*.1;if(gt>0&&gt<.3){const gx=f.x+f.dir*(170+i*170);if(!s['g'+i]){s['g'+i]=1;burst(gx,0,26,['#6b3b1c','#c98a4a','#fff'],{ang:-Math.PI/2,spread:.4,spd:1300,size:14});SFX.heavy()}areaHit(f,o,'g'+i,{x0:gx-80,x1:gx+80,y0:0,y1:340},{dmg:80,kx:150,ky:1350,launch:1,hs:.6,hstop:.12,shake:.5,sfx:'heavy',txt:'ERUPTION!',fromX:f.x},99)}}}
 else if(ty==='volley'){end=.75;for(let i=0;i<5;i++)if(t>.04+i*.1&&!s['v'+i]){s['v'+i]=1;f.sq=-.2;spawnProj(f,{kind:f.sp.proj,vx:850+i*60,vy:i%2?420:200,dmg:44,ky:i===4?900:0})}}
 else if(ty==='aura'){end=1.15;if(t<.9){f.rot+=dt*24;o.vx+=sgn(f.x-o.x)*900*dt;if(Math.random()<.6)burst(f.x,-(f.y+f.F.h*.5),2,['#3fcf5a','#e8ffcf','#ff3df2','#ffd23d'],{spd:900,g:0,k:'spark'});areaHit(f,o,'a',{x0:f.x-230,x1:f.x+230,y0:f.y-20,y1:f.y+f.F.h*1.1},{dmg:18,kx:60,ky:0,hs:.25,hstop:.03,shake:.1,sfx:'light'},.1)}else{f.rot=0;if(!s.b){s.b=1;ring(f.x,-(f.F.h*.5),'#ff3df2',320,24);SFX.boom()}areaHit(f,o,'ab',{x0:f.x-260,x1:f.x+260,y0:0,y1:f.F.h*1.2},{dmg:80,kx:620,ky:1150,launch:1,hs:.6,hstop:.16,shake:.6,sfx:'heavy',txt:'DISCO INFERNO!'},99)}}
 else if(ty==='teleport'){end=.85;if(!s.tp&&t>.12){s.tp=1;burst(f.x,-(f.F.h*.5),24,['#fff','#ffe03d','#888'],{spd:500,g:-200,size:18,k:'circle'});const side=sgn(o.x-f.x);f.x=clamp(o.x+side*120*f.sc,WL,WR);f.dir=sgn(o.x-f.x);burst(f.x,-(f.F.h*.5),24,['#fff','#ffe03d'],{spd:500,g:-200,size:18,k:'circle'});SFX.dash()}
  if(s.tp)for(let i=0;i<3;i++)if(t>.22+i*.12)areaHit(f,o,'t'+i,fbox(f,-20,200,0,280),i<2?{dmg:42,kx:80,ky:0,hs:.4,hstop:.07,shake:.2,sfx:'light',txt:'SLASH'}:{dmg:70,kx:650,ky:800,launch:1,hs:.6,hstop:.16,shake:.5,sfx:'heavy',txt:'SLIPPED!'},99)}
 else if(ty==='haymaker'){end=.95;if(t<.4){f.armor=1;f.vx=0;if(Math.random()<.5)burst(f.x+rand(-60,60),-(rand(0,f.F.h)),1,['#b6ff2e','#fff'],{spd:200,g:-800,k:'spark'})}else if(t<.66){f.armor=0;f.vx=f.dir*1150;areaHit(f,o,'hm',fbox(f,0,200,0,280),{dmg:230,kx:1500,ky:520,launch:1,hs:.7,hstop:.26,shake:1.1,sfx:'heavy',txt:'VITAMIN K.O.!'},99)}else{f.armor=0;f.vx*=.85}}
 else if(ty==='beam'){end=1.2;if(t<.3){f.vx=0;if(Math.random()<.7)burst(f.x+f.dir*90,-120,2,['#ff3df2','#fff'],{spd:300,g:0,k:'spark'})}else if(t<1.05){shake(.06);areaHit(f,o,'bm',{x0:f.dir>0?f.x+40:f.x-1500,x1:f.dir>0?f.x+1500:f.x-40,y0:0,y1:150},{dmg:22,kx:220,ky:0,hs:.25,hstop:.03,shake:.1,sfx:'light'},.08)}}
 if(t>=end){f.st=isAir(f)?'air':'idle';f.rot=0;f.armor=0}}
// ---------- FIGHTER UPDATE ----------
function updF(f,o,dt){const c=f.ctl,F=f.F;f.t+=dt;f.inv=Math.max(0,f.inv-dt);f.flash=Math.max(0,f.flash-dt*6);f.sqv+=(-300*f.sq-15*f.sqv)*dt;f.sq+=f.sqv*dt;
 if(c.blkE)f.blkT=G.time;const ground=!isAir(f),fight=G.phase==='fight';
 if(fight&&['idle','walk','air','block'].includes(f.st)){
  if(ground)f.dir=sgn(o.x-f.x)||f.dir;
  if(c.specE&&f.meter>=100)startSpecial(f,o);
  else if(c.lightE)startMove(f,ground?'L1':'AL');
  else if(c.heavyE)startMove(f,ground?(F.proj?'HP':'H'):'AH');
  else if(ground&&c.blk){f.st='block';f.vx*=Math.exp(-14*dt)}
  else if(ground&&c.dashE){f.st='dash';f.t=0;f.vx=c.dashE*1000*(F.spd/430);f.sq=-.2;SFX.dash();burst(f.x-c.dashE*40,-10,10,['#fff8'],{spd:300,ang:Math.PI+(c.dashE>0?0:Math.PI),spread:.5,g:0,size:14,k:'circle'})}
  else if(ground&&c.jumpE){f.vy=F.jump;f.vx=(c.r-c.l)*F.spd*1.05;f.st='air';f.sq=-.3;SFX.jump();burst(f.x,-5,10,['#fff8'],{spd:250,ang:-Math.PI/2,spread:1.4,g:0,size:12,k:'circle'})}
  else if(ground){const m=c.r-c.l;f.vx=m*F.spd*(f.st==='block'?0:1);f.st=m?'walk':'idle'}
  else{f.vx=lerp(f.vx,(c.r-c.l)*F.spd,Math.min(1,dt*4));f.st='air'}
  if(f.st==='block'&&!c.blk)f.st='idle'}
 else if(!fight&&ground&&['walk','block','dash'].includes(f.st)){f.st='idle';f.vx=0}
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
  else{if(v<-400){f.sq=.28;SFX.land()}if(f.st==='air')f.st='idle';if(f.st==='attack'&&f.mv&&f.mv.air){if(f.mvN==='AH'){shake(.3);ring(f.x,0,'#fff',140,10)}f.st='idle';f.mv=null}}}}
 if(!isAir(f)&&['hitstun','blockstun','down','parried','launched','idle'].includes(f.st))f.vx*=Math.exp(-9*dt);
 if(f.x<WL||f.x>WR){const side=f.x<WL?1:-1;f.x=clamp(f.x,WL,WR);if(f.st==='launched'&&Math.abs(f.vx)>480&&!f.wallB){f.wallB=true;f.vx=side*Math.abs(f.vx)*.45;f.vy=Math.max(f.vy,700);shake(.5);hitstop(.08);SFX.wall();f.hp=Math.max(f.ko?0:1,f.hp-20);popText(f.x+side*60,-(f.y+f.F.h*.7),'WALL BOUNCE!','#ff3df2',34,{vy:-60});burst(f.x-side*40,-(f.y+f.F.h*.5),24,['#fff','#ff3df2','#ffd23d'],{spd:700,ang:side>0?0:Math.PI,spread:1.2,k:'star'})}else f.vx=0}
 f.ghost=f.ghost>f.hp?Math.max(f.hp,f.ghost-f.max*dt*.5):f.hp}
function pushApart(a,b){if(isAir(a)&&isAir(b))return;const min=48*(a.sc+b.sc),dx=b.x-a.x;if(Math.abs(dx)<min&&Math.abs(a.y-b.y)<150){const p=(min-Math.abs(dx))/2,s=sgn(dx)||1;a.x=clamp(a.x-s*p,WL,WR);b.x=clamp(b.x+s*p,WL,WR)}}
function poseOf(f){if(['hitstun','launched','down','parried'].includes(f.st)||f.ko)return'hurt';if(f.st==='attack'&&f.mv&&!f.charging&&f.mvT>=f.mv.st*.6&&f.mvT<f.mv.st+f.mv.ac+f.mv.rc*.6)return'attack';if(f.st==='special'&&f.t>.1)return'attack';return'idle'}
// ---------- AI ----------
const PERS={aggro:{dist:130,atk:.85,blk:.25,parry:.12,jump:.2,dash:.4,proj:0,heavy:.25},brawler:{dist:150,atk:.7,blk:.4,parry:.15,jump:.12,dash:.2,proj:0,heavy:.45},zoner:{dist:540,atk:.5,blk:.45,parry:.15,jump:.15,dash:.3,proj:.8,heavy:.25},turtle:{dist:210,atk:.45,blk:.8,parry:.4,jump:.05,dash:.1,proj:0,heavy:.55},boss:{dist:220,atk:.75,blk:.55,parry:.3,jump:.12,dash:.3,proj:.55,heavy:.5}};
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
 if(f.meter>=100&&Math.random()<.35+.5*d&&(dist<360||['volley','beam','teleport'].includes(f.sp.type))){c.specE=1;return}
 if(o.st==='parried'&&dist<280){hold(.05);return}
 if(isAir(o)&&o.y>100&&dist<230&&Math.random()<.25+.5*d){hold(.05);return}
 if(f.F.proj&&P.proj&&dist>330&&Math.random()<P.proj){hold(rand(.05,.55)*d);return}
 if(dist>P.dist+60){if(Math.random()<P.dash*d&&!isAir(f))c.dashE=to;else{A.moveDir=to;A.moveUntil=T+rand(.2,.5)}if(Math.random()<P.jump*.4)c.jumpE=1;return}
 if(P.dist>300&&dist<P.dist-170){if(Math.random()<.45)c.dashE=-to;else{A.moveDir=-to;A.moveUntil=T+.35}if(Math.random()<.2)c.jumpE=1;return}
 if(dist<240){if(Math.random()<P.atk*(.55+.45*d)){if(Math.random()<P.heavy)hold(rand(.1,.6));else c.lightE=1}else if(Math.random()<.4){A.moveDir=-to;A.moveUntil=T+.22}else if(Math.random()<P.blk*.5){c.blkE=1;A.blkUntil=T+.4}return}
 A.moveDir=to;A.moveUntil=T+.2}
// ---------- MATCH FLOW ----------
const isTouch=matchMedia('(pointer: coarse)').matches||/[?&]touch\b/.test(location.search);
function startMatch(rung,cont){audio();closeModal();$('#modal').dataset.lock='';$$('.scr').forEach(s=>s.classList.remove('on'));
 G={rung,diff:DIFF[rung],round:cont?3:1,wins:cont?[1,1]:[0,0],time:0,cam:{x:800,w:1100},projs:[],freeze:0,mode:'fight',stats:{best:0,flawless:false},aiOff:false};
 startRound();musicStart();$('#pad').classList.toggle('on',isTouch);$('#pauseBtn').style.display='block'}
function startRound(){const d=S.donor&&owned(S.donor)&&S.donor!==S.pick?S.donor:null;G.p1=mkFighter(S.pick,d,0,580);G.p2=mkFighter(LADDER[G.rung],null,1,1020);
 if(G.p2.F.boss&&G.rung===7){G.p2.hp=G.p2.max=Math.round(G.p2.F.hp*1)}G.timer=60;G.phase='intro';G.pt=0;G.s1=G.s2=0;G.projs=[];G.freeze=0;G.superF=null;J.parts=[];J.texts=[];J.slow=1;J.slowT=0;clearEdges(PEND)}
function roundKO(a,d){if(G.phase!=='fight')return;d.ko=true;G.phase='ko';G.koT=0;G.winner=a.side;G.wins[a.side]++;d.st='launched';d.mv=null;d.vy=Math.max(d.vy,950);d.vx=sgn(d.x-a.x)*750;d.wallB=false;d.bounced=false;
 slowmo(.22,1.3);hitstop(.28);shake(1.3);J.flash=.9;J.flashCol='#fff';SFX.boom();popText(W/2,H*.36,'K.O.!',a.side?'#ff3d3d':'#b6ff2e',fitSize(X,'K.O.!',130,W*.8),{hud:1,life:2.2,vy:0,rot:-.06});say('K. O.');
 burst(d.x,-(d.y+d.F.h*.5),50,['#ffd23d'],{k:'coin',spd:900,up:600,size:12});burst(d.x,-(d.y+d.F.h*.5),60,['#ff3df2','#b6ff2e','#2ec5ff','#fff'],{spd:1200,up:300,k:'star'});
 if(a.side===0){G.stats.best=Math.max(G.stats.best,a.maxCombo);if(a.taken===0){G.stats.flawless=true;setTimeout(()=>G&&popText(W/2,H*.5,'FLAWLESS!','#ffd23d',48,{hud:1,life:1.6,vy:0}),500)}}
 const line=pick(a.F.lines);setTimeout(()=>{if(G&&G.phase==='ko')popText(a.x,-(a.y+a.F.h+60),'"'+line+'"','#fff',30,{life:1.6,vy:-20})},900)}
function timeUp(){G.phase='ko';G.koT=0;const p=G.p1,q=G.p2,w=p.hp/p.max>=q.hp/q.max?0:1;G.wins[w]++;G.winner=w;popText(W/2,H*.36,'TIME!','#ffd23d',110,{hud:1,life:2,vy:0});SFX.bell();if(w===0)G.stats.best=Math.max(G.stats.best,p.maxCombo)}
function nextRound(){if(G.wins[0]>=2||G.wins[1]>=2)endMatch();else{G.round++;startRound()}}
function endMatch(){G.mode='result';G.phase='end';musicStop();$('#pad').classList.remove('on');$('#pauseBtn').style.display='none';const won=G.wins[0]>=2,r=G.rung,opp=LADDER[r];$('#modal').dataset.lock='1';
 if(won){const coins=40+r*15+(G.stats.flawless?30:0);S.coins+=coins;S.wins++;if(S.rung<=r)S.rung=r+1;let un=null;if(!S.unlocked.includes(opp)){S.unlocked.push(opp);un=opp}S.bestCombo=Math.max(S.bestCombo,G.stats.best);save();SFX.fanfare();
  modal(`<h1>${r===7?'LADDER CLEARED!':'VICTORY!'}</h1><p>${G.wins[0]} - ${G.wins[1]} vs ${FIGHTERS[opp].name}${G.stats.flawless?' | FLAWLESS +30':''}<br>Best combo: ${G.stats.best} hits</p><p style="font-size:22px;color:#ffd23d">+<span id="wonCoins">${coins}</span> COINS</p>${un?`<p style="color:#b6ff2e">NEW FIGHTER UNLOCKED!</p><img class="pf" src="${imgSrc(un)}" alt=""><p>${FIGHTERS[un].name}</p>`:''}
  <div class="row">${r<7?'<button class="btn big" id="nextBtn">NEXT FIGHT</button>':''}</div><div class="row"><button class="btn gold" id="x2Btn">x2 COINS (AD)</button><button class="btn blue" id="shareBtn">SHARE</button><button class="btn grey" id="menuBtn">MENU</button></div>`);
  if($('#nextBtn'))$('#nextBtn').onclick=()=>startMatch(r+1);
  $('#x2Btn').onclick=()=>showAd(()=>{S.coins+=coins;save();setCoins();$('#wonCoins').textContent=coins*2;$('#x2Btn').disabled=true;SFX.coin();toast('Coins doubled!')});
  $('#shareBtn').onclick=()=>{quit();screen('home');shareCard()}}
 else{const c=5+r*2;S.coins+=c;save();SFX.womp();
  modal(`<h1>BRAINROTTED</h1><img class="pf" src="${imgSrc(opp,'attack')}" alt=""><p>${FIGHTERS[opp].name} wins ${G.wins[1]} - ${G.wins[0]}. "${pick(FIGHTERS[opp].lines)}"</p><p style="color:#b6ff2e">TIP: ${pick(TIPS)}</p><p>+${c} pity coins</p><div class="row"><button class="btn gold" id="contBtn">CONTINUE (AD) - start at 1-1</button></div><div class="row"><button class="btn pink" id="retryBtn">RETRY (R)</button><button class="btn grey" id="menuBtn">MENU</button></div>`);
  $('#contBtn').onclick=()=>showAd(()=>startMatch(r,true));$('#retryBtn').onclick=()=>startMatch(r)}
 $('#menuBtn').onclick=()=>{quit();screen('select')}}
const TIPS=['Tap BLOCK right before a hit lands to PARRY: they get stunned, you get a free combo.','PUNCH x3 then HEAVY while they are in the air = juggle.','Hold HEAVY to charge. Full charge launches them sky high.','In the air, HEAVY is a meteor spike. Spike them into a ground bounce.','Knock them into the wall for a WALL BOUNCE and keep juggling.','Double-tap a direction to dash in (or out).','Special meter fills when you hit AND when you get hit. Use it!'];
function quit(){G=null;musicStop();closeModal();$('#modal').dataset.lock='';$('#pad').classList.remove('on');$('#pauseBtn').style.display='none';X.setTransform(1,0,0,1,0,0);X.clearRect(0,0,cv.width,cv.height)}
$('#pauseBtn').onclick=()=>{if(!G)return;quit();screen('select')};

// ---------- INPUT ----------
const KEYS={},PEND=newCtl(),TOUCH={l:0,r:0,blk:0,hvy:0};let lastTap={d:0,t:0};
const EDGES=['jumpE','lightE','heavyE','specE','dashE','blkE'];
function clearEdges(c){EDGES.forEach(e=>c[e]=0)}
function tapDir(d){const t=nowS();if(lastTap.d===d&&t-lastTap.t<.26){PEND.dashE=d;lastTap.t=0}else lastTap={d,t}}
addEventListener('keydown',e=>{const k=e.key.toLowerCase();if(G&&G.mode==='fight'&&[' ','arrowup','arrowdown','arrowleft','arrowright'].includes(k))e.preventDefault();if(e.repeat)return;audio();
 if(G&&G.mode==='result'&&k==='r'&&$('#retryBtn')){$('#retryBtn').click();return}
 if(k==='a'||k==='arrowleft'){KEYS.l=1;tapDir(-1)}else if(k==='d'||k==='arrowright'){KEYS.r=1;tapDir(1)}
 else if(k==='w'||k==='arrowup'||k===' ')PEND.jumpE=1;else if(k==='j'||k==='z')PEND.lightE=1;else if(k==='k'||k==='x'){PEND.heavyE=1;KEYS.hvy=1}else if(k==='l'||k==='c'){PEND.blkE=1;KEYS.blk=1}else if(k==='u'||k==='v'||k==='i')PEND.specE=1;
 else if(k==='escape'&&G&&G.mode==='fight'){quit();screen('select')}});
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
function drawSprite(c,f,pose,x,y,dir,rot,sx,sy,alpha,sil){const img=sil?SIL[f.id][pose][sil]:SPR[f.id][pose],m=META[f.id][pose],k=f.F.h/META[f.id].idle.h;
 c.save();c.globalAlpha=alpha;if(f.st==='down'&&!sil){c.translate(x+dir*f.F.h*.42,-(y+26));c.rotate(-dir*1.42)}else{c.translate(x,-(y+f.F.h*.5));c.rotate(rot);c.translate(0,f.F.h*.5)}c.scale(dir*k*sx,k*sy);c.drawImage(img,-m.ax,-m.ay,m.w,m.h);c.restore()}
function drawFighter(c,f){const pose=poseOf(f),T=G.time;
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
function drawProj(c,p){c.save();c.translate(p.x,-p.y);c.rotate(p.rot*.3);const r=p.r;
 if(p.kind==='case'){c.fillStyle='#6b3b1c';c.strokeStyle='#1a0629';c.lineWidth=5;c.beginPath();c.roundRect(-r,-r*.7,r*2,r*1.4,8);c.fill();c.stroke();c.fillStyle='#ffcc00';c.fillRect(-6,-r*.25,12,10);c.beginPath();c.arc(0,-r*.7,r*.35,Math.PI,0);c.stroke()}
 else if(p.kind==='toast'){c.fillStyle='#e8b062';c.strokeStyle='#8a4a14';c.lineWidth=7;c.beginPath();c.roundRect(-r,-r,r*2,r*2,r*.5);c.fill();c.stroke();c.fillStyle='#f8d79a';c.fillRect(-r*.6,-r*.6,r*1.2,r*1.2)}
 else{const g=c.createRadialGradient(0,0,4,0,0,r*1.4);g.addColorStop(0,'#fff');g.addColorStop(.4,'#ff3df2');g.addColorStop(1,'transparent');c.fillStyle=g;c.beginPath();c.arc(0,0,r*1.4,0,7);c.fill()}
 c.restore();if(Math.random()<.5)burst(p.x,-p.y,1,[p.kind==='orb'?'#ff3df2':'#fff8'],{spd:60,g:0,k:'circle',size:6,life:.5})}
function drawSpecialFX(c,f){if(f.st!=='special')return;const t=f.t,T=G.time;
 if(f.sp.type==='beam'&&t>.25&&t<1.05){const x0=f.x+f.dir*40,len=1500*f.dir,h=150;const g=c.createLinearGradient(0,-h,0,0);g.addColorStop(0,'#ff3df200');g.addColorStop(.3,'#ff3df2');g.addColorStop(.5,'#fff');g.addColorStop(.7,'#ff3df2');g.addColorStop(1,'#ff3df200');c.fillStyle=g;c.globalAlpha=.85+.15*Math.sin(T*60);c.fillRect(Math.min(x0,x0+len),-h-rand(0,10),Math.abs(len),h+10);c.globalAlpha=1}
 if(f.sp.type==='aura'&&t<.9){c.save();c.translate(f.x,-(f.y+f.F.h*.55));c.rotate(T*8);for(let i=0;i<12;i++){c.rotate(Math.PI/6);c.fillStyle=i%2?'#ff3df255':'#2ec5ff55';c.beginPath();c.moveTo(0,0);c.lineTo(-24,-240);c.lineTo(24,-240);c.fill()}c.restore()}}
function drawHud(c){c.setTransform(DPR,0,0,DPR,0,0);const top=8,bw=Math.min(W*.36,430),p=G.p1,q=G.p2;
 [p,q].forEach((f,i)=>{const px=i?W-36:36,py=top+30;c.save();c.beginPath();c.arc(px,py,27,0,7);c.fillStyle='#2a0a52';c.fill();c.clip();const img=SPR[f.id].idle,m=META[f.id].idle;const ph=m.h*.5,pw=ph;c.translate(px,py);if(i)c.scale(-1,1);c.drawImage(img,m.ax-pw/2,0,pw,ph,-30,-26,60,60);c.restore();c.lineWidth=4;c.strokeStyle='#000';c.beginPath();c.arc(px,py,27,0,7);c.stroke();
  const x=i?W-70-bw:70,y=top+10,h=20,fr=clamp(f.hp/f.max,0,1),gr=clamp(f.ghost/f.max,0,1);c.fillStyle='#000';c.beginPath();c.roundRect(x-3,y-3,bw+6,h+6,9);c.fill();c.fillStyle='#fff';c.fillRect(i?x+bw*(1-gr):x,y,bw*gr,h);const g=c.createLinearGradient(0,y,0,y+h);g.addColorStop(0,fr<.25?'#ff6a6a':i?'#ff6af2':'#7dff9a');g.addColorStop(1,fr<.25?'#c40000':i?'#a3009c':'#18a83a');c.fillStyle=g;c.fillRect(i?x+bw*(1-fr):x,y,bw*fr,h);c.fillStyle='#fff3';c.fillRect(x,y,bw,5);
  c.font='900 12px system-ui,sans-serif';c.textBaseline='top';c.textAlign=i?'right':'left';c.fillStyle='#fff';c.lineWidth=3;c.strokeStyle='#000';const nm=f.donor?fname(f.id,f.donor):f.F.name;c.strokeText(nm,i?x+bw:x,y+h+5);c.fillText(nm,i?x+bw:x,y+h+5);
  for(let k=0;k<2;k++){const cx=i?x+bw-110-k*18:x+110+k*18;c.beginPath();c.arc(i?x+bw-k*16-8:x+k*16+8,y+h+34,6,0,7);c.fillStyle=G.wins[i]>k?'#ffd23d':'#0008';c.fill();c.lineWidth=2;c.stroke()}
  const mw=bw*.62,mx=i?x+bw-mw:x,my=y+h+22;c.fillStyle='#000';c.fillRect(mx-2,my-2,mw+4,9);const mf=f.meter/100;c.fillStyle=mf>=1?`hsl(${G.time*400%360},100%,60%)`:'#ff3df2';c.fillRect(i?mx+mw*(1-mf):mx,my,mw*mf,5);if(mf>=1&&Math.sin(G.time*12)>0){c.font='900 10px system-ui';c.fillStyle='#fff';c.textAlign=i?'right':'left';c.fillText('SPECIAL READY'+(i?'':' (U)'),i?mx+mw:mx,my+8)}
  if(f.combo>=2&&G.time-f.comboT<1.1){const age=G.time-f.comboT,s=1+Math.max(0,.4-age*3);c.save();c.translate(i?W*.8:W*.2,H*(H>W?.2:.3));c.scale(s,s);c.rotate(i?.06:-.06);txt(c,f.combo+' HITS',0,0,fitSize(c,'00 HITS',44,W*.35),f.combo>=8?`hsl(${G.time*500%360},100%,62%)`:'#ffd23d');txt(c,'COMBO',0,30,16,'#fff');c.restore()}});
 c.fillStyle='#000a';c.beginPath();c.roundRect(W/2-30,top,60,44,10);c.fill();txt(c,Math.ceil(G.timer)+'',W/2,top+23,30,G.timer<10&&Math.sin(G.time*10)>0?'#ff3d3d':'#fff',{lw:5});
 if(G.freeze>0&&G.superF){const f=G.superF,k=1-G.freeze/.65,L=f.side===0;c.fillStyle=`rgba(0,0,0,${.55})`;c.fillRect(0,0,W,H);c.save();c.translate(W/2,H*.42);c.rotate(-.12);c.fillStyle=f.F.col;c.fillRect(-W,-H*.13,W*2,H*.26);c.fillStyle='#000';c.fillRect(-W,-H*.13,W*2,6);c.fillRect(-W,H*.13-6,W*2,6);c.restore();
  const img=SPR[f.id].attack,m=META[f.id].attack,ih=H*.42,iw=ih*m.w/m.h,sl=easeOutBack(Math.min(1,k*3));c.save();c.translate(L?lerp(-iw,W*.04,sl):lerp(W+iw,W*.96,sl),H*.63);if(!L)c.scale(-1,1);c.drawImage(img,0,-ih,iw,ih);c.restore();
  txt(c,f.sp.name,W/2+(L?W*.12:-W*.12),H*.42,fitSize(c,f.sp.name,54,W*.6),'#fff',{lw:9})}
 drawTexts(c,true);if(J.flash>0){c.globalAlpha=Math.min(1,J.flash);c.fillStyle=J.flashCol;c.fillRect(0,0,W,H);c.globalAlpha=1}}
function render(){const c=X;camera();const {s,cx,fy}=VIEW,tr=J.trauma*J.trauma,shx=(Math.random()*2-1)*tr*24,shy=(Math.random()*2-1)*tr*24;
 c.setTransform(DPR,0,0,DPR,shx*DPR,shy*DPR);drawBG(c);
 c.setTransform(DPR*s,0,0,DPR*s,DPR*(W/2-cx*s+shx),DPR*(fy+shy));
 c.fillStyle='#ff3df233';c.fillRect(WL-60,-650,8,650);c.fillRect(WR+52,-650,8,650);
 const order=[G.p2,G.p1];if(G.p1.st==='attack'||G.p1.st==='special')order.reverse();
 for(const f of order)drawSpecialFX(c,f);for(const f of order)drawFighter(c,f);for(const p of G.projs)drawProj(c,p);drawParts(c);drawTexts(c,false);
 drawHud(c)}

// ---------- SHARE CARD ----------
function makeCard(){const cv2=document.createElement('canvas');cv2.width=1080;cv2.height=1350;const c=cv2.getContext('2d'),id=owned(S.pick)?S.pick:'shark';
 if(BG){const k=1350/900;c.drawImage(BG,(1080-1600*k)/2,0,1600*k,1350)}const g=c.createLinearGradient(0,0,0,1350);g.addColorStop(0,'#14002bcc');g.addColorStop(.5,'#14002b33');g.addColorStop(1,'#14002bee');c.fillStyle=g;c.fillRect(0,0,1080,1350);
 c.textAlign='center';c.lineJoin='round';const out=(t,x,y,fill,s,lw=14)=>{c.font=FONT(s);c.lineWidth=lw;c.strokeStyle='#14002b';c.strokeText(t,x,y);c.fillStyle=fill;c.fillText(t,x,y)};
 out('BRAINROT',540,130,'#ff3df2',120);out('BATTLE',540,235,'#b6ff2e',100);
 const img=SPR[id]&&SPR[id].attack,m=META[id]&&META[id].attack;if(img){const ih=700,iw=ih*m.w/m.h;c.drawImage(img,540-iw/2,1000-ih,iw,ih)}
 const nm=fname(id,S.donor);let fs=80;c.font=FONT(fs);while(c.measureText(nm).width>980)fs-=4;out(nm,540,1080,'#ffd23d',fs,16);
 out(S.rung>=8?'CLEARED THE LADDER':`LADDER ${S.rung}/8 | BEST COMBO ${S.bestCombo}`,540,1160,'#fff',44,10);
 c.font='bold 34px system-ui,sans-serif';c.fillStyle='#b6ff2e';c.fillText('Fight me: '+SITE_URL.replace('https://',''),540,1300);return cv2}
const shareText=()=>`I'm brawling as ${fname(S.pick,S.donor)} in Brainrot Battle${S.bestCombo?` (best combo: ${S.bestCombo} hits)`:''}. Beat that: ${SITE_URL}`;
let lastCard=null;
async function shareCard(){audio();SFX.click();const cv2=makeCard(),url=cv2.toDataURL('image/png');lastCard=url;const t=shareText();
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
 skipKO:()=>{if(G.phase==='ko')G.koT=9},place:(x1,x2)=>{G.p1.x=x1;G.p2.x=x2},makeCard:()=>makeCard().toDataURL().length}}
