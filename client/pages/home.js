// client/pages/home.js
import { fetchPosts, deletePost, updatePost } from "../api.js";
import { escapeHtml } from "../utils.js";

const LS_PROFILE_ID = "won_profile_id";

// ✅ Default fallback image (put file at: client/assets/cat2.png)
const DEFAULT_IMAGE_URL = "/assets/cat2.png";
const DEFAULT_IMAGE_MSG =
  "Image unavailable (Render free tier may delete uploads). Showing a default image.";

export async function renderHome(container) {
  const profileId = localStorage.getItem(LS_PROFILE_ID);

  // ===== Pagination state =====
  let currentPage = 1;
  let pageSize = 12;
  let totalPages = 1;
  let lastQueryKey = ""; // used to auto-reset page when filters change

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

          <input
            id="categoryInput"
            list="categoryList"
            placeholder="e.g. Tech"
          />

          <datalist id="categoryList">
            <option value="Tech"></option>
            <option value="School"></option>
            <option value="Kitchen"></option>
            <option value="Food"></option>
            <option value="Fashion"></option>
            <option value="Fitness"></option>
            <option value="Beauty"></option>
            <option value="Home"></option>
            <option value="Travel"></option>
            <option value="Transportation"></option>
            <option value="Subscriptions"></option>
            <option value="Entertainment"></option>
          </datalist>

          <div class="btnRow">
            <button id="filterBtn">Filter</button>
            <button id="clearBtn">Clear</button>
            <button id="refreshBtn">Refresh</button>
          </div>
        </div>

      </div>

      <!-- Pagination UI -->
      <div class="pager" style="display:flex; gap:10px; align-items:center; margin:14px 0;">
        <button id="prevPageBtn" type="button">Prev</button>
        <div id="pageInfo" style="opacity:0.9;">Page 1 / 1</div>
        <button id="nextPageBtn" type="button">Next</button>

        <div style="margin-left:auto; display:flex; gap:8px; align-items:center;">
          <label for="pageSizeSelect" style="opacity:0.9;">Page size:</label>
          <select id="pageSizeSelect">
            <option value="6">6</option>
            <option value="12" selected>12</option>
            <option value="24">24</option>
          </select>
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

  const prevBtn = document.getElementById("prevPageBtn");
  const nextBtn = document.getElementById("nextPageBtn");
  const pageInfoEl = document.getElementById("pageInfo");
  const pageSizeSelect = document.getElementById("pageSizeSelect");

  function updatePagerUI() {
    pageInfoEl.textContent = `Page ${currentPage} / ${totalPages}`;
    prevBtn.disabled = currentPage <= 1;
    nextBtn.disabled = currentPage >= totalPages;
  }

  function currentQueryKey() {
    const category = categoryInputEl.value.trim();
    const mineOnly = mineOnlyEl.checked;
    return JSON.stringify({
      category,
      mineOnly,
      profileId: mineOnly ? profileId : null,
      pageSize,
    });
  }

  async function loadPosts() {
    // If filter changed, reset to page 1
    const key = currentQueryKey();
    if (key !== lastQueryKey) {
      currentPage = 1;
      lastQueryKey = key;
    }

    const category = categoryInputEl.value.trim();
    const mineOnly = mineOnlyEl.checked;

    // If "My posts only" but no profileId exists, show friendly message
    if (mineOnly && !profileId) {
      postsEl.innerHTML = `
        <p class="empty">
          You don’t have a profile yet. Go to <b>Profile</b> to create one, then come back.
        </p>
      `;
      totalPages = 1;
      currentPage = 1;
      updatePagerUI();
      return;
    }

    const data = await fetchPosts({
      category: category || undefined,
      profileId: mineOnly ? profileId : undefined,
      page: currentPage,
      pageSize,
    });

    // server returns { items, page, pageSize, total, totalPages }
    const items = Array.isArray(data) ? data : data.items || [];
    currentPage = Array.isArray(data) ? currentPage : data.page || currentPage;
    totalPages = Array.isArray(data) ? 1 : data.totalPages || 1;

    if (!items.length) {
      postsEl.innerHTML = `<p class="empty">No posts yet.</p>`;
      updatePagerUI();
      return;
    }

    postsEl.innerHTML = items
      .map((p) => {
        const canEdit = String(profileId || "") === String(p.profileId || "");

        const preview = p.expectation || "";
        const safeTitle = escapeHtml(p.itemName || "");
        const safeCategory = escapeHtml(p.category || "");
        const safeSentiment = escapeHtml(p.sentiment || "");
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
                ? `<img class="postImage" src="${p.imageUrl}" alt="${safeTitle}" loading="lazy"
                     onerror="this.style.display='none';" />`
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
                ${
                  canEdit
                    ? `<button class="editBtn" data-id="${p._id}">Edit</button>`
                    : ""
                }
                ${
                  canEdit
                    ? `<button class="deleteBtn" data-id="${p._id}">Delete</button>`
                    : ""
                }
              </div>
            </div>
          </article>
        `;
      })
      .join("");

    updatePagerUI();
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
          <div class="postModalImgMsg" style="display:none;"></div>
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
    const msgEl = modal.querySelector(".postModalImgMsg");

    // reset state every open
    img.onerror = null;
    msgEl.style.display = "none";
    msgEl.textContent = "";

    // If no imageUrl, show default immediately + message
    if (!imageUrl) {
      img.src = DEFAULT_IMAGE_URL;
      img.style.display = "block";
      msgEl.textContent = DEFAULT_IMAGE_MSG;
      msgEl.style.display = "block";
      modal.classList.add("open");
      return;
    }

    // Try real image first
    img.src = imageUrl;
    img.style.display = "block";

    // If image 404 / fails, fall back to default + message
    img.onerror = () => {
      img.onerror = null; // prevent loop
      img.src = DEFAULT_IMAGE_URL;
      img.style.display = "block";
      msgEl.textContent = DEFAULT_IMAGE_MSG;
      msgEl.style.display = "block";
    };

    modal.classList.add("open");
  }

  // ===== Controls =====
  document.getElementById("filterBtn").onclick = () => {
    currentPage = 1;
    loadPosts();
  };

  document.getElementById("clearBtn").onclick = () => {
    categoryInputEl.value = "";
    currentPage = 1;
    loadPosts();
  };

  document.getElementById("refreshBtn").onclick = () => {
    loadPosts();
  };

  mineOnlyEl.onchange = () => {
    currentPage = 1;
    loadPosts();
  };

  // pager buttons
  prevBtn.onclick = () => {
    if (currentPage > 1) {
      currentPage -= 1;
      loadPosts();
    }
  };

  nextBtn.onclick = () => {
    if (currentPage < totalPages) {
      currentPage += 1;
      loadPosts();
    }
  };

  pageSizeSelect.onchange = () => {
    pageSize = Number.parseInt(pageSizeSelect.value, 10) || 12;
    currentPage = 1;
    loadPosts();
  };

  // ===== Post click handling (delete/edit/modal) =====
  postsEl.onclick = async (e) => {
    const btn = e.target.closest?.("button");
    if (btn) {
      const id = btn.dataset.id;
      if (!id) return;

      if (btn.classList.contains("deleteBtn")) {
        await deletePost(id);
        await loadPosts();
        return;
      }

      if (btn.classList.contains("editBtn")) {
        try {
          const card = btn.closest?.("article.post");
          if (!card) return;

          const currentItemName = card.dataset.itemname || "";
          const currentCategory = card.dataset.category || "";
          const currentSentiment = card.dataset.sentiment || "";
          const currentExpectation = card.dataset.expectation || "";
          const currentReality = card.dataset.reality || "";

          const itemName = prompt("Edit item name:", currentItemName);
          if (itemName === null) return;

          const category = prompt("Edit category:", currentCategory);
          if (category === null) return;

          const sentiment = prompt(
            "Edit sentiment (worth | not_worth | meh):",
            currentSentiment
          );
          if (sentiment === null) return;

          const expectation = prompt("Edit expectation:", currentExpectation);
          if (expectation === null) return;

          const reality = prompt("Edit reality:", currentReality);
          if (reality === null) return;

          await updatePost(id, {
            itemName,
            category,
            sentiment,
            expectation,
            reality,
          });

          await loadPosts();
        } catch (err) {
          alert(err.message || "Edit failed");
        }
        return;
      }

      return;
    }

    const card = e.target.closest?.("article.post");
    if (!card) return;
    openModalFromCard(card);
  };

  await loadPosts();
}