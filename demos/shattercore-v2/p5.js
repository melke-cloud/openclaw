function updateUI(){ui.sector.textContent='SEKTOR '+String(level).padStart(2,'0');ui.cores.textContent=cores.filter(c=>c.alive).length;ui.shots.textContent=shots;ui.score.textContent=String(score).padStart(4,'0');ui.power.textContent=Math.round(aim.power*100)+'%';ui.fill.style.width=Math.round(aim.power*100)+'%';$$('.weapon').forEach(b=>b.classList.toggle('active',b.dataset.weapon===weapon))}

function pointer(e){const r=canvas.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}}

canvas.addEventListener('pointerdown',e=>{if(!running||won||shots<=0||ui.start.classList.contains('show')||ui.result.classList.contains('show'))return;drag=true;startP=pointer(e);canvas.setPointerCapture?.(e.pointerId);ui.aimtext.textContent='Juster retning · høyde · kraft';e.preventDefault()});

canvas.addEventListener('pointermove',e=>{if(!drag)return;const p=pointer(e),dx=p.x-startP.x,dy=p.y-startP.y;aim.yaw=clamp(dx/W*1.55,-.76,.76);aim.pitch=clamp(.20-dy/H*1.45,.06,.78);aim.power=clamp(.38+Math.hypot(dx,dy)/Math.min(W,H)*1.15,.38,1);updateUI();e.preventDefault()});

canvas.addEventListener('pointerup',e=>{if(!drag)return;drag=false;shoot();ui.aimtext.textContent='Dra for å sikte';e.preventDefault()});
canvas.addEventListener('pointercancel',()=>drag=false);

$$('.weapon').forEach(b=>b.onclick=()=>{weapon=b.dataset.weapon;updateUI();tone(430,.06,'sine',.025,90)});

function unlock(){if(!audio)audio=new (window.AudioContext||window.webkitAudioContext);audio.resume?.()}

function tone(f=180,d=.1,type='sine',gain=.05,slide=0){if(!soundOn||!audio)return;const t=audio.currentTime,o=audio.createOscillator(),g=audio.createGain();o.type=type;o.frequency.setValueAtTime(f,t);o.frequency.exponentialRampToValueAtTime(Math.max(35,f+slide),t+d);g.gain.setValueAtTime(gain,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g).connect(audio.destination);o.start(t);o.stop(t+d)}

function dir(yaw=aim.yaw,pitch=aim.pitch){return norm(V(Math.sin(yaw)*Math.cos(pitch),Math.sin(pitch),-Math.cos(yaw)*Math.cos(pitch)))}

const muzzle=()=>V(0,.98,3.48);

function addProjectile(yaw=aim.yaw,pitch=aim.pitch,delay=0){const heavy=weapon==='breaker',p=O('sphere',muzzle(),V(heavy?.48:.34,heavy?.48:.34,heavy?.48:.34),heavy?0xffd372:0xe9feff,heavy?0xff6a18:0x39eaff,1);p.kind='projectile';p.vel=mul(dir(yaw,pitch),(heavy?11.2:12.8)+(aim.power*(heavy?8.5:11.5)));p.radius=heavy?.24:.17;p.age=-delay;p.alive=true;p.heavy=heavy;p.pulse=weapon==='pulse';projectiles.push(p);return p}

function shoot(){if(shots<=0||won)return;unlock();shots--;if(weapon==='split'){addProjectile(aim.yaw,aim.pitch,.0);addProjectile(aim.yaw-.075,aim.pitch+.015,.09);addProjectile(aim.yaw+.075,aim.pitch+.015,.18)}else addProjectile();tone(110,.18,'sawtooth',.075,520);shake=2.2;fovKick=.045;burst(muzzle(),0x67f7ff,12,3.5);ui.aimbox.classList.add('dim');setTimeout(()=>ui.aimbox.classList.remove('dim'),260);updateUI()}
