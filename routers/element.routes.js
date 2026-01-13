const express=require('express');
const router=express.Router();
const { getAllCompanies,loginAdministrator }=require('../controllers/element.controller');

router.get('/getAllCompanies', getAllCompanies)

router.post('/auth/login', loginAdministrator);

module.exports=router;