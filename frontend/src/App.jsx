import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AddVisitor from "./pages/AddVisitor";
import Visitors from "./pages/Visitors";
import ScanQR from "./pages/ScanQR";
import VisitorPass from "./pages/VisitorPass";
import CustomerDashboard from "./pages/CustomerDashboard";
import CurrentlyInside from "./pages/CurrentlyInside";

function App() {
    return (
        <Routes>
            {/* Visitor Portal Routes */}
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/visitor/login" element={<Login />} />
            <Route path="/login/customer" element={<Login />} />

            <Route path="/signup" element={<Signup />} />
            <Route path="/visitor/register" element={<Signup />} />
            <Route path="/signup/customer" element={<Signup />} />

            <Route path="/customer/dashboard" element={<CustomerDashboard />} />
            <Route path="/visitor/dashboard" element={<CustomerDashboard />} />
            <Route path="/customer" element={<CustomerDashboard />} />
            <Route path="/visitor" element={<CustomerDashboard />} />

            <Route path="/visitor-pass/:id" element={<VisitorPass />} />
            <Route path="/visitor/pass/:id" element={<VisitorPass />} />

            {/* Admin Portal Routes */}
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin/signup" element={<Signup />} />

            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/inside" element={<CurrentlyInside />} />
            <Route path="/visitors" element={<Visitors />} />
            <Route path="/admin/visitors" element={<Visitors />} />
            <Route path="/addvisitor" element={<AddVisitor />} />
            <Route path="/scan" element={<ScanQR />} />
            <Route path="/admin/scan" element={<ScanQR />} />
        </Routes>
    );
}

export default App;