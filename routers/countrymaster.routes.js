const express=require('express');
const router=express.Router();
const country=require("../controllers/countryMaster.controller.js")
const authMiddleware = require("../middleware/auth.Middleware.js");

router.get("/getState",
    authMiddleware,
    country.getAllState
    );

router.post("/state/getCity", 
    authMiddleware,
    country.getAllCity
);


module.exports=router;