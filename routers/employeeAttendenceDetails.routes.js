const express = require('express');
const router = express.Router();
const { fetchAttendanceDetails, fetchAttendanceByBranch } = require('../controllers/attendenceDetails.controller');
const authMiddleware = require('../middleware/auth.Middleware');

router.post('/by-code-employee', authMiddleware ,fetchAttendanceDetails);
router.get('/by-branch', authMiddleware, fetchAttendanceByBranch);
module.exports = router;
