const express = require("express");
const { saveMonthlyEntitlements, fetchMonthlyEntitlements } = require("../controllers/monthlyEntitlementEntry.controller");
const authMiddleware = require("../middleware/auth.Middleware");

const router = express.Router();


router.post("/monthly-entitlements", authMiddleware, saveMonthlyEntitlements);
router.post('/monthly-entitlement', authMiddleware,  fetchMonthlyEntitlements);
module.exports = router;
