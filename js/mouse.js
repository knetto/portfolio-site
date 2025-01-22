// JavaScript for the custom cursor with tail effect
console.clear();

const TAIL_LENGTH = 20;
const cursor = document.getElementById('cursor');
const defaultSize = 28;  // Default cursor size
const hoverSize = 90;    // Size of the cursor when hovering over an item
const clickIncrease = 15; // Amount to increase cursor size on click
const animationDuration = 200; // Duration of the size change animation in ms

let mouseX = 0;
let mouseY = 0;
let isHovering = false;  // Track if the cursor is hovering over an element
let cursorCircles;
let cursorHistory = Array(TAIL_LENGTH).fill({ x: 0, y: 0 });

function onMouseMove(event) {
  mouseX = event.clientX;
  mouseY = event.clientY;
}

function initCursor() {
  for (let i = 0; i < TAIL_LENGTH; i++) {
    let div = document.createElement('div');
    div.classList.add('cursor-circle');
    cursor.append(div);
  }
  cursorCircles = Array.from(document.querySelectorAll('.cursor-circle'));
}

function updateCursor() {
  cursorHistory.shift();
  cursorHistory.push({ x: mouseX, y: mouseY });

  for (let i = 0; i < TAIL_LENGTH; i++) {
    let current = cursorHistory[i];
    let next = cursorHistory[i + 1] || cursorHistory[TAIL_LENGTH - 1];

    let xDiff = next.x - current.x;
    let yDiff = next.y - current.y;

    current.x += xDiff * 0.35;
    current.y += yDiff * 0.35;
    cursorCircles[i].style.transform = `translate(-50%, -50%) translate(${current.x}px, ${current.y}px) scale(${i / TAIL_LENGTH})`;
  }
  requestAnimationFrame(updateCursor);
}

// Function to handle cursor size update with animation
function updateCursorSize(size, withTransition = false) {
  cursorCircles.forEach(circle => {
    if (withTransition) {
      circle.style.transition = `width ${animationDuration}ms ease-in-out, height ${animationDuration}ms ease-in-out`;
    } else {
      circle.style.transition = 'none';
    }
    circle.style.width = `${size}px`;
    circle.style.height = `${size}px`;
  });
}

// Add hover event listeners
const hoverElements = document.querySelectorAll('.hover-this');

hoverElements.forEach(element => {
  element.addEventListener('mouseenter', () => {
    isHovering = true;
    updateCursorSize(hoverSize, true); // Smooth transition on hover
  });

  element.addEventListener('mouseleave', () => {
    isHovering = false;
    updateCursorSize(defaultSize, true); // Smooth transition when leaving hover
  });
});

// Add mousedown event listener
document.addEventListener('mousedown', () => {
  const currentSize = isHovering ? hoverSize + clickIncrease : defaultSize + clickIncrease;
  updateCursorSize(currentSize, true); // Smooth transition on click
  
  // Smoothly return to the default or hover size after the click
  setTimeout(() => {
    const returnSize = isHovering ? hoverSize : defaultSize;
    updateCursorSize(returnSize, true); // Add smooth transition
  }, animationDuration);
});

// Event listener for mousemove
document.addEventListener('mousemove', onMouseMove, false);

// Initialize and start the cursor
initCursor();
updateCursor();