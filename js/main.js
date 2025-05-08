// js/main.js
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

// —— 1) Preloader “barrier” flags ——
let pageReady   = false;
let modelReady  = false;

function maybeStartAnimations() {
  if (pageReady && modelReady) {
    // hide spinner
    document.body.classList.add('loaded');
    // now kick off your model animations
    animateRotation();
    smoothScaleModel();
  }
}

// wait for all HTML/CSS/img/scripts to finish
window.addEventListener('load', () => {
  pageReady = true;
  maybeStartAnimations();
});

// —— 2) three.js setup ——
const scene    = new THREE.Scene();
const camera   = new THREE.OrthographicCamera(
  -innerWidth/32, innerWidth/32,
   innerHeight/32, -innerHeight/32,
   1, 1000
);
camera.position.set(10,10,10);
camera.lookAt(0,0,0);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(innerWidth, innerHeight);
document.getElementById("container3D").appendChild(renderer.domElement);

// lights
const topLight    = new THREE.DirectionalLight(0xffffff, 1);
topLight.position.set(500,500,500);
scene.add(topLight);
scene.add(new THREE.AmbientLight(0x333333,1));

// loader + model
const loader   = new GLTFLoader();
let roomObject;
let rotating = true;

loader.load(
  './3dModels/Room/scene.gltf',
  (gltf) => {
    roomObject = gltf.scene;
    // start tiny & low
    roomObject.scale.set(0.05,0.05,0.05);
    roomObject.position.y = -20;
    scene.add(roomObject);
    // signal ready
    modelReady = true;
    maybeStartAnimations();
  },
  xhr => console.log( (xhr.loaded/xhr.total*100).toFixed(0) + '% loaded' ),
  err => console.error('Model load error:', err)
);

// track mouse for subtle rotation
let mouseX = 0;
window.addEventListener('mousemove', e => {
  mouseX = (e.clientX/window.innerWidth)*2 - 1;
});

// —— 3) animation helpers ——
function animateRotation() {
  if (!roomObject) return;
  const totalRot = Math.PI*2;
  let startTime = null;

  function easeInOut(t) {
    return t<0.5
      ? 4*t*t*t
      : 1 - Math.pow(-2*t+2,3)/2;
  }

  function frame(ts) {
    if (!startTime) startTime = ts;
    const elapsed = (ts - startTime)/1000 * 1.5; // speed factor
    const prog    = Math.min(elapsed, 1);
    roomObject.rotation.y = easeInOut(prog)*totalRot;
    if (prog < 1) requestAnimationFrame(frame);
    else rotating = false;
  }
  requestAnimationFrame(frame);
}

function smoothScaleModel() {
  if (!roomObject) return;
  const w = window.innerWidth;
  let target = w<700 ? 0.5 : w<1000 ? 0.8 : 1;
  const start = roomObject.scale.x;
  const duration = 700; // ms
  const t0 = performance.now();

  function frame() {
    const now  = performance.now();
    const prog = Math.min((now-t0)/duration,1);
    const s    = start + (target - start)*prog;
    roomObject.scale.set(s,s,s);
    if (prog<1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

// —— 4) render loop + resize ——
function renderLoop() {
  requestAnimationFrame(renderLoop);
  if (!rotating && roomObject) {
    roomObject.rotation.y = mouseX * Math.PI * 0.01;
  }
  renderer.render(scene, camera);
}
renderLoop();

window.addEventListener('resize', () => {
  camera.left   = -innerWidth/32;
  camera.right  =  innerWidth/32;
  camera.top    =  innerHeight/32;
  camera.bottom = -innerHeight/32;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  smoothScaleModel();
});
