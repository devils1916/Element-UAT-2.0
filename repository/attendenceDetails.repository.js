const { getSequelize } = require('../config/sequelizeManager');
const AttendenceDetails = require('../models/employeeAttendenceDetails.model');
const { getDatabaseNameByCompanyCode } = require('./element.repository');

const getAttendanceByCodeAndEmp = async (AttendenceCode, EmployeeCode, companyCode) => {
  const companyDetails = await getDatabaseNameByCompanyCode(companyCode);
        if (!companyDetails || companyDetails.length === 0) {
            throw new CustomError(404, "Company not found");
        }
        const sequelize = await getSequelize(companyDetails[0].CompanyDatabaseName);

        const AttendenceDetails = sequelize.models.AttendenceDetails;
        if (!AttendenceDetails) throw new Error('AttendenceDetails model not defined in this database');
  return await AttendenceDetails.findOne({
    where: {
      AttendenceCode,
      EmployeeCode
    }
  });
};
// Fetch by AttendenceCode + BranchCode or none

// attendenceDetails.repository.js
const getAttendanceFiltered = async (AttendenceCode, BranchCode, page = 1, limit = 10, companyCode) => {
  try {
    const whereClause = {};

    if (AttendenceCode) {
      whereClause.AttendenceCode = AttendenceCode;
    }

    if (BranchCode) {
      whereClause.BranchCode = BranchCode;
    }

    const offset = (page - 1) * limit;
    const companyDetails = await getDatabaseNameByCompanyCode(companyCode);
        if (!companyDetails || companyDetails.length === 0) {
            throw new CustomError(404, "Company not found");
        }
        const sequelize = await getSequelize(companyDetails[0].CompanyDatabaseName);

        const AttendenceDetails = sequelize.models.AttendenceDetails;
        if (!AttendenceDetails) throw new Error('AttendenceDetails model not defined in this database');

    const { count, rows } = await AttendenceDetails.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['id', 'DESC']] // optional: sort by id or any other column
    });

    return {
      totalRecords: count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / limit),
      data: rows
    };
  } catch (error) {
    throw new Error(`Failed to fetch attendance: ${error.message}`);
  }
};


module.exports = {
  getAttendanceByCodeAndEmp,
  getAttendanceFiltered
};
