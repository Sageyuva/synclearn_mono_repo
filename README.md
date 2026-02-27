# SyncLearn — Offline-First Hybrid Learning Platform

**SyncLearn** is a full-stack MERN educational platform with role-based access control for Admins, Teachers, and Students. It features a Mission-based curriculum system with quizzes, global announcements, and a clean API architecture across two frontend apps.

---

## 🏗 Monorepo Structure

```
synclearn_mono_repo/
├── Server/          # Express + MongoDB backend (API server)
├── client/          # React + Vite — Student Portal
└── website/         # React + Vite — Teacher & Admin Portal
```

---

## 🚀 Features

### ✅ Implemented
- **Role-Based Auth** — Separate login for Students, Teachers, and Admins with JWT + Bcrypt
- **Modular API Layer** — Axios instance with Bearer token interceptor and global 401 handling
- **Universal Toasts** — `react-hot-toast` with glassmorphism styling across both apps
- **Mission System** — Teachers deploy lessons; students view them in an Iron Man HUD
- **Quiz Engine** — 5-question MCQ quizzes; `correctAns` hidden from students server-side; score auto-calculated and added to `Student.totalScore`
- **Global Announcements** — Admin broadcasts visible to all roles
- **Public/Private Routes** — Token-gated routing in both frontend apps
- **Centralized Error Handling** — `asyncHandler` + global error middleware on the server

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + BcryptJS |
| Frontend | React 18, Vite, React Router v6 |
| HTTP Client | Axios (with interceptors) |
| Notifications | react-hot-toast |

---

## 📡 API Reference (`BASE_URL = /api/v1/`)

### Auth
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/v1/student/login` | Public |
| POST | `/api/v1/teacher/login` | Public |
| POST | `/api/v1/admin/login` | Public |
| POST | `/api/v1/admin/register` | Public |

### User Management (Admin)
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/v1/admin/add-teacher` | Admin |
| POST | `/api/v1/admin/add-student` | Admin |
| POST | `/api/v1/teacher/add-student` | Teacher |

### Lessons
| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/v1/lesson` | All roles |
| GET | `/api/v1/lesson/:id` | All roles |
| POST | `/api/v1/lesson` | Teacher, Admin |
| PUT | `/api/v1/lesson/:id` | Teacher (own), Admin |
| DELETE | `/api/v1/lesson/:id` | Teacher (own), Admin |

### Quizzes
| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/v1/quiz/lesson/:lessonId` | All roles |
| POST | `/api/v1/quiz` | Teacher, Admin |
| POST | `/api/v1/quiz/:id/submit` | Student |
| DELETE | `/api/v1/quiz/:id` | Teacher (own), Admin |

### Announcements
| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/v1/announcement` | All roles |
| POST | `/api/v1/announcement` | Admin |
| DELETE | `/api/v1/announcement/:id` | Admin |

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js ≥ 18
- MongoDB running locally or a MongoDB Atlas URI

### 1. Clone
```bash
git clone https://github.com/Sageyuva/synclearn_mono_repo.git
cd synclearn_mono_repo
```

### 2. Server
```bash
cd Server
npm install
```
Create `Server/.env`:
```env
PORT=5000
MONGO_URL=mongodb://localhost:27017/synclearn
JWT_SECRET=your_super_secret_key
BASE_URL=/api/v1/
```
```bash
npx nodemon server.js
```

### 3. Client (Student Portal — port 5173)
```bash
cd client
npm install
```
Create `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api/v1/
```
```bash
npm run dev
```

### 4. Website (Management Portal — port 5174)
```bash
cd website
npm install
```
Create `website/.env`:
```env
VITE_API_URL=http://localhost:5000/api/v1/
```
```bash
npm run dev
```

---

## 📂 Server Architecture

```
Server/src/
├── Config/          # DB connection
├── Models/          # AdminModel, TeacherModel, StudentModel
│                      LessonModel, QuizModel, QuizAttemptModel, AnnouncementModel
├── Services/        # Business logic (pure functions, serviceOk/serviceFail)
├── Controllers/     # HTTP handlers (thin layer over services)
├── Routes/          # Express routers with auth middleware
├── Middleware/      # authenticate, authorizeRoles, errorHandler
└── Utils/           # JwtUtils, passwordUtils, ResponseUtils, catchAsync
```

---

## 🎨 Frontend Architecture

Both apps follow an identical pattern:

```
src/
├── api/
│   ├── axiosClient.js      # Base Axios instance with interceptors
│   ├── authService.js      # Login/logout calls
│   └── missionService.js   # Lesson, Quiz, Announcement calls
├── constants/
│   └── apiEndpoints.js     # All API route strings (single source of truth)
├── utils/
│   └── toast.js            # showToast.success / .error / .alert wrappers
├── components/
│   ├── PublicRoute.jsx     # Redirects logged-in users away from /login
│   └── PrivateRoute.jsx    # Redirects unauthenticated to /login
└── pages/
    ├── LoginPage.jsx
    ├── HomePage.jsx
    ├── MissionsPage.jsx         # (client only) HUD grid + quiz modal
    ├── MissionControlPage.jsx   # (website only) lesson + quiz builder
    └── AnnouncementsPage.jsx    # (website only) admin broadcast tool
```

---

## 🔐 Security Notes

- JWT tokens expire in **1 hour**
- `correctAns` is **stripped server-side** before sending quiz data to students
- `localStorage.clear()` on 401 — automatic forced logout
- Teacher ownership enforced at **service layer** for lesson/quiz mutations