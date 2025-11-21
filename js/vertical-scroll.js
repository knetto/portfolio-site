// make sure GSAP and ScrollTrigger are loaded first
gsap.registerPlugin(ScrollTrigger);

const speed = 1; // 1× normal speed

['3', '4', '5'].forEach(sectionNum => {
  const content = document.querySelector(`.new-section-${sectionNum}-content`);
  const trigger  = `#new-section-${sectionNum}`;

  // extra padding so it doesn’t end flush
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

// Optional: Update ScrollTriggers on resize so lengths recalc
window.addEventListener('resize', () => {
  ScrollTrigger.refresh();
});

