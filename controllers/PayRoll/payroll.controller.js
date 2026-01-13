const { getSalarySlipInMaster, saveSalarySlipDetailsdb, getSalarySlipByAttendance } = require("../../repository/PayRoll/payroll.repository");

const saveSalarySlipDetails = async (req, res) => {
  try {
    const salarySlipDetails = req.body;
    if (!salarySlipDetails || !Array.isArray(salarySlipDetails)) {
      return res.status(400).json({
        success: false,
        message: "Invalid or empty data provided for salary slip details",
      });
    }
    const salarySlipAvialable = await getSalarySlipInMaster( salarySlipDetails[0].SalarySlipCode );
    if (!salarySlipAvialable) {
      return res.status(200).json({
        success: false,
        message: "There are no salary slip created in master for this code ! create this first ",
      });
    }
    const result = await saveSalarySlipDetailsdb(salarySlipDetails);
    if (result.status === "error") {
      return res.status(400).json({ success: false, message: result.message });
    }
    return res.status(200).json({ success: true, message: "Cheack The Result ", data: result });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
// ✅ API: Get SalarySlipCode by AttendenceCode
const getSalarySlipCodeByAttendance = async (req, res) => {
  try {
    const { AttendenceCode } = req.body;

    if (!AttendenceCode) {
      return res.status(400).json({
        success: false,
        message: "AttendenceCode is required",
      });
    }

    const salarySlip = await getSalarySlipByAttendance(AttendenceCode);

    if (!salarySlip) {
      return res.status(404).json({
        success: false,
        message: "No SalarySlip found for the given AttendenceCode",
      });
    }

    return res.status(200).json({
      success: true,
      message: "SalarySlipCode fetched successfully",
      data: salarySlip,
    });
  } catch (error) {
    console.error("Error in getSalarySlipCodeByAttendance:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
module.exports = {saveSalarySlipDetails,getSalarySlipCodeByAttendance}


