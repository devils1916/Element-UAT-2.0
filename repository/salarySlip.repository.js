const SalarySlip = require('../models/salarySlip.model');

const getAllSalarySlips = async (filters, page = 1, pageSize = 10) => {
  try {
    const offset = (page - 1) * pageSize;
    const where = {};
     console.log("object", filters)
    if (filters.company) where.CompanyCode = filters.company;
    if (filters.year) where.Years = filters.year;
    if (filters.month) where.Months = filters.month;
    if (filters.branchCode) where.BranchCode = filters.branchCode;
    if (filters.empType) where.EmpType = filters.empType;
      console.log("where", where)
    const { count, rows } = await SalarySlip.findAndCountAll({
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
