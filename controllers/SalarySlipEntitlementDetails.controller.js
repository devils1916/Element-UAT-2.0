const { getEntitlementDetailsByEmpCode } = require("../repository/SalarySlipEntitlementDetails.repository");


const getByEmpCode = async (req, res) => {
  const { EmpCode } = req.body;

  if (!EmpCode) {
    return res.status(400).json({
      success: false,
      message: "EmpCode is required",
    });
  }

  try {
    const data = await getEntitlementDetailsByEmpCode(EmpCode);
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Controller Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  getByEmpCode,
};
