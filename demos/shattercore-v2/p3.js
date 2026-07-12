let W=0,H=0,dpr=1,proj,view,vp,camera=V(0,4.25,11.25),camTarget=V(0,1.35,-4.85),shake=0,fovKick=0;

function bind(m){gl.bindBuffer(gl.ARRAY_BUFFER,m.b);gl.vertexAttribPointer(loc.pos,3,gl.FLOAT,false,24,0);gl.vertexAttribPointer(loc.normal,3,gl.FLOAT,false,24,12);gl.enableVertexAttribArray(loc.pos);gl.enableVertexAttribArray(loc.normal);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,m.ib)}

function draw(o){if(o.hidden||o.alpha<=0)return;const model=M.trs(o.pos,o.rot,o.scale),mvp=M.mul(vp,model),c=hex(o.color),e=hex(o.emissive||0);gl.uniformMatrix4fv(loc.model,false,model);gl.uniformMatrix4fv(loc.mvp,false,mvp);gl.uniform3fv(loc.color,c);gl.uniform3fv(loc.emissive,e);gl.uniform1f(loc.alpha,o.alpha??1);bind(meshes[o.mesh||'cube']);gl.drawElements(gl.TRIANGLES,meshes[o.mesh||'cube'].count,gl.UNSIGNED_SHORT,0)}

const objs=[],blocks=[],cores=[],barrels=[],projectiles=[],particles=[],waves=[],decor=[],cannonParts=[];
let level=1,shots=6,score=0,bestCombo=1,combo=0,lastKill=0,running=false,won=false,failTimer=0,weapon='pulse',drag=false,startP={x:0,y:0},aim={yaw:0,pitch:.20,power:.5},clockLast=performance.now(),fps=60,frameCount=0,fpsTime=performance.now(),soundOn=true,audio=null,started=false;

function O(mesh,pos,scale,color,emissive=0,alpha=1){const o={mesh,pos,scale,rot:V(),color,emissive,alpha,hidden:false};objs.push(o);return o}

function clearLevel(){for(const a of [blocks,cores,barrels,projectiles,particles,waves,cannonParts])a.length=0;objs.length=0;decor.length=0;won=false;failTimer=0;combo=0;bestCombo=1;shake=0;fovKick=0}

function block(x,y,z,sx,sy,sz,type='steel'){const palette={glass:[0x5474a8,0x1e5cff,.48,1],steel:[0x555b79,0x11142b,1,3],stone:[0x74768a,0x0b0c12,1,2],crate:[0xc96a2f,0x381208,1,1]};const q=palette[type],o=O('cube',V(x,y,z),V(sx,sy,sz),q[0],q[1],q[2]);o.kind='block';o.type=type;o.vel=V();o.ang=V();o.dynamic=false;o.hp=q[3];o.radius=Math.hypot(sx,sy,sz)*.5;blocks.push(o);return o}

function core(x,y,z,shield=0,moving=false){const o=O('sphere',V(x,y,z),V(.62,.62,.62),0xf4f6ff,0xff37bd,1);o.kind='core';o.hp=1;o.shield=shield;o.alive=true;o.base=V(x,y,z);o.phase=rnd(0,6.2);o.moving=moving;o.r=.33;cores.push(o);if(shield){const s=O('sphere',V(x,y,z),V(1.05,1.05,1.05),0x3ddfff,0x0d638e,.25);s.kind='shield';s.owner=o;o.shieldObj=s}return o}

function barrel(x,y,z){const o=O('cyl',V(x,y,z),V(.58,1.05,.58),0xc83d48,0x6c0812,1);o.kind='barrel';o.hp=1;o.vel=V();o.dynamic=false;o.radius=.48;barrels.push(o);return o}
