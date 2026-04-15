import { formatMoney } from "../data/products.js";

export function categoryName(categories, slug) {
  return categories.find((c) => c.slug === slug)?.name || slug;
}

export function ratingStars(rating) {
  const r = Math.max(0, Math.min(5, Number(rating || 0)));
  const full = Math.floor(r);
  const half = r - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return "★".repeat(full) + (half ? "⯨" : "") + "☆".repeat(empty);
}

export function productCard({ product, categories, wishlist, onAddToCart, onToggleWish }) {
  const cat = categoryName(categories, product.category);
  const pomPill = product.isPrescriptionRequired
    ? `<span class="pill pill--pom">Prescription Required</span>`
    : `<span class="pill">${cat}</span>`;

  const wishOn = wishlist?.has(product.id);

  return `
    <article class="card" data-product-card="${product.id}">
      <a class="card__media" href="#/product/${encodeURIComponent(product.id)}" aria-label="View ${product.name}">
        <span class="badge-corner">${pomPill}</span>
        <img src="${product.image}" alt="${product.name}" loading="lazy" />
      </a>
      <div class="card__body">
        <div class="card__name">${product.name}</div>
        <div class="card__meta">
          <div class="pill" title="Rating">${ratingStars(product.rating)} <span style="opacity:.8">(${product.reviews})</span></div>
          <div class="price">${formatMoney(product.price)}</div>
        </div>
        <div class="card__actions">
          <button class="btn btn--primary" type="button" data-add="${product.id}">Add to cart</button>
          <button class="btn-icon" type="button" data-wish="${product.id}" aria-label="Wishlist">
            ${wishOn ? "♥" : "♡"}
          </button>
        </div>
      </div>
    </article>
  `;
}

export function mountCardActions(root, { onAdd, onWish }) {
  root.addEventListener("click", (e) => {
    const addBtn = e.target.closest("[data-add]");
    if (addBtn) {
      onAdd(addBtn.getAttribute("data-add"));
      return;
    }
    const wishBtn = e.target.closest("[data-wish]");
    if (wishBtn) {
      onWish(wishBtn.getAttribute("data-wish"), wishBtn);
    }
  });
}

