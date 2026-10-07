import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import { FaUserCheck, FaClock, FaEye, FaSync, FaSignOutAlt } from "react-icons/fa";
import "../styles/Visitors.css";

function CurrentlyInside() {
  const navigate = useNavigate();
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    loadInsideVisitors();
    const interval = setInterval(loadInsideVisitors, 10000); // Auto-refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const loadInsideVisitors = async () => {
    setLoading(true);
    try {
      const res = await API.get("/visitors/inside");
      setVisitors(res.data);
    } catch (err) {
      console.log("Failed to load inside visitors", err);
    } finally {
      setLoading(false);
    }
  };

  const handleExit = async (identifier) => {
    if (!window.confirm("Confirm exit for this visitor?")) return;
    setActionLoading(identifier);
    try {
      await API.put(`/visitors/exit/${identifier}`);
      loadInsideVisitors();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to confirm exit");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="vh-layout">
      <Sidebar />

      <main className="vh-main">
        {/* Header */}
        <div className="vh-header">
          <div>
            <h1 className="vh-title">Currently Inside Building 🏢</h1>
            <p className="vh-sub">Real-time gate security monitor for visitors currently on premises</p>
          </div>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <span className="pill pill--green" style={{ fontSize: "14px", padding: "8px 16px" }}>
              <FaUserCheck /> {visitors.length} Active Visitors Inside
            </span>
            <button
              onClick={loadInsideVisitors}
              className="view-btn"
              style={{ background: "rgba(59,130,246,0.15)", color: "var(--primary)", borderColor: "var(--border)" }}
            >
              <FaSync /> Refresh List
            </button>
          </div>
        </div>

        {/* List Card */}
        <div className="vh-table-card">
          {loading && visitors.length === 0 ? (
            <div className="vh-loading">
              <div className="vh-spinner" />
              <p>Scanning gate status...</p>
            </div>
          ) : visitors.length === 0 ? (
            <div className="vh-empty" style={{ padding: "60px 20px" }}>
              <div className="vh-empty-icon" style={{ fontSize: "48px" }}>🏢</div>
              <h3>No Visitors Currently Inside</h3>
              <p>All checked-in visitors have exited the premises.</p>
            </div>
          ) : (
            <div className="vh-table-wrap">
              <table className="vh-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Visitor Name</th>
                    <th>Phone</th>
                    <th>Person to Meet</th>
                    <th>Purpose</th>
                    <th>Gate Entry Timestamp</th>
                    <th>Pass ID</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {visitors.map((v, i) => (
                    <tr key={v.id} className="vh-row">
                      <td className="vh-id">{i + 1}</td>
                      <td className="vh-name">
                        <div className="visitor-cell">
                          <div className="visitor-avatar" style={{ background: "var(--gradient-green)" }}>
                            {(v.visitor_name || "V").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span style={{ fontWeight: 700 }}>{v.visitor_name}</span>
                            <br />
                            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{v.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="vh-phone">{v.phone || "N/A"}</td>
                      <td className="vh-host">{v.host_name}</td>
                      <td className="vh-purpose">
                        <span className="purpose-chip">{v.purpose}</span>
                      </td>
                      <td className="vh-date" style={{ color: "var(--success)", fontWeight: 600 }}>
                        <FaClock style={{ fontSize: 12, marginRight: 4 }} />
                        {v.entry_time ? new Date(v.entry_time).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : "Recently"}
                      </td>
                      <td style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 700 }}>
                        Pass #{String(v.id).padStart(6, "0")}
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "6px" }}>
                          <button
                            className="view-btn"
                            style={{ background: "rgba(239,68,68,0.15)", color: "#ef4444", borderColor: "rgba(239,68,68,0.3)" }}
                            onClick={() => handleExit(v.qr_token || v.id)}
                            disabled={actionLoading === (v.qr_token || v.id)}
                            title="Confirm Visitor Exit"
                          >
                            <FaSignOutAlt /> {actionLoading === (v.qr_token || v.id) ? "Exiting..." : "Mark Exit"}
                          </button>
                          <button
                            className="view-btn"
                            onClick={() => navigate(`/visitor-pass/${v.id}`)}
                          >
                            <FaEye /> View Pass
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default CurrentlyInside;
