import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import API from "../services/api";
import "../styles/ScanQR.css";

function ScanQR() {

    const scannerRef = useRef(null);

    const [visitor, setVisitor] = useState(null);
    const [loading, setLoading] = useState(false);
    const [scannerStarted, setScannerStarted] = useState(false);

    useEffect(() => {

        startScanner();

        return () => {

            stopScanner();

        };

    }, []);

    const startScanner = async () => {

        if (scannerStarted) return;

        try {

            const scanner = new Html5Qrcode("reader");

            scannerRef.current = scanner;

            await scanner.start(

                {
                    facingMode: "environment"
                },

                {
                    fps: 10,
                    qrbox: {
                        width: 250,
                        height: 250
                    }
                },

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

            alert("Visitor Not Found");

            restartScanner();

        }

        setLoading(false);

    };

    const restartScanner = () => {

        setVisitor(null);

        startScanner();

    };

    const confirmEntry = async () => {

        try {

            await API.put(`/visitors/entry/${visitor.qr_token}`);

            const res = await API.get(`/visitors/scan/${visitor.qr_token}`);

            setVisitor(res.data);

            alert("Entry Confirmed");

        } catch (err) {

            console.log(err);

        }

    };

    const confirmExit = async () => {

        try {

            await API.put(`/visitors/exit/${visitor.qr_token}`);

            const res = await API.get(`/visitors/scan/${visitor.qr_token}`);

            setVisitor(res.data);

            alert("Exit Confirmed");

        } catch (err) {

            console.log(err);

        }

    };

    return (

        <div className="scan-container">

            <div className="camera-card">

                <h1>Security QR Scanner</h1>

                <p>Scan Visitor QR Code</p>

                <div id="reader"></div>

                {loading &&

                    <h3 style={{marginTop:"20px"}}>

                        Loading...

                    </h3>

                }

            </div>

            <div className="details-card">

                <h2>Visitor Details</h2>

                {

                    visitor ? (

                        <>
                                                    <div className="visitor-info">

                                <p>
                                    <strong>Name :</strong>{" "}
                                    {visitor.visitor_name}
                                </p>

                                <p>
                                    <strong>Phone :</strong>{" "}
                                    {visitor.phone}
                                </p>

                                <p>
                                    <strong>Email :</strong>{" "}
                                    {visitor.email}
                                </p>

                                <p>
                                    <strong>Host :</strong>{" "}
                                    {visitor.host_name}
                                </p>

                                <p>
                                    <strong>Purpose :</strong>{" "}
                                    {visitor.purpose}
                                </p>

                                <p>
                                    <strong>Visit Date :</strong>{" "}
                                    {new Date(visitor.visit_date).toLocaleDateString()}
                                </p>

                                <p>
                                    <strong>Status :</strong>

                                    <span
                                        className={`status ${visitor.status.toLowerCase()}`}
                                    >
                                        {visitor.status}
                                    </span>

                                </p>

                            </div>

                            {

                                visitor.status === "Pending" && (

                                    <button
                                        className="entry-btn"
                                        onClick={confirmEntry}
                                    >

                                        ✅ Confirm Entry

                                    </button>

                                )

                            }

                            {

                                visitor.status === "Entered" && (

                                    <button
                                        className="exit-btn"
                                        onClick={confirmExit}
                                    >

                                        ❌ Confirm Exit

                                    </button>

                                )

                            }

                            <button
                                className="scan-btn"
                                onClick={restartScanner}
                            >

                                🔄 Scan Another Visitor

                            </button>

                        </>

                    ) : (

                        <div className="waiting">

                            <h3>📷 Waiting for QR Scan...</h3>

                            <p>
                                Point the visitor QR code towards the camera.
                            </p>

                        </div>

                    )

                }

            </div>

        </div>

    );

}

export default ScanQR;