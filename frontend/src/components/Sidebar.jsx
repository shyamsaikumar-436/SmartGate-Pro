import { useNavigate, useLocation } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaHistory,
  FaQrcode,
  FaSignOutAlt,
  FaShieldAlt,
} from "react-icons/fa";
import "../styles/Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const navItems = [
    { icon: <FaHome />, label: "Dashboard", path: "/dashboard" },
    { icon: <FaUsers />, label: "Add Visitor", path: "/addvisitor" },
    { icon: <FaHistory />, label: "Visitor History", path: "/visitors" },
    { icon: <FaQrcode />, label: "Scan QR", path: "/scan" },
  ];

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">
          <FaShieldAlt />
        </div>
        <div className="logo-text">
          <h2>SmartGate</h2>
          <span>Pro</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.path}
            className={`nav-item ${location.pathname === item.path ? "active" : ""}`}
            onClick={() => navigate(item.path)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
            {location.pathname === item.path && <span className="nav-indicator" />}
          </button>
        ))}
      </nav>

      {/* User & Logout */}
      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">
            {(user?.full_name || "A").charAt(0).toUpperCase()}
          </div>
          <div className="user-meta">
            <p className="user-name">{user?.full_name || "Admin"}</p>
            <p className="user-role">Administrator</p>
          </div>
        </div>
        <button className="logout-btn" onClick={logout}>
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
