let scrollBar = document.getElementById('scroll-bar');
let newSection = document.getElementById('new-section');
let menuSpans = document.querySelectorAll('.menu span'); // Select all spans inside .menu
let mainH2 = document.querySelector('.main-h2');
let textContent = document.querySelector('.text-content');
let imageContent = document.querySelector('.image-content');

// To track scroll direction
let lastScrollPosition = 0;
const triggerPoint = window.innerHeight * 0.5; // Trigger point is 50% of the screen height

// Function to apply styles based on scroll position
function updateScrollStyles(scrollPosition) {
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

    // Reset the text and image position when scrolling up
    textContent.style.transform = 'translateY(50px)'; // Move text back
    imageContent.style.transform = 'translateY(400px)'; // Move image back
  } else {
    // Ensure the bar stays full once scrolled past the trigger point
    scrollBar.style.height = "100vh";

    // Show the new section if scrolling down
    if (scrollPosition > lastScrollPosition) {
      newSection.style.bottom = "0";
      
      textContent.style.transform = 'translateY(0)';
      
      // Fade in the image content with a slight delay
      setTimeout(() => {
        imageContent.style.transform = 'translateY(0)';
      }, 200); // Delay the image for 200ms for a staggered effect
    } else {
      // Hide the new section if scrolling up
      newSection.style.bottom = "-100%";
    }
  }
}