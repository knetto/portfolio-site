import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

// Create the scene
const scene = new THREE.Scene();

// Set up camera parameters
const width = window.innerWidth;
const height = window.innerHeight;
const aspect = width / height;
const d = 50; // Distance from the camera to the scene (zoom level)

// Create an Orthographic camera for isometric view
const camera = new THREE.OrthographicCamera(
  -d * aspect,  // Left
  d * aspect,   // Right
  d,            // Top
  -d,           // Bottom
  1,            // Near
  1000          // Far
);

// Position the camera for an isometric view
camera.position.set(d, d, d); // X, Y, Z position
camera.lookAt(new THREE.Vector3(0, 0, 0)); // Look at the origin

// Create a renderer and set its size
const renderer = new THREE.WebGLRenderer({ alpha: true }); // Alpha allows transparent background
renderer.setSize(window.innerWidth, window.innerHeight);

// Append the renderer to the DOM
document.getElementById("container3D").appendChild(renderer.domElement);

// Load the 3D model (replace with the correct path to your model)
const loader = new GLTFLoader();
let roomObject;
let rotating = true; // Flag to control rotation animation

// After loading the room model
loader.load(
  './3dModels/Room/scene.gltf',  // Path to the 3D model file
  function (gltf) {
    // Add the loaded model to the scene
    roomObject = gltf.scene;

    // Scale the object to make it bigger (don't change this scale dynamically on resize)
    roomObject.scale.set(1.3, 1.3, 1.3);  // Keep the scale constant

    // Add the model to the scene
    scene.add(roomObject);
    
    // Start the rotation animation
    animateRotation();
  },
  function (xhr) {
    // Track loading progress
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    // Log any loading errors
    console.error('Error loading model: ', error);
  }
);

// Add some lights to illuminate the model
const topLight = new THREE.DirectionalLight(0xffffff, 1);
topLight.position.set(500, 500, 500); // Set position of light
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0x333333, 1);  // Low-intensity light
scene.add(ambientLight);

// Track mouse movement to rotate the object
let mouseX = 0; // Mouse X position
window.addEventListener('mousemove', (event) => {
  // Get the mouse position in relation to the window width
  mouseX = (event.clientX / window.innerWidth) * 2 - 1; // Normalize to [-1, 1]
});

// Function to animate the model's rotation with ease-in and ease-out effect
function animateRotation() {
  if (rotating && roomObject) {
    const totalRotation = Math.PI * 2; // Full 360 degrees in radians
    let rotationProgress = 0;
    let startTime = null;

    // Ease-in-out function for smooth rotation
    function easeInOut(t) {
      if (t < 0.5) {
        return 4 * t * t * t; // Ease-in: acceleration
      } else {
        return 1 - Math.pow(-2 * t + 2, 3) / 2; // Ease-out: deceleration
      }
    }

    // Rotate function that uses ease-in-out
    function rotate(timestamp) {
      if (!startTime) startTime = timestamp; // Set the start time once

      // Calculate elapsed time as a fraction of the total animation duration
      const elapsedTime = (timestamp - startTime) / 1000; // Convert to seconds
      let progress = elapsedTime * 1.5; // Adjust multiplier for faster/slower animation

      // Apply ease-in-out effect to the progress
      let easedProgress = easeInOut(progress);

      // Update rotation based on eased progress
      rotationProgress = easedProgress * totalRotation;

      if (rotationProgress < totalRotation) {
        roomObject.rotation.y = rotationProgress;
        requestAnimationFrame(rotate); // Continue rotating
      } else {
        roomObject.rotation.y = totalRotation; // Ensure it reaches 360 degrees exactly
        rotating = false; // Stop rotation after completing 360 degrees
      }
    }

    rotate(0); // Start rotating with ease-in-out effect
  }
}

// Render the scene
function animate() {
  requestAnimationFrame(animate);

  // Slightly rotate the object based on mouseX movement
  if (!rotating && roomObject) {
    roomObject.rotation.y = mouseX * Math.PI * 0.01; // Scale rotation to make it subtle
  }

  // Render the scene from the camera's perspective
  renderer.render(scene, camera);
}

// Start the animation loop (rendering)
animate();

// Resize the renderer if the window is resized
// Function to adjust scale based on screen width
function adjustScale() {
  if (roomObject) {
    if (window.innerWidth < 900) {
      roomObject.scale.set(0.85, 0.85, 0.85); // Scale down for smaller screens
      roomObject.position.set(0, 15, 0); // Move the object up by 200 pixels
    } else {
      roomObject.scale.set(1.3, 1.3, 1.2); // Original scale for larger screens
      roomObject.position.set(0, 0, 0); // Reset position to default
    }
  }
}

// Call adjustScale on window resize
window.addEventListener("resize", function () {
  // Update the renderer size
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Update camera aspect ratio and projection matrix
  const newAspect = window.innerWidth / window.innerHeight;

  // Adjust the camera's left and right properties based on the new aspect ratio
  camera.left = -d * newAspect;    // Update left based on the new aspect ratio
  camera.right = d * newAspect;    // Update right based on the new aspect ratio

  // Keep the top and bottom fixed, since these control vertical scaling (height)
  camera.top = d;                  // Keep the top value constant
  camera.bottom = -d;              // Keep the bottom value constant

  camera.aspect = newAspect;       // Update the camera aspect ratio
  camera.updateProjectionMatrix(); // Recalculate the projection matrix

  adjustScale(); // Adjust model scale
});

// Call adjustScale initially to set the scale based on the current screen width
adjustScale();
