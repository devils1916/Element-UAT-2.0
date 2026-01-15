const express = require("express");
const { getAllDepartments, addDepartment, editDepartment, removeDepartment, getDepartment } = require("../../controllers/Department/department.controller");
const authMiddleware = require("../../middleware/auth.Middleware");


const router = express.Router();

router.get("/", authMiddleware, getAllDepartments);
router.get("/:code", authMiddleware,getDepartment);
router.post("/", authMiddleware, addDepartment);
router.put("/:code", authMiddleware, editDepartment);
router.delete("/:code", authMiddleware, removeDepartment);

module.exports = router;
