// Subtle parallax for background layers only.
// Uses requestAnimationFrame for smoothness and respects reduced motion.
(() => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const layers = Array.from(document.querySelectorAll(".parallax"));
  if (prefersReducedMotion || layers.length === 0) return;

  let ticking = false;

  const update = () => {
    ticking = false;
    const y = window.scrollY || 0;

    for (const el of layers) {
      const speed = Number(el.dataset.speed || 0.15);
      el.style.transform = `translate3d(0, ${y * speed * -1}px, 0)`;
    }
  };

  window.addEventListener("scroll", () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }, { passive: true });

  update();
})();

// Fade-in on scroll
(() => {
  const els = Array.from(document.querySelectorAll(".fade-in"));
  if (els.length === 0) return;

  const obs = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add("is-visible");
        obs.unobserve(e.target);
      }
    }
  }, { threshold: 0.12 });

  els.forEach(el => obs.observe(el));
})();
