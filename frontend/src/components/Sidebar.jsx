import { useNavigate, useLocation } from "react-router-dom";
import {
  FaHome,
  FaUserPlus,
  FaHistory,
  FaQrcode,
  FaSignOutAlt,
  FaShieldAlt,
  FaBuilding
} from "react-icons/fa";
import "../styles/Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const getUser = () => {
    try {
      const stored = localStorage.getItem("user");
      if (stored && stored !== "undefined" && stored !== "null") {
        return JSON.parse(stored);
      }
    } catch (e) {}
    return {};
  };

  const user = getUser();

  const logout = () => {
    localStorage.clear();
    navigate("/admin/login");
  };

  const navItems = [
    { icon: <FaHome />, label: "Admin Dashboard", path: "/dashboard" },
    { icon: <FaBuilding />, label: "Currently Inside", path: "/admin/inside" },
    { icon: <FaHistory />, label: "Visitor History", path: "/visitors" },
    { icon: <FaUserPlus />, label: "Add Visitor", path: "/addvisitor" },
    { icon: <FaQrcode />, label: "Scan Gate QR", path: "/scan" },
  ];

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo" onClick={() => navigate("/dashboard")} style={{ cursor: "pointer" }}>
        <div className="logo-icon">
          <FaShieldAlt />
        </div>
        <div className="logo-text">
          <h2>SmartGate</h2>
          <span>Admin Portal</span>
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
            <p className="user-role">Gate Administrator</p>
          </div>
        </div>
        <button className="logout-btn" onClick={logout} title="Logout">
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
