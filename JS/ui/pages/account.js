export function renderAccount({ appEl, session, sessionActions, showToast }) {
  const user = session.getUser();

  if (!user) {
    appEl.innerHTML = `
      <div class="panel fade">
        <h2 class="panel__title">Account</h2>
        <p class="panel__muted">You’re not signed in. Use the Account button in the header to login or sign up.</p>
        <div style="margin-top:12px; display:flex; gap:10px; flex-wrap:wrap;">
          <a class="btn btn--primary" href="#/shop">Shop</a>
          <a class="btn" href="#/">Home</a>
        </div>
      </div>
    `;
    return;
  }

  appEl.innerHTML = `
    <div class="panel fade">
      <div class="section__head" style="margin-bottom:8px;">
        <div>
          <h2 class="section__title">Profile</h2>
          <div class="section__sub">Stored locally for this demo (localStorage session).</div>
        </div>
        <a class="btn" href="#/orders">View orders</a>
      </div>

      <div class="layout">
        <div class="panel">
          <h3 class="panel__title">Your details</h3>
          <div class="field">
            <label for="profileName">Full name</label>
            <input id="profileName" type="text" value="${String(user.name || "").replace(/"/g, "&quot;")}" />
          </div>
          <div class="field">
            <label for="profileEmail">Email</label>
            <input id="profileEmail" type="email" value="${String(user.email || "").replace(/"/g, "&quot;")}" />
          </div>
          <button class="btn btn--primary btn--full" id="saveProfile" type="button">Save</button>
          <button class="btn btn--full" id="logout" type="button" style="margin-top:10px;">Logout</button>
        </div>

        <aside class="panel">
          <h3 class="panel__title">Quick links</h3>
          <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:10px;">
            <a class="pill" href="#/cart">Cart</a>
            <a class="pill" href="#/checkout">Checkout</a>
            <a class="pill" href="#/shop">Shop</a>
            <a class="pill" href="#/prescriptions">Prescription upload</a>
          </div>
          <div class="panel__muted" style="margin-top:12px;">
            Tip: Your wishlist and cart also persist locally.
          </div>
        </aside>
      </div>
    </div>
  `;

  document.getElementById("saveProfile").addEventListener("click", () => {
    const name = document.getElementById("profileName").value.trim();
    const email = document.getElementById("profileEmail").value.trim();
    if (!name || !email) {
      showToast({ title: "Missing fields", message: "Please provide name and email.", tone: "warn" });
      return;
    }
    sessionActions.updateUser({ name, email });
    showToast({ title: "Saved", message: "Profile updated locally." });
  });

  document.getElementById("logout").addEventListener("click", () => {
    sessionActions.logout();
    showToast({ title: "Signed out", message: "Session cleared." });
    location.hash = "#/";
  });
}

