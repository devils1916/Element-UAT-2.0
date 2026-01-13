// controllers/bankStatementController.js
const express = require('express');
const { getBankStatementReport, executeStoredProcedure, getDropdownDataForEmpDetail, searchEmployees, getEmployeeEntitlementDetailsReport, getEmployeePayRegisterReport, exportToExcelPayRegisterReport, getEmployeesActiveInactive, exportEmployeesActiveInactive, getEmpArrearRegisterReport, getCostSheetReport, getEnsuranceReport,getFilteredEmployees,downloadExcelActiveInactiveEmployees } = require('../controllers/reports.controller');

const router = express.Router();


// POST route to fetch bank statement
router.get('/bank-statement', getBankStatementReport);

//emp detail report
router.get('/employee-details', executeStoredProcedure);
router.get('/dropdown-data-for-emp-details', getDropdownDataForEmpDetail);
// Search employees
router.get('/search', searchEmployees);


//Employee Entitlement Details Report
router.post('/emp-entitlement-details', getEmployeeEntitlementDetailsReport);

// EMPLOYEE PAY REGISTER REPORT
router.get('/employee-pay-register', getEmployeePayRegisterReport);
router.post('/export-employee-pay-register', exportToExcelPayRegisterReport);

router.get("/employee-active-inactive", getEmployeesActiveInactive)
router.get("/employees/active-inactive", getFilteredEmployees);

router.get("/export-employee-active-inactive", exportEmployeesActiveInactive)
router.get("/employees/export-employee-active-inactive-ak", downloadExcelActiveInactiveEmployees);

 
// COST SHEET REPORT
router.get("/cost-sheet", getCostSheetReport)


// EMPLOYEE ARREAR REGISTER REPORT
router.get('/employee-arrear-register', getEmpArrearRegisterReport);

router.post('/insurance-report', getEnsuranceReport);



module.exports = router;
