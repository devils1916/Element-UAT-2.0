const {
  createNewSalaryHeadCode,
  createNewSalaryHeaddb,
  saveUpdate,
  findSalaryByGrade,
  getMinimumWagesByBranch,
  setReimbursmentdb,
  findOneEntitle,
  createEntitle,
  getSalaryHeaddb,
  getLocationsOfProfessionalTaxdb,
  saveGLDetailsdb,
  calculateSalarySlip,
  getSalarySlipInMaster,
  saveSalarySlipDetailsdb,
  saveSalarySlipdb,
  getEmployeesForIncomeTaxComputationFromDB,
  getEmployeeDetailsForIncomeTaxComputationFromDB,
  getSavedIncomeTaxListFromDB,
  getDetailsOfSelectedTaxCodeFromDB,
  findManyEntitle,
  getSalaryBreakupRepo,
  getSalaryHeadDataRepo,
  getSalaryBreakupByEmpRepo,
  createSalaryHead,
  getAllSlaryHead,
  createMonthalyEntitle
} = require('../repository/salaryHeadMaster.repository.js');

const getNewSalaryHeadCode = async (req, res) => {
  try {
    const companyCode = req.auth.companyCode;
    const newSalaryHeadCode = await createNewSalaryHeadCode(companyCode);
    if (newSalaryHeadCode) {
      res.status(200).json({ success: true, code: newSalaryHeadCode })
    }
  } catch (Error) {
    console.error('Error:', Error);
    res.status(500).json({ Error: Error.name });
  }
};

const createNewSalaryHead = async (req, res) => {
  try {
    const data = req.body;
    const companyCode = req.auth.companyCode;
    const saved = await createNewSalaryHeaddb(companyCode, data);
    if (saved === "existed") {
      return res.status(200).json({
        success: false,
        message: "Salary Head Code must me Unique this salary head code is already existed please use a diffrent code !",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Salary Head created successfully",
      data: saved
    });
  } catch (err) {
    console.error("Create Salary Head Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message
    });
  }
};

// const saveSalaryHeadAmoutGrade = async (req, res) => {
//   const { code, companyCode, grade, amount } = req.body;
//   const newCompanyCode = req.auth.companyCode;
//   try {

//     const result = await saveUpdate(code, companyCode, grade, amount, newCompanyCode);

//     if (result === 1) {
//       res.status(200).json({
//         success: true,
//         message: 'salary head details Updated successfully ',
//       })
//     } else if (result === " Salary head not found !   please send a valid salary Head ") {
//       res.status(402).json({
//         success: false,
//         message: ' Pelease select a valid salary head  ',
//         data: result
//       })
//     } else if (result) {
//       res.status(200).json({
//         success: true,
//         message: 'salary head details saved successfully ',
//         data: result
//       })
//     } else {
//       res.status(400).json({
//         success: false,
//         message: 'Error in saving salary head details  '
//       })
//     }
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

// const getSalaryAmount = async (req, res) => {

//   try {
//     const { companyCode, grade } = req.body;
//     const newCompanyCode = req.auth.companyCode;

//     if (!companyCode || !grade) {

//       return res.status(400).json({ success: false, message: 'Company Code And Grade are required !' });
//     }

//     const result = await findSalaryByGrade(newCompanyCode, companyCode, grade);

//     if (result.length > 0) {
//       return res.status(200).json({
//         success: true,
//         message: 'Employee entitlement found successfully',
//         data: result
//       });
//     } else {
//       return res.status(404).json({
//         success: false,
//         message: 'Employee entitlement not found use a diffrent employee id '
//       });
//     }
//   } catch (error) {
//     console.error('Error in fetching salaryHead Amount by Grade:', error.message);
//     res.status(500).json({ success: false, message: 'Internal server error' });
//   }

// };

