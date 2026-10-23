// ---------- BRAINROTALITIES: 3 cartoon finishers per fighter (non-gory) ----------
const FIN={
shark:[['SHARKNADO','tornado','#2ec5ff','🦈'],['SNEAKER STOMP','squash','#ff3d3d','👟'],['FIN-ISHED','orbit','#2ec5ff','⭐']],
cup:[['ESPRESSO-ALITY','statue','#6b3b1c','☕'],['FROTH BOMB','confetti','#f5e6c8','☕'],['DECAF-INATED','shrink','#c49a6c','☕']],
duck:[['HOSTILE TAKEOVER','bury','#2ecc71','💼'],["YOU'RE FIRED",'orbit','#ffd23d','📄'],['QUARTERLY LOSS','pixel','#ff3d3d','📉']],
toaster:[['TOAST-ALITY','statue','#c07a2a','🍞'],['CARB LOAD','bury','#e8b062','🍞'],['POP-UP PARTY','orbit','#ff8a3d','🔥']],
cactus:[['DISCO INFERNO','confetti','#ff3df2','🪩'],['PRICKLE PANCAKE','squash','#5fbf3a','🌵'],['DESERT DRAIN','hole','#e8c070','🌵']],
banana:[['PEEL OUT','tornado','#ffe14d','🍌'],['SPLIT DECISION','squash','#ffe14d','🍌'],['BANANA BLAST','confetti','#ffe14d','🍌']],
broc:[['STEAMED','statue','#5fbf3a','🥦'],['GAINS GARDEN','bury','#2e8b3a','🥦'],['FLEX-PLOSION','confetti','#7dff5a','💪']],
toilet:[['FLUSH-ALITY','toilet','#9fe6ff','🧻'],['ROYAL FLUSH','orbit','#ffd23d','👑'],['TP TOMB','bury','#ffffff','🧻']],
pigeon:[['SIGMA SNACK','shrink','#99aabb','🍞'],['COO-DE GRACE','bury','#bbbbbb','🪶'],['PIGEON POST','balloon','#ff6b6b','✉️']],
frog:[['RIBBIT RIZZ','balloon','#ff4fb8','💖'],['LILY PAD SLAM','squash','#7dff5a','🐸'],['CROAK-ALITY','hole','#2e8b3a','🎵']],
potato:[['MASHED','squash','#c9a26b','🥔'],['FRENCH FRIED','zap','#ffd23d','🍟'],['COUCH POTATO','bury','#8a5a2b','🛋️']],
cat:[['NAP TIME','balloon','#bfe9ff','🫧'],['NINE LIVES','orbit','#ff9d3d','⭐'],['BATHTUB DRAIN','toilet','#bfe9ff','🛁']],
onion:[['TEAR FLOOD','hole','#7fd4ff','💧'],['RING DING','tornado','#d9a8ff','🧅'],['LAYERED','pixel','#d9a8ff','😭']],
hamster:[['HAMSTER WHEEL','tornado','#ffb84d','🌀'],['SEED STORM','bury','#e8c070','🌻'],['TURBO BOOP','orbit','#ff8a3d','🚀']],
microwave:[['NUKED','zap','#ffe14d','⚡'],['POPCORN PARTY','confetti','#fff6d6','🍿'],['DEFROSTED','statue','#a8e6ff','❄️']],
sock:[['SPIN CYCLE','tornado','#c9a8ff','🧦'],['LOST IN LAUNDRY','hole','#5a4bd1','🧦'],['STATIC SHOCK','zap','#2ec5ff','⚡']],
avocado:[['GUAC-ALITY','squash','#7dbf3a','🥑'],['DUMBBELL DROP','bury','#777777','🏋️'],['TOAST TOPPER','statue','#8ccf4a','🥑']],
cheese:[['MELTDOWN','statue','#ffb000','🧀'],['CHEESE WHEEL','squash','#ffd23d','🧀'],['LUCHA LAUNCH','orbit','#ff3d3d','🤼']],
cone:[['DETOUR','bury','#ff7a1a','🚧'],['ROAD CLOSED','squash','#ff7a1a','🚧'],['YEE-HAW-ALITY','tornado','#c98a4a','🤠']],
dino:[['EXTINCTION EVENT','bury','#ff5a1a','☄️'],['PINK SLIP','orbit','#ff9ad0','📄'],['FOSSILIZED','statue','#a0896b','🦴']],
jelly:[['WOBBLE-ALITY','squash','#ff6bd6','🍮'],['JIGGLE POP','confetti','#ff6bd6','🫐'],['GUMMY TRAP','statue','#ff6bd6','🍬']],
sloth:[['BASS DROP','squash','#2ec5ff','🔊'],['SLOW FADE','pixel','#7dff5a','🎧'],['VINYL VORTEX','hole','#3a2a6a','💿']],
lamp:[['LAVA-LAMPED','balloon','#ff7a3d','🫧'],['GROOVY GOO','statue','#ff5ab0','🌈'],['LIGHTS OUT','zap','#ffd23d','💡']],
gnome:[['NEON NINJA STAR','zap','#2ec5ff','⭐'],['GARDEN VARIETY','bury','#7dff5a','🍄'],['GNOME-ALITY','shrink','#ff3df2','🍄']],
nugget:[['GOLDEN NUGGETED','statue','#ffd23d','🏆'],['DIPPED','hole','#ff8a3d','🥫'],['KNIGHTY NIGHT','orbit','#ffd23d','🌙']],
croissant:[['WALK THE PLANK','hole','#2e7bd1','🌊'],['CANNON-ALITY','orbit','#ffcc00','💣'],['BUTTER BURY','bury','#ffd27a','🥐']],
monk:[['ZEN-ITH','orbit','#e8c070','☮️'],['SPORE-ALITY','confetti','#c9a26b','🍄'],['INNER PEACE','shrink','#ffd23d','🧘']],
goose:[['HONK-ALITY','tornado','#ffffff','🪿'],['WILD GOOSE CHASE','orbit','#ffd23d','🪶'],['BREAD TAX','bury','#e8b062','🍞']],
vacuum:[['SUCKED UP','hole','#666677','🌀'],['DUST BUNNY','shrink','#bbbbbb','🐰'],['BAGGED','pixel','#2ec5ff','🗑️']],
snail:[['SLIME TIME','statue','#7dff5a','🐌'],['ROCKET SHELL','orbit','#ff8a3d','🚀'],['LIFTOFF','balloon','#c0c0ff','🛸']],
cloud:[['STRUCK','zap','#ffe14d','⚡'],['HAIL MARY','bury','#bfe9ff','🧊'],['DEEP FREEZE','statue','#a8e6ff','❄️']],
dragon:[['WASABI BLAST','zap','#7dff5a','🔥'],['MAKI ROLL','squash','#2e8b3a','🍣'],['SOY SINKHOLE','hole','#5a2a0a','🥢']],
hippo:[['MUMMY WRAP','statue','#e8dcb0','🧻'],['SANDSTORM','tornado','#e8c070','🏜️'],['PYRAMID DROP','squash','#d9b45a','🔺']],
phoenix:[['FLAMBÉ','zap','#ff5a1a','🔥'],['ASH-TO-PIXEL','pixel','#ff8a3d','🔥'],['SUNSET SEND-OFF','orbit','#ffb000','☀️']],
unicorn:[['RAINBOW ROAD','orbit','#ff3df2','🌈'],['SPARKLE-ALITY','confetti','#ff9ad0','🦄'],['GLITTER BOMB','balloon','#c9a8ff','✨']],
shrimp:[['TEMPURA-ALITY','statue','#ffb84d','🍤'],['DEEP FRIED','zap','#ffd23d','🍤'],['IAIDO CONFETTI','confetti','#ff8a6b','🍣']],
kraken:[['INK-REDIBLE','hole','#3a1a5a','🦑'],['TENTACLE TOSS','orbit','#2ec5ff','🐙'],['DROP THE BEAT','squash','#ff3df2','🔊']],
owl:[['STARFALL','bury','#c9a8ff','⭐'],['HOOT-ALITY','pixel','#6a3df0','🦉'],['SUPERNOVA','hole','#2a1a5a','🌌']],
golem:[['PARTICIPATION TROPHY','statue','#ffd23d','🏆'],['TROPHY CASE','squash','#ffd23d','🏆'],['VICTORY LAP','tornado','#ffd23d','🥇']],
duckgod:[['QUACKAGEDDON','bury','#ffe14d','🦆'],['COSMIC QUACK','hole','#2a1a5a','🌌'],['RUBBER DUCKIFIED','shrink','#ffe14d','🦆']],
angel:[['HOLY TOAST','statue','#fff2b0','🍞'],['ASCENSION','balloon','#ffffff','😇'],['HALO HAMMER','squash','#ffd23d','😇']],
jester:[['PUNCHLINE','confetti','#9a3df0','🃏'],['VOID PRANK','hole','#2a0a3a','🎭'],['JACK IN THE BOX','orbit','#ff3df2','🎁']],
corgi:[['ZOOMIES','tornado','#ffb84d','🐕'],['ORBITAL LASER','zap','#2ec5ff','🛰️'],['8-BIT BORK','pixel','#2ec5ff','👾']],
boss:[['TOTAL BRAINROT','pixel','#ff3df2','🧠'],['SINGULARITY','hole','#2a1a5a','🧠'],['SKIBIDI SEND','toilet','#9fe6ff','🚽']]};
const FIN_LAST={},FIN_T0=.95,FIN_A=2.05,FIN_BAN=3.05,FIN_END=3.75;
let FIN_FORCE=null;
function finQueue(a,d){G.fin=null;G.finQ={a,d}}
function finStart(){const {a,d}=G.finQ;G.finQ=null;const L=FIN[a.id]||FIN.shark;let i;
 if(FIN_FORCE!=null)i=FIN_FORCE%3;else{do i=Math.floor(Math.random()*3);while(i===FIN_LAST[a.id])}FIN_LAST[a.id]=i;
 const [name,type,col,em]=L[i],S=1+.3*((a.stage||1)-1),dir=sgn(d.x-a.x)||1,tx=clamp(a.x+dir*300,WL+120,WR-120);
 a.st='idle';a.mv=null;a.vx=0;a.charging=0;d.st='fin';d.vx=d.vy=0;G.projs=[];
 G.fin={a,d,name,type,col,em,S,i,t:0,u:0,dir,x0:d.x,y0:d.y,tx,zx:(a.x+tx)/2,zw:640,flags:{},px:[]};
 popText(W/2,H*.3,"BRAINROT 'EM!",'#ff3df2',fitSize(X,"BRAINROT 'EM!",100,W*.86),{hud:1,life:.95,vy:0,rot:-.05});SFX.bell();say('Brainrot them!')}
