document.querySelectorAll('.view-btn').forEach(btn => {
  btn.addEventListener('click', () => {

    const card = btn.closest('.project-card');
    const img = card.querySelector('.image-wrapper img');
    const content = card.querySelector('.project-content');

    // Phase 1 wipe + fill (same as you have now)
    const tl = gsap.timeline({
      defaults: { duration: 0.6, ease: "power3.inOut" }
    });
    card.querySelector('.image-wrapper').classList.add('remove-gradient');
    tl.to(content, { opacity: 0 }, 0);
    tl.to(img, {
      clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)"
    }, 0);
    tl.to(card, { backgroundColor: "var(--navBarText)" }, 0.15);

// Perfect 4-direction expansion directly into centered position
tl.add(() => {

  const rect = card.getBoundingClientRect();
  const clone = card.cloneNode(true);
  clone.classList.add("big-card");
  document.body.appendChild(clone);

  const start = {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
  };

  const endW = window.innerWidth * 0.95;
  const endH = window.innerHeight * 0.95;

  const endTop = (window.innerHeight - endH) / 2;
  const endLeft = (window.innerWidth - endW) / 2;

  gsap.set(clone, {
    position: "fixed",
    ...start,
    xPercent: 0,
    yPercent: 0,
    transform: "none",
  });

  // Pause after fill
  gsap.delayedCall(0.25, () => {
    gsap.to(clone, {
      duration: 1.2,
      ease: "power4.inOut",
      width: endW,
      height: endH,
      top: endTop,
      left: endLeft,
    });
  });

});

  });
});
