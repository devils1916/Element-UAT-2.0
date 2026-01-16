const express = require("express");
const {createFormattedCodeController, getFormattedCodeController, getAttendanceCode } = require("../controllers/bulkUpload.controller");
const authMiddleware = require("../middleware/auth.Middleware");
const router = express.Router();


router.post("/create-code", authMiddleware, createFormattedCodeController);             // done 
router.post("/get-formatted-code",authMiddleware, getFormattedCodeController);          //done
router.post("/get-attendance-code",authMiddleware, getAttendanceCode);

module.exports = router;

