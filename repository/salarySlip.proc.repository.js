const { element } = require('../config/db');
const {getDatabaseNameByCompanyCode} = require('../repository/element.repository');
const {getSequelize} = require('../config/sequelizeManager');
const getEmpPayRegister = async (Month, Year, EmpType, BranchCode, page = 1, limit = 10, companyCode) => {
  try {
    const companyDetails = await getDatabaseNameByCompanyCode(companyCode);

  if (!companyDetails?.length) {
    throw new CustomError(404, "Company not found");
  }

  const sequelize = await getSequelize(companyDetails[0].CompanyDatabaseName);
  console.log('........ Proc_EmpPayRegister connect', sequelize);
    const result = await sequelize.query(
      `EXEC dbo.Proc_EmpPayRegister :Month, :Year, :EmpType, :BranchCode`,
      {
        replacements: { Month, Year, EmpType, BranchCode },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    const totalRecords = result.length;
    const totalPages = Math.ceil(totalRecords / limit);
    const offset = (page - 1) * limit;

    const paginatedData = result.slice(offset, offset + limit);

    return {
      data: paginatedData,
      totalRecords,
      totalPages,
      currentPage: page,
    };
  } catch (error) {
    console.error('Error executing Proc_EmpPayRegister:', error);
    throw error;
  }
};

module.exports = {
  getEmpPayRegister,
};
