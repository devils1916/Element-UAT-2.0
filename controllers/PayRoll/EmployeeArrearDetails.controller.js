const {
  getArrearDetailsByTransactionCode,
  saveArrearFull,
  getEmployeeArrearMasterByTransactionCode,
} = require("../../repository/PayRoll/EmployeeArrearDetails.repository");

// GET by TransactionCode
const fetchDetailsByTransactionCode = async (req, res) => {
  try {
    const { transactionCode } = req.query;

    if (!transactionCode) {
      return res
        .status(400)
        .json({ success: false, message: "TransactionCode is required" });
    }

    const result = await getArrearDetailsByTransactionCode(transactionCode);

    if (result.success && result.data.length > 0) {
      return res.status(200).json({
        success: true,
        message: `Data fetched successfully for TransactionCode: ${transactionCode}`,
        data: result.data,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: `No data found for TransactionCode: ${transactionCode}`,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// POST - Save
const postEmployeeArrearDetails = async (req, res) => {
  try {
    const { master, details } = req.body;

    if (!master || !details || details.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid payload" });
    }

    for (let item of details ) {
      if (!item.TransactionCode || !item.HeadCode) {
        return res.status(400).json({
          success: false,
          message: "Each item must have TransactionCode and HeadCode",
        });
      }
    }

    const result = await saveArrearFull( master, details );

    if (result.success) {
      return res
        .status(200)
        .json({ success: true, message: result.message });
    } else {
      return res.status(400).json({ success: false, message: result.message });
    }
  } catch (error) {
    console.error("Save Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
// GET API to fetch arrear details by transactionCode
// ✅ GET - Arrear Master by TransactionCode
const fetchEmployeeArrearMaster = async (req, res) => {
  try {
    const { transactionCode } = req.query;

    if (!transactionCode) {
      return res.status(400).json({
        success: false,
        message: "TransactionCode is required",
      });
    }

    const result = await getEmployeeArrearMasterByTransactionCode(transactionCode);

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: "Arrear master record fetched successfully",
        data: result.data,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: result.message,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
module.exports = {
  fetchDetailsByTransactionCode,
  postEmployeeArrearDetails,
  fetchEmployeeArrearMaster
};
