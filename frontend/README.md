# 🧩 Skill Swap Platform – Frontend

This is the frontend of the **Skill Swap Platform**, a web application for connecting people who want to exchange skills. Built using the latest **Next.js (App Router)** and styled with **Tailwind CSS**.

---

## 🚀 Tech Stack

- **Framework:** Next.js (v14+ with App Router)
- **Styling:** Tailwind CSS
- **Auth:** JWT (from backend)
- **State Management:** Context API
- **API Communication:** Axios
- **Deployment:** Vercel

---

## 📂 Project Structure

```

frontend/
├── app/                # Routing (App Router)
│   ├── login/
│   ├── profile/
│   ├── swap-requests/
│   ├── admin/
│   └── layout.tsx
├── components/         # Reusable UI components
├── context/            # AuthContext
├── lib/                # Axios config
├── public/
├── styles/             # Tailwind + global styles
└── .env.local          # API URL & JWT secret

````

---

## 🔧 Getting Started

### 1. Install Dependencies
```bash
cd frontend
npm install
````

### 2. Set Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

### 3. Run Dev Server

```bash
npm run dev
```

Frontend should now be running at `http://localhost:3000`

---

## 📌 Features

* Browse public profiles
* Login / Signup with JWT
* Create/edit user profile
* Send/accept/reject/delete swap requests
* View swap dashboard (pending/accepted/rejected)
* Admin view (if logged in as admin)
* Mobile responsive

---

## 🚀 Deployment

This app can be easily deployed to [Vercel](https://vercel.com/):

```bash
vercel --prod
```

---

## 📃 License

MIT

