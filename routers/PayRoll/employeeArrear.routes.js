const express = require("express");
const { postEmployeeArrear } = require("../../controllers/PayRoll/employeeArrear.controller");
const authMiddleware = require("../../middleware/auth.Middleware");


const router = express.Router();


router.post("/employee-arrear-create", authMiddleware, postEmployeeArrear);
module.exports = router;