function finTick(rdt){if(G.finQ&&G.koT>=1.0)finStart();const F=G.fin;if(!F)return!!G.finQ;if(F.done)return false;
 const imp=F.t>FIN_T0+.15&&F.t<FIN_T0+.5,rate=imp?.4:1;J.slow=imp?.4:1;J.slowT=imp?.1:0;F.t+=rdt*rate;F.u=clamp((F.t-FIN_T0)/FIN_A,0,1);
 const fl=F.flags,on=k=>!fl[k]&&(fl[k]=1);
 if(F.t>.6&&on('nm')){popText(W/2,H*.46,F.name+'!',F.col,fitSize(X,F.name+'!',74,W*.8),{hud:1,life:1.6,vy:0,rot:.04});SFX.super&&SFX.super()}
 if(F.u>0&&on('go'))finSfx(F,'go');if(F.u>.14&&on('hit')){finSfx(F,'hit');shake(.9*F.S)}if(F.u>.6&&on('mid'))finSfx(F,'mid');
 if(F.t>FIN_BAN&&on('ban')){popText(W/2,H*.32,'BRAINROTALITY!','#b6ff2e',fitSize(X,'BRAINROTALITY!',112,W*.9),{hud:1,life:1.2,vy:0,rot:-.04});SFX.fanfare();shake(.6);J.flash=.5;J.flashCol=F.col;say('Brainrotality!')}
 if(F.t>FIN_END){F.done=1;J.slow=1;G.koT=Math.max(G.koT,2.45);return false}return true}