const getMinimumWages = async (req, res) => {
  const branchCode = req.body.branchCode;
  const newCompanyCode = req.auth.companyCode;
  try {
    const Wages = await getMinimumWagesByBranch(newCompanyCode, branchCode);
    if (Wages.length > 0) {
      res.status(200).json({
        success: true,
        message: "Minimum Wages retrieved successfully",
        data: Wages
      });
    } else {
      res.status(400).json({
        success: true,
        message: " Here minimum wage not saved for this branch please select a valid branch !"
      });
    }
  } catch (error) {
    console.error("Error retrieving Minimum Wages:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve Minimum wages !",
      error: error.message
    });
  }
};

const setReimbursment = async (req, res, next) => {

  try {
    const newCompanyCode = req.auth.companyCode;
    const { empCode, reimbursmentType, EntitlementAmount, SNo } = req.body;

    const result = await setReimbursmentdb(newCompanyCode, empCode, reimbursmentType, EntitlementAmount, SNo);

    if (result) {

      res.status(200).json({
        success: true,
        message: "Reimbursement saved successfully ",
        data: result
      })
    } else {
      res.status(400).json({
        success: false,
        message: " Failed to saving Reimbursement "
      })
    }

  } catch (error) {

    console.error('Error in saving reimbursement :', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });

  }
};

