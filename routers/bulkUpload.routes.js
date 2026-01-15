const express = require("express");
const {createFormattedCodeController, getFormattedCodeController, getAttendanceCode } = require("../controllers/bulkUpload.controller");
const router = express.Router();


router.post("/create-code", createFormattedCodeController);
router.post("/get-formatted-code", getFormattedCodeController); // Assuming you want to keep this route for some reason
router.post("/get-attendance-code", getAttendanceCode);
module.exports = router;