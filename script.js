// Parallax: move selected layers at different speeds based on scroll position.
// Smooth and lightweight, no libraries.
(function () {
  const parallaxEls = Array.from(document.querySelectorAll(".parallax"));
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!parallaxEls.length || prefersReducedMotion) return;

  let lastY = 0;
  let ticking = false;

  function update() {
    ticking = false;
    const y = window.scrollY || 0;

    // Only update if scroll changed meaningfully
    if (Math.abs(y - lastY) < 1) return;
    lastY = y;

    for (const el of parallaxEls) {
      const speed = Number(el.dataset.speed || 0.2);
      // translateY in px. Lower speed means slower movement.
      const offset = y * speed * -1;
      el.style.transform = `translate3d(0, ${offset}px, 0)`;
    }
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  }, { passive: true });

  update();
})();

// Fade-in on scroll using IntersectionObserver
(function () {
  const els = Array.from(document.querySelectorAll(".fade-in"));
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }
  }, { threshold: 0.12 });

  for (const el of els) observer.observe(el);
})();
