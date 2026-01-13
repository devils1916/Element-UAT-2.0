const salarySlipEmployeeRepo = require('../repository/salarySlipEmployee.repository');

const fetchByAttendenceCode = async (req, res) => {
  try {
    const { AttendenceCode } = req.body;

    if (!AttendenceCode) {
      return res.status(400).json({
        success: false,
        message: 'AttendenceCode is required',
      });
    }

    const result = await salarySlipEmployeeRepo.getByAttendenceCode(AttendenceCode);

    res.json({ success: true, data: result });
  } catch (error) {
    console.error("Error in fetchByAttendenceCode:", error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  fetchByAttendenceCode,
};
