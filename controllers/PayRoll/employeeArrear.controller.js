const { createEmployeeArrear } = require("../../repository/PayRoll/employeeArrear.repository");


const postEmployeeArrear = async (req, res) => {
  try {
    const data = req.body;

    // ✅ Force today's date
    const today = new Date().toISOString().split('T')[0];
    data.TransactionDate = today;

    // ✅ Format optional dates if provided
    data.WEFDate = data.WEFDate ? new Date(data.WEFDate).toISOString().split('T')[0] : null;
    data.TillDate = data.TillDate ? new Date(data.TillDate).toISOString().split('T')[0] : null;

    const newRecord = await createEmployeeArrear(data);
    res.status(201).json({ message: "Employee arrear created successfully", data: newRecord });
  } catch (error) {
    console.error("❌ Sequelize Validation Error:", error);
    res.status(500).json({
      message: error.message || "Internal server error",
      errors: error.errors || [],
    });
  }
};

module.exports = {
  postEmployeeArrear,
};
