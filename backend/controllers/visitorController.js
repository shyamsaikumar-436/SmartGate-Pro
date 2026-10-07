const db = require("../config/db");
const QRCode = require("qrcode");
const { v4: uuidv4 } = require("uuid");

// Add / Request Visitor Pass
const addVisitor = async (req, res) => {
    const {
        user_id,
        visitor_name,
        phone,
        email,
        host_name,
        purpose,
        visit_date,
        arrival_time,
        departure_time,
        status
    } = req.body;

    const qrToken = uuidv4();
    const visitStatus = status || "Approved";

    // Ensure valid DATE string for MySQL (YYYY-MM-DD)
    let formattedDate = visit_date;
    if (!formattedDate || formattedDate.trim() === "") {
        formattedDate = new Date().toISOString().slice(0, 10);
    }

    const parsedUserId = user_id && !isNaN(parseInt(user_id)) ? parseInt(user_id) : null;

    try {
        const qrImage = await QRCode.toDataURL(qrToken);

        const sql = `
        INSERT INTO visitors
        (user_id, visitor_name, phone, email, host_name, purpose, visit_date, arrival_time, departure_time, qr_token, qr_code, status)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
        `;

        db.query(
            sql,
            [
                parsedUserId,
                visitor_name || "Visitor",
                phone || "N/A",
                email || "visitor@smartgate.com",
                host_name || "Host",
                purpose || "Visit",
                formattedDate,
                arrival_time || "10:00 AM",
                departure_time || "05:00 PM",
                qrToken,
                qrImage,
                visitStatus
            ],
            (err, result) => {
                if (err) {
                    console.error("❌ MySQL Error in addVisitor:", err);
                    return res.status(500).json({ message: err.message || "Failed to insert visitor record into database." });
                }

                res.status(201).json({
                    message: "Visitor Pass Generated Successfully",
                    visitorId: result.insertId,
                    qrToken,
                    qrImage,
                    status: visitStatus
                });
            }
        );
    } catch (error) {
        console.error("❌ Exception in addVisitor:", error);
        res.status(500).json({ message: error.message || "Server error while processing visitor pass." });
    }
};

// Dashboard Statistics
const getDashboardStats = (req, res) => {
    const totalQuery = "SELECT COUNT(*) AS totalVisitors FROM visitors";
    const insideQuery = "SELECT COUNT(*) AS insideVisitors FROM visitors WHERE status='Entered'";
    const todayQuery = "SELECT COUNT(*) AS todayVisitors FROM visitors WHERE DATE(visit_date) = CURDATE()";
    const pendingQuery = "SELECT COUNT(*) AS pendingRequests FROM visitors WHERE status='Pending'";
    const completedQuery = "SELECT COUNT(*) AS completedVisits FROM visitors WHERE status IN ('Exited','Completed')";

    db.query(totalQuery, (err, r1) => {
        if (err) return res.status(500).json(err);
        db.query(insideQuery, (err2, r2) => {
            if (err2) return res.status(500).json(err2);
            db.query(todayQuery, (err3, r3) => {
                if (err3) return res.status(500).json(err3);
                db.query(pendingQuery, (err4, r4) => {
                    if (err4) return res.status(500).json(err4);
                    db.query(completedQuery, (err5, r5) => {
                        if (err5) return res.status(500).json(err5);
                        res.json({
                            totalVisitors: r1[0].totalVisitors,
                            insideVisitors: r2[0].insideVisitors,
                            todayVisitors: r3[0].todayVisitors,
                            pendingRequests: r4[0].pendingRequests,
                            completedVisits: r5[0].completedVisits
                        });
                    });
                });
            });
        });
    });
};

// Get All Visitors
const getAllVisitors = (req, res) => {
    const sql = `
        SELECT
            id,
            user_id,
            visitor_name,
            phone,
            email,
            host_name,
            purpose,
            visit_date,
            arrival_time,
            departure_time,
            status,
            entry_time,
            exit_time,
            qr_code,
            qr_token
        FROM visitors
        ORDER BY id DESC
    `;

    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
};

// Get Visitors currently inside building
const getCurrentlyInside = (req, res) => {
    const sql = `SELECT * FROM visitors WHERE status = 'Entered' ORDER BY entry_time DESC`;
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
};

