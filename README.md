# 🚀 SmartGate-Pro

A **QR-Based Visitor Management System** developed using **React, Node.js, Express, and MySQL**. SmartGate-Pro enables secure visitor registration, QR code generation, visitor pass printing, live QR scanning using a laptop camera, and real-time entry/exit tracking.

---

## 📌 Features

- 🔐 Admin Login Authentication (JWT)
- 👤 Add New Visitor
- 📄 Generate QR-Based Visitor Pass
- 🖨️ Print Visitor Pass
- 📷 Live Laptop Camera QR Scanner
- ✅ Confirm Visitor Entry
- 🚪 Confirm Visitor Exit
- 📋 Visitor History
- 🔍 Search Visitors
- 📊 Dashboard with Visitor Statistics
- 💾 MySQL Database Integration

---

## 🛠️ Tech Stack

### Frontend
- React.js
- React Router
- Axios
- HTML5
- CSS3

### Backend
- Node.js
- Express.js
- JWT Authentication
- QRCode Library
- html5-qrcode

### Database
- MySQL

---

## 📂 Project Structure

```
SmartGate-Pro
│
├── frontend
│   ├── src
│   │   ├── pages
│   │   ├── styles
│   │   ├── services
│   │   └── App.jsx
│   └── package.json
│
├── backend
│   ├── config
│   ├── controllers
│   ├── routes
│   ├── middleware
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## 🔄 Workflow

```
Admin Login
      │
      ▼
Add Visitor
      │
      ▼
Generate QR Code
      │
      ▼
Save Visitor in MySQL
      │
      ▼
Print Visitor Pass
      │
      ▼
Visitor Arrives
      │
      ▼
Security Scans QR
      │
      ▼
Display Visitor Details
      │
      ▼
Confirm Entry
      │
      ▼
Visitor Leaves
      │
      ▼
Scan QR Again
      │
      ▼
Confirm Exit
```

---

## 📷 Application Modules

- Login
- Dashboard
- Add Visitor
- Visitor History
- Visitor Pass
- QR Scanner

---

## 🚀 Installation

### Clone Repository

```bash
git clone https://github.com/shyamsaikumar-436/SmartGate-Pro.git
```

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🗄️ Database Configuration

Create a MySQL database named:

```
smartgate
```

Update your `.env` file:

```env
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_PASSWORD
DB_NAME=smartgate

JWT_SECRET=your_secret_key
```

Import the required SQL tables before running the project.

---

## 🎯 Future Enhancements

- Email QR Pass to Visitors
- Role-Based Authentication (Admin & Security)
- Visitor Photo Capture
- Appointment Scheduling
- Analytics Dashboard
- Visitor Reports (PDF/Excel)

---

## 👨‍💻 Developer

**P. Shyam Sai Kumar**

B.Tech – Computer Science and Engineering (AI & ML)

SRM University – AP

---

## ⭐ If you like this project

Please consider giving this repository a **Star ⭐**.