import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import { FaSearch, FaEye, FaUsers, FaUserCheck, FaHourglass, FaCheck, FaTimes, FaSignOutAlt } from "react-icons/fa";
import "../styles/Visitors.css";

function Visitors() {
  const navigate = useNavigate();

  const [visitors, setVisitors]   = useState([]);
  const [search, setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    loadVisitors();
  }, []);

  const loadVisitors = async () => {
    setLoading(true);
    try {
      const res = await API.get("/visitors/all");
      setVisitors(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await API.put(`/visitors/approve/${id}`);
      loadVisitors();
    } catch (err) {
      alert("Failed to approve request");
    }
  };

  const handleReject = async (id) => {
    try {
      await API.put(`/visitors/reject/${id}`);
      loadVisitors();
    } catch (err) {
      alert("Failed to reject request");
    }
  };

  const handleExit = async (identifier) => {
    if (!window.confirm("Confirm exit for this visitor?")) return;
    try {
      await API.put(`/visitors/exit/${identifier}`);
      loadVisitors();
    } catch (err) {
      alert("Failed to confirm exit");
    }
  };

  const filtered = visitors.filter((v) => {
    const matchSearch = (v.visitor_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (v.host_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (v.phone || "").includes(search);
    const matchStatus = statusFilter === "All" || (v.status || "").toLowerCase() === statusFilter.toLowerCase();
    return matchSearch && matchStatus;
  });

  const counts = {
    All:       visitors.length,
    Pending:   visitors.filter((v) => v.status === "Pending").length,
    Approved:  visitors.filter((v) => v.status === "Approved").length,
    Entered:   visitors.filter((v) => v.status === "Entered").length,
    Completed: visitors.filter((v) => v.status === "Completed" || v.status === "Exited").length,
  };

  const statusFilters = ["All", "Pending", "Approved", "Entered", "Completed"];

  return (
    <div className="vh-layout">
      <Sidebar />

      <main className="vh-main">
        {/* Header */}
        <div className="vh-header">
          <div>
            <h1 className="vh-title">Visitor Management & Records</h1>
            <p className="vh-sub">Review visit requests, approve visits, monitor entry & exit logs</p>
          </div>
          <div className="vh-stats-pills">
            <span className="pill pill--total"><FaUsers /> {counts.All} Total</span>
            <span className="pill pill--green"><FaUserCheck /> {counts.Entered} Inside Now</span>
            <span className="pill pill--yellow"><FaHourglass /> {counts.Pending} Pending</span>
          </div>
        </div>

        {/* Toolbar */}
        <div className="vh-toolbar">
          <div className="vh-search-wrap">
            <FaSearch className="vh-search-icon" />
            <input
              type="text"
              placeholder="Search by visitor name, phone, or person to meet..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="vh-search"
            />
          </div>
          <div className="vh-filters">
            {statusFilters.map((s) => (
              <button
                key={s}
                className={`filter-btn ${statusFilter === s ? "filter-btn--active" : ""}`}
                onClick={() => setStatusFilter(s)}
              >
                {s}
                <span className="filter-count">{counts[s] ?? 0}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Table Card */}
        <div className="vh-table-card">
          {loading ? (
            <div className="vh-loading">
              <div className="vh-spinner" />
              <p>Loading visitor records...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="vh-empty">
              <div className="vh-empty-icon">👤</div>
              <h3>No visitor records found</h3>
              <p>Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <div className="vh-table-wrap">
              <table className="vh-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Visitor</th>
                    <th>Phone</th>
                    <th>Person to Meet</th>
                    <th>Purpose</th>
                    <th>Visit Date</th>
                    <th>Times</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((v, i) => (
                    <tr key={v.id} className="vh-row">
                      <td className="vh-id">{i + 1}</td>
                      <td className="vh-name">
                        <div className="visitor-cell">
                          <div className="visitor-avatar">
                            {(v.visitor_name || "V").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span style={{ fontWeight: 600 }}>{v.visitor_name}</span>
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
                      <td className="vh-date">
                        {new Date(v.visit_date).toLocaleDateString("en-IN", {
                          day: "2-digit", month: "short", year: "numeric"
                        })}
                      </td>
                      <td style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                        {v.arrival_time || "10:00 AM"} - {v.departure_time || "11:00 AM"}
                      </td>
                      <td>
                        <span className={`status-badge status-badge--${(v.status || 'approved').toLowerCase()}`}>
                          <span className="badge-dot" />
                          {v.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "6px" }}>
                          {v.status === "Pending" && (
                            <>
                              <button
                                className="view-btn"
                                style={{ background: "rgba(16,185,129,0.15)", color: "#10b981", borderColor: "rgba(16,185,129,0.3)" }}
                                onClick={() => handleApprove(v.id)}
                                title="Approve Visit Request"
                              >
                                <FaCheck /> Approve
                              </button>
                              <button
                                className="view-btn"
                                style={{ background: "rgba(239,68,68,0.15)", color: "#ef4444", borderColor: "rgba(239,68,68,0.3)" }}
                                onClick={() => handleReject(v.id)}
                                title="Reject Visit Request"
                              >
                                <FaTimes /> Reject
                              </button>
                            </>
                          )}
                          {v.status === "Entered" && (
                            <button
                              className="view-btn"
                              style={{ background: "rgba(239,68,68,0.15)", color: "#ef4444", borderColor: "rgba(239,68,68,0.3)" }}
                              onClick={() => handleExit(v.qr_token || v.id)}
                              title="Confirm Visitor Exit"
                            >
                              <FaSignOutAlt /> Mark Exit
                            </button>
                          )}
                          <button
                            className="view-btn"
                            onClick={() => navigate(`/visitor-pass/${v.id}`)}
                          >
                            <FaEye /> Pass
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

        <p className="vh-count-text">
          Showing <strong>{filtered.length}</strong> of <strong>{visitors.length}</strong> visitors
        </p>
      </main>
    </div>
  );
}

export default Visitors;