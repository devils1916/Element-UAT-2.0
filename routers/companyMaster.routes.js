const express=require('express');
const router=express.Router();
const company =require("../controllers/companyMaster.controller");
const errorMiddleware= require("../middleware/error.middleware");
const authMiddleware = require('../middleware/auth.Middleware');

router.get("/getAllComapanies", 
    authMiddleware, 
    company.findAllCompanies
);
router.post("/createnew",company.createCompany)
router.put("/:code", company.updateCompany);
router.delete("/:code", company.deleteCompany);

module.exports=router;