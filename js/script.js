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




// Initial check to apply styles if the page is already scrolled on load
window.addEventListener('load', () => {
  const initialScrollPosition = window.scrollY;
  updateScrollStyles(initialScrollPosition);
});

window.addEventListener('scroll', () => {
  const scrollPosition = window.scrollY; // Current scroll position
  updateScrollStyles(scrollPosition);

  lastScrollPosition = scrollPosition; // Update last scroll position
});

document.addEventListener("DOMContentLoaded", function() {
  const socialIcons = document.querySelectorAll('.social-icon');
  
  // Create an IntersectionObserver to detect when the social icons container is fully in the viewport
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Start the GSAP animation with a delay after the icons are in view
        socialIcons.forEach((icon, index) => {
          gsap.from(icon, {
            y: 50, // Start from below the screen
            opacity: 0, // Start hidden
            duration: 0.8, // Animation duration
            delay: 0.5 + index * 0.2, // Global start delay (1 second) + staggered delay for each icon
            ease: "power4.out" // Ease for smoothness
          });
        });
        // Stop observing once the animation starts
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.5 // Trigger when 50% of the social icons are visible in the viewport
  });

  // Observe the social-media-icons container
  const socialMediaIconsContainer = document.querySelector('.social-media-icons');
  observer.observe(socialMediaIconsContainer);
});


