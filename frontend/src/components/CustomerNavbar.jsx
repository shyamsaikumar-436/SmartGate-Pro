import { useNavigate } from "react-router-dom";
import { FaShieldAlt, FaSignOutAlt, FaUser, FaQrcode, FaTicketAlt, FaChartPie, FaUserCog } from "react-icons/fa";
import "../styles/CustomerNavbar.css";

function CustomerNavbar({ activeTab, setActiveTab }) {
  const navigate = useNavigate();

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
    navigate("/visitor/login");
  };

  return (
    <header className="customer-navbar">
      <div className="cn-container">
        {/* Brand */}
        <div className="cn-brand" onClick={() => setActiveTab("dashboard")}>
          <div className="cn-logo">
            <FaShieldAlt />
          </div>
          <div>
            <h2 className="cn-title">SmartGate</h2>
            <span className="cn-badge">Visitor Portal</span>
          </div>
        </div>

        {/* Navigation links */}
        <div className="cn-nav">
          <button
            className={`cn-tab ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >
            <FaChartPie /> Dashboard
          </button>
          <button
            className={`cn-tab ${activeTab === "create" ? "active" : ""}`}
            onClick={() => setActiveTab("create")}
          >
            <FaQrcode /> Create Visit Request
          </button>
          <button
            className={`cn-tab ${activeTab === "history" ? "active" : ""}`}
            onClick={() => setActiveTab("history")}
          >
            <FaTicketAlt /> Visit History
          </button>
          <button
            className={`cn-tab ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            <FaUserCog /> Profile
          </button>
        </div>

        {/* User Profile & Logout */}
        <div className="cn-user">
          <div className="cn-avatar">
            {(user.full_name || "V").charAt(0).toUpperCase()}
          </div>
          <div className="cn-meta">
            <span className="cn-name">{user.full_name || "Visitor"}</span>
            <span className="cn-email">{user.email || ""}</span>
          </div>
          <button className="cn-logout-btn" onClick={logout} title="Sign Out">
            <FaSignOutAlt />
          </button>
        </div>
      </div>
    </header>
  );
}

export default CustomerNavbar;