const getEntitlementByEmpId = async (req, res) => {
  try {
    const empid = req.params.empid;
    const newCompanyCode = req.auth.companyCode;

    if (!empid) {

      return res.status(400).json({ success: false, message: 'Employee ID is required' });
    }

    const entitlement = await findOneEntitle(newCompanyCode, empid);

    if (entitlement.length > 0) {
      return res.status(200).json({
        success: true,
        message: 'Employee entitlement found successfully',
        data: entitlement
      });
    } else {
      return res.status(404).json({
        success: false,
        message: 'Employee entitlement not found use a diffrent employee id '
      });
    }
  } catch (error) {
    console.error('Error fetching entitlement:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getEntitlementsByEmpIds = async (req, res) => {
  try {
    const { empids } = req.body;
    const newCompanyCode = req.auth.companyCode;
    if (!empids || !Array.isArray(empids) || empids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "empids array is required in request body",
      });
    }
    const entitlements = await findManyEntitle(newCompanyCode, empids);
    if (entitlements.length > 0) {
      return res.status(200).json({
        success: true,
        message: "Employee entitlements found successfully",
        data: entitlements,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "No entitlements found for provided employee IDs",
      });
    }
  } catch (error) {
    console.error("Error fetching entitlements:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const saveEntitlement = async (req, res) => {
  try {
    const entitlements = req.body;
    const newCompanyCode = req.auth.companyCode;
    if (!Array.isArray(entitlements) || entitlements.length === 0) {
      return res.status(400).json({
        success: false,
        message: ' Invalid or empty data provided for entitlement ',
      });
    }
    const result = await createEntitle(newCompanyCode, entitlements);
    if (result.status === 'error') {
      return res.status(400).json({ success: false, message: result.message });
    }
    return res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

const getSalaryHead = async (req, res, next) => {
  try {
    const newCompanyCode = req.auth.companyCode;
    const salHead = await getSalaryHeaddb(newCompanyCode);
    if (salHead.length > 0) {
      const headData = salHead.map(head => ({
        SalHeadCode: head.Code,
        Head: head.Head,
        Description: head.Description,
        EarningDeduction: head.EarningDeduction
      }));
      res.status(200).json({
        success: true,
        message: "Salary Head Found Succesfully ",
        data: headData
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Salary Head master invoke an error try after sometime",
      })
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getFilteredSalaryHead = async (req, res, next) => {
  try {
    const newCompanyCode = req.auth.companyCode;
    const salHead = await getSalaryHeaddb(newCompanyCode);
    if (salHead.length > 0) {
      const headData = salHead.map(head => ({
        SalHeadCode: head.Code,
        Head: head.Head,
        Description: head.Description,
        EarningDeduction: head.EarningDeduction
      }));

      const filteredData = headData.filter(item => item.SalHeadCode !== "SHC00001" && item.SalHeadCode !== "SHC00002" && item.SalHeadCode !== "SHC00005" && item.SalHeadCode !== "SHC00003" && item.SalHeadCode !== "SHC00004" && item.SalHeadCode !== "SHC00009" && item.SalHeadCode !== "SHC00012" && item.SalHeadCode !== "SHC00014" && item.SalHeadCode !== "SHC00020" && item.SalHeadCode !== "SHC00021" && item.SalHeadCode !== "SHC00029" && item.SalHeadCode !== "SHC00031" && item.SalHeadCode !== "SHC00032" && item.SalHeadCode !== "SHC00033" && item.SalHeadCode !== "SHC00034" && item.SalHeadCode !== "SHC00035" && item.SalHeadCode !== "SHC00013");

      res.status(200).json({
        success: true,
        message: "Salary Head Found Succesfully ",
        data: filteredData
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Salary Head master invoke an error try after sometime",
      })
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getLocationsOfProfessionalTax = async (req, res, next) => {
  try {

    const result = await getLocationsOfProfessionalTaxdb();

    if (result.length > 0) {
      return res.status(200).json({
        success: true,
        message: 'Professional Tax found successfully location wise',
        data: result
      });
    } else {
      return res.status(404).json({
        success: false,
        message: 'Locations of Professional Tax not found'
      });
    }
  } catch (error) {
    console.error('Error in fetching Locations of Professional Tax:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const saveGLDetails = async (req, res) => {
  try {
    const gldetails = req.body;
    const newCompanyCode = req.auth.companyCode;

    const result = await saveGLDetailsdb(newCompanyCode,gldetails);

    if (result.status === 'error') {
      return res.status(400).json({ success: false, message: result.message });
    }
    return res.status(200).json({ success: true, message: result.message });

  } catch (error) {
    res.status(400).json({ success: false, message: 'Internal server error gl details not saved' });
  }
};

// const calculateEmployeeSalarySlip = async (req, res) => {
//   try {
//     const { Month, Year, BranchCode, EmpType } = req.body;

//     function getMonthNumber(monthName) {
//       const months = [
//         "January",
//         "February",
//         "March",
//         "April",
//         "May",
//         "June",
//         "July",
//         "August",
//         "September",
//         "October",
//         "November",
//         "December",
//       ];
//       const index = months.findIndex(
//         (m) => m.toLowerCase() === monthName.toLowerCase()
//       );
//       return index !== -1 ? String(index + 1).padStart(2, "0") : null;
//     }
//     const MonthNo = getMonthNumber(Month);
//     const result = await calculateSalarySlip(
//       Month,
//       MonthNo,
//       Year,
//       BranchCode,
//       EmpType
//     );
//     res.status(200).json({
//       success: true,
//       message: "Salary slip calculated successfully",
//       data: result,
//     });
//   } catch (error) {
//     console.error("Error calculating salary slip:", error.message);
//     res.status(400).json({ success: false, message: "Internal server error" });
//   }
// };

const saveSalarySlip = async (req, res) => {
  try {
    const salarySlipData = req.body;
    const newCompanyCode = req.auth.companyCode;
    if (
      !salarySlipData.salaryData ||
      !Array.isArray(salarySlipData.salaryData) ||
      !salarySlipData.salaryMaster ||
      !salarySlipData.salaryMaster.SalarySlipCode
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid or empty data provided for salary slip",
      });
    }
    const result = await saveSalarySlipdb(newCompanyCode,salarySlipData);

    if (result.status === "error") {
      return res.status(400).json({ success: false, message: result.message });
    }
    return res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const saveSalarySlipDetails = async (req, res) => {
  try {
    const salarySlipDetails = req.body;
    const newCompanyCode = req.auth.companyCode;
    if (!salarySlipDetails || !Array.isArray(salarySlipDetails)) {
      return res.status(400).json({
        success: false,
        message: "Invalid or empty data provided for salary slip details",
      });
    }
    const salarySlipAvialable = await getSalarySlipInMaster(
      newCompanyCode, salarySlipDetails[0].SalarySlipCode
    );
    if (!salarySlipAvialable) {
      return res.status(200).json({
        success: false,
        message:
          "There are no salary slip created in master for this code ! create this first ",
      });
    }s
    const result = await saveSalarySlipDetailsdb(newCompanyCode, salarySlipDetails);
    if (result.status === "error") {
      return res.status(400).json({ success: false, message: result.message });
    }
    return res
      .status(200)
      .json({ success: true, message: "Cheack The Result ", data: result });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// const saveMonthlyEntitlementEntry = async (req, res) => {
//   try {
//     const entitlements = req.body;
//     const newCompanyCode = req.auth.companyCode;
//     if (!Array.isArray(entitlements) || entitlements.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: " Invalid or empty entitlement data ",
//       });
//     }
//     const result = await createMonthalyEntitle(newCompanyCode, entitlements);
//     if (result.status === "error") {
//       return res.status(400).json({ success: false, message: result.message });
//     } else if (result.status === "success") {
//       if (result.existingMonthalyEntitlementEntry.length > 0 && result.existingSalarySlip.length > 0) {
//         return res.status(200).json({
//           success: true,
//           message: `${result.message} ! There are existing monthly entitlement entries and salary slips for some employees. Please review the existing entries.`,
//           data: {
//             ExistingInEntitlement: result.existingMonthalyEntitlementEntry,
//             ExistingInSalarySlip: result.existingSalarySlip
//           }
//         });
//       } else {
//         return res.status(200).json({
//           success: true,
//           message: result.message,
//         });
//       }
//     } else {
//       return res.status(400).json({ success: false, message: result.message });
//     }
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };

const saveMonthlyEntitlementEntry = async (req, res) => {
  try {
    const entitlements = req.body;
    const companyCode = req.auth.companyCode;

    if (!Array.isArray(entitlements) || entitlements.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid or empty entitlement data",
      });
    }

    const result = await createMonthalyEntitle(
      companyCode,
      entitlements
    );

    if (result.status === "error") {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: result.message,
      data: {
        ExistingInEntitlement: result.existingMonthlyEntitlement,
        ExistingInSalarySlip: result.existingSalarySlip,
      },
    });
  } catch (error) {
    console.error("Controller Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


const getEmployeesForIncomeTaxComputation = async (req, res) => {
  try {
    const { financialYear, branchCode } = req.query;
    if (!financialYear || !branchCode) {
      return res.status(400).json({
        success: false,
        message: "Financial Year, Branch Code are required",
      });
    }
    const employees = await getEmployeesForIncomeTaxComputationFromDB(financialYear, branchCode);
    res.status(200).json({
      success: true,
      message: "Employees fetched successfully for income tax computation",
      data: employees,
    });
  } catch (error) {
    console.error("Error fetching employees for income tax computation:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getEmployeeDetailsForIncomeTaxComputation = async (req, res) => {
  try {
    const { empId } = req.query;
    if (!empId) {
      return res.status(400).json({
        success: false,
        message: "Employee ID is required",
      });
    }

    const employees = await getEmployeeDetailsForIncomeTaxComputationFromDB({ empId });

    res.status(200).json({
      success: true,
      message: "Employee details fetched successfully for income tax computation",
      data: employees,
    });
  } catch (error) {
    console.error("Error fetching employee details for income tax computation:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getSavedIncomeTaxList = async (req, res) => {
  try {
    const incomeTaxList = await getSavedIncomeTaxListFromDB();
    res.status(200).json({
      success: true,
      message: "Saved income tax list fetched successfully",
      data: incomeTaxList,
    });
  } catch (error) {
    console.error("Error fetching saved income tax list:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getDetailsOfSelectedTaxCode = async (req, res) => {
  try {
    const { taxCode } = req.query;
    if (!taxCode) {
      return res.status(400).json({
        success: false,
        message: "Tax Code is required",
      });
    }
    const taxDetails = await getDetailsOfSelectedTaxCodeFromDB({ taxCode });
    res.status(200).json({
      success: true,
      message: "Tax code details fetched successfully",
      data: taxDetails,
    });
  } catch (error) {
    console.error("Error fetching tax code details:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

function calculateCTCBreakup(ctc, minimumWages, isMetro) {
  let basic = Math.max(Number(ctc) * 0.40, Number(minimumWages));
  const employerPF = Math.min(basic * 0.12, 1800);
  const gratuity = basic * 0.0481;
  let bonus = 0;
  if (basic > 21001) {
    bonus = 0;
  } else if (basic > 7001 && basic <= 21000) {
    bonus = basic * 0.0833;
  } else if (basic <= 7000) {
    bonus = 7000 * 0.0833;
  }
  const insurance = 0;
  const employerLWF = 0;
  const fixedEmployerNoEsi = employerPF + gratuity + bonus + insurance + employerLWF;
  const hraPercent = isMetro ? 0.50 : 0.40;
  let maxHra = basic * hraPercent;
  const remaining = ctc - fixedEmployerNoEsi;
  const rate = 0.0325;
  const threshold = 21000 * (1 + rate);
  let grossSalary;
  let employerESI;
  if (remaining <= threshold) {
    grossSalary = remaining / (1 + rate);
    employerESI = grossSalary * rate;
  } else {
    grossSalary = remaining;
    employerESI = 0;
  }
  if (basic > grossSalary) {
    basic = grossSalary;
    maxHra = basic * hraPercent;
  }
  const remainingGross = grossSalary - basic;
  let hra = Math.min(maxHra, remainingGross);
  let specialAllowance = remainingGross - hra;
  if (specialAllowance < 0) {
    specialAllowance = 0;
    hra = Math.min(maxHra, remainingGross);
  }
  if (hra < 0) hra = 0;
  grossSalary = basic + hra + specialAllowance;
  const employeePF = Math.min(basic * 0.12, 1800);
  const employeeESI = grossSalary <= 21000 ? grossSalary * 0.0075 : 0;
  const PT = 0;
  const employeeLWF = 0;
  const totalDeduction = employeePF + employeeESI + PT + employeeLWF;
  const netTakeHome = grossSalary - totalDeduction;
  const finalNTH = netTakeHome + bonus;
  return {
    monthly: {
      basic: Number(basic.toFixed(2)),
      hra: Number(hra.toFixed(2)),
      specialAllowance: Number(specialAllowance.toFixed(2)),
      grossSalary: Number(grossSalary.toFixed(2)),
      employer: {
        pf: Number(employerPF.toFixed(2)),
        esi: Number(employerESI.toFixed(2)),
        bonus: Number(bonus.toFixed(2)),
        gratuity: Number(gratuity.toFixed(2)),
        insurance: Number(insurance.toFixed(2)),
        lwf: Number(employerLWF.toFixed(2)),
        total: Number((employerPF + employerESI + bonus + gratuity + insurance + employerLWF).toFixed(2))
      },
      fixedCTC: Number(ctc?.toFixed(2)),
      employee: {
        pf: Number(employeePF?.toFixed(2)),
        esi: Number(employeeESI?.toFixed(2)),
        pt: PT,
        lwf: employeeLWF,
        totalDeduction: Number(totalDeduction?.toFixed(2))
      },
      netTakeHome: Number(netTakeHome?.toFixed(2)),
      finalNTH: Number(finalNTH?.toFixed(2))
    },
    annual: {
      basic: Number((basic * 12)?.toFixed(2)),
      hra: Number((hra * 12)?.toFixed(2)),
      specialAllowance: Number((specialAllowance * 12)?.toFixed(2)),
      grossSalary: Number((grossSalary * 12)?.toFixed(2)),
      employer: {
        pf: Number((employerPF * 12)?.toFixed(2)),
        esi: Number((employerESI * 12)?.toFixed(2)),
        bonus: Number((bonus * 12)?.toFixed(2)),
        gratuity: Number((gratuity * 12)?.toFixed(2)),
        insurance: Number((insurance * 12)?.toFixed(2)),
        lwf: Number((employerLWF * 12)?.toFixed(2)),
        total: Number(((employerPF + employerESI + bonus + gratuity + insurance + employerLWF) * 12)?.toFixed(2))
      },
      fixedCTC: Number((ctc * 12)?.toFixed(2)),
      employee: {
        pf: Number((employeePF * 12)?.toFixed(2)),
        esi: Number((employeeESI * 12)?.toFixed(2)),
        pt: PT * 12,
        lwf: employeeLWF * 12,
        totalDeduction: Number((totalDeduction * 12)?.toFixed(2))
      },
      netTakeHome: Number((netTakeHome * 12)?.toFixed(2)),
      finalNTH: Number((finalNTH * 12)?.toFixed(2))
    }
  };
};

const SalaryBreakupController = async (req, res) => {
  try {

    const { companyCode, branchCode, empCode, ctc, grade, category, isMetro } = req.body;
    if (!branchCode || !ctc || !category) {
      return res.status(400).json({
        success: false,
        message: "Employee ID, Month, and Year are required",
      });
    }
    const salaryBreakup = await getSalaryBreakupRepo(req.body);
    if (!salaryBreakup) {
      return res.status(404).json({
        success: false,
        message: "Salary breakup not found for the given details",
      });
    }
    res.status(200).json({
      success: true,
      message: "Salary breakup fetched successfully",
      data: salaryBreakup,
    });
  } catch (error) {
    console.error("Error fetching salary breakup:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getSalaryBreakupByEmp = async (req, res) => {
  try {
    const { EmpCode } = req.params;

    if (!EmpCode) {
      return res.status(400).json({
        success: false,
        message: "EmpCode and Grade are mandatory",
      });
    }

    const data = await getSalaryBreakupByEmpRepo(EmpCode);

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No records found",
      });
    }

    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    console.error("Controller Error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching salary data",
      error: error.message,
    });
  }
};

const fetchSalaryHead = async (req, res) => {
  try {
    const data = await getSalaryHeadDataRepo();
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Controller Error (fetchSalaryHead):", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch salary head data",
    });
  }
};

const createSalaryHeadCtrl = async (req, res) => {
  try {
    const payload = req.body;

    if (payload.Amount !== undefined) payload.Amount = Number(payload.Amount) || 0;
    const result = await createSalaryHead(payload);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const GetAllSalaryHeadCntr = async (req, res) => {
  try {
    const salaryHeads = await getAllSlaryHead();
    res.status(200).json({
      success: true,
      data: salaryHeads
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching SalaryHeadMaster data",
      error: error.message
    });
  }
};

module.exports = {
  getNewSalaryHeadCode,
  createNewSalaryHead,
  // saveSalaryHeadAmoutGrade,
  // getSalaryAmount,
  getMinimumWages,
  setReimbursment,
  getEntitlementByEmpId,
  saveEntitlement,
  getSalaryHead,
  getFilteredSalaryHead,
  getLocationsOfProfessionalTax,
  saveGLDetails,
  // calculateEmployeeSalarySlip,
  saveSalarySlip,
  saveSalarySlipDetails,
  getEmployeesForIncomeTaxComputation,
  getEmployeeDetailsForIncomeTaxComputation,
  getSavedIncomeTaxList,
  getDetailsOfSelectedTaxCode,
  getEntitlementsByEmpIds,
  calculateCTCBreakup,
  SalaryBreakupController,
  getSalaryBreakupByEmp,
  fetchSalaryHead,
  createSalaryHeadCtrl,
  GetAllSalaryHeadCntr,
  saveMonthlyEntitlementEntry
}