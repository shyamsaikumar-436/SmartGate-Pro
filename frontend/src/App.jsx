import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddVisitor from "./pages/AddVisitor";
import Visitors from "./pages/Visitors";
import ScanQR from "./pages/ScanQR";
import VisitorPass from "./pages/VisitorPass";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/addvisitor" element={<AddVisitor />} />
            <Route path="/visitors" element={<Visitors />} />
            <Route path="/scan" element={<ScanQR />} />
            <Route path="/visitor-pass/:id" element={<VisitorPass />} />
        </Routes>
    );
}

export default App;