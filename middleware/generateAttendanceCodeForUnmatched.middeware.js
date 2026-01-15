const { Op } = require("sequelize");
const SequenceMaster1 = require("../models/SequenceMaster1.model");


const generateAttendanceCodeForUnmatched = async (req, res, next) => {
  try {
    const unmatched = req.unmatchAttendanceList || [];
    const matched = req.matchAttendanceList || [];
    const { companyCode } = req.body.attendanceFilter;

    if (!unmatched.length) return next();

    // Step 1: Get unique BranchCodes from unmatched data
    const uniqueBranches = [...new Set(unmatched.map(item => item.BranchCode))];

    const branchCodeMap = {};

    for (const branchCode of uniqueBranches) {
      // Step 2: Fetch sequence config for the branch
      const record = await SequenceMaster1.findOne({
        where: {
          CompanyCode: companyCode,
          BranchCode: branchCode,
          Head: "Attendence" // Assuming this is fixed
        }
      });

      if (!record) {
        throw new Error(`Prefix config not found for ${companyCode} / ${branchCode}`);
      }

      // Step 3: Generate code string
      const paddedValue = record.Increment.toString().padStart(5, "0");

      const now = new Date();
      const fyStart = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
      const fyEnd = fyStart + 1;
      const financialYear = `${fyStart.toString().slice(-2)}-${fyEnd.toString().slice(-2)}`;

      const generatedCode = `${record.CompanyPrefix}/${record.BranchPrefix}/${record.Prefix}/${paddedValue}/${financialYear}`;

      branchCodeMap[branchCode] = generatedCode;

      // Optional: Update increment if needed (comment out if not inserting/updating)
      // await record.update({ Increment: record.Increment + 1 });
    }

    // Step 4: Assign generated code to unmatched entries
    const updatedUnmatched = unmatched.map(item => ({
      ...item,
      attendanceCode: branchCodeMap[item.BranchCode]
    }));

     const matchAttendanceList = [...matched, ...updatedUnmatched]
    // Step 5: Append to matched list
    req.matchAttendanceList = [...matched, ...updatedUnmatched];
    req.unmatchAttendanceList = [];

    console.log("Generated codes:", matchAttendanceList);

    next();
  } catch (error) {
    console.error("Error generating attendance codes for unmatched:", error);
    res.status(500).json({ error: "Failed to generate attendance codes" });
  }
};

module.exports = {
  generateAttendanceCodeForUnmatched
};
