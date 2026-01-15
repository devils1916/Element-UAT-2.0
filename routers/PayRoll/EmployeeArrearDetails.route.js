const express = require("express");
const { fetchDetailsByTransactionCode, postEmployeeArrearDetails, fetchEmployeeArrearMaster } = require("../../controllers/PayRoll/EmployeeArrearDetails.controller");
const router = express.Router();

router.get("/employee-arrear-details", fetchDetailsByTransactionCode);
router.post("/employee-arrear", postEmployeeArrearDetails);

router.get("/employee-arrear-master", fetchEmployeeArrearMaster); 

module.exports = router;
