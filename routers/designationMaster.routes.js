// File: routes/designationRoutes.js
const express = require("express");
const router = express.Router();
const designationController = require("../controllers/designationMaster.controller");
const authMiddleware = require("../middleware/auth.Middleware")
router.post("/", authMiddleware,  designationController.create);      // Create
router.get("/", authMiddleware, designationController.getAll);       // Read All
router.get("/:id",authMiddleware, designationController.getById);   // Read One
router.put("/:id",authMiddleware, designationController.update);    // Update
router.delete("/:id", authMiddleware, designationController.remove); // Delete

module.exports = router;
