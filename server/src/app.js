// server/src/app.js
// Basic Express server (CJS)

require("dotenv").config();

const express = require("express");
const path = require("path");

const { createUploadRouter } = require("./routes/upload.routes");

const { connectDb } = require("./db");
const { createProfilesRouter } = require("./routes/profiles.routes");
const { createPostsRouter } = require("./routes/posts.routes");

const app = express();

// serve client
app.use(express.static(path.join(__dirname, "../../client")));

// serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use(express.json());

// health (no DB needed)
app.get("/api/health", (req, res) => {
  res.json({ ok: true, at: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;

async function start() {
  const db = await connectDb(process.env.MONGO_URI);

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