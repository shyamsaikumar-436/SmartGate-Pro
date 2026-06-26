import { useState } from "react";
import API from "../services/api";
import "../styles/AddVisitor.css";

function AddVisitor() {

    const [form, setForm] = useState({
        visitor_name: "",
        phone: "",
        email: "",
        host_name: "",
        purpose: "",
        visit_date: ""
    });

    const [qrImage, setQrImage] = useState("");

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

    };

    const submitVisitor = async (e) => {

        e.preventDefault();

        try {

            const res = await API.post("/visitors/add", form);

            alert("Visitor Added Successfully");

            setQrImage(res.data.qrImage);

            setForm({
                visitor_name:"",
                phone:"",
                email:"",
                host_name:"",
                purpose:"",
                visit_date:""
            });

        } catch(err){

            alert("Failed");

            console.log(err);

        }

    };

    return (

        <div className="visitor-page">

            <form className="visitor-form" onSubmit={submitVisitor}>

                <h1>Add Visitor</h1>

                <input
                name="visitor_name"
                placeholder="Visitor Name"
                value={form.visitor_name}
                onChange={handleChange}
                required
                />

                <input
                name="phone"
                placeholder="Phone"
                value={form.phone}
                onChange={handleChange}
                required
                />

                <input
                name="email"
                placeholder="Email"
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
                placeholder="Purpose"
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

                <button type="submit">
                    Generate QR
                </button>

            </form>

            {
                qrImage && (

                    <div className="qr-box">

                        <h2>Visitor QR Code</h2>

                        <img
                        src={qrImage}
                        alt="QR"
                        />

                    </div>

                )
            }

        </div>

    );

}

export default AddVisitor;