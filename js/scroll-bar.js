// project page logic - Fixed scroll-bar.js

// Initialize variables
let scrollBar = document.getElementById('scroll-bar');
let menuSpans = document.querySelectorAll('.menu span');
let mainH2 = document.querySelector('.main-h2');
let textContent = document.querySelector('.text-content');
let imageContent = document.querySelector('.image-content');
let navBar = document.querySelector('.nav-bar');

let lastScrollPosition = 0;
let triggerPoint = window.innerHeight * 0.5;

// Debounce function to optimize scroll performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Function to apply styles based on scroll position
function updateScrollStyles(scrollPosition) {
    // Null check for scrollBar - exit early if element doesn't exist
    if (!scrollBar) return;

    const progress = Math.min(scrollPosition / triggerPoint, 1);

    if (scrollPosition >= triggerPoint) {
        scrollBar.style.height = "100vh"; // Fill up the scroll bar to full height

        // Trigger fade-in for text and image content with null checks
        if (textContent) textContent.style.opacity = 1;
        if (imageContent) imageContent.style.opacity = 1; 
    } else {
        scrollBar.style.height = `${progress * 100}vh`;

        // Reset opacity of text and image content with null checks
        if (textContent) textContent.style.opacity = 0;
        if (imageContent) imageContent.style.opacity = 0;
    }
    lastScrollPosition = scrollPosition;
}

// Handle window resize
window.addEventListener('resize', () => {
    triggerPoint = window.innerHeight * 0.5;
});

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

// Re-initialize elements if needed (for dynamic content)
function reinitializeScrollBarElements() {
    scrollBar = document.getElementById('scroll-bar');
    menuSpans = document.querySelectorAll('.menu span');
    mainH2 = document.querySelector('.main-h2');
    textContent = document.querySelector('.text-content');
    imageContent = document.querySelector('.image-content');
    navBar = document.querySelector('.nav-bar');
    
    // Update trigger point after reinitialization
    triggerPoint = window.innerHeight * 0.5;
}

// Optional: Call reinitialize if you have dynamic content loading
// reinitializeScrollBarElements();

// Project filtering logic (keep your existing functionality)
document.getElementById("btn-school").classList.add("active");

// Export functions if needed for other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { updateScrollStyles, reinitializeScrollBarElements };
}