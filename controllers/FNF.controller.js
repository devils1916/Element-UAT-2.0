const { getExistingFNFDetailsService, getFNFSalaryDetailsService, getEligibleEmployeesService, getFnfByEmployeeService, showFNFDetailsService, createFNFService, updateFNFService, getFullAndFinalPayRegister, generateFullAndFinalCodeRepo, createEncashmentRep, updateEncashmentRep, deleteEncashmentRep } = require("../repository/FNF.repository");
const PayrollService = require("../services/payRoleServiceFNF");
const exportToExcel = require("../utils/excelExport");
// const { exportToExcel } = require("../utils/excelExport.js");


const getExistingFNFDetailsController = async (req, res) => {
  try {

    const result = await getExistingFNFDetailsService(req.query);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getFNFSalaryDetailsController = async (req, res) => {
  try {
    const { code, empCode } = req.body;
    console.log(req.body)
    const result = await getFNFSalaryDetailsService(code, empCode);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getFnfByEmployeeController = async (req, res) => {
  try {
    const { empCode } = req.params;

    if (!empCode) {
      return res.status(400).json({ error: "empCode is required" });
    }

    const result = await getFnfByEmployeeService(empCode);

    if (!result) {
      return res.status(404).json({ message: "FNF record not found for this employee" });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getEligibleEmployeesController = async (req, res) => {
  try {
    const { branchCode, search } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const result = await getEligibleEmployeesService(branchCode, page, limit, search);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const showFNFDetails = async (req, res) => {
  try {
    const result = await showFNFDetailsService(req.body);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

const createFNF = async (req, res) => {
  try {
    const result = await createFNFService(req.body);
    return res.status(201).json(result);
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

const updateFNF = async (req, res) => {
  try {
    const result = await updateFNFService(req.body);
    return res.status(200).json(result);
  } catch (error) {
    console.error("❌ Error updating FNF:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};


//fnf pay resister
const fetchPayRegister = async (req, res) => {
  try {
    const { month, year, empType, branchCode } = req.query;
    const data = await getFullAndFinalPayRegister({
      month,
      year,
      empType,
      branchCode,
    });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const downloadExcel = async (req, res) => {
  try {
    const { month, year, empType, branchCode } = req.query;
    const data = await getFullAndFinalPayRegister({
      month,
      year,
      empType,
      branchCode,
    });
    const buffer = await exportToExcel(data, `FullAndFinal_${month}_${year}`);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=PayRegister_${month}_${year}.xlsx`
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const getFullAndFinalCode = async (req, res) => {
  try {
    const { branchCode } = req.body;
    if (!branchCode) return res.status(400).json({ message: "Branch code required" });

    const code = await generateFullAndFinalCodeRepo(branchCode);
    res.status(201).json({ FullandFinalCode: code });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const createEncashment = async (req, res) => {
  try {
    const detail = await createEncashmentRep(req.body);
    res.json(detail);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateEncashment = async (req, res) => {
  try {
    const { fullandFinalCode, sNo } = req.params;
    const detail = await updateEncashmentRep(fullandFinalCode, sNo, req.body);
    res.json(detail);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteEncashment = async (req, res) => {
  try {
    const { fullandFinalCode, sNo } = req.params;
    const result = await deleteEncashmentRep(fullandFinalCode, sNo);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const generatePayRegister = async (req, res) => {
  try {
    const { months, years, empType, branch } = req.query;

    if (!months || !years) {
      return res.status(400).json({
        error: 'Months and years parameters are required'
      });
    }

    const payRegister = await PayrollService.generatePayRegister( months, years, empType || 'Full Time', branch || 'All Branch' );

    res.status(200).json({
      success: true,
      data: payRegister,
      count: payRegister.length
    });

  } catch (Error) {
    res.status(500).json({ success: false, message: Error.message })
  }
}


module.exports = {
  getExistingFNFDetailsController,
  getFNFSalaryDetailsController,
  getEligibleEmployeesController,
  getFnfByEmployeeController,
  getFullAndFinalCode,
  showFNFDetails,
  createFNF,
  updateFNF,
  fetchPayRegister,
  downloadExcel,
  createEncashment,
  updateEncashment,
  deleteEncashment,
  generatePayRegister
};