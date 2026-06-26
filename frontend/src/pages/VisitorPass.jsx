import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import "../styles/VisitorPass.css";

function VisitorPass() {

    const { id } = useParams();

    const [visitor, setVisitor] = useState(null);

    useEffect(() => {

        loadVisitor();

    }, []);

    const loadVisitor = async () => {

        try {

            const res = await API.get(`/visitors/${id}`);

            setVisitor(res.data);

        } catch (err) {

            console.log(err);

        }

    };

    if (!visitor) {

        return <h2 style={{ textAlign: "center", marginTop: "80px" }}>Loading...</h2>;

    }

    return (

        <div className="pass-page">

            <div className="visitor-pass">

                <div className="pass-header">

                    <h1>SMARTGATE</h1>

                    <p>QR Visitor Management System</p>

                </div>

                <div className="pass-title">

                    VISITOR PASS

                </div>

                <div className="pass-details">

                    <p><strong>Visitor :</strong> {visitor.visitor_name}</p>

                    <p><strong>Phone :</strong> {visitor.phone}</p>

                    <p><strong>Email :</strong> {visitor.email}</p>

                    <p><strong>Host :</strong> {visitor.host_name}</p>

                    <p><strong>Purpose :</strong> {visitor.purpose}</p>

                    <p><strong>Visit Date :</strong> {new Date(visitor.visit_date).toLocaleDateString()}</p>

                    <p><strong>Status :</strong> {visitor.status}</p>

                </div>

                <div className="qr-section">

                    <img
                        src={visitor.qr_code}
                        alt="QR"
                    />

                </div>

                <button

                    className="print-btn"

                    onClick={() => window.print()}

                >

                    🖨 Print Visitor Pass

                </button>

            </div>

        </div>

    );

}

export default VisitorPass;