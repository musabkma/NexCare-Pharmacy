export function renderOrders({ appEl, session, formatMoney }) {
  const orders = session.getOrders();

  appEl.innerHTML = `
    <div class="panel fade">
      <div class="section__head" style="margin-bottom:8px;">
        <div>
          <h2 class="section__title">Orders</h2>
          <div class="section__sub">Order history stored locally (demo).</div>
        </div>
        <div style="display:flex; gap:10px; flex-wrap:wrap;">
          <a class="btn" href="#/shop">Shop</a>
          <a class="btn btn--primary" href="#/account">Profile</a>
        </div>
      </div>

      ${orders.length ? `
        <div style="display:flex; flex-direction:column; gap:12px;">
          ${orders.map((o) => {
            const dt = new Date(o.createdAt);
            const when = isNaN(dt.getTime()) ? o.createdAt : dt.toLocaleString();
            return `
              <div class="panel">
                <div style="display:flex; justify-content:space-between; gap:12px; flex-wrap:wrap;">
                  <div>
                    <div style="font-weight:950; letter-spacing:-.01em;">Order ${o.id}</div>
                    <div class="panel__muted" style="margin-top:4px;">${when} • Status: <span class="pill">${o.status}</span></div>
                  </div>
                  <div style="text-align:right;">
                    <div class="panel__muted">Total</div>
                    <div style="font-weight:980; font-size:18px;">${formatMoney(o.totals?.total || 0)}</div>
                  </div>
                </div>
                <div class="panel__muted" style="margin-top:10px; line-height:1.6;">
                  <strong>Deliver to:</strong> ${o.customer?.name || "Customer"} • ${o.customer?.phone || ""}<br/>
                  ${o.customer?.address || ""}
                </div>
              </div>
            `;
          }).join("")}
        </div>
      ` : `
        <div class="panel__muted">No orders yet.</div>
        <div style="margin-top:12px; display:flex; gap:10px; flex-wrap:wrap;">
          <a class="btn btn--primary" href="#/shop">Start shopping</a>
          <a class="btn" href="#/cart">Cart</a>
        </div>
      `}
    </div>
  `;
}

