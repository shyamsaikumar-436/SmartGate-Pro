const db = require("../config/db");
const QRCode = require("qrcode");
const { v4: uuidv4 } = require("uuid");

// Add Visitor
const addVisitor = async (req, res) => {
    const {
        visitor_name,
        phone,
        email,
        host_name,
        purpose,
        visit_date
    } = req.body;

    const qrToken = uuidv4();

    try {
        const qrImage = await QRCode.toDataURL(qrToken);

        const sql = `
        INSERT INTO visitors
        (visitor_name, phone, email, host_name, purpose, visit_date, qr_token, qr_code)
        VALUES (?,?,?,?,?,?,?,?)
        `;

        db.query(
            sql,
            [
                visitor_name,
                phone,
                email,
                host_name,
                purpose,
                visit_date,
                qrToken,
                qrImage
            ],
            (err, result) => {
                if (err) return res.status(500).json(err);

                res.status(201).json({
                    message: "Visitor Added Successfully",
                    visitorId: result.insertId,
                    qrToken,
                    qrImage
                });
            }
        );
    } catch (error) {
        res.status(500).json(error);
    }
};

// Dashboard Statistics
const getDashboardStats = (req, res) => {

    const totalVisitorsQuery =
        "SELECT COUNT(*) AS totalVisitors FROM visitors";

    const insideVisitorsQuery =
        "SELECT COUNT(*) AS insideVisitors FROM visitors WHERE status='Entered'";

    db.query(totalVisitorsQuery, (err, totalResult) => {

        if (err) return res.status(500).json(err);

        db.query(insideVisitorsQuery, (err2, insideResult) => {

            if (err2) return res.status(500).json(err2);

            res.json({
                totalVisitors: totalResult[0].totalVisitors,
                insideVisitors: insideResult[0].insideVisitors
            });

        });

    });

};
// Get All Visitors
const getAllVisitors = (req, res) => {

    const sql = `
        SELECT
            id,
            visitor_name,
            phone,
            email,
            host_name,
            purpose,
            visit_date,
            status
        FROM visitors
        ORDER BY id DESC
    `;

    db.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json(result);

    });

};

const getVisitorByQR = (req, res) => {

    const { token } = req.params;

    const sql = `
        SELECT *
        FROM visitors
        WHERE qr_token = ?
    `;

    db.query(sql, [token], (err, result) => {

        if (err)
            return res.status(500).json(err);

        if (result.length === 0)
            return res.status(404).json({
                message: "Visitor Not Found"
            });

        res.json(result[0]);

    });

};
const confirmEntry = (req, res) => {

    const { token } = req.params;

    const sql = `
        UPDATE visitors
        SET
            status = 'Entered',
            entry_time = NOW()
        WHERE qr_token = ?
    `;

    db.query(sql, [token], (err) => {

        if (err)
            return res.status(500).json(err);

        res.json({
            message: "Visitor Entry Confirmed"
        });

    });

};

const confirmExit = (req, res) => {

    const { token } = req.params;

    const sql = `
        UPDATE visitors
        SET
            status = 'Exited',
            exit_time = NOW()
        WHERE qr_token = ?
    `;

    db.query(sql, [token], (err) => {

        if (err)
            return res.status(500).json(err);

        res.json({
            message: "Visitor Exit Confirmed"
        });

    });

};
module.exports = {
    addVisitor,
    getDashboardStats,
    getAllVisitors,
    getVisitorByQR,
    confirmEntry,
    confirmExit
};