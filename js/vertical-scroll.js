gsap.registerPlugin(ScrollTrigger);

// Select the whole content container
const content = document.querySelector('.new-section-3-content');

gsap.to(content, {
    x: () => -(content.scrollWidth - window.innerWidth), // Move the entire content horizontally
    ease: 'none', // Smooth, continuous scrolling
    scrollTrigger: {
        trigger: '#new-section-3',
        start: 'top top',   // Pin at the top of the section
        end: () => '+=' + content.scrollWidth, // End based on the width of the content
        scrub: true,  // Smooth scrubbing effect
        pin: true,    // Pin the section during scroll
        anticipatePin: 1, // Adjust if necessary to prevent issues with pinning
         // markers: true,     // Optional: to see the start/end points (remove in production)
         onUpdate: (self) => {
      // Here we apply the same logic used in the mouse move to scroll-based movement
      const percentage = self.progress * -100;

      // Animate the images based on scroll position
      gsap.to("#new-section-3 .image", {
        objectPosition: `${100 + percentage}% center`,
        duration: 0.1,  // A quick animation for each image movement
      });
    }
    }
    
});
