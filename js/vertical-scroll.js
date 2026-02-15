gsap.registerPlugin(ScrollTrigger);

const speed = 1;

let mm = gsap.matchMedia();

// ============================================
// DESKTOP: Horizontal scroll (unchanged)
// ============================================
mm.add("(min-width: 768px)", () => {
  ['3', '4', '5'].forEach(sectionNum => {
    const content = document.querySelector(`.new-section-${sectionNum}-content`);
    const trigger = `#new-section-${sectionNum}`;
    const extra = window.innerWidth * 0.05;
    const totalLen = content.scrollWidth + extra - window.innerWidth;

    ScrollTrigger.create({
      animation: gsap.to(content, {
        x: () => -totalLen,
        ease: 'none'
      }),
      trigger,
      start: 'top top',
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
  
  return () => {};
});

// ============================================
// MOBILE: Vertical scroll with image entrance animations
// ============================================
mm.add("(max-width: 767px)", () => {
  // Animate images in sections 3, 4, and 5
  ['3', '4', '5'].forEach(sectionNum => {
    const images = document.querySelectorAll(`#new-section-${sectionNum} .image-track .image`);
    
    images.forEach((img, index) => {
      gsap.fromTo(img, 
        {
          opacity: 0,
          y: 60,
          scale: 0.95
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: img,
            start: "top 85%", // Start animation when image is 85% down the viewport
            end: "top 50%",
            toggleActions: "play none none reverse"
          },
          delay: index * 0.1 // Stagger effect based on index
        }
      );
    });
  });

  // Cleanup function
  return () => {
    ScrollTrigger.getAll().forEach(st => st.kill());
  };
});