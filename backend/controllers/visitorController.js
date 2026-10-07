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
                user_id || null,
                visitor_name,
                phone,
                email,
                host_name,
                purpose,
                visit_date,
                arrival_time || "10:00 AM",
                departure_time || "05:00 PM",
                qrToken,
                qrImage,
                visitStatus
            ],
            (err, result) => {
                if (err) return res.status(500).json(err);

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
        res.status(500).json(error);
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

    const sql = `SELECT * FROM visitors WHERE qr_token = ? OR id = ?`;

    db.query(sql, [token, token], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.length === 0) return res.status(404).json({ message: "Visitor Not Found" });
        res.json(result[0]);
    });
};

// Gate Entry Confirmation
const confirmEntry = (req, res) => {
    const { token } = req.params;

    const sql = `
        UPDATE visitors
        SET status = 'Entered', entry_time = NOW()
        WHERE qr_token = ? OR id = ?
    `;

    db.query(sql, [token, token], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Visitor Entry Confirmed" });
    });
};

// Gate Exit Confirmation
const confirmExit = (req, res) => {
    const { token } = req.params;

    const sql = `
        UPDATE visitors
        SET status = 'Exited', exit_time = NOW()
        WHERE qr_token = ? OR id = ?
    `;

    db.query(sql, [token, token], (err) => {
        if (err) return res.status(500).json(err);
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
    rejectRequest
};