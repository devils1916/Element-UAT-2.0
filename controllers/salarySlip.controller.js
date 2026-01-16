const salarySlipRepo = require('../repository/salarySlip.repository');
const { getSalarySlipByProc } = require('../repository/salarySlip.proc.repository');
const { getEmpPayRegister } = require('../repository/salarySlip.proc.repository');
const getAllSlips = async (req, res) => {
  try {
    const {
      page = 1,
      pageSize = 10,
      month,
      year,
      empType,
      branchCode,
      company
    } = req.query;

    console.log("req.query", req.query)
    const companyCode = req.auth.companyCode;
    const result = await salarySlipRepo.getAllSalarySlips(
      { month, year, empType, branchCode, company },
      parseInt(page),
      parseInt(pageSize),
      companyCode
    );

    res.status(200).json(result);
  } catch (err) {
    console.error('Controller error:', err);
    res.status(500).json({ error: 'Failed to fetch salary slips' });
  }
};




// Rename the local controller function:
const fetchEmpPayRegister = async (req, res) => {
  try {
    const companyCode = req.auth.companyCode;
    const { Month, Year, EmpType, BranchCode, page = 1, limit = 10 } = req.query;

    const data = await getEmpPayRegister(
      Month,
      Year,
      EmpType,
      BranchCode,
      parseInt(page),
      parseInt(limit),
      companyCode
    );

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pay register',
      error: error.message,
    });
  }
};
module.exports = { getAllSlips,  fetchEmpPayRegister };
