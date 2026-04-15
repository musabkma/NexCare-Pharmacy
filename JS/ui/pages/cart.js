import { byId, clamp } from "../../lib/utils.js";

export function renderCart({ appEl, PRODUCTS, cart, cartActions, formatMoney, TAX_RATE }) {
  const productsById = byId(PRODUCTS);
  const items = cart.getItems();
  const ids = Object.keys(items);

  const subtotal = cart.getSubtotal(productsById);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  appEl.innerHTML = `
    <div class="panel fade">
      <div class="section__head" style="margin-bottom:8px;">
        <div>
          <h2 class="section__title">Your cart</h2>
          <div class="section__sub">Quantities update instantly and persist locally.</div>
        </div>
        <div style="display:flex; gap:10px; flex-wrap:wrap;">
          <a class="btn" href="#/shop">Continue shopping</a>
          <a class="btn btn--primary" href="#/checkout">Checkout</a>
        </div>
      </div>

      <div class="layout">
        <div class="panel" id="itemsPanel">
          ${ids.length ? `
            ${ids
              .map((id) => {
                const p = productsById.get(id);
                if (!p) return "";
                const qty = items[id];
                return `
                  <div class="row" data-row="${id}">
                    <div style="display:flex; gap:12px; align-items:center; min-width:0;">
                      <div class="search__thumb" aria-hidden="true" style="width:48px; height:48px; border-radius:18px; overflow:hidden;">
                        <img src="${p.image}" alt="" />
                      </div>
                      <div style="min-width:0;">
                        <div style="font-weight:900; letter-spacing:-.01em; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${p.name}</div>
                        <div class="panel__muted" style="margin-top:4px;">${formatMoney(p.price)} each</div>
                      </div>
                    </div>
                    <div style="display:flex; gap:12px; align-items:center; justify-content:flex-end;">
                      <div class="qty">
                        <button type="button" data-dec="${id}" aria-label="Decrease quantity">−</button>
                        <input type="number" min="1" max="99" inputmode="numeric" data-qty="${id}" value="${qty}" aria-label="Quantity" />
                        <button type="button" data-inc="${id}" aria-label="Increase quantity">+</button>
                      </div>
                      <div style="width:110px; text-align:right; font-weight:950;">${formatMoney(p.price * qty)}</div>
                      <button class="btn btn--danger" type="button" data-remove="${id}">Remove</button>
                    </div>
                  </div>
                `;
              })
              .join("")}
          ` : `
            <div class="panel__muted">Your cart is empty.</div>
            <div style="margin-top:12px; display:flex; gap:10px; flex-wrap:wrap;">
              <a class="btn btn--primary" href="#/shop">Browse products</a>
              <a class="btn" href="#/">Home</a>
            </div>
          `}
        </div>

        <aside class="panel">
          <h3 class="panel__title">Order summary</h3>
          <div class="row">
            <span class="panel__muted">Subtotal</span>
            <strong>${formatMoney(subtotal)}</strong>
          </div>
          <div class="row">
            <span class="panel__muted">Tax (${Math.round(TAX_RATE * 100)}%)</span>
            <strong>${formatMoney(tax)}</strong>
          </div>
          <div class="row">
            <span class="panel__muted">Total</span>
            <strong style="font-size:18px;">${formatMoney(total)}</strong>
          </div>

          <div style="margin-top:12px; display:flex; gap:10px; flex-wrap:wrap;">
            <a class="btn btn--primary btn--full" href="#/checkout" ${ids.length ? "" : 'aria-disabled="true" style="opacity:.6; pointer-events:none;"'}>Place order</a>
            <button class="btn btn--full" id="clearCart" type="button" ${ids.length ? "" : 'disabled style="opacity:.6;"'}>Clear cart</button>
          </div>

          <div class="panel__muted" style="margin-top:10px;">
            Demo checkout only. Totals are calculated client-side.
          </div>
        </aside>
      </div>
    </div>
  `;

  const itemsPanel = document.getElementById("itemsPanel");
  const clearCart = document.getElementById("clearCart");
  if (clearCart) {
    clearCart.addEventListener("click", () => {
      cart.clear();
      renderCart({ appEl, PRODUCTS, cart, cartActions, formatMoney, TAX_RATE });
    });
  }

  if (!itemsPanel) return;

  function rerender() {
    renderCart({ appEl, PRODUCTS, cart, cartActions, formatMoney, TAX_RATE });
  }

  itemsPanel.addEventListener("click", (e) => {
    const inc = e.target.closest("[data-inc]");
    if (inc) {
      const id = inc.getAttribute("data-inc");
      cartActions.add(id, 1);
      rerender();
      return;
    }
    const dec = e.target.closest("[data-dec]");
    if (dec) {
      const id = dec.getAttribute("data-dec");
      cartActions.add(id, -1);
      rerender();
      return;
    }
    const rem = e.target.closest("[data-remove]");
    if (rem) {
      cartActions.remove(rem.getAttribute("data-remove"));
      rerender();
    }
  });

  itemsPanel.addEventListener("change", (e) => {
    const qtyEl = e.target.closest("[data-qty]");
    if (!qtyEl) return;
    const id = qtyEl.getAttribute("data-qty");
    const qty = clamp(Number(qtyEl.value || 1), 1, 99);
    cartActions.setQty(id, qty);
    rerender();
  });
}

