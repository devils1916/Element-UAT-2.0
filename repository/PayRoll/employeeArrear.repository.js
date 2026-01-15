const { getSequelize } = require("../../config/sequelizeManager");
const EmployeeArrearMaster = require("../../models/PayRoll/EmployeeArrearMaster.model");
const { getDatabaseNameByCompanyCode } = require("../element.repository");


const createEmployeeArrear = async (data, companyCode) => {
  const companyDetails = await getDatabaseNameByCompanyCode(companyCode);

  if (!companyDetails?.length) {
    throw new CustomError(404, "Company not found");
  }

  const sequelize = await getSequelize(companyDetails[0].CompanyDatabaseName);
  const EmployeeArrearMaster = sequelize.models.EmployeeArrearMaster;

  return await EmployeeArrearMaster.create(data);
};

module.exports = {
  createEmployeeArrear,
};
