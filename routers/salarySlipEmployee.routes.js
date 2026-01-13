const express = require('express');
const router = express.Router();
const { fetchByAttendenceCode } = require('../controllers/salarySlipEmployee.controller');

router.post('/by-attendance', fetchByAttendenceCode);

module.exports = router;
