const { element } = require('../config/db');

const getEmpPayRegister = async (Month, Year, EmpType, BranchCode, page = 1, limit = 10) => {
  try {
    const result = await element.query(
      `EXEC Proc_EmpPayRegister :Month, :Year, :EmpType, :BranchCode`,
      {
        replacements: { Month, Year, EmpType, BranchCode },
        type: element.QueryTypes.SELECT,
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