// Get Visitor by QR Code Token or ID
const getVisitorByQR = (req, res) => {
    const { token } = req.params;
    if (!token || token === "undefined" || token === "null") {
        return res.status(400).json({ message: "Invalid token or pass ID" });
    }

    const isNumeric = !isNaN(token) && !isNaN(parseInt(token));
    const sql = isNumeric
        ? `SELECT * FROM visitors WHERE id = ? OR qr_token = ?`
        : `SELECT * FROM visitors WHERE qr_token = ?`;
    const params = isNumeric ? [parseInt(token), token] : [token];

    db.query(sql, params, (err, result) => {
        if (err) {
            console.error("❌ SQL Error in getVisitorByQR:", err);
            return res.status(500).json({ message: err.message || "Database error" });
        }
        if (result.length === 0) return res.status(404).json({ message: "Visitor Not Found" });
        res.json(result[0]);
    });
};

// Gate Entry Confirmation
const confirmEntry = (req, res) => {
    const { token } = req.params;
    if (!token || token === "undefined" || token === "null") {
        return res.status(400).json({ message: "Invalid pass identifier" });
    }

    const isNumeric = !isNaN(token) && !isNaN(parseInt(token));
    const sql = isNumeric
        ? `UPDATE visitors SET status = 'Entered', entry_time = NOW() WHERE id = ? OR qr_token = ?`
        : `UPDATE visitors SET status = 'Entered', entry_time = NOW() WHERE qr_token = ?`;
    const params = isNumeric ? [parseInt(token), token] : [token];

    db.query(sql, params, (err, result) => {
        if (err) {
            console.error("❌ SQL Error in confirmEntry:", err);
            return res.status(500).json({ message: err.message || "Failed to mark visitor entry" });
        }
        res.json({ message: "Visitor Entry Confirmed" });
    });
};

// Gate Exit Confirmation
const confirmExit = (req, res) => {
    const { token } = req.params;
    if (!token || token === "undefined" || token === "null") {
        return res.status(400).json({ message: "Invalid pass identifier" });
    }

    const isNumeric = !isNaN(token) && !isNaN(parseInt(token));
    const sql = isNumeric
        ? `UPDATE visitors SET status = 'Exited', exit_time = NOW() WHERE id = ? OR qr_token = ?`
        : `UPDATE visitors SET status = 'Exited', exit_time = NOW() WHERE qr_token = ?`;
    const params = isNumeric ? [parseInt(token), token] : [token];

    db.query(sql, params, (err, result) => {
        if (err) {
            console.error("❌ SQL Error in confirmExit:", err);
            return res.status(500).json({ message: err.message || "Failed to mark visitor exit" });
        }
        res.json({ message: "Visitor Exit Confirmed" });
    });
};

// Get Visitor by ID
const getVisitorById = (req, res) => {
    const { id } = req.params;

    const sql = `SELECT * FROM visitors WHERE id = ?`;

    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.length === 0) return res.status(404).json({ message: "Visitor Not Found" });
        res.json(result[0]);
    });
};

// Get Passes for a Specific Customer User
const getCustomerVisitors = (req, res) => {
    const { userId } = req.params;
    const { email } = req.query;

    let sql = `SELECT * FROM visitors WHERE user_id = ?`;
    let params = [userId];

    if (email) {
        sql += ` OR email = ?`;
        params.push(email);
    }

    sql += ` ORDER BY id DESC`;

    db.query(sql, params, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
};

// Approve Request
const approveRequest = (req, res) => {
    const { id } = req.params;
    const sql = `UPDATE visitors SET status = 'Approved' WHERE id = ?`;
    db.query(sql, [id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Visit Request Approved" });
    });
};

// Reject Request
const rejectRequest = (req, res) => {
    const { id } = req.params;
    const sql = `UPDATE visitors SET status = 'Rejected' WHERE id = ?`;
    db.query(sql, [id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Visit Request Rejected" });
    });
};

// Clear All Visitor Records
const clearAllVisitors = (req, res) => {
    const sqlDelete = `DELETE FROM visitors`;
    const sqlReset = `ALTER TABLE visitors AUTO_INCREMENT = 1`;

    db.query(sqlDelete, (err) => {
        if (err) return res.status(500).json(err);
        db.query(sqlReset, (resetErr) => {
            if (resetErr) console.log("Auto increment reset warning:", resetErr.message);
            res.json({ message: "All visitor records cleared successfully!" });
        });
    });
};

module.exports = {
    addVisitor,
    getDashboardStats,
    getAllVisitors,
    getCurrentlyInside,
    getVisitorByQR,
    confirmEntry,
    confirmExit,
    getVisitorById,
    getCustomerVisitors,
    approveRequest,
    rejectRequest,
    clearAllVisitors
};