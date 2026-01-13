const express = require( 'express' );
const router = express.Router();

const { getExistingFNFDetailsController,getFullAndFinalCode, getFNFSalaryDetailsController, getEligibleEmployeesController, getFnfByEmployeeController, showFNFDetails, createFNF, updateFNF, fetchPayRegister, downloadExcel, createEncashment, updateEncashment, deleteEncashment, generatePayRegister } = require('../controllers/FNF.controller');



router.get("/get-existing-details", getExistingFNFDetailsController);
router.post("/salary-details", getFNFSalaryDetailsController);
router.get("/employee/:empCode", getFnfByEmployeeController);
router.get("/employees/eligible", getEligibleEmployeesController);
router.post("/generate-code", getFullAndFinalCode);
// Show salary details for FNF (when user clicks "Show" in UI)
router.post("/show-details", showFNFDetails);
router.post("/create", createFNF);
router.put("/update", updateFNF);

//encashment
router.post("/create-encashment", createEncashment);
router.put("/:fullandFinalCode/:sNo", updateEncashment);
router.delete("/:fullandFinalCode/:sNo", deleteEncashment);


// fnf payregister
router.get("/fnfpayregister", fetchPayRegister);

router.get("/payroll/final-pay-register", generatePayRegister);

router.get("/fnfpayregister/excel", downloadExcel);

module.exports = router;
   