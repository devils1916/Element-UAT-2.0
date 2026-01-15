const express=require('express');
const router=express.Router();
const contectUs=require("../controllers/contectUs.controller")
const authMiddleware = require("../middleware/auth.Middleware");

router.get("/getAllRequestToContact", 
    authMiddleware,
    contectUs.getAllContact
);

router.post("/requestToContact",
    authMiddleware,
     contectUs.saveContact
    );

module.exports=router;