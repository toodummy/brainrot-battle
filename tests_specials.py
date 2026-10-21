import sys,time
from playwright.sync_api import sync_playwright
BASE=sys.argv[1];SHOT=len(sys.argv)>2
errs=[]
with sync_playwright() as p:
  b=p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required'])
  pg=b.new_page(viewport={'width':900,'height':520})
  pg.on('pageerror',lambda e:errs.append(str(e)))
  pg.goto(BASE+'?debug');pg.evaluate("localStorage.clear()");pg.reload();pg.wait_for_function("window.__test&&__test.ready",timeout=30000)
  pg.evaluate("__test.unlockAll()")
  if SHOT:
    pg.evaluate("quit()")
    for i,(fid,idx,at) in enumerate([('toaster',2,.9),('shark',2,.8),('cup',3,.6),('duckgod',1,.6),('phoenix',1,.7),('kraken',4,.6),('golem',3,.5),('dragon',4,.5)]):
      pg.evaluate(f"__test.setPick('{fid}');__test.startMatch(0)");pg.wait_for_function("__test.G.phase==='fight'",timeout=15000);time.sleep(1.4)
      pg.evaluate(f"(()=>{{const f=__test.G.p1,o=__test.G.p2;o.x=f.x+380;f.dir=1;f.spL=null;f.sp=spList('{fid}')[{idx}];f.spLast=-1;o.st='idle';startSpecial(f,o)}})()")
      
      for _ in range(80):
        v=pg.evaluate('[__test.G.p1.st,__test.G.p1.t,__test.G.p1.sp.name,__test.G.p1.sp.type]')
        if v[0]!='special' or v[1]>=at*.6:break
        time.sleep(.05)
      print(fid,v,errs[-1:]);open(f'/workspace/sp/n{i}.txt','w').write(fid.upper()+': '+v[2]+' ('+v[3]+')');pg.screenshot(path=f'/workspace/sp/shot{i}.png')
      pg.evaluate("quit()")
  # stress: run every special of every fighter through update+draw
  r=pg.evaluate("""(async()=>{__test.startMatch(0);await new Promise(r=>{const i=setInterval(()=>{if(__test.G.phase==='fight'){clearInterval(i);r()}},50)});
   const G=__test.G,f=G.p1,o=G.p2,c=document.querySelector('#cv').getContext('2d');let n=0,bad=[],names=new Set();
   for(const id of __test.IDS){const L=spList(id);if(L.length!==5)bad.push(id+':len'+L.length);if(new Set(L.map(x=>x.type)).size!==5)bad.push(id+':duptype');
    for(const sp of L){names.add(sp.name);f.sp=sp;f.spL=null;f.st='special';f.t=0;f.spS={};f.x=600;f.y=0;o.x=820;o.y=0;o.hp=o.max;o.st='idle';o.inv=0;
     try{for(let k=0;k<120&&f.st==='special';k++){f.t+=1/60;G.time+=1/60;updSpecial(f,o,1/60);drawSpecialFX(c,f);drawFighter(c,f)}n++}catch(e){bad.push(id+':'+sp.name+':'+e.message)}
     G.projs=[];f.st='idle';f.armor=0}}
   // random no-repeat check
   f.spL=spList('shark');f.spLast=-1;let prev=-1,rep=0,seen=new Set();for(let i=0;i<60;i++){f.meter=100;startSpecial(f,o);if(f.spLast===prev)rep++;prev=f.spLast;seen.add(f.spLast);f.st='idle'}G.freeze=0;
   return {n,bad,uniq:names.size,rep,seen:seen.size}})()""")
  print('stress',r)
  ok=r['n']==220 and not r['bad'] and r['rep']==0 and r['seen']==5
  print('errors',errs[:5]);print('PASS' if ok and not errs else 'FAIL')
  b.close()
