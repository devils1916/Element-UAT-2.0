const { getSequelize } = require('../config/sequelizeManager.js');
const { executeQuery } = require('../utils/dbhelper.util.js');
const { getDatabaseNameByCompanyCode } = require('./element.repository.js');

const getOrgUnits = async (newCompanyCode) => {
  const companyDetails = await getDatabaseNameByCompanyCode(newCompanyCode);
  if (!companyDetails?.length) {
    return { status: "error", message: "Company not found" };
  }
  const sequelize = await getSequelize(companyDetails[0].CompanyDatabaseName);
  return await sequelize.query(`select OrgUnitCode,OrgUnitName from Org_Unit where newCompanyCode = '${newCompanyCode}'`, { type: sequelize.QueryTypes.SELECT });
};

const getProfileNames = async (newCompanyCode) => {
  const companyDetails = await getDatabaseNameByCompanyCode(newCompanyCode);
  if (!companyDetails?.length) {
    return { status: "error", message: "Company not found" };
  }
  const sequelize = await getSequelize(companyDetails[0].CompanyDatabaseName);
  return await sequelize.query(`select Profile_Code,Profile_Name from Profile_Name where newCompanyCode = '${newCompanyCode}'`, { type: sequelize.QueryTypes.SELECT });
};

const getDepartments = async (newCompanyCode) => {
  const companyDetails = await getDatabaseNameByCompanyCode(newCompanyCode);
  if (!companyDetails?.length) {
    return { status: "error", message: "Company not found" };
  }
  const sequelize = await getSequelize(companyDetails[0].CompanyDatabaseName);
  return await sequelize.query(`select Dep_Code,Dep_Name from Depart_info where newCompanyCode = '${newCompanyCode}'`, { type: sequelize.QueryTypes.SELECT });
};

const getDivisions = async (newCompanyCode) => {
  const companyDetails = await getDatabaseNameByCompanyCode(newCompanyCode);
  if (!companyDetails?.length) {
    return { status: "error", message: "Company not found" };
  }
  const sequelize = await getSequelize(companyDetails[0].CompanyDatabaseName);
  return await sequelize.query(`select Division_Code,Division_Name from Division_info where newCompanyCode = '${newCompanyCode}'`, { type: sequelize.QueryTypes.SELECT });
};

const getSaleOffices = async (newCompanyCode) => {
  const companyDetails = await getDatabaseNameByCompanyCode(newCompanyCode);
  if (!companyDetails?.length) {
    return { status: "error", message: "Company not found" };
  }
  const sequelize = await getSequelize(companyDetails[0].CompanyDatabaseName);
  return await sequelize.query(`select Sale_officeCode,Sale_officeName from Sale_Office_info where newCompanyCode = '${newCompanyCode}'`, { type: sequelize.QueryTypes.SELECT });
};

const getDesignations = async (newCompanyCode) => {
  const companyDetails = await getDatabaseNameByCompanyCode(newCompanyCode);
  if (!companyDetails?.length) {
    return { status: "error", message: "Company not found" };
  }
  const sequelize = await getSequelize(companyDetails[0].CompanyDatabaseName);
  return await sequelize.query(`select DesignationCode,DesignationName from HavellsDesignation where newCompanyCode = '${newCompanyCode}'`, { type: sequelize.QueryTypes.SELECT });
};

const getEmployeeTypes = async (newCompanyCode) => {
  const companyDetails = await getDatabaseNameByCompanyCode(newCompanyCode);
  if (!companyDetails?.length) {
    return { status: "error", message: "Company not found" };
  }
  const sequelize = await getSequelize(companyDetails[0].CompanyDatabaseName);
  return await sequelize.query(`select Emp_Type from Employee_Type where newCompanyCode = '${newCompanyCode}'`, { type: sequelize.QueryTypes.SELECT });
};

const getChannelDetailUrldb = async (newCompanyCode) => {
  const companyDetails = await getDatabaseNameByCompanyCode(newCompanyCode);
  if (!companyDetails?.length) {
    return { status: "error", message: "Company not found" };
  }
  const sequelize = await getSequelize(companyDetails[0].CompanyDatabaseName);
  return await sequelize.query("select * from channelList", { type: sequelize.QueryTypes.SELECT });
}

module.exports = {

  getOrgUnits,
  getProfileNames,
  getDepartments,
  getDepartments,
  getDivisions,
  getSaleOffices,
  getDesignations,
  getEmployeeTypes,
  getChannelDetailUrldb

}