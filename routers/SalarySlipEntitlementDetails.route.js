const express = require("express");
const { getByEmpCode } = require("../controllers/SalarySlipEntitlementDetails.controller");
const router = express.Router();


// POST: Fetch entitlement details by EmpCode
router.post("/get-by-empcode", getByEmpCode);

module.exports = router;
