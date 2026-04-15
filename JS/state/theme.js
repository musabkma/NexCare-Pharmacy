import { readJSON, writeJSON } from "../lib/storage.js";

const KEY = "nexcare.theme.v1";

export function loadTheme() {
  const saved = readJSON(KEY, { theme: null });
  const theme = saved.theme;
  if (theme === "dark" || theme === "light") {
    document.documentElement.setAttribute("data-theme", theme);
    return;
  }
  // Respect OS preference when no saved choice
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.setAttribute("data-theme", prefersDark ? "dark" : "light");
}

export function toggleTheme() {
  const cur = document.documentElement.getAttribute("data-theme") || "light";
  const next = cur === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  writeJSON(KEY, { theme: next });
}

