// client/pages/home.js
// FINAL version — VisionOS style cards + filters

import { fetchPosts, deletePost, updatePost } from "../api.js";

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


    postsEl.innerHTML = posts.map(p => {

      const canEdit = profileId === p.profileId;

      return `

        <article class="post">

          <div class="postTop">

            <h3 class="title">

              ${p.itemName}

              <span class="by">(by ${p.author?.nickname || "unknown"})</span>

            </h3>

            <div class="actions">

              ${canEdit ? `<button class="editBtn" data-id="${p._id}">Edit</button>` : ""}

              ${canEdit ? `<button class="deleteBtn" data-id="${p._id}">Delete</button>` : ""}

            </div>

          </div>


          <div class="meta">

            <span class="pill">Category: ${p.category}</span>

            <span class="pill">Sentiment: ${p.sentiment}</span>

          </div>


          <div class="twoCol">

            <div class="box">

              <div class="label">Expectation</div>

              <div class="text">${p.expectation}</div>

            </div>


            <div class="box">

              <div class="label">Reality</div>

              <div class="text">${p.reality}</div>

            </div>

          </div>

        </article>

      `;

    }).join("");

  }


  document.getElementById("filterBtn").onclick = loadPosts;

  document.getElementById("clearBtn").onclick = () => {

    categoryInputEl.value = "";

    loadPosts();

  };

  document.getElementById("refreshBtn").onclick = loadPosts;

  mineOnlyEl.onchange = loadPosts;


  postsEl.onclick = async (e) => {

    const btn = e.target;

    const id = btn.dataset.id;

    if (!id) return;


    if (btn.classList.contains("deleteBtn")) {

      await deletePost(id);

      loadPosts();

    }


  };


  loadPosts();

}