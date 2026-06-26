# 🏢 SmartGate - QR Based Visitor Management System

SmartGate is a full-stack Visitor Management System that simplifies visitor registration and entry using QR codes. It allows administrators to register visitors, generate unique QR codes, monitor visitor status, and manage entry and exit through a secure web application.

---

## 📌 Features

### 👨‍💼 Admin Authentication

* Secure Admin Login
* Password Encryption using bcrypt
* JWT Authentication

### 👥 Visitor Management

* Add New Visitors
* Store Visitor Details in MySQL
* View Visitor History
* Search Visitor by QR Token

### 📱 QR Code System

* Generate Unique QR Code for Every Visitor
* Store QR Code in Database
* Scan QR Token
* Confirm Visitor Entry
* Confirm Visitor Exit

### 📊 Dashboard

* Total Visitors
* Visitors Currently Inside
* Dynamic Dashboard Statistics

### 🗄 Database

* MySQL Database
* Users Table
* Visitors Table

---

## 🛠 Tech Stack

### Frontend

* React.js
* Vite
* Axios
* React Router
* CSS

### Backend

* Node.js
* Express.js
* JWT Authentication
* bcrypt
* QRCode
* MySQL2

### Database

* MySQL

---

## 📂 Project Structure

```
SmartGate
│
├── backend
│   ├── config
│   ├── controllers
│   ├── routes
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── pages
│   │   ├── services
│   │   ├── styles
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── database.sql
└── README.md
```

---

## ⚙ Installation

### 1. Clone Repository

```bash
git clone https://github.com/shyamsaikumar-436/SmartGate.git
```

### 2. Open Project

```bash
cd SmartGate
```

### 3. Backend Setup

```bash
cd backend
npm install
npm run dev
```

### 4. Frontend Setup

Open another terminal.

```bash
cd frontend
npm install
npm run dev
```

---

## 🗄 Database Setup

1. Install MySQL Server.
2. Open MySQL Workbench.
3. Execute the `database.sql` file.
4. Create a `.env` file inside the `backend` folder.
5. Copy the contents of `.env.example` into `.env`.
6. Update your MySQL username, password, and JWT secret.

---

## 🔐 Environment Variables

```
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=smartgate

JWT_SECRET=your_secret_key
```

---

## 🚀 API Endpoints

### Authentication

| Method | Endpoint             | Description    |
| ------ | -------------------- | -------------- |
| POST   | `/api/auth/register` | Register Admin |
| POST   | `/api/auth/login`    | Admin Login    |

### Visitors

| Method | Endpoint                     | Description          |
| ------ | ---------------------------- | -------------------- |
| POST   | `/api/visitors/add`          | Add Visitor          |
| GET    | `/api/visitors/all`          | Visitor History      |
| GET    | `/api/visitors/dashboard`    | Dashboard Statistics |
| GET    | `/api/visitors/scan/:token`  | Scan QR              |
| PUT    | `/api/visitors/entry/:token` | Confirm Entry        |
| PUT    | `/api/visitors/exit/:token`  | Confirm Exit         |

---

## 📸 Screenshots

Screenshots will be added after the UI polishing phase.

---

## 🔮 Future Improvements

* Camera-based QR Scanner
* Visitor Pass Printing
* Download QR Code
* Search and Filter Visitors
* Dashboard Charts
* Responsive Design
* Email Notifications

---

## 👨‍💻 Developer

**Shyam Sai Kumar**

B.Tech - Computer Science and Engineering (AI & ML)

SRM University AP

---

## 📄 License

This project is developed for educational and portfolio purposes.
