'use strict';

const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];

const canvas=$('#game'),app=$('#app'),ui={sector:$('#sector'),cores:$('#cores'),shots:$('#shots'),score:$('#score'),aimbox:$('#aimbox'),aimtext:$('#aimtext'),power:$('#power'),fill:$('#fill'),toast:$('#toast'),flash:$('#flash'),start:$('#start'),result:$('#result'),resultEye:$('#resultEye'),resultTitle:$('#resultTitle'),stars:$('#stars'),resultText:$('#resultText'),finalScore:$('#finalScore'),usedShots:$('#usedShots'),bestCombo:$('#bestCombo'),next:$('#next'),debug:$('#debug')};

let gl;
try{gl=canvas.getContext('webgl',{alpha:false,antialias:false,powerPreference:'high-performance',premultipliedAlpha:false})||canvas.getContext('experimental-webgl')}catch(e){}
if(!gl){$('#unsupported').classList.add('show');throw new Error('WebGL unavailable')}

const VS=`attribute vec3 aPos;attribute vec3 aNormal;uniform mat4 uMVP;uniform mat4 uModel;uniform vec3 uColor;uniform vec3 uEmissive;uniform float uAlpha;varying vec3 vN;varying vec3 vW;varying vec3 vC;varying vec3 vE;varying float vA;void main(){vec4 w=uModel*vec4(aPos,1.0);vW=w.xyz;vN=normalize(mat3(uModel)*aNormal);vC=uColor;vE=uEmissive;vA=uAlpha;gl_Position=uMVP*vec4(aPos,1.0);}`;

const FS=`precision mediump float;varying vec3 vN;varying vec3 vW;varying vec3 vC;varying vec3 vE;varying float vA;uniform vec3 uCam;uniform vec3 uLight;uniform vec3 uFog;void main(){float d=max(dot(normalize(vN),normalize(uLight)),0.0);float rim=pow(1.0-max(dot(normalize(vN),normalize(uCam-vW)),0.0),2.2);vec3 col=vC*(0.22+d*0.78)+vE+rim*vE*0.38;float dist=length(uCam-vW);float fog=clamp((dist-13.0)/30.0,0.0,0.78);col=mix(col,uFog,fog);gl_FragColor=vec4(col,vA);}`;

function shader(type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s));return s}
const prog=gl.createProgram();
gl.attachShader(prog,shader(gl.VERTEX_SHADER,VS));
gl.attachShader(prog,shader(gl.FRAGMENT_SHADER,FS));
gl.linkProgram(prog);
if(!gl.getProgramParameter(prog,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(prog));
gl.useProgram(prog);

const loc={pos:gl.getAttribLocation(prog,'aPos'),normal:gl.getAttribLocation(prog,'aNormal'),mvp:gl.getUniformLocation(prog,'uMVP'),model:gl.getUniformLocation(prog,'uModel'),color:gl.getUniformLocation(prog,'uColor'),emissive:gl.getUniformLocation(prog,'uEmissive'),alpha:gl.getUniformLocation(prog,'uAlpha'),cam:gl.getUniformLocation(prog,'uCam'),light:gl.getUniformLocation(prog,'uLight'),fog:gl.getUniformLocation(prog,'uFog')};

const V=(x=0,y=0,z=0)=>({x,y,z}),add=(a,b)=>V(a.x+b.x,a.y+b.y,a.z+b.z),sub=(a,b)=>V(a.x-b.x,a.y-b.y,a.z-b.z),mul=(a,s)=>V(a.x*s,a.y*s,a.z*s),dot=(a,b)=>a.x*b.x+a.y*b.y+a.z*b.z,len=a=>Math.hypot(a.x,a.y,a.z),norm=a=>{const l=len(a)||1;return V(a.x/l,a.y/l,a.z/l)},cross=(a,b)=>V(a.y*b.z-a.z*b.y,a.z*b.x-a.x*b.z,a.x*b.y-a.y*b.x),clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),rnd=(a,b)=>a+Math.random()*(b-a),hex=h=>[(h>>16&255)/255,(h>>8&255)/255,(h&255)/255];
