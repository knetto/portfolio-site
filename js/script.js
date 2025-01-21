// Initialize particlesJS
particlesJS.load('particles-js', 'particlesjs-config.json', function() {
  console.log('Particles.js config loaded');
});

// Wait for the page to load and then trigger the animation
window.addEventListener('load', function() {
let tl = gsap.timeline({ delay: 1.1 }); // Delay before starting animation

tl.to('.MainTitle div', {
  duration: 0.5, 
  y: 0, 
  opacity: 1, // Fade in as they slide up
  stagger: 0.3, // Stagger the animation
  ease: "power3.out", // Ease for a smoother animation
});
});

const container = document.querySelector(".container");

// Add the class to disable transitions
container.classList.add("no-transition");

// GSAP Animation
gsap.timeline({
onComplete: () => {
  // Remove the class after the animation is complete
  container.classList.remove("no-transition");
}
})
.fromTo(".main-h2", 
  { y: -50, opacity: 0 }, 
  { y: 0, opacity: 1, duration: 1, ease: "power2.out" }
)
.fromTo(".container", 
  { y: -50, opacity: 0 }, 
  { y: 0, opacity: 1, duration: 1, ease: "power2.out" },
  "-=1"
);

// JavaScript for the magnetic effect
const magneticElements = document.querySelectorAll('.hover-this');

magneticElements.forEach(element => {
const magneticEffect = (e) => {
  const rect = element.getBoundingClientRect();
  const offsetX = e.clientX - rect.left - rect.width / 2;
  const offsetY = e.clientY - rect.top - rect.height / 2;
  const maxDistance = 100; // Maximum distance for the magnetic effect
  const distance = Math.min(
    Math.sqrt(offsetX * offsetX + offsetY * offsetY),
    maxDistance
  );
  const strength = (1 - distance / maxDistance) * 70; // Effect strength
  const dx = (offsetX / rect.width) * strength;
  const dy = (offsetY / rect.height) * strength;

  element.style.transform = `translate(${dx}px, ${dy}px)`;
};

const resetEffect = () => {
  element.style.transform = `translate(0, 0)`;
};

element.addEventListener('mousemove', magneticEffect);
element.addEventListener('mouseleave', resetEffect);
});

// JavaScript for the custom cursor with tail effect
console.clear();

const TAIL_LENGTH = 20;
const cursor = document.getElementById('cursor');
const defaultSize = 28;  // Default cursor size
const hoverSize = 90;    // Size of the cursor when hovering over an item

let mouseX = 0;
let mouseY = 0;
let cursorCircles;
let cursorHistory = Array(TAIL_LENGTH).fill({ x: 0, y: 0 });

// Function to hide cursor if viewport width is smaller than 768px
function checkCursorVisibility() {
  if (window.innerWidth <= 768) {
    cursor.style.display = 'none';
  } else {
    cursor.style.display = 'block';
  }
}

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

// Event listener for mousemove
document.addEventListener('mousemove', onMouseMove, false);

// Initialize and start the cursor
initCursor();
updateCursor();

// Change cursor size on hover over elements with class 'hover-this'
const hoverElements = document.querySelectorAll('.hover-this');

hoverElements.forEach(element => {
  element.addEventListener('mouseenter', () => {
    // Increase cursor size when hovering over the element
    cursorCircles.forEach(circle => {
      circle.style.width = `${hoverSize}px`;
      circle.style.height = `${hoverSize}px`;
    });
  });

  element.addEventListener('mouseleave', () => {
    // Reset cursor size back to default
    cursorCircles.forEach(circle => {
      circle.style.width = `${defaultSize}px`;
      circle.style.height = `${defaultSize}px`;
    });
  });
});

// Add listener for window resize to dynamically check for cursor visibility
window.addEventListener('resize', checkCursorVisibility);

// Initial check to hide cursor if the screen width is below 768px
checkCursorVisibility();





let scrollBar = document.getElementById('scroll-bar');
let newSection = document.getElementById('new-section');
let menuSpans = document.querySelectorAll('.menu span'); // Select all spans inside .menu
let mainH2 = document.querySelector('.main-h2');

// To track scroll direction
let lastScrollPosition = 0;
const triggerPoint = window.innerHeight * 0.5; // Trigger point is 50% of the screen height

window.addEventListener('scroll', () => {
  const scrollPosition = window.scrollY; // Current scroll position

  if (scrollPosition >= triggerPoint) {
    // When scrolled fully, change navbar colors and other styles
    document.documentElement.style.setProperty('--navBackground', 'var(--black)');
    document.documentElement.style.setProperty('--navText', 'var(--white)');
    
    // Change background color for each .menu span and .main-h2 color
    menuSpans.forEach(span => {
      span.style.backgroundColor = 'var(--black)';
    });
    mainH2.style.color = 'var(--black)';
  } else {
    // Reset navbar colors and other styles when not fully scrolled
    document.documentElement.style.setProperty('--navBackground', 'var(--white)');
    document.documentElement.style.setProperty('--navText', 'var(--black)');
    
    // Revert background color for each .menu span and .main-h2 color
    menuSpans.forEach(span => {
      span.style.backgroundColor = ''; // Revert to original
    });
    mainH2.style.color = ''; // Revert to original
  }

  if (scrollPosition <= triggerPoint) {
    // Calculate the height based on scroll progress
    const progress = Math.min(scrollPosition / triggerPoint, 1);
    scrollBar.style.height = `${progress * 100}vh`;

    // Hide the new section if scrolling up and below the trigger point
    newSection.style.bottom = "-100%";
  } else {
    // Ensure the bar stays full once scrolled past the trigger point
    scrollBar.style.height = "100vh";

    // Show the new section if scrolling down
    if (scrollPosition > lastScrollPosition) {
      newSection.style.bottom = "0";
    } else {
      // Hide the new section if scrolling up
      newSection.style.bottom = "-100%";
    }
  }

  lastScrollPosition = scrollPosition; // Update last scroll position
});

