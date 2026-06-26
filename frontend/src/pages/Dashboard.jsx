import { useEffect, useState } from "react";
import { FaUsers, FaUserCheck, FaQrcode, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "../styles/Dashboard.css";

function Dashboard() {

    const navigate = useNavigate();

    const [stats, setStats] = useState({
        totalVisitors: 0,
        insideVisitors: 0
    });

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {

        try {

            const res = await API.get("/visitors/dashboard");

            setStats(res.data);

        } catch (error) {

            console.log(error);

        }

    };

    const logout = () => {

        localStorage.clear();
        navigate("/");

    };

    return (

        <div className="dashboard">

            <div className="sidebar">

                <h2>SmartGate</h2>

                <button onClick={() => navigate("/addvisitor")}>
                    <FaUsers /> Add Visitor
                </button>

                <button onClick={() => navigate("/visitors")}>
                    <FaHistory /> Visitor History
                </button>

                <button onClick={() => navigate("/scan")}>
                    <FaQrcode /> Scan QR
                </button>

                <button onClick={logout}>
                    <FaSignOutAlt /> Logout
                </button>

            </div>

            <div className="content">

                <h1>Dashboard</h1>

                <div className="cards">

                    <div className="card">

                        <FaUsers size={35} />

                        <h2>Total Visitors</h2>

                        <h1>{stats.totalVisitors}</h1>

                    </div>

                    <div className="card">

                        <FaUserCheck size={35} />

                        <h2>Visitors Inside</h2>

                        <h1>{stats.insideVisitors}</h1>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Dashboard;