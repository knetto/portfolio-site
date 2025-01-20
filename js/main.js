import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

// Create the scene
const scene = new THREE.Scene();

// Create an Orthographic camera for isometric view
const camera = new THREE.OrthographicCamera(
  -innerWidth / 32, // Left
  innerWidth / 32,   // Right
  innerHeight / 32,  // Top
  -innerHeight / 32, // Bottom
  1,                // Near
  1000              // Far
);

// Set the camera position for an isometric view
camera.position.set(10, 10, 10);  // Position the camera at (10, 10, 10)
camera.lookAt(new THREE.Vector3(0, 0, 0)); // Make the camera look at the origin

// Create a renderer and set its size
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

// Append the renderer to the DOM
document.getElementById("container3D").appendChild(renderer.domElement);

// Load the 3D model (replace with the correct path to your model)
const loader = new GLTFLoader();
let roomObject;
let rotating = true; // Flag to control rotation animation

loader.load(
  './3dModels/Room/scene.gltf',  // Path to the 3D model file
  function (gltf) {
    // Add the loaded model to the scene
    roomObject = gltf.scene;

    // Scale the object to make it bigger (don't change this scale dynamically on resize)
    roomObject.scale.set(1, 1, 1);  // Keep the scale constant

    // Lower the model by adjusting its Y position (e.g., set to -1)
    roomObject.position.y = -20;

    // Add the model to the scene
    scene.add(roomObject);
    
    // Start the rotation animation
    animateRotation();

    resizeScaleModel()
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

// Function to adjust the scale of the model based on window width
function resizeScaleModel() {
  if (roomObject) {
    const width = window.innerWidth;

    // Define the breakpoints and scale factors
    let scaleFactor = 1;

    if (width < 700) {
      scaleFactor = 0.5; // Smaller screens
    } else if (width < 1000) {
      scaleFactor = 0.8; // Medium screens
    } else {
      scaleFactor = 1; // Larger screens
    }

    // Adjust the model's scale based on the factor
    roomObject.scale.set(scaleFactor, scaleFactor, scaleFactor);
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

// Resize the renderer and model if the window is resized
window.addEventListener("resize", () => {
  // Adjust camera frustum for isometric view
  camera.left = -innerWidth / 32;
  camera.right = innerWidth / 32;
  camera.top = innerHeight / 32;
  camera.bottom = -innerHeight / 32;
  camera.updateProjectionMatrix(); // Update the camera projection matrix after resizing

  // Resize the renderer
  renderer.setSize(innerWidth, innerHeight);

  // Call function to adjust the model scale
  resizeScaleModel();
  renderer.render(scene, camera);
});