function finSkip(){const F=G&&G.fin;if(F&&!F.done&&F.t>1&&F.t<FIN_BAN){F.t=FIN_BAN;F.u=1;F.flags.hit=F.flags.mid=F.flags.go=1;J.parts.length=0}}
document.addEventListener('pointerdown',finSkip,true);document.addEventListener('keydown',finSkip,true);
function finSfx(F,k){const ty=F.type;
 if(k==='go'){SFX.dash();if(ty==='shrink'||ty==='pixel')tone('square',300,1800,.4,.12);if(ty==='hole'||ty==='toilet'||ty==='tornado')noise(1.6,.35,300,0,'bandpass',2,2400)}
 else if(k==='hit'){if(ty==='zap')SFX.zap();else if(ty==='squash'||ty==='bury')SFX.heavy();else SFX.boom();if(ty==='orbit')tone('sine',300,1500,.6,.25);if(ty==='balloon')tone('sine',200,700,1,.2)}
 else{if(ty==='confetti')SFX.boom();if(ty==='orbit'||ty==='balloon')SFX.sparkle();if(ty==='shrink')tone('square',1800,2400,.15,.1);if(ty==='statue')tone('triangle',2400,2400,.3,.15);if(ty==='toilet')noise(.9,.5,500,0,'lowpass');if(ty==='pixel')tone('square',600,80,.5,.12);if(ty==='bury'||ty==='squash')SFX.land();if(ty==='hole')tone('sine',400,40,.8,.3)}}
