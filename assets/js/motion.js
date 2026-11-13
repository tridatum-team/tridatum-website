// Public-page entrance, navigation and scroll choreography. Native scrolling is retained.
(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const root = document.documentElement;
  const curtain = document.querySelector(".page-transition");
  let header = document.querySelector(".site-header"),
    pending = false,
    navigating = false;
  const isHome = document.body.dataset.page === "home";
  const homeSections = isHome
    ? ["demo", "contact"].map((id) => document.getElementById(id)).filter(Boolean)
    : [];
  let homeLinks = [];
  function setHomeCurrent(id) {
    homeLinks.forEach((link) => {
      const active = link.dataset.nav === id;
      link.classList.toggle("active", active);
      if (active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }
  function updateHomeCurrent() {
    if (!isHome) return;
    const marker = Math.max(
      (header?.getBoundingClientRect().bottom || 96) + 24,
      parseFloat(getComputedStyle(root).scrollPaddingTop) || 0,
    ) + 1;
    const current = homeSections.find((section) => {
      const rect = section.getBoundingClientRect();
      return rect.top <= marker && rect.bottom > marker;
    });
    setHomeCurrent(current?.id);
  }
  function homeHashTarget() {
    if (!isHome) return null;
    if (location.hash === "#live-services") {
      const url = new URL(location.href);
      url.hash = "demo";
      history.replaceState(history.state, "", url.href);
    }
    return homeSections.find((section) => `#${section.id}` === location.hash);
  }
  function connectHeader() {
    header = document.querySelector(".site-header");
    homeLinks = isHome ? [...(header?.querySelectorAll("[data-nav]") || [])] : [];
    // Includes change the initial layout; resolve both direct-entry hashes afterwards.
    homeHashTarget()?.scrollIntoView({ behavior: "instant", block: "start" });
    update();
  }
  function documentPath(path) {
    return path.replace(/\/index(?:\.html)?\/?$/, "/").replace(/\.html$/, "").replace(/\/$/, "");
  }
  const revealed = [...document.querySelectorAll(".reveal")];
  const io =
    "IntersectionObserver" in window
      ? new IntersectionObserver(
          (entries) =>
            entries.forEach((e) => {
              if (e.isIntersecting) {
                e.target.classList.add("is-visible");
                io.unobserve(e.target);
              }
            }),
          { rootMargin: "0px 0px -24px 0px", threshold: 0.08 },
        )
      : null;
  revealed.forEach((el, i) => {
    el.style.setProperty(
      "--reveal-delay",
      `${el.matches(".editorial-row,.capability,.person") ? (i % 3) * 65 : 0}ms`,
    );
    if (io && !reduce.matches) io.observe(el);
    else el.classList.add("is-visible");
  });
  if (io && !reduce.matches) root.classList.add("motion-ready");
  function update() {
    pending = false;
    const section = [
      ...document.querySelectorAll(
        ".masthead, .chapter, .contact-banner, .contact-sheet, .legal-page, .site-footer",
      ),
    ].find((el) => {
      const r = el.getBoundingClientRect();
      return r.top <= 100 && r.bottom > 100;
    });
    const light = !section?.matches(".theme-dark, .site-footer");
    header?.classList.toggle("on-light", light);
    updateHomeCurrent();
    const hero = document.querySelector(".hero-copy");
    if (hero && !reduce.matches)
      hero.style.setProperty(
        "--hero-drift",
        `${Math.min(scrollY * 0.13, 65)}px`,
      );
  }
  function schedule() {
    if (!pending) {
      pending = true;
      requestAnimationFrame(update);
    }
  }
  addEventListener("scroll", schedule, { passive: true });
  addEventListener("resize", schedule, { passive: true });
  document.addEventListener("includes:done", connectHeader);
  if (root.dataset.includesReady === "true") connectHeader();
  addEventListener("hashchange", () => {
    const legacy = location.hash === "#live-services";
    const target = homeHashTarget();
    if (legacy) target?.scrollIntoView({ behavior: "instant", block: "start" });
    schedule();
  });
  addEventListener("popstate", schedule);
  addEventListener("pageshow", (e) => {
    navigating = false;
    root.classList.remove("is-leaving");
    if (e.persisted) root.classList.add("entry-complete");
    update();
  });
  curtain?.addEventListener("animationend", () => {
    if (!navigating) root.classList.add("entry-complete");
  });
  // Keep homepage section links on the current document, including extensionless routes.
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[href]");
    if (!isHome || !a || e.defaultPrevented || e.button !== 0 ||
        e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.hasAttribute("download") || a.target)
      return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin ||
        documentPath(url.pathname) !== documentPath(location.pathname) ||
        url.search !== location.search)
      return;
    const id = url.hash === "#live-services" ? "demo" : url.hash.slice(1);
    const target = homeSections.find((section) => section.id === id);
    if (!target) return;
    e.preventDefault();
    const next = new URL(location.href);
    next.hash = id;
    if (next.href !== location.href) history.pushState(history.state, "", next.href);
    setHomeCurrent(id);
    target.scrollIntoView({ behavior: reduce.matches ? "instant" : "smooth", block: "start" });
  });
  // Short cover transition for public HTML links; modified clicks, downloads, anchors and admin keep native behavior.
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[href]");
    if (
      !a ||
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      a.download ||
      a.target ||
      reduce.matches ||
      !curtain
    )
      return;
    const url = new URL(a.href, location.href);
    if (
      url.origin !== location.origin ||
      !url.pathname.endsWith(".html") ||
      url.pathname.includes("/admin/") ||
      documentPath(url.pathname) === documentPath(location.pathname)
    )
      return;
    e.preventDefault();
    if (navigating) return;
    navigating = true;
    root.classList.remove("entry-complete");
    root.classList.add("is-leaving");
    setTimeout(() => location.assign(url.href), 390);
  });
  document.querySelectorAll("[data-open-demo]").forEach((a) =>
    a.addEventListener("click", () => {
      try {
        sessionStorage.setItem("tridatum:demo", a.dataset.openDemo);
      } catch {}
    }),
  );
  reduce.addEventListener("change", () => {
    if (reduce.matches) {
      revealed.forEach((el) => el.classList.add("is-visible"));
      root.classList.add("entry-complete");
      document
        .querySelector(".hero-copy")
        ?.style.removeProperty("--hero-drift");
    }
    update();
  });
  document.querySelectorAll(".service-accordion").forEach((detail) => {
    detail.addEventListener("toggle", () => {
      if (detail.open)
        document.querySelectorAll(".service-accordion").forEach((other) => {
          if (other !== detail) other.open = false;
        });
    });
  });
  update();
})();
