// File: services/designationService.js
const DesignationMaster = require("../models/designationMaster.model");

const createDesignationRepo = async (data) => {
  return await DesignationMaster.create(data);
};

const getAllDesignationsRepo = async () => {
  return await DesignationMaster.findAll();
};

const getDesignationByIdRepo = async (id) => {
  return await DesignationMaster.findByPk(id);
};

const updateDesignationRepo = async (id, data) => {
  const designation = await DesignationMaster.findByPk(id);
  if (!designation) return null;

  await designation.update(data);
  return designation;
};

const deleteDesignationRepo = async (id) => {
  const designation = await DesignationMaster.findByPk(id);
  if (!designation) return null;

  await designation.destroy();
  return designation;
};

module.exports = {
  createDesignationRepo,
  getAllDesignationsRepo,
  getDesignationByIdRepo,
  updateDesignationRepo,
  deleteDesignationRepo,
};
