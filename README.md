# Pet Care Backend API

A Pet Care REST API built with **Node.js + Express + SQLite**.

---

## 📁 Project Structure

```
pet-care/
├── .vscode/                 # VS Code tasks, debug & settings
│   ├── launch.json          # F5 Debug configurations
│   ├── tasks.json           # VS Code Build & Task runner
│   └── settings.json        # Workspace settings
├── backend/                 # Express REST API & SQLite Database
│   ├── config/              # Database connection & schema init
│   ├── controllers/         # Controllers for Auth, Pets, Services, Bookings, etc.
│   ├── middleware/          # JWT Auth Middleware
│   ├── routes/              # Express API Routes
│   ├── petcare.db           # Persistent SQLite database
│   ├── server.js            # Node server entry point
│   └── package.json
├── package.json             # Root package scripts
└── README.md
```

---

## How to Run

Open a terminal in the root `pet-care` directory and run:
```bash
npm run dev
```
The backend API is available at `http://localhost:5000/api`.

---

## 🔑 Demo Login Credentials
- **Email**: `alex@petly.com`
- **Password**: `password123`