function finCamW(){const F=G.fin;return F.type==='orbit'&&F.u>.3?1100:F.zw/Math.min(1.25,F.S)}
// world-space dark veil + spotlight, drawn right after the background
function finDark(c){const F=G&&G.fin;if(!F)return;const k=F.done?0:Math.min(1,F.t/.3)*(F.t>FIN_BAN+.3?Math.max(0,1-(F.t-FIN_BAN-.3)/.4):1);if(k<=0)return;c.save();c.setTransform(DPR,0,0,DPR,0,0);const g=c.createRadialGradient(W/2,H*.62,H*.1,W/2,H*.62,Math.max(W,H)*.7);g.addColorStop(0,`rgba(15,0,35,${.55*k})`);g.addColorStop(1,`rgba(3,0,10,${.93*k})`);c.fillStyle=g;c.fillRect(0,0,W,H);c.restore()}
function ds(c,f,pose,x,y,rot,sx,sy,al,sil){drawSprite(c,f,pose,x,y,f.dir,rot,sx,sy,al,sil)}
function tint(c,f,x,y,rot,sx,sy,col,al){const K=f.skin||f.id;glowSil(K,'hurt',col);ds(c,f,'hurt',x,y,rot,sx,sy,al,col)}
function emo(c,e,x,y,s,r=0,a=1){c.save();c.globalAlpha=a;c.translate(x,y);c.rotate(r);c.font=`${s}px system-ui,"Apple Color Emoji","Segoe UI Emoji",sans-serif`;c.textAlign='center';c.textBaseline='middle';c.fillStyle='#fff';c.fillText(e,0,0);c.restore()}
function starTw(c,x,y,r,col){c.save();c.translate(x,y);c.rotate(G.time*3);c.fillStyle=col;c.shadowColor=col;c.shadowBlur=20;c.beginPath();for(let i=0;i<8;i++){const rr=i%2?r*.25:r,an=i*Math.PI/4;c.lineTo(Math.cos(an)*rr,Math.sin(an)*rr)}c.fill();c.restore()}
const PIXC=document.createElement('canvas');
// winner pose override: lunge + attack during strike
function finWinner(f){const F=G.fin;if(!F||F.a!==f)return null;const u=F.u;if(u>.04&&u<.3)return{pose:'attack',dx:F.dir*Math.sin(Math.min(1,(u-.04)/.12)*Math.PI/2)*70};return{pose:u>=.3?'idle':'idle',dx:0}}
// draws the loser (returns true when handled)
function finDraw(c,f){const F=G.fin;if(!F||F.d!==f)return false;const T=G.time,u=F.u,S=F.S,col=F.col,em=F.em,h=f.F.h*(f.vis||1),m=Math.min(1,F.t/.4);
 f.dir=-F.dir;const x=lerp(F.x0,F.tx,easeOutBack?Math.min(1,m):m),y0=F.y0*(1-m);f.x=x;f.y=y0;const cy=-(h*.5);
 if(F.done||F.t>=FIN_BAN&&['orbit','confetti','hole','toilet','pixel','tornado','balloon','shrink','bury'].includes(F.type))return finAfter(c,F,x),true;
 const ty=F.type,P=(n,o)=>burst(x+rand(-60,60),-(h*.5)+rand(-h*.3,h*.3),n,o.c||[col,'#fff'],o);
 if(ty==='squash'){const fall=clamp(u/.14,0,1),oy=lerp(-2200,-h*.9,fall*fall),flat=u>.14?Math.max(.12,1-(u-.14)*12):1;
  ds(c,f,'hurt',x,0,0,1+(1-flat)*.8,flat,1);const bob=u>.14?Math.sin(Math.min(1,(u-.14)*6)*Math.PI)*-30:0;emo(c,em,x,(u>.14?-h*flat-130*S:oy-130*S)+bob,300*S,.1);
  if(u>.14&&!F.flags.p1){F.flags.p1=1;P(30,{k:'star',spd:900,up:300,size:12});burst(x,0,24,['#fff','#ccc'],{k:'circle',spd:700,up:100,size:14})}
  if(u>.3)for(let i=0;i<3;i++){const a=T*5+i*2.1;starTw(c,x+Math.cos(a)*90,-h*flat-280*S+Math.sin(a)*14,14,'#ffe14d')}}
 else if(ty==='orbit'){const k=clamp((u-.12)/.4,0,1);const yy=k*k*2600,sc=1-k*.5;ds(c,f,'hurt',x+k*F.dir*200,yy,-F.dir*k*20,sc,sc,1);if(u>.12&&u<.5&&Math.random()<.6)burst(x+k*F.dir*200,-yy,2,[col,'#fff'],{k:'star',spd:120,size:10,life:.6})}
 else if(ty==='statue'){const k=clamp((u-.1)/.25,0,1);ds(c,f,'hurt',x,0,0,1,1,1);tint(c,f,x,0,0,1,1,col,k*.92);
  if(k>0&&k<1&&Math.random()<.5)P(1,{k:'spark',spd:300,size:10});if(u>.45){const w=Math.sin(T*30)*Math.min(1,(u-.45)*4)*.03;c.save();c.strokeStyle='#fff';c.globalAlpha=.8;c.lineWidth=5;c.beginPath();c.moveTo(x-20,-h*.9);c.lineTo(x+10,-h*.6);c.lineTo(x-15,-h*.4);c.lineTo(x+20,-h*.15);c.stroke();c.restore()}
  if(u>.42)emo(c,em,x,-h-90*S,110*S,Math.sin(T*4)*.2);
  if(u>.82&&!F.flags.sh){F.flags.sh=1;P(40,{k:'circle',c:[col,'#fff',col],spd:900,up:500,size:16});P(14,{k:'g',gl:em,spd:700,up:500,size:40*S});shake(.7)}}
 else if(ty==='hole'){const k=clamp((u-.08)/.6,0,1),hx=x,hy=-h*.6;finHole(c,hx,hy,(1-Math.max(0,(u-.85)/.15))*(160+40*Math.sin(T*9))*S*Math.min(1,u*8),col);
  if(k<1){const sc=1-k*.95;ds(c,f,'hurt',lerp(x,hx,k),-hy*k,k*14*F.dir,sc,sc,1)}if(Math.random()<.5)burst(hx+rand(-300,300),hy+rand(-200,200),1,[col,'#fff'],{spd:40,g:0,size:6,k:'circle',life:.5})}
 else if(ty==='confetti'){const k=clamp((u-.12)/.3,0,1);if(u<.42){const j=k*10;ds(c,f,'hurt',x+rand(-j,j),0,0,1+k*.5,1+k*.4,1);ds(c,f,'hurt',x,0,0,1+k*.5,1+k*.4,k*.8,'w')}
  else if(!F.flags.pop){F.flags.pop=1;SFX.boom();shake(1.1*S);J.flash=.6;J.flashCol=col;burst(x,cy,Math.round(60*S),['#ff3df2','#b6ff2e','#2ec5ff','#ffd23d',col],{k:'star',spd:1400,up:500,size:12});burst(x,cy,Math.round(20*S),['#fff'],{k:'g',gl:em,spd:1000,up:600,size:46*S});burst(x,cy,12,['#fff'],{k:'g',gl:'🎉',spd:800,up:600,size:40})}}
 else if(ty==='shrink'){const k=clamp((u-.1)/.25,0,1),sc=1-.85*k,run=Math.max(0,u-.5)*1500;
  if(u>.05&&u<.4){c.save();c.globalAlpha=.6+.3*Math.sin(T*50);c.strokeStyle=col;c.lineWidth=18*S;c.shadowColor=col;c.shadowBlur=30;c.beginPath();c.moveTo(F.a.x+F.dir*80,-F.a.F.h*.6);c.lineTo(x,cy);c.stroke();c.restore()}
  const hop=u>.5?Math.abs(Math.sin(u*60))*40:0;ds(c,f,'hurt',x+F.dir*run,hop,0,sc,sc,1);if(u>.35)emo(c,'💦',x+F.dir*run-F.dir*40,-h*sc-30-hop,40)}
 else if(ty==='toilet'){const k=clamp((u-.05)/.2,0,1),sink=clamp((u-.3)/.45,0,1),tz=.8+.2*S;finToilet(c,x,k,tz,col,0);
  if(sink<1){const sc=(1-sink*.85)*.9;ds(c,f,'hurt',x+Math.sin(G.time*20)*sink*30,(1-sink)*150*tz*k-sink*60,sink*30,sc,sc,1)}
  finToilet(c,x,k,tz,col,1);if(sink>0&&sink<1&&Math.random()<.6)burst(x,-130*tz,2,['#9fe6ff','#fff'],{k:'circle',spd:300,up:300,size:10,life:.6})}
 else if(ty==='bury'){const n=Math.floor(clamp(u/.6,0,1)*16*S);while(F.px.length<n){const i=F.px.length;F.px.push({x:x+rand(-130,130)*S,y:-30-(i/(16*S))*h*1.1,r:rand(-.6,.6),t:F.t});if(i%3===0)SFX.land()}
  ds(c,f,'hurt',x,0,0,1,1-Math.min(.3,u*.5),1);for(const p of F.px){const k=clamp((F.t-p.t)/.18,0,1);emo(c,em,p.x,lerp(-2200,p.y,k*k),130*S,p.r);if(k>=1&&!p.l){p.l=1;burst(p.x,p.y+40,6,['#fff',col],{k:'circle',spd:400,up:200,size:10})}}
  if(u>.7)emo(c,'🚩',x+10,-h*1.15-120*S,90*S)}
 else if(ty==='zap'){const z=u>.1&&u<.55;if(z&&Math.random()<.5){c.save();c.strokeStyle=col;c.lineWidth=14;c.shadowColor=col;c.shadowBlur=30;c.beginPath();let xx=x+rand(-30,30);c.moveTo(xx,-1800);for(let yy=-1800;yy<-h*.4;yy+=120){xx=x+rand(-70,70);c.lineTo(xx,yy)}c.stroke();c.restore();J.flash=Math.max(J.flash,.25);J.flashCol=col}
  const burnt=clamp((u-.12)/.2,0,1),fall=clamp((u-.6)/.15,0,1);ds(c,f,'hurt',x+(z?rand(-8,8):0),0,-F.dir*fall*1.4*0,1,1-fall*.0,1);tint(c,f,x,0,0,1,1,'#1a1a1a',burnt*.85);if(z&&Math.random()<.2)tint(c,f,x,0,0,1,1,'#ffffff',.6);
  if(u>.3&&Math.random()<.4)burst(x+rand(-50,50),-h+rand(0,40),1,['#555','#888'],{k:'circle',spd:60,g:-200,size:20,life:1.2});if(u>.55)emo(c,'💨',x,-h*.5,90*S,0,1);
  if(u>.7&&!F.flags.ash){F.flags.ash=1;burst(x,cy,30,['#333','#777',col],{k:'circle',spd:500,up:200,size:16});burst(x,cy,8,['#fff'],{k:'g',gl:em,spd:500,up:500,size:40*S})}
  if(u>.7)return finAfter(c,F,x),true}
 else if(ty==='balloon'){const k=clamp((u-.12)/.25,0,1),up=Math.max(0,u-.37)*2200,sw=Math.sin(T*3)*40*Math.min(1,up/200);ds(c,f,'hurt',x+sw,up,Math.sin(T*3)*.15,1+k*.6,1+k*.35,1);
  if(u>.37){c.save();c.strokeStyle='#fff';c.lineWidth=3;c.beginPath();c.moveTo(x+sw,-up-h*1.3);c.quadraticCurveTo(x+sw+30,-up-h*1.5,x+sw,-up-h*1.7);c.stroke();c.restore();emo(c,em,x+sw,-up-h*1.75,70*S)}}
 else if(ty==='pixel'){const k=clamp((u-.08)/.3,0,1),n=Math.max(5,Math.round(lerp(48,5,Math.sqrt(k))));if(u<.62)finPix(c,f,x,n,col,k);else if(!F.flags.px){F.flags.px=1;for(let i=0;i<50*S;i++)burst(x+rand(-h*.3,h*.3),-rand(0,h),1,[col,'#fff','#b6ff2e','#14002b'],{k:'square',spd:300,up:600,g:-300,size:rand(10,22),life:1.4});burst(x,cy,6,['#fff'],{k:'g',gl:em,spd:400,up:400,size:44*S})}}
 else if(ty==='tornado'){const k=clamp((u-.08)/.2,0,1),lift=Math.max(0,u-.3)*1800,away=Math.max(0,u-.45)*F.dir*2200;finTornado(c,x+away*.6,k*(1-Math.max(0,(u-.85)/.15)),S,col);
  ds(c,f,'hurt',x+away+Math.sin(T*14)*60*k,lift*.5+k*60,0,Math.cos(T*18)*(1-k*.3),1-k*.3,1);for(let i=0;i<5;i++){const a=T*8+i*1.26;emo(c,em,x+away*.6+Math.cos(a)*160*S*k,-h*.4-i*70*S+Math.sin(a)*20,50*S,a,k)}}
 return true}
