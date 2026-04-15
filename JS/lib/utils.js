export function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

export function byId(list) {
  const m = new Map();
  for (const item of list) m.set(item.id, item);
  return m;
}

export function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

