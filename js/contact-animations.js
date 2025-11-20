// Contact Section GSAP Animations - Adjusted Trigger Timing
document.addEventListener("DOMContentLoaded", () => {

    gsap.registerPlugin(ScrollTrigger);
  
    gsap.from("#contact-section h2", {
      scrollTrigger: {
        trigger: "#contact-section",
        start: "top 40%",
      },
      y: 60,
      opacity: 0,
      duration: 1,
      ease: "power3.out"
    });
  
    gsap.from(".contact-subtext", {
      scrollTrigger: {
        trigger: "#contact-section",
        start: "top 35%", // Viewer gets closer
      },
      y: 50,
      opacity: 0,
      duration: 1,
      delay: 0.1,
      ease: "power3.out"
    });
  
  // Make sure button starts visible
gsap.set(".contact-btn", { opacity: 1 });

gsap.from(".contact-btn", {
    scrollTrigger: {
      trigger: "#contact-section",
      start: "top 32%",
    },
    scale: 0.9,
    opacity: 0,
    duration: 0.5,
    ease: "back.out(1.4)"
  });
  

  
    window.addEventListener("load", () => ScrollTrigger.refresh());
  });
  


  const contactForm = document.getElementById("contactForm");
const successMessage = document.getElementById("successMessage");
const loadingMessage = document.getElementById("loadingMessage");

contactForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const formData = new FormData(contactForm);

  // Animate form out
  contactForm.style.transform = "translateX(150%)";
  contactForm.style.opacity = "0";

  // Show loading state
  loadingMessage.classList.add("show");

  const response = await fetch(contactForm.action, {
    method: "POST",
    body: formData,
    headers: { Accept: "application/json" }
  });

  // Hide loading state
  loadingMessage.classList.remove("show");

  if (response.ok) {
    contactForm.reset();

    // Show success message
    successMessage.classList.add("show");

    setTimeout(() => {
      successMessage.classList.remove("show");

      // Bring the form back from the left
      contactForm.style.transform = "translateX(-150%)";
      contactForm.style.opacity = "0";

      setTimeout(() => {
        contactForm.style.transform = "translateX(0)";
        contactForm.style.opacity = "1";
      }, 400);

    }, 2500); // success message visible 2.5 seconds
    
  } else {
    alert("Oops! Something went wrong. Please try again later.");
  }
});

  
  
  