function finAfter(c,F,x){const T=G.time;if(F.type==='orbit'&&F.u>.5){c.save();c.setTransform(DPR,0,0,DPR,0,0);const tw=.5+.5*Math.sin(T*14);starTw(c,W*(.5+.18*F.dir),H*.14,10+22*tw,'#fff');starTw(c,W*(.5+.18*F.dir),H*.14,6+10*tw,F.col);c.restore()}
 if(F.type==='bury'&&F.px.length){for(const p of F.px)emo(c,F.em,p.x,p.y,130*F.S,p.r);emo(c,'🚩',x+10,-F.d.F.h*1.15-120*F.S,90*F.S)}
 if(F.type==='zap'||F.type==='pixel'||F.type==='confetti'){c.save();c.globalAlpha=.5;c.fillStyle='#222';c.beginPath();c.ellipse(x,-6,80*F.S,16,0,0,7);c.fill();c.restore()}}
function finHole(c,x,y,r,col){if(r<=1)return;const T=G.time;c.save();c.translate(x,y);for(let i=0;i<5;i++){c.save();c.rotate(T*(5+i*1.5)*(i%2?-1:1));c.strokeStyle=i%2?'#fff':col;c.globalAlpha=.6;c.lineWidth=12-i*1.5;c.beginPath();c.ellipse(0,0,r*(1.6-i*.22),r*(.9-i*.12),0,0,4.8);c.stroke();c.restore()}const g=c.createRadialGradient(0,0,2,0,0,r*.7);g.addColorStop(0,'#000');g.addColorStop(.75,'#000');g.addColorStop(1,col+'00');c.fillStyle=g;c.beginPath();c.arc(0,0,r*.7,0,7);c.fill();c.restore()}
function finToilet(c,x,k,s,col,front){if(k<=0)return;c.save();c.translate(x,0);c.scale(s,s*k);c.lineWidth=7;c.strokeStyle='#14002b';
 if(!front){c.fillStyle='#e8f6ff';c.beginPath();c.roundRect(-150,-330,300,140,20);c.fill();c.stroke();c.fillStyle='#fff';c.beginPath();c.ellipse(0,-150,190,55,0,0,7);c.fill();c.stroke();c.fillStyle=col;c.beginPath();c.ellipse(0,-150,150,38,0,0,7);c.fill();c.strokeStyle='#fff';c.lineWidth=5;c.beginPath();c.ellipse(0,-150,90*Math.abs(Math.sin(G.time*6)),22,G.time*4,0,5);c.stroke()}
 else{c.fillStyle='#fff';c.beginPath();c.moveTo(-170,-150);c.quadraticCurveTo(-150,-10,-70,0);c.lineTo(70,0);c.quadraticCurveTo(150,-10,170,-150);c.quadraticCurveTo(0,-90,-170,-150);c.fill();c.stroke();c.fillStyle='#cfe9ff';c.fillRect(-90,-40,180,10)}
 c.restore()}
