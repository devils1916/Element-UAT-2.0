const { bulkCreateMonthlyEntitlements, getMonthlyEntitlements } = require('../repository/monthlyEntitlementEntry.repository');

const saveMonthlyEntitlements = async (req, res) => {
  try {
    const { entries } = req.body;
    const companyCode = req.auth.companyCode;

    if (!Array.isArray(entries) || entries.length === 0) {
      return res.status(400).json({ success: false, message: 'No entries provided' });
    }

    const result = await bulkCreateMonthlyEntitlements(entries, companyCode);

    res.status(200).json({
      success: true,
      message: 'Entries saved successfully',
      data: result,
    });

  } catch (error) {
    console.error('Error saving entries:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save entries',
      error: error.message,
    });
  }
};
// get api
const fetchMonthlyEntitlements = async (req, res) => {
  try {
    const companyCode  = req.auth.companyCode;
    const { month, year, branchCode } = req.query;

    const result = await getMonthlyEntitlements({ month, year, branchCode, companyCode });

    res.status(200).json({
      success: true,
      message: 'Fetched successfully',
      data: result
    });
  } catch (error) {
    console.error('Error fetching entries:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch entries',
      error: error.message
    });
  }
};
module.exports = {
  saveMonthlyEntitlements,
  fetchMonthlyEntitlements
};
