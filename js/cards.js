let activeClone = null;
let activeOriginal = null;
let fullscreenLenis = null;
let scrollTriggerInstances = [];

document.querySelectorAll('.view-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.project-card');
    const img = card.querySelector('.image-wrapper img');
    const content = card.querySelector('.project-content');
    const wrapper = card.querySelector('.image-wrapper');

    // Remove gradient overlay
    wrapper.classList.add("remove-gradient");

    // Phase 1 — wipe + fill
    const tl = gsap.timeline({
      defaults: { duration: 0.6, ease: "power3.inOut" }
    });

    tl.to(content, { opacity: 0 }, 0);
    tl.to(img, { clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" }, 0);
    tl.to(card, { backgroundColor: "var(--white)" }, 0.15);

    tl.add(() => openCard(card), "+=0.1");
  });
});

function openCard(card) {
  const rect = card.getBoundingClientRect();
  activeOriginal = card;

  const clone = card.cloneNode(true);
  clone.classList.add("big-card");
  document.body.appendChild(clone);
  activeClone = clone;

  const startW = rect.width;
  const startH = rect.height;
  const startTop = rect.top;
  const startLeft = rect.left;

  const endW = window.innerWidth;
  const endH = window.innerHeight;

  const finalTop = (window.innerHeight - endH) / 2;
  const finalLeft = (window.innerWidth - endW) / 2;

  gsap.set(clone, {
    position: "fixed",
    top: startTop,
    left: startLeft,
    width: startW,
    height: startH,
    xPercent: 0,
    yPercent: 0,
    transform: "none",
    zIndex: 99,
  });

  gsap.to(clone, {
    duration: 1.2,
    ease: "power4.inOut",
    width: endW,
    height: endH,
    top: finalTop,
    left: finalLeft,
    borderRadius: "0px",
    onComplete: () => {
      // Stop page scrolling (Lenis)
      window.lenis.stop();

      activeClone.style.overflow = "hidden"; // during animation
      setTimeout(() => {
        activeClone.style.overflowY = "auto";
      }, 50);

      // Start Lenis scroll inside fullscreen card
      fullscreenLenis = new Lenis({
        wrapper: activeClone,
        content: activeClone,
        duration: 0.7,
        smoothWheel: true,
        smoothTouch: true,
        gestureDirection: "vertical"
      });

      function rafFullscreen(time) {
        if (fullscreenLenis) fullscreenLenis.raf(time);
        requestAnimationFrame(rafFullscreen);
      }
      requestAnimationFrame(rafFullscreen);

      document.body.classList.add("dimmed", "fullscreen-active");
      document.body.style.overflow = "hidden";
      // 🔥 Enable scrolling ONLY now
      activeClone.style.overflowY = "auto";
      activeClone.style.overflowX = "hidden";
      activeClone.style.pointerEvents = "auto";

      // Show close button
      const closeBtn = document.getElementById("close-fullscreen");
      closeBtn.style.display = "block";

      // ⭐ Insert card-specific revealed content
      const extra = card.querySelector(".project-extra");
      if (extra) {
        const cloneExtra = extra.cloneNode(true);
        cloneExtra.classList.add("fullscreen-extra");
        cloneExtra.style.display = "block";
        activeClone.appendChild(cloneExtra);
        
        // Activate scrolling animations for image gallery
        requestAnimationFrame(() => initFullscreenScrollAnimations(activeClone));

        // Animate the project-extra content with modern effects
        animateProjectExtra(cloneExtra);

        requestAnimationFrame(() => {
          cloneExtra.classList.add("visible");
        });
      }
    }
  });
}

