function updateParticles(dt){for(const p of particles){p.age+=dt;p.vel.y-=5.1*dt;p.pos=add(p.pos,mul(p.vel,dt));p.rot.x+=p.ang.x*dt;p.rot.y+=p.ang.y*dt;p.rot.z+=p.ang.z*dt;p.alpha=1-p.age/p.life;p.scale=mul(p.scale,.986)}for(let i=particles.length-1;i>=0;i--)if(particles[i].age>=particles[i].life){particles[i].hidden=true;particles.splice(i,1)}for(const w of waves){w.age+=dt;const s=.2+w.age*7.8;w.scale=V(s,.018,s);w.alpha=.55*(1-w.age/w.life)}for(let i=waves.length-1;i>=0;i--)if(waves[i].age>=waves[i].life){waves[i].hidden=true;waves.splice(i,1)}}

function win(){running=false;const used=6-shots;ui.resultEye.textContent='Sektor eliminert';ui.resultTitle.textContent='Klarert';ui.stars.textContent=used<=2?'★★★':used<=4?'★★☆':'★☆☆';ui.resultText.textContent=bestCombo>1?'Kjedereaksjonen rev hele installasjonen i stykker.':'Alle reaktorkjerner er ødelagt.';ui.finalScore.textContent=score.toLocaleString('nb-NO');ui.usedShots.textContent=used;ui.bestCombo.textContent='x'+bestCombo;ui.next.textContent='Neste sektor';ui.result.classList.add('show');try{localStorage.setItem('shattercore-level',Math.max(Number(localStorage.getItem('shattercore-level')||1),level+1))}catch(e){};tone(340,.3,'sine',.07,540)}

function lose(){if(won)return;running=false;ui.resultEye.textContent='Sektor står';ui.resultTitle.textContent='Ingen skudd';ui.stars.textContent='☆☆☆';ui.resultText.textContent='Bruk eksplosiver, rikosjetter eller et annet våpen for å nå kjernene.';ui.finalScore.textContent=score.toLocaleString('nb-NO');ui.usedShots.textContent=6;ui.bestCombo.textContent='x'+bestCombo;ui.next.textContent='Prøv igjen';ui.result.classList.add('show')}

let dtGlobal=.016;

function trajectory(){if(!drag||!running)return;const d=dir(),speed=(weapon==='breaker'?11.2:12.8)+aim.power*(weapon==='breaker'?8.5:11.5),o=muzzle();gl.disable(gl.DEPTH_TEST);for(let i=1;i<18;i++){const t=i*.075,p=add(add(o,mul(d,speed*t)),V(0,-4.45*t*t,0)),s=M.project(p,vp,W,H);if(!s.visible)continue;const size=clamp(5-i*.18,2,5);const el=trajectoryDots[i]||(trajectoryDots[i]=document.createElement('i'));if(!el.parentNode){el.style.cssText='position:absolute;border-radius:50%;background:#dffcff;box-shadow:0 0 9px #67f7ff;pointer-events:none;z-index:3';app.appendChild(el)}el.style.display='block';el.style.width=el.style.height=size+'px';el.style.left=(s.x-size/2)+'px';el.style.top=(s.y-size/2)+'px';el.style.opacity=String(1-i/20)}gl.enable(gl.DEPTH_TEST)}

const trajectoryDots=[];
function hideDots(){trajectoryDots.forEach(e=>e.style.display='none')}

function updateCamera(dt){let goal=V(0,4.25,11.25),look=V(0,1.35,-4.85);if(projectiles.length){const p=projectiles[0];goal=V(clamp(p.pos.x*.16,-.9,.9),4.05+clamp(p.pos.y*.07,0,.35),10.85+clamp((p.pos.z-3)*.045,-.55,0));look=V(p.pos.x*.25,clamp(p.pos.y*.35+.8,1.1,2.5),clamp(p.pos.z-3,-7,-3.8))}const k=1-Math.exp(-dt*3.2);camera=add(camera,mul(sub(goal,camera),k));camTarget=add(camTarget,mul(sub(look,camTarget),k))}

function render(t){updateCannon();gl.viewport(0,0,canvas.width,canvas.height);gl.enable(gl.DEPTH_TEST);gl.enable(gl.CULL_FACE);gl.cullFace(gl.BACK);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.clearColor(.018,.018,.045,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);const sh=shake>0?V(rnd(-shake,shake)*.025,rnd(-shake,shake)*.025,rnd(-shake,shake)*.018):V();shake*=.88;fovKick*=.88;const cp=add(camera,sh);proj=M.persp(.74+fovKick,W/H,.1,70);view=M.look(cp,camTarget,V(0,1,0));vp=M.mul(proj,view);gl.uniform3fv(loc.cam,[cp.x,cp.y,cp.z]);gl.uniform3fv(loc.light,[.42,.82,.35]);gl.uniform3fv(loc.fog,[.025,.024,.065]);const opaque=objs.filter(o=>!o.hidden&&(o.alpha??1)>=.95),transparent=objs.filter(o=>!o.hidden&&(o.alpha??1)<.95);opaque.forEach(draw);gl.depthMask(false);transparent.sort((a,b)=>len(sub(b.pos,cp))-len(sub(a.pos,cp))).forEach(draw);gl.depthMask(true);hideDots();trajectory()}

function loop(now){requestAnimationFrame(loop);const dt=Math.min((now-clockLast)/1000,.033);clockLast=now;dtGlobal=dt;if(running){updateProjectiles(dt);updateBlocks(dt);updateParticles(dt);updateCores(now/1000);if(shots<=0&&!projectiles.length&&!won&&!failTimer)failTimer=setTimeout(lose,650)}updateCamera(dt);render(now/1000);frameCount++;if(now-fpsTime>1000){fps=Math.round(frameCount*1000/(now-fpsTime));frameCount=0;fpsTime=now;window.__gameDebug.fps=fps}}

function resize(){const r=app.getBoundingClientRect();W=r.width;H=r.height;dpr=1;canvas.width=Math.round(W*dpr);canvas.height=Math.round(H*dpr);canvas.style.width=W+'px';canvas.style.height=H+'px'}
addEventListener('resize',resize,{passive:true});
resize();

$('#startbtn').onclick=()=>{unlock();started=true;ui.start.classList.remove('show');reset(false)};
$('#restart').onclick=()=>reset(false);
$('#sound').onclick=e=>{soundOn=!soundOn;e.currentTarget.textContent=soundOn?'◖':'×';if(soundOn){unlock();tone(430,.08,'sine',.04,100)}};
ui.next.onclick=()=>{if(ui.next.textContent==='Prøv igjen')reset(true);else{level=level%layouts.length+1;reset(true)}};
$('#again').onclick=()=>reset(false);

window.__gameDebug={get state(){return{level,shots,score,cores:cores.filter(c=>c.alive).length,projectiles:projectiles.length,blocks:blocks.filter(b=>!b.hidden).length,running,won,weapon,fps}},fps:0,reset:()=>reset(false),shoot:()=>shoot(),setAim:(yaw,pitch,power)=>{aim={yaw,pitch,power};updateUI()},destroyAll:()=>cores.forEach(c=>c.alive&&damageCore(c,10)),forceWin:()=>{for(const c of cores){c.alive=false;c.hidden=true;if(c.shieldObj)c.shieldObj.hidden=true}won=true;updateUI();win()},nextLevel:()=>{level=level%layouts.length+1;reset(true)},forceLose:()=>lose()};

requestAnimationFrame(loop);
