gsap.registerPlugin(ScrollTrigger);

// Scroll-triggered animation for the content
gsap.to("#new-section-3 .new-section-3-content", {
  xPercent: -1700,  // Reduce the horizontal movement distance for slower animation
  ease: "none",     // No easing to make it consistent
  scrollTrigger: {
    trigger: "#new-section-3",  // When this section is triggered
    start: "top top",           // When the top of the section hits the top of the screen
    end: "+=1000",              // Adjust this value based on how long you want the horizontal scrolling to last
    scrub: 1,                   // Reduce scrub value for slower effect (1 is the default)
    pin: true,                  // Pin the section in place while scrolling
    anticipatePin: 1,           // Optional: to smoothen the pinning process
    // markers: true,              // Optional: to see the start/end points (remove in production)
    onUpdate: (self) => {
      // Here we apply the same logic used in the mouse move to scroll-based movement
      const percentage = self.progress * -50;  // Reduced the percentage to slow the movement

      // Animate the images based on scroll position
      gsap.to("#new-section-3 .image", {
        objectPosition: `${100 + percentage}% center`,
        duration: 0.1,  // A quick animation for each image movement
      });
    }
  }
});
