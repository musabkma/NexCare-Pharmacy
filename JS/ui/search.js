import { categoryName } from "./components.js";
import { formatMoney } from "../data/products.js";

export function mountSearch({ PRODUCTS, onPickProduct }) {
  const wrap = document.querySelector(".search");
  const input = document.getElementById("searchInput");
  const clear = document.getElementById("searchClear");
  const results = document.getElementById("searchResults");
  if (!wrap || !input || !clear || !results) return;

  let open = false;

  function close() {
    open = false;
    results.classList.remove("is-open");
    results.innerHTML = "";
  }

  function renderList(items) {
    if (!items.length) {
      results.innerHTML = `<div class="pill" style="display:inline-flex; margin:6px;">No results</div>`;
      results.classList.add("is-open");
      open = true;
      return;
    }

    const html = items
      .slice(0, 7)
      .map((p) => {
        const cat = categoryName(
          [
            { slug: "pom", name: "Prescription Drugs (POM)" },
            { slug: "otc", name: "OTC" },
            { slug: "supplements", name: "Supplements" },
            { slug: "devices", name: "Devices" },
            { slug: "personal-care", name: "Personal Care" },
          ],
          p.category
        );
        const pill = p.isPrescriptionRequired ? `<span class="pill pill--pom">Prescription Required</span>` : `<span class="pill">${cat}</span>`;
        return `
          <div class="search__item" role="button" tabindex="0" data-pick="${p.id}">
            <div class="search__thumb" aria-hidden="true">✚</div>
            <div class="search__meta">
              <div class="search__name">${p.name}</div>
              <div class="search__sub">${pill} <span class="pill">${formatMoney(p.price)}</span></div>
            </div>
          </div>
        `;
      })
      .join("");

    results.innerHTML = html;
    results.classList.add("is-open");
    open = true;
  }

  function update() {
    const q = input.value.trim().toLowerCase();
    wrap.classList.toggle("has-value", q.length > 0);
    if (!q) {
      close();
      return;
    }
    const items = PRODUCTS.filter((p) => p.name.toLowerCase().includes(q));
    renderList(items);
  }

  input.addEventListener("input", update);

  clear.addEventListener("click", () => {
    input.value = "";
    input.focus();
    update();
  });

  results.addEventListener("click", (e) => {
    const el = e.target.closest("[data-pick]");
    if (!el) return;
    const id = el.getAttribute("data-pick");
    close();
    onPickProduct(id);
  });

  results.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    const el = e.target.closest("[data-pick]");
    if (!el) return;
    const id = el.getAttribute("data-pick");
    close();
    onPickProduct(id);
  });

  document.addEventListener("click", (e) => {
    if (!open) return;
    const inside = e.target.closest("#searchResults") || e.target.closest("#searchInput") || e.target.closest("#searchClear");
    if (!inside) close();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
}

