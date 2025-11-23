let activeClone = null;
let activeOriginal = null;

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
      document.body.classList.add("dimmed", "fullscreen-active");
      document.body.style.overflow = "hidden";

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


