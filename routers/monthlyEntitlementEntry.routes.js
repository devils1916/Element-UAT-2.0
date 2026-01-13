const express = require("express");
const { saveMonthlyEntitlements, fetchMonthlyEntitlements } = require("../controllers/monthlyEntitlementEntry.controller");

const router = express.Router();


router.post("/monthly-entitlements", saveMonthlyEntitlements);
router.get('/monthly-entitlement', fetchMonthlyEntitlements);
module.exports = router;
