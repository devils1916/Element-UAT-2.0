// File: services/departmentService.js
// const DepartmentMaster = require("../models/DepartmentMaster");

const DepartmentMaster = require("../models/departmentMaster.model");

const createDepartmentRepo = async (data) => {
  return await DepartmentMaster.create(data);
};

const getAllDepartmentsRepo = async () => {
  return await DepartmentMaster.findAll();
};

const getDepartmentByIdRepo = async (id) => {
  return await DepartmentMaster.findByPk(id);
};

const updateDepartmentRepo = async (id, data) => {
  const department = await DepartmentMaster.findByPk(id);
  if (!department) return null;

  await department.update(data);
  return department;
};

const deleteDepartmentRepo = async (id) => {
  const department = await DepartmentMaster.findByPk(id);
  if (!department) return null;

  await department.destroy();
  return department;
};

module.exports = {
  createDepartmentRepo,
  getAllDepartmentsRepo,
  getDepartmentByIdRepo,
  updateDepartmentRepo,
  deleteDepartmentRepo,
};
