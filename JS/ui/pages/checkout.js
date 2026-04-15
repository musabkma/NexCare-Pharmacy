import { byId } from "../../lib/utils.js";

function uid() {
  return `NC-${Math.random().toString(16).slice(2, 6).toUpperCase()}-${Date.now().toString().slice(-6)}`;
}

export function renderCheckout({ appEl, PRODUCTS, cart, cartActions, session, sessionActions, formatMoney, TAX_RATE, showToast }) {
  const productsById = byId(PRODUCTS);
  const items = cart.getItems();
  const ids = Object.keys(items);

  const subtotal = cart.getSubtotal(productsById);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  const user = session.getUser();

  appEl.innerHTML = `
    <div class="panel fade">
      <div class="section__head" style="margin-bottom:8px;">
        <div>
          <h2 class="section__title">Checkout</h2>
          <div class="section__sub">Secure, simple, and fast (demo simulation).</div>
        </div>
        <a class="btn" href="#/cart">Back to cart</a>
      </div>

      ${ids.length ? `
        <div class="layout">
          <div class="panel">
            <h3 class="panel__title">Customer info</h3>
            <div class="field">
              <label for="name">Full name</label>
              <input id="name" type="text" placeholder="Your full name" value="${user?.name ? String(user.name).replace(/"/g, "&quot;") : ""}" required />
            </div>
            <div class="field">
              <label for="phone">Phone</label>
              <input id="phone" type="tel" placeholder="+1 555 123 4567" required />
            </div>
            <div class="field">
              <label for="address">Delivery address</label>
              <textarea id="address" placeholder="Street, city, state, ZIP" required></textarea>
            </div>
            <div class="field">
              <label for="notes">Notes (optional)</label>
              <textarea id="notes" placeholder="Delivery instructions, allergies, etc."></textarea>
            </div>
            <button class="btn btn--primary btn--full" id="placeOrder" type="button">Cashout / Place order</button>
            <div class="hint">Payment is not processed. This is a frontend demo.</div>
          </div>

          <aside class="panel">
            <h3 class="panel__title">Order summary</h3>
            <div style="display:flex; flex-direction:column; gap:10px; margin-top:10px;">
              ${ids
                .map((id) => {
                  const p = productsById.get(id);
                  if (!p) return "";
                  const qty = items[id];
                  return `
                    <div class="row" style="padding:8px 0;">
                      <div style="min-width:0;">
                        <div style="font-weight:900; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${p.name}</div>
                        <div class="panel__muted">${qty} × ${formatMoney(p.price)}</div>
                      </div>
                      <div style="font-weight:950;">${formatMoney(p.price * qty)}</div>
                    </div>
                  `;
                })
                .join("")}
            </div>

            <div style="margin-top:10px;">
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
            </div>
          </aside>
        </div>
      ` : `
        <div class="panel__muted">Your cart is empty.</div>
        <div style="margin-top:12px; display:flex; gap:10px; flex-wrap:wrap;">
          <a class="btn btn--primary" href="#/shop">Browse products</a>
          <a class="btn" href="#/cart">Cart</a>
        </div>
      `}
    </div>
  `;

  const placeBtn = document.getElementById("placeOrder");
  if (!placeBtn) return;

  placeBtn.addEventListener("click", () => {
    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const address = document.getElementById("address").value.trim();
    const notes = document.getElementById("notes").value.trim();

    if (!name || !phone || !address) {
      showToast({ title: "Missing information", message: "Please fill name, phone, and address.", tone: "warn" });
      return;
    }

    const orderId = uid();
    const order = {
      id: orderId,
      createdAt: new Date().toISOString(),
      customer: { name, phone, address, notes },
      items: ids.map((id) => ({ id, qty: items[id] })),
      totals: { subtotal, tax, total, taxRate: TAX_RATE },
      status: "Confirmed",
    };

    sessionActions.addOrder(order);
    sessionActions.updateUser({ name });
    cart.clear();
    showToast({ title: "Order confirmed", message: `Order ${orderId} has been placed (demo).` });
    location.hash = "#/orders";
  });
}

