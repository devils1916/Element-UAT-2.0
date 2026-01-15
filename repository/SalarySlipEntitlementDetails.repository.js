const { getSequelize } = require("../config/sequelizeManager");
const SalarySlipEntitlementDetails = require("../models/SalarySlipEntitlementDetails.model");
const { getDatabaseNameByCompanyCode } = require("./element.repository");

const getEntitlementDetailsByEmpCode = async (EmpCode, companyCode) => {
  try {
    const companyDetails = await getDatabaseNameByCompanyCode(companyCode);

  if (!companyDetails?.length) {
    throw new CustomError(404, "Company not found");
  }

  const sequelize = await getSequelize(companyDetails[0].CompanyDatabaseName);
  const SalarySlipEntitlementDetails = sequelize.models.SalarySlipEntitlementDetails;

    const results = await SalarySlipEntitlementDetails.findAll({
      where: { EmpCode }
    });
    return results;
  } catch (error) {
    throw new Error("Repository Error: " + error.message);
  }
};

module.exports = {
  getEntitlementDetailsByEmpCode,
};
