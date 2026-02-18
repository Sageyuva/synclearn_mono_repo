# SyncLearn: Offline-First Hybrid Learning Platform

**SyncLearn** is a robust MERN-stack educational platform designed to bridge the gap between high-tech learning and low-connectivity environments. By prioritizing an offline-first architecture, it ensures that students and teachers in remote areas can access quality education tools, gamified missions, and collaborative learning rooms without requiring a constant internet connection.

---

## 🚀 Key Features (In Development)

- **Offline-First Sync Engine**: Utilizing IndexedDB (client-side) and MongoDB (server-side) with a background synchronization layer.
- **Role-Based Access Control (RBAC)**: Distinct permission tiers for Admins, Teachers, and Students.
- **Gamified Learning**: Mission-based curriculum with XP, levels, and "Knowledge Duels."
- **Localized Learning Rooms**: Peer-to-peer interaction and competition over local school networks (LAN).
- **Uniform API Structure**: Centralized success/error handling and automated async error catching.

---

## 🛠 Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens) & BcryptJS
- **Client (Planned)**: React (PWA) & React Native (Expo)

---

## 🏗 Project Architecture

The backend follows a strict **Controller-Service-Model** pattern to ensure scalability and ease of testing.

### Centralized Logic Patterns
- **Async Handler**: A higher-order function wrapper for controllers to eliminate try-catch boilerplate.
- **Global Error Middleware**: A unified interceptor that catches all errors and formats them into a standard JSON structure.
- **Response Wrapper**: Ensures every API response follows the `{ success: boolean, message: string, data: object }` format.

### 📂 Folder Structure

```plaintext
SyncLearn-Backend/
├── controllers/      # Business logic (wrapped in asyncHandler)
├── middleware/       # Auth, isAdmin, and Global Error Handler
├── models/           # Mongoose Schemas (User, Quest, School)
├── routes/           # Express Route definitions
├── utils/            # Password hashing, response formatters, async handler
├── config/           # Database and Environment configurations
└── server.js         # Entry point
```

---

## 🔐 API Documentation (Initial)

### Authentication

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/login` | Public | Returns JWT and User Profile |
| **POST** | `/api/auth/register` | Public | Standard registration (Default: Student) |

### Admin Services

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/admin/add-teacher` | Admin | Create a new teacher account |
| **PUT** | `/api/admin/update-role` | Admin | Promote/Demote user roles |

---

## 🛠 Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/your-username/synclearn-backend.git
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
```

### 4. Run Development Server
```bash
npm run dev
```