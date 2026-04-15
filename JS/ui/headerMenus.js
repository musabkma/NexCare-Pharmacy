export function mountHeaderMenus() {
  const btn = document.getElementById("categoriesBtn");
  const menu = document.getElementById("categoriesMenu");
  if (!btn || !menu) return;

  function close() {
    menu.classList.remove("is-open");
    btn.setAttribute("aria-expanded", "false");
  }

  function toggle() {
    const next = !menu.classList.contains("is-open");
    if (next) {
      menu.classList.add("is-open");
      btn.setAttribute("aria-expanded", "true");
      return;
    }
    close();
  }

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    toggle();
  });

  menu.addEventListener("click", () => close());

  document.addEventListener("click", (e) => {
    const inside = e.target.closest("#categoriesMenu") || e.target.closest("#categoriesBtn");
    if (!inside) close();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
}

