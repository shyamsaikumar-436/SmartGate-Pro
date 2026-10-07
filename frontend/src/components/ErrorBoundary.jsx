import React from "react";
import { FaShieldAlt, FaSync } from "react-icons/fa";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {}
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            background: "#060b18",
            color: "#f1f5f9",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            fontFamily: "Inter, sans-serif",
          }}
        >
          <div
            style={{
              background: "#0d1528",
              border: "1px solid rgba(59,130,246,0.2)",
              borderRadius: "20px",
              padding: "40px",
              maxWidth: "480px",
              width: "100%",
              textAlign: "center",
              boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
            }}
          >
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: 16,
                background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
                color: "white",
                marginBottom: 20,
              }}
            >
              <FaShieldAlt />
            </div>

            <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 10 }}>
              Session Reset Required
            </h2>
            <p
              style={{
                fontSize: 14,
                color: "#94a3b8",
                lineHeight: 1.6,
                marginBottom: 20,
              }}
            >
              SmartGate system encountered an unexpected session error. Click below to clear local storage and reload the portal cleanly.
            </p>

            {this.state.error && (
              <div
                style={{
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.3)",
                  borderRadius: "8px",
                  padding: "10px",
                  marginBottom: 20,
                  fontSize: "12px",
                  color: "#fca5a5",
                  wordBreak: "break-word",
                  textAlign: "left",
                }}
              >
                <strong>Error:</strong> {this.state.error.toString()}
              </div>
            )}

            <button
              onClick={this.handleReset}
              style={{
                width: "100%",
                padding: "14px",
                background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                color: "white",
                border: "none",
                borderRadius: "12px",
                fontSize: "15px",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <FaSync /> Clear Session & Reload Portal
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
