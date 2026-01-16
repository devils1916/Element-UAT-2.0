// File: services/designationService.js
const DesignationMaster = require("../models/designationMaster.model");
const {getDatabaseNameByCompanyCode} = require("../repository/element.repository");
const {getSequelize}  = require ("../config/sequelizeManager");''

const createDesignationRepo = async (data, companyCode) => {

  // Get company details
  const companyDetails = await getDatabaseNameByCompanyCode(companyCode);
  if (!companyDetails || companyDetails.length === 0) {
    throw new CustomError(404, "Company not found");
  }

  // Connect to the company's database
  const sequelize = await getSequelize(companyDetails[0].CompanyDatabaseName);
  const  DesignationMaster = sequelize.models.DesignationMaster;

  return await DesignationMaster.create(data);
};

const getAllDesignationsRepo = async (companyCode) => {
  // Get company details
  const companyDetails = await getDatabaseNameByCompanyCode(companyCode);
  if (!companyDetails || companyDetails.length === 0) {
    throw new CustomError(404, "Company not found");
  }

  // Connect to the company's database
  const sequelize = await getSequelize(companyDetails[0].CompanyDatabaseName);
  const  DesignationMaster = sequelize.models.DesignationMaster;

  return await DesignationMaster.findAll();
};

const getDesignationByIdRepo = async (id, companyCode) => {
  // Get company details
  const companyDetails = await getDatabaseNameByCompanyCode(companyCode);
  if (!companyDetails || companyDetails.length === 0) {
    throw new CustomError(404, "Company not found");
  }

  // Connect to the company's database
  const sequelize = await getSequelize(companyDetails[0].CompanyDatabaseName);
  const  DesignationMaster = sequelize.models.DesignationMaster;

  return await DesignationMaster.findByPk(id);
};

const updateDesignationRepo = async (id, data, companyCode) => {
  // Get company details
  const companyDetails = await getDatabaseNameByCompanyCode(companyCode);
  if (!companyDetails || companyDetails.length === 0) {
    throw new CustomError(404, "Company not found");
  }

  // Connect to the company's database
  const sequelize = await getSequelize(companyDetails[0].CompanyDatabaseName);
  const  DesignationMaster = sequelize.models.DesignationMaster;

  const designation = await DesignationMaster.findByPk(id);
  if (!designation) return null;

  await designation.update(data);
  return designation;
};

const deleteDesignationRepo = async (id, companyCode) => {
  // Get company details
  const companyDetails = await getDatabaseNameByCompanyCode(companyCode);
  if (!companyDetails || companyDetails.length === 0) {
    throw new CustomError(404, "Company not found");
  }

  // Connect to the company's database
  const sequelize = await getSequelize(companyDetails[0].CompanyDatabaseName);
  const  DesignationMaster = sequelize.models.DesignationMaster;

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
