particlesJS.load('particles-js', 'particlesjs-config.json', function() {
    console.log('Particles.js config loaded');
  });

 
      
      
  // Wait for the page to load and then trigger the animation
window.addEventListener('load', function() {
  let tl = gsap.timeline({ delay: 1 }); // Delay before starting animation
  
  tl.to('.MainTitle div', {
    duration: 0.5, 
    y: 0, 
    opacity: 1, // Fade in as they slide up
    stagger: 0.3, // Stagger the animation
    ease: "power3.out", // Ease for a smoother animation
  });
});

 // Fade in elements with GSAP
 window.onload = function () {
  gsap.fromTo(
    ".main-h2",
    { opacity: 0, y: -50 },
    { opacity: 1, y: 0, duration: 1 }
  );

  gsap.fromTo(
    ".container",
    { opacity: 0, y: -50 },
    { opacity: 1, y: 0, duration: 1 }
  );
};

  

let scrollBar = document.getElementById('scroll-bar');
let newSection = document.getElementById('new-section');

// To track scroll direction
let lastScrollPosition = 0;
const triggerPoint = 500; // Scroll point to trigger color change

window.addEventListener('scroll', () => {
  const scrollPosition = window.scrollY; // Current scroll position

  if (scrollPosition >= triggerPoint) {
    // When scrolled fully, change navbar colors
    document.documentElement.style.setProperty('--navBackground', 'var(--black)');
    document.documentElement.style.setProperty('--navText', 'var(--white)');
  } else {
    // Reset navbar colors when not fully scrolled
    document.documentElement.style.setProperty('--navBackground', 'var(--white)');
    document.documentElement.style.setProperty('--navText', 'var(--black)');
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


(function () {
  const links = document.querySelectorAll('nav > .hover-this, .hover-this');
  const cursor = document.querySelector('.cursor');

  // Follow the mouse position
  const editCursor = (e) => {
    const { clientX: x, clientY: y } = e;
    cursor.style.left = `${x}px`;
    cursor.style.top = `${y}px`;
  };

  // Add or remove the hovered class for cursor enlargement
  const handleHover = (e) => {
    if (e.type === 'mouseenter') {
      cursor.classList.add('hovered');
    } else {
      cursor.classList.remove('hovered');
    }
  };

  // Add event listeners for hover effects
  links.forEach((link) => {
    link.addEventListener('mouseenter', handleHover);
    link.addEventListener('mouseleave', handleHover);
  });

  // Update cursor position on mousemove
  window.addEventListener('mousemove', editCursor);
})();






