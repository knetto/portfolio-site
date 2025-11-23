// Wait for the page to load and then trigger the animation
window.addEventListener('load', function() {
let tl = gsap.timeline({ delay: 1.1 }); // Delay before starting animation

tl.to('.MainTitle div', {
  duration: 0.5, 
  y: 0, 
  opacity: 1, // Fade in as they slide up
  stagger: 0.3, // Stagger the animation
  ease: "power3.out", // Ease for a smoother animation
});
});

const container = document.querySelector(".container");

// Add the class to disable transitions
container.classList.add("no-transition");

// GSAP Animation
gsap.timeline({
onComplete: () => {
  // Remove the class after the animation is complete
  container.classList.remove("no-transition");
}
})
.fromTo(".main-h2", 
  { y: -50, opacity: 0 }, 
  { y: 0, opacity: 1, duration: 1, ease: "power2.out" }
)
.fromTo(".container", 
  { y: -50, opacity: 0 }, 
  { y: 0, opacity: 1, duration: 1, ease: "power2.out" },
  "-=1"
);

// JavaScript for the magnetic effect
// Disable magnetic effect on coarse (touch) devices
if (window.matchMedia("(pointer: fine)").matches) {
  const magneticElements = document.querySelectorAll('.hover-this');

  magneticElements.forEach(element => {

    const magneticEffect = (e) => {
      const rect = element.getBoundingClientRect();
      const offsetX = e.clientX - rect.left - rect.width / 2;
      const offsetY = e.clientY - rect.top - rect.height / 2;
      const maxDistance = 100;
      const distance = Math.min(
        Math.sqrt(offsetX * offsetX + offsetY * offsetY),
        maxDistance
      );
      const strength = (1 - distance / maxDistance) * 70;
      const dx = (offsetX / rect.width) * strength;
      const dy = (offsetY / rect.height) * strength;

      element.style.transform = `translate(${dx}px, ${dy}px)`;
    };

    const resetEffect = () => {
      element.style.transform = `translate(0, 0)`;
    };

    element.addEventListener('mousemove', magneticEffect);
    element.addEventListener('mouseleave', resetEffect);
  });
}





// Initial check to apply styles if the page is already scrolled on load
window.addEventListener('load', () => {
  const initialScrollPosition = window.scrollY;
  updateScrollStyles(initialScrollPosition);
});

window.addEventListener('scroll', () => {
  const scrollPosition = window.scrollY; // Current scroll position
  updateScrollStyles(scrollPosition);

  lastScrollPosition = scrollPosition; // Update last scroll position
});


document.addEventListener("DOMContentLoaded", function() {
  const socialIcons = document.querySelectorAll('.social-icon');
  
  // Set initial state of social icons (hidden and off-screen)
  socialIcons.forEach(icon => {
    gsap.set(icon, {
      opacity: 0,  // Initially hidden
      y: 50        // Initially positioned off-screen (below the viewport)
    });
  });

  // Create an IntersectionObserver for the divider to load it when it's in the viewport
  const divider = document.querySelector('.divider');
  const dividerObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Start the GSAP animation for the divider when it's in view
        gsap.to(".divider", {
          duration: 1.5,   // Duration of the animation in seconds
          width: "100%",  // Animate the width to 100% (full width)
          ease: "power2.inOut", // Easing function for smooth animation
          onComplete: function() { // This function will run once the divider animation is complete
            loadSocialIcons(); // Trigger the social icon animation after the divider animation completes
          }
        });

        // Stop observing the divider once it's in view and the animation starts
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.5 // Trigger when 50% of the divider is visible in the viewport
  });

  // Start observing the divider
  dividerObserver.observe(divider);

  // Function to load social icons with staggered animation
  function loadSocialIcons() {
    const socialIcons = document.querySelectorAll('.social-icon');
    
    // Create an IntersectionObserver to detect when the social icons container is fully in the viewport
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Start the GSAP animation with a delay after the icons are in view
          socialIcons.forEach((icon, index) => {
            gsap.to(icon, {
              y: 0,          // Move the icon to its original position
              opacity: 1,    // Fade the icon into full opacity
              duration: 0.8, // Animation duration
              delay: 0.1 + index * 0.2, // Global start delay (0.5 second) + staggered delay for each icon
              ease: "power4.out" // Ease for smoothness
            });
          });
          // Stop observing once the animation starts
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.5 // Trigger when 50% of the social icons are visible in the viewport
    });

    // Observe the social-media-icons container
    const socialMediaIconsContainer = document.querySelector('.social-media-icons');
    observer.observe(socialMediaIconsContainer);
  }
});


document.addEventListener("DOMContentLoaded", function() {
  // Function to trigger animations
  function triggerAnimation(element, animationProps) {
    gsap.fromTo(element, animationProps.from, animationProps.to);
  }

  // IntersectionObserver callback function
const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Trigger animations when elements come into view
      if (entry.target.classList.contains('text-content-h2')) {
        triggerAnimation(entry.target, {
          from: { opacity: 0, transform: 'translateY(50px)' }, // Move from the bottom
          to: { opacity: 1, transform: 'translateY(0)', duration: 1, delay: 0 } // Move to the normal position
        });
      }
      if (entry.target.classList.contains('text-content-p')) {
        triggerAnimation(entry.target, {
          from: { opacity: 0, transform: 'translateY(50px)' }, // Move from the bottom
          to: { opacity: 1, transform: 'translateY(0)', duration: 1, delay: 0 } // Move to the normal position
        });
      }
      if (entry.target.classList.contains('image-content-img')) {
        triggerAnimation(entry.target, {
          from: { opacity: 0, scale: 0.8, transform: 'translateY(50px)' }, // Move from the bottom
          to: { opacity: 1, scale: 1, transform: 'translateY(0)', duration: 1, delay: 0 } // Move to the normal position
        });
      }
      observer.unobserve(entry.target); // Stop observing after animation is triggered
    }
  });
}, {
  threshold: 1 // Trigger when at least 50% of the element is visible
});


  // Observe the elements
  const h2 = document.querySelector(".text-content h2");
  const p = document.querySelectorAll(".text-content p");
  const img = document.querySelectorAll(".image-content img");

  if (h2) {
    h2.classList.add('text-content-h2');
    observer.observe(h2);
  }
  if (p.length > 0) {
    p.forEach((el) => {
      el.classList.add('text-content-p');
      observer.observe(el);
    });
  }
  if (img.length > 0) {
    img.forEach((el) => {
      el.classList.add('image-content-img');
      observer.observe(el);
    });
  }
});



document.addEventListener('DOMContentLoaded', () => {
  const circle = document.querySelector('#blob-circle');

  // Set up the initial state
  gsap.set(circle, { x: 0, y: 0 });

  // Mouse move listener for interactive effect
  document.addEventListener('mousemove', (event) => {
    const { clientX, clientY } = event;
    const circleBounds = circle.getBoundingClientRect();
    const centerX = circleBounds.left + circleBounds.width / 2;
    const centerY = circleBounds.top + circleBounds.height / 2;

    // Calculate distances
    const distX = (clientX - centerX) / 200;
    const distY = (clientY - centerY) / 200;

    // Animate the blob effect
    gsap.to(circle, {
      x: distX,
      y: distY,
      borderRadius: `${50 + distX}% ${50 - distX}% ${50 - distY}% ${50 + distY}%`,
      duration: 0.4,
      ease: 'power3.out',
    });
  });

  // Reset animation when mouse leaves
  document.addEventListener('mouseleave', () => {
    gsap.to(circle, {
      x: 0,
      y: 0,
      borderRadius: '50%',
      duration: 0.6,
      ease: 'elastic.out(1, 0.3)',
    });
  });
});


// Load the GSAP library and ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

window.addEventListener('DOMContentLoaded', () => {
  // Fade-in text from the bottom with ScrollTrigger
  gsap.to('.heading', {
    opacity: 1,
    y: -50, 
    duration: 1.5, // Duration of the animation
    ease: 'power2.out', // Ease-out effect for smooth animation
    scrollTrigger: {
      trigger: '.heading', // Element to watch
      start: 'top 80%', // Trigger the animation when top of the element reaches 80% of the viewport height
      end: 'top 20%', // Optional, end point to reverse or loop the animation
      once: true, // Make sure the animation only happens once
    }
  });

  gsap.to('.subheading', {
    opacity: 1,
    y: -50, 
    duration: 1.5, // Duration of the animation
    ease: 'power2.out', // Ease-out effect for smooth animation
    scrollTrigger: {
      trigger: '.subheading',
      start: 'top 80%',
      end: 'top 20%',
      once: true,
    }
  });

  // Add animation for the circle with ScrollTrigger
  gsap.to('.circle', {
    opacity: 1, // Make the circle fully visible
    scale: 1, // Scale the circle back to its original size
    duration: 1.5, // Duration of the animation
    ease: 'power2.out', // Ease-out effect for smooth animation
    scrollTrigger: {
      trigger: '.circle',
      start: 'top 80%',
      end: 'top 20%',
      once: true,
    }
  });
});


// Wait until the page is loaded to initialize Lenis
document.addEventListener("DOMContentLoaded", function() {
  // Initialize Lenis
  const lenis = new Lenis({
      duration: 0.7,  // Scroll speed
      easing: (t) => t * (2 - t), // Easing function
      smoothWheel: true,  // Enable mouse wheel smoothing
      smoothTouch: false, // Disable touch smoothing (you can enable it)
      touchMultiplier: 2, // Adjust touch scroll speed
      wheelMultiplier: 1, // Adjust mouse wheel scroll speed
      scrollBehavior: 'smooth'  // CSS smooth scrolling
  });

  // Animation loop to keep smooth scrolling updated
  function animate(time) {
      lenis.raf(time);  // Update Lenis with the current time
      requestAnimationFrame(animate);  // Keep the animation frame loop running
  }

  requestAnimationFrame(animate);  // Start the animation loop
});


document.querySelectorAll("img.image").forEach(img => {
  // img.style.cursor = "zoom-in";

  img.addEventListener("click", () => {
    const rect = img.getBoundingClientRect();

    const natW = img.naturalWidth;
    const natH = img.naturalHeight;
    const ratio = natW / natH;

    // Lock scroll
    document.body.style.overflow = "hidden";

    // Backdrop
    const backdrop = document.createElement("div");
    backdrop.className = "fullscreen-backdrop";
    document.body.appendChild(backdrop);

    // Clone to animate
    const clone = img.cloneNode(true);
    clone.className = "fullscreen-img";
    clone.style.transform = "none";
    document.body.appendChild(clone);

    // Initial visible state (square-ish)
    Object.assign(clone.style, {
      left: rect.left + "px",
      top: rect.top + "px",
      width: rect.width + "px",
      height: rect.height + "px",
      clipPath: "inset(0%)"
    });

    clone.getBoundingClientRect(); // force layout

    // Target fullscreen size based on original aspect ratio
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

    const tl = gsap.timeline();

    tl.set(backdrop, { pointerEvents: "auto" })

      .to(backdrop, {
        background: "rgba(0,0,0,0.92)",
        duration: 0.6,
        ease: "power2.out"
      }, 0)

      .to(clone, {
        left: "50%",
        top: "50%",
        xPercent: -50,
        yPercent: -50,
        width: targetW,
        height: targetH,
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 0.9,
        ease: "power3.out"
      }, 0);

    function close() {
      const tl2 = gsap.timeline({
        onComplete: () => {
          clone.remove();
          backdrop.remove();
          document.removeEventListener("keydown", escHandler);
          document.body.style.overflow = ""; // Restore scroll
        }
      });

      tl2.to(backdrop, {
        background: "rgba(0,0,0,0)",
        duration: 0.4,
        ease: "power2.in"
      }, 0)

      .to(clone, {
        left: rect.left + "px",
        top: rect.top + "px",
        width: rect.width + "px",
        height: rect.height + "px",
        xPercent: 0,
        yPercent: 0,
        clipPath: "inset(0%)",
        duration: 0.55,
        ease: "power3.inOut"
      }, 0);
    }

    const escHandler = e => (e.key === "Escape") && close();
    document.addEventListener("keydown", escHandler);

    // Close triggers
    clone.addEventListener("click", close);
    backdrop.addEventListener("click", close);
  });
});







// 1) register the plugin first
gsap.registerPlugin(ScrollTrigger);

// 2) wait until DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  // 3) find every .text-container
  document.querySelectorAll('.text-container').forEach(container => {
    const title = container.querySelector('h2');
    const sub   = container.querySelector('p.subtext');

    // 4a) animate the title
    gsap.from(title, {
      x: -100,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: container,
        start: 'top 80%',
        once: true
      }
    });

    // 4b) animate the subtext, slightly delayed
    gsap.from(sub, {
      x: -100,
      opacity: 0,
      duration: 0.8,
      delay: 0.2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: container,
        start: 'top 80%',
        once: true
      }
    });
  });
});

// 5) ensure ScrollTrigger recalculates positions after everything loads
window.addEventListener('load', () => {
  ScrollTrigger.refresh();
});