// Modern animation for project-extra content with slide-in effects
function animateProjectExtra(container) {
  // Animate the layout elements
  const layout = container.querySelector('.extra-layout');
  if (layout) {
    const media = layout.querySelector('.extra-media');
    const content = layout.querySelector('.extra-content');
    
    // Create a timeline for the layout animation
    const layoutTl = gsap.timeline({ defaults: { ease: "power3.out" } });
    
    // Media animation - slide in from left
    layoutTl.from(media, {
      duration: 0.8,
      x: -50,
      opacity: 0,
      scale: 0.95
    }, 0);
    
    // Content animation - slide in from right
    layoutTl.from(content, {
      duration: 0.8,
      x: 50,
      opacity: 0,
      scale: 0.95
    }, 0.1);
    
    // Stagger animation for content elements
    layoutTl.from(content.querySelectorAll('*'), {
      duration: 0.6,
      y: 20,
      opacity: 0,
      stagger: 0.05
    }, 0.3);
  }
  
  // Animate the project description
  const description = container.querySelector('.project-description');
  if (description) {
    gsap.from(description, {
      duration: 0.7,
      y: 30,
      opacity: 0,
      delay: 0.5,
      ease: "power2.out"
    });
  }
  
  // Animate the divider line
  const divider = container.querySelector('.divider-line');
  if (divider) {
    gsap.from(divider, {
      duration: 0.6,
      scaleX: 0,
      delay: 0.7,
      ease: "power2.out"
    });
  }
  
  // Animate video gallery
  const videos = container.querySelectorAll('.video-wrapper');
  if (videos.length) {
    gsap.from(videos, {
      duration: 0.8,
      y: 40,
      opacity: 0,
      stagger: 0.1,
      delay: 0.8,
      ease: "power3.out"
    });
  }
  
  // Set up scroll-triggered animations for image gallery with slide-in effects
  const galleryImages = container.querySelectorAll('.image-gallery img');
  if (galleryImages.length) {
    // Reset any existing ScrollTrigger instances
    scrollTriggerInstances.forEach(instance => instance.kill());
    scrollTriggerInstances = [];
    
    // Create slide-in animations for each image (all from bottom)
    galleryImages.forEach((img, index) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: img,
          start: "top 90%", // Trigger sooner
          end: "bottom 20%",
          toggleActions: "play none none reverse",
          container: activeClone
        }
      });
      
      // All images slide up from bottom
      tl.from(img, { y: 60, opacity: 0 })
        .to(img, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out"
        });
      
      // Store the ScrollTrigger instance for cleanup
      scrollTriggerInstances.push(tl.scrollTrigger);
    });
  }
}

function initFullscreenScrollAnimations(wrapper) {
  const revealImgs = wrapper.querySelectorAll(".image-gallery img");

  revealImgs.forEach((img, index) => {
    // Set initial positions - all from bottom
    gsap.set(img, { y: 80, opacity: 0 });

    gsap.to(img, {
      y: 0,
      opacity: 1,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: {
        trigger: img,
        start: "top 90%", // Trigger sooner
        toggleActions: "play none none reverse",
        scroller: wrapper // very important for fullscreen scrolling!
      }
    });
  });
}

// 🧲 Close Fullscreen Card with faster animation
function closeCard() {
  if (!activeClone || !activeOriginal) return;

  document.body.classList.remove("dimmed", "fullscreen-active");
  document.body.style.overflow = "";

  const rect = activeOriginal.getBoundingClientRect();
  // Disable scrolling instantly when closing starts
  activeClone.style.overflow = "hidden";

  const img = activeOriginal.querySelector('.image-wrapper img');
  const content = activeOriginal.querySelector('.project-content');
  const wrapper = activeOriginal.querySelector('.image-wrapper');

  // ⭐ Remove injected fullscreen content
  const fullscreenExtra = activeClone.querySelector(".fullscreen-extra");
  if (fullscreenExtra) fullscreenExtra.remove();

  // Hide button
  document.getElementById("close-fullscreen").style.display = "none";

  // Kill all ScrollTrigger instances
  scrollTriggerInstances.forEach(instance => instance.kill());
  scrollTriggerInstances = [];

  // Faster close animation (0.7s instead of 1.2s)
  gsap.to(activeClone, {
    duration: 0.7, // Faster close
    ease: "power3.in", // Different easing for faster feel
    width: rect.width,
    height: rect.height,
    top: rect.top,
    left: rect.left,
    borderRadius: window.getComputedStyle(activeOriginal).borderRadius,
    onComplete: () => {
      if (fullscreenLenis) {
        fullscreenLenis.destroy();
        fullscreenLenis = null;
      }
      
      // Restore smooth page scroll
      window.lenis.start();
      
      // Restore gradient overlay
      wrapper.classList.remove("remove-gradient");
      
      // Reverse wipe with faster animation
      gsap.to(img, {
        duration: 0.4, // Faster
        clipPath: "polygon(0 0, 100% 0, 100% 88%, 0 95%)",
        ease: "power2.out",
        onComplete: () => {
          gsap.to(content, {
            opacity: 1,
            duration: 0.4, // Faster
            delay: 0.2, // Shorter delay
            ease: "power2.out"
          });
        }
      });

      activeClone.remove();
      activeClone = null;
      activeOriginal = null;
    }
  });
}

// ESC support
document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeCard();
});

// Close button support
document.querySelector(".close-wrapper").addEventListener("click", closeCard);