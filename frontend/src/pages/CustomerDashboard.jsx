import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import CustomerNavbar from "../components/CustomerNavbar";
import {
  FaUser, FaPhone, FaEnvelope, FaUserTie, FaBriefcase,
  FaCalendarAlt, FaQrcode, FaPrint, FaDownload, FaTicketAlt,
  FaCheckCircle, FaClock, FaIdCard, FaExclamationCircle, FaLock,
  FaChartPie, FaCalendarCheck, FaArrowRight, FaSignInAlt, FaUserEdit
} from "react-icons/fa";
import "../styles/CustomerDashboard.css";

function CustomerDashboard() {
  const navigate = useNavigate();

  const getUser = () => {
    try {
      const raw = localStorage.getItem("user");
      if (raw && raw !== "undefined" && raw !== "null") {
        return JSON.parse(raw);
      }
    } catch (e) {}
    return null;
  };

  const user = getUser();

  const [activeTab, setActiveTab] = useState("dashboard");

  // Form for Visit Request
  const [form, setForm] = useState({
    user_id: user?.id || null,
    visitor_name: user?.full_name || "",
    phone: user?.phone || "",
    email: user?.email || "",
    host_name: "",
    purpose: "",
    visit_date: new Date().toISOString().split("T")[0],
    arrival_time: "10:00 AM",
    departure_time: "11:00 AM",
  });

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    full_name: user?.full_name || "",
    phone: user?.phone || "",
    email: user?.email || "",
    password: "",
  });

  const [generatedPass, setGeneratedPass]   = useState(null);
  const [myPasses, setMyPasses]             = useState([]);
  const [loading, setLoading]               = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError]                   = useState("");
  const [profileMsg, setProfileMsg]         = useState("");

  useEffect(() => {
    if (user?.id) {
      fetchMyPasses();
    }
  }, [user?.id]);

  const fetchMyPasses = async () => {
    if (!user?.id && !user?.email) return;
    setHistoryLoading(true);
    try {
      const res = await API.get(`/visitors/user/${user?.id || 0}?email=${encodeURIComponent(user?.email || "")}`);
      setMyPasses(res.data);
    } catch (err) {
      console.error("Failed to load visitor passes", err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const handleCreateVisitRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        ...form,
        user_id: user?.id || null,
        visitor_name: form.visitor_name || user?.full_name || "Visitor",
        email: form.email || user?.email || "",
        status: "Approved", // Instant QR generation upon visit request
      };

      const res = await API.post("/visitors/add", payload);
      const newPassData = {
        id: res.data.visitorId,
        qrImage: res.data.qrImage,
        qrToken: res.data.qrToken,
        status: res.data.status || "Approved",
        ...payload,
      };
      setGeneratedPass(newPassData);
      fetchMyPasses();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit visit request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setProfileMsg("");

    try {
      await API.put("/auth/profile", {
        id: user?.id,
        full_name: profileForm.full_name,
        phone: profileForm.phone,
        password: profileForm.password || undefined,
      });

      const updatedUser = {
        ...user,
        full_name: profileForm.full_name,
        phone: profileForm.phone,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setProfileMsg("Profile updated successfully!");
    } catch (err) {
      setProfileMsg("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      user_id: user?.id || null,
      visitor_name: user?.full_name || "",
      phone: user?.phone || "",
      email: user?.email || "",
      host_name: "",
      purpose: "",
      visit_date: new Date().toISOString().split("T")[0],
      arrival_time: "10:00 AM",
      departure_time: "11:00 AM",
    });
    setGeneratedPass(null);
  };

  // If visitor is not logged in, show Guest Access notice with quick login button
  if (!user) {
    return (
      <div className="customer-page">
        <header className="customer-navbar">
          <div className="cn-container">
            <div className="cn-brand">
              <div className="cn-logo"><FaIdCard /></div>
              <div><h2 className="cn-title">SmartGate</h2><span className="cn-badge">Visitor Portal</span></div>
            </div>
            <button className="cn-tab active" onClick={() => navigate("/login")}>
              <FaSignInAlt /> Login / Sign Up
            </button>
          </div>
        </header>

        <div className="cd-main" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "70vh" }}>
          <div className="cd-card" style={{ maxWidth: 500, textAlign: "center", padding: 40 }}>
            <div className="cd-empty-icon" style={{ fontSize: 50, color: "var(--primary)" }}>
              <FaIdCard />
            </div>
            <h2 style={{ fontSize: 24, marginBottom: 12 }}>Visitor Portal Access</h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: 24, lineHeight: 1.6 }}>
              Please log in to your Visitor Account or create a new registration to generate, view, and print your QR visitor passes.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button className="cd-submit-btn" onClick={() => navigate("/login")}>
                <FaSignInAlt /> Log In to Portal
              </button>
              <button className="cd-reset-btn" onClick={() => navigate("/signup")}>
                Register Account
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Active or upcoming pass
  const activePass = myPasses.find(p => p.status === "Approved" || p.status === "Entered" || p.status === "Pending") || generatedPass;

  return (
    <div className="customer-page">
      <CustomerNavbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="cd-main">
        {/* Welcome Header */}
        <div className="cd-header">
          <div className="cd-header-text">
            <h1>Welcome back, {user?.full_name || "Visitor"} 👋</h1>
            <p>
              Manage your visit requests, view your digital QR passes, and print your entry pass before arriving at the location.
            </p>
          </div>
        </div>

        {/* Tab 1: Visitor Overview Dashboard */}
        {activeTab === "dashboard" && (
          <div>
            {/* Stat Cards */}
            <div className="cd-stats-grid" style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "20px",
              marginBottom: "32px"
            }}>
              <div className="cd-card" style={{ padding: "20px", display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ fontSize: "28px", color: "var(--primary)", background: "rgba(59,130,246,0.12)", padding: "12px", borderRadius: "12px" }}>
                  <FaTicketAlt />
                </div>
                <div>
                  <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>Total Visits</p>
                  <h3 style={{ fontSize: "24px", fontWeight: "800" }}>{myPasses.length}</h3>
                </div>
              </div>

              <div className="cd-card" style={{ padding: "20px", display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ fontSize: "28px", color: "var(--success)", background: "rgba(16,185,129,0.12)", padding: "12px", borderRadius: "12px" }}>
                  <FaCalendarCheck />
                </div>
                <div>
                  <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>Upcoming / Active Pass</p>
                  <h3 style={{ fontSize: "24px", fontWeight: "800" }}>
                    {myPasses.filter(p => p.status === "Approved" || p.status === "Pending").length}
                  </h3>
                </div>
              </div>

              <div className="cd-card" style={{ padding: "20px", display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ fontSize: "28px", color: "var(--accent)", background: "rgba(139,92,246,0.12)", padding: "12px", borderRadius: "12px" }}>
                  <FaClock />
                </div>
                <div>
                  <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>Completed Visits</p>
                  <h3 style={{ fontSize: "24px", fontWeight: "800" }}>
                    {myPasses.filter(p => p.status === "Completed" || p.status === "Exited").length}
                  </h3>
                </div>
              </div>
            </div>

            <div className="cd-grid">
              {/* Active QR Pass Display */}
              <div className="cd-card">
                <div className="cd-card-title">
                  <FaQrcode className="cd-icon" />
                  <div>
                    <h2>Active / Latest QR Visitor Pass</h2>
                    <p>Present this QR code to security at the entry gate</p>
                  </div>
                </div>

                {activePass ? (
                  <div className="cd-pass-box">
                    <div className="cd-success-banner">
                      <FaCheckCircle /> Status: <strong>{activePass.status || "Approved"}</strong>
                    </div>

                    <div className="cd-qr-wrapper">
                      <img src={activePass.qr_code || activePass.qrImage} alt="Pass QR Code" />
                      <span className="cd-pass-tag">Pass #{String(activePass.id).padStart(6, "0")}</span>
                    </div>

                    <div className="cd-pass-details">
                      <div className="cd-detail-row">
                        <span>Person to Meet:</span>
                        <strong>{activePass.host_name}</strong>
                      </div>
                      <div className="cd-detail-row">
                        <span>Purpose:</span>
                        <strong>{activePass.purpose}</strong>
                      </div>
                      <div className="cd-detail-row">
                        <span>Visit Date:</span>
                        <strong>{activePass.visit_date ? new Date(activePass.visit_date).toLocaleDateString("en-IN") : "Today"}</strong>
                      </div>
                      <div className="cd-detail-row">
                        <span>Expected Times:</span>
                        <strong>{activePass.arrival_time || "10:00 AM"} - {activePass.departure_time || "11:00 AM"}</strong>
                      </div>
                    </div>

                    <div className="cd-pass-actions">
                      <button
                        className="cd-act-btn cd-act-btn--primary"
                        onClick={() => navigate(`/visitor-pass/${activePass.id}`)}
                      >
                        <FaPrint /> View / Print Pass
                      </button>
                      <a
                        href={activePass.qr_code || activePass.qrImage}
                        download={`QR_Pass_${activePass.id}.png`}
                        className="cd-act-btn cd-act-btn--secondary"
                      >
                        <FaDownload /> Download QR
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="cd-empty-preview">
                    <div className="cd-empty-icon"><FaTicketAlt /></div>
                    <h3>No Active Pass Found</h3>
                    <p>Create a visit request to generate your instant QR visitor pass.</p>
                    <button
                      className="cd-submit-btn"
                      style={{ marginTop: 20, width: "auto", display: "inline-flex" }}
                      onClick={() => setActiveTab("create")}
                    >
                      <FaQrcode /> Request Visit & Get Pass
                    </button>
                  </div>
                )}
              </div>

              {/* Quick Actions & Guidelines */}
              <div className="cd-card" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div className="cd-card-title">
                  <FaChartPie className="cd-icon" />
                  <div>
                    <h2>Quick Actions</h2>
                    <p>Fast track your visitor tasks</p>
                  </div>
                </div>

                <button className="cd-act-btn cd-act-btn--primary" style={{ padding: "16px", justifyContent: "space-between" }} onClick={() => setActiveTab("create")}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <FaQrcode /> Create New Visit Request
                  </div>
                  <FaArrowRight />
                </button>

                <button className="cd-act-btn cd-act-btn--secondary" style={{ padding: "16px", justifyContent: "space-between" }} onClick={() => setActiveTab("history")}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <FaTicketAlt /> View Full Visit History
                  </div>
                  <FaArrowRight />
                </button>

                <button className="cd-act-btn cd-act-btn--secondary" style={{ padding: "16px", justifyContent: "space-between" }} onClick={() => setActiveTab("profile")}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <FaUserEdit /> Edit Visitor Profile
                  </div>
                  <FaArrowRight />
                </button>

                <div style={{ background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "12px", border: "1px solid var(--border-subtle)", marginTop: "10px" }}>
                  <h4 style={{ fontSize: "14px", color: "var(--primary)", marginBottom: "8px" }}>💡 Entry Instructions</h4>
                  <ul style={{ fontSize: "13px", color: "var(--text-muted)", paddingLeft: "18px", lineHeight: "1.6" }}>
                    <li>Print your pass or save the QR image to your phone.</li>
                    <li>Show your QR code to the gate security officer.</li>
                    <li>Security will scan the code to register your entry.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Create Visit Request */}
        {activeTab === "create" && (
          <div className="cd-grid">
            {/* Form Card */}
            <div className="cd-card cd-form-card">
              <div className="cd-card-title">
                <FaQrcode className="cd-icon" />
                <div>
                  <h2>Create Visit Request</h2>
                  <p>Provide details about your upcoming visit</p>
                </div>
              </div>

              {error && (
                <div className="cd-error">
                  <FaExclamationCircle /> {error}
                </div>
              )}

              <form onSubmit={handleCreateVisitRequest}>
                <div className="cd-form-grid">
                  <div className="cd-field">
                    <label>Visitor Name</label>
                    <div className="cd-input-wrap">
                      <FaUser className="input-icon" />
                      <input
                        type="text"
                        name="visitor_name"
                        value={form.visitor_name}
                        onChange={handleChange}
                        placeholder="Full Name"
                        required
                      />
                    </div>
                  </div>

                  <div className="cd-field">
                    <label>Email Address</label>
                    <div className="cd-input-wrap">
                      <FaEnvelope className="input-icon" />
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Email"
                        required
                      />
                    </div>
                  </div>

                  <div className="cd-field">
                    <label>Phone Number</label>
                    <div className="cd-input-wrap">
                      <FaPhone className="input-icon" />
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="Mobile Number"
                        required
                      />
                    </div>
                  </div>

                  <div className="cd-field">
                    <label>Person / Employee to Meet</label>
                    <div className="cd-input-wrap">
                      <FaUserTie className="input-icon" />
                      <input
                        type="text"
                        name="host_name"
                        value={form.host_name}
                        onChange={handleChange}
                        placeholder="e.g. John (Manager / HR)"
                        required
                      />
                    </div>
                  </div>

                  <div className="cd-field">
                    <label>Purpose of Visit</label>
                    <div className="cd-input-wrap">
                      <FaBriefcase className="input-icon" />
                      <input
                        type="text"
                        name="purpose"
                        value={form.purpose}
                        onChange={handleChange}
                        placeholder="e.g. Interview, Official Meeting"
                        required
                      />
                    </div>
                  </div>

                  <div className="cd-field">
                    <label>Visit Date</label>
                    <div className="cd-input-wrap">
                      <FaCalendarAlt className="input-icon" />
                      <input
                        type="date"
                        name="visit_date"
                        value={form.visit_date}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="cd-field">
                    <label>Expected Arrival Time</label>
                    <div className="cd-input-wrap">
                      <FaClock className="input-icon" />
                      <input
                        type="text"
                        name="arrival_time"
                        value={form.arrival_time}
                        onChange={handleChange}
                        placeholder="e.g. 10:00 AM"
                        required
                      />
                    </div>
                  </div>

                  <div className="cd-field">
                    <label>Expected Departure Time</label>
                    <div className="cd-input-wrap">
                      <FaClock className="input-icon" />
                      <input
                        type="text"
                        name="departure_time"
                        value={form.departure_time}
                        onChange={handleChange}
                        placeholder="e.g. 11:00 AM"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="cd-form-actions">
                  <button type="submit" className="cd-submit-btn" disabled={loading}>
                    {loading ? (
                      <span className="spinner" />
                    ) : (
                      <>
                        <FaQrcode /> Generate Unique QR Pass
                      </>
                    )}
                  </button>
                  {generatedPass && (
                    <button type="button" className="cd-reset-btn" onClick={resetForm}>
                      New Visit Request
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Generated Pass Result */}
            <div className="cd-card cd-preview-card">
              <div className="cd-card-title">
                <FaTicketAlt className="cd-icon" />
                <div>
                  <h2>Generated QR Pass</h2>
                  <p>Download or print your visitor pass</p>
                </div>
              </div>

              {generatedPass ? (
                <div className="cd-pass-box">
                  <div className="cd-success-banner">
                    <FaCheckCircle /> Pass Generated & Active!
                  </div>

                  <div className="cd-qr-wrapper">
                    <img src={generatedPass.qrImage} alt="Visitor QR Code" />
                    <span className="cd-pass-tag">Pass #{String(generatedPass.id).padStart(6, "0")}</span>
                  </div>

                  <div className="cd-pass-details">
                    <div className="cd-detail-row">
                      <span>Visitor:</span>
                      <strong>{generatedPass.visitor_name}</strong>
                    </div>
                    <div className="cd-detail-row">
                      <span>Person to Meet:</span>
                      <strong>{generatedPass.host_name}</strong>
                    </div>
                    <div className="cd-detail-row">
                      <span>Purpose:</span>
                      <strong>{generatedPass.purpose}</strong>
                    </div>
                    <div className="cd-detail-row">
                      <span>Date & Times:</span>
                      <strong>{generatedPass.visit_date} ({generatedPass.arrival_time} - {generatedPass.departure_time})</strong>
                    </div>
                  </div>

                  <div className="cd-pass-actions">
                    <button
                      className="cd-act-btn cd-act-btn--primary"
                      onClick={() => navigate(`/visitor-pass/${generatedPass.id}`)}
                    >
                      <FaPrint /> Print Pass
                    </button>
                    <a
                      href={generatedPass.qrImage}
                      download={`Visitor_Pass_${generatedPass.id}.png`}
                      className="cd-act-btn cd-act-btn--secondary"
                    >
                      <FaDownload /> Download QR
                    </a>
                  </div>
                </div>
              ) : (
                <div className="cd-empty-preview">
                  <div className="cd-empty-icon">
                    <FaIdCard />
                  </div>
                  <h3>Ready to Generate QR Pass</h3>
                  <p>
                    Fill in your visit details (Person to Meet, Purpose, Arrival & Departure times) and click{" "}
                    <strong>Generate Unique QR Pass</strong>.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Visit History */}
        {activeTab === "history" && (
          <div className="cd-history-section">
            <div className="cd-section-header">
              <h2>My Visit History & Passes</h2>
              <p>View past and upcoming visit details, status, and print passes</p>
            </div>

            {historyLoading ? (
              <div className="cd-loading">
                <div className="vp-spinner" />
                <p>Loading visit history...</p>
              </div>
            ) : myPasses.length === 0 ? (
              <div className="cd-empty-history">
                <FaTicketAlt className="empty-icon" />
                <h3>No Visit Requests Found</h3>
                <p>You haven't requested any visits yet.</p>
                <button
                  className="cd-submit-btn"
                  style={{ width: "auto", marginTop: "16px", padding: "12px 24px" }}
                  onClick={() => setActiveTab("create")}
                >
                  <FaQrcode /> Request Your First Visit
                </button>
              </div>
            ) : (
              <div className="cd-passes-grid">
                {myPasses.map((pass) => (
                  <div key={pass.id} className="cd-pass-card">
                    <div className="cd-card-top">
                      <span className="cd-pass-number">Pass #{String(pass.id).padStart(6, "0")}</span>
                      <span className={`cd-status-badge cd-status--${(pass.status || 'approved').toLowerCase()}`}>
                        {pass.status}
                      </span>
                    </div>

                    <div className="cd-card-body">
                      <div className="cd-card-qr">
                        <img src={pass.qr_code} alt="QR Code" />
                      </div>
                      <div className="cd-card-info">
                        <h4>{pass.visitor_name}</h4>
                        <p><strong>Person to Meet:</strong> {pass.host_name}</p>
                        <p><strong>Purpose:</strong> {pass.purpose}</p>
                        <p>
                          <FaClock style={{ fontSize: 12, marginRight: 4 }} />
                          {new Date(pass.visit_date).toLocaleDateString("en-IN", {
                            day: "2-digit", month: "short", year: "numeric"
                          })} ({pass.arrival_time || '10:00 AM'} - {pass.departure_time || '11:00 AM'})
                        </p>
                      </div>
                    </div>

                    <div className="cd-card-footer">
                      <button
                        className="cd-btn-sm cd-btn-print"
                        onClick={() => navigate(`/visitor-pass/${pass.id}`)}
                      >
                        <FaPrint /> Print Pass
                      </button>
                      <a
                        href={pass.qr_code}
                        download={`QR_Pass_${pass.id}.png`}
                        className="cd-btn-sm cd-btn-dl"
                      >
                        <FaDownload /> Download
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Profile */}
        {activeTab === "profile" && (
          <div className="cd-grid" style={{ gridTemplateColumns: "1fr" }}>
            <div className="cd-card" style={{ maxWidth: 640, margin: "0 auto", width: "100%" }}>
              <div className="cd-card-title">
                <FaUserEdit className="cd-icon" />
                <div>
                  <h2>Visitor Profile Settings</h2>
                  <p>Update your personal information & credentials</p>
                </div>
              </div>

              {profileMsg && (
                <div className="cd-success-banner" style={{ marginBottom: 20 }}>
                  <FaCheckCircle /> {profileMsg}
                </div>
              )}

              <form onSubmit={handleUpdateProfile}>
                <div className="cd-field" style={{ marginBottom: 20 }}>
                  <label>Full Name</label>
                  <div className="cd-input-wrap">
                    <FaUser className="input-icon" />
                    <input
                      type="text"
                      name="full_name"
                      value={profileForm.full_name}
                      onChange={handleProfileChange}
                      required
                    />
                  </div>
                </div>

                <div className="cd-field" style={{ marginBottom: 20 }}>
                  <label>Email Address</label>
                  <div className="cd-input-wrap">
                    <FaEnvelope className="input-icon" />
                    <input
                      type="email"
                      name="email"
                      value={profileForm.email}
                      disabled
                      style={{ opacity: 0.6, cursor: "not-allowed" }}
                    />
                  </div>
                </div>

                <div className="cd-field" style={{ marginBottom: 20 }}>
                  <label>Phone Number</label>
                  <div className="cd-input-wrap">
                    <FaPhone className="input-icon" />
                    <input
                      type="tel"
                      name="phone"
                      value={profileForm.phone}
                      onChange={handleProfileChange}
                      placeholder="Enter mobile number"
                    />
                  </div>
                </div>

                <div className="cd-field" style={{ marginBottom: 24 }}>
                  <label>New Password (Optional)</label>
                  <div className="cd-input-wrap">
                    <FaLock className="input-icon" />
                    <input
                      type="password"
                      name="password"
                      value={profileForm.password}
                      onChange={handleProfileChange}
                      placeholder="Leave blank to keep existing password"
                    />
                  </div>
                </div>

                <button type="submit" className="cd-submit-btn" disabled={loading}>
                  {loading ? <span className="spinner" /> : "Save Profile Changes"}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default CustomerDashboard;
