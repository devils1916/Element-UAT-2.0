const express = require( 'express' );
const router = express.Router();
const SalaryHeadM = require( '../controllers/salaryHeadMaster.controller' );
const authMiddleware = require('../middleware/auth.Middleware');

router.get("/create/getNewSalaryHeadCode", authMiddleware, SalaryHeadM.getNewSalaryHeadCode);

router.post ("/create/newSalaryHead", authMiddleware, SalaryHeadM.createNewSalaryHead)

router.post( "/salHead/setGradeAmount", authMiddleware, SalaryHeadM.saveSalaryHeadAmoutGrade );

router.post("/getSalHead/GradeAmount", authMiddleware, SalaryHeadM.getSalaryAmount);

router.post("/getMinWages", authMiddleware, SalaryHeadM.getMinimumWages);

router.post("/reimbursement/saveReimbursment", authMiddleware, SalaryHeadM.setReimbursment);

//rout to save entitle of an employee save into employeeentitlement, view_employeesalarydetailsrep , view_employeeentitlement and employeemaster table 
router.post("/saveEntitle", authMiddleware, SalaryHeadM.saveEntitlement);

//rout to get employee entitlement by empid 
router.get("/getEntitlement/:empid", authMiddleware,  SalaryHeadM.getEntitlementByEmpId);

router.post("/getEntitlement/many", authMiddleware,  SalaryHeadM.getEntitlementsByEmpIds );

//rout to get salary head master to get saleryheadcode and saray head name
router.get("/getSalaryHead", authMiddleware, SalaryHeadM.getSalaryHead);

router.get("/get-filtered-salary-head", authMiddleware, SalaryHeadM.getFilteredSalaryHead);

router.get('/professionalTax/AllLocations', authMiddleware, SalaryHeadM.getLocationsOfProfessionalTax);

//rout to save GL Details into EmployeeGlDetails table
router.post('/saveGLDetails', authMiddleware, SalaryHeadM.saveGLDetails);

router.post('/calculateSalarySlip', authMiddleware, SalaryHeadM.calculateEmployeeSalarySlip);

router.post('/saveSalarySlip', authMiddleware, SalaryHeadM.saveSalarySlip);

router.post('/saveSalarySlipDetails', authMiddleware,  SalaryHeadM.saveSalarySlipDetails);

router.post("/MonthlyEntitlementEntry",authMiddleware, SalaryHeadM.saveMonthlyEntitlementEntry);

// tds
router.get('/getEmployeesForIncomeTaxComputation', authMiddleware, SalaryHeadM.getEmployeesForIncomeTaxComputation);

router.get('/getEmployeeDetailsForIncomeTaxComputation', authMiddleware, SalaryHeadM.getEmployeeDetailsForIncomeTaxComputation);

router.get('/getSavedIncomeTaxList',  authMiddleware, SalaryHeadM.getSavedIncomeTaxList);

router.get('/getDetailsOfSelectedTaxCode' ,  authMiddleware, SalaryHeadM.getDetailsOfSelectedTaxCode);

router.post('/salary-breakup', authMiddleware, SalaryHeadM.SalaryBreakupController);

router.get("/:EmpCode", authMiddleware, SalaryHeadM.getSalaryBreakupByEmp);

router.get("/", authMiddleware,  SalaryHeadM.fetchSalaryHead);

router.post("/create", authMiddleware, SalaryHeadM.createSalaryHeadCtrl);

router.post("/allsalaryheadmaster", authMiddleware, SalaryHeadM.GetAllSalaryHeadCntr);
module.exports = router;    