const { getSequelize } = require("../../config/sequelizeManager");
const Department = require("../../models/Department/departmentMaster.model");
const { getDatabaseNameByCompanyCode } = require("../element.repository");

// Get all departments
const findAllDepartments = async (companyCode) => {
  // Get company details
  const companyDetails = await getDatabaseNameByCompanyCode(companyCode);
  if (!companyDetails || companyDetails.length === 0) {
    throw new CustomError(404, "Company not found");
  }

  // Connect to the company's database
  const sequelize = await getSequelize(companyDetails[0].CompanyDatabaseName);
  const  DepartmentMaster = sequelize.models.DepartmentMaster;
  return await DepartmentMaster.findAll();
};

// Get single department by Code
const findDepartmentByCode = async (DepartmentCode, companyCode) => {
  // Get company details
  const companyDetails = await getDatabaseNameByCompanyCode(companyCode);
  if (!companyDetails || companyDetails.length === 0) {
    throw new CustomError(404, "Company not found");
  }

  // Connect to the company's database
  const sequelize = await getSequelize(companyDetails[0].CompanyDatabaseName);
  const  DesignationMaster = sequelize.models.DesignationMaster;
  return await DesignationMaster.findOne({ where: { DepartmentCode } });
};

// Create new department
const createDepartment = async (data, companyCode) => {
  // Get company details
  const companyDetails = await getDatabaseNameByCompanyCode(companyCode);
  if (!companyDetails || companyDetails.length === 0) {
    throw new CustomError(404, "Company not found");
  }

  // Connect to the company's database
  const sequelize = await getSequelize(companyDetails[0].CompanyDatabaseName);
  const  DesignationMaster = sequelize.models.DesignationMaster;
  const existing = await DesignationMaster.findOne({ where: { DepartmentCode: data.DepartmentCode } });
  if (existing) throw new Error("Department with this code already exists!");
  return await Department.create(data);
};

// Update department
const updateDepartment = async (DepartmentCode, data, companyCode) => {
  // Get company details
  const companyDetails = await getDatabaseNameByCompanyCode(companyCode);
  if (!companyDetails || companyDetails.length === 0) {
    throw new CustomError(404, "Company not found");
  }

  // Connect to the company's database
  const sequelize = await getSequelize(companyDetails[0].CompanyDatabaseName);
  const  DesignationMaster = sequelize.models.DesignationMaster;
  const dept = await DesignationMaster.findOne({ where: { DepartmentCode } });
  if (!dept) throw new Error("Department not found!");
  await dept.update(data);
  return dept;
};

// Delete department
const deleteDepartment = async (DepartmentCode, companyCode) => {
  // Get company details
  const companyDetails = await getDatabaseNameByCompanyCode(companyCode);
  if (!companyDetails || companyDetails.length === 0) {
    throw new CustomError(404, "Company not found");
  }

  // Connect to the company's database
  const sequelize = await getSequelize(companyDetails[0].CompanyDatabaseName);
  const  DesignationMaster = sequelize.models.DesignationMaster;
  const dept = await DesignationMaster.findOne({ where: { DepartmentCode } });
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
