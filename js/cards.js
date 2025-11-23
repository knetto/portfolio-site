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
    tl.to(card, { backgroundColor: "var(--navBarText)" }, 0.15);

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

  const endW = window.innerWidth * 1;
  const endH = window.innerHeight * 1;

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
    zIndex: 999,
  });

  // Add close button
  const closeBtn = document.createElement("div");
  closeBtn.className = "close-project";
  closeBtn.innerHTML = "×";
  clone.appendChild(closeBtn);

  // Expand outward then trigger background blur
  gsap.to(clone, {
    duration: 1.2,
    ease: "power4.inOut",
    width: endW,
    height: endH,
    top: finalTop,
    left: finalLeft,
    borderRadius: "0px", // 🔥 Smoothly removes rounded corners
    onComplete: () => {
      document.body.classList.add("dimmed");
      document.body.style.overflow = "hidden";
    }
  });
}

// 🧲 CLOSE CARD — returns everything to original place & contents
function closeCard() {
  if (!activeClone || !activeOriginal) return;

  document.body.classList.remove("dimmed");
  document.body.style.overflow = "";

  const rect = activeOriginal.getBoundingClientRect();
  const img = activeOriginal.querySelector('.image-wrapper img');
  const content = activeOriginal.querySelector('.project-content');

  gsap.to(activeClone, {
    duration: 1.2,
    ease: "power4.inOut",
    width: rect.width,
    height: rect.height,
    top: rect.top,
    left: rect.left,
    borderRadius: window.getComputedStyle(activeOriginal).borderRadius, // restore
    onComplete: () => {

      // Reverse wipe first
gsap.to(img, {
  duration: 0.5,
  clipPath: "polygon(0 0, 100% 0, 100% 88%, 0 95%)",
  ease: "power3.out",
  onComplete: () => {
    // Longer fade + longer delay after wipe

    
    gsap.to(content, {
      opacity: 1,
      duration: 0.6,   // ← smoother fade-in
      delay: 0.35,     // ← waits longer before starting
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


// 🧲 Close behavior triggers
document.addEventListener("click", e => {
  if (!activeClone) return;
  if (e.target.classList.contains("close-project")) closeCard();
  if (!activeClone.contains(e.target)) closeCard();
});

document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeCard();
});
