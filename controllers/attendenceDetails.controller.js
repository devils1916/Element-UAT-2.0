const { getAttendanceByCodeAndEmp, getAttendanceFiltered } = require('../repository/attendenceDetails.repository');

const fetchAttendanceDetails = async (req, res) => {
  const { AttendenceCode, EmployeeCode } = req.body;

  if (!AttendenceCode || !EmployeeCode) {
    return res.status(400).json({ message: 'AttendenceCode and EmployeeCode are required.' });
  }

  try {
    const details = await getAttendanceByCodeAndEmp(AttendenceCode, EmployeeCode);
    res.status(200).json(details);
  } catch (error) {
    console.error('Error fetching attendance details:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
// ✅ New controller for branch + attendence code

const fetchAttendanceByBranch = async (req, res) => {
  const { AttendenceCode, BranchCode, page, limit } = req.query;

  try {
    const attendance = await getAttendanceFiltered(AttendenceCode, BranchCode, page, limit);

    res.status(200).json({
      success: true,
      data: attendance,
      message: attendance.length > 0 ? 'Attendance records fetched successfully.' : 'No records found.'
    });
  } catch (error) {
    console.error('Error fetching attendance details:', error.message);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};




module.exports = {
  fetchAttendanceDetails,
  fetchAttendanceByBranch
};
