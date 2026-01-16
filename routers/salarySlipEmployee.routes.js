const express = require('express');
const router = express.Router();
const { fetchByAttendenceCode } = require('../controllers/salarySlipEmployee.controller');
const authMiddleware = require('../middleware/auth.Middleware');


router.post('/salarySlipCode',authMiddleware, fetchByAttendenceCode);

module.exports = router;
