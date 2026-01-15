const express = require( 'express' );
const router = express.Router();
const SalaryHeadM = require( '../controllers/salaryHeadMaster.controller' );
const authMiddleware = require('../middleware/auth.Middleware');

router.get("/create/getNewSalaryHeadCode", authMiddleware, SalaryHeadM.getNewSalaryHeadCode);           //done

router.post ("/create/newSalaryHead", authMiddleware, SalaryHeadM.createNewSalaryHead)                  //done

// router.post( "/salHead/setGradeAmount", authMiddleware, SalaryHeadM.saveSalaryHeadAmoutGrade );      //no need 

// router.post("/getSalHead/GradeAmount", authMiddleware, SalaryHeadM.getSalaryAmount);                 //no need

router.post("/getMinWages", authMiddleware, SalaryHeadM.getMinimumWages);                               //----------------------------------------------     

router.post("/reimbursement/saveReimbursment", authMiddleware, SalaryHeadM.setReimbursment);            //done

//rout to get employee entitlement by empid 
router.get("/getEntitlement/:empid", authMiddleware,  SalaryHeadM.getEntitlementByEmpId);               //done

// expect { "empids": ["E101", "E102", "E103"] }
router.post("/getEntitlement/many", authMiddleware,  SalaryHeadM.getEntitlementsByEmpIds );             //done   

//rout to save entitle of an employee save into employeeentitlement, view_employeesalarydetailsrep , view_employeeentitlement and employeemaster table 
router.post("/saveEntitle", authMiddleware, SalaryHeadM.saveEntitlement);                               //done                       

//rout to get salary head master to get saleryheadcode and saray head name
router.get("/getSalaryHead", authMiddleware, SalaryHeadM.getSalaryHead);                                //done

router.get("/get-filtered-salary-head", authMiddleware, SalaryHeadM.getFilteredSalaryHead);             //done

router.get('/professionalTax/AllLocations', authMiddleware, SalaryHeadM.getLocationsOfProfessionalTax); //---------------------------------------------

//rout to save GL Details into EmployeeGlDetails table
router.post('/saveGLDetails', authMiddleware, SalaryHeadM.saveGLDetails);                               //done

//router.post('/calculateSalarySlip', authMiddleware, SalaryHeadM.calculateEmployeeSalarySlip);         //no need

router.post('/saveSalarySlip', authMiddleware, SalaryHeadM.saveSalarySlip);                             //done

router.post('/saveSalarySlipDetails', authMiddleware,  SalaryHeadM.saveSalarySlipDetails);              //Done

router.post("/MonthlyEntitlementEntry",authMiddleware, SalaryHeadM.saveMonthlyEntitlementEntry);        //Done

// TDS Routes
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