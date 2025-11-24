let activeClone = null;
let activeOriginal = null;
let fullscreenLenis = null;

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

        requestAnimationFrame(() => {
          cloneExtra.classList.add("visible");
        });
      }
    }
  });
}

// 🧲 Close Fullscreen Card
function closeCard() {
  if (!activeClone || !activeOriginal) return;

  document.body.classList.remove("dimmed", "fullscreen-active");
  document.body.style.overflow = "";

  const rect = activeOriginal.getBoundingClientRect();
// Disable scrolling instantly when closing starts
activeClone.style.overflow = "hidden";

  const img = activeOriginal.querySelector('.image-wrapper img');
  const content = activeOriginal.querySelector('.project-content');

  // ⭐ Remove injected fullscreen content
  const fullscreenExtra = activeClone.querySelector(".fullscreen-extra");
  if (fullscreenExtra) fullscreenExtra.remove();

  // Hide button
  document.getElementById("close-fullscreen").style.display = "none";

  gsap.to(activeClone, {
    duration: 1.2,
    ease: "power4.inOut",
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
      
      // Reverse wipe first
      gsap.to(img, {
        duration: 0.5,
        clipPath: "polygon(0 0, 100% 0, 100% 88%, 0 95%)",
        ease: "power3.out",
        onComplete: () => {
          gsap.to(content, {
            opacity: 1,
            duration: 0.6,
            delay: 0.35,
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


// (function() {
//   let lastY = 0;

//   function findScrollable(el) {
//     while (el && el !== document.body) {
//       const style = window.getComputedStyle(el);
//       const overflowY = style.overflowY;
//       if ((overflowY === 'auto' || overflowY === 'scroll') &&
//           el.scrollHeight > el.clientHeight) {
//         return el;
//       }
//       el = el.parentNode;
//     }
//     return null;
//   }

//   // Mouse wheel scroll
//   document.addEventListener('wheel', function(e) {
//     const scrollEl = findScrollable(e.target);

//     if (scrollEl) {
//       e.preventDefault();
//       e.stopPropagation();
//       scrollEl.scrollTop += e.deltaY;
//     } else if (document.body.classList.contains("fullscreen-active")) {
//       e.preventDefault();
//     }
//   }, { passive: false });

//   // Touch scroll
//   document.addEventListener('touchstart', e => {
//     lastY = e.touches[0].clientY;
//   }, { passive: true });

//   document.addEventListener('touchmove', e => {
//     const scrollEl = findScrollable(e.target);
//     const currentY = e.touches[0].clientY;
//     const deltaY = lastY - currentY;
//     lastY = currentY;

//     if (scrollEl) {
//       e.preventDefault();
//       scrollEl.scrollTop += deltaY;
//     } else if (document.body.classList.contains("fullscreen-active")) {
//       e.preventDefault();
//     }
//   }, { passive: false });
// })();


