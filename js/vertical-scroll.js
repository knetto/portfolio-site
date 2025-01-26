gsap.registerPlugin(ScrollTrigger);

gsap.to("#new-section-3 .new-section-3-content", {
  xPercent: -100, // Move the content horizontally when scrolling
  ease: "none",   // No easing to make it consistent
  scrollTrigger: {
    trigger: "#new-section-3",  // When this section is triggered
    start: "top top",  // When the top of the section hits the top of the screen
    end: "+=3000",     // Adjust this value based on how long you want the horizontal scrolling to last
    scrub: true,       // Make it sync with the scroll
    pin: true,         // Pin the section in place while scrolling
    anticipatePin: 1,  // Optional: to smoothen the pinning process
    markers: true      // Optional: to see the start/end points (remove in production)
  }
});