function finTornado(c,x,k,s,col){if(k<=0)return;const T=G.time;c.save();c.globalAlpha=.55*k;for(let i=0;i<14;i++){const yy=-i*60*s,r=(40+i*16)*s*k,o=Math.sin(T*6+i*.7)*30*s;c.strokeStyle=i%2?col:'#fff';c.lineWidth=10;c.beginPath();c.ellipse(x+o,yy,r,r*.25,0,T*10+i,T*10+i+4.6);c.stroke()}c.restore()}
function finPix(c,f,x,n,col,k){const K=f.skin||f.id,img=SPR[K].hurt,m=META[K].hurt,sc=f.F.h/META[K].idle.h*(f.vis||1),nh=Math.max(2,Math.round(n*m.h/m.w));PIXC.width=n;PIXC.height=nh;const p=PIXC.getContext('2d');p.clearRect(0,0,n,nh);p.drawImage(img,0,0,n,nh);
 c.save();c.translate(x,0);c.scale(f.dir*(FLIPIMG[K]?-1:1)*sc,sc);c.imageSmoothingEnabled=false;c.drawImage(PIXC,0,0,n,nh,-m.ax,-m.ay,m.w,m.h);c.globalAlpha=k*.35;c.globalCompositeOperation='source-atop';c.restore();c.imageSmoothingEnabled=true;
 if(Math.random()<k)burst(x+rand(-80,80),-rand(0,f.F.h),1,[col,'#fff'],{k:'square',spd:100,g:-200,size:12,life:.8})}
