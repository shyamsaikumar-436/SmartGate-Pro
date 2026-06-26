import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "../styles/Login.css";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const loginUser = async (e) => {

        e.preventDefault();

        try {

            const res = await API.post("/auth/login", {
                email,
                password
            });

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));

            alert("Login Successful");

            navigate("/dashboard");

        } catch (err) {

            alert(err.response?.data?.message || "Login Failed");

        }

    };

    return (

        <div className="login-container">

            <form className="login-box" onSubmit={loginUser}>

                <h1>SmartGate</h1>

                <p>QR Based Visitor Management</p>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    required
                />

                <button type="submit">
                    Login
                </button>

            </form>

        </div>

    );

}

export default Login;