const { Sequelize, InvalidConnectionError } = require('sequelize');
const ProfessionalTaxMaster = require("../models/professionalTaxMaster.model.js");
const gldetail = require("../models/glDetails.model.js");
const CustomError = require("../utils/errorHandler.util.js");
const { executeQuery } = require('../utils/dbhelper.util.js');
const { element } = require('../config/db.js');
const BranchesMinimumWages = require("../models/BranchesMinimumWages.model.js")
const { Op } = require('sequelize');
const calculateCTCBreakup = require('../utils/calculateCTCBreakup.util.js');
const SalaryHeadMaster = require('../models/SalaryHeadMasterNew.model');
const { EmployeeSalary: EmployeeAssociateSalary, SalaryHeadMaster: SalaryAssociateHeadMaster } = require("../models/EmpEntitlementSalaryHead.associate.model.js");
const { calculateExactCTC } = require('../utils/calculateAttendance2.js');
const LWF = require('../models/LWFMaster.model.js');
const { getDatabaseNameByCompanyCode } = require("./element.repository.js");
const { getSequelize } = require("../config/sequelizeManager.js");
const getD = require('../models/employeeMaster.model.js');

const createNewSalaryHeadCode = async (companyCode) => {
  try {
    const companyDetails = await getDatabaseNameByCompanyCode(companyCode);
    if (!companyDetails || companyDetails.length === 0) {
      throw new CustomError(404, "Company not found");
    }
    const sequelize = await getSequelize(companyDetails[0].CompanyDatabaseName);
    const SalaryHeadMaster = sequelize.models.SalaryHeadMaster;

    let nextCode = "SHC00001";
    const lastRecord = await SalaryHeadMaster.findOne({
      order: [["SalaryID", "DESC"]],
    },);
    if (lastRecord && lastRecord.Code) {
      const lastCode = lastRecord.Code.trim();
      const lastNumber = parseInt(lastCode.substring(3));
      if (!isNaN(lastNumber)) {
        nextCode = "SHC" + (lastNumber + 1).toString().padStart(5, "0");
      }
    }
    return nextCode;
  } catch (err) {
    throw err;
  }
};

const createNewSalaryHeaddb = async (companyCode, body) => {
  try {
    const Code = body.Code;
    const companyDetails = await getDatabaseNameByCompanyCode(companyCode);
    if (!companyDetails || companyDetails.length === 0) {
      throw new CustomError(404, "Company not found");
    }
    const sequelize = await getSequelize(companyDetails[0].CompanyDatabaseName);
    const SalaryHeadMaster = sequelize.models.SalaryHeadMaster;

    const existing = await SalaryHeadMaster.findOne({ where: { Code } });
    if (existing) return "existed"
    return await SalaryHeadMaster.create(body);
  } catch (error) {
    throw error;
  }
};

// const saveUpdate = async (code, companyCode, grade, amount, newCompanyCode) => {

//   try {

//     const companyDetails = await getDatabaseNameByCompanyCode(newCompanyCode);
//     if (!companyDetails || companyDetails.length === 0) {
//       throw new CustomError(404, "Company not found");
//     }
//     const sequelize = await getSequelize(companyDetails[0].CompanyDatabaseName);
//     const SHM = sequelize.models.salaryHeadMaster2;

//     const salhead = await SHM.findOne({ where: { Code: code, Grade: grade, CompanyCode: companyCode } });

//     if (salhead) {
//       const result = await SHM.update({ Amount: amount }, { where: { Code: code, CompanyCode: companyCode, Grade: grade } });
//       return result[0] === 1 ? 1 : false;
//     } else {
//       const headDetails = await executeQuery(`SELECT * FROM SalaryHeadMaster WHERE Code = '${code}'`);

//       if (!headDetails || headDetails.length === 0) {
//         return " Salary head not found !   please send a valid salary Head ";
//       }

//       return newHead = await SHM.create({
//         Code: code,
//         Head: headDetails[0].Head,
//         Description: headDetails[0].Description,
//         EarningDeduction: headDetails[0].EarningDeduction,
//         CompanyCode: companyCode,
//         Amount: amount,
//         Grade: grade
//       });
//     }

//   } catch (error) {
//     throw new Error('Error in saving salaryhead details : ' + error.message);
//   }
// };

// const findSalaryByGrade = async (newCompanyCode, companyCode, grade) => {
//   try {
//     const companyDetails = await getDatabaseNameByCompanyCode(newCompanyCode);
//     if (!companyDetails || companyDetails.length === 0) {
//       throw new CustomError(404, "Company not found");
//     }
//     const sequelize = await getSequelize(companyDetails[0].CompanyDatabaseName);
//     const SHM = sequelize.models.salaryHeadMaster2;
//     return await SHM.findAll({ where: { CompanyCode: companyCode, Grade: grade } });

//   } catch (error) {
//     throw new Error('Error in fetching Salary by Grade : ' + error.message);
//   }
// };

const getMinimumWagesByBranch = async (newCompanyCode, branchCode) => {
  try {
    const companyDetails = await getDatabaseNameByCompanyCode(newCompanyCode);
    if (!companyDetails || companyDetails.length === 0) {
      throw new CustomError(404, "Company not found");
    }
    const sequelize = await getSequelize(companyDetails[0].CompanyDatabaseName);

    return await sequelize.query(`SELECT * FROM BranchesMinimumWages WHERE BranchCode = '${branchCode}'`,  { type: sequelize.QueryTypes.SELECT });
  } catch (error) {
    throw new Error('Error fetching MinimumWages : ' + error.message);
  }
};

