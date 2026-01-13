const AttendenceDetails = require('../models/employeeAttendenceDetails.model');

const getAttendanceByCodeAndEmp = async (AttendenceCode, EmployeeCode) => {
  return await AttendenceDetails.findOne({
    where: {
      AttendenceCode,
      EmployeeCode
    }
  });
};
// Fetch by AttendenceCode + BranchCode or none

// attendenceDetails.repository.js
const getAttendanceFiltered = async (AttendenceCode, BranchCode, page = 1, limit = 10) => {
  try {
    const whereClause = {};

    if (AttendenceCode) {
      whereClause.AttendenceCode = AttendenceCode;
    }

    if (BranchCode) {
      whereClause.BranchCode = BranchCode;
    }

    const offset = (page - 1) * limit;

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
