const SalarySlipEmployee = require('../models/salarySlipEmployee.model');

const getByAttendenceCode = async (AttendenceCode) => {
  try {
    const result = await SalarySlipEmployee.findAll({
      where: { AttendenceCode }
    });

    return result;
  } catch (error) {
    console.error("Repository error:", error); // 👈 LOG REPO ERROR
    throw error;
  }
};

module.exports = {
  getByAttendenceCode,
};
