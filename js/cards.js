// projects-animations.js

// Register GSAP plugins (kept at the top for clarity)
gsap.registerPlugin(ScrollTrigger, Flip, Observer, ScrollToPlugin, Draggable, MotionPathPlugin, TextPlugin, CustomEase);


// --- INITIALIZATION & SETUP ---

document.addEventListener('DOMContentLoaded', function() {
    // Initialize GSAP animations
    initProjectAnimations();
    initMobileOptimizations(); // Contains the main resize listener now

    // Force refresh ScrollTrigger after page load
    setTimeout(() => {
        ScrollTrigger.refresh();

        // Double refresh for mobile (sometimes needed)
        if (window.innerWidth <= 768) {
            setTimeout(() => {
                ScrollTrigger.refresh();
                checkVisibleCards();
            }, 500);
        }
    }, 100);

    // Initial check for visible cards
    setTimeout(() => {
        if (window.innerWidth <= 768) {
            checkVisibleCards();
        }
    }, 1000);
});

// Handle page show event (when navigating back to page)
document.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        // Page was loaded from cache
        setTimeout(() => {
            ScrollTrigger.refresh();
            if (window.innerWidth <= 768) {
                checkVisibleCards();
            }
        }, 100);
    }
});

// Handle visibility change
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        // Page became visible again
        setTimeout(() => {
            ScrollTrigger.refresh();
        }, 300);
    }
});

// Add to your navigation menu if you have control
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', function(e) {
        // Only handle internal HTML navigation
        if (this.href && this.href.includes('.html')) {
            // Prepare for page transition
            ScrollTrigger.getAll().forEach(trigger => {
                if (trigger.trigger && trigger.trigger.classList.contains('project-card')) {
                    trigger.kill();
                }
            });
        }
    });
});

// Force refresh on full page load as well
window.addEventListener('load', function() {
    setTimeout(() => {
        ScrollTrigger.refresh();

        if (window.innerWidth <= 768) {
            // Force animation of visible elements on mobile
            gsap.utils.toArray('.project-card').forEach(card => {
                const rect = card.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    gsap.to(card, {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        ease: "power2.out"
                    });
                }
            });

            // Double refresh for good measure
            setTimeout(() => ScrollTrigger.refresh(), 200);
        }
    }, 100);
});


// --- CORE ANIMATION FUNCTIONS ---

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

    // Fade in the project controls on page load
    gsap.fromTo('.project-controls',
        {
            opacity: 0,
            y: 20
        },
        {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            delay: 0.7 // Triggers right after the category buttons finish
        }
    );

    // Animate project cards when they come into view
    animateProjectCards();

    // Animate project content after cards are visible
    setupContentAnimations();
}

function animateProjectCards() {
    // Kill existing triggers for project cards before creating new ones
    ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger && trigger.trigger.classList.contains('project-card')) {
            trigger.kill();
        }
    });

    const isMobile = window.innerWidth <= 768;

    // Mobile-optimized ScrollTrigger settings
    const mobileSettings = {
        start: "top 90%",
        toggleActions: "play none none none" // Changed from reverse
    };

    const desktopSettings = {
        start: "top 85%",
        toggleActions: "play none none none" // Changed from reverse
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
                once: true, // <--- ADD THIS LINE
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
                },
                // Add refresh callback for navigation issues
                onRefresh: self => {
                    if (self.isActive && getComputedStyle(card).opacity === '0') {
                        gsap.to(card, {
                            opacity: 1,
                            y: 0,
                            duration: 0.5,
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


// --- REFRESH/UTILITY FUNCTIONS ---

// Mobile optimization functions
function initMobileOptimizations() {
    // Refresh ScrollTrigger on mobile orientation change
    window.addEventListener('orientationchange', function() {
        setTimeout(() => {
            ScrollTrigger.refresh(true);
            checkVisibleCards();
        }, 500);
    });

    // *** FIXED/IMPROVED: Single, robust, debounced resize handler ***
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Always refresh ScrollTrigger globally
            ScrollTrigger.refresh(true); // 'true' forces a full recalculation

            const photographySection = document.getElementById('photography-section');
            const isPhotographyVisible = photographySection && photographySection.style.display !== 'none';

            if (isPhotographyVisible) {
                initPhotographyGalleryAnimations();
            } else {
                reinitAnimations(); // Kills and recreates project card triggers
            }

            // On mobile, also check if any cards in view need animating
            if (window.innerWidth <= 768) {
                checkVisibleCards();
            }
        }, 250);
    });

    // Add page transition support
    window.addEventListener('beforeunload', function() {
        // Clean up ScrollTriggers before leaving page
        ScrollTrigger.getAll().forEach(trigger => {
            if (trigger.trigger && trigger.trigger.classList.contains('project-card')) {
                trigger.kill();
            }
        });
    });
}

// Enhanced check visible cards function
function checkVisibleCards() {
    let animatedCount = 0;

    gsap.utils.toArray('.project-card').forEach(card => {
        const rect = card.getBoundingClientRect();
        const isVisible = (
            rect.top <= window.innerHeight * 0.9 &&
            rect.bottom >= window.innerHeight * 0.1
        );

        if (isVisible && (card.style.opacity === '0' || getComputedStyle(card).opacity === '0')) {
            gsap.to(card, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power2.out",
                onComplete: () => {
                    animatedCount++;
                    // If we animated cards but ScrollTrigger might still be broken, force refresh
                    if (animatedCount > 0) {
                        setTimeout(() => ScrollTrigger.refresh(), 100);
                    }
                }
            });
            animateCardContent(card);
        }
    });

    // If no cards were animated but we're on mobile, force one more check
    if (animatedCount === 0 && window.innerWidth <= 768) {
        setTimeout(() => {
            ScrollTrigger.refresh();
        }, 500);
    }
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





