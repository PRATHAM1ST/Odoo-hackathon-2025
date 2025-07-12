# 🔁 Skill Swap Platform

A full-stack web application built during a hackathon to connect people based on the skills they offer and the skills they want to learn. The goal is to promote collaborative learning and growth through peer-to-peer skill exchange.

---

## 🧠 Problem Statement

**"Learning doesn't have to be expensive — just shared."**

Many people have skills they are willing to share (e.g., Photoshop, public speaking, coding) but are looking to learn others (e.g., Excel, design, writing). This platform lets users **exchange their skills instead of money** — a barter system for knowledge.

---

## 🚀 Project Overview

### Key Features
- 🧑 **User Profiles** with name, location, photo, skills offered, and skills wanted
- 🔍 **Search Users** based on availability or skill (e.g., “Excel”)
- 🔄 **Swap Request System** to offer your skill and request another
- ✅ Accept / ❌ Reject / 🔁 Delete swap requests
- ⭐ **Ratings & Feedback** after swaps
- 🛡️ **Admin Panel** to:
  - Reject inappropriate skills
  - Ban spammy users
  - Monitor swap activity
  - Send announcements
  - Download platform reports

---

## 🛠️ Tech Stack

| Layer       | Technology                  |
|------------|-----------------------------|
| Frontend   | Next.js (App Router) + Tailwind CSS |
| Backend    | FastAPI (Python)             |
| Database   | MongoDB Atlas                |
| Auth       | JWT-based authentication     |
| File Upload| Cloudinary                   |
| Deployment | Vercel (frontend), Render (backend) |

---

## 🗂️ Project Structure

```

skill-swap-platform/
├── frontend/    → Next.js + Tailwind (App Router)
├── backend/     → FastAPI + MongoDB
├── README.md
└── .env         → Environment variables

````

---

## 📷 Screens Overview

- 🏠 **Home:** View public profiles + search by skill
- 🔐 **Login:** Secure user login and signup
- 👤 **Profile:** Add skills, availability, and toggle public/private
- 🔄 **Request Swap:** Send skill swap offers (protected by login)
- 📥 **Swap Dashboard:** Manage pending/accepted/rejected swaps
- ⚙️ **Admin Panel:** Monitor and manage platform activity

---

## 📌 Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/your-org/Odoo-hackathon-2025.git
cd Odoo-hackathon-2025
````

### 2. Set Up Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

> Make sure MongoDB URI and JWT secret are set in `.env`

### 3. Set Up Frontend

```bash
cd frontend
npm install
npm run dev
```

> Set API base URL and Cloudinary keys in `.env.local`

---

## 👨‍👩‍👧‍👦 Team

| Name          | Role              | GitHub                                       |
| ------------- | ----------------- | -------------------------------------------- |
| Pratham (You) | Frontend Lead  & UI/ UX    | [@PRATHAM1ST](https://github.com/PRATHAM1ST) |
| Teammate A    | Backend Developer | [@kathan11](https://github.com/kathan11)     |
| Teammate B    |Backend Developer     | [@jayshah18](https://github.com/jayshah18)     |

---

## 💡 Future Improvements

* Email Notifications on accepted/rejected swaps
* In-app messaging
* OAuth (Google/GitHub) login
* Mobile app version

---

## 🏁 Conclusion

The Skill Swap Platform encourages **community-driven learning** and skill building. In a world where everyone has something to teach and something to learn, this platform is a step toward **mutual growth**.

> 🚨 Made during hrs with love, caffeine, and code.

---

## 📃 License

MIT License

