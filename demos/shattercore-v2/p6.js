function burst(pos,color,count=20,speed=4){while(particles.length>150){const p=particles.shift();p.hidden=true}for(let i=0;i<count;i++){const p=O('cube',V(pos.x,pos.y,pos.z),V(rnd(.025,.08),rnd(.025,.08),rnd(.025,.08)),color,color,1);p.kind='particle';p.vel=mul(norm(V(rnd(-1,1),rnd(-.1,1.3),rnd(-1,1))),rnd(speed*.35,speed));p.life=rnd(.35,.95);p.age=0;p.ang=V(rnd(-8,8),rnd(-8,8),rnd(-8,8));particles.push(p)}}

function wave(pos,color=0x67f7ff){const w=O('cyl',V(pos.x,.04,pos.z),V(.2,.018,.2),color,color,.6);w.kind='wave';w.age=0;w.life=.5;waves.push(w)}

function toast(text,color='#67f7ff'){ui.toast.textContent=text;ui.toast.style.boxShadow=`0 0 30px ${color}`;ui.toast.classList.remove('show');void ui.toast.offsetWidth;ui.toast.classList.add('show');setTimeout(()=>ui.toast.classList.remove('show'),720)}

function flash(a=.26){ui.flash.style.transition='none';ui.flash.style.opacity=a;requestAnimationFrame(()=>{ui.flash.style.transition='opacity .22s';ui.flash.style.opacity=0})}

function aabbHit(p,b){const sx=b.scale.x*.5,sy=b.scale.y*.5,sz=b.scale.z*.5,q=V(clamp(p.pos.x,b.pos.x-sx,b.pos.x+sx),clamp(p.pos.y,b.pos.y-sy,b.pos.y+sy),clamp(p.pos.z,b.pos.z-sz,b.pos.z+sz)),d=sub(p.pos,q);return len(d)<p.radius?{q,n:norm(d.x||d.y||d.z?d:sub(p.pos,b.pos))}:null}

function activate(b,impulse){b.dynamic=true;b.vel=add(b.vel||V(),impulse);b.ang=V(rnd(-2.6,2.6),rnd(-2.6,2.6),rnd(-2.6,2.6))}

function damageBlock(p,b,hit){const speed=len(p.vel),power=p.heavy?2:1;b.hp-=power;activate(b,add(mul(hit.n,speed*.18),V(0,speed*.12,0)));p.vel=mul(sub(p.vel,mul(hit.n,2*dot(p.vel,hit.n))),p.heavy?.3:.52);score+=b.type==='glass'?120:55;if(b.hp<=0){b.hidden=true;burst(b.pos,b.type==='glass'?0x6d8dff:0xb8c4ff,b.type==='glass'?26:16,b.type==='glass'?5.6:3.4);if(p.pulse)explosion(b.pos,1.35,1.9,false)}tone(b.type==='glass'?220:95,.09,b.type==='glass'?'square':'triangle',.04,b.type==='glass'?220:-20);shake=Math.min(5,1+speed*.15);updateUI()}

function damageCore(c,amount=1){if(!c.alive)return;if(c.shield>0){c.shield-=amount;burst(c.pos,0x67f7ff,28,5.2);tone(210,.14,'sawtooth',.06,280);toast('SKJOLD BRUTT','#67f7ff');if(c.shield<=0&&c.shieldObj)c.shieldObj.hidden=true;return}c.hp-=amount;if(c.hp>0)return;c.alive=false;c.hidden=true;if(c.shieldObj)c.shieldObj.hidden=true;const now=performance.now();combo=now-lastKill<1700?combo+1:1;bestCombo=Math.max(bestCombo,combo);lastKill=now;score+=1000*combo;burst(c.pos,0xff4ecb,52,7.3);burst(c.pos,0x67f7ff,30,5.3);wave(c.pos,0xff4ecb);explosion(c.pos,2.5,5.8,true);shake=8;fovKick=.09;flash(.33);tone(175,.24,'sawtooth',.09,620);toast(combo>1?'KJERNE x'+combo:'KJERNE KNUST','#ff4ecb');updateUI();if(cores.every(x=>!x.alive)){won=true;setTimeout(win,900)}}

function explodeBarrel(b){if(b.hidden)return;b.hidden=true;score+=300;burst(b.pos,0xff654f,54,7);burst(b.pos,0xffc466,25,4.8);wave(b.pos,0xff654f);explosion(b.pos,2.8,7,true);shake=9;flash(.25);tone(70,.28,'sawtooth',.1,300);toast('KJEDEREAKSJON','#ff765f');updateUI()}
