// projects-animations.js
document.addEventListener('DOMContentLoaded', function() {
  // Initialize GSAP animations
  initProjectAnimations();
  initMobileOptimizations(); // Add mobile optimizations
  
  // Initial check for visible cards (helps with above-the-fold content)
  setTimeout(() => {
    if (window.innerWidth <= 768) {
      checkVisibleCards();
    }
  }, 1000);
});

function initProjectAnimations() {
  // First, set all project cards to be hidden initially
  gsap.set('.project-card', {
      opacity: 0,
      y: 100
  });

  // Fade in the work title
  gsap.fromTo('.work-title', 
      { 
          opacity: 0, 
          y: 50 
      },
      { 
          opacity: 1, 
          y: 0, 
          duration: 1, 
          ease: "power2.out" 
      }
  );

  gsap.fromTo('.category-buttons',
    {
        opacity: 0,
        x: -100,
        immediateRender: false
    },
    {
        opacity: 1,
        x: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
        delay: 0.5
    }
  );

  // Animate project cards when they come into view
  animateProjectCards();
  
  // Animate project content after cards are visible
  setupContentAnimations();
}

function animateProjectCards() {
  // Check if mobile device
  const isMobile = window.innerWidth <= 768;
  
  // Mobile-optimized ScrollTrigger settings
  const mobileSettings = {
    start: "top 90%",    // Trigger earlier on mobile
    end: "bottom 50%",
    toggleActions: "play none none reverse"
  };
  
  const desktopSettings = {
    start: "top 85%",
    end: "bottom 60%", 
    toggleActions: "play none none reverse"
  };

  // Create ScrollTriggers for each project card
  gsap.utils.toArray('.project-card').forEach((card, index) => {
    const settings = isMobile ? mobileSettings : desktopSettings;
    
    // Animate card when it comes into view
    gsap.to(card, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: card,
        start: settings.start,
        end: settings.end,
        toggleActions: settings.toggleActions,
        onEnter: () => animateCardContent(card),
        // Add these mobile-specific optimizations:
        anticipatePin: 1,
        fastScrollEnd: true,
        onToggle: self => {
          // Force animation if it didn't trigger naturally
          if (self.isActive && card.style.opacity === '0') {
            gsap.to(card, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power2.out"
            });
          }
        }
      }
    });
  });
}

function animateCardContent(card) {
  const content = card.querySelector('.project-content');
  const h3 = content.querySelector('h3');
  const role = content.querySelector('.role');
  const contribution = content.querySelector('.contribution');
  const button = content.querySelector('.view-btn');
  const date = content.querySelector('.project-date');

  // Set initial state for content elements (hidden and shifted left)
  gsap.set([h3, date, role, contribution, button], {
    opacity: 0,
    x: -50
  });

  // Create timeline for sequential animations
  const tl = gsap.timeline({ delay: 0.3 });

  tl.to(h3, {
      opacity: 1,
      x: 0,
      duration: 0.6,
      ease: "power2.out"
  })
  .to(date, {
      opacity: 0.7,
      x: 0,
      duration: 0.5,
      ease: "power2.out"
  }, "-=0.3")
  .to(role, {
      opacity: 1,
      x: 0,
      duration: 0.6,
      ease: "power2.out"
  }, "-=0.3")
  .to(contribution, {
      opacity: 1,
      x: 0,
      duration: 0.6,
      ease: "power2.out"
  }, "-=0.3")
  .to(button, {
      opacity: 1,
      x: 0,
      duration: 0.6,
      ease: "power2.out"
  }, "-=0.3");
}

function setupContentAnimations() {
  const isMobile = window.innerWidth <= 768;
  
  // Additional animations for when cards are fully visible
  gsap.utils.toArray('.project-card').forEach((card) => {
      ScrollTrigger.create({
          trigger: card,
          start: isMobile ? "top 80%" : "top 70%",
          onEnter: () => {
              // Add subtle scale effect when card is in center of view
              gsap.to(card, {
                  scale: 1.02,
                  duration: 0.3,
                  ease: "power1.out"
              });
          },
          onLeaveBack: () => {
              // Reset scale when leaving view
              gsap.to(card, {
                  scale: 1,
                  duration: 0.3,
                  ease: "power1.out"
              });
          }
      });
  });
}

// Mobile optimization functions
function initMobileOptimizations() {
  // Refresh ScrollTrigger on mobile orientation change
  window.addEventListener('orientationchange', function() {
    setTimeout(() => {
      ScrollTrigger.refresh();
      // Force re-check of all ScrollTriggers
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger && trigger.trigger.classList.contains('project-card')) {
          trigger.refresh();
        }
      });
    }, 500);
  });

  // More aggressive refresh on mobile resize
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      ScrollTrigger.refresh();
      
      // On mobile, also check if any cards in view need animating
      if (window.innerWidth <= 768) {
        checkVisibleCards();
      }
    }, 250);
  });
}

// Function to check and animate visible cards on mobile
function checkVisibleCards() {
  gsap.utils.toArray('.project-card').forEach(card => {
    const rect = card.getBoundingClientRect();
    const isVisible = (
      rect.top <= window.innerHeight * 0.9 && 
      rect.bottom >= window.innerHeight * 0.1
    );
    
    if (isVisible && card.style.opacity === '0') {
      gsap.to(card, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out"
      });
      animateCardContent(card);
    }
  });
}

// Add touch event support to help ScrollTrigger on mobile
let touchScrollTimer;
document.addEventListener('touchmove', function() {
  clearTimeout(touchScrollTimer);
  touchScrollTimer = setTimeout(() => {
    // Refresh ScrollTrigger during touch scroll
    ScrollTrigger.refresh();
  }, 150);
}, { passive: true });

// Re-initialize animations when filtering categories
function reinitAnimations() {
  // Kill existing ScrollTriggers
  ScrollTrigger.getAll().forEach(trigger => {
      if (trigger.trigger && trigger.trigger.classList.contains('project-card')) {
          trigger.kill();
      }
  });

  // Reset cards to hidden state
  gsap.set('.project-card', {
      opacity: 0,
      y: 100
  });

  // Re-animate visible cards
  animateProjectCards();
}

// Optional: Add resize handler to recalculate ScrollTriggers
window.addEventListener('resize', function() {
  ScrollTrigger.refresh();
});

// Card expansion functionality
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

    activeClone.style.overflow = "hidden";
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
    activeClone.style.overflowY = "auto";
    activeClone.style.overflowX = "hidden";
    activeClone.style.pointerEvents = "auto";

    // Show close button
    const closeBtn = document.getElementById("close-fullscreen");
    closeBtn.style.display = "block";

    // Insert card-specific revealed content
    const extra = card.querySelector(".project-extra");
    if (extra) {
      const cloneExtra = extra.cloneNode(true);
      cloneExtra.classList.add("fullscreen-extra");
      cloneExtra.style.display = "block";
      activeClone.appendChild(cloneExtra);
      
      // Activate scrolling animations for image gallery and videos
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

// Modern animation for project-extra content with scroll-triggered effects
function animateProjectExtra(container) {
// Animate the layout elements
const layout = container.querySelector('.extra-layout');
if (layout) {
  const media = layout.querySelector('.extra-media');
  const content = layout.querySelector('.extra-content');
  
  const layoutTl = gsap.timeline({ defaults: { ease: "power3.out" } });
  
  layoutTl.from(media, {
    duration: 0.8,
    x: -50,
    opacity: 0,
    scale: 0.95
  }, 0);
  
  layoutTl.from(content, {
    duration: 0.8,
    x: 50,
    opacity: 0,
    scale: 0.95
  }, 0.1);
  
  layoutTl.from(content.querySelectorAll('*'), {
    duration: 0.6,
    y: 20,
    opacity: 0,
    stagger: 0.05
  }, 0.3);
}

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

const divider = container.querySelector('.divider-line');
if (divider) {
  gsap.from(divider, {
    duration: 0.6,
    scaleX: 0,
    delay: 0.7,
    ease: "power2.out"
  });
}

const videos = container.querySelectorAll('.video-wrapper');
if (videos.length) {
  videos.forEach((video, index) => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: video,
        start: "top 90%",
        end: "bottom 20%",
        toggleActions: "play none none none",
        container: activeClone
      }
    });
    
    tl.from(video, { y: 60, opacity: 0 })
      .to(video, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out"
      });
    
    scrollTriggerInstances.push(tl.scrollTrigger);
  });
}

const galleryImages = container.querySelectorAll('.image-gallery img');
if (galleryImages.length) {
  galleryImages.forEach((img, index) => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: img,
        start: "top 90%",
        end: "bottom 20%",
        toggleActions: "play none none none",
        container: activeClone
      }
    });
    
    tl.from(img, { y: 60, opacity: 0 })
      .to(img, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out"
      });
    
    scrollTriggerInstances.push(tl.scrollTrigger);
  });
}
}

function initFullscreenScrollAnimations(wrapper) {
const revealImgs = wrapper.querySelectorAll(".image-gallery img");
const revealVideos = wrapper.querySelectorAll(".video-wrapper");

revealImgs.forEach((img, index) => {
  gsap.set(img, { y: 80, opacity: 0 });

  gsap.to(img, {
    y: 0,
    opacity: 1,
    duration: 0.9,
    ease: "power3.out",
    scrollTrigger: {
      trigger: img,
      start: "top 90%",
      toggleActions: "play none none none",
      scroller: wrapper
    }
  });
});

revealVideos.forEach((video, index) => {
  gsap.set(video, { y: 80, opacity: 0 });

  gsap.to(video, {
    y: 0,
    opacity: 1,
    duration: 0.9,
    ease: "power3.out",
    scrollTrigger: {
      trigger: video,
      start: "top 90%",
      toggleActions: "play none none none",
      scroller: wrapper
    }
  });
});
}

function closeCard() {
if (!activeClone || !activeOriginal) return;

document.body.classList.remove("dimmed", "fullscreen-active");
document.body.style.overflow = "";

const rect = activeOriginal.getBoundingClientRect();
activeClone.style.overflow = "hidden";

const img = activeOriginal.querySelector('.image-wrapper img');
const content = activeOriginal.querySelector('.project-content');
const wrapper = activeOriginal.querySelector('.image-wrapper');

document.getElementById("close-fullscreen").style.display = "none";

scrollTriggerInstances.forEach(instance => instance.kill());
scrollTriggerInstances = [];

const closeTl = gsap.timeline({
  onComplete: () => {
    if (fullscreenLenis) {
      fullscreenLenis.destroy();
      fullscreenLenis = null;
    }
    
    window.lenis.start();
    wrapper.classList.remove("remove-gradient");
    
    gsap.to(img, {
      duration: 0.4,
      clipPath: "polygon(0 0, 100% 0, 100% 88%, 0 95%)",
      ease: "power2.out",
      onComplete: () => {
        gsap.to(content, {
          opacity: 1,
          duration: 0.4,
          delay: 0.2,
          ease: "power2.out"
        });
      }
    });

    if (activeClone) {
      activeClone.remove();
      activeClone = null;
    }
    activeOriginal = null;
  }
});

const fullscreenExtra = activeClone.querySelector(".fullscreen-extra");

if (fullscreenExtra) {
  closeTl.to(fullscreenExtra, {
    duration: 0.3,
    opacity: 0,
    ease: "none"
  });
}

const visibleContent = activeClone.querySelectorAll('.project-content, .image-wrapper, .big-card > *:not(.fullscreen-extra)');
if (visibleContent.length) {
  closeTl.to(visibleContent, {
    duration: 0.25,
    opacity: 0,
    ease: "none"
  }, 0);
}

closeTl.to({}, {
  duration: 0.5,
  ease: "none"
});

closeTl.to(activeClone, {
  duration: 0.7,
  ease: "power3.in",
  width: rect.width,
  height: rect.height,
  top: rect.top,
  left: rect.left,
  borderRadius: window.getComputedStyle(activeOriginal).borderRadius
});

if (fullscreenExtra) {
  closeTl.add(() => {
    fullscreenExtra.remove();
  });
}
}

// ESC support
document.addEventListener("keydown", e => {
if (e.key === "Escape") closeCard();
});

// Close button support
document.querySelector(".close-wrapper").addEventListener("click", closeCard);

