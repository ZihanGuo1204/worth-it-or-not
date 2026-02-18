// client/app.js
// Hash router + VisionOS-style glass nav + theme toggle (clean + stable)

import { renderHome } from "./pages/home.js";
import { renderSubmit } from "./pages/submit.js";
import { renderProfile } from "./pages/profile.js";

const THEME_KEY = "won_theme"; // "light" | "dark"

function getTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "light" || saved === "dark") return saved;

  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
  return prefersDark ? "dark" : "light";
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(THEME_KEY, theme);
}

function themeIcon(theme) {
  return theme === "dark" ? "🌙" : "☀️";
}

function setActiveLink(route) {
  const pills = document.querySelectorAll(".navPill[data-route]");
  pills.forEach((a) => {
    a.classList.toggle("active", a.getAttribute("data-route") === route);
  });
}

function renderNav() {
  const currentTheme = getTheme();

  const nav = document.createElement("nav");
  nav.className = "topNav";

  nav.innerHTML = `
    <div class="navInner">
      <a class="brand" href="#/" aria-label="Go to Home">
        <span class="brandTitle">Worth It or Not</span>
      </a>

      <div class="navCenter">
        <a class="navPill" href="#/" data-route="home">Home</a>
        <a class="navPill" href="#/submit" data-route="submit">Submit</a>
        <a class="navPill" href="#/profile" data-route="profile">Profile</a>
      </div>

      <button
        id="themeBtn"
        class="iconBtn"
        type="button"
        aria-label="Toggle theme"
        title="Toggle theme"
      >${themeIcon(currentTheme)}</button>
    </div>
  `;

  const oldNav = document.querySelector("nav");
  if (oldNav) oldNav.replaceWith(nav);
  else document.body.prepend(nav);

  const themeBtn = nav.querySelector("#themeBtn");
  themeBtn.addEventListener("click", () => {
    const now = document.documentElement.getAttribute("data-theme") || "light";
    const next = now === "dark" ? "light" : "dark";
    applyTheme(next);
    themeBtn.textContent = themeIcon(next);
  });
}

async function renderRoute() {
  const app = document.getElementById("app") || document.querySelector("main");
  if (!app) return;

  const hash = window.location.hash || "#/";
  const route = hash.replace("#/", "").trim();

  if (route === "" || route === "/") {
    setActiveLink("home");
    await renderHome(app);
    return;
  }

  if (route === "submit") {
    setActiveLink("submit");
    renderSubmit(app);
    return;
  }

  if (route === "profile") {
    setActiveLink("profile");
    renderProfile(app);
    return;
  }

  setActiveLink("");
  app.innerHTML = `<h2>Not found</h2><p>Try going back to <a href="#/">Home</a>.</p>`;
}

function start() {
  applyTheme(getTheme());
  renderNav();
  renderRoute();

  window.addEventListener("hashchange", () => renderRoute());
}

start();