const setReimbursmentdb = async (newCompanyCode, empCode, reimbursmentType, EntitlementAmount, SNo) => {
  try {
    const companyDetails = await getDatabaseNameByCompanyCode(newCompanyCode);
    if (!companyDetails || companyDetails.length === 0) {
      throw new CustomError(404, "Company not found");
    }
    const sequelize = await getSequelize(companyDetails[0].CompanyDatabaseName);
    const empRemburs = sequelize.models.EmployeeReimbursement;

    const result1 = await empRemburs.findAll({ where: { EmpCode: empCode, ReimbursementType: reimbursmentType } });
    if (result1.length > 0) {
      return await empRemburs.update({ EntitlementAmount: EntitlementAmount, IsEntitle: true }, { Where: { EmpCode: empCode, ReimbursementType: reimbursmentType } })
    } else {
      return await empRemburs.create({
        EmpCode: empCode,
        ReimbursementType: reimbursmentType,
        IsEntitle: false,
        EntitlementAmount: EntitlementAmount,
        SNo: 1
      })
    }
  } catch (error) {
    throw new Error('Error in saving reimbursement : ' + error.message);
  }
}

const findOneEntitle = async (newCompanyCode, empid) => {
  try {
    if (!empid) throw new Error('Employee ID is required');
    const companyDetails = await getDatabaseNameByCompanyCode(newCompanyCode);
    if (!companyDetails || companyDetails.length === 0) {
      throw new CustomError(404, "Company not found");
    }
    const sequelize = await getSequelize(companyDetails[0].CompanyDatabaseName);

    const result = await sequelize.query(`SELECT * FROM EmployeeEntitlement WHERE EmpCode = '${empid}'`,  { type: sequelize.QueryTypes.SELECT });

    return result;

  } catch (error) {
    throw new Error('Error in fetching Employee Entitlement : ' + error.message);
  }
};

const findManyEntitle = async (newCompanyCode, empids) => {
  try {
    const companyDetails = await getDatabaseNameByCompanyCode(newCompanyCode);
    if (!companyDetails || companyDetails.length === 0) {
      throw new CustomError(404, "Company not found");
    }
    const sequelize = await getSequelize(companyDetails[0].CompanyDatabaseName);

    if (!empids || empids.length === 0) {
      throw new Error("Employee IDs are required");
    }

    const formattedIds = empids.map(id => `'${id}'`).join(",");
    return await sequelize.query(`SELECT * FROM EmployeeEntitlement WHERE EmpCode IN (${formattedIds})`, { type: sequelize.QueryTypes.SELECT });

  } catch (error) {
    throw new Error('Error in fetching Employee Entitlement : ' + error.message);
  }
};

const createEntitle = async (newCompanyCode, entitlements) => {
  try {
    const empCodes = entitlements.map(e => e.EmpCode);
    const uniqueEmpCodes = [...new Set(empCodes)];

    if (uniqueEmpCodes.length > 1) {
      return {
        status: 'error',
        message: 'All entitlements must belong to the same employee please enter only one Employees entitles.'
      };
    }

    const empCode = entitlements[0]?.EmpCode;

    const companyDetails = await getDatabaseNameByCompanyCode(newCompanyCode);
    if (!companyDetails || companyDetails.length === 0) {
      throw new CustomError(404, "Company not found");
    }
    const sequelize = await getSequelize(companyDetails[0].CompanyDatabaseName);

    const employee = await sequelize.query(`SELECT * FROM EmployeeMaster WHERE EmpID = '${empCode}'`, { type: sequelize.QueryTypes.SELECT });

    if (!employee || employee.length === 0) {
      return {
        status: 'error',
        message: 'Employee Not Found ! please enter a valid employee or register first'
      };
    }

    const employeeEntitlementModel = sequelize.models.EmployeeEntitle;

    const existingEntitlements = await employeeEntitlementModel.findAll({ where: { EmpCode: empCode } });

    let snoCounter = existingEntitlements.length === 0 ? 1 : existingEntitlements.length + 1;

    const existingMap = {};
    existingEntitlements.forEach(e => {
      existingMap[e.SalHead] = e;
    });

    const salaryHeadMap = {};
    for (const entitle of entitlements) {
      const { SalHead } = entitle;
      if (!salaryHeadMap[SalHead]) {
        const head = await sequelize.query(`SELECT * FROM SalaryHeadMaster WHERE Code = '${SalHead}'`, { type: sequelize.QueryTypes.SELECT });
        if (!head || head.length === 0) {

          return {
            status: 'error',
            message: 'Salary Head Not Found ! please send a valid Salary Head'
          };

        }
        salaryHeadMap[SalHead] = head[0];
      }
    }
    for (const entitle of entitlements) {
      const { EmpCode, SalHead, FixedAmount } = entitle;
      const salHeadData = salaryHeadMap[SalHead];

      if (existingMap[SalHead]) {
        await employeeEntitlementModel.update(
          {
            isEditable: true,
            FixedAmount,
            Entitle: FixedAmount,
            changedDate: new Date().toISOString()
          },
          { where: { EmpCode, SalHead } }
        );
      } else {
        await employeeEntitlementModel.create({
          EmpCode,
          sno: snoCounter++,
          SalHead,
          isEditable: false,
          FixedAmount,
          Entitle: FixedAmount,
          changedDate: new Date().toISOString(),
          Remarks: " ",
          EntCatg: "SCD00001",
          Type: salHeadData?.Description || " ",
          Deduction: salHeadData?.EarningDeduction?.toLowerCase() === "earning" ? 0 : FixedAmount,
          LedgerCode: "NULL"
        });
      }
    }
    return {
      status: 'success',
      message: "Employee Entitlement Saved/Updated Successfully for " + employee[0]?.Name
    };

  } catch (error) {
    console.error("Error in createEntitle:", error);
    throw new Error("Error in saving Employee Entitlement: " + error.message);
  }
};

const getSalaryHeaddb = async (newCompanyCode) => {
  try {
    const companyDetails = await getDatabaseNameByCompanyCode(newCompanyCode);
    if (!companyDetails || companyDetails.length === 0) {
      throw new CustomError(404, "Company not found");
    }
    const sequelize = await getSequelize(companyDetails[0].CompanyDatabaseName);

    return await sequelize.query(`SELECT * FROM SalaryHeadMaster`,  { type: sequelize.QueryTypes.SELECT });
  } catch (error) {
    throw new Error('Error in fetching SalaryHeadMaster ' + error.message);
  }
};

const getLocationsOfProfessionalTaxdb = async () => {
  try {
    return await ProfessionalTaxMaster.findAll();
  } catch (error) {
    console.error('Error fetching locations:', error);
    throw new CustomError('Error fetching locations', 500);
  }
};

const saveGLDetailsdb = async (newCompanyCode, gldetails) => {
  try {
    const companyDetails = await getDatabaseNameByCompanyCode(newCompanyCode);
    if (!companyDetails || companyDetails.length === 0) {
      throw new CustomError(404, "Company not found");
    }
    const sequelize = await getSequelize(companyDetails[0].CompanyDatabaseName);
    const gldetail = sequelize.models.EmployeeGlDetails;

    for (const details of gldetails) {
      const { EmpCode, SalHead } = details;

      const existingDetail = await gldetail.findOne({ where: { EmpCode: EmpCode, SalHead: SalHead } });

      if (!existingDetail || existingDetail.length <= 0) {
        await gldetail.create({
          EmpCode,
          GeneralCategory: null,
          GLCode: SalHead,
          SalHead,
          PercentageAmount: 100
        });
      }
    }
    return {
      status: "success",
      message: 'Gl Details Saved Successfully '
    };

  } catch (error) {
    throw new CustomError('Error in saving GL details--------', error.message);
  }
};

// const calculateSalarySlip = async (
//   Month,
//   MonthNo,
//   Year,
//   BranchCode,
//   EmpType
// ) => {
//   try {
//     return await element.query(
//       `EXEC Proc_EmployeeSalarySlip :Month, :MonthNo, :Year, :BranchCode, :EmpType`,
//       {
//         replacements: {
//           Month,
//           MonthNo: parseInt(MonthNo),
//           Year,
//           BranchCode,
//           EmpType,
//         },
//         type: element.QueryTypes.SELECT,
//       }
//     );

//   } catch (error) {
//     console.error("Error calculating salary slip:", error);
//     return res
//       .status(500)
//       .json({ success: false, message: "Internal server error" });
//   }
// };

const saveSalarySlipdb = async ( newCompanyCode, salarySlipData) => {
  try {
    const salaryData = salarySlipData.salaryData;
    const salaryMaster = salarySlipData.salaryMaster;

    const companyDetails = await getDatabaseNameByCompanyCode(newCompanyCode);
    if (!companyDetails || companyDetails.length === 0) {
      throw new CustomError(404, "Company not found");
    }
    const sequelize = await getSequelize(companyDetails[0].CompanyDatabaseName);
    const salaryslipMaster = sequelize.models.SalarySlip;
    const salarySlipEmployee = sequelize.models.SalarySlipEmployee;

    const existingSlip = await salaryslipMaster.findOne({
      where: {
        Months: salaryMaster.Months,
        Years: salaryMaster.Years,
        SalarySlipCode: salaryMaster.SalarySlipCode,
      },
    });

    if (existingSlip) {
      const uniqueKeys = salaryData.map((item) => ({
        SalarySlipCode: item.SalarySlipCode,
        EmpCode: item.EmpCode,
      }));

      const existingEmployees = await salarySlipEmployee.findAll({
        where: {
          [Op.or]: uniqueKeys,
        },
      });
      const existingKeySet = new Set(
        existingEmployees.map(
          (item) => `${item.SalarySlipCode}#${item.EmpCode}`
        )
      );
      const newEmployees = salaryData.filter(
        (item) => !existingKeySet.has(`${item.SalarySlipCode}#${item.EmpCode}`)
      );
      if (newEmployees.length > 0) {
        await salarySlipEmployee.bulkCreate(newEmployees);
      }
      return {
        status: "success",
        message: `${newEmployees.length} new salary inserted, ${existingEmployees.length
          } already existed. ${existingEmployees
            .map((e) => e.EmpCode)
            .join(", ")}`,
      };
    } else {
      await salaryslipMaster.create(salaryMaster);
      await salarySlipEmployee.bulkCreate(salaryData);
      return {
        status: "success",
        message:
          "Salary slip master and all employee details saved successfully",
      };
    }
  } catch (error) {
    console.error("Error saving salary slip:", error);
    return { status: "error", message: error.message || "Unknown error" };
  }
};

const getSalarySlipInMaster = async (newCompanyCode, salarySlipCode) => {
  try {
    const companyDetails = await getDatabaseNameByCompanyCode(newCompanyCode);
    if (!companyDetails || companyDetails.length === 0) {
      throw new CustomError(404, "Company not found");
    }
    const sequelize = await getSequelize(companyDetails[0].CompanyDatabaseName);
    const salaryslipMaster = sequelize.models.SalarySlip;
    return await salaryslipMaster.findOne({
      where: { SalarySlipCode: salarySlipCode },
    });
  } catch (error) {
    console.error("Error fetching salary slip in master:", error);
    throw new CustomError(
      "Error fetching salary slip in master",
      error.message
    );
  }
};

async function saveSalarySlipDetailsdb(newCompanyCode, salarySlipDetails) {
  const created = [];
  const alreadyExist = [];
  let SNo = 1;

  if (!salarySlipDetails || salarySlipDetails.length === 0) {
    return { status: "error", message: "No salary slip details provided" };
  }

  // Take SalarySlipCode from first record
  const { SalarySlipCode } = salarySlipDetails[0];

  // 🔎 Check if SalarySlipCode already exists in table
  const companyDetails = await getDatabaseNameByCompanyCode(newCompanyCode);
  if (!companyDetails || companyDetails.length === 0) {
    throw new CustomError(404, "Company not found");
  }
  const sequelize = await getSequelize(companyDetails[0].CompanyDatabaseName);
  const salarySlipEntitlementDetails = sequelize.models.SalarySlipEntitlementDetails;

  const exists = await salarySlipEntitlementDetails.findOne({
    where: { SalarySlipCode },
  });

  if (exists) {
    return {
      status: "error",
      message: `SalarySlipCode ${SalarySlipCode} already exists, cannot insert duplicates.`,
    };
  }

  // If not exists, insert all rows
  for (const row of salarySlipDetails) {
    const {
      SalarySlipCode,
      HeadCode,
      Name,
      Rate,
      Amount,
      EmpCode,
      EarnDedu,
      Arrear,
    } = row;

    const arrearValue = Number(Arrear) || 0;

    try {
      await salarySlipEntitlementDetails.create({
        SalarySlipCode,
        HeadCode,
        Name,
        Rate,
        Amount,
        EmpCode,
        EarnDedu,
        Arrear: arrearValue,
        SNo: SNo++,
      });

      created.push(row);
    } catch (err) {
      console.error("💥 Error while saving salary slip detail:", row, err);
      return { status: "error", message: err.message };
    }
  }

  return { status: "ok", created, alreadyExist };
};

// const createMonthalyEntitle = async (newCompanyCode, entitlements) => {

//   try {
//     if (!Array.isArray(entitlements) || entitlements.length === 0) {
//       return {
//         status: "error",
//         message: "Entitlements array is empty or invalid",
//       };
//     }

//     const branchCodes = [...new Set(entitlements.map(e => e.BranchCode))];
//     if (branchCodes.length > 1) {
//       return {
//         status: "error",
//         message: "All entitlements must belong to the same BranchCode.",
//       };
//     }

//     const companyDetails = await getDatabaseNameByCompanyCode(newCompanyCode);
//     if (!companyDetails || companyDetails.length === 0) {
//       throw new CustomError(404, "Company not found");
//     }
//     const sequelize = await getSequelize(companyDetails[0].CompanyDatabaseName);
//     const salaryslipMaster = sequelize.models.SalarySlip;

//     const salarySlipCode = await salaryslipMaster.findOne({
//       where: {
//         months: entitlements[0].Month,
//         years: entitlements[0].Year,
//         branchCode: entitlements[0].BranchCode,
//       },
//       attributes: ['SalarySlipCode'],
//     });
//     if (!salarySlipCode) {
//       return {
//         status: "error",
//         message: "No salary slip found " + entitlements[0].Month + "/" + entitlements[0].Year + " for " + entitlements[0].BranchCode,
//       };
//     };

//     const existingMonthlyList = [];
//     const existingSlipList = [];

//     for (const [index, e] of entitlements.entries()) {
//       const {
//         EmpName,
//         EmpID,
//         Entitle,
//         BranchCode,
//         Month,
//         Year,
//         SalaryHeadCode,
//         SalaryHead,
//       } = e;

//       const MonthlyEntitlementEntry = sequelize.models.MonthlyEntitlementEntry;
//       const SalarySlipEntitlementDetails = sequelize.models.SalarySlipEntitlementDetails;
//       const SHM = sequelize.models.SalaryHeadMaster;

//       const existingMonthly = await MonthlyEntitlementEntry.findOne({
//         where: { EmpID, Month, Year, SalaryHeadCode },
//       });

//       if (!existingMonthly) {
//         await MonthlyEntitlementEntry.create({
//           BranchCode,
//           Month,
//           Year,
//           CreatedBy: "Admin",
//           EmpID,
//           EmpName,
//           SalaryHeadCode,
//           SalaryHead,
//           Entitle,
//         });
//       } else {
//         existingMonthlyList.push({
//           EmpID,
//           Month,
//           Year,
//           SalaryHeadCode,
//           SalaryHead
//         });
//       }
//       const existingSlip = await SalarySlipEntitlementDetails.findOne({
//         where: { SalarySlipCode: salarySlipCode.SalarySlipCode, EmpCode: EmpID, HeadCode: SalaryHeadCode },
//       });

//       if (!existingSlip) {
//         const EarnDedu = await SHM.findOne({ where: { Code: SalaryHeadCode }, attributes: ['EarningDeduction'], });
//         await SalarySlipEntitlementDetails.create({
//           SalarySlipCode: salarySlipCode ? salarySlipCode.SalarySlipCode : "Unknown",
//           HeadCode: SalaryHeadCode,
//           Name: SalaryHead,
//           Rate: Entitle,
//           Amount: Entitle,
//           EmpCode: EmpID,
//           EarnDedu: EarnDedu ? EarnDedu.EarningDeduction : "Earning",
//           SNo: index + 1,
//         });
//       } else {
//         existingSlipList.push({
//           EmpCode: EmpID,
//           HeadCode: SalaryHeadCode,
//           Name: SalaryHead
//         });
//       }
//     }
//     return {
//       status: "success",
//       message: "Monthly entitlements processed successfully.",
//       existingMonthalyEntitlementEntry: existingMonthlyList,
//       existingSalarySlip: existingSlipList
//     };
//   } catch (error) {
//     console.error("Error in createMonthalyEntitle:", error);
//     return {
//       status: "error",
//       message: "Error while saving entitlements: " + error.message,
//     };
//   }
// };

const createMonthalyEntitle = async (companyCode, entitlements) => {
  const branchCodes = [...new Set(entitlements.map(e => e.BranchCode))];

  if (branchCodes.length > 1) {
    return {
      status: "error",
      message: "All entitlements must belong to the same BranchCode",
    };
  }

  const companyDetails = await getDatabaseNameByCompanyCode(companyCode);
  if (!companyDetails?.length) {
    return { status: "error", message: "Company not found" };
  }

  const sequelize = await getSequelize(companyDetails[0].CompanyDatabaseName);
  const {
    MonthlyEntitlementEntry,
    SalarySlipEntitlementDetails,
    SalarySlip,
    SalaryHeadMaster,
  } = sequelize.models;

  const transaction = await sequelize.transaction();

  try {
    const { Month, Year, BranchCode } = entitlements[0];

    // 🔹 Get Salary Slip
    const salarySlip = await SalarySlip.findOne({
      where: { months: Month, years: Year, branchCode: BranchCode },
      attributes: ["SalarySlipCode"],
      transaction,
    });

    if (!salarySlip) {
      return {
        status: "error",
        message: `No salary slip found for ${Month}/${Year} - ${BranchCode}`,
      };
    }

    const salarySlipCode = salarySlip.SalarySlipCode;

    // 🔹 Prepare Data
    const empIds = entitlements.map(e => e.EmpID);
    const headCodes = entitlements.map(e => e.SalaryHeadCode);

    // 🔹 Fetch Existing Monthly Entitlements
    const existingMonthly = await MonthlyEntitlementEntry.findAll({
      where: { EmpID: empIds, Month, Year, SalaryHeadCode: headCodes },
      attributes: ["EmpID", "SalaryHeadCode"],
      raw: true,
      transaction,
    });

    const monthlySet = new Set(
      existingMonthly.map(e => `${e.EmpID}_${e.SalaryHeadCode}`)
    );

    // 🔹 Fetch Existing Salary Slip Entitlements
    const existingSlip = await SalarySlipEntitlementDetails.findAll({
      where: {
        SalarySlipCode: salarySlipCode,
        EmpCode: empIds,
        HeadCode: headCodes,
      },
      attributes: ["EmpCode", "HeadCode"],
      raw: true,
      transaction,
    });

    const slipSet = new Set(
      existingSlip.map(e => `${e.EmpCode}_${e.HeadCode}`)
    );

    // 🔹 Fetch Salary Head Master
    const salaryHeads = await SalaryHeadMaster.findAll({
      attributes: ["Code", "EarningDeduction"],
      raw: true,
      transaction,
    });

    const headMap = {};
    salaryHeads.forEach(h => (headMap[h.Code] = h.EarningDeduction));

    // 🔹 Prepare Inserts
    const monthlyInsert = [];
    const slipInsert = [];

    const existingMonthlyList = [];
    const existingSlipList = [];

    entitlements.forEach((e, index) => {
      const monthlyKey = `${e.EmpID}_${e.SalaryHeadCode}`;
      const slipKey = `${e.EmpID}_${e.SalaryHeadCode}`;

      if (!monthlySet.has(monthlyKey)) {
        monthlyInsert.push({
          BranchCode: e.BranchCode,
          Month: e.Month,
          Year: e.Year,
          EmpID: e.EmpID,
          EmpName: e.EmpName,
          SalaryHeadCode: e.SalaryHeadCode,
          SalaryHead: e.SalaryHead,
          Entitle: e.Entitle,
          CreatedBy: "Admin",
        });
      } else {
        existingMonthlyList.push({
          EmpID: e.EmpID,
          SalaryHeadCode: e.SalaryHeadCode,
        });
      }

      if (!slipSet.has(slipKey)) {
        slipInsert.push({
          SalarySlipCode: salarySlipCode,
          HeadCode: e.SalaryHeadCode,
          Name: e.SalaryHead,
          Rate: e.Entitle,
          Amount: e.Entitle,
          EmpCode: e.EmpID,
          EarnDedu: headMap[e.SalaryHeadCode] || "Earning",
          SNo: index + 1,
        });
      } else {
        existingSlipList.push({
          EmpCode: e.EmpID,
          HeadCode: e.SalaryHeadCode,
        });
      }
    });

    // 🔹 Bulk Insert
    if (monthlyInsert.length) {
      await MonthlyEntitlementEntry.bulkCreate(monthlyInsert, { transaction });
    }

    if (slipInsert.length) {
      await SalarySlipEntitlementDetails.bulkCreate(slipInsert, { transaction });
    }

    await transaction.commit();

    return {
      status: "success",
      message: "Monthly entitlements processed successfully",
      existingMonthlyEntitlement: existingMonthlyList,
      existingSalarySlip: existingSlipList,
    };
  } catch (error) {
    await transaction.rollback();
    console.error("Repository Error:", error);
    return {
      status: "error",
      message: error.message,
    };
  }
};


const getEmployeesForIncomeTaxComputationFromDB = async (financialYear, branchCode) => {
  try {
    let dtFirstDate;
    const startYear = financialYear.split("-")[0];
    dtFirstDate = `${startYear}-04-01`;

    console.log("Financial Year:", financialYear);
    console.log("Branch Code:", branchCode);
    console.log("First Date of Financial Year:", dtFirstDate);
    const query = `SELECT EM.EmpID, EM.Name, EM.Department, EM.Designation, BM.Name AS BranchName FROM EmployeeMaster EM INNER JOIN BranchMaster BM ON EM.BranchCode = BM.Code WHERE EM.IsBilled = 1 AND EM.EmpID NOT IN (SELECT EmployeeCode FROM IncomeTaxComputationMaster WHERE FinancialYear = :financialYear)AND EM.BranchCode = :branchCode AND EM.HasLeft = 0 AND UPPER(EM.Name) <> 'ADMINISTRATOR' UNION ALL SELECT EM.EmpID, EM.Name, EM.Department, EM.Designation, BM.Name AS BranchName FROM EmployeeMaster EM INNER JOIN BranchMaster BM ON EM.BranchCode = BM.Code WHERE EM.IsBilled = 1 AND EM.EmpID NOT IN (SELECT EmployeeCode FROM IncomeTaxComputationMaster WHERE FinancialYear = :financialYear) AND EM.BranchCode = :branchCode AND EM.HasLeft = 1 AND EM.LeftDate >= :dtFirstDate AND UPPER(EM.Name) <> 'ADMINISTRATOR' ORDER BY Em.EmpID;`;
    const results = await element.query(query, {
      replacements: {
        financialYear,
        branchCode,
        dtFirstDate,
      },
      type: element.QueryTypes.SELECT,
    });
    return results;
  } catch (error) {
    console.error("Error fetching employees for income tax computation:", error);
    throw error;
  }
};

const getEmployeeDetailsForIncomeTaxComputationFromDB = async ({ empId }) => {
  try {
    const query = `SELECT EmpID, Name, Department, Designation, BranchCode, PanNo, DoB, JoiningDt, Sex FROM EmployeeMaster WHERE EmpID = :empId`;

    return await element.query(query, {
      replacements: { empId },
      type: element.QueryTypes.SELECT,
    });

  } catch (error) {
    console.error("Error fetching employee details for income tax computation:", error);
    throw error;
  }
};

const getSavedIncomeTaxListFromDB = async () => {
  try {
    const query = `SELECT IncomeTaxCode, FinancialYear, BranchName, EmployeeCode, EmployeeName FROM IncomeTaxComputationMaster ORDER BY FinancialYear DESC, EmployeeName`;
    return await element.query(query, {
      type: element.QueryTypes.SELECT,
    });

  }
  catch (error) {
    console.error("Error fetching saved income tax list:", error);
    throw error;
  }
};

const getDetailsOfSelectedTaxCodeFromDB = async ({ taxCode }) => {
  try {
    const incomeTaxCode = taxCode;
    const [
      employeeTaxDetails,
      EntitlementDetails,
      otherIncome,
      receiptEntry,
      investment80C,
      taxPaidEntry,
      deductionUS80,
      TDSSchedule
    ] = await Promise.all([
      element.query(
        `SELECT * FROM IncomeTaxComputationMaster WHERE IncomeTaxCode = :incomeTaxCode`,
        { replacements: { incomeTaxCode }, type: element.QueryTypes.SELECT }
      ),
      element.query(
        `SELECT * FROM IncomeTaxEarDedSalaryDetail WHERE IncomeTaxCode = :incomeTaxCode`,
        { replacements: { incomeTaxCode }, type: element.QueryTypes.SELECT }
      ),
      element.query(
        `SELECT * FROM IncomeTaxOtherIncome WHERE IncomeTaxCode = :incomeTaxCode`,
        { replacements: { incomeTaxCode }, type: element.QueryTypes.SELECT }
      ),
      element.query(
        `SELECT * FROM IncomeTaxReceiptEntry WHERE IncomeTaxCode = :incomeTaxCode`,
        { replacements: { incomeTaxCode }, type: element.QueryTypes.SELECT }
      ),
      element.query(
        `SELECT * FROM IncomeTaxInvestment80C WHERE IncomeTaxCode = :incomeTaxCode`,
        { replacements: { incomeTaxCode }, type: element.QueryTypes.SELECT }
      ),
      element.query(
        `SELECT * FROM IncomeTax_TaxPaid WHERE IncomeTaxCode = :incomeTaxCode`,
        { replacements: { incomeTaxCode }, type: element.QueryTypes.SELECT }
      ),
      element.query(
        `SELECT * FROM IncomeTaxDeductionUS80 WHERE IncomeTaxCode = :incomeTaxCode`,
        { replacements: { incomeTaxCode }, type: element.QueryTypes.SELECT }
      ),
      element.query(
        `SELECT * FROM IncomeTaxPaySchedule WHERE IncomeTaxCode = :incomeTaxCode`,
        { replacements: { incomeTaxCode }, type: element.QueryTypes.SELECT }
      ),
    ]);
    return {
      employeeTaxDetails,
      EntitlementDetails,
      otherIncome,
      receiptEntry,
      investment80C,
      taxPaidEntry,
      deductionUS80,
      TDSSchedule
    };
  } catch (error) {
    console.error("Error fetching details of selected tax code:", error);
    throw error;
  }
}

function mergeSalaryData(data, matched, empCode) {
  const today = new Date().toISOString();
  const dataMap = new Map(data.map(item => [item.SalHead, item]));

  return matched.map(m => {
    if (dataMap.has(m.Code)) {
      return dataMap.get(m.Code);
    } else {
      return {
        EmpCode: empCode,
        SalHead: m.Code,
        FixedAmount: 0,
        changedDate: today,
        SalaryHeadMaster: {
          Head: m.Head,
          EarningDeduction: m.EarningDeduction
        }
      };
    }
  });
}

function splitSalaryData(data, matched, empCode) {
  const merged = mergeSalaryData(data, matched, empCode);

  const sub1Heads = ["Basic", "HRA", "Special Allowance"];
  const grosssub2Heads = ["ADVANCE STATUTORY BONUS"];

  const sub1 = merged.filter(item =>
    sub1Heads.includes(item.SalaryHeadMaster.Head)
  );

  const grosssub2 = merged.filter(item =>
    grosssub2Heads.includes(item.SalaryHeadMaster.Head)
  );

  const earning = merged.filter(
    item =>
      item.SalaryHeadMaster.EarningDeduction === "Earning" &&
      !sub1Heads.includes(item.SalaryHeadMaster.Head) &&
      !grosssub2Heads.includes(item.SalaryHeadMaster.Head)
  );

  const deduction = merged.filter(
    item => item.SalaryHeadMaster.EarningDeduction === "Deduction"
  );

  return { sub1, grosssub2, earning, deduction };
}

function replaceSalaryHeadMaster(data) {
  const result = {};
  Object.keys(data).forEach(section => { result[section] = data[section].map(item => ({ EmpCode: item.EmpCode, SalHead: item.SalHead, FixedAmount: item.FixedAmount, changedDate: item.changedDate, Head: item.SalaryHeadMaster.Head, EarningDeduction: item.SalaryHeadMaster.EarningDeduction })); });
  return result;
}

const getSalaryBreakupByEmpRepo = async (EmpCode) => {
  try {
    const data = await EmployeeAssociateSalary.findAll({
      where: { EmpCode: EmpCode },
      attributes: ["EmpCode", "SalHead", "FixedAmount", "changedDate"],
      include: [
        {
          model: SalaryAssociateHeadMaster,
          attributes: ["Head", "EarningDeduction"],
        },
      ],
    });

    if (!data?.length) {
      throw new Error("No Data Found");

    }

    const fixedComponent = [
      {
        "Code": "SHC00001",
        "Head": "Basic",
        "EarningDeduction": "Earning",
        "Description": "Basic"
      },
      {
        "Code": "SHC00002",
        "Head": "HRA",
        "EarningDeduction": "Earning",
        "Description": "House Rent Allowance"
      },
      {
        "Code": "SHC00003",
        "Head": "PF",
        "EarningDeduction": "Deduction",
        "Description": "PF"
      },
      {
        "Code": "SHC00004",
        "Head": "ESIC",
        "EarningDeduction": "Deduction",
        "Description": "ESIC"
      },
      {
        "Code": "SHC00005",
        "Head": "Special Allowance",
        "EarningDeduction": "Earning",
        "Description": "Special Allowance"
      },
      {
        "Code": "SHC00009",
        "Head": "Professional Tax",
        "EarningDeduction": "Deduction",
        "Description": "Profession Tax"
      },
      {
        "Code": "SHC00012",
        "Head": "Bonus",
        "EarningDeduction": "Earning",
        "Description": "Bonus"
      },
      {
        "Code": "SHC00013",
        "Head": "EPF",
        "EarningDeduction": "Earning",
        "Description": "Employer Provident Fund"
      },
      {
        "Code": "SHC00014",
        "Head": "Gratuity",
        "EarningDeduction": "Earning",
        "Description": "Employer Gratuity"
      },
      {
        "Code": "SHC00020",
        "Head": "LWF",
        "EarningDeduction": "Deduction",
        "Description": "Labour Welfare Fund"
      },
      {
        "Code": "SHC00021",
        "Head": "Employer LWF",
        "EarningDeduction": "Deduction",
        "Description": "Employer Labour Welfare Fund"
      },
      {
        "Code": "SHC00029",
        "Head": "GTLI",
        "EarningDeduction": "Earning",
        "Description": "GTLI"
      },
      {
        "Code": "SHC00031",
        "Head": "GPA",
        "EarningDeduction": "Earning",
        "Description": "GPA"
      },
      {
        "Code": "SHC00032",
        "Head": "GHI",
        "EarningDeduction": "Earning",
        "Description": "GHI"
      },
      {
        "Code": "SHC00033",
        "Head": "ESIC Employer",
        "EarningDeduction": "Earning",
        "Description": "ESIC Employer Contribution"
      },
      {
        "Code": "SHC00034",
        "Head": "LWF Employer",
        "EarningDeduction": "Earning",
        "Description": "LWF Employer Contribution"
      },
      {
        "Code": "SHC00035",
        "Head": "ADVANCE STATUTORY BONUS",
        "EarningDeduction": "Earning",
        "Description": "ADVANCE STATUTORY BONUS"
      }
    ]

    const result = splitSalaryData(data, fixedComponent, EmpCode)
    if (!result) {
      throw new Error("No Data Found");
    }

    const result2 = replaceSalaryHeadMaster(result)

    return result2;
  } catch (error) {
    console.error("Service Error:", error);
    throw new Error("Database query failed");
  }
};

const getSalaryHeadDataRepo = async () => {
  try {
    const salaryHeads = await SalaryHeadMaster.findAll({
      attributes: ["Code", "Head", "EarningDeduction", "Description"],
    });

    const allHeads = salaryHeads.map((h) => h.toJSON());

    const excelHeads = [
      "BASIC",
      "HRA",
      "Special Allowance",
      "PF",
      "ESI 3.25% of gross",
      "LWF",
      "Bonus",
      "Employer LWF",
      "EPF",
      "Gratuity",
      "INSURANCE",
      "PF 12% of BASIC",
      "ESIC",
      "Professional Tax",
      "GTLI",
      "GHI",
      "GPA",
      "ESIC Employer",
      "LWF Employer",
      "ADVANCE STATUTORY BONUS"
    ];

    const matched = allHeads.filter((h) =>
      excelHeads.some(
        (eh) => eh.toLowerCase().trim() === h.Head.toLowerCase().trim()
      )
    );

    const remaining = allHeads.filter(
      (h) =>
        !excelHeads.some(
          (eh) => eh.toLowerCase().trim() === h.Head.toLowerCase().trim()
        )
    );

    return {
      matchedCount: matched.length,
      remainingCount: remaining.length,
      totalCount: allHeads.length,
      matched,
      remaining,
    };
  } catch (error) {
    console.error("Service Error (getSalaryHeadDataRepo):", error);
    throw new Error("Database query failed");
  }
};

const getSalaryBreakupRepo = async (params) => {
  try {
    const { companyCode, branchCode, empCode, ctc, grade, category, minimumWages, isMetro, father, mother, isPSR } = params;

    let branchWages;
    branchWages = await BranchesMinimumWages.findOne({
      where: { BranchCode: branchCode },
    });

    if (!branchWages) {
      branchWages = minimumWages;
    }

    let wage = null;
    switch (category) {
      case "Unskilled":
        wage = branchWages.Unskilled;
        break;
      case "SemiSkilled":
        wage = branchWages.SemiSkilled;
        break;
      case "Skilled":
        wage = branchWages.Skilled;
        break;
      case "HighlySkilled":
        wage = branchWages.HighlySkilled;
        break;
      default:
        throw new Error("Invalid category");
    }

    if (wage === null) {
      throw new Error("Wage not available for this category")
    }
    if (minimumWages) {
      wage = minimumWages;
    }
    let data;
    if (branchWages?.Branch) {
      data = await LWF.findOne({ where: { Location: branchWages?.Branch } });
    }
    else data = 0;

    function isCurrentMonthIncluded(text) {

      const currentMonth = new Date().toLocaleString("default", { month: "long" });

      return text.toLowerCase().includes(currentMonth.toLowerCase());
    }

    isCurrentMonthIncluded(data?.Deduction || '')

    let lwf = {
      lwfDed: 0,
      lwfEmployer: 0
    }

    if (data && (isCurrentMonthIncluded(data?.Deduction || '') || data?.Deduction === 'Monthly')) {
      lwf = {
        lwfDed: data ? data.EmpShare : 0,
        lwfEmployer: data ? data.ERShare : 0
      }

    } else {
      lwf = {
        lwfDed: 0,
        lwfEmployer: 0
      }
    }
    console.log(ctc, grade, branchWages?.Branch, wage, date = new Date().toISOString().split('T')[0], lwf, isMetro, father, mother, isPSR)
    const res = calculateExactCTC(ctc, grade, branchWages?.Branch, wage, date = new Date().toISOString().split('T')[0], lwf, isMetro, father, mother, isPSR)
    return res;
  } catch (error) {
    console.error("Error fetching salary breakup:", error);
    throw error;
  }

}

const createSalaryHead = async (data) => {
  // optional: add duplicate check on Code
  const existing = await SalaryHeadMaster.findOne({ where: { Code: data.Code } });
  if (existing) throw new Error("Salary head with this Code already exists");
  return await SalaryHeadMaster.create(data);
};

const getAllSlaryHead = async () => {
  return await SalaryHeadMaster.findAll();
}

module.exports = {
  createNewSalaryHeadCode,
  createNewSalaryHeaddb,
  // saveUpdate,
  // findSalaryByGrade,
  getMinimumWagesByBranch,
  setReimbursmentdb,
  findOneEntitle,
  createEntitle,
  getSalaryHeaddb,
  getLocationsOfProfessionalTaxdb,
  saveGLDetailsdb,
  // calculateSalarySlip,
  saveSalarySlipdb,
  getSalarySlipInMaster,
  saveSalarySlipDetailsdb,
  getEmployeesForIncomeTaxComputationFromDB,
  getEmployeeDetailsForIncomeTaxComputationFromDB,
  getSavedIncomeTaxListFromDB,
  getDetailsOfSelectedTaxCodeFromDB,
  findManyEntitle,
  getSalaryBreakupByEmpRepo,
  getSalaryHeadDataRepo,
  getSalaryBreakupRepo,
  createSalaryHead,
  getAllSlaryHead,
  createMonthalyEntitle,
};