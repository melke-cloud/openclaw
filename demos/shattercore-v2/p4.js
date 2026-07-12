function baseScene(){
  O('cube',V(0,-.18,-3.8),V(15,.38,24),0x111428,0x090b16,1);
  O('cube',V(0,5.5,-22),V(30,12,.35),0x08091b,0x16103e,1);
  O('sphere',V(0,8.5,-20),V(6.5,6.5,6.5),0x20164e,0x2b1468,.32);
  for(const x of [-7.25,7.25])O('cube',V(x,.08,-3.8),V(.16,.22,24),0x44318d,0x7047ff,1);
  for(const x of [-3.8,3.8])O('cube',V(x,.035,-5.4),V(.055,.04,20),x<0?0x66f5ff:0xff4ecb,x<0?0x66f5ff:0xff4ecb,.92);
  for(let i=0;i<4;i++){const side=i%2?1:-1,z=2-i*5.2,h=2.4+(i%2)*1.0;const d=O('cube',V(side*(6.5+(i%2)*.45),h/2,z),V(.65,h,.75),0x111326,i%3?0x160f3c:0x32102f,1);decor.push(d);const l=O('cube',V(side*6.12,h*.58,z),V(.035,.5,.22),side<0?0x66f5ff:0xff4ecb,side<0?0x66f5ff:0xff4ecb,.95);decor.push(l)}
  for(const z of [-6.5,-13.5]){for(const x of [-5.6,5.6])decor.push(O('cube',V(x,2.35,z),V(.28,4.7,.4),0x181a34,0x26175e,1));decor.push(O('cube',V(0,4.55,z),V(11.5,.24,.38),0x191b39,0x552bba,1))}
  const base=O('cyl',V(0,.37,5.72),V(1.28,.48,1.28),0x30375c,0x161b3d,1),ring=O('cyl',V(0,.62,5.72),V(.92,.15,.92),0x6244c2,0x7b51ff,1),pivot=O('sphere',V(0,.86,5.72),V(.72,.58,.72),0x4e577d,0x111833,1),bar=O('cyl',V(0,.96,4.72),V(.38,2.05,.38),0x3a4369,0x2858a2,1),muzzleRing=O('cyl',V(0,.96,3.68),V(.53,.18,.53),0x67eaf3,0x67f7ff,1);bar.rot.x=-Math.PI/2;muzzleRing.rot.x=-Math.PI/2;cannonParts.push(base,ring,pivot,bar,muzzleRing)
}

const layouts=[
()=>{block(-2.3,.72,-4.9,.72,1.44,.75,'steel');block(2.3,.72,-4.9,.72,1.44,.75,'steel');block(0,.42,-4.9,5.0,.84,.82,'glass');block(0,1.16,-4.95,4.25,.32,.72,'steel');core(-1.45,1.72,-4.88);core(0,1.72,-4.88);core(1.45,1.72,-4.88)},
()=>{for(const x of [-2.35,0,2.35]){block(x,.65,-6,.78,1.3,.75,'stone');block(x,1.5,-6,1.3,.38,.82,'steel')}barrel(-1.15,.55,-5.85);barrel(1.15,.55,-5.85);core(-2.35,2.02,-6);core(0,2.02,-6,1);core(2.35,2.02,-6)},
()=>{block(0,.28,-6.5,6.3,.55,.9,'stone');for(const x of [-2.7,-1.35,0,1.35,2.7])block(x,1,-6.5,.34,1.45,.58,'glass');block(0,1.88,-6.5,6.1,.35,.82,'steel');core(-2.05,2.5,-6.45,0,true);core(0,2.5,-6.45,2);core(2.05,2.5,-6.45,0,true)},
()=>{for(let r=0;r<3;r++)for(let c=0;c<5;c++)block((c-2)*1.08,.38+r*.76,-7+(r%2)*.18,.92,.64,.82,r===1?'glass':'steel');barrel(-1.62,.45,-6.4);barrel(1.62,.45,-6.4);core(-2.15,2.78,-6.9,1);core(-.72,2.78,-6.9);core(.72,2.78,-6.9);core(2.15,2.78,-6.9,1)},
()=>{for(const x of [-2.8,2.8]){block(x,1.3,-7.3,.75,2.6,.9,'stone');block(x,2.78,-7.3,1.5,.35,.95,'steel');core(x,3.3,-7.3,1)}block(0,.32,-7.3,4.8,.64,.95,'glass');block(0,1.22,-7.3,.9,1.8,.9,'steel');barrel(-1.35,.55,-7);barrel(1.35,.55,-7);core(0,2.35,-7.3,2);core(-1.45,1.18,-7.25);core(1.45,1.18,-7.25)},
()=>{block(0,.3,-8,7,.6,1,'stone');for(let i=0;i<7;i++){const x=(i-3)*1.05;block(x,.95,-8,.48,1.3,.75,i%2?'steel':'glass')}block(0,1.77,-8,7,.34,.92,'steel');for(const x of [-2.65,-1.32,0,1.32,2.65])core(x,2.45,-7.95,Math.abs(x)<.2?3:1,Math.abs(x)>2);barrel(-2.05,.58,-7.45);barrel(2.05,.58,-7.45)}];

function reset(keepScore=true){clearLevel();baseScene();if(!keepScore)score=0;shots=6;layouts[(level-1)%layouts.length]();running=true;ui.result.classList.remove('show');ui.aimbox.classList.remove('dim');aim={yaw:0,pitch:.20,power:.5};updateUI();camera=V(0,4.25,11.25);camTarget=V(0,1.35,-4.85)}
