// server/seed.js
// Seed fake data for Worth It or Not (CJS, mongodb driver)
// Run: node seed.js

require("dotenv").config();
const { ObjectId } = require("mongodb");
const { connectDb } = require("./src/db");

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function seed() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("Missing MONGO_URI in .env");

  const db = await connectDb(uri);

  const profiles = db.collection("profiles");
  const posts = db.collection("posts");

  // Optional: clean old data (recommended for demo consistency)
  await profiles.deleteMany({});
  await posts.deleteMany({});

  const nicknames = [
    "zihan2",
    "budgetTiger",
    "coffeeAddict",
    "techGoblin",
    "studyMode",
    "rentIsTooHigh",
    "gymMaybeTomorrow",
    "snowDaySkier",
  ];

  const profileDocs = nicknames.map((nickname) => ({
    nickname,
    createdAt: new Date(),
  }));

  const profileResult = await profiles.insertMany(profileDocs);
  const profileIds = Object.values(profileResult.insertedIds); // ObjectId[]

  const categories = ["Tech", "Kitchen", "School", "Fashion", "Fitness", "Travel"];
  const sentiments = ["worth", "not_worth", "meh"];

  const items = [
    "Air fryer",
    "iPad",
    "Water bottle",
    "Noise-cancelling headphones",
    "Mechanical keyboard",
    "Standing desk",
    "LED desk lamp",
    "Gym membership",
    "Coffee grinder",
    "Portable monitor",
    "Winter jacket",
    "Ski gloves",
    "Backpack",
    "Planner notebook",
  ];

  const expectationPool = [
    "Thought I would use it every single day.",
    "Expected it to save me time and money.",
    "I thought it would make studying way easier.",
    "Expected it to be super convenient for student life.",
    "I bought it because everyone online hyped it up.",
  ];

  const realityPool = [
    "Used it twice and now it lives in my closet.",
    "Actually pretty useful, but not life-changing.",
    "Good quality, but honestly overpriced.",
    "It’s fine, but it didn’t match my expectations.",
    "Surprisingly worth it. I didn’t regret it.",
  ];

  const fakePosts = [];
  const total = 60;

  for (let i = 0; i < total; i++) {
    const profileId = pick(profileIds); // ObjectId
    const createdDaysAgo = randInt(0, 21);
    const createdAt = new Date(Date.now() - createdDaysAgo * 24 * 60 * 60 * 1000);

    fakePosts.push({
      itemName: pick(items),
      category: pick(categories),
      expectation: pick(expectationPool),
      reality: pick(realityPool),
      sentiment: pick(sentiments),
      profileId, // ObjectId (matches your posts.routes.js)
      createdAt,
      updatedAt: createdAt,

      // future field (for image upload later)
      imageUrl: null,
    });
  }

  await posts.insertMany(fakePosts);

  console.log("✅ Seed finished");
  console.log("Profiles:", await profiles.countDocuments());
  console.log("Posts:", await posts.countDocuments());
}

seed().catch((e) => {
  console.error("❌ Seed failed:", e.message);
  process.exit(1);
});