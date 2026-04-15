import { productCard, mountCardActions, categoryName } from "../components.js";

function sortProducts(list, sort) {
  const items = [...list];
  if (sort === "price-asc") items.sort((a, b) => a.price - b.price);
  else if (sort === "price-desc") items.sort((a, b) => b.price - a.price);
  else if (sort === "rating") items.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  else items.sort((a, b) => a.name.localeCompare(b.name));
  return items;
}

export function renderShop({ appEl, PRODUCTS, CATEGORIES, wishlist, cartActions, wishlistActions, showToast }) {
  appEl.innerHTML = `
    <div class="panel fade">
      <div class="section__head" style="margin-bottom:4px;">
        <div>
          <h2 class="section__title">Shop</h2>
          <div class="section__sub">Premium catalog with category filtering, wishlist, and ratings UI.</div>
        </div>
        <a class="btn" href="#/cart">Go to cart</a>
      </div>

      <div class="filters">
        <select class="select" id="catSelect" aria-label="Filter by category">
          <option value="all">All categories</option>
          ${CATEGORIES.map((c) => `<option value="${c.slug}">${c.name}</option>`).join("")}
        </select>
        <select class="select" id="sortSelect" aria-label="Sort products">
          <option value="featured">Featured</option>
          <option value="name">Name</option>
          <option value="rating">Top rated</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
        </select>
        <span class="pill" id="countPill"></span>
        <a class="pill" href="#/category/pom">Prescription view →</a>
        <a class="pill" href="#/account">Profile →</a>
      </div>

      <div class="grid" id="grid"></div>
    </div>
  `;

  const grid = document.getElementById("grid");
  const catSelect = document.getElementById("catSelect");
  const sortSelect = document.getElementById("sortSelect");
  const countPill = document.getElementById("countPill");

  function currentFiltered() {
    const slug = catSelect.value;
    const sort = sortSelect.value;
    const filtered = slug === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.category === slug);
    return sortProducts(filtered, sort === "featured" ? "rating" : sort);
  }

  function render() {
    const list = currentFiltered();
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

  catSelect.addEventListener("change", render);
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

  // Gentle category preselect if coming from a category page hash query
  const hash = location.hash || "";
  const match = hash.match(/category=([a-z-]+)/i);
  if (match && CATEGORIES.some((c) => c.slug === match[1])) {
    catSelect.value = match[1];
  }

  render();
}

