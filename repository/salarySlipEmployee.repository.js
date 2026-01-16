const SalarySlipEmployee = require('../models/salarySlipEmployee.model');
const {getDatabaseNameByCompanyCode}  = require('../repository/element.repository');
const {getSequelize} = require ('../config/sequelizeManager');
const getByAttendenceCode = async (AttendanceCode, companyCode) => {
  try {
  const companyDetails = await getDatabaseNameByCompanyCode(companyCode);

  if (!companyDetails?.length) {
    throw new CustomError(404, "Company not found");
  }

  const sequelize = await getSequelize(companyDetails[0].CompanyDatabaseName);
  const SalarySlipEmployee = sequelize.models.SalarySlipEmployee;

  const result = await SalarySlipEmployee.findAll({
    where: {
      AttendenceCode: AttendanceCode,
      newCompanyCode:companyCode
    }
  });

  return result;
} catch (error) {
  console.error("Repository error:", error);
  throw error;
}
}

module.exports = {
  getByAttendenceCode,
};
