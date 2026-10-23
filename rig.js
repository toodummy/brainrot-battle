// ---------- RIG: skinned grid-mesh deformation of one sprite per stage ----------
// bones: 0 hip,1 spine,2 head,3 armF up,4 armF lo,5 armB up,6 armB lo,7 legF up,8 legF lo,9 legB up,10 legB lo
const RIG=(()=>{const SOFT={phoenix:.45,'phoenix@2':.45,'phoenix@3':.35,'hippo@3':.4,'kraken@3':.45,'owl@3':.45,'duckgod@3':.4,'dragon@3':.35,'snail@3':.5,'corgi@3':.45,'croissant@3':.3,'cloud@3':.45,vacuum:.5,boss:.6,'boss@2':.6,'boss@3':.6,'jester@3':.5,'cactus@3':.55,'shark@3':.6,'monk@3':.5,'golem@3':.7,'microwave@3':.6},CACHE={},PAR=[-1,0,1,1,3,1,5,0,7,0,9],NB=11,OVR={};let ON=true;
 function landmarks(img,m){const Wd=72,Hd=Math.round(Wd*m.h/m.w),cv=document.createElement('canvas');cv.width=Wd;cv.height=Hd;const x=cv.getContext('2d');x.drawImage(img,0,0,Wd,Hd);const D=x.getImageData(0,0,Wd,Hd).data,A=(i,j)=>D[(j*Wd+i)*4+3]>60;
  let x0=Wd,x1=0,y0=Hd,y1=0;for(let j=0;j<Hd;j++)for(let i=0;i<Wd;i++)if(A(i,j)){x0=Math.min(x0,i);x1=Math.max(x1,i);y0=Math.min(y0,j);y1=Math.max(y1,j)}
  const H=y1-y0+1,band=(a,b)=>{let s=0,n=0,mn=Wd,mx=0,ymn=0,ymx=0;for(let j=Math.round(y0+a*H);j<Math.round(y0+b*H);j++)for(let i=0;i<Wd;i++)if(A(i,j)){s+=i;n++;if(i<mn){mn=i;ymn=j}if(i>mx){mx=i;ymx=j}}return{cx:n?s/n:(x0+x1)/2,mn,mx,ymn,ymx,n}};
  const hd=band(0,.22),ch=band(.3,.45),hp=band(.5,.62),arms=band(.28,.72),ft=band(.9,1);
  // feet: clusters left/right of hip center in bottom band
  let lS=0,lN=0,rS=0,rN=0;for(let j=Math.round(y0+.9*H);j<=y1;j++)for(let i=0;i<Wd;i++)if(A(i,j)){if(i<hp.cx){lS+=i;lN++}else{rS+=i;rN++}}
  const cx=hp.cx,fl=lN?lS/lN:cx-(x1-x0)*.15,fr=rN?rS/rN:cx+(x1-x0)*.15,sc=m.w/Wd,P=(a,b)=>[a*sc,b*sc];
  const tw=(ch.mx-ch.mn)||(x1-x0)*.5,yN=y0+.27*H,yC=y0+.37*H,yH=y0+.6*H,yF=y1-.03*H;
  const sF=[ch.cx+tw*.28,yC],sB=[ch.cx-tw*.28,yC],hF=[Math.max(arms.mx-2,sF[0]+3),Math.max(arms.ymx,yC)],hB=[Math.min(arms.mn+2,sB[0]-3),Math.max(arms.ymn,yC)];
  const eF=[(sF[0]+hF[0])/2,(sF[1]+hF[1])/2+.04*H],eB=[(sB[0]+hB[0])/2,(sB[1]+hB[1])/2+.04*H];
  const pF=[cx+(fr-cx)*.45,yH],pB=[cx+(fl-cx)*.45,yH],kF=[(pF[0]+fr)/2+.02*H,(yH+yF)/2],kB=[(pB[0]+fl)/2+.02*H,(yH+yF)/2];
  const L={hip:[cx,yH],neck:[hd.cx*.5+ch.cx*.5,yN],top:[hd.cx,y0],sF,eF,hF,sB,eB,hB,pF,kF,fF:[fr,yF],pB,kB,fB:[fl,yF]};
  for(const k in L)L[k]=P(L[k][0],L[k][1]);return{L,bb:[x0*sc,y0*sc,(x1+1)*sc,(y1+1)*sc],H:H*sc,A,Wd,Hd,sc}}
 function build(K){const img=SPR[K]&&SPR[K].idle,m=META[K]&&META[K].idle;if(!img||!m||!img.width)return null;
  const lm=landmarks(img,m),L=Object.assign({},lm.L,OVR[K.split('@')[0]]&&OVR[K.split('@')[0]][K.includes('@')?K.split('@')[1]:1]||{}),H=lm.H;
  const seg=[[L.hip,[L.hip[0],L.hip[1]+H*.08]],[L.hip,L.neck],[L.neck,L.top],[L.sF,L.eF],[L.eF,L.hF],[L.sB,L.eB],[L.eB,L.hB],[L.pF,L.kF],[L.kF,L.fF],[L.pB,L.kB],[L.kB,L.fB]];
  const J=seg.map(s=>s[0]),RA=seg.map(s=>Math.atan2(s[1][1]-s[0][1],s[1][0]-s[0][0]));
  // grid mesh over bbox
  const [bx0,by0,bx1,by1]=lm.bb,C=6,R=9,cw=(bx1-bx0)/C,rh=(by1-by0)/R,V=[],idx=(i,j)=>j*(C+1)+i;
  for(let j=0;j<=R;j++)for(let i=0;i<=C;i++)V.push([bx0+i*cw,by0+j*rh]);
  const filled=(i,j)=>{for(let a=0;a<=3;a++)for(let b=0;b<=3;b++){const px=Math.min(lm.Wd-1,Math.floor((bx0+(i+a/3)*cw)/lm.sc)),py=Math.min(lm.Hd-1,Math.floor((by0+(j+b/3)*rh)/lm.sc));if(lm.A(px,py))return true}return false};
  const T=[];for(let j=0;j<R;j++)for(let i=0;i<C;i++)if(filled(i,j)){T.push([idx(i,j),idx(i+1,j),idx(i+1,j+1)],[idx(i,j),idx(i+1,j+1),idx(i,j+1)])}
  const r0=H*.07,Wt=V.map(([x,y])=>{const w=seg.map(([a,b],bi)=>{const dx=b[0]-a[0],dy=b[1]-a[1],l2=dx*dx+dy*dy||1,t=Math.max(0,Math.min(1,((x-a[0])*dx+(y-a[1])*dy)/l2)),ex=a[0]+dx*t-x,ey=a[1]+dy*t-y,d2=ex*ex+ey*ey;let k=1/Math.pow(d2+r0*r0,2);if(bi===0)k*=.6;if(bi===2&&y>L.neck[1]+H*.05)k*=.05;if((bi===1||bi===0)&&y<L.neck[1]-H*.04)k*=.05;return k});
   const ord=w.map((v,i)=>[v,i]).sort((p,q)=>q[0]-p[0]).slice(0,3),s=ord.reduce((a,p)=>a+p[0],0);return ord.map(([v,i])=>[i,v/s])});
  return{amp:SOFT[K]!=null?SOFT[K]:(m.w/m.h>1.15?.5:1),K,V,T,Wt,J,RA,L,H,mw:m.w,mh:m.h,ax:m.ax,ay:m.ay,P:new Float32Array(V.length*2)}}
 function get(K){if(!ON)return null;if(CACHE[K]!==undefined)return CACHE[K];const r=build(K);if(r)CACHE[K]=r;return r}
 // ---- pose ----
 const sp=(f)=>f.rg||(f.rg={a:new Float32Array(NB),v:new Float32Array(NB),tg:new Float32Array(NB),ox:0,oy:0,of:new Float32Array(NB*2),tof:new Float32Array(NB*2),hv:0,ha:0,pvx:0,ph:0,lt:0});
 function target(f,r,o){const g=f.rg.tg,T=G.time,RA=r.RA,OF=f.rg.tof,ext=(b,x,y)=>{OF[b*2]=x*r.H;OF[b*2+1]=y*r.H};g.fill(0);OF.fill(0);let stiff=260,ox=0,oy=0;
  const AQ=[],aim=(b,ang,k=1)=>{for(let i=0;i<AQ.length;i++)if(AQ[i][0]===b)AQ.splice(i,1);AQ.push([b,ang,k])},aimL=aim;
  const st=f.st,ph=f.rg.ph,D=Math.PI/2;
  // idle breathing
  const br=Math.sin(T*3.2+f.side*2);g[1]=.025*br;g[2]=.05*Math.sin(T*2.1+1);g[3]=.06*br;g[5]=-.06*br;g[4]=-.08*br;g[6]=.08*br;oy=br*r.H*.006;
  if(st==='walk'||(st==='dash')){const s=Math.sin(ph),a=st==='dash'?1.4:1;aimL(7,D-.5*s*a);g[8]=Math.max(0,-Math.cos(ph))*.7*a;aimL(9,D+.5*s*a);g[10]=Math.max(0,Math.cos(ph))*.7*a;g[3]+=.55*s*a;g[5]-=.55*s*a;g[4]-=.3;g[6]-=.3;g[1]=.08*a;oy=-Math.abs(Math.cos(ph))*r.H*.025}
  else if(st==='air'){aimL(7,D-.6);g[8]=1;aimL(9,D+.2);g[10]=.6;aim(3,-.9);aim(5,-2.3);g[2]=-.15}
  else if(st==='block'||st==='blockstun'){aim(3,-1.1);g[4]=-1.6;aim(5,-1.0);g[6]=-1.6;g[1]=-.12;g[2]=.25;aimL(7,D-.25);g[8]=.5;aimL(9,D+.3);g[10]=.5;oy=r.H*.04;stiff=500}
  else if(st==='hitstun'||st==='parried'){const k=Math.max(0,1-f.t*2.5);g[2]=-.6*k-.1;g[1]=-.3*k;aim(3,-2.4*k+D*(1-k));aim(5,-2.0*k+D*(1-k));aimL(7,D-.3*k);aimL(9,D+.35*k);stiff=420}
  else if(st==='launched'||f.ko){aim(3,-2.6+Math.sin(T*9)*.4);aim(5,-.6+Math.sin(T*9+1)*.4);aimL(7,D-.9);g[8]=1.2;aimL(9,D+.6);g[10]=.4;g[2]=-.5;g[1]=-.2;stiff=200}
  else if(st==='down'){aim(3,.2);aim(5,-.2);g[2]=-.3;stiff=150}
  else if(st==='attack'&&f.mv){const m=f.mv,t=f.mvT,n=f.mvN,a0=m.st,a1=m.st+m.ac,an=t<a0?t/a0:t<a1?1:Math.max(0,1-(t-a1)/(m.rc*.8)),wind=t<a0?1:0;stiff=900;
   if(n==='L1'){aim(3,wind?D+.6:-.08,an);ext(3,wind?-.05:.24*an,-.03*an);g[4]=wind?-1.5*an:0;g[1]+=.12*an;g[2]-=.1*an;aim(5,-.9,an);g[6]=-1.3*an}
   else if(n==='L2'){aim(5,wind?D+.8:-.12,an);ext(5,wind?-.05:.34*an,-.04*an);g[6]=wind?-1.4*an:0;g[1]+=.28*an;g[0]+=.06*an;aim(3,-1.0,an);g[4]=-1.4*an;ox=r.H*.04*an}
   else if(n==='L3'){aimL(7,wind?D+.3:-.15,an);ext(7,wind?0:.12*an,-.12*an);g[8]=wind?1.6*an:0;g[1]-=.3*an;g[2]+=.15*an;aim(3,-.6,an);aim(5,-2.0,an);aimL(9,D+.25,an);oy=-r.H*.03*an}
   else if(n==='H'){const c=f.charging?1:0;if(c||wind){aim(3,D+1.1);g[4]=-1.2;g[1]=-.2;oy=r.H*.07;aimL(7,D-.35);g[8]=.7;aimL(9,D+.35);g[10]=.7}else{aim(3,-D-.25,an);ext(3,.08*an,-.22*an);g[4]=0;g[1]=-.12*an;g[2]=-.2*an;aim(5,D+.4,an);oy=-r.H*.06*an}}
   else if(n==='AL'){aimL(7,-.1,an);ext(7,.14*an,-.08*an);g[8]=0;aimL(9,D+.6,an);g[10]=1.2*an;g[1]-=.25*an;aim(3,-1.2,an);aim(5,-2.4,an)}
   else if(n==='AH'){aim(3,wind?-D-.7:D-.3,an);aim(5,wind?-D-.9:D-.1,an);g[4]=g[6]=0;g[1]+=(wind?-.3:.45)*an;g[2]+=.2*an;aimL(7,D-.7);g[8]=1;aimL(9,D-.3);g[10]=1}
   else{aim(3,-.1,an);g[1]+=.1*an}}
  else if(st==='special'){const ty=f.sp.type,t=f.t;stiff=600;
   if(ty==='haymaker'){if(t>=.4)ext(3,.3,-.03);if(t<.4){aim(3,D+1.4);g[4]=-.9;g[1]=-.25;oy=r.H*.06;aimL(7,D-.4);g[8]=.6}else{aim(3,-.05);g[4]=0;g[1]=.35;ox=r.H*.08;aimL(9,D+.6)}}
   else if(ty==='beam'){if(t>.3){ext(3,.18,0);ext(5,.25,0)}aim(3,t<.3?D+.8:-.05);aim(5,t<.3?D+1:-.15);g[4]=g[6]=0;g[1]=t<.3?-.15:-.25;g[2]=-.1;aimL(7,D-.4);aimL(9,D+.35);g[8]=.4}
   else if(ty==='rain'||ty==='lightning'||ty==='aura'&&t>.9){aim(3,-D-.3+Math.sin(T*8)*.15);aim(5,-D+.3-Math.sin(T*8)*.15);g[4]=g[6]=0;g[1]=-.15;g[2]=-.35}
   else if(ty==='quake'||ty==='shockwave'){const up=t<.2||f.y>1;aim(3,up?-D-.4:D-.2);aim(5,up?-D-.2:D);g[1]=up?-.2:.45;g[2]=up?-.2:.2;aimL(7,D-.4);g[8]=up?.2:.9;aimL(9,D+.4);g[10]=up?.2:.9;oy=up?0:r.H*.08}
   else if(ty==='vortex'||ty==='aura'||ty==='flush'){aim(3,-.1+Math.sin(T*14)*.3);aim(5,Math.PI+.1-Math.sin(T*14)*.3);g[4]=g[6]=0;g[2]=Math.sin(T*10)*.2}
   else if(ty==='rush'||ty==='tsunami'){aim(3,ty==='tsunami'?-.1:D+1.2);aim(5,ty==='tsunami'?-.2:D+1.4);g[1]=.4;aimL(7,D-.8);g[8]=1.3;aimL(9,D+.9);g[10]=.5}
   else if(ty==='teleport'||ty==='flurry'||ty==='clone'){const s=Math.sin(T*40);aim(3,s>0?-.1:D,1);aim(5,s>0?D:-.1,1);g[4]=s>0?0:-1.2;g[6]=s>0?-1.2:0;g[1]=.2;stiff=1200}
   else if(ty==='volley'||ty==='boomerang'){const s=Math.sin(T*26);aim(3,s>0?-D-.8:.1);g[4]=s>0?-.6:0;aim(5,-1.2);g[1]=s>0?-.2:.2;stiff=1000}
   else if(ty==='suplex'){aim(3,t<.45?-.1:-D-.6);aim(5,t<.45?-.2:-D-.4);g[1]=t<.45?.3:-.4}
   else if(ty==='meteor'){aim(3,f.vy>0?-D-.5:D-.4);aim(5,f.vy>0?-D-.2:D-.2);aimL(7,D-1);g[8]=1.3;aimL(9,D-.6);g[10]=1.3}
   else{aim(3,-.3);aim(5,-.6)}}
  if(G.phase==='ko'&&f.side===G.winner&&G.koT>.9&&!f.ko){const b=Math.sin(T*8);aim(3,-D-.25+b*.15);aim(5,-D+.25-b*.15);g[4]=g[6]=0;g[2]=-.2+b*.1;g[1]=-.1}
  AQ.sort((p,q)=>p[0]-q[0]);for(const [b,ang,k] of AQ){let ac=0,p=PAR[b];while(p>=0){ac+=g[p];p=PAR[p]}let d=ang-RA[b]-ac;d=Math.atan2(Math.sin(d),Math.cos(d));g[b]=lerpA(g[b],d,k)}
  if(r.amp<1){for(let i=0;i<NB;i++)g[i]*=r.amp;for(let i=0;i<NB*2;i++)OF[i]*=r.amp*.6;ox*=r.amp}
  f.rg.stf=stiff;f.rg.tox=ox;f.rg.toy=oy}
 const lerpA=(a,b,k)=>a+(b-a)*k;
 function step(f,r,dt){const R=sp(f),o=f.o;dt=Math.min(dt,1/30);if(dt<=0)return;R.ph+=dt*Math.min(22,Math.abs(f.vx)/r.H*7+2*(f.st==='walk'));target(f,r);
  const k=R.stf,c=2*Math.sqrt(k)*.55;for(let i=0;i<NB;i++){const x=R.tg[i]-R.a[i];R.v[i]+=(k*x-c*R.v[i])*dt;R.a[i]+=R.v[i]*dt}
  R.ox+=(R.tox-R.ox)*Math.min(1,dt*18);for(let i=0;i<NB*2;i++)R.of[i]+=(R.tof[i]-R.of[i])*Math.min(1,dt*(R.stf>800?30:16));R.oy+=(R.toy-R.oy)*Math.min(1,dt*14);
  // secondary: head jiggle from body acceleration
  const acc=(f.vx-R.pvx)/dt;R.pvx=f.vx;R.hv+=(-260*R.ha-12*R.hv-acc*.00045*(f.dir||1))*dt;R.ha+=R.hv*dt;R.ha=Math.max(-.5,Math.min(.5,R.ha))}
 function deform(f,r){const R=sp(f),a=R.a,J=r.J,N=NB,M=new Float32Array(N*6),PJ=new Float32Array(N*2),TA=new Float32Array(N);
  for(let b=0;b<N;b++){const p=PAR[b];let ang=a[b]+(b===2?R.ha:0);let jx=J[b][0],jy=J[b][1];if(p>=0){ang+=TA[p];const mp=p*6;const x=jx,y=jy;jx=M[mp]*x+M[mp+1]*y+M[mp+2]+R.of[b*2];jy=M[mp+3]*x+M[mp+4]*y+M[mp+5]+R.of[b*2+1]}else{jx+=R.ox;jy+=R.oy}
   TA[b]=ang;const cs=Math.cos(ang),sn=Math.sin(ang),o=b*6;M[o]=cs;M[o+1]=-sn;M[o+2]=jx-(cs*J[b][0]-sn*J[b][1]);M[o+3]=sn;M[o+4]=cs;M[o+5]=jy-(sn*J[b][0]+cs*J[b][1]);PJ[b*2]=jx;PJ[b*2+1]=jy}
  const P=r.P,V=r.V,Wt=r.Wt;for(let i=0;i<V.length;i++){const x=V[i][0],y=V[i][1];let X=0,Y=0;for(const [b,w] of Wt[i]){const o=b*6;X+=w*(M[o]*x+M[o+1]*y+M[o+2]);Y+=w*(M[o+3]*x+M[o+4]*y+M[o+5])}P[i*2]=X;P[i*2+1]=Y}
  r.PJ=PJ;return P}
 function draw(c,r,src,P){const sx=src.width/r.mw,sy=src.height/r.mh,V=r.V,ox=-r.ax,oy=-r.ay;
  for(const t of r.T){const [i0,i1,i2]=t,u0=V[i0][0],v0=V[i0][1],u1=V[i1][0],v1=V[i1][1],u2=V[i2][0],v2=V[i2][1];
   let x0=P[i0*2],y0=P[i0*2+1],x1=P[i1*2],y1=P[i1*2+1],x2=P[i2*2],y2=P[i2*2+1];
   const den=(u0*(v2-v1)-u1*v2+u2*v1+(u1-u2)*v0);if(!den)continue;
   const a=-(v0*(x2-x1)-v1*x2+v2*x1+(v1-v2)*x0)/den,b=(v1*y2+v0*(y1-y2)-v2*y1+(v2-v1)*y0)/den,cc=(u0*(x2-x1)-u1*x2+u2*x1+(u1-u2)*x0)/den,d=-(u1*y2+u0*(y1-y2)-u2*y1+(u2-u1)*y0)/den,
    e=(u0*(v2*x1-v1*x2)+v0*(u1*x2-u2*x1)+(u2*v1-u1*v2)*x0)/den,ff=(u0*(v2*y1-v1*y2)+v0*(u1*y2-u2*y1)+(u2*v1-u1*v2)*y0)/den;
   const cx=(x0+x1+x2)/3,cy=(y0+y1+y2)/3,ex=(x,y)=>{const dx=x-cx,dy=y-cy,l=Math.hypot(dx,dy)||1;return[x+dx/l*1.6,y+dy/l*1.6]};
   const A=ex(x0,y0),B=ex(x1,y1),Cq=ex(x2,y2);
   c.save();c.beginPath();c.moveTo(A[0]+ox,A[1]+oy);c.lineTo(B[0]+ox,B[1]+oy);c.lineTo(Cq[0]+ox,Cq[1]+oy);c.closePath();c.clip();
   c.transform(a,b,cc,d,e+ox,ff+oy);const mnu=Math.max(0,Math.min(u0,u1,u2)-2),mnv=Math.max(0,Math.min(v0,v1,v2)-2),mxu=Math.min(r.mw,Math.max(u0,u1,u2)+2),mxv=Math.min(r.mh,Math.max(v0,v1,v2)+2);
   c.drawImage(src,mnu*sx,mnv*sy,(mxu-mnu)*sx,(mxv-mnu*0+(-mnv))*sy,mnu,mnv,mxu-mnu,mxv-mnv);c.restore()}}
 function bones(c,r){const P=r.PJ;if(!P)return;c.save();c.translate(-r.ax,-r.ay);c.lineWidth=6;c.strokeStyle='#0ff';c.fillStyle='#f0f';for(let b=1;b<NB;b++){const p=PAR[b];const x=P[b*2],y=P[b*2+1];if(p>=0&&b!==1){c.beginPath();c.moveTo(P[p*2],P[p*2+1]);c.lineTo(x,y);c.stroke()}c.beginPath();c.arc(x,y,9,0,7);c.fill()}c.restore()}
 const COMP={};function comp(K,img,gi){if(COMP[K])return COMP[K];const m=META[K].idle,c=document.createElement('canvas');c.width=img.width;c.height=img.height;const x=c.getContext('2d'),k=img.width/m.w;x.globalAlpha=.6;x.drawImage(gi,(-m.ax*1.07+m.ax)*k,(-m.ay*1.045+m.ay)*k,m.w*1.07*k,m.h*1.045*k);x.globalAlpha=1;x.drawImage(img,0,0);return COMP[K]=c}
 return{get,comp,step,deform,draw,bones,OVR,CACHE,set on(v){ON=v},get on(){return ON}}})();
