const express=require('express');
const router=express.Router();
const dropdown=require('../controllers/dropdowns.controller');
const authMiddleware = require('../middleware/auth.Middleware');

//from table Org_Unit to get column data Org_Unit_Code and OrgUnitname
router.get("/organizationUnit",authMiddleware, dropdown.getOrganizationUnit);         

//from table Profile_Name to get column Profile_Code and Profile_name
router.get("/profileName",authMiddleware, dropdown.getProfileName );

//from table Depart_info to get  column Dep_Code and  Dep_Name
router.get("/departmentInfo",authMiddleware, dropdown.getDepartmentInfo);

//from table Division_info to get column Division_code and devision_name
router.get("/devision",authMiddleware,  dropdown.getDevision);

//from table Sale_office_Unit to get column Sale_officeCode and name
router.get("/saleOfficeUnit",authMiddleware, dropdown.getSaleOfficeUnit);

//from table HavellsDesignation  to get column DesignationCode and name 
router.get("/Designation",authMiddleware, dropdown.getDesignation);

//from table Employee_Type to get column Usertype
router.get("/employeeType",authMiddleware, dropdown.getEmpType);

//get channel detail url
router.get("/channelCurl",authMiddleware, dropdown.getChannelDetailUrl);


module.exports=router;