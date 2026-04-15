import { productCard, mountCardActions, categoryName } from "../components.js";

function sortProducts(list, sort) {
  const items = [...list];
  if (sort === "price-asc") items.sort((a, b) => a.price - b.price);
  else if (sort === "price-desc") items.sort((a, b) => b.price - a.price);
  else if (sort === "rating") items.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  else items.sort((a, b) => a.name.localeCompare(b.name));
  return items;
}

export function renderCategory({ appEl, PRODUCTS, CATEGORIES, slug, wishlist, cartActions, wishlistActions, showToast }) {
  const catTitle = categoryName(CATEGORIES, slug);
  const listBase = PRODUCTS.filter((p) => p.category === slug);

  const pomNote =
    slug === "pom"
      ? `<span class="pill pill--pom">Prescription Required</span><span class="panel__muted" style="margin-left:8px;">Demo label. No verification is performed.</span>`
      : "";

  appEl.innerHTML = `
    <div class="panel fade">
      <div class="section__head" style="margin-bottom:6px;">
        <div>
          <h2 class="section__title">${catTitle}</h2>
          <div class="section__sub">A clean, focused view for faster shopping. ${pomNote}</div>
        </div>
        <div style="display:flex; gap:10px; flex-wrap:wrap;">
          <a class="btn" href="#/shop">All products</a>
          <a class="btn btn--primary" href="#/cart">Cart</a>
        </div>
      </div>

      <div class="filters">
        <select class="select" id="sortSelect" aria-label="Sort products">
          <option value="rating">Top rated</option>
          <option value="name">Name</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
        </select>
        <span class="pill" id="countPill"></span>
      </div>

      <div class="grid" id="grid"></div>
    </div>
  `;

  const grid = document.getElementById("grid");
  const sortSelect = document.getElementById("sortSelect");
  const countPill = document.getElementById("countPill");

  function render() {
    const sort = sortSelect.value;
    const list = sortProducts(listBase, sort);
    countPill.textContent = `${list.length} products`;
    grid.innerHTML = list
      .map((p) =>
        productCard({
          product: p,
          categories: CATEGORIES,
          wishlist,
        })
      )
      .join("");
  }

  sortSelect.addEventListener("change", render);

  mountCardActions(grid, {
    onAdd: (id) => {
      cartActions.add(id, 1);
      const p = PRODUCTS.find((x) => x.id === id);
      showToast({ title: "Added to cart", message: p ? `${p.name} is in your cart.` : "Item added." });
    },
    onWish: (id, btn) => {
      wishlistActions.toggle(id);
      const on = wishlist.has(id);
      if (btn) btn.innerHTML = on ? "♥" : "♡";
      const p = PRODUCTS.find((x) => x.id === id);
      showToast({
        title: on ? "Saved to wishlist" : "Removed from wishlist",
        message: p ? `${p.name}` : "Updated.",
      });
    },
  });

  render();
}

