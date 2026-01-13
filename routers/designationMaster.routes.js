// File: routes/designationRoutes.js
const express = require("express");
const router = express.Router();
const designationController = require("../controllers/designationMaster.controller");

router.post("/", designationController.create);      // Create
router.get("/", designationController.getAll);       // Read All
router.get("/:id", designationController.getById);   // Read One
router.put("/:id", designationController.update);    // Update
router.delete("/:id", designationController.remove); // Delete

module.exports = router;
