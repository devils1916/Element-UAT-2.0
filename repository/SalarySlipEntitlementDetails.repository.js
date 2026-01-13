const SalarySlipEntitlementDetails = require("../models/SalarySlipEntitlementDetails.model");

const getEntitlementDetailsByEmpCode = async (EmpCode) => {
  try {
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
