const express = require("express");
const { getFormattedCodeController } = require("../../controllers/PayRoll/transition.controller");
const router = express.Router();



router.post("/get-formatted-code", getFormattedCodeController);

module.exports = router;
