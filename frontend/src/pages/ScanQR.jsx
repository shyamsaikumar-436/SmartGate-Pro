import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import { FaCheckCircle, FaTimesCircle, FaRedo, FaUser, FaPhone, FaEnvelope, FaUserTie, FaBriefcase, FaCalendarAlt } from "react-icons/fa";
import "../styles/ScanQR.css";

function ScanQR() {
  const scannerRef = useRef(null);

  const [visitor, setVisitor]             = useState(null);
  const [loading, setLoading]             = useState(false);
  const [scannerStarted, setScannerStarted] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMsg, setActionMsg]         = useState("");

  useEffect(() => {
    startScanner();
    return () => { stopScanner(); };
  }, []);

  const startScanner = async () => {
    if (scannerStarted) return;
    try {
      const scanner = new Html5Qrcode("reader");
      scannerRef.current = scanner;
      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        async (decodedText) => {
          await stopScanner();
          fetchVisitor(decodedText);
        },
        () => {}
      );
      setScannerStarted(true);
    } catch (err) {
      console.log(err);
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
      } catch (e) {}
      scannerRef.current = null;
    }
    setScannerStarted(false);
  };

  const fetchVisitor = async (token) => {
    setLoading(true);
    try {
      const res = await API.get(`/visitors/scan/${token}`);
      setVisitor(res.data);
    } catch (err) {
      setActionMsg("❌ Visitor not found. Please try again.");
      restartScanner();
    } finally {
      setLoading(false);
    }
  };

  const restartScanner = () => {
    setVisitor(null);
    setActionMsg("");
    startScanner();
  };

  const confirmEntry = async () => {
    setActionLoading(true);
    try {
      await API.put(`/visitors/entry/${visitor.qr_token}`);
      const res = await API.get(`/visitors/scan/${visitor.qr_token}`);
      setVisitor(res.data);
      setActionMsg("✅ Entry confirmed successfully!");
    } catch (err) {
      console.log(err);
    } finally {
      setActionLoading(false);
    }
  };

  const confirmExit = async () => {
    setActionLoading(true);
    try {
      await API.put(`/visitors/exit/${visitor.qr_token}`);
      const res = await API.get(`/visitors/scan/${visitor.qr_token}`);
      setVisitor(res.data);
      setActionMsg("🚪 Exit confirmed successfully!");
    } catch (err) {
      console.log(err);
    } finally {
      setActionLoading(false);
    }
  };

  const details = visitor ? [
    { icon: <FaUser />,        label: "Name",       value: visitor.visitor_name },
    { icon: <FaPhone />,       label: "Phone",      value: visitor.phone },
    { icon: <FaEnvelope />,    label: "Email",      value: visitor.email },
    { icon: <FaUserTie />,     label: "Host",       value: visitor.host_name },
    { icon: <FaBriefcase />,   label: "Purpose",    value: visitor.purpose },
    { icon: <FaCalendarAlt />, label: "Visit Date", value: new Date(visitor.visit_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) },
  ] : [];

  return (
    <div className="sq-layout">
      <Sidebar />

      <main className="sq-main">
        <div className="sq-header">
          <h1 className="sq-title">Security QR Scanner</h1>
          <p className="sq-sub">Scan visitor QR codes to verify entry and exit</p>
        </div>

        <div className="sq-grid">
          {/* Camera Card */}
          <div className="sq-camera-card">
            <h2 className="sq-card-title">📷 Camera Scanner</h2>
            <p className="sq-card-sub">Position the QR code within the frame</p>

            <div className="sq-reader-wrap">
              <div id="reader" className="sq-reader" />

              {/* Scanner overlay corners */}
              {!visitor && (
                <div className="sq-overlay">
                  <div className="sq-frame">
                    <div className="sq-corner sq-tl" />
                    <div className="sq-corner sq-tr" />
                    <div className="sq-corner sq-bl" />
                    <div className="sq-corner sq-br" />
                    <div className="sq-scan-line" />
                  </div>
                </div>
              )}
            </div>

            {loading && (
              <div className="sq-loading">
                <div className="sq-spinner" />
                <p>Fetching visitor details...</p>
              </div>
            )}

            {scannerStarted && !loading && (
              <div className="sq-status-pill">
                <span className="sq-status-dot" /> Scanner Active
              </div>
            )}
          </div>

          {/* Details Card */}
          <div className="sq-details-card">
            <h2 className="sq-card-title">🪪 Visitor Details</h2>

            {visitor ? (
              <div className="sq-visitor-info" key={visitor.id}>
                {/* Avatar + Status row */}
                <div className="sq-visitor-hero">
                  <div className="sq-avatar">
                    {visitor.visitor_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="sq-visitor-name">{visitor.visitor_name}</p>
                    <span className={`sq-status sq-status--${visitor.status.toLowerCase()}`}>
                      <span className="sq-status-badge-dot" />
                      {visitor.status}
                    </span>
                  </div>
                </div>

                {/* Detail rows */}
                <div className="sq-detail-rows">
                  {details.slice(1).map((d, i) => (
                    <div className="sq-detail-row" key={i}>
                      <span className="sq-detail-icon">{d.icon}</span>
                      <div>
                        <p className="sq-detail-label">{d.label}</p>
                        <p className="sq-detail-value">{d.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action Message */}
                {actionMsg && (
                  <div className="sq-action-msg">{actionMsg}</div>
                )}

                {/* Action Buttons */}
                <div className="sq-actions">
                  {visitor.status === "Pending" && (
                    <button
                      className="sq-entry-btn"
                      onClick={confirmEntry}
                      disabled={actionLoading}
                    >
                      {actionLoading ? <span className="sq-btn-spinner" /> : <FaCheckCircle />}
                      Confirm Entry
                    </button>
                  )}
                  {visitor.status === "Entered" && (
                    <button
                      className="sq-exit-btn"
                      onClick={confirmExit}
                      disabled={actionLoading}
                    >
                      {actionLoading ? <span className="sq-btn-spinner" /> : <FaTimesCircle />}
                      Confirm Exit
                    </button>
                  )}
                  {visitor.status === "Exited" && (
                    <div className="sq-exited-msg">
                      <FaTimesCircle /> Visitor has already exited
                    </div>
                  )}
                  <button className="sq-rescan-btn" onClick={restartScanner}>
                    <FaRedo /> Scan Another
                  </button>
                </div>
              </div>
            ) : (
              <div className="sq-waiting">
                <div className="sq-waiting-icon">📡</div>
                <h3>Awaiting QR Scan</h3>
                <p>Point a visitor's QR code towards the camera to retrieve their details.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default ScanQR;