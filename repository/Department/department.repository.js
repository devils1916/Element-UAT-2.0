const Department = require("../../models/Department/departmentMaster.model");

// Get all departments
const findAllDepartments = async () => {
  return await Department.findAll();
};

// Get single department by Code
const findDepartmentByCode = async (DepartmentCode) => {
  return await Department.findOne({ where: { DepartmentCode } });
};

// Create new department
const createDepartment = async (data) => {
  const existing = await Department.findOne({ where: { DepartmentCode: data.DepartmentCode } });
  if (existing) throw new Error("Department with this code already exists!");
  return await Department.create(data);
};

// Update department
const updateDepartment = async (DepartmentCode, data) => {
  const dept = await Department.findOne({ where: { DepartmentCode } });
  if (!dept) throw new Error("Department not found!");
  await dept.update(data);
  return dept;
};

// Delete department
const deleteDepartment = async (DepartmentCode) => {
  const dept = await Department.findOne({ where: { DepartmentCode } });
  if (!dept) throw new Error("Department not found!");
  await dept.destroy();
  return true;
};

module.exports = {
  findAllDepartments,
  findDepartmentByCode,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};
