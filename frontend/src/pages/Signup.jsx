import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaShieldAlt, FaCheckCircle } from "react-icons/fa";
import "../styles/Login.css"; // Reusing the awesome login styling

function Signup() {
  const navigate = useNavigate();

  const [full_name, setFullName] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState("");

  const registerUser = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await API.post("/auth/register", { full_name, email, password, role: "admin" });
      setSuccess("Account created successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const features = [
    "QR-based visitor registration",
    "Real-time entry & exit tracking",
    "Instant visitor pass generation",
    "Secure MySQL data storage",
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
          <p className="brand-sub">QR-Based Visitor Management System</p>
          <p className="brand-desc">
            Digitize your gate operations. Secure visitor registration, instant QR passes,
            and full entry/exit tracking — all in one place.
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
          <div className="login-box-header">
            <h2>Create an Account 🚀</h2>
            <p>Sign up to manage your gates securely</p>
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
                placeholder="admin@smartgate.com"
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
              "Sign Up"
            )}
          </button>

          <p className="login-footer-text" style={{ marginTop: '16px' }}>
            Already have an account?{" "}
            <Link to="/" style={{ color: "var(--primary)", textDecoration: "none", fontWeight: "600" }}>
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;
