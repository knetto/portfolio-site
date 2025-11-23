document.querySelectorAll('.view-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.project-card');
    const img = card.querySelector('.image-wrapper img');
    const overlay = card.querySelector('.image-wrapper::after'); // We will animate this differently
    const content = card.querySelector('.project-content');

    const tl = gsap.timeline({
      defaults: { duration: 0.8, ease: "power3.inOut" }
    });

    // Fade out text content
    tl.to(content, { opacity: 0 }, 0);

    // Animate wipe upward — removing angled slope
    tl.to(img, {
      clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)"
    }, 0);

    // Remove gradient overlay
    tl.to(card, {
      "--overlayOpacity": 0 // custom CSS variable we’ll animate
    }, 0);

    // Fill card completely with your green theme color
    tl.to(card, {
      backgroundColor: "var(--navBarText)"
    }, 0.3);
  });
});
