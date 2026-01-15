const express = require("express");
const { getByEmpCode } = require("../controllers/SalarySlipEntitlementDetails.controller");
const authMiddleware = require("../middleware/auth.Middleware");
const router = express.Router();


// POST: Fetch entitlement details by EmpCode
router.post("/get-by-empcode", authMiddleware, getByEmpCode);

module.exports = router;