// Section switching functionality
document.addEventListener('DOMContentLoaded', function() {
  const btnSchool = document.getElementById('btn-school');
  const btnFotografie = document.getElementById('btn-fotografie');
  const btnPersonal = document.getElementById('btn-personal');
  const projectGrid = document.getElementById('project-grid');
  const photographySection = document.getElementById('photography-section');
  
  // Button event listeners
  btnFotografie.addEventListener('click', function() {
      switchToSection('photography');
      updateActiveButton(this);
  });
  
  btnSchool.addEventListener('click', function() {
      switchToSection('school');
      updateActiveButton(this);
  });
  
  btnPersonal.addEventListener('click', function() {
      switchToSection('personal');
      updateActiveButton(this);
  });
  
  function switchToSection(section) {
    const tl = gsap.timeline();

    if (section === 'photography') {
        // Slide projects LEFT → hide
        tl.to(projectGrid, {
            x: '-100%',
            opacity: 0,
            duration: 0.6,
            ease: "power2.inOut",
            onComplete: () => {
                projectGrid.style.display = 'none';
                photographySection.style.display = 'block';
                
                // Refresh ScrollTrigger after section becomes visible
                setTimeout(() => {
                  ScrollTrigger.refresh();
                  // Re-initialize photography animations
                  initPhotographyGalleryAnimations();
                }, 100);
            }
        })
        // Slide photography IN from RIGHT
        .fromTo(photographySection, 
            { x: '100%', opacity: 0 },
            { x: '0%', opacity: 1, duration: 0.6, ease: "power2.inOut" },
            "-=0.3"
        );
    } else {
        // Slide photography RIGHT → hide
        tl.to(photographySection, {
            x: '100%',
            opacity: 0,
            duration: 0.6,
            ease: "power2.inOut",
            onComplete: () => {
                photographySection.style.display = 'none';
                projectGrid.style.display = 'grid';
                
                // Refresh ScrollTrigger after section change
                setTimeout(() => {
                  ScrollTrigger.refresh();
                }, 100);
            }
        })
        // Slide projects IN from LEFT
        .fromTo(projectGrid, 
            { x: '-100%', opacity: 0 },
            { x: '0%', opacity: 1, duration: 0.6, ease: "power2.inOut" },
            "-=0.3"
        );
    }
  }
  
  function updateActiveButton(activeButton) {
      // Remove active class from all buttons
      [btnSchool, btnFotografie, btnPersonal].forEach(btn => {
          btn.classList.remove('active');
      });
      
      // Add active class to clicked button
      activeButton.classList.add('active');
  }
});

// Photography gallery generation and animations - FIXED VERSION
const totalImages = 71;
const folderPath = "img/Photography/";
const gallery = document.getElementById("image-gallery");

// Clear existing gallery to avoid duplicates
if (gallery) {
  gallery.innerHTML = '';

  for (let i = 1; i <= totalImages; i++) {
    const img = document.createElement("img");
    img.src = `${folderPath}foto (${i}).jpg`;
    img.alt = `Photo ${i}`;
    img.loading = "lazy";
    gallery.appendChild(img);
  }

  // Initialize photography animations
  initPhotographyGalleryAnimations();
}

// Photography gallery scroll-reveal animation - UPDATED VERSION
function initPhotographyGalleryAnimations() {
  const galleryImages = document.querySelectorAll("#image-gallery img");
  
  if (!galleryImages.length) return;
  
  // Kill any existing ScrollTriggers for these elements to avoid duplicates
  galleryImages.forEach(img => {
    const triggerId = `photo-${img.src}`;
    ScrollTrigger.getById(triggerId)?.kill();
  });

  galleryImages.forEach((img) => {
    // Initial hidden position
    gsap.set(img, { y: 80, opacity: 0 });

    // Create ScrollTrigger for each image
    gsap.to(img, {
      y: 0,
      opacity: 1,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: {
        id: `photo-${img.src}`, // Unique ID to avoid conflicts
        trigger: img,
        start: "top 85%",
        end: "bottom 20%",
        toggleActions: "play none none none",
        // Important: specify the container for proper scoping
        scroller: window,
        // Refresh when the section becomes visible
        onRefresh: self => {
          // Recalculate when the section becomes visible
          if (document.getElementById('photography-section') && document.getElementById('photography-section').style.display !== 'none') {
            self.refresh();
          }
        }
      }
    });
  });
}

// Add this function to refresh animations when window resizes
window.addEventListener('resize', function() {
  // Only refresh photography animations if photography section is visible
  const photographySection = document.getElementById('photography-section');
  if (photographySection && photographySection.style.display !== 'none') {
    setTimeout(() => {
      ScrollTrigger.refresh();
      initPhotographyGalleryAnimations();
    }, 250);
  }
});

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, Flip, Observer, ScrollToPlugin, Draggable, MotionPathPlugin, TextPlugin, CustomEase);