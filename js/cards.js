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

    // Phase 2 — outward expansion
    tl.add(() => {

      const state = Flip.getState(card);

      // 👉 Clone so original stays in place
      const clone = card.cloneNode(true);
      clone.classList.add("big-card");
      document.body.appendChild(clone);

      // match current card's exact screen coords
      const rect = card.getBoundingClientRect();
      gsap.set(clone, {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height
      });

      // 🕒 Wait a moment after fill
      gsap.delayedCall(0.4, () => {
        Flip.from(state, {
          targets: clone,
          scale: 1,
          duration: 1.1,
          ease: "power4.inOut",
          absolute: true,
          onStart: () => {
            // finally animate to overlay size
            gsap.to(clone, {
              width: "85vw",
              height: "85vh",
              top: "50%",
              left: "50%",
              xPercent: -50,
              yPercent: -50,
              duration: 1.1,
              ease: "power4.inOut"
            });
          }
        });
      });
    });
  });
});
