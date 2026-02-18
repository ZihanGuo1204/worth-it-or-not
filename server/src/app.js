const { createPostsRouter } = require("./routes/posts.routes");

// server/src/app.js
// Basic Express server (CJS)
// Health route first, then DB connect, then mount routes, then listen

require("dotenv").config();

const express = require("express");
const { connectDb } = require("./db");
const { createProfilesRouter } = require("./routes/profiles.routes");

const app = express();
const path = require("path");
app.use(express.static(path.join(__dirname, "../../client")));

app.use(express.json());

// Basic health route (no DB needed)
app.get("/api/health", (req, res) => {
  res.json({ ok: true, at: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;

async function start() {
  const db = await connectDb(process.env.MONGO_URI);

  // Mount routers AFTER db is ready
  app.use("/api/profiles", createProfilesRouter(db));
  app.use("/api/posts", createPostsRouter(db));

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err.message);
  process.exit(1);
});