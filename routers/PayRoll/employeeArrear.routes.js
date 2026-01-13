const express = require("express");
const { postEmployeeArrear } = require("../../controllers/PayRoll/employeeArrear.controller");


const router = express.Router();


router.post("/employee-arrear-create", postEmployeeArrear);
module.exports = router;
