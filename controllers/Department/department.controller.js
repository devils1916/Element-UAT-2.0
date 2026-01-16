const { findAllDepartments, findDepartmentByCode, createDepartment, updateDepartment, deleteDepartment } = require("../../repository/Department/department.repository");


const getAllDepartments = async (req, res) => {
  try {
    const companyCode = req.auth.companyCode;
    const data = await findAllDepartments(companyCode);
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getDepartment = async (req, res) => {
  try {
    const companyCode = req.auth.companyCode;
    const dept = await findDepartmentByCode(req.params.code, companyCode);
    if (!dept) return res.status(404).json({ success: false, message: "Department not found" });
    res.status(200).json({ success: true, data: dept });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const addDepartment = async (req, res) => {
  try {
    const companyCode = req.auth.companyCode;
    const dept = await createDepartment(req.body, companyCode);
    res.status(201).json({ success: true, data: dept });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const editDepartment = async (req, res) => {
  try {
    const companyCode = req.auth.companyCode;
    const dept = await updateDepartment(req.params.code, req.body, companyCode);
    res.status(200).json({ success: true, data: dept });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const removeDepartment = async (req, res) => {
  try {
    const companyCode = req.auth.companyCode;
    await deleteDepartment(req.params.code, companyCode);
    res.status(200).json({ success: true, message: "Department deleted" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

module.exports = {
  getAllDepartments,
  getDepartment,
  addDepartment,
  editDepartment,
  removeDepartment,
};
