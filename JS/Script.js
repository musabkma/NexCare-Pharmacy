import { PRODUCTS, CATEGORIES, formatMoney, TAX_RATE } from "./data/products.js";
import { loadTheme, toggleTheme } from "./state/theme.js";
import { cart, cartActions } from "./state/cart.js";
import { session, sessionActions } from "./state/session.js";
import { wishlist, wishlistActions } from "./state/wishlist.js";
import { showToast } from "./ui/toast.js";
import { renderHome } from "./ui/pages/home.js";
import { renderShop } from "./ui/pages/shop.js";
import { renderCategory } from "./ui/pages/category.js";
import { renderProduct } from "./ui/pages/product.js";
import { renderCart } from "./ui/pages/cart.js";
import { renderCheckout } from "./ui/pages/checkout.js";
import { renderAccount } from "./ui/pages/account.js";
import { renderContact } from "./ui/pages/contact.js";
import { renderPrescriptions } from "./ui/pages/prescriptions.js";
import { renderOrders } from "./ui/pages/orders.js";
import { mountSearch } from "./ui/search.js";
import { mountHeaderMenus } from "./ui/headerMenus.js";

const appEl = document.getElementById("app");
const cartCountEl = document.getElementById("cartCount");
const themeToggleEl = document.getElementById("themeToggle");
const accountBtnEl = document.getElementById("accountBtn");
const accountLabelEl = document.getElementById("accountLabel");

const accountDialog = document.getElementById("accountDialog");
const tabLogin = document.getElementById("tabLogin");
const tabSignup = document.getElementById("tabSignup");
const paneLogin = document.getElementById("paneLogin");
const paneSignup = document.getElementById("paneSignup");
const loginSubmit = document.getElementById("loginSubmit");
const signupSubmit = document.getElementById("signupSubmit");

function setTabs(active) {
  const loginActive = active === "login";
  tabLogin.classList.toggle("is-active", loginActive);
  tabSignup.classList.toggle("is-active", !loginActive);
  tabLogin.setAttribute("aria-selected", loginActive ? "true" : "false");
  tabSignup.setAttribute("aria-selected", !loginActive ? "true" : "false");
  paneLogin.classList.toggle("is-active", loginActive);
  paneSignup.classList.toggle("is-active", !loginActive);
}

function openAccountDialog(mode = "login") {
  if (!accountDialog) return;
  setTabs(mode);
  accountDialog.showModal();
}

function updateAccountUI() {
  const user = session.getUser();
  if (user) {
    accountLabelEl.textContent = user.name?.split(" ")[0] || "Profile";
    accountBtnEl.setAttribute("aria-label", `Account: ${user.name}`);
  } else {
    accountLabelEl.textContent = "Sign in";
    accountBtnEl.setAttribute("aria-label", "Account");
  }
}

function updateCartBadge() {
  const count = cart.getItemCount();
  cartCountEl.textContent = String(count);
  cartCountEl.setAttribute("aria-label", `${count} items in cart`);
}

function scrollTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function parseRoute() {
  const raw = (location.hash || "#/").slice(1);
  const [path, queryString] = raw.split("?");
  const parts = path.split("/").filter(Boolean);
  const query = new URLSearchParams(queryString || "");
  return { parts, query, rawPath: path };
}

function renderNotFound() {
  appEl.innerHTML = `
    <div class="panel fade">
      <h2 class="panel__title">Page not found</h2>
      <p class="panel__muted">The page you’re looking for doesn’t exist.</p>
      <div style="margin-top:12px; display:flex; gap:10px; flex-wrap:wrap;">
        <a class="btn btn--primary" href="#/">Go home</a>
        <a class="btn" href="#/shop">Browse products</a>
      </div>
    </div>
  `;
}

function renderRoute() {
  const { parts, query } = parseRoute();
  const [root, a, b] = parts;

  // Route aliases
  if (!root) return renderHome({ appEl, PRODUCTS, CATEGORIES });
  if (root === "shop") return renderShop({ appEl, PRODUCTS, CATEGORIES, wishlist, cartActions, wishlistActions, showToast });
  if (root === "category" && a) return renderCategory({ appEl, PRODUCTS, CATEGORIES, slug: a, wishlist, cartActions, wishlistActions, showToast });
  if (root === "product" && a) return renderProduct({ appEl, PRODUCTS, id: a, wishlist, cartActions, wishlistActions, showToast, formatMoney });
  if (root === "cart") return renderCart({ appEl, PRODUCTS, cart, cartActions, formatMoney, TAX_RATE });
  if (root === "checkout") return renderCheckout({ appEl, PRODUCTS, cart, cartActions, session, sessionActions, formatMoney, TAX_RATE, showToast });
  if (root === "account") return renderAccount({ appEl, session, sessionActions, showToast });
  if (root === "contact") return renderContact({ appEl, showToast });
  if (root === "prescriptions") return renderPrescriptions({ appEl, showToast });
  if (root === "orders") return renderOrders({ appEl, session, formatMoney });

  // fallback
  return renderNotFound();
}

function wireAccountDialog() {
  if (!accountDialog) return;
  tabLogin.addEventListener("click", () => setTabs("login"));
  tabSignup.addEventListener("click", () => setTabs("signup"));

  accountBtnEl.addEventListener("click", () => {
    const user = session.getUser();
    if (user) {
      location.hash = "#/account";
      return;
    }
    openAccountDialog("login");
  });

  loginSubmit.addEventListener("click", () => {
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
    if (!email || password.length < 6) {
      showToast({ title: "Check your details", message: "Enter a valid email and password (6+ characters).", tone: "warn" });
      return;
    }
    sessionActions.login({ email });
    accountDialog.close();
    updateAccountUI();
    showToast({ title: "Signed in", message: "Welcome back. Your session is saved locally." });
  });

  signupSubmit.addEventListener("click", () => {
    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value.trim();
    if (!name || !email || password.length < 6) {
      showToast({ title: "Check your details", message: "Fill name + email and a password (6+ characters).", tone: "warn" });
      return;
    }
    sessionActions.signup({ name, email });
    accountDialog.close();
    updateAccountUI();
    showToast({ title: "Account created", message: "You’re ready to shop. Saved locally in this browser." });
  });
}

function init() {
  loadTheme();
  updateCartBadge();
  updateAccountUI();

  themeToggleEl.addEventListener("click", () => {
    toggleTheme();
  });

  mountHeaderMenus();
  mountSearch({
    PRODUCTS,
    onPickProduct: (id) => {
      location.hash = `#/product/${encodeURIComponent(id)}`;
    },
  });

  wireAccountDialog();

  window.addEventListener("hashchange", () => {
    renderRoute();
    scrollTop();
  });

  cart.subscribe(updateCartBadge);
  session.subscribe(updateAccountUI);

  renderRoute();
}

init();
