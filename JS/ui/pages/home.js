import { categoryName, productCard, mountCardActions } from "../components.js";

export function renderHome({ appEl, PRODUCTS, CATEGORIES }) {
  const featured = [...PRODUCTS].slice(0, 8);

  appEl.innerHTML = `
    <section class="hero fade">
      <div>
        <div class="hero__kicker"><span class="dot" aria-hidden="true"></span> Premium online pharmacy experience</div>
        <h1 class="hero__title">Care you can trust—delivered with speed, privacy, and precision.</h1>
        <p class="hero__subtitle">
          Browse high-quality OTC medicines, supplements, devices, and personal care products. Prescription-required items are clearly labeled.
        </p>
        <div class="hero__cta">
          <a class="btn btn--primary" href="#/shop">Shop premium catalog</a>
          <a class="btn" href="#/prescriptions">Upload prescription</a>
          <a class="btn" href="#/category/otc">Explore OTC</a>
        </div>
      </div>
      <aside class="hero__aside">
        <div class="stat">
          <div class="stat__icon" aria-hidden="true">🧪</div>
          <div>
            <div class="stat__title">Curated quality</div>
            <div class="stat__sub">Modern, clean catalog with clear categories and guidance.</div>
          </div>
        </div>
        <div class="stat">
          <div class="stat__icon" aria-hidden="true">🔒</div>
          <div>
            <div class="stat__title">Private by design</div>
            <div class="stat__sub">Cart, wishlist, and session stored locally (demo).</div>
          </div>
        </div>
        <div class="stat">
          <div class="stat__icon" aria-hidden="true">⚡</div>
          <div>
            <div class="stat__title">Fast checkout</div>
            <div class="stat__sub">Review totals, tax, and place an order in seconds.</div>
          </div>
        </div>
      </aside>
    </section>

    <section class="section">
      <div class="section__head">
        <div>
          <h2 class="section__title">Shop by category</h2>
          <div class="section__sub">Focused views for cleaner browsing.</div>
        </div>
        <a class="btn" href="#/shop">View all</a>
      </div>

      <div class="grid" id="catGrid">
        ${CATEGORIES.map(
          (c) => `
            <a class="card" href="#/category/${c.slug}" style="padding:16px;">
              <div style="display:flex; align-items:center; justify-content:space-between; gap:10px;">
                <div>
                  <div class="card__name">${c.name}</div>
                  <div class="panel__muted">Browse ${categoryName(CATEGORIES, c.slug).toLowerCase()}</div>
                </div>
                <div class="pill">Explore →</div>
              </div>
            </a>
          `
        ).join("")}
      </div>
    </section>

    <section class="section">
      <div class="section__head">
        <div>
          <h2 class="section__title">Featured picks</h2>
          <div class="section__sub">Popular essentials and premium wellness.</div>
        </div>
        <a class="btn btn--primary" href="#/shop">Shop now</a>
      </div>

      <div class="grid" id="featuredGrid">
        ${featured
          .map((p) =>
            productCard({
              product: p,
              categories: CATEGORIES,
              wishlist: { has: () => false },
            })
          )
          .join("")}
      </div>
    </section>
  `;

  // On home, disable wishlist/add (pure preview).
  const featuredGrid = document.getElementById("featuredGrid");
  if (featuredGrid) {
    mountCardActions(featuredGrid, {
      onAdd: () => (location.hash = "#/shop"),
      onWish: () => (location.hash = "#/shop"),
    });
  }
}

