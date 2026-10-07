import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import API from "../services/api";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaShieldAlt, FaCheckCircle, FaUser } from "react-icons/fa";
import "../styles/Login.css";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine initial role tab from URL path or default to customer
  const initialRole = location.pathname.includes("admin") ? "admin" : "customer";
  const [role, setRole]         = useState(initialRole);
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  useEffect(() => {
    if (location.pathname.includes("admin")) {
      setRole("admin");
    } else if (location.pathname.includes("customer")) {
      setRole("customer");
    }
  }, [location.pathname]);

  const loginUser = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await API.post("/auth/login", { email, password, portalRole: role });
      const user = res.data.user;

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(user));

      // Redirect strictly according to portal tab role
      if ((user.role === "admin" || user.role === "security") && role === "admin") {
        navigate("/dashboard");
      } else if (user.role === "customer" && role === "customer") {
        navigate("/customer/dashboard");
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setError(`Access Denied: Your account role (${user.role}) does not match the ${role.toUpperCase()} portal.`);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials. Please check your email & password.");
    } finally {
      setLoading(false);
    }
  };

  const features = role === "admin" ? [
    "Real-time entry & exit gate tracking",
    "Live laptop camera QR scanner",
    "Comprehensive visitor log history",
    "Role-based access & statistics",
  ] : [
    "Self-register your upcoming visit",
    "Instant QR Visitor Pass generation",
    "Download or print your pass anytime",
    "Show QR code at gate for seamless entry",
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
            {role === "admin" ? "Administrator & Security Portal" : "Customer & Visitor Self-Service Portal"}
          </p>
          <p className="brand-desc">
            {role === "admin"
              ? "Manage premise access, monitor live visitors, scan QR passes at entry/exit gates, and analyze visitor logs."
              : "Generate your QR visitor pass online, view active passes, print or download your pass to present at the gate upon arrival."}
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
        <form className="login-box" onSubmit={loginUser}>
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
              <FaUser /> Customer Portal
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
              <FaShieldAlt /> Admin Login
            </button>
          </div>

          <div className="login-box-header">
            <h2>{role === "admin" ? "Admin Sign In 🛡️" : "Customer Login 👋"}</h2>
            <p>
              {role === "admin"
                ? "Sign in with your administrative credentials"
                : "Log in to enter your details & print your QR pass"}
            </p>
          </div>

          {error && (
            <div className="error-banner">
              <span>⚠️ {error}</span>
            </div>
          )}

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
                placeholder="Enter your password"
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
              role === "admin" ? "Sign In as Administrator" : "Sign In to Customer Portal"
            )}
          </button>

          <p className="login-footer-text" style={{ marginTop: '20px' }}>
            Don't have an account?{" "}
            <Link to={role === "admin" ? "/signup/admin" : "/signup/customer"} style={{ color: "var(--primary)", textDecoration: "none", fontWeight: "600" }}>
              Sign up as {role === "admin" ? "Admin" : "Customer"}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;