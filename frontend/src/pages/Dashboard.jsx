import { useEffect, useState } from "react";
import { FaUsers, FaUserCheck, FaUserTimes, FaCalendarDay, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import "../styles/Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [stats, setStats] = useState({
    totalVisitors: 0,
    insideVisitors: 0,
    exitedVisitors: 0,
    todayVisitors: 0,
  });

  const [now, setNow] = useState(new Date());

  useEffect(() => {
    fetchDashboardStats();
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const res = await API.get("/visitors/dashboard");
      setStats((prev) => ({
        ...prev,
        ...res.data,
      }));
    } catch (err) {
      console.log(err);
    }
  };

  const formatTime = (d) =>
    d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  const formatDate = (d) =>
    d.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  const cards = [
    {
      label: "Total Visitors",
      value: stats.totalVisitors,
      icon: <FaUsers />,
      color: "blue",
      desc: "All time registered",
    },
    {
      label: "Inside Now",
      value: stats.insideVisitors,
      icon: <FaUserCheck />,
      color: "green",
      desc: "Currently on premises",
    },
    {
      label: "Exited Today",
      value: stats.exitedVisitors ?? 0,
      icon: <FaUserTimes />,
      color: "purple",
      desc: "Completed visits",
    },
    {
      label: "Today's Visitors",
      value: stats.todayVisitors ?? 0,
      icon: <FaCalendarDay />,
      color: "orange",
      desc: "Registered today",
    },
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        {/* Top Bar */}
        <div className="dash-topbar">
          <div>
            <h1 className="dash-title">Dashboard</h1>
            <p className="dash-sub">Welcome back, <strong>{user?.full_name || "Admin"}</strong> 👋</p>
          </div>
          <div className="dash-clock">
            <p className="clock-time">{formatTime(now)}</p>
            <p className="clock-date">{formatDate(now)}</p>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="stat-cards">
          {cards.map((card, i) => (
            <div className={`stat-card stat-card--${card.color}`} key={i}>
              <div className={`stat-icon stat-icon--${card.color}`}>
                {card.icon}
              </div>
              <div className="stat-body">
                <p className="stat-label">{card.label}</p>
                <h2 className="stat-value">{card.value}</h2>
                <p className="stat-desc">{card.desc}</p>
              </div>
              <div className="stat-glow" />
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h3 className="section-title">Quick Actions</h3>
          <div className="action-grid">
            <button className="action-card action-card--blue" onClick={() => navigate("/addvisitor")}>
              <FaUsers className="action-icon" />
              <div>
                <p className="action-title">Register Visitor</p>
                <p className="action-sub">Add new visitor & generate QR</p>
              </div>
              <FaArrowRight className="action-arrow" />
            </button>
            <button className="action-card action-card--green" onClick={() => navigate("/scan")}>
              <span className="action-icon" style={{ fontSize: 22 }}>📷</span>
              <div>
                <p className="action-title">Scan QR Code</p>
                <p className="action-sub">Verify & record visitor entry/exit</p>
              </div>
              <FaArrowRight className="action-arrow" />
            </button>
            <button className="action-card action-card--purple" onClick={() => navigate("/visitors")}>
              <span className="action-icon" style={{ fontSize: 22 }}>📋</span>
              <div>
                <p className="action-title">View History</p>
                <p className="action-sub">Browse all visitor records</p>
              </div>
              <FaArrowRight className="action-arrow" />
            </button>
          </div>
        </div>

        {/* System Info */}
        <div className="system-banner">
          <div className="system-banner-text">
            <h3>SmartGate Pro — QR Visitor Management System</h3>
            <p>
              Digitally manage visitor registration, QR-based gate verification, and real-time
              entry/exit tracking — all secured and stored in your MySQL database.
            </p>
          </div>
          <div className="system-status">
            <span className="status-dot" />
            System Online
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;