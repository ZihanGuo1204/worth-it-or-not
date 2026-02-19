# Worth It or Not

Author: Zihan Guo, Fanchao Yu  
Class: CS5610 Web Development  
Instructor: John Alexis Guerra Gomez  

Live Demo: https://your-deployment-url-here 
Note:

Because Render free tier does not persist disk storage,
uploaded images may be deleted after redeploy or restart.

The system automatically detects missing images and displays a fallback image instead.

GitHub Repo: https://github.com/your-username/worth-it-or-not

---

# Project Overview

Worth It or Not is a full-stack web application that helps students make smarter purchasing decisions by learning from real purchase reflections shared by other students.

Students often purchase items based on online hype, recommendations, or assumptions, and later realize the product was not as useful as expected. This app makes those “expectation vs. reality” experiences easy to browse, filter, and contribute.

This application allows students to:

- Browse real student purchase reflections  
- Compare expectation vs. reality  
- Share their own experiences  
- Upload images of purchased items (optional)  
- Edit uploaded images (replace or remove existing images)
- Track their personal purchase history (My Posts Only + Profile page)  
- Edit and delete their own posts using an iOS-style edit modal  
- Paginate through large datasets (better UX for many posts)

The system supports both:

1. Pre-purchase decision support  
2. Post-purchase reflection and tracking  

---

# User Personas

## Budget-Conscious Student

Needs help deciding whether a product is worth buying.

Goals:

- Avoid wasting money  
- Learn from others’ experiences  

## New Student

Needs guidance on useful items for student life.

Goals:

- Discover useful products  
- Avoid unnecessary purchases  

---

# User Stories

## User Story 1 — Browse Posts (with Pagination)

As a student,  
I want to browse purchase reflections,  
So that I can learn from others’ experiences.

Implementation:

- API: `GET /api/posts`
- Page: Home
- Includes:
  - Pagination (page / pageSize)
  - Refresh button to reload
  - Click a post card to open a detail modal

## User Story 2 — Submit Purchase Reflection (with Image Upload)

As a student,  
I want to submit my purchase experience,  
So that I can share whether an item was worth it.

Implementation:

- API:  
  - `POST /api/posts`  
  - `POST /api/upload`
- Page: Submit
- Includes:
  - Optional image upload + preview
  - Client-side validation

## User Story 3 — View Personal Purchase History

As a student,  
I want to view my own posts,  
So that I can track my purchase history.

Implementation:

- API: `GET /api/posts?profileId=<id>`
- Page: Home + Profile
- Includes:
  - Profile page to save a nickname (profileId stored in localStorage)
  - Home page “My posts only” checkbox uses that profileId

## User Story 4 — Filter Posts by Category (Case-insensitive)

As a student,  
I want to filter posts by category,  
So that I can focus on relevant items.

Implementation:

- API: `GET /api/posts?category=Tech`
- Page: Home
- Notes:
  - Category filter supports case-insensitive matching (e.g., `tech` works)

## User Story 5 — Edit/Delete My Own Posts (with Image Editing)

As a student,  
I want to edit or delete my own posts,  
So that I can correct or update my reflections.

Implementation:

- API:
  - `PUT /api/posts/:id`
  - `DELETE /api/posts/:id`
  - `POST /api/upload`
- Page: Home
- Includes:
  - iOS-style edit modal
  - Edit text fields
  - Replace image
  - Remove image
  - Preview image before saving
  - Edit/Delete buttons only appear for posts created under the current profileId

---

# Tech Stack

## Frontend

- HTML5  
- CSS3 (Modular CSS Architecture)  
- Vanilla JavaScript (ES6 Modules)  

UI Features:

- iOS-style edit modal
- Image preview before upload
- Image replacement and removal
- Automatic fallback image display

No React used.  
No template engines used.

---

## Backend

- Node.js  
- Express.js  
- MongoDB  
- MongoDB Native Driver  
- Multer (file upload)

Image System:

- Image upload endpoint (`/api/upload`)
- Static image serving via `/uploads`
- Automatic fallback image handling when image is missing

No Mongoose used.

---

# System Architecture

Client-Server architecture

Frontend:

- Static client served by Express  
- Client-side rendering with hash routing  
- REST API consumption via `fetch()`  

Backend:

- Express REST API  
- MongoDB database collections  
- Image upload via Multer (saved under `/uploads`)  
- Serves uploaded images via: `/uploads/<filename>`
- Automatic fallback image system if uploaded images are missing

---

# Features

Core Features:

- Browse posts (Home)
- Submit purchase reflections (Submit)
- Profile creation and history tracking (Profile + My Posts Only)
- Upload images (optional)
- Edit posts using iOS-style modal
- Replace or remove uploaded images
- Delete posts
- Filter posts by category (case-insensitive)
- Pagination (Prev/Next + page size)

Technical Features:

- REST API with MongoDB
- Image upload endpoint (`/api/upload`)
- Modular CSS structure
- Client-side rendering and routing
- ESLint + Prettier for code quality

---

# Database Design

## profiles collection

Fields:

- `_id`
- `nickname`
- `createdAt`

## posts collection

Fields:

- `_id`
- `itemName`
- `category`
- `expectation`
- `reality`
- `sentiment` (`worth` | `meh` | `not_worth`)
- `profileId`
- `imageUrl`
- `createdAt`
- `updatedAt`

Relationship:

- `posts.profileId` → `profiles._id`

---

# API Endpoints

## Posts

- `GET /api/posts`  
  - supports pagination + optional filters
  - query params:
    - `category`
    - `profileId`
    - `page`
    - `pageSize`

- `POST /api/posts`
- `PUT /api/posts/:id`
- `DELETE /api/posts/:id`

## Upload

- `POST /api/upload`  
  - multipart form field name: `image`
  - returns `{ imageUrl: "/uploads/<filename>" }`

## Profiles

- `GET /api/profiles`
- `POST /api/profiles`

---

# Screenshots

(Add screenshots here)

Suggested screenshots:

- Home page with posts + pagination
- Post detail modal
- Submit page with image preview
- Profile page (nickname saved)
- My Posts Only checkbox working

---

# How to Run Locally

Follow these steps to run the project on your own computer.

---

## 1. Clone the repository

```bash
git clone https://github.com/ZihanGuo1204/worth-it-or-not.git
cd worth-it-or-not
```

---

## 2. Install backend dependencies

Navigate to the server folder:

```bash
cd server
npm install
```

---

## 3. Create environment file

Create a file:

```
server/.env
```

Add:

```env
MONGO_URI=your_mongodb_connection_string
PORT=3000
```

Example:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/worthit
PORT=3000
```

---

## 4. (Optional) Seed database with sample data

To generate demo data:

```bash
node seed.js
```

This will create:

• Sample profiles  
• Sample posts  

---

## 5. Start the server

Run:

```bash
npm start
```

Expected output:

```
MongoDB connected
Server running at http://localhost:3000
```

---

## 6. Open the application

Open your browser:

```
http://localhost:3000
```

The frontend will load automatically.

No additional frontend setup is required.

---

# Deployment

This project is deployed using:

Render (Web Service)

The deployment includes:

• Express backend  
• MongoDB Atlas database  
• Static frontend served by Express  

Live Demo:

https://your-render-url.onrender.com

---

# Project Structure

```
worth-it-or-not/

client/
│
├── assets/
│   └── image-missing.png
│
├── index.html
│
├── index.html
├── app.js
├── api.js
├── utils.js
│
├── pages/
│   ├── home.js
│   ├── submit.js
│   ├── profile.js
│
└── styles/
    ├── base.css
    ├── nav.css
    ├── home.css
    ├── submit.css
    └── profile.css


server/
│
├── src/
│   ├── app.js
│   ├── db.js
│   │
│   └── routes/
│       ├── posts.routes.js
│       ├── profiles.routes.js
│       └── upload.routes.js
│
├── uploads/
│
├── seed.js
└── .env


Root files:

README.md  
DESIGN.md  
LICENSE  
package.json  
.gitignore
```

---

# Security

Sensitive credentials are stored in:

```
server/.env
```

This file is protected using:

```
.gitignore
```

The following files are NOT committed:

```
.env
node_modules
uploads
```

---

# Code Quality

This project uses:

ESLint — linting  
Prettier — formatting  

Run lint:

```bash
npm run lint
```

Format code:

```bash
npm run format
```

Check format:

```bash
npm run check:format
```

---

# Features Overview

Core Features:

• Browse posts  
• Submit posts  
• Edit posts  
• Delete posts  
• Upload images  
• Profile system  
• Filter posts  
• Pagination system  

Advanced Features:

• Case-insensitive filtering  
• Page size selection  
• Client-side routing  
• REST API architecture  
• iOS-style edit modal  
• Image replacement and removal  
• Automatic fallback image handling    

---

# License

MIT License

---

# Authors

Zihan Guo  
Fanchao Yu  

CS5610 Web Development  
Northeastern University