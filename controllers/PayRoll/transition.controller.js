const { getFormattedCode } = require("../../repository/PayRoll/transition.repository");

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
    const code = await getFormattedCode({ CompanyCode, BranchCode, Head });
    res.status(200).json({ success: true, code });
  } catch (error) {
    console.error("Error in generateCode controller:", error.message);
    res.status(500).json({ success: false, message: error.message, code: null });
  }
};
module.exports ={getFormattedCodeController}