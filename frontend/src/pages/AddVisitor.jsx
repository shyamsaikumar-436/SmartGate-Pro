import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import {
  FaUser, FaPhone, FaEnvelope, FaUserTie,
  FaBriefcase, FaCalendarAlt, FaQrcode, FaTimes, FaIdCard
} from "react-icons/fa";
import "../styles/AddVisitor.css";

function AddVisitor() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    visitor_name: "",
    phone: "",
    email: "",
    host_name: "",
    purpose: "",
    visit_date: "",
  });

  const [qrImage, setQrImage]   = useState("");
  const [visitorId, setVisitorId] = useState(null);
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const clearForm = () => {
    setForm({ visitor_name: "", phone: "", email: "", host_name: "", purpose: "", visit_date: "" });
    setQrImage("");
    setVisitorId(null);
    setSuccess(false);
  };

  const submitVisitor = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/visitors/add", form);
      setQrImage(res.data.qrImage);
      setVisitorId(res.data.visitorId);
      setSuccess(true);
      setForm({ visitor_name: "", phone: "", email: "", host_name: "", purpose: "", visit_date: "" });
    } catch (err) {
      console.log(err);
      alert("Failed to add visitor. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: "visitor_name", placeholder: "Full Name",         icon: <FaUser />,        type: "text" },
    { name: "phone",        placeholder: "Phone Number",      icon: <FaPhone />,       type: "tel" },
    { name: "email",        placeholder: "Email Address",     icon: <FaEnvelope />,    type: "email" },
    { name: "host_name",    placeholder: "Host Name",         icon: <FaUserTie />,     type: "text" },
    { name: "purpose",      placeholder: "Purpose of Visit",  icon: <FaBriefcase />,   type: "text" },
    { name: "visit_date",   placeholder: "Visit Date",        icon: <FaCalendarAlt />, type: "date" },
  ];

  return (
    <div className="av-layout">
      <Sidebar />

      <main className="av-main">
        <div className="av-header">
          <div>
            <h1 className="av-title">Add New Visitor</h1>
            <p className="av-sub">Fill in the visitor details and generate a unique QR pass</p>
          </div>
        </div>

        <div className="av-grid">
          {/* Form Card */}
          <div className="av-form-card">
            <div className="av-form-title">
              <FaUser className="av-form-icon" />
              <h2>Visitor Information</h2>
            </div>

            <form onSubmit={submitVisitor}>
              <div className="av-fields">
                {fields.map((f) => (
                  <div className="av-field-group" key={f.name}>
                    <label>{f.placeholder}</label>
                    <div className="av-input-wrap">
                      <span className="av-input-icon">{f.icon}</span>
                      <input
                        type={f.type}
                        name={f.name}
                        placeholder={f.placeholder}
                        value={form[f.name]}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="av-btn-group">
                <button type="submit" className="av-generate-btn" disabled={loading}>
                  {loading ? (
                    <><span className="btn-spinner" /> Generating...</>
                  ) : (
                    <><FaQrcode /> Generate QR Pass</>
                  )}
                </button>
                <button type="button" className="av-clear-btn" onClick={clearForm}>
                  <FaTimes /> Clear
                </button>
              </div>
            </form>
          </div>

          {/* QR Preview Card */}
          <div className="av-qr-card">
            <div className="av-form-title">
              <FaQrcode className="av-form-icon" />
              <h2>QR Pass Preview</h2>
            </div>

            {qrImage ? (
              <div className="qr-result" key={qrImage}>
                <div className="qr-success-badge">
                  <span>✓</span> Visitor Registered Successfully!
                </div>
                <div className="qr-image-wrap">
                  <img src={qrImage} alt="Visitor QR Code" />
                  <div className="qr-corner qr-tl" />
                  <div className="qr-corner qr-tr" />
                  <div className="qr-corner qr-bl" />
                  <div className="qr-corner qr-br" />
                </div>
                <div className="qr-actions">
                  <a href={qrImage} download="VisitorQR.png" className="qr-download-btn">
                    ⬇ Download QR
                  </a>
                  <button
                    className="qr-pass-btn"
                    onClick={() => navigate(`/visitor-pass/${visitorId}`)}
                  >
                    <FaIdCard /> View Pass
                  </button>
                </div>
              </div>
            ) : (
              <div className="qr-empty">
                <div className="qr-empty-icon">
                  <FaQrcode />
                </div>
                <p>QR code will appear here after you fill in the visitor details and click <strong>Generate QR Pass</strong>.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default AddVisitor;