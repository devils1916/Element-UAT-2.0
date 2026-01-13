const express = require("express");
const { getAllDepartments, addDepartment, editDepartment, removeDepartment, getDepartment } = require("../../controllers/Department/department.controller");



const router = express.Router();

router.get("/", getAllDepartments);
router.get("/:code", getDepartment);
router.post("/", addDepartment);
router.put("/:code", editDepartment);
router.delete("/:code", removeDepartment);

module.exports = router;
