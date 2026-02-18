Worth It or Not

Author: Zihan Guo, Fanchao Yu
Class: CS5610 Web Development
Instructor: John Alexis Guerra Gomez

Live Demo: (add your deployed URL here)
GitHub Repo: (add your GitHub repo URL here)

⸻

Project Description

Worth It or Not is a student-focused purchase decision and reflection web application.

Students often buy items based on assumptions, trends, or online hype, and later realize the item was not as useful as expected.

This application helps students:

• Learn from other students’ real experiences before buying
• Submit structured purchase reflections
• Compare expectation vs. reality
• Reflect on their own buying habits
• Make smarter purchasing decisions

This system supports two main user phases: 1. Purchase Decision Support 2. Purchase Reflection and History Tracking

⸻

User Personas

Budget-conscious student

Wants to avoid wasting money on items that seem useful but are not.

New student

Needs advice from real student experiences before buying items.

⸻

User Stories

User Story 1 — Browse Posts

As a student,
I want to browse posts,
So I can learn from others’ experiences.

Implemented:

GET /api/posts

Page:

Home

⸻

User Story 2 — Submit Reflection

As a student,
I want to submit expectation vs reality,
So I can share my experience.

Implemented:

POST /api/posts
POST /api/upload

Page:

Submit

⸻

User Story 3 — View Personal History

As a student,
I want to view posts by profile,
So I can review my past reflections.

Implemented:

GET /api/profiles

Page:

Profile

⸻

User Story 4 — Filter Posts

As a student,
I want to filter posts by category,
So I can focus on relevant items.

Implemented:

GET /api/posts?category=Tech

Page:

Home

⸻

Tech Stack

Frontend

HTML5
CSS3 (Modular CSS)
Vanilla JavaScript (ES6 Modules)

Backend

Node.js
Express
MongoDB
MongoDB Native Driver

No React
No Mongoose
No Template Engines

⸻

Features

Browse posts
Submit posts
Upload images
Filter posts
Profile history
Client-side rendering
REST API

⸻

Database Design

Collection: profiles

Fields:

\_id
nickname
createdAt

⸻

Collection: posts

Fields:

\_id
itemName
category
expectation
reality
sentiment
profileId
imageUrl
createdAt
updatedAt

⸻

API Endpoints

GET

/api/posts

GET

/api/posts?category=Tech

POST

/api/posts

POST

/api/upload

GET

/api/profiles

⸻

Screenshots

Add screenshots here

Example:

Home Page
Submit Page
Profile Page

⸻

How to Run Locally

Clone repo：
git clone <repo url>
cd worth-it-or-not

⸻

Install dependencies：
cd server
npm install

⸻

Create .env
server/.env

Example:
MONGO_URI=your_mongodb_uri
PORT=3000

⸻

Seed database：
node seed.js

⸻

Open browser：
http://localhost:3000

⸻

Folder Structure

client

app.js
api.js
utils.js
pages/
styles/

server

src/

app.js
db.js
routes/

uploads/

seed.js

⸻

Security

Mongo credentials are stored in .env

.env is not committed

⸻

License

MIT License
