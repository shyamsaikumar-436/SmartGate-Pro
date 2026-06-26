import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "../styles/AddVisitor.css";

function AddVisitor() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        visitor_name: "",
        phone: "",
        email: "",
        host_name: "",
        purpose: "",
        visit_date: ""
    });

    const [qrImage, setQrImage] = useState("");
    const [visitorId, setVisitorId] = useState(null);

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

    };

    const clearForm = () => {

        setForm({
            visitor_name: "",
            phone: "",
            email: "",
            host_name: "",
            purpose: "",
            visit_date: ""
        });

        setQrImage("");
        setVisitorId(null);

    };

    const submitVisitor = async (e) => {

        e.preventDefault();

        try {

            const res = await API.post("/visitors/add", form);

            alert("Visitor Added Successfully");

            setQrImage(res.data.qrImage);
            setVisitorId(res.data.visitorId);

            setForm({
                visitor_name: "",
                phone: "",
                email: "",
                host_name: "",
                purpose: "",
                visit_date: ""
            });

        } catch (err) {

            console.log(err);
            alert("Failed");

        }

    };

    return (

        <div className="visitor-container">

            <div className="visitor-card">

                <div className="top-bar">

                    <button
                        className="back-btn"
                        onClick={() => navigate("/dashboard")}
                    >
                        ← Dashboard
                    </button>

                    <h1>Add New Visitor</h1>

                </div>

                <p>Fill the visitor information and generate a QR code.</p>

                <form onSubmit={submitVisitor}>

                    <input
                        name="visitor_name"
                        placeholder="Visitor Name"
                        value={form.visitor_name}
                        onChange={handleChange}
                        required
                    />

                    <input
                        name="phone"
                        placeholder="Phone Number"
                        value={form.phone}
                        onChange={handleChange}
                        required
                    />

                    <input
                        name="email"
                        placeholder="Email Address"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />

                    <input
                        name="host_name"
                        placeholder="Host Name"
                        value={form.host_name}
                        onChange={handleChange}
                        required
                    />

                    <input
                        name="purpose"
                        placeholder="Purpose of Visit"
                        value={form.purpose}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="date"
                        name="visit_date"
                        value={form.visit_date}
                        onChange={handleChange}
                        required
                    />

                    <div className="button-group">

                        <button
                            type="submit"
                            className="generate-btn"
                        >
                            Generate QR
                        </button>

                        <button
                            type="button"
                            className="clear-btn"
                            onClick={clearForm}
                        >
                            Clear
                        </button>

                    </div>

                </form>

            </div>

            <div className="qr-card">

                <h2>Visitor QR Code</h2>

                {

                    qrImage ?

                    <>

                        <img
                            src={qrImage}
                            alt="Visitor QR"
                        />

                        <a
                            href={qrImage}
                            download="VisitorQR.png"
                            className="download-btn"
                        >
                            Download QR
                        </a>

                        <button
                            className="pass-btn"
                            onClick={() =>
                                navigate(`/visitor-pass/${visitorId}`)
                            }
                        >
                            🪪 Visitor Pass
                        </button>

                    </>

                    :

                    <div className="empty-box">

                        QR Preview

                    </div>

                }

            </div>

        </div>

    );

}

export default AddVisitor;