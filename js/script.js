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
const magneticElements = document.querySelectorAll('.hover-this');

magneticElements.forEach(element => {
const magneticEffect = (e) => {
  const rect = element.getBoundingClientRect();
  const offsetX = e.clientX - rect.left - rect.width / 2;
  const offsetY = e.clientY - rect.top - rect.height / 2;
  const maxDistance = 100; // Maximum distance for the magnetic effect
  const distance = Math.min(
    Math.sqrt(offsetX * offsetX + offsetY * offsetY),
    maxDistance
  );
  const strength = (1 - distance / maxDistance) * 70; // Effect strength
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
  gsap.from('.heading', {
    opacity: 0,
    y: 50, // Starts from 50px below
    duration: 1.5, // Duration of the animation
    ease: 'power2.out', // Ease-out effect for smooth animation
    scrollTrigger: {
      trigger: '.heading', // Element to watch
      start: 'top 80%', // Trigger the animation when top of the element reaches 80% of the viewport height
      end: 'top 20%', // Optional, end point to reverse or loop the animation
      once: true, // Make sure the animation only happens once
    }
  });

  gsap.from('.subheading', {
    opacity: 0,
    y: 50, // Starts from 50px below
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


