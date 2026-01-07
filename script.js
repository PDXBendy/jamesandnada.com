(function () {
  const links = Array.from(document.querySelectorAll(".nav__link"));
  const rail = document.querySelector(".nav__rail");
  const parallaxEls = Array.from(document.querySelectorAll("[data-parallax]"));
  const revealEls = Array.from(document.querySelectorAll(".reveal"));

  function setActiveLinkById(id) {
    links.forEach(a => a.classList.toggle("is-active", a.getAttribute("href") === `#${id}`));
    const active = links.find(a => a.classList.contains("is-active"));
    if (!active || !rail) return;

    const rect = active.getBoundingClientRect();
    const parentRect = active.parentElement.getBoundingClientRect();
    const x = rect.left - parentRect.left + (rect.width * 0.15);
    rail.style.transform = `translateX(${x}px)`;
    rail.style.width = `${Math.max(32, rect.width * 0.7)}px`;
  }

  function setupSmoothScroll() {
    links.forEach(a => {
      a.addEventListener("click", (e) => {
        const href = a.getAttribute("href");
        if (!href || !href.startsWith("#")) return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: "smooth" });
      });
    });
  }

  function setupObservers() {
    const sectionIds = ["details", "travel", "rsvp", "registry"];
    const sections = sectionIds
      .map(id => document.getElementById(id))
      .filter(Boolean);

    const sectionObserver = new IntersectionObserver((entries) => {
      // pick the most visible section
      const visible = entries
        .filter(en => en.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible && visible.target && visible.target.id) {
        setActiveLinkById(visible.target.id);
      }
    }, { root: null, threshold: [0.2, 0.35, 0.5, 0.65] });

    sections.forEach(s => sectionObserver.observe(s));

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.classList.add("is-visible");
          revealObserver.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });

    revealEls.forEach(el => revealObserver.observe(el));
  }

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function onScrollParallax() {
    const y = window.scrollY || 0;

    parallaxEls.forEach(el => {
      const speed = parseFloat(el.getAttribute("data-parallax")) || 0.08;
      const offset = -(y * speed);
      el.style.transform = `translate3d(0, ${offset}px, 0)`;
    });

    // Subtle hero type drift for luxury feel
    const heroType = document.querySelector(".hero__type");
    if (heroType) {
      const drift = clamp((y / 900) * 10, 0, 10);
      heroType.style.transform = `translate3d(0, ${-drift}px, 0)`;
    }
  }

  function onResizeInitRail() {
    // Set a default active based on scroll position
    const fallback = "details";
    const candidates = ["registry", "rsvp", "travel", "details"];
    const active = candidates.find(id => {
      const el = document.getElementById(id);
      if (!el) return false;
      const r = el.getBoundingClientRect();
      return r.top < 140 && r.bottom > 140;
    }) || fallback;

    setActiveLinkById(active);
  }

  setupSmoothScroll();
  setupObservers();
  onResizeInitRail();
  onScrollParallax();

  window.addEventListener("scroll", () => {
    window.requestAnimationFrame(onScrollParallax);
  }, { passive: true });

  window.addEventListener("resize", () => {
    window.requestAnimationFrame(onResizeInitRail);
  });
})();
