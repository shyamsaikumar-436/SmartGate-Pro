import { useEffect, useState } from "react";
import {
  FaUsers,
  FaUserCheck,
  FaQrcode,
  FaSignOutAlt,
  FaHistory,
  FaHome
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "../styles/Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [stats, setStats] = useState({
    totalVisitors: 0,
    insideVisitors: 0,
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const res = await API.get("/visitors/dashboard");
      setStats(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="dashboard">

      <aside className="sidebar">

        <div className="logo">
          <h2>SmartGate</h2>
          <p>Visitor Management</p>
        </div>

        <button className="active">
          <FaHome />
          Dashboard
        </button>

        <button onClick={() => navigate("/addvisitor")}>
          <FaUsers />
          Add Visitor
        </button>

        <button onClick={() => navigate("/visitors")}>
          <FaHistory />
          Visitor History
        </button>

        <button onClick={() => navigate("/scan")}>
          <FaQrcode />
          Scan QR
        </button>

        <button className="logout" onClick={logout}>
          <FaSignOutAlt />
          Logout
        </button>

      </aside>

      <main className="main-content">

        <div className="topbar">

          <div>

            <h1>Dashboard</h1>

            <p>Welcome back, {user?.full_name || "Admin"} 👋</p>

          </div>

        </div>

        <div className="cards">

          <div className="card">

            <div className="icon blue">

              <FaUsers />

            </div>

            <div>

              <h4>Total Visitors</h4>

              <h2>{stats.totalVisitors}</h2>

            </div>

          </div>

          <div className="card">

            <div className="icon green">

              <FaUserCheck />

            </div>

            <div>

              <h4>Visitors Inside</h4>

              <h2>{stats.insideVisitors}</h2>

            </div>

          </div>

        </div>

        <div className="welcome-card">

          <h2>Welcome to SmartGate Pro</h2>

          <p>

            Manage visitor registrations, QR verification,
            and entry records from one place.

          </p>

        </div>

      </main>

    </div>
  );
}

export default Dashboard;