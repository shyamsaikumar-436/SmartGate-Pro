import { useState } from "react";
import API from "../services/api";
import "../styles/ScanQR.css";

function ScanQR() {

    const [token, setToken] = useState("");
    const [visitor, setVisitor] = useState(null);

    const scanQR = async () => {

        try {

            const res = await API.get(`/visitors/scan/${token}`);

            setVisitor(res.data);

        } catch (err) {

            alert("Visitor Not Found");

        }

    };

    const confirmEntry = async () => {

        await API.put(`/visitors/entry/${token}`);

        alert("Entry Confirmed");

        scanQR();

    };

    const confirmExit = async () => {

        await API.put(`/visitors/exit/${token}`);

        alert("Exit Confirmed");

        scanQR();

    };

    return (

        <div className="scan-page">

            <h1>Scan QR</h1>

            <input
                placeholder="Paste QR Token"
                value={token}
                onChange={(e)=>setToken(e.target.value)}
            />

            <button onClick={scanQR}>
                Search
            </button>

            {

                visitor && (

                    <div className="visitor-card">

                        <h2>{visitor.visitor_name}</h2>

                        <p><b>Host:</b> {visitor.host_name}</p>

                        <p><b>Purpose:</b> {visitor.purpose}</p>

                        <p><b>Status:</b> {visitor.status}</p>

                        <button onClick={confirmEntry}>
                            Confirm Entry
                        </button>

                        <button onClick={confirmExit}>
                            Confirm Exit
                        </button>

                    </div>

                )

            }

        </div>

    );

}

export default ScanQR;