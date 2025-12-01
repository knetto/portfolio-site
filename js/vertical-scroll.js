gsap.registerPlugin(ScrollTrigger);

const speed = 1; // 1× normal speed

// Use matchMedia to run this logic only on screens wider than a mobile breakpoint (e.g., 768px)
let mm = gsap.matchMedia();

mm.add("(min-width: 768px)", () => {
  // --- All your horizontal ScrollTrigger logic goes inside this function ---
  
  ['3', '4', '5'].forEach(sectionNum => {
    const content = document.querySelector(`.new-section-${sectionNum}-content`);
    const trigger = `#new-section-${sectionNum}`;

    // extra padding so it doesn’t end flush
    const extra = window.innerWidth * 0.05;
    // total horizontal distance to move
    // Use .scrollWidth and .offsetWidth for a more robust calculation
    const totalLen = content.scrollWidth + extra - window.innerWidth; 

    ScrollTrigger.create({
      animation: gsap.to(content, {
        x: () => -totalLen,
        ease: 'none'
      }),
      trigger,
      start: 'top top',
      // End value calculation is the key to scroll length
      end: () => '+=' + (totalLen / speed), 
      scrub: true,
      pin: true,
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

  // Optional: Update ScrollTriggers on resize so lengths recalc
  // Note: ScrollTrigger.refresh() is automatically called by matchMedia on media query changes, 
  // but a general resize listener is still fine.
  // window.addEventListener('resize', () => {
  //   ScrollTrigger.refresh();
  // });
  
  // Return an empty function to destroy all triggers in this matchMedia context when the media query changes.
  return () => {
    // optional cleanup
  }
});

// For mobile (max-width: 767px), ScrollTriggers are *not* created, 
// and you would rely on standard vertical CSS layout for your sections.