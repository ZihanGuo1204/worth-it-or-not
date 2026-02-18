// client/pages/home.js
// FINAL version — VisionOS style cards + filters

import { fetchPosts, deletePost, updatePost } from "../api.js";
import { escapeHtml } from "../utils.js";

const LS_PROFILE_ID = "won_profile_id";

export async function renderHome(container) {
  const profileId = localStorage.getItem(LS_PROFILE_ID);

  container.innerHTML = `
    <div class="home">

      <div class="homeHeader">
        <h1 class="sectionTitle">Home</h1>
        <p class="hint">
          Tip: Edit/Delete buttons only show for your own posts.
        </p>
      </div>

      <div class="controls">

        <label class="checkboxRow">
          <input id="mineOnly" type="checkbox">
          <span>My posts only</span>
        </label>

        <div class="filterRow">

          <label>Filter by category:</label>

          <input id="categoryInput" placeholder="e.g. Kitchen">

          <div class="btnRow">

            <button id="filterBtn">Filter</button>

            <button id="clearBtn">Clear</button>

            <button id="refreshBtn">Refresh</button>

          </div>

        </div>

      </div>

      <div id="posts" class="posts">

        Loading...

      </div>

    </div>
  `;

  const postsEl = document.getElementById("posts");
  const mineOnlyEl = document.getElementById("mineOnly");
  const categoryInputEl = document.getElementById("categoryInput");

  async function loadPosts() {
    const category = categoryInputEl.value.trim();
    const mineOnly = mineOnlyEl.checked;

    const posts = await fetchPosts({
      category: category || undefined,
      profileId: mineOnly ? profileId : undefined,
    });

    if (!posts.length) {
      postsEl.innerHTML = `<p class="empty">No posts yet.</p>`;
      return;
    }

    postsEl.innerHTML = posts
      .map((p) => {
        const canEdit = profileId === p.profileId;

        const preview = p.expectation || "";
        const safeTitle = escapeHtml(p.itemName);
        const safeCategory = escapeHtml(p.category);
        const safeSentiment = escapeHtml(p.sentiment);
        const safeBy = escapeHtml(p.author?.nickname || "unknown");

        return `
    <article class="post"
      data-id="${p._id}"
      data-itemname="${safeTitle}"
      data-category="${safeCategory}"
      data-sentiment="${safeSentiment}"
      data-by="${safeBy}"
      data-expectation="${escapeHtml(p.expectation || "")}"
      data-reality="${escapeHtml(p.reality || "")}"
      data-imageurl="${escapeHtml(p.imageUrl || "")}"
    >

      ${
        p.imageUrl
          ? `
        <img class="postImage" src="${p.imageUrl}" alt="${safeTitle}" loading="lazy" />
      `
          : ""
      }

      <div class="postBody">
        <h3 class="postTitle">${safeTitle}</h3>

        <div class="postMeta">
          <span class="pill">Category: ${safeCategory}</span>
          <span class="pill">Sentiment: ${safeSentiment}</span>
        </div>

        <p class="postPreview">${escapeHtml(preview)}</p>

        <div class="actions" style="margin-top:auto; display:flex; gap:10px; justify-content:flex-end;">
          ${canEdit ? `<button class="editBtn" data-id="${p._id}">Edit</button>` : ""}
          ${canEdit ? `<button class="deleteBtn" data-id="${p._id}">Delete</button>` : ""}
        </div>
      </div>
    </article>
  `;
      })
      .join("");
  }

  // ===== Post detail modal (create once) =====
  let modal = document.getElementById("postModal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "postModal";
    modal.className = "postModal";
    modal.innerHTML = `
    <div class="postModalCard" role="dialog" aria-modal="true" aria-label="Post detail">
      <button class="postModalClose" type="button" aria-label="Close">✕</button>
      <div class="postModalImgWrap">
        <img class="postModalImg" alt="post image" style="display:none;" />
      </div>
      <div class="postModalBody">
        <div class="postModalTitleRow">
          <div>
            <h2 class="postModalTitle"></h2>
            <span class="postModalBy"></span>
          </div>
        </div>

        <div class="postModalMeta">
          <span class="pill" data-role="category"></span>
          <span class="pill" data-role="sentiment"></span>
        </div>

        <div class="postModalSection">
          <div class="label">Expectation</div>
          <div class="text" data-role="expectation"></div>
        </div>

        <div class="postModalSection">
          <div class="label">Reality</div>
          <div class="text" data-role="reality"></div>
        </div>
      </div>
    </div>
  `;
    document.body.appendChild(modal);
  }

  function closePostModal() {
    modal.classList.remove("open");
  }

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closePostModal();
  });

  modal.querySelector(".postModalClose").addEventListener("click", closePostModal);

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closePostModal();
  });

  function openModalFromCard(card) {
    const title = card.dataset.itemname || "";
    const by = card.dataset.by || "";
    const category = card.dataset.category || "";
    const sentiment = card.dataset.sentiment || "";
    const expectation = card.dataset.expectation || "";
    const reality = card.dataset.reality || "";
    const imageUrl = card.dataset.imageurl || "";

    modal.querySelector(".postModalTitle").textContent = title;
    modal.querySelector(".postModalBy").textContent = by ? `(by ${by})` : "";
    modal.querySelector('[data-role="category"]').textContent = `Category: ${category}`;
    modal.querySelector('[data-role="sentiment"]').textContent = `Sentiment: ${sentiment}`;
    modal.querySelector('[data-role="expectation"]').textContent = expectation;
    modal.querySelector('[data-role="reality"]').textContent = reality;

    const img = modal.querySelector(".postModalImg");
    if (imageUrl) {
      img.src = imageUrl;
      img.style.display = "block";
    } else {
      img.removeAttribute("src");
      img.style.display = "none";
    }

    modal.classList.add("open");
  }

  document.getElementById("filterBtn").onclick = loadPosts;

  document.getElementById("clearBtn").onclick = () => {
    categoryInputEl.value = "";
    loadPosts();
  };

  document.getElementById("refreshBtn").onclick = loadPosts;

  mineOnlyEl.onchange = loadPosts;

  postsEl.onclick = async (e) => {
    // 1) If clicking Edit/Delete, do button logic only (no modal)
    const btn = e.target.closest?.("button");
    if (btn) {
      const id = btn.dataset.id;
      if (!id) return;

      if (btn.classList.contains("deleteBtn")) {
        await deletePost(id);
        loadPosts();
      }

      if (btn.classList.contains("editBtn")) {
        // edit flow can be wired here later
      }

      return;
    }

    // 2) Otherwise click on card (including image/text) -> open post detail modal
    const card = e.target.closest?.("article.post");
    if (!card) return;

    openModalFromCard(card);
  };

  loadPosts();
}