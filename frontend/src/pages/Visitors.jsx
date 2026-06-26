import { useEffect, useState } from "react";
import API from "../services/api";
import "../styles/Visitors.css";

function Visitors() {

    const [visitors, setVisitors] = useState([]);

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

    return (

        <div className="visitor-history">

            <h1>Visitor History</h1>

            <table>

                <thead>

                    <tr>

                        <th>ID</th>
                        <th>Visitor</th>
                        <th>Phone</th>
                        <th>Host</th>
                        <th>Purpose</th>
                        <th>Status</th>

                    </tr>

                </thead>

                <tbody>

                    {

                        visitors.map((visitor) => (

                            <tr key={visitor.id}>

                                <td>{visitor.id}</td>

                                <td>{visitor.visitor_name}</td>

                                <td>{visitor.phone}</td>

                                <td>{visitor.host_name}</td>

                                <td>{visitor.purpose}</td>

                                <td>

                                    <span className={visitor.status.toLowerCase()}>

                                        {visitor.status}

                                    </span>

                                </td>

                            </tr>

                        ))

                    }

                </tbody>

            </table>

        </div>

    );

}

export default Visitors;