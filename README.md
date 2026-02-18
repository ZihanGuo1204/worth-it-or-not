# Worth It or Not

Author: Zihan Guo, Fanchao Yu  
Class: CS5610 Web Development  
Instructor: John Alexis Guerra Gomez  

Live Demo: https://your-deployment-url-here  
GitHub Repo: https://github.com/your-username/worth-it-or-not  

---

# Project Overview

Worth It or Not is a full-stack web application that helps students make smarter purchasing decisions by learning from real experiences shared by other students.

Students often purchase items based on online hype, recommendations, or assumptions, only to later realize the product was not as useful as expected.

This application allows students to:

• Browse real student purchase reflections  
• Compare expectation vs. reality  
• Share their own experiences  
• Upload images of purchased items  
• Track their personal purchase history  

The system supports both:

1. Pre-purchase decision support  
2. Post-purchase reflection and tracking  

---

# User Personas

## Budget-Conscious Student

Needs help deciding whether a product is worth buying.

Goals:

• Avoid wasting money  
• Learn from others' mistakes  

---

## New Student

Needs guidance on useful items for student life.

Goals:

• Discover useful products  
• Avoid unnecessary purchases  

---

# User Stories

## User Story 1 — Browse Posts

As a student,  
I want to browse purchase reflections,  
So that I can learn from others' experiences.

Implementation:

API

GET /api/posts  

Page

Home

---

## User Story 2 — Submit Purchase Reflection

As a student,  
I want to submit my purchase experience,  
So that I can share whether an item was worth it.

Implementation:

API

POST /api/posts  
POST /api/upload  

Page

Submit

---

## User Story 3 — View Personal Purchase History

As a student,  
I want to view posts grouped by profile,  
So that I can track my purchase history.

Implementation:

API

GET /api/profiles  

Page

Profile

---

## User Story 4 — Filter Posts by Category

As a student,  
I want to filter posts by category,  
So that I can focus on relevant items.

Implementation:

API

GET /api/posts?category=Tech  

Page

Home

---

# Tech Stack

## Frontend

HTML5  
CSS3 (Modular CSS Architecture)  
Vanilla JavaScript (ES6 Modules)  

No React used.

---

## Backend

Node.js  
Express.js  
MongoDB  
MongoDB Native Driver  

No Mongoose used.

---

# System Architecture

Client-Server architecture

Frontend:

• Static client served by Express  
• Client-side rendering  
• REST API consumption  

Backend:

• Express REST API  
• MongoDB database  
• Image upload using Multer  

---

# Features

Core Features:

• Browse posts  
• Submit purchase reflections  
• Upload images  
• Filter posts  
• View profile history  

Technical Features:

• REST API  
• Image upload system  
• Modular CSS  
• Client-side rendering  
• MongoDB database  

---

# Database Design

## profiles collection

Fields:

_id  
nickname  
createdAt  

---

## posts collection

Fields:

_id  
itemName  
category  
expectation  
reality  
sentiment  
profileId  
imageUrl  
createdAt  
updatedAt  

Relationship:

posts.profileId → profiles._id

---

# API Endpoints

## Posts

GET

/api/posts

GET

/api/posts?category=Tech

POST

/api/posts

---

## Upload

POST

/api/upload

---

## Profiles

GET

/api/profiles

---

# Screenshots

(Add screenshots here)

Example:

Home Page  
Submit Page  
Profile Page  

---

# How to Run Locally

## Clone repository

git clone https://github.com/your-username/worth-it-or-not

cd worth-it-or-not

---

## Install dependencies

cd server

npm install

---

## Create .env file

server/.env

Example:

MONGO_URI=your_mongodb_uri

PORT=3000

---

## Seed database

node seed.js

---

## Run server

npm start

---

## Open browser

http://localhost:3000

---

# Project Structure

worth-it-or-not/

client/  
&nbsp;&nbsp;&nbsp;&nbsp;app.js  
&nbsp;&nbsp;&nbsp;&nbsp;api.js  
&nbsp;&nbsp;&nbsp;&nbsp;utils.js  
&nbsp;&nbsp;&nbsp;&nbsp;pages/  
&nbsp;&nbsp;&nbsp;&nbsp;styles/  

server/  
&nbsp;&nbsp;&nbsp;&nbsp;src/  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;app.js  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;db.js  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;routes/  

&nbsp;&nbsp;&nbsp;&nbsp;uploads/  
&nbsp;&nbsp;&nbsp;&nbsp;seed.js  

README.md  
DESIGN.md  
LICENSE  

---

# Security

Sensitive data stored in:

.env

Not committed to GitHub.

.gitignore protects:

.env  
node_modules  
uploads  

---

# Code Quality

ESLint used for linting

Prettier used for formatting

Run:

npm run lint

npm run format

---

# License

MIT License