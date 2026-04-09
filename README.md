# Church Team App

A web-based church team management system for organizing members, announcements, and attendance responses.

**Live:** https://church-team-app.vercel.app

---

## Features

### Role-based Access (3 Roles)

| Role | Permissions |
|------|-------------|
| **Admin** | Approve/reject signups, manage users, create teams and assign leaders |
| **Leader** | View team members, send announcements, check attendance results |
| **Member** | Receive announcements, respond with YES/NO |

### Auth Flow
1. User signs up → Admin must approve before login is allowed
2. After login, user is automatically redirected to their role-specific dashboard

---

## Tech Stack

- **Frontend**: Next.js 15 (App Router)
- **Auth / DB**: Firebase Authentication + Firestore
- **Deployment**: Vercel

---

## Local Development

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Copy `.env.example` to `.env.local` and fill in your Firebase project values.

```bash
cp .env.example .env.local
```

`.env.local`:
```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
src/
├── app/
│   ├── login/         # Login page
│   ├── signup/        # Signup page
│   ├── admin/         # Admin pages (dashboard, users, teams, requests)
│   ├── leader/        # Leader pages (dashboard, announcements, results)
│   └── member/        # Member pages (home)
├── components/
│   ├── ProtectedRoute.js   # Role-based route protection
│   ├── AdminSidebar.js
│   ├── LeaderSidebar.js
│   └── MemberSidebar.js
└── lib/
    ├── firebase.js    # Firebase initialization
    └── auth.js
```
