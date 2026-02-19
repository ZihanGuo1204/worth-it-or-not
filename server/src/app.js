// server/src/app.js
require("dotenv").config();

const express = require("express");
const path = require("path");

const { createUploadRouter } = require("./routes/upload.routes");
const { connectDb } = require("./db");
const { createProfilesRouter } = require("./routes/profiles.routes");
const { createPostsRouter } = require("./routes/posts.routes");

const app = express();

app.use(express.json());

// serve uploaded images (Render free: may 404 after redeploy/restart, that's expected)
app.use("/uploads", express.static(path.resolve(__dirname, "../uploads")));

// health (no DB needed)
app.get("/api/health", (req, res) => {
  res.json({ ok: true, at: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;

async function start() {
  const db = await connectDb(process.env.MONGO_URI);

  // API
  app.use("/api/profiles", createProfilesRouter(db));
  app.use("/api/posts", createPostsRouter(db));
  app.use("/api/upload", createUploadRouter());

  // Frontend static (served from repo's /client)
  const clientDir = path.join(__dirname, "../../client");
  app.use(express.static(clientDir));

  // Root -> index.html
  app.get("/", (req, res) => {
    res.sendFile(path.join(clientDir, "index.html"));
  });

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});