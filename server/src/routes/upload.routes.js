const express = require("express");
const multer = require("multer");
const path = require("path");

function createUploadRouter() {
  const router = express.Router();

  const storage = multer.diskStorage({

    destination: function (req, file, cb) {

      cb(null, path.join(__dirname, "../../uploads"));

    },

    filename: function (req, file, cb) {

      const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);

      cb(null, unique + path.extname(file.originalname));

    },

  });

  const upload = multer({ storage });

  router.post("/", upload.single("image"), (req, res) => {

    if (!req.file) {

      return res.status(400).json({ error: "No file uploaded" });

    }

    const imageUrl = "/uploads/" + req.file.filename;

    res.json({ imageUrl });

  });

  return router;
}

module.exports = { createUploadRouter };