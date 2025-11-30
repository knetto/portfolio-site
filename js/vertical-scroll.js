// make sure GSAP and ScrollTrigger are loaded first
gsap.registerPlugin(ScrollTrigger);

const speed = 1; // 1× normal speed

function setupHorizontalScroll() {
  // Only setup horizontal scroll on desktop
  if (window.innerWidth <= 768) {
    return; // Exit on mobile
  }

  ['3', '4', '5'].forEach(sectionNum => {
    const content = document.querySelector(`.new-section-${sectionNum}-content`);
    const trigger  = `#new-section-${sectionNum}`;

    // extra padding so it doesn't end flush
    const extra = window.innerWidth * 0.05;
    // total horizontal distance to move
    const totalLen = content.scrollWidth + extra - window.innerWidth;

    ScrollTrigger.create({
      animation: gsap.to(content, {
        x: () => -totalLen,
        ease: 'none'
      }),
      trigger,
      start:  'top top',
      end:    () => '+=' + (totalLen / speed),
      scrub:  true,
      pin:    true,
      anticipatePin: 1,
      onUpdate(self) {
        const pct = self.progress * -100;
        gsap.to(`${trigger} .image`, {
          objectPosition: `${100 + pct}% center`,
          duration: 0.1
        });
      }
    });
  });
}

// Initialize on load
setupHorizontalScroll();

// Re-initialize on resize (with debounce for performance)
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    // Kill all existing ScrollTriggers
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    
    // Re-initialize
    setupHorizontalScroll();
    
    // Refresh ScrollTrigger
    ScrollTrigger.refresh();
  }, 250);
});