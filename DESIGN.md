# Worth It or Not — Design Document

Author: Zihan Guo, Fanchao Yu  
Course: CS5610 Web Development  
Instructor: John Alexis Guerra Gomez

---

# Overview

Worth It or Not is a student-focused purchase reflection web application.

Students often buy products based on expectations, hype, or trends.

This system allows students to:

• Share their purchase experiences  
• Compare expectation vs reality  
• Upload images  
• Learn from other students

The system provides:

• REST API backend  
• MongoDB database  
• Image upload system  
• Modular frontend

---

# Architecture

The system follows a:

Client → Server → Database

structure.

---

# Client

Technologies:

• HTML  
• CSS Modules  
• Vanilla JavaScript

Responsibilities:

• Render posts  
• Submit posts  
• Upload images  
• Display profiles

---

# Server

Technologies:

• Node.js  
• Express.js

Responsibilities:

• REST API

Routes:

GET /api/posts

POST /api/posts

GET /api/profiles

POST /api/upload

GET /api/health

---

# Database

Technology:

MongoDB

Collections:

---

profiles

Fields:

\_id

nickname

createdAt

---

posts

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

---

# Image Storage

Images are stored in:

server/uploads/

Images are served via:

/uploads/filename.jpg

---

# Frontend Structure

client/

index.html

app.js

styles/

base.css

layout.css

nav.css

cards.css

forms.css

pages.css

modals.css

---

# Backend Structure

server/

src/

app.js

db.js

routes/

posts.routes.js

profiles.routes.js

upload.routes.js

uploads/

seed.js

---

# REST API Design

GET /api/posts

Returns list of posts

---

POST /api/posts

Creates new post

---

GET /api/profiles

Returns profiles

---

POST /api/upload

Uploads image

---

GET /api/health

Server status check

---

# Seed System

Seed script:

server/seed.js

Creates:

• profiles
• posts

Supports:

SEED_POSTS=1200

---

# Design Decisions

Vanilla JS instead of React

Reason:

Class requirement

MongoDB Native Driver instead of Mongoose

Reason:

Class requirement

Disk storage instead of GridFS

Reason:

Simpler and faster

---

# Security

.env file stores database URI

Not committed to Git

---

# Conclusion

The system provides a complete full-stack web application.

Supports:

• CRUD operations
• Image upload
• Profile system
• REST API
• Database storage
