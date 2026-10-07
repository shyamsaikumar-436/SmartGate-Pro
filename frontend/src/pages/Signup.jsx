import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import API from "../services/api";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaShieldAlt, FaCheckCircle } from "react-icons/fa";
import "../styles/Login.css";

function Signup() {
  const navigate = useNavigate();
  const location = useLocation();

  const initialRole = location.pathname.includes("admin") ? "admin" : "customer";
  const [role, setRole]         = useState(initialRole);
  const [full_name, setFullName] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState("");

  useEffect(() => {
    if (location.pathname.includes("admin")) {
      setRole("admin");
    } else if (location.pathname.includes("customer")) {
      setRole("customer");
    }
  }, [location.pathname]);

  const registerUser = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await API.post("/auth/register", { full_name, email, password, role });
      setSuccess(`Account created as ${role === "admin" ? "Administrator" : "Customer"}! Redirecting to login...`);
      setTimeout(() => {
        navigate(role === "admin" ? "/login/admin" : "/login/customer");
      }, 1800);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const features = role === "admin" ? [
    "Manage premise gate security & staff",
    "Real-time entry & exit confirmation",
    "Live camera QR code validation",
    "Comprehensive visitor analytics",
  ] : [
    "Register your own visits directly online",
    "Generate QR pass without admin delay",
    "Print or download pass to show at gate",
    "Access visit history & pass details",
  ];

  return (
    <div className="login-page">
      {/* Animated Background */}
      <div className="login-bg">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="grid-overlay" />
      </div>

      {/* Left Panel */}
      <div className="login-left">
        <div className="brand-panel">
          <div className="brand-icon">
            <FaShieldAlt />
          </div>
          <h1 className="brand-name">SmartGate</h1>
          <p className="brand-sub">
            {role === "admin" ? "Admin Registration Portal" : "Customer Self-Service Signup"}
          </p>
          <p className="brand-desc">
            {role === "admin"
              ? "Create an administrator account to oversee gate entry, monitor visitor logs, and confirm visits."
              : "Create a customer account to enter your visit details, generate instant QR passes, and print them before arriving."}
          </p>
          <ul className="feature-list">
            {features.map((f, i) => (
              <li key={i}>
                <FaCheckCircle className="check-icon" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right Panel */}
      <div className="login-right">
        <form className="login-box" onSubmit={registerUser}>
          {/* Role Switcher Tabs */}
          <div className="role-switcher-tabs" style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "8px",
            background: "rgba(255,255,255,0.04)",
            padding: "6px",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-subtle)",
            marginBottom: "24px"
          }}>
            <button
              type="button"
              className={`role-tab ${role === "customer" ? "active" : ""}`}
              onClick={() => setRole("customer")}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "10px",
                borderRadius: "var(--radius-sm)",
                border: "none",
                background: role === "customer" ? "var(--gradient-brand)" : "transparent",
                color: role === "customer" ? "#fff" : "var(--text-secondary)",
                fontWeight: "600",
                fontSize: "14px",
                cursor: "pointer",
                transition: "var(--transition)"
              }}
            >
              <FaUser /> Customer Account
            </button>
            <button
              type="button"
              className={`role-tab ${role === "admin" ? "active" : ""}`}
              onClick={() => setRole("admin")}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "10px",
                borderRadius: "var(--radius-sm)",
                border: "none",
                background: role === "admin" ? "var(--gradient-brand)" : "transparent",
                color: role === "admin" ? "#fff" : "var(--text-secondary)",
                fontWeight: "600",
                fontSize: "14px",
                cursor: "pointer",
                transition: "var(--transition)"
              }}
            >
              <FaShieldAlt /> Admin Account
            </button>
          </div>

          <div className="login-box-header">
            <h2>{role === "admin" ? "Create Admin Account 🛡️" : "Register as Customer 👤"}</h2>
            <p>
              {role === "admin"
                ? "Sign up for administrative & gate access"
                : "Sign up to generate and print your own visitor QR passes"}
            </p>
          </div>

          {error && (
            <div className="error-banner">
              <span>⚠️ {error}</span>
            </div>
          )}
          
          {success && (
            <div className="error-banner" style={{ background: 'rgba(16,185,129,0.1)', borderColor: 'rgba(16,185,129,0.3)', color: 'var(--success)' }}>
              <span>✅ {success}</span>
            </div>
          )}

          <div className="input-group">
            <label>Full Name</label>
            <div className="input-wrap">
              <FaUser className="input-icon" />
              <input
                type="text"
                placeholder="John Doe"
                value={full_name}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Email Address</label>
            <div className="input-wrap">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                placeholder={role === "admin" ? "admin@smartgate.com" : "customer@example.com"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="input-wrap">
              <FaLock className="input-icon" />
              <input
                type={showPass ? "text" : "password"}
                placeholder="Choose a secure password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? (
              <span className="spinner" />
            ) : (
              role === "admin" ? "Create Admin Account" : "Register Customer Account"
            )}
          </button>

          <p className="login-footer-text" style={{ marginTop: '20px' }}>
            Already have an account?{" "}
            <Link to={role === "admin" ? "/login/admin" : "/login/customer"} style={{ color: "var(--primary)", textDecoration: "none", fontWeight: "600" }}>
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;
