const express = require("express");

const router = express.Router();

const {
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
} = require("../controllers/visitorController");

router.post("/add", addVisitor);

router.get("/dashboard", getDashboardStats);

router.get("/all", getAllVisitors);

router.get("/inside", getCurrentlyInside);

router.get("/user/:userId", getCustomerVisitors);

router.get("/scan/:token", getVisitorByQR);

router.put("/entry/:token", confirmEntry);

router.put("/exit/:token", confirmExit);

router.put("/approve/:id", approveRequest);

router.put("/reject/:id", rejectRequest);

router.delete("/clear-all", clearAllVisitors);

router.get("/:id", getVisitorById);

module.exports = router;