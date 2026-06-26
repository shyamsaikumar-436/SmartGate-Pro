import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "../styles/Visitors.css";

function Visitors() {

    const navigate = useNavigate();

    const [visitors, setVisitors] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        loadVisitors();
    }, []);

    const loadVisitors = async () => {

        try {

            const res = await API.get("/visitors/all");

            setVisitors(res.data);

        } catch (err) {

            console.log(err);

        }

    };

    const filteredVisitors = visitors.filter((visitor) =>
        visitor.visitor_name.toLowerCase().includes(search.toLowerCase())
    );

    return (

        <div className="history-page">

            <div className="history-header">

                <h1>Visitor History</h1>

                <input
                    type="text"
                    placeholder="🔍 Search Visitor..."
                    value={search}
                    onChange={(e)=>setSearch(e.target.value)}
                />

            </div>

            <div className="table-card">

                <table>

                    <thead>

                        <tr>

                            <th>ID</th>
                            <th>Visitor</th>
                            <th>Phone</th>
                            <th>Host</th>
                            <th>Purpose</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Action</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            filteredVisitors.map((visitor)=>(

                                <tr key={visitor.id}>

                                    <td>{visitor.id}</td>

                                    <td>{visitor.visitor_name}</td>

                                    <td>{visitor.phone}</td>

                                    <td>{visitor.host_name}</td>

                                    <td>{visitor.purpose}</td>

                                    <td>
                                        {new Date(visitor.visit_date).toLocaleDateString()}
                                    </td>

                                    <td>

                                        <span
                                            className={visitor.status.toLowerCase()}
                                        >
                                            {visitor.status}
                                        </span>

                                    </td>

                                    <td>

                                        <button
                                            className="view-btn"
                                            onClick={() => navigate(`/visitor-pass/${visitor.id}`)}
                                        >
                                            👁 View Pass
                                        </button>

                                    </td>

                                </tr>

                            ))

                        }

                    </tbody>

                </table>

            </div>

        </div>

    );

}

export default Visitors;