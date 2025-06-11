# Torre Engineering - Technical Test v2.1

This repository contains my solution for the **Torre Engineering Technical Test v2.1**.

## 🧠 About the Challenge

The test required building a full-stack application using the public APIs of [Torre](https://torre.co), showcasing both front-end and back-end engineering skills. The goal was to create a platform where users can:

- Search for job opportunities
- Search for people by skills or roles
- View genome data of specific users
- Save favorites (jobs and people)
- Analyze most-searched terms through an analytics dashboard

## 🛠️ Stack Used

**Front-end:**
- React (with Vite)
- TailwindCSS
- Framer Motion
- Axios

**Back-end:**
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose

**Deployment:**
- I can't Vercel (Frontend)
- Render (Backend)

---

## 📋 Features

- **Job Search:** Integrated Torre's opportunities API to allow keyword-based job searching.
- **People Search:** Used Torre's opportunities endpoint to extract and deduplicate profile data.
- **Favorites:** Users can favorite jobs and profiles (deduplicated and stored in MongoDB).
- **Analytics:** Tracks most searched terms using MongoDB aggregations, which are shown on the UI.
- **Genome Page:** Pulls genome information from Torre for any valid username.
- **Responsive UI:** Built with TailwindCSS and responsive for all devices.
- **Feedback & Alerts:** Toast messages and alerts guide the user for successful/duplicate actions.
- **Modular Architecture:** Backend is split into routes, controllers, models, and services.

---

## ✨ Creativity & Learning Highlights

- Added a genome explorer to show user insights from the Torre API.
- Used `Set`, `Map` and Mongoose indexes to prevent duplicates in both frontend and backend.
- Created a searchable analytics section using MongoDB aggregation.
- Used Framer Motion for a delightful UI interaction experience.

---

## 🧱 Challenges Faced

- Understanding deeply nested and unstructured Torre API data.
- Handling CORS when dealing with cross-origin requests.
- Preventing duplication in MongoDB without using user login.
- Managing environment variables for clean deployment.

---

#  Explaining the Project
<h1>✅ What was built? Why did I decide to build this?</h1>

I built a full-stack application to interact with the Torre APIs.
It allows users to:

🔍 Search for job opportunities and people based on skills or keywords.

⭐ Favorite profiles or jobs.

🧬 View genome information of any Torre user.

📊 Analyze the most searched terms using basic analytics.

I chose this approach to showcase real-world full-stack features: integration with public APIs, persistent data storage (MongoDB), UI feedback, and analytics – while keeping the app simple and clean.

# 🧱 How is the project structured and architected?
Back-end (Node.js + Express + MongoDB):

routes/torreRoutes.js: Handles all API endpoints.

controllers/torreController.js: Core logic for favorites, search logging, analytics, and genome retrieval.

models/Favorite.js and models/SearchLog.js: MongoDB schemas with validation and uniqueness enforcement.

MongoDB Aggregation: Used to implement search term analytics.

Front-end (React + Vite + TailwindCSS):

SearchPeople.jsx: Profile deduplication, favorite button with alert.

FavoritesPage.jsx: Organized rendering of jobs and profiles separately.

GenomePage.jsx: Fetches genome data from the API directly.

App.jsx: Clean routing for all main views.

Framer Motion: Adds animations to buttons and cards.

TailwindCSS: Used for responsive and modern UI design.

# 🧩 Is there anything I would like to improve?

Yes, some areas that could be improved with more time:

Given more time, I would have Added Vercel deployment for live demos and faster hosting

Add authentication (JWT) to handle real user sessions.

Implement infinite scroll or better pagination in search results.

Create charts to visualize analytics (e.g., with Recharts or Chart.js).

Improve UI/UX with smoother transitions and loading skeletons.

Add unit and integration tests for both front-end and back-end.


# MORE INFORMATION

<h1>complete readme</h1>

[readme backend](../backend/readme.md)

[readme frontend](../torre-frontend/README.md)


## 🚀 How to Run Locally!

```bash
# Clone the repo
git clone https://github.com/ThallesLima3301/Torre_Engineering-test_technician.git
cd Torre_Engineering-test_technician

# Backend
cd backend
npm install
npm run dev

# Frontend
cd ../torre-frontend
npm install
npm run dev
