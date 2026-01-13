const express = require('express');
const router = express.Router();
const salarySlipController = require('../controllers/salarySlip.controller');

router.get('/salary-slip', salarySlipController.getAllSlips);
router.get('/salary-slip/pay-register', salarySlipController.fetchEmpPayRegister);
module.exports = router;
