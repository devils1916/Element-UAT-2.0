const express = require("express");
const { saveSalarySlipDetails, getSalarySlipCodeByAttendance } = require("../../controllers/PayRoll/payroll.controller");


const router = express.Router();


router.post('/saveSalarySlipDetails', saveSalarySlipDetails); 
router.post('/salCode_attendenceCode', getSalarySlipCodeByAttendance); 
module.exports = router;