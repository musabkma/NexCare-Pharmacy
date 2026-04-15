import { formatMoney } from "../../data/products.js";
import { ratingStars } from "../components.js";

export function renderProduct({ appEl, PRODUCTS, id, wishlist, cartActions, wishlistActions, showToast }) {
  const p = PRODUCTS.find((x) => x.id === id);
  if (!p) {
    appEl.innerHTML = `
      <div class="panel fade">
        <h2 class="panel__title">Product not found</h2>
        <p class="panel__muted">This product may have been removed from the catalog.</p>
        <div style="margin-top:12px; display:flex; gap:10px; flex-wrap:wrap;">
          <a class="btn btn--primary" href="#/shop">Back to shop</a>
          <a class="btn" href="#/">Home</a>
        </div>
      </div>
    `;
    return;
  }

  const wishOn = wishlist.has(p.id);
  const pill = p.isPrescriptionRequired
    ? `<span class="pill pill--pom">Prescription Required</span>`
    : `<span class="pill">${p.category.toUpperCase()}</span>`;

  const related = PRODUCTS.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4);

  appEl.innerHTML = `
    <div class="panel fade">
      <div style="display:flex; gap:10px; flex-wrap:wrap; justify-content:space-between; align-items:center;">
        <div style="display:flex; gap:10px; flex-wrap:wrap; align-items:center;">
          <a class="pill" href="#/shop">← Shop</a>
          <a class="pill" href="#/category/${p.category}">Category</a>
          ${pill}
        </div>
        <a class="btn" href="#/cart">Cart</a>
      </div>

      <div class="layout" style="margin-top:12px;">
        <div class="panel">
          <div class="card__media" style="border-radius:18px; overflow:hidden;">
            <img src="${p.image}" alt="${p.name}" />
          </div>
        </div>
        <div class="panel">
          <h2 class="panel__title" style="margin-bottom:6px;">${p.name}</h2>
          <div class="panel__muted">
            <span class="pill" title="Rating">${ratingStars(p.rating)} <span style="opacity:.8">(${p.reviews} reviews)</span></span>
          </div>

          <div style="margin-top:12px; display:flex; align-items:center; justify-content:space-between; gap:12px;">
            <div class="price" style="font-size:22px;">${formatMoney(p.price)}</div>
            <div style="display:flex; gap:10px;">
              <button class="btn-icon" id="wishBtn" type="button" aria-label="Wishlist">${wishOn ? "♥" : "♡"}</button>
              <button class="btn btn--primary" id="addBtn" type="button">Add to cart</button>
            </div>
          </div>

          <div style="margin-top:14px; color: var(--muted); line-height:1.65;">
            ${p.description}
          </div>

          ${p.isPrescriptionRequired ? `
            <div style="margin-top:12px;" class="pill pill--pom">
              Prescription Required: Upload your prescription on the prescriptions page (demo).
            </div>
          ` : ""}

          <div style="margin-top:14px;">
            <div class="panel__muted" style="font-weight:850;">Why customers love it</div>
            <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:8px;">
              ${(p.tags || []).slice(0, 5).map((t) => `<span class="pill">#${t}</span>`).join("")}
              <span class="pill">Premium packaging</span>
              <span class="pill">Fast checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    ${related.length ? `
      <section class="section">
        <div class="section__head">
          <div>
            <h3 class="section__title">Related in this category</h3>
            <div class="section__sub">Popular picks with similar intent.</div>
          </div>
          <a class="btn" href="#/category/${p.category}">See more</a>
        </div>
        <div class="grid">
          ${related.map((x) => `
            <a class="card" href="#/product/${encodeURIComponent(x.id)}">
              <div class="card__media"><img src="${x.image}" alt="${x.name}" loading="lazy" /></div>
              <div class="card__body">
                <div class="card__name">${x.name}</div>
                <div class="card__meta">
                  <span class="pill">${ratingStars(x.rating)} (${x.reviews})</span>
                  <span class="price">${formatMoney(x.price)}</span>
                </div>
              </div>
            </a>
          `).join("")}
        </div>
      </section>
    ` : ""}
  `;

  const addBtn = document.getElementById("addBtn");
  const wishBtn = document.getElementById("wishBtn");

  addBtn.addEventListener("click", () => {
    cartActions.add(p.id, 1);
    showToast({ title: "Added to cart", message: `${p.name} is in your cart.` });
  });

  wishBtn.addEventListener("click", () => {
    wishlistActions.toggle(p.id);
    const on = wishlist.has(p.id);
    wishBtn.textContent = on ? "♥" : "♡";
    showToast({ title: on ? "Saved to wishlist" : "Removed from wishlist", message: p.name });
  });
}