// --- CARD EXPANSION LOGIC ---

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

    // Kill all ScrollTriggers created inside the fullscreen card
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

            // *** FIXED/IMPROVED: Force refresh of all main page ScrollTriggers ***
            ScrollTrigger.refresh(true);
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


// --- SECTION SWITCHING LOGIC ---

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
    // Grab the controls container
    const projectControls = document.querySelector('.project-controls'); 

    if (section === 'photography') {
        // Slide projects AND controls LEFT → hide
        tl.to([projectGrid, projectControls], {
            x: '-100%',
            opacity: 0,
            duration: 0.6,
            ease: "power2.inOut",
            onComplete: () => {
                projectGrid.style.display = 'none';
                // Hide controls from the DOM so they don't take up space
                if (projectControls) projectControls.style.display = 'none'; 
                
                // Reset photography images to invisible BEFORE showing the section
                gsap.set("#image-gallery img", { y: 80, opacity: 0 });
                
                photographySection.style.display = 'block';

                // Initialize 3D gallery after section becomes visible
                setTimeout(() => {
                    ScrollTrigger.refresh();
                    // Initialize 3D gallery instead of old gallery animations
                    if (window.init3DGallery) {
                        window.init3DGallery();
                    } else {
                        // Fallback to old gallery if 3D not loaded
                        initPhotographyGalleryAnimations();
                    }
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
        // Destroy 3D gallery before switching away
        if (window.destroy3DGallery) {
            window.destroy3DGallery();
        }
        
        // Slide photography RIGHT → hide
        tl.to(photographySection, {
            x: '100%',
            opacity: 0,
            duration: 0.6,
            ease: "power2.inOut",
            onComplete: () => {
                photographySection.style.display = 'none';
                
                // Reset project cards to invisible BEFORE showing the grid
                gsap.set('.project-card', { opacity: 0, y: 100 });
                
                projectGrid.style.display = 'grid';
                // Bring the controls back into the DOM layout
                if (projectControls) projectControls.style.display = 'flex'; 

                // Refresh ScrollTrigger after section change
                setTimeout(() => {
                    ScrollTrigger.refresh();
                    reinitAnimations();
                }, 100);
            }
        })
        // Slide projects AND controls IN from LEFT
        .fromTo([projectGrid, projectControls],
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


// --- PHOTOGRAPHY GALLERY LOGIC ---

const totalImages = 71;
const folderPath = "/img/Photography/";
const gallery = document.getElementById("image-gallery");

// Create and show loading spinner
function createLoadingSpinner() {
    const spinnerContainer = document.createElement("div");
    spinnerContainer.id = "gallery-loader";
    spinnerContainer.innerHTML = `
        <div class="spinner"></div>
        <p>Loading gallery...</p>
    `;
    spinnerContainer.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        z-index: 10;
    `;
    
    // Add spinner styles if not already in CSS
    const style = document.createElement("style");
    style.textContent = `
        .spinner {
            width: 50px;
            height: 50px;
            border: 3px solid rgba(255,255,255,0.3);
            border-top-color: #fff;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 15px;
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        #image-gallery {
            position: relative;
            min-height: 200px;
        }
        #image-gallery.loading {
            opacity: 0;
            pointer-events: none;
        }
        #image-gallery.loaded {
            opacity: 1;
            transition: opacity 0.5s ease;
        }
    `;
    document.head.appendChild(style);
    
    return spinnerContainer;
}

// Initialize gallery with loader
if (gallery) {
    gallery.innerHTML = '';
    gallery.classList.add('loading');
    
    const loader = createLoadingSpinner();
    gallery.parentNode.insertBefore(loader, gallery);

    const imagePromises = [];
    const loadedImages = [];

    // Create image elements and load them
    for (let i = 1; i <= totalImages; i++) {
        const img = document.createElement("img");
        img.src = `${folderPath}foto (${i}).jpg`;
        img.alt = `Photo ${i}`;
        img.loading = "eager"; // Changed to eager since we're preloading anyway
        
        // Create promise for each image load
        const loadPromise = new Promise((resolve, reject) => {
            img.onload = () => resolve(img);
            img.onerror = () => {
                console.warn(`Failed to load image: ${img.src}`);
                resolve(img); // Resolve anyway to not block other images
            };
            
            // Timeout fallback (5 seconds)
            setTimeout(() => resolve(img), 5000);
        });
        
        imagePromises.push(loadPromise);
        loadedImages.push(img);
        gallery.appendChild(img);
    }

    // Wait for all images to load
    Promise.all(imagePromises).then(() => {
        // Remove loader
        loader.remove();
        
        // Reveal gallery with fade
        gallery.classList.remove('loading');
        gallery.classList.add('loaded');
        
        // Initialize animations after images are ready
        initPhotographyGalleryAnimations();
    });
}

// Photography gallery scroll-reveal animation
function initPhotographyGalleryAnimations() {
    const galleryImages = document.querySelectorAll("#image-gallery img");

    if (!galleryImages.length) return;

    // Kill any existing ScrollTriggers
    galleryImages.forEach(img => {
        const triggerId = `photo-${img.src}`;
        ScrollTrigger.getById(triggerId)?.kill();
    });

    galleryImages.forEach((img, index) => {
        // Stagger the initial reveal slightly
        gsap.set(img, { y: 80, opacity: 0 });

        gsap.to(img, {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            delay: index * 0.02, // Slight stagger for initial load
            scrollTrigger: {
                id: `photo-${img.src}`,
                trigger: img,
                start: "top 85%",
                end: "bottom 20%",
                toggleActions: "play none none none",
                scroller: window,
                onRefresh: self => {
                    if (document.getElementById('photography-section')?.style.display !== 'none') {
                        self.refresh();
                    }
                }
            }
        });
    });
}






document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("project-grid");
    const sortSelect = document.getElementById("sort-projects");
    const yearSelect = document.getElementById("filter-year");
    const tagSelect = document.getElementById("filter-tag");
  
    // Safety check: Only run if the controls actually exist on this page
    if (!grid || !sortSelect || !yearSelect || !tagSelect) return;
  
    const cards = Array.from(grid.querySelectorAll(".project-card"));
  
    function updateProjects() {
      const sortVal = sortSelect.value;
      const yearVal = yearSelect.value;
      const tagVal = tagSelect.value;
  
      // 1. Sort the cards array safely
      cards.sort((a, b) => {
        // Fallbacks prevent errors if an attribute is missing
        const titleA = (a.dataset.title || "").toLowerCase();
        const titleB = (b.dataset.title || "").toLowerCase();
        const dateA = a.dataset.date || "";
        const dateB = b.dataset.date || "";
  
        if (sortVal === "title-asc") return titleA.localeCompare(titleB);
        if (sortVal === "title-desc") return titleB.localeCompare(titleA);
        if (sortVal === "date-desc") return dateB.localeCompare(dateA);
        if (sortVal === "date-asc") return dateA.localeCompare(dateB);
        
        return 0; // Default
      });
  
      // 2. Filter and apply new order
      cards.forEach((card, index) => {
        const cardYear = card.dataset.year || "";
        const cardTags = card.dataset.tags || "";
  
        const matchYear = yearVal === "all" || cardYear === yearVal;
        const matchTag = tagVal === "all" || cardTags.includes(tagVal);
  
        if (matchYear && matchTag) {
          card.style.display = "block";  // Show card
          card.style.order = index;      // Apply CSS Grid order
        } else {
          card.style.display = "none";   // Hide card
        }
      });
  
      // Refresh GSAP ScrollTrigger if it exists so animations don't break
      if (typeof ScrollTrigger !== 'undefined') {
          ScrollTrigger.refresh();
      }
    }
  
    // Listen for changes on the dropdowns
    sortSelect.addEventListener("change", updateProjects);
    yearSelect.addEventListener("change", updateProjects);
    tagSelect.addEventListener("change", updateProjects);
  });


 // ============================================
// 3D INFINITE GALLERY - Three.js + GSAP
// ============================================

// Helper to get CSS variable as hex number for Three.js
function getCSSVariableAsHex(variableName) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
  
  if (value.startsWith('#')) {
    return parseInt(value.replace('#', ''), 16);
  }
  
  if (value.startsWith('rgb')) {
    const parts = value.match(/\d+/g);
    if (parts && parts.length >= 3) {
      const r = parseInt(parts[0]);
      const g = parseInt(parts[1]);
      const b = parseInt(parts[2]);
      return (r << 16) | (g << 8) | b;
    }
  }
  
  return 0x0a0a0a;
}

class InfiniteGallery3D {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;
    
    this.canvas = this.container.querySelector('#gallery-3d-canvas');
    if (!this.canvas) {
      console.error('Canvas not found');
      return;
    }

    // Configuration
    this.config = {
      speed: options.speed || 1.2,
      zSpacing: options.zSpacing || 3,
      visibleCount: options.visibleCount || 12,
      falloff: options.falloff || { near: 0.8, far: 14 },
      fadeIn: options.fadeIn || { start: 0.05, end: 0.25 },
      fadeOut: options.fadeOut || { start: 0.4, end: 0.43 },
      maxBlur: options.maxBlur || 8,
      ...options
    };

    // State
    this.images = [];
    this.textures = [];
    this.planes = [];
    this.materials = [];
    this.scrollVelocity = 0;
    this.autoPlay = true;
    this.lastInteraction = Date.now();
    this.isActive = false;
    this.isFullscreen = false;
    this.currentFullscreenImage = null;
    
    // Three.js components
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.clock = new THREE.Clock();
    
    // Bind methods
    this.animate = this.animate.bind(this);
    this.handleWheel = this.handleWheel.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.closeFullscreen = this.closeFullscreen.bind(this);
    
    // Initialize
    this.init();

     // Fullscreen state
 this.isFullscreen = false;
  this.isClosing = false; // Add this to prevent double-close
  this.fullscreenClone = null;
  this.fullscreenBackdrop = null;
  this.clickedPlane = null;
  this.clickedPlaneOriginalZ = null;
  
  // Bind click handler
  this.handleClick = this.handleClick.bind(this);
  this.closeFullscreen = this.closeFullscreen.bind(this);
  }

  async init() {
    if (!this.checkWebGL()) {
      this.showFallback();
      return;
    }

    this.showLoading();
    this.setupScene();
    this.setupCamera();
    this.setupRenderer();
    this.setupLights();
    this.setupFullscreenOverlay(); // Add fullscreen overlay
    
    await this.loadImages();
    this.createPlanes();
    this.setupEvents();
    this.hideLoading();
    
    this.isActive = true;
    this.animate();

    console.log('3D Gallery initialized with', this.images.length, 'images');
  }

  // ============================================
  // FULLSCREEN OVERLAY SETUP
  // ============================================
  
  setupFullscreenOverlay() {
    // Create fullscreen overlay container
    this.fullscreenOverlay = document.createElement('div');
    this.fullscreenOverlay.className = 'gallery-fullscreen-overlay';
    this.fullscreenOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(10, 10, 10, 0.95);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.4s ease, visibility 0.4s ease;
      cursor: zoom-out;
    `;
    
    // Create image element
    this.fullscreenImage = document.createElement('img');
    this.fullscreenImage.className = 'img'; // Add the class you requested
    this.fullscreenImage.style.cssText = `
      max-width: 90vw;
      max-height: 90vh;
      object-fit: contain;
      transform: scale(0.9);
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    `;
    
    // Create close button
    this.closeButton = document.createElement('button');
    this.closeButton.innerHTML = '×';
    this.closeButton.style.cssText = `
      position: absolute;
      top: 20px;
      right: 40px;
      background: none;
      border: none;
      color: white;
      font-size: 48px;
      cursor: pointer;
      opacity: 0.7;
      transition: opacity 0.2s;
      z-index: 10000;
    `;
    this.closeButton.addEventListener('mouseenter', () => this.closeButton.style.opacity = '1');
    this.closeButton.addEventListener('mouseleave', () => this.closeButton.style.opacity = '0.7');
    
    // Assemble overlay
    this.fullscreenOverlay.appendChild(this.fullscreenImage);
    this.fullscreenOverlay.appendChild(this.closeButton);
    document.body.appendChild(this.fullscreenOverlay);
    
    // Click to close
    this.fullscreenOverlay.addEventListener('click', (e) => {
      if (e.target === this.fullscreenOverlay || e.target === this.closeButton) {
        this.closeFullscreen();
      }
    });
    
    // Escape key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isFullscreen) {
        this.closeFullscreen();
      }
    });
  }

  openFullscreen(imageSrc) {
    if (!imageSrc) return;
    
    this.isFullscreen = true;
    this.currentFullscreenImage = imageSrc;
    this.fullscreenImage.src = imageSrc;
    
    // Pause gallery animation
    this.autoPlay = false;
    
    // Show overlay with animation
    requestAnimationFrame(() => {
      this.fullscreenOverlay.style.visibility = 'visible';
      this.fullscreenOverlay.style.opacity = '1';
      this.fullscreenImage.style.transform = 'scale(1)';
    });
    
    // Disable body scroll
    document.body.style.overflow = 'hidden';
  }

  closeFullscreen() {
    if (!this.isFullscreen) return;
    
    this.isFullscreen = false;
    this.currentFullscreenImage = null;
    
    // Animate out
    this.fullscreenOverlay.style.opacity = '0';
    this.fullscreenImage.style.transform = 'scale(0.9)';
    
    setTimeout(() => {
      this.fullscreenOverlay.style.visibility = 'hidden';
      this.fullscreenImage.src = '';
    }, 400);
    
    // Resume autoplay after delay
    setTimeout(() => {
      this.lastInteraction = Date.now();
      this.setAutoPlay(true);
    }, 100);
    
    // Re-enable body scroll
    document.body.style.overflow = '';
  }

  // ============================================
  // CLICK HANDLING
  // ============================================
  
// Handle click to open fullscreen
handleClick(e) {
  // Prevent any clicks when fullscreen is active (they'll be handled by close handler)
  if (this.isFullscreen) {
    return;
  }
  
  if (!this.raycaster || !this.mouse) return;

  // Update mouse position
  this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  this.raycaster.setFromCamera(this.mouse, this.camera);
  const intersects = this.raycaster.intersectObjects(this.planes);

  if (intersects.length > 0) {
    const clickedMesh = intersects[0].object;
    this.openFullscreen(clickedMesh);
  }
}


  pause() {
    this.isActive = false;
    if (this.canvas) {
      this.canvas.style.display = 'none';
    }
  }

  resume() {
    if (!this.isActive) {
      this.isActive = true;
      if (this.canvas) {
        this.canvas.style.display = 'block';
      }
      this.clock.start();
      this.animate();
    }
  }

  checkWebGL() {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      return !!gl;
    } catch (e) {
      return false;
    }
  }

  showFallback() {
    const originalGallery = document.getElementById('image-gallery');
    if (originalGallery) {
      originalGallery.style.display = 'block';
      this.container.style.display = 'none';
    }
  }

  showLoading() {
    const loader = document.createElement('div');
    loader.className = 'gallery-3d-loading';
    loader.innerHTML = 'Loading Gallery...';
    loader.id = 'gallery-3d-loader';
    this.container.appendChild(loader);
  }

  hideLoading() {
    const loader = document.getElementById('gallery-3d-loader');
    if (loader) {
      gsap.to(loader, {
        opacity: 0,
        duration: 0.5,
        onComplete: () => loader.remove()
      });
    }
  }

  setupScene() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x0a0a0a, 0.02);
  }

  setupCamera() {
    this.camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    this.camera.position.set(0, 0, 0);
  }

  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    const bgColor = getCSSVariableAsHex('--black');
    this.renderer.setClearColor(bgColor, 1);
  }

  setupLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.4);
    dirLight.position.set(5, 5, 5);
    this.scene.add(dirLight);
  }

  async loadImages() {
    const totalImages = 71;
    const folderPath = "/img/Photography/";
    
    const loadPromises = [];
    
    for (let i = 1; i <= totalImages; i++) {
      const src = `${folderPath}foto (${i}).jpg`;
      const promise = this.loadTexture(src)
        .then(texture => ({ src, texture, index: i }))
        .catch(() => null);
      loadPromises.push(promise);
    }

    const results = await Promise.all(loadPromises);
    this.images = results.filter(r => r !== null);
    this.textures = this.images.map(img => img.texture);
    
    console.log(`Loaded ${this.images.length} textures`);
  }

  loadTexture(src) {
    return new Promise((resolve, reject) => {
      const loader = new THREE.TextureLoader();
      loader.load(
        src,
        texture => {
          texture.minFilter = THREE.LinearFilter;
          texture.magFilter = THREE.LinearFilter;
          resolve(texture);
        },
        undefined,
        error => reject(error)
      );
    });
  }

  createClothMaterial() {
    const vertexShader = `
      uniform float scrollForce;
      uniform float time;
      uniform float isHovered;
      varying vec2 vUv;
      varying vec3 vNormal;
      
      void main() {
        vUv = uv;
        vNormal = normal;
        
        vec3 pos = position;
        
        float curveIntensity = scrollForce * 0.3;
        float distanceFromCenter = length(pos.xy);
        float curve = distanceFromCenter * distanceFromCenter * curveIntensity;
        
        float ripple1 = sin(pos.x * 2.0 + scrollForce * 3.0) * 0.02;
        float ripple2 = sin(pos.y * 2.5 + scrollForce * 2.0) * 0.015;
        float clothEffect = (ripple1 + ripple2) * abs(curveIntensity) * 2.0;
        
        float flagWave = 0.0;
        if (isHovered > 0.5) {
          float wavePhase = pos.x * 3.0 + time * 8.0;
          float waveAmplitude = sin(wavePhase) * 0.1;
          float dampening = smoothstep(-0.5, 0.5, pos.x);
          flagWave = waveAmplitude * dampening;
          
          float secondaryWave = sin(pos.x * 5.0 + time * 12.0) * 0.03 * dampening;
          flagWave += secondaryWave;
        }
        
        pos.z -= (curve + clothEffect + flagWave);
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `;

    const fragmentShader = `
      uniform sampler2D map;
      uniform float opacity;
      uniform float blurAmount;
      uniform float scrollForce;
      varying vec2 vUv;
      varying vec3 vNormal;
      
      void main() {
        vec4 color = texture2D(map, vUv);
        
        if (blurAmount > 0.0) {
          vec2 texelSize = 1.0 / vec2(textureSize(map, 0));
          vec4 blurred = vec4(0.0);
          float total = 0.0;
          
          for (float x = -2.0; x <= 2.0; x += 1.0) {
            for (float y = -2.0; y <= 2.0; y += 1.0) {
              vec2 offset = vec2(x, y) * texelSize * blurAmount;
              float weight = 1.0 / (1.0 + length(vec2(x, y)));
              blurred += texture2D(map, vUv + offset) * weight;
              total += weight;
            }
          }
          color = blurred / total;
        }
        
        float curveHighlight = abs(scrollForce) * 0.05;
        color.rgb += vec3(curveHighlight * 0.1);
        
        gl_FragColor = vec4(color.rgb, color.a * opacity);
      }
    `;

    return new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        map: { value: null },
        opacity: { value: 1.0 },
        blurAmount: { value: 0.0 },
        scrollForce: { value: 0.0 },
        time: { value: 0.0 },
        isHovered: { value: 0.0 }
      },
      vertexShader,
      fragmentShader
    });
  }

  createPlanes() {
    const count = Math.min(this.config.visibleCount, this.images.length);
    const depthRange = 50;
    const totalImages = this.images.length;

    this.materials = Array.from({ length: count }, () => this.createClothMaterial());

    const spatialPositions = [];
    const maxHorizontalOffset = 8;
    const maxVerticalOffset = 8;

    for (let i = 0; i < count; i++) {
      const horizontalAngle = (i * 2.618) % (Math.PI * 2);
      const verticalAngle = (i * 1.618 + Math.PI / 3) % (Math.PI * 2);
      const horizontalRadius = (i % 3) * 1.2;
      const verticalRadius = ((i + 1) % 4) * 0.8;

      const x = (Math.sin(horizontalAngle) * horizontalRadius * maxHorizontalOffset) / 3;
      const y = (Math.cos(verticalAngle) * verticalRadius * maxVerticalOffset) / 4;

      spatialPositions.push({ x, y });
    }

    for (let i = 0; i < count; i++) {
      const texture = this.textures[i % totalImages];
      const material = this.materials[i];
      material.uniforms.map.value = texture;

      const aspect = texture.image ? texture.image.width / texture.image.height : 1;
      const scale = aspect > 1 ? [2 * aspect, 2, 1] : [2, 2 / aspect, 1];

      const geometry = new THREE.PlaneGeometry(1, 1, 32, 32);
      const mesh = new THREE.Mesh(geometry, material);

      const z = ((depthRange / count) * i) % depthRange;
      mesh.position.set(spatialPositions[i].x, spatialPositions[i].y, z - depthRange / 2);
      mesh.scale.set(...scale);

      mesh.userData = {
        index: i,
        z: z,
        imageIndex: i % totalImages,
        baseX: spatialPositions[i].x,
        baseY: spatialPositions[i].y,
        depthRange: depthRange
      };

      this.scene.add(mesh);
      this.planes.push(mesh);
    }
  }

  setupEvents() {
    window.addEventListener('wheel', this.handleWheel, { passive: false });
    document.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('resize', this.handleResize);
    
    // Click event for fullscreen
    this.canvas.addEventListener('click', this.handleClick);
    
    let touchStartY = 0;
    this.canvas.addEventListener('touchstart', (e) => {
      touchStartY = e.touches[0].clientY;
      this.setAutoPlay(false);
    }, { passive: true });
    
    this.canvas.addEventListener('touchmove', (e) => {
      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;
      this.scrollVelocity += deltaY * 0.02 * this.config.speed;
      touchStartY = touchY;
      this.setAutoPlay(false);
    }, { passive: true });

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    
    this.canvas.addEventListener('mousemove', (e) => {
      this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    // Click for fullscreen
  this.canvas.addEventListener('click', this.handleClick);
  
  // ESC key for closing fullscreen
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && this.isFullscreen) {
      this.closeFullscreen();
    }
  });
  }

  handleWheel(e) {
    e.preventDefault();
    this.scrollVelocity += e.deltaY * 0.01 * this.config.speed;
    this.setAutoPlay(false);
  }

  handleKeyDown(e) {
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      this.scrollVelocity -= 2 * this.config.speed;
      this.setAutoPlay(false);
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      this.scrollVelocity += 2 * this.config.speed;
      this.setAutoPlay(false);
    }
  }

  handleResize() {
    if (!this.camera || !this.renderer) return;
    
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  setAutoPlay(value) {
    this.autoPlay = value;
    this.lastInteraction = Date.now();
    
    if (!value) {
      setTimeout(() => {
        if (Date.now() - this.lastInteraction >= 3000) {
          this.autoPlay = true;
        }
      }, 3000);
    }
  }

  updatePlanes(delta) {
    const time = this.clock.getElapsedTime();
    
    if (this.autoPlay) {
      this.scrollVelocity += 0.3 * delta;
    }

    this.scrollVelocity *= 0.95;

    this.materials.forEach(mat => {
      mat.uniforms.time.value = time;
      mat.uniforms.scrollForce.value = this.scrollVelocity;
    });

    const depthRange = 50;
    const totalImages = this.images.length;
    const imageAdvance = this.planes.length % totalImages || totalImages;

    this.planes.forEach((plane, i) => {
      let newZ = plane.userData.z + this.scrollVelocity * delta * 10;
      let wrapsForward = 0;
      let wrapsBackward = 0;

      if (newZ >= depthRange) {
        wrapsForward = Math.floor(newZ / depthRange);
        newZ -= depthRange * wrapsForward;
      } else if (newZ < 0) {
        wrapsBackward = Math.ceil(-newZ / depthRange);
        newZ += depthRange * wrapsBackward;
      }

      if (wrapsForward > 0) {
        plane.userData.imageIndex = (plane.userData.imageIndex + wrapsForward * imageAdvance) % totalImages;
      }
      if (wrapsBackward > 0) {
        const step = plane.userData.imageIndex - wrapsBackward * imageAdvance;
        plane.userData.imageIndex = ((step % totalImages) + totalImages) % totalImages;
      }

      plane.userData.z = ((newZ % depthRange) + depthRange) % depthRange;
      const worldZ = plane.userData.z - depthRange / 2;
      plane.position.z = worldZ;

      const newTexture = this.textures[plane.userData.imageIndex];
      if (plane.material.uniforms.map.value !== newTexture) {
        plane.material.uniforms.map.value = newTexture;
        
        const aspect = newTexture.image ? newTexture.image.width / newTexture.image.height : 1;
        const scale = aspect > 1 ? [2 * aspect, 2, 1] : [2, 2 / aspect, 1];
        plane.scale.set(...scale);
      }

      const normalizedPos = plane.userData.z / depthRange;
      let opacity = 1;

      if (normalizedPos >= this.config.fadeIn.start && normalizedPos <= this.config.fadeIn.end) {
        opacity = (normalizedPos - this.config.fadeIn.start) / (this.config.fadeIn.end - this.config.fadeIn.start);
      } else if (normalizedPos < this.config.fadeIn.start) {
        opacity = 0;
      } else if (normalizedPos >= this.config.fadeOut.start && normalizedPos <= this.config.fadeOut.end) {
        opacity = 1 - (normalizedPos - this.config.fadeOut.start) / (this.config.fadeOut.end - this.config.fadeOut.start);
      } else if (normalizedPos > this.config.fadeOut.end) {
        opacity = 0;
      }

      let blur = 0;
      if (normalizedPos >= 0 && normalizedPos <= 0.1) {
        blur = this.config.maxBlur * (1 - normalizedPos / 0.1);
      } else if (normalizedPos >= 0.4 && normalizedPos <= 0.43) {
        blur = this.config.maxBlur * ((normalizedPos - 0.4) / 0.03);
      } else if (normalizedPos > 0.43) {
        blur = this.config.maxBlur;
      }

      plane.material.uniforms.opacity.value = Math.max(0, Math.min(1, opacity));
      plane.material.uniforms.blurAmount.value = Math.max(0, Math.min(this.config.maxBlur, blur));
    });
  }

  // Handle click to open fullscreen
handleClick(e) {
  if (this.isFullscreen) {
    // If already fullscreen, close it
    this.closeFullscreen();
    return;
  }
  
  if (!this.raycaster || !this.mouse) return;

  // Update mouse position
  this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  this.raycaster.setFromCamera(this.mouse, this.camera);
  const intersects = this.raycaster.intersectObjects(this.planes);

  if (intersects.length > 0) {
    const clickedMesh = intersects[0].object;
    this.openFullscreen(clickedMesh);
  }
}

// Open fullscreen from a plane
openFullscreen(plane) {
  if (this.isFullscreen) return;
  
  this.isFullscreen = true;
  this.clickedPlane = plane;
  
  // Pause auto-scroll
  this.autoPlay = false;
  this.scrollVelocity = 0;
  
  // Store original Z position for return animation
  this.clickedPlaneOriginalZ = plane.position.z;
  
  // Move plane to front (z = 0) so we can see it clearly during transition
  // We'll animate a DOM element instead, but this helps with the transition feel
  plane.material.uniforms.opacity.value = 0; // Hide the WebGL plane temporarily
  
  // Get the image source from the plane's texture
  const texture = plane.material.uniforms.map.value;
  const imageSrc = this.images[plane.userData.imageIndex].src;
  
  // Project 3D position to 2D screen coordinates
  const screenPos = this.getScreenPosition(plane);
  
  // Create fullscreen experience
  this.createFullscreenClone(imageSrc, screenPos, plane);
}

// Project 3D world position to 2D screen coordinates
getScreenPosition(object) {
  const vector = new THREE.Vector3();
  object.getWorldPosition(vector);
  
  // Project to normalized device coordinates (-1 to +1)
  vector.project(this.camera);
  
  // Convert to screen coordinates
  const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
  const y = (-(vector.y * 0.5) + 0.5) * window.innerHeight;
  
  return { x, y };
}

// Create and animate the fullscreen clone
createFullscreenClone(imageSrc, startPos, plane) {
  // Lock scroll
  document.body.style.overflow = 'hidden';
  
  // Create backdrop
  this.fullscreenBackdrop = document.createElement('div');
  this.fullscreenBackdrop.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0,0,0,0);
    z-index: 1000;
    pointer-events: auto;
    cursor: none;
  `;
  document.body.appendChild(this.fullscreenBackdrop);
  
  // Create clone image
  this.fullscreenClone = document.createElement('img');
  this.fullscreenClone.src = imageSrc;
  this.fullscreenClone.style.cssText = `
    position: fixed;
    left: ${startPos.x}px;
    top: ${startPos.y}px;
    width: ${plane.scale.x * 100}px;
    height: ${plane.scale.y * 100}px;
    object-fit: cover;
    z-index: 1001;
    pointer-events: auto;
    cursor: none;
    transform: translate(-50%, -50%);
  `;
  document.body.appendChild(this.fullscreenClone);
  
  // Get natural image dimensions for aspect ratio
  const img = new Image();
  img.onload = () => {
    const natW = img.naturalWidth;
    const natH = img.naturalHeight;
    const ratio = natW / natH;
    
    // Calculate target fullscreen size
    const maxW = window.innerWidth * 0.95;
    const maxH = window.innerHeight * 0.95;
    let targetW, targetH;
    
    if (ratio > maxW / maxH) {
      targetW = maxW;
      targetH = targetW / ratio;
    } else {
      targetH = maxH;
      targetW = targetH * ratio;
    }
    
    // Animate to fullscreen
    const tl = gsap.timeline();
    
    tl.to(this.fullscreenBackdrop, {
      background: 'rgba(0,0,0,0.92)',
      duration: 0.6,
      ease: 'power2.out'
    }, 0)
    .to(this.fullscreenClone, {
      left: '50%',
      top: '50%',
      width: targetW,
      height: targetH,
      duration: 0.9,
      ease: 'power3.out'
    }, 0);
    
    // Add click handlers with STOP PROPAGATION
    const closeHandler = (e) => {
      e.stopPropagation(); // Prevent click from reaching canvas
      e.preventDefault();  // Prevent default behavior
      this.closeFullscreen();
    };
    
    this.fullscreenClone.addEventListener('click', closeHandler);
    this.fullscreenBackdrop.addEventListener('click', closeHandler);
    
    // Store handlers for cleanup if needed
    this.fullscreenClone._closeHandler = closeHandler;
    this.fullscreenBackdrop._closeHandler = closeHandler;
  };
  img.src = imageSrc;
}

// Close fullscreen and return to gallery
closeFullscreen() {
  if (!this.isFullscreen || !this.fullscreenClone) return;
  
  // Prevent double-closing
  if (this.isClosing) return;
  this.isClosing = true;
  
  // Get current plane position
  const currentScreenPos = this.getScreenPosition(this.clickedPlane);
  
  // Calculate target dimensions based on plane's current scale
  const targetWidth = this.clickedPlane.scale.x * 100;
  const targetHeight = this.clickedPlane.scale.y * 100;
  
  const tl = gsap.timeline({
    onComplete: () => {
      // Cleanup
      if (this.fullscreenClone) {
        this.fullscreenClone.remove();
        this.fullscreenClone = null;
      }
      if (this.fullscreenBackdrop) {
        this.fullscreenBackdrop.remove();
        this.fullscreenBackdrop = null;
      }
      
      // Restore WebGL plane visibility
      if (this.clickedPlane) {
        this.clickedPlane.material.uniforms.opacity.value = 1;
      }
      
      // Reset state
      this.isFullscreen = false;
      this.isClosing = false;
      this.clickedPlane = null;
      this.clickedPlaneOriginalZ = null;
      
      // Resume auto-scroll after a delay
      document.body.style.overflow = '';
      this.lastInteraction = Date.now();
      setTimeout(() => {
        if (!this.isFullscreen && Date.now() - this.lastInteraction >= 3000) {
          this.autoPlay = true;
        }
      }, 3000);
    }
  });
  
  // Animate back to plane position
  tl.to(this.fullscreenBackdrop, {
    background: 'rgba(0,0,0,0)',
    duration: 0.4,
    ease: 'power2.in'
  }, 0)
  .to(this.fullscreenClone, {
    left: currentScreenPos.x,
    top: currentScreenPos.y,
    width: targetWidth,
    height: targetHeight,
    duration: 0.55,
    ease: 'power3.inOut'
  }, 0);
}

// Update checkHover to not change cursor when fullscreen
checkHover() {
  if (!this.raycaster || !this.mouse || this.isFullscreen) return;

  this.raycaster.setFromCamera(this.mouse, this.camera);
  const intersects = this.raycaster.intersectObjects(this.planes);

  this.planes.forEach(plane => {
    plane.material.uniforms.isHovered.value = 0.0;
  });

  if (intersects.length > 0) {
    const hovered = intersects[0].object;
    hovered.material.uniforms.isHovered.value = 1.0;
    this.canvas.style.cursor = 'none'; // Keep cursor hidden
  } else {
    this.canvas.style.cursor = 'none'; // Keep cursor hidden
  }
}

// Update animate to skip updates when fullscreen
animate() {
  if (!this.isActive) return;
  
  // Still render even when fullscreen so gallery continues moving in background
  requestAnimationFrame(this.animate);
  
  const delta = this.clock.getDelta();
  
  // Only update planes (scroll) when not fullscreen
  if (!this.isFullscreen) {
    this.updatePlanes(delta);
  }
  
  this.checkHover();
  this.renderer.render(this.scene, this.camera);
}


  checkHover() {
    if (!this.raycaster || !this.mouse || this.isFullscreen) return;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.planes);

    this.planes.forEach(plane => {
      plane.material.uniforms.isHovered.value = 0.0;
    });

    if (intersects.length > 0) {
      const hovered = intersects[0].object;
      hovered.material.uniforms.isHovered.value = 1.0;
      this.canvas.style.cursor = 'pointer';
    } else {
      this.canvas.style.cursor = 'default';
    }
  }

  animate() {
    if (!this.isActive) return;

    requestAnimationFrame(this.animate);

    const delta = this.clock.getDelta();

    this.updatePlanes(delta);
    this.checkHover();
    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    this.isActive = false;
    
    // Close fullscreen if open
    if (this.isFullscreen) {
      this.closeFullscreen();
    }
    
    window.removeEventListener('wheel', this.handleWheel);
    document.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('resize', this.handleResize);

    this.materials.forEach(mat => mat.dispose());
    this.planes.forEach(plane => plane.geometry.dispose());
    this.textures.forEach(tex => tex.dispose());
    
    this.renderer.dispose();
    
    // Remove fullscreen overlay
    if (this.fullscreenOverlay && this.fullscreenOverlay.parentNode) {
      this.fullscreenOverlay.parentNode.removeChild(this.fullscreenOverlay);
    }
    
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }

  addImage(src) {
    return this.loadTexture(src).then(texture => {
      this.images.push({ src, texture, index: this.images.length });
      this.textures.push(texture);
      return texture;
    });
  }
}

// ============================================
// INITIALIZATION
// ============================================

let gallery3D = null;

function init3DGallery() {
    if (gallery3D) {
        gallery3D.resume();
    } else {
        gallery3D = new InfiniteGallery3D('gallery-3d-container', {
            speed: 1.2,
            visibleCount: 12,
            falloff: { near: 0.8, far: 14 }
        });
    }
}

function destroy3DGallery() {
    if (gallery3D) {
        gallery3D.pause();
    }
}

window.InfiniteGallery3D = InfiniteGallery3D;
window.init3DGallery = init3DGallery;
window.destroy3DGallery = destroy3DGallery;