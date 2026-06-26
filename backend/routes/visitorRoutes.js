const express = require("express");

const router = express.Router();

const {
    addVisitor,
    getDashboardStats,
    getAllVisitors,
    getVisitorByQR,
    confirmEntry,
    confirmExit
} = require("../controllers/visitorController");

router.post("/add", addVisitor);

router.get("/dashboard", getDashboardStats);

router.get("/all", getAllVisitors);

router.get("/scan/:token", getVisitorByQR);

router.put("/entry/:token", confirmEntry);

router.put("/exit/:token", confirmExit);

module.exports = router;