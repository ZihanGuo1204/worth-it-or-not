// server/src/app.js
require("dotenv").config();

const express = require("express");
const path = require("path");

const { createUploadRouter } = require("./routes/upload.routes");
const { connectDb } = require("./db");
const { createProfilesRouter } = require("./routes/profiles.routes");
const { createPostsRouter } = require("./routes/posts.routes");

const app = express();
const PORT = process.env.PORT || 3000;

// ---- Frontend static (ALWAYS serve, even if DB is down) ----
const clientDir = path.join(__dirname, "../../client");
app.use(express.static(clientDir));

// Root -> index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(clientDir, "index.html"));
});

// (Optional but nice) SPA fallback: any non-API route returns index.html
// Helps if later you switch away from hash routes
app.get(/^\/(?!api\/).*/, (req, res) => {
  res.sendFile(path.join(clientDir, "index.html"));
});

// ---- Middleware ----
app.use(express.json());

// serve uploaded images
app.use("/uploads", express.static(path.resolve(__dirname, "../uploads")));

// health (no DB needed)
app.get("/api/health", (req, res) => {
  res.json({ ok: true, at: new Date().toISOString() });
});

async function start() {
  const db = await connectDb(process.env.MONGO_URI);

  // API
  app.use("/api/profiles", createProfilesRouter(db));
  app.use("/api/posts", createPostsRouter(db));
  app.use("/api/upload", createUploadRouter());

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});