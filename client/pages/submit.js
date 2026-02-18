// client/pages/submit.js
// Submit page (matches styles.css: .page/.formCard/.formGrid)

import { createPost } from "../api.js";

const LS_PROFILE_ID = "won_profile_id";
const LS_PROFILE_NAME = "won_profile_name";

export function renderSubmit(container) {
  const profileId = localStorage.getItem(LS_PROFILE_ID);
  const profileName = localStorage.getItem(LS_PROFILE_NAME);

  if (!profileId) {
    container.innerHTML = `
      <section class="page">
        <header class="pageHeader">
          <h1 class="sectionTitle">Submit</h1>
          <p class="subtle">You need a profile first.</p>
        </header>

        <div class="card formCard">
          <p>Go to <a href="#/profile">Profile</a> and save a nickname.</p>
        </div>
      </section>
    `;
    return;
  }

  container.innerHTML = `
    <section class="page">
      <header class="pageHeader">
        <h1 class="sectionTitle">Submit</h1>
        <p class="subtle">Posting as <strong>${escapeHtml(profileName)}</strong></p>
      </header>

      <div class="card formCard">
        <form id="postForm" class="formGrid">
          <div>
            <label>Item name</label>
            <input name="itemName" placeholder="e.g. Air fryer" required />
          </div>

          <div>
            <label>Category</label>
            <input name="category" placeholder="Kitchen / Tech / School..." required />
          </div>

          <div>
            <label>Expectation</label>
            <textarea name="expectation" rows="3" placeholder="What you thought would happen..." required></textarea>
          </div>

          <div>
            <label>Reality</label>
            <textarea name="reality" rows="3" placeholder="What actually happened..." required></textarea>
          </div>

          <div>
            <label>Sentiment</label>
            <select name="sentiment" required>
              <option value="worth">Worth it</option>
              <option value="meh">Meh</option>
              <option value="not_worth">Not worth it</option>
            </select>
          </div>

          <div class="btnRow">
            <button class="primary" type="submit">Submit</button>
            <button id="resetBtn" type="button">Clear</button>
          </div>

          <p id="msg" class="msg"></p>
        </form>
      </div>
    </section>
  `;

  const form = document.getElementById("postForm");
  const msg = document.getElementById("msg");
  const resetBtn = document.getElementById("resetBtn");

  resetBtn.addEventListener("click", () => {
    form.reset();
    msg.textContent = "";
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    msg.textContent = "Submitting...";

    const data = new FormData(form);
    const post = {
      itemName: data.get("itemName").trim(),
      category: data.get("category").trim(),
      expectation: data.get("expectation").trim(),
      reality: data.get("reality").trim(),
      sentiment: data.get("sentiment"),
      profileId,
    };

    try {
      await createPost(post);
      msg.textContent = "Posted ✅ Redirecting to Home...";
      form.reset();

      setTimeout(() => {
        window.location.hash = "#/";
      }, 600);
    } catch (err) {
      msg.textContent = err?.message ? `Submit failed ❌ ${err.message}` : "Submit failed ❌";
    }
  });
}

function escapeHtml(str) {
  return String(str ?? "").replace(/[&<>"']/g, (ch) => {
    const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
    return map[ch] || ch;
  });
}