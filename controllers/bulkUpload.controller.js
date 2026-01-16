const { getFormattedCode, createFormattedCode, getAttendanceCodeRepo } = require("../repository/bulkUpload.repository");

const createFormattedCodeController = async (req, res) => {
  const newCompanyCode = req.auth.companyCode
  const { CompanyCode, BranchCode, Head, Year, Month } = req.body;
  if (!CompanyCode || !BranchCode || !Head || !Year || !Month) {
    return res.status(400).json({
      success: false,
      code: null,
      message: "Missing required fields: CompanyCode, BranchCode, Year, Month and Head are all required.",
    });
  }

  try {
    const code = await createFormattedCode({ newCompanyCode, CompanyCode, BranchCode, Head, Year, Month });
    res.status(200).json({ success: true, code });
  } catch (error) {
    console.error("Error in generateCode controller:", error.message);
    res.status(500).json({ success: false, message: error.message, code: null });
  }
};

const getFormattedCodeController = async (req, res) => {
  const { CompanyCode, BranchCode, Head } = req.body;
  if (!CompanyCode || !BranchCode || !Head) {
    return res.status(400).json({
      success: false,
      code: null,
      message: "Missing required fields: CompanyCode, BranchCode, Year, Month and Head are all required.",
    });
  }
  try {
    const newCompanyCode = req.auth.companyCode
    const code = await getFormattedCode({ newCompanyCode, CompanyCode, BranchCode, Head });
    res.status(200).json({ success: true, code });
  } catch (error) {
    console.error("Error in generateCode controller:", error.message);
    res.status(500).json({ success: false, message: error.message, code: null });
  }
};

const getAttendanceCode = async (req, res) => {
  const { CompanyCode, BranchCode, Year, Month } = req.body;

   const newCompanyCode = req.auth.companyCode

  if (!CompanyCode || !BranchCode || !Year || !Month) {
    return res.status(400).json({
      success: false,
      code: null,
      message: "Missing required fields: CompanyCode, BranchCode, Year and Month are all required.",
    });
  }

  try {
    const code = await getAttendanceCodeRepo({ newCompanyCode, CompanyCode, BranchCode, Year, Month });
    res.status(200).json({ success: true, code });
  } catch (error) {
    console.error("Error in generateCode controller:", error.message);
    res.status(500).json({ success: false, message: error.message, code: null });
  }
};


module.exports = { createFormattedCodeController, getFormattedCodeController, getAttendanceCode };
