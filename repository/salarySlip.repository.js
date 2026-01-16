const SalarySlip = require('../models/salarySlip.model');
const {getDatabaseNameByCompanyCode} = require('../repository/element.repository')
const {getSequelize} = require ('../config/sequelizeManager')
const getAllSalarySlips = async (filters, page = 1, pageSize = 10, companyCode)  => {
  try {
    const offset = (page - 1) * pageSize;
    const where = {};
    console.log("object", filters)
    if (filters.company) where.CompanyCode = filters.company;
    if (filters.year) where.Years = filters.year;
    if (filters.month) where.Months = filters.month;
    if (filters.branchCode) where.BranchCode = filters.branchCode;
    if (filters.empType) where.EmpType = filters.empType;
    where.newCompanyCode = companyCode;
    console.log("where", where)
    const companyDetails = await getDatabaseNameByCompanyCode(companyCode);

  if (!companyDetails?.length) {
    throw new CustomError(404, "Company not found");
  }

  const sequelize = await getSequelize(companyDetails[0].CompanyDatabaseName);
  console.log('......',sequelize );
  const SalarySlipMaster = sequelize.models.SalarySlip;
if (!SalarySlipMaster) {
  throw new Error('SalarySlipMaster model not found');
}
    const { count, rows } = await SalarySlipMaster.findAndCountAll({
      attributes: [
        'SalarySlipID',
        'SalarySlipCode',
        'Months',
        'Years',
        'BranchName',
        'CompanyCode',
        'BranchCode',
        'EmpType',
        'TakenOn',
        'IsApproved',
        'AttendenceCode'
      ],
      where,
      offset,
      limit: pageSize,
      order: [['TakenOn', 'DESC']],
    });

    return {
      data: rows,
      totalRecords: count,
      currentPage: page,
      totalPages: Math.ceil(count / pageSize),
      pageSize
    };
  } catch (error) {
    console.error('Repository error:', error);
    throw error;
  }
};

module.exports = { getAllSalarySlips };
