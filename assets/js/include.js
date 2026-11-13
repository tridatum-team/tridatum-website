// Shared chrome is revalidated on load; failed includes must not block editable content.
(async () => {
  const mounts = [...document.querySelectorAll("[data-include]")];
  await Promise.allSettled(
    mounts.map(async (el) => {
      const res = await fetch(el.dataset.include, { cache: "no-cache" });
      if (!res.ok) throw new Error(`Include unavailable: ${res.status}`);
      el.outerHTML = await res.text();
    }),
  );
  const page = document.body.dataset.page;
  const header = document.querySelector(".site-header");
  const active = header?.querySelector(`[data-nav="${page}"]`);
  active?.classList.add("active");
  active?.setAttribute("aria-current", "page");
  if (page && page !== "home") {
    const intro =
      document.querySelector("main > .legal-page > .legal") ||
      document.querySelector("main > :first-child");
    const labels = { privacy: "개인정보 처리방침", terms: "이용약관" };
    const label =
      active?.textContent.replace("↗", "").trim() ||
      labels[page] ||
      document.querySelector("h1")?.textContent.trim();
    if (intro && label) {
      const locationNav = document.createElement("nav");
      locationNav.className = "page-location";
      locationNav.setAttribute("aria-label", "현재 위치");
      const home = document.createElement("a");
      home.href = "index.html";
      home.textContent = "홈";
      const separator = document.createElement("span");
      separator.textContent = "/";
      separator.setAttribute("aria-hidden", "true");
      const current = document.createElement("span");
      current.textContent = label;
      current.setAttribute("aria-current", "page");
      const demos = document.createElement("a");
      demos.className = "page-location-demo";
      demos.href = "index.html#demo";
      demos.textContent = "홈 데모 체험 ↗";
      locationNav.append(home, separator, current, demos);
      intro.prepend(locationNav);
    }
  }
  const toggle = header?.querySelector(".nav-toggle");
  if (toggle) {
    const close = (returnFocus = false) => {
      header.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "메뉴 열기");
      if (returnFocus) toggle.focus();
    };
    toggle.addEventListener("click", () => {
      const opened = header.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(opened));
      toggle.setAttribute("aria-label", opened ? "메뉴 닫기" : "메뉴 열기");
    });
    header
      .querySelectorAll("a")
      .forEach((a) => a.addEventListener("click", () => close()));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && header.classList.contains("open")) close(true);
    });
    document.addEventListener("click", (e) => {
      if (!header.contains(e.target)) close();
    });
    matchMedia("(min-width: 851px)").addEventListener("change", () => close());
  }
  document.querySelector(".back-top")?.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
    document.querySelector(".logo")?.focus({ preventScroll: true });
  });
  document.documentElement.dataset.includesReady = "true";
  document.dispatchEvent(new CustomEvent("includes:done"));
})();
