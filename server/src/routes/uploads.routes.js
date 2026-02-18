// server/src/routes/uploads.routes.js
import express from "express";
import multer from "multer";
import { ObjectId, GridFSBucket } from "mongodb";
import { getDb } from "../db.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const db = getDb();
    const bucket = new GridFSBucket(db, { bucketName: "images" });

    const filename = req.file.originalname || "upload";

    const uploadStream = bucket.openUploadStream(filename, {
      contentType: req.file.mimetype,
      metadata: {
        originalName: req.file.originalname,
      },
    });

    uploadStream.end(req.file.buffer);

    uploadStream.on("finish", () => {
      res.json({ imageId: String(uploadStream.id) });
    });

    uploadStream.on("error", (err) => {
      console.error("Upload stream error:", err);
      res.status(500).json({ error: "Upload failed" });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const db = getDb();
    const bucket = new GridFSBucket(db, { bucketName: "images" });

    const id = new ObjectId(req.params.id);

    const files = await db.collection("images.files").find({ _id: id }).toArray();
    if (!files || files.length === 0) {
      return res.status(404).json({ error: "Image not found" });
    }

    const file = files[0];
    res.setHeader("Content-Type", file.contentType || "application/octet-stream");

    const downloadStream = bucket.openDownloadStream(id);
    downloadStream.on("error", () => res.status(404).json({ error: "Image not found" }));
    downloadStream.pipe(res);
  } catch (err) {
    res.status(400).json({ error: "Invalid image id" });
  }
});

export default router;