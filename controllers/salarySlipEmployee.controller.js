const salarySlipEmployeeRepo = require('../repository/salarySlipEmployee.repository');

const fetchByAttendenceCode = async (req, res) => {
  try {
    const companyCode = req.auth.companyCode;
    const { AttendanceCode } = req.body;

    if (!AttendanceCode) {
      return res.status(400).json({
        success: false,
        message: 'AttendenceCode is required',
      });
    }

    const result = await salarySlipEmployeeRepo.getByAttendenceCode(AttendanceCode, companyCode);

    res.json({ success: true, data: result });
  } catch (error) {
    console.error("Error in fetchByAttendenceCode:", error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  fetchByAttendenceCode,
};
