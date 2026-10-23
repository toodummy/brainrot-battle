import sys,base64,json
from playwright.sync_api import sync_playwright
BASE=sys.argv[1];OUT=sys.argv[2];KEYS=sys.argv[3];BONES=sys.argv[4]=='1' if len(sys.argv)>4 else False
JS="""async([keys,bones])=>{if(!G)G={time:0,phase:'fight'};const P=['idle','walk','punch','kick','uppercut','hit','block','victory'],CW=170,CH=190;
 const cv=document.createElement('canvas');cv.width=CW*P.length+90;cv.height=CH*keys.length;const c=cv.getContext('2d');c.fillStyle='#1a0c2e';c.fillRect(0,0,cv.width,cv.height);const bad=[];
 for(let r=0;r<keys.length;r++){const [id,st]=keys[r];await ensureSkin(id,st);const K=skinKey(id,st);const RG=RIG.get(K);c.fillStyle='#fff';c.font='12px sans-serif';c.fillText(K,4,r*CH+20);if(!RG){bad.push(K);continue}
  if(RG.T.length<20)bad.push(K+':tris'+RG.T.length);
  for(let k=0;k<P.length;k++){const p=P[k],f={id,side:0,dir:1,x:0,y:0,vx:0,t:0,F:{h:300},sp:{type:'beam'},st:'idle'};
   const mv=p==='punch'?'L1':p==='kick'?'L3':p==='uppercut'?'H':null;if(mv){f.st='attack';f.mv=MV[mv];f.mvN=mv;f.mvT=MV[mv].st+.05;f.charging=false}
   if(p==='walk'){f.st='walk';f.vx=300}if(p==='hit'){f.st='hitstun';f.t=.03}if(p==='block')f.st='block';
   const sv=[G.phase,G.winner,G.koT];if(p==='victory'){G.phase='ko';G.winner=0;G.koT=2}
   for(let i=0;i<40;i++){G.time+=1/60;RIG.step(f,RG,1/60)}const Pt=RIG.deform(f,RG);[G.phase,G.winner,G.koT]=sv;
   const m=META[K].idle,s=(CH-30)/m.h;c.save();c.translate(90+k*CW+CW/2,r*CH+CH-12);c.scale(s,s);RIG.draw(c,RG,SPR[K].idle,Pt);if(bones)RIG.bones(c,RG);c.restore();if(r===0){c.fillStyle='#ff0';c.fillText(p,90+k*CW+60,12)}}}
 return {url:cv.toDataURL('image/png'),bad}}"""
with sync_playwright() as p:
  b=p.chromium.launch();pg=b.new_page(viewport={'width':900,'height':520});errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
  pg.goto(BASE+'?debug');pg.wait_for_function("window.__test&&__test.ready",timeout=30000)
  keys=[[k.split('@')[0],int(k.split('@')[1]) if '@' in k else 1] for k in KEYS.split(',')] if KEYS!='all' else None
  if keys is None: keys=[[i,s] for i in pg.evaluate("__test.IDS") for s in (1,2,3)]
  allbad=[]
  for n in range(0,len(keys),12):
    r=pg.evaluate(JS,[keys[n:n+12],BONES]);open(f'{OUT}_{n//12}.png','wb').write(base64.b64decode(r['url'].split(',')[1]));allbad+=r['bad']
  print('bad',allbad,'errs',errs[:3]);b.close()
