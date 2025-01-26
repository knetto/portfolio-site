let scrollBar = document.getElementById('scroll-bar');
let menuSpans = document.querySelectorAll('.menu span');
let mainH2 = document.querySelector('.main-h2');
let textContent = document.querySelector('.text-content');
let imageContent = document.querySelector('.image-content');
let navBar = document.querySelector('.nav-bar'); // Select the nav-bar element

let lastScrollPosition = 0;
let triggerPoint = window.innerHeight * 0.5;

window.addEventListener('resize', () => {
  triggerPoint = window.innerHeight * 0.5;
});

// Function to apply styles based on scroll position
function updateScrollStyles(scrollPosition) {
  const progress = Math.min(scrollPosition / triggerPoint, 1);

  if (scrollPosition >= triggerPoint) {
    scrollBar.style.height = "100vh"; // Fill up the scroll bar to full height

    // Trigger fade-in for text and image content
    textContent.style.opacity = 1;
    imageContent.style.opacity = 1; 
  } else {
    scrollBar.style.height = `${progress * 100}vh`;

    // Reset opacity of text and image content
    textContent.style.opacity = 0;
    imageContent.style.opacity = 0;
  }
  lastScrollPosition = scrollPosition;
}

// Combined scroll listener with debounce
window.addEventListener('scroll', debounce(() => {
  const scrollPosition = window.scrollY || document.documentElement.scrollTop;

  updateScrollStyles(scrollPosition);
}, 50));

// Ensure correct state on page load
window.addEventListener('load', () => {
  const scrollPosition = window.scrollY || document.documentElement.scrollTop;
  updateScrollStyles(scrollPosition);
});
