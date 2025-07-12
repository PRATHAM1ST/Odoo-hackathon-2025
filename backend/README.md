# ⚙️ Skill Swap Platform – Backend (FastAPI)

This is the backend API for the **Skill Swap Platform**, built with **FastAPI**. It handles authentication, user profiles, skill swap logic, admin moderation, and feedback.

---

## 🚀 Tech Stack

- **Backend Framework:** FastAPI
- **Database:** MongoDB (via Motor or ODMantic)
- **Auth:** JWT (Bearer Token)
- **File Uploads:** Cloudinary (optional)
- **Realtime (Optional):** WebSockets or polling
- **Deployment:** Render / Railway

---

## 📂 Project Structure

````

backend/
├── app/
│   ├── main.py              # Entry point
│   ├── models/              # MongoDB models
│   ├── schemas/             # Pydantic schemas
│   ├── routers/             # Route definitions
│   │   ├── auth.py
│   │   ├── users.py
│   │   ├── swaps.py
│   │   └── admin.py
│   ├── auth/                # JWT handlers
│   ├── utils/               # Helpers (Cloudinary, feedback, etc.)
│   └── database.py          # MongoDB connection
├── requirements.txt
└── .env

````

---

## 🔧 Getting Started

### 1. Create virtual environment
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
````

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Set up environment variables

Create a `.env` file:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
CLOUDINARY_URL=cloudinary://key:secret@cloudname
```

### 4. Run FastAPI server

```bash
uvicorn app.main:app --reload
```

API will be live at `http://localhost:8000`

---

## 📌 API Endpoints

| Route            | Method | Description               |
| ---------------- | ------ | ------------------------- |
| `/auth/signup`   | POST   | Create new user           |
| `/auth/login`    | POST   | Login + JWT token         |
| `/users/`        | GET    | List public user profiles |
| `/users/{id}`    | PUT    | Update profile            |
| `/swaps/request` | POST   | Send a swap request       |
| `/swaps/{id}`    | DELETE | Delete swap               |
| `/admin/users`   | GET    | View all users (admin)    |

Use built-in Swagger Docs at `http://localhost:8000/docs`

---

## 🚀 Deployment

You can deploy this backend easily using:

* **Railway** (1-click FastAPI deploy)
* **Render**
* **Fly.io**

---

## 📃 License

MIT

