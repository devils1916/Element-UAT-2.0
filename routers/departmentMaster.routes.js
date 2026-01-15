// File: routes/departmentRoutes.js
const express = require("express");
const router = express.Router();
const departmentController = require("../controllers/departmentMaster.Controller")

router.post("/", departmentController.create);     // Create
router.get("/", departmentController.getAll);      // Read All
router.get("/:id", departmentController.getById);  // Read One
router.put("/:id", departmentController.update);   // Update
router.delete("/:id", departmentController.remove);// Delete

module.exports = router;
