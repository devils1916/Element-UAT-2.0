const express = require( 'express' );
const router = express.Router();
const branches = require( "../controllers/branchMaster.controller" );
const authMiddleware = require('../middleware/auth.Middleware');
router.get("/get/newBranchCode", branches.getNewBranchCode)

router.get( "/getAllBranchesOfCompany", 
    authMiddleware,
    branches.findAllBranches 
);

router.get( "/getShiftDetails/:branchCode", 
    authMiddleware,
    branches.getShiftDetails 
);

router.post( "/branchDetails", 
    authMiddleware,
    branches.getBranchDetail );

router.post( "/headCommHead",
    authMiddleware,
    branches.getCommercialHead 
);

router.post( "/getAllBranches",
    authMiddleware,
branches.getAllBranches 
);
//above the api is done 
router.put("/getAllBranches/:code",
    authMiddleware,
branches.updateBranchController);

router.post("/createBranch",
authMiddleware,
branches.addBranch);

router.delete("/:code", 
    authMiddleware,
branches.removeBranch);

module.exports = router;