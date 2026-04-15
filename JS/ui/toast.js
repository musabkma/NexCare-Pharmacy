const host = document.getElementById("toastHost");

export function showToast({ title, message, tone = "ok" }) {
  if (!host) return;

  const icon = tone === "warn" ? "⚠" : tone === "danger" ? "⛔" : "✓";
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `
    <div class="toast__icon" aria-hidden="true">${icon}</div>
    <div>
      <div class="toast__title">${title}</div>
      <div class="toast__msg">${message}</div>
    </div>
  `;

  host.appendChild(toast);
  const ttl = 3200;
  window.setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(6px)";
    toast.style.transition = "opacity .18s ease, transform .18s ease";
    window.setTimeout(() => toast.remove(), 220);
  }, ttl);
}

