const express = require('express');
const router = express.Router();
const { fetchAttendanceDetails, fetchAttendanceByBranch } = require('../controllers/attendenceDetails.controller');

router.post('/by-code-employee', fetchAttendanceDetails);
router.get('/by-branch', fetchAttendanceByBranch);
module.exports = router;
