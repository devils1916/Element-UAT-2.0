const express=require('express');
const router=express.Router();
const em =require("../controllers/employeeMaster.controller");
const authMiddleware = require('../middleware/auth.Middleware');
const companyDbMiddleware = require('../middleware/companyDb.middleware');

//rout to get all employee with pagination sets of 20   http://localhost:4000/employee/getAll
router.get(
    '/getAll',
    authMiddleware,
    //companyDbMiddleware,
    em.findAllemployees
);

//rout to get employee by id    http://localhost:4000/employee/get/EMP1012
router.get(
    '/get/:id',
    authMiddleware,
    //companyDbMiddleware,
    em.getEmployeeById
);

//rout to get employee of a sapret branch starts with ( HL )  http://localhost:4000/employee/employeesFromBranch/BR00002
router.get(
    '/employeesFromBranch/:branchCode',
    authMiddleware,
    //companyDbMiddleware,
    em.getAllEmployeeFromBranch
);

router.get(
    '/getAllRM/:branchCode',
    authMiddleware,
    //companyDbMiddleware,
    em.getAllRM
);

router.post(
    '/Update',
    authMiddleware,
    //companyDbMiddleware,
    em.saveEmployee
);

router.post(
    '/Update/bulk',
    authMiddleware,
    companyDbMiddleware,
    em.saveBulkEmployees
);

router.post(
    '/register',
    authMiddleware,
    //companyDbMiddleware,
    em.saveNewEmployee
);

router.post(
    '/newRM',
    authMiddleware,
    //companyDbMiddleware,
    em.saveNewRM
);

router.get(
    '/lastEMPid',
    authMiddleware,
    //companyDbMiddleware,
    em.lastEMPid
);

router.get(
    '/LastHLid',
    authMiddleware,
    //companyDbMiddleware,
    em.lastHLid
);

router.get(
    '/departments',
    authMiddleware,
    //companyDbMiddleware,
    em.getDepartment
);

router.post(
    '/departmentcode',
    authMiddleware,
    //companyDbMiddleware,
    em.fetchDepartmentByDescription
);

router.get(
    '/Designations',
    authMiddleware,
    //companyDbMiddleware,
    em.getDesignation
);

router.post(
    '/designationcode',
    authMiddleware,
    //companyDbMiddleware,
    em.fetchDesignationByDescription
);

router.get(
    '/eduQualificationOptions',
    authMiddleware,
    //companyDbMiddleware,
    em.getEduQualificationOptions
);

router.get(
    '/profQualificationOptions',
    authMiddleware,
    //companyDbMiddleware,
    em.getProfQualificationOptions
);

router.get(
    '/allRMs',
    authMiddleware,
    //companyDbMiddleware,
    em.getAllRMs
);

module.exports=router;