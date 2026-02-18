// src/routes/posts.routes.js
const express = require("express");
const { ObjectId } = require("mongodb");

const ALLOWED_SENTIMENTS = ["worth", "not_worth", "meh"];

function isNonEmptyString(v) {
  return typeof v === "string" && v.trim().length > 0;
}

function createPostsRouter(db) {
  const router = express.Router();
  const posts = db.collection("posts");
  const profiles = db.collection("profiles");

  // CREATE post
  router.post("/", async (req, res) => {
    try {
      const { itemName, category, expectation, reality, sentiment, profileId } = req.body;

      if (!isNonEmptyString(itemName)) {
        return res.status(400).json({ error: "itemName is required (string)" });
      }
      if (!isNonEmptyString(category)) {
        return res.status(400).json({ error: "category is required (string)" });
      }
      if (!isNonEmptyString(expectation)) {
        return res.status(400).json({ error: "expectation is required (string)" });
      }
      if (!isNonEmptyString(reality)) {
        return res.status(400).json({ error: "reality is required (string)" });
      }
      if (!ALLOWED_SENTIMENTS.includes(sentiment)) {
        return res.status(400).json({ error: "sentiment must be: worth | not_worth | meh" });
      }
      if (!profileId || !ObjectId.isValid(profileId)) {
        return res.status(400).json({ error: "profileId is required (valid ObjectId string)" });
      }

      const profileObjectId = new ObjectId(profileId);
      const profile = await profiles.findOne({ _id: profileObjectId });
      if (!profile) return res.status(404).json({ error: "profile not found" });

      const doc = {
        itemName: itemName.trim(),
        category: category.trim(),
        expectation: expectation.trim(),
        reality: reality.trim(),
        sentiment,
        profileId: profileObjectId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await posts.insertOne(doc);

      // return profile nickname too (nice UX, no auth needed)
      return res.status(201).json({
        _id: result.insertedId,
        ...doc,
        author: { _id: profile._id, nickname: profile.nickname },
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  });

  // READ posts (optional filter by category)
  // also joins nickname via a simple aggregation
  router.get("/", async (req, res) => {
    try {
      const { category } = req.query;

      const match = {};
      if (category) match.category = String(category).trim();

      const list = await posts
        .aggregate([
          { $match: match },
          { $sort: { createdAt: -1 } },
          {
            $lookup: {
              from: "profiles",
              localField: "profileId",
              foreignField: "_id",
              as: "profile",
            },
          },
          { $unwind: { path: "$profile", preserveNullAndEmptyArrays: true } },
          {
            $addFields: {
              author: {
                _id: "$profile._id",
                nickname: "$profile.nickname",
              },
            },
          },
          { $project: { profile: 0 } },
        ])
        .toArray();

      return res.json(list);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  });

  // READ single post by id
  router.get("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      if (!ObjectId.isValid(id)) return res.status(400).json({ error: "invalid id" });

      const result = await posts
        .aggregate([
          { $match: { _id: new ObjectId(id) } },
          {
            $lookup: {
              from: "profiles",
              localField: "profileId",
              foreignField: "_id",
              as: "profile",
            },
          },
          { $unwind: { path: "$profile", preserveNullAndEmptyArrays: true } },
          {
            $addFields: {
              author: {
                _id: "$profile._id",
                nickname: "$profile.nickname",
              },
            },
          },
          { $project: { profile: 0 } },
        ])
        .toArray();

      if (result.length === 0) return res.status(404).json({ error: "post not found" });
      return res.json(result[0]);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  });

  // UPDATE post by id (edit text fields + sentiment)
  router.put("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      if (!ObjectId.isValid(id)) return res.status(400).json({ error: "invalid id" });

      const { itemName, category, expectation, reality, sentiment } = req.body;

      const patch = {};
      if (itemName !== undefined) {
        if (!isNonEmptyString(itemName)) return res.status(400).json({ error: "itemName must be a non-empty string" });
        patch.itemName = itemName.trim();
      }
      if (category !== undefined) {
        if (!isNonEmptyString(category)) return res.status(400).json({ error: "category must be a non-empty string" });
        patch.category = category.trim();
      }
      if (expectation !== undefined) {
        if (!isNonEmptyString(expectation)) return res.status(400).json({ error: "expectation must be a non-empty string" });
        patch.expectation = expectation.trim();
      }
      if (reality !== undefined) {
        if (!isNonEmptyString(reality)) return res.status(400).json({ error: "reality must be a non-empty string" });
        patch.reality = reality.trim();
      }
      if (sentiment !== undefined) {
        if (!ALLOWED_SENTIMENTS.includes(sentiment)) {
          return res.status(400).json({ error: "sentiment must be: worth | not_worth | meh" });
        }
        patch.sentiment = sentiment;
      }

      if (Object.keys(patch).length === 0) {
        return res.status(400).json({ error: "no valid fields to update" });
      }

      patch.updatedAt = new Date();

      const result = await posts.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: patch },
        { returnDocument: "after" }
      );

      if (!result.value) return res.status(404).json({ error: "post not found" });
      return res.json(result.value);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  });

  // DELETE post by id
  router.delete("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      if (!ObjectId.isValid(id)) return res.status(400).json({ error: "invalid id" });

      const result = await posts.deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 0) return res.status(404).json({ error: "post not found" });

      return res.json({ ok: true, deletedId: id });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  });

  return router;
}

module.exports = { createPostsRouter };