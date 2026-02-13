// js/main.js
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// —— 1) State flags ——
let pageReady   = false;
let modelReady  = false;
let preloaderFinished = false;

// —— 2) GSAP Preloader Animation ——
function playPreloaderExit() {
  const preloader = document.getElementById('preloader');
  const spinner = document.querySelector('.spinner');
  
  const tl = gsap.timeline({
    onComplete: () => {
      preloaderFinished = true;
      startModelAnimations(); // ← triggers model AFTER preloader done
    }
  });
  
  tl.to(spinner, {
    scale: 1.2,
    duration: 0.3,
    ease: 'power2.out'
  })
  .to(preloader, {
    clipPath: 'circle(0% at 50% 50%)',
    duration: 2.2,
    ease: 'power4.inOut'
  }, '-=0.1')
  .to(spinner, {
    scale: 0,
    opacity: 0,
    duration: 0.3,
    ease: 'back.in(1.7)'
  }, '-=0.3')
  .set(preloader, {
    visibility: 'hidden',
    pointerEvents: 'none'
  });
}

// —— 3) Model Animation Trigger ——
function startModelAnimations() {
  if (!roomObject) return;
  
  // Dispatch event to tell script.js to start UI animations
  window.dispatchEvent(new CustomEvent('modelAnimationStarted'));
  
  animateRotation();
  smoothScaleModel();
}

// —— 4) three.js setup ——
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
    // hidden until preloader finishes
    roomObject.scale.set(0,0,0);
    roomObject.position.y = -20;
    scene.add(roomObject);
    
    modelReady = true;
    checkAllReady();
  },
  xhr => console.log( (xhr.loaded/xhr.total*100).toFixed(0) + '% loaded' ),
  err => console.error('Model load error:', err)
);

// —— 5) Ready Check ——
function checkAllReady() {
  // Only start preloader exit when BOTH page and model are ready
  if (pageReady && modelReady) {
    playPreloaderExit();
  }
}

window.addEventListener('load', () => {
  pageReady = true;
  checkAllReady();
});

// track mouse
let mouseX = 0;
window.addEventListener('mousemove', e => {
  mouseX = (e.clientX/window.innerWidth)*2 - 1;
});

// —— 6) animation helpers (unchanged logic) ——
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
    const elapsed = (ts - startTime)/1000 * 1.5;
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
  const duration = 700;
  const t0 = performance.now();

  function frame() {
    const now  = performance.now();
    const prog = Math.min((now-t0)/duration,1);
    const ease = 1 - Math.pow(1 - prog, 3);
    const s    = target * ease;
    roomObject.scale.set(s,s,s);
    if (prog<1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

// —— 7) render loop + resize ——
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