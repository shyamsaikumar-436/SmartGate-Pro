import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import { FaSearch, FaEye, FaUsers, FaUserCheck, FaHourglass } from "react-icons/fa";
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

  const filtered = visitors.filter((v) => {
    const matchSearch = v.visitor_name.toLowerCase().includes(search.toLowerCase()) ||
      v.host_name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || v.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const counts = {
    All:     visitors.length,
    Pending: visitors.filter((v) => v.status === "Pending").length,
    Entered: visitors.filter((v) => v.status === "Entered").length,
    Exited:  visitors.filter((v) => v.status === "Exited").length,
  };

  const statusFilters = ["All", "Pending", "Entered", "Exited"];

  return (
    <div className="vh-layout">
      <Sidebar />

      <main className="vh-main">
        {/* Header */}
        <div className="vh-header">
          <div>
            <h1 className="vh-title">Visitor History</h1>
            <p className="vh-sub">Browse and manage all visitor records</p>
          </div>
          <div className="vh-stats-pills">
            <span className="pill pill--total"><FaUsers /> {counts.All} Total</span>
            <span className="pill pill--green"><FaUserCheck /> {counts.Entered} Inside</span>
            <span className="pill pill--yellow"><FaHourglass /> {counts.Pending} Pending</span>
          </div>
        </div>

        {/* Toolbar */}
        <div className="vh-toolbar">
          <div className="vh-search-wrap">
            <FaSearch className="vh-search-icon" />
            <input
              type="text"
              placeholder="Search by visitor or host name..."
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
                <span className="filter-count">{counts[s]}</span>
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
              <h3>No visitors found</h3>
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
                    <th>Host</th>
                    <th>Purpose</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((v, i) => (
                    <tr key={v.id} className="vh-row">
                      <td className="vh-id">{i + 1}</td>
                      <td className="vh-name">
                        <div className="visitor-cell">
                          <div className="visitor-avatar">
                            {v.visitor_name.charAt(0).toUpperCase()}
                          </div>
                          <span>{v.visitor_name}</span>
                        </div>
                      </td>
                      <td className="vh-phone">{v.phone}</td>
                      <td className="vh-host">{v.host_name}</td>
                      <td className="vh-purpose">
                        <span className="purpose-chip">{v.purpose}</span>
                      </td>
                      <td className="vh-date">
                        {new Date(v.visit_date).toLocaleDateString("en-IN", {
                          day: "2-digit", month: "short", year: "numeric"
                        })}
                      </td>
                      <td>
                        <span className={`status-badge status-badge--${v.status.toLowerCase()}`}>
                          <span className="badge-dot" />
                          {v.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="view-btn"
                          onClick={() => navigate(`/visitor-pass/${v.id}`)}
                        >
                          <FaEye /> View Pass
                        </button>
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