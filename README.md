# 🏠 Hostel Room Allocation System
### MERN Stack Mini Project — MSc IT Academic Submission

---

## 📁 Project Structure
```
hostel-system/
├── hostel-backend/    ← Node.js + Express + MongoDB API
└── hostel-frontend/   ← React.js UI
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js v16+
- MongoDB (local) OR MongoDB Atlas (cloud)

---

### Step 1 — Start MongoDB
```bash
# If using local MongoDB:
mongod
```

### Step 2 — Setup & Run Backend
```bash
cd hostel-backend
npm install
node seed.js        # Creates admin, warden & sample rooms
npm run dev         # Starts on http://localhost:5000
```

### Step 3 — Setup & Run Frontend
```bash
cd hostel-frontend
npm install
npm start           # Opens on http://localhost:3000
```

---

## 🔑 Demo Login Credentials
| Role    | Email                  | Password   |
|---------|------------------------|------------|
| Admin   | admin@hostel.com       | admin123   |
| Warden  | warden@hostel.com      | warden123  |
| Student | Register via /register | (your own) |

---

## ✅ Features
- **Student**: Register, apply for room, view status, cancel requests
- **Warden**: Approve/reject requests, allocate rooms, manage occupancy
- **Admin**: Manage students/wardens/rooms, view reports

## 🛠 Tech Stack
- **Frontend**: React 18, React Router v6, Axios, Bootstrap 5
- **Backend**: Node.js, Express.js, JWT Auth, bcryptjs
- **Database**: MongoDB with Mongoose ODM
