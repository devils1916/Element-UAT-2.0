const express = require('express');
const router = express.Router();
const salarySlipController = require('../controllers/salarySlip.controller');
//const autsalarySlipController = require('../controllers/a')
const authMiddleware = require('../middleware/auth.Middleware');
router.get('/salary-slip',authMiddleware, salarySlipController.getAllSlips);
router.get('/salary-slip/pay-register',authMiddleware, salarySlipController.fetchEmpPayRegister);
module.exports = router;