const colors = [
  // 🟢 Original 8 (untouched)
  { black: "#0A0A0A", white: "#EEEBE0" }, // Minimal classic
  { black: "#0D0D0D", white: "#B9E6FF" }, // Cyber ice blue
  { black: "#0B0B0C", white: "#FFC8DD" }, // Soft candy
  { black: "#101011", white: "#E4FF8D" }, // Neon lime glow
  { black: "#0E0F10", white: "#FFDBA4" }, // Peach cream
  { black: "#111111", white: "#C5BFF9" }, // Lavender tech
  { black: "#0E0D0F", white: "#F9AFAE" }, // Rose blush
  { black: "#131415", white: "#C2FBD7" }, // Fresh mint

  // 🔥 NEW — more variation (12)
  { black: "#0F0F10", white: "#FF4E4E" }, // Neon danger red (gaming UI)
  { black: "#121214", white: "#00FFCA" }, // Tropical aqua neon (Miami cyber)
  { black: "#131316", white: "#FFD700" }, // Gold accent (luxury high-end)
  { black: "#151618", white: "#40E0D0" }, // Turquoise tech (smooth UI)
  { black: "#0C0C0C", white: "#FF7EDB" }, // Vaporwave magenta
  { black: "#171819", white: "#8AFF00" }, // Toxic radioactive green (energetic)
  { black: "#101010", white: "#FF9F1C" }, // Sunset punch orange (bold)
  { black: "#18191A", white: "#89C2D9" }, // Muted soft cyan (calmer theme)
  { black: "#0D0E0F", white: "#FF5F00" }, // Warm vivid orange (retro neon)
  { black: "#1A1A1B", white: "#B983FF" }, // Electric violet (creative coding)
  { black: "#0B0C0D", white: "#82FF9E" }, // Pastel mint gaming (lighter)
  { black: "#1C1C1D", white: "#FFE5B4" }, // Soft buttery beige (classy warm)
];

let currentTheme = 0;
const root = document.documentElement;
const toggleBtn = document.getElementById("theme-toggle");

function applyTheme(index) {
  root.style.setProperty("--black", colors[index].black);
  root.style.setProperty("--white", colors[index].white);

  root.style.setProperty("--navBackground", colors[index].white);
  root.style.setProperty("--navText", colors[index].black);
  root.style.setProperty("--scrollbarTrack", colors[index].black);
  root.style.setProperty("--scrollbar", colors[index].black);
  root.style.setProperty("--scrollbarThumb", colors[index].white);
  root.style.setProperty("--bg", colors[index].white);
  root.style.setProperty("--navBarText", colors[index].white);

  toggleBtn.style.backgroundColor = colors[index].black;
  toggleBtn.style.borderColor = colors[index].white;
}

// 🔥 Pick a random theme on load
window.addEventListener("load", () => {
  currentTheme = Math.floor(Math.random() * colors.length);
  applyTheme(currentTheme);
});

// 📌 Click to cycle
toggleBtn.addEventListener("click", () => {
  currentTheme = (currentTheme + 1) % colors.length;
  applyTheme(currentTheme);
});


window.addEventListener('load', function() {

  const themeToggle = document.getElementById("theme-toggle");

  let tl = gsap.timeline({
    delay: 1.1,
    onComplete: () => {
      // Tooltip logic happens 2s AFTER title animation ends
      gsap.delayedCall(2, () => {

        themeToggle.classList.add("show-tooltip");

        gsap.fromTo(themeToggle,
          { '--tooltip-scale': 0 },
          {
            '--tooltip-scale': 1,
            duration: 0.35,
            ease: 'back.out(1.8)',
            onComplete: () => {
              gsap.to(themeToggle, {
                '--tooltip-scale': 0,
                duration: 0.3,
                delay: 2, // stays visible for 2s
                ease: 'back.in(1.8)',
                onComplete: () => {
                  themeToggle.classList.remove("show-tooltip");
                }
              });
            }
          }
        );

      });

    }
  });

  tl.to('.MainTitle div', {
    duration: 0.5,
    y: 0,
    opacity: 1,
    stagger: 0.3,
    ease: "power3.out",
  });

});



// Explore button animation (only on index.html)
const exploreBtn = document.getElementById("explore-btn");
if (exploreBtn) {
  exploreBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const tl = gsap.timeline({
      onComplete: () => (window.location.href = "projects.html")
    });

    tl.to("body", {
      opacity: 0,
      y: -50,
      duration: 0.6,
      ease: "power2.inOut"
    });
  });
}

// Fade in body on page load
gsap.from("body", {
  opacity: 0,
  duration: 0.6,
  ease: "power2.out"
});

// Auto Year Update
const yearEl = document.getElementById("current-year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// Auto Age Update (only on pages with age element)
const ageEl = document.getElementById("age");
if (ageEl) {
  function calculateAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);

    let age = today.getFullYear() - birth.getFullYear();
    const hasHadBirthdayThisYear =
      today.getMonth() > birth.getMonth() ||
      (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate());

    if (!hasHadBirthdayThisYear) age--;
    return age;
  }

  ageEl.textContent = calculateAge("2003-12-14");
}



//project page logic

document.getElementById("btn-school").classList.add("active");
