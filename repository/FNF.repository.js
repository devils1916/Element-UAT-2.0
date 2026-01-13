// 📌 GET All FNF Records (Paginated)
const { Op, Sequelize } = require("sequelize");
const { parse } = require("date-fns");
const FullAndFinalMaster = require("../models/FullAndFinalMaster.model")
const FullAndFinalSalaryDetail = require("../models/FullAndFinalSalaryDetail.model")
const EmployeeMaster = require("../models/employeeMaster.model")
const FullAndFinalEncashmentDetail = require("../models/FullAndFinalEncashmentDetail.model");
const SequenceMaster1 = require("../models/sequenceMaster1.model")
const SequenceMasterO = require("../models/sequenceMasterO.model")
const { element } = require("../config/db");
const BranchMaster = require("../models/branchMaster.model")
const Company = require("../models/companyMaster.model")
const moment = require("moment")


const getExistingFNFDetailsService = async (querydata) => {
  let { page = 1, limit = 10, search = "" } = querydata;


  page = parseInt(page);
  limit = parseInt(limit);

  try {
    const offset = (page - 1) * limit;

    const whereClause = search
      ? {
        [Op.or]: [
          { EmpName: { [Op.like]: `%${search}%` } },
          { EmpCode: { [Op.like]: `%${search}%` } },
          { FullandFinalCode: { [Op.like]: `%${search}%` } }
        ]
      }
      : {};

    const { count, rows: fnfRecords } = await FullAndFinalMaster.findAndCountAll({
      attributes: ["EmpCode", "FullandFinalCode", "EmpName"], // ✅ Only required fields
      where: whereClause,
      offset,
      limit,
      order: [["CreatedDate", "DESC"]]
    });

    console.log(fnfRecords)

    return {
      data: fnfRecords,
      pagination: {
        totalRecords: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        pageSize: limit,
      },
    };

  } catch (error) {
    console.error(error);
    throw new Error(`Failed to fetch FNF records: ${error.message}`);
  }
};


const getFNFSalaryDetailsService = async (fullAndFinalCode, empCode) => {
  console.log("result", fullAndFinalCode, empCode)
  try {
    const salaryDetails = await FullAndFinalSalaryDetail.findAll({
      where: {
        FullandFinalCode: fullAndFinalCode,
        EmpCode: empCode
      },
      order: [["SNo", "ASC"]]
    });

    return salaryDetails;
  } catch (error) {
    console.error(error);
    throw new Error(`Failed to fetch salary details: ${error.message}`);
  }
};

const getFnfByEmployeeService = async (empCode) => {
  try {
    // Get FNF master record for the employee
    const master = await FullAndFinalMaster.findOne({
      where: { EmpCode: empCode }
    });

    if (!master) {
      return null; // handled in controller
    }

    // Get salary details
    const salaryDetails = await FullAndFinalSalaryDetail.findAll({
      where: { FullandFinalCode: master.FullandFinalCode },
      order: [["SNo", "ASC"]]
    });

    // Get encashment details
    const encashment = await FullAndFinalEncashmentDetail.findAll({
      where: { FullandFinalCode: master.FullandFinalCode },
      order: [["SNo", "ASC"]]
    });

    return { master, salaryDetails, encashment };
  } catch (error) {
    console.error(error);
    throw new Error(`Failed to fetch FNF details for employee: ${error.message}`);
  }
};

const generateFullAndFinalCodeRepo = async (branchCode) => {
  // Fetch branch and company short names
  const branch = await BranchMaster.findOne({ where: { Code: branchCode } });
  if (!branch) throw new Error("Invalid Branch");


  const company = await Company.findOne({ where: { Code: branch.CompanyCode } });
  if (!company) throw new Error("Invalid Company");


  const record = await SequenceMaster1.findOne({
    where: { BranchCode: branchCode, CompanyCode: branch.CompanyCode, Head: 'FullAndFinal' },
  });

  if (!record) {
    throw new Error("Sequence not initialized for this branch");
  }

  const lastvalue = record.LastValue
  const paddedValue = lastvalue.toString().padStart(5, "0");
  const now = new Date();
  const fyStart = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
  const fyEnd = fyStart + 1;
  const financialYear = `${fyStart.toString().slice(-2)}-${fyEnd.toString().slice(-2)}`;

  const code = `${record.CompanyPrefix}/${record.BranchPrefix}/${record.Prefix}/${paddedValue}/${financialYear}`;
  await SequenceMaster1.update(
    { LastValue: lastvalue + record.Increment },
    { where: { CompanyCode: branch.CompanyCode, BranchCode: branchCode, Head: 'FullAndFinal' } }
  );
  return code;

};

const getEligibleEmployeesService = async (branchCode, page = 1, limit = 10, search = "") => {
  try {
    const whereClause = {
      hasLeft: 1
    };

    if (branchCode) {
      whereClause.BranchCode = branchCode;
    }

    if (search) {
      whereClause[Op.or] = [
        { EmpID: { [Op.like]: `%${search}%` } },
        { Name: { [Op.like]: `%${search}%` } }
      ];
    }

    const offset = (page - 1) * limit;

    const { rows, count } = await EmployeeMaster.findAndCountAll({
      attributes: [
        "EmpID",
        "Name",
        "Department",
        "Designation",
        "BranchCode",
        "JoiningDt",
        "ResignationDate",
        "LeftDate",
        // [Sequelize.col("BranchMaster.Name"), "BranchName"]
      ],

      where: {
        ...whereClause,
        EmpID: {
          [Op.notIn]: Sequelize.literal("(SELECT EmpCode FROM FullandFinalMaster)")
        }
      },
      offset,
      limit,
      raw: true
    });

    return {
      data: rows,
      pagination: {
        totalRecords: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        limit
      }
    };
  } catch (error) {
    console.error(error);
    throw new Error(`Failed to fetch eligible employees: ${error.message}`);
  }
};


const showFNFDetailsService = async (empdata) => {
  const { empCode, branchCode, month, year, paymentDays, presentDays } = empdata;

  // 1. Call procedure to get salary details
  const [salaryDetails] = await element.query(
    `EXEC Proc_FullandFinalSalary :month, :monthNo, :year, :branchCode, :paymentDays, :empCode`,
    {
      replacements: {
        month,
        monthNo: new Date(`${month} 1, ${year}`).getMonth() + 1,
        year,
        branchCode,
        paymentDays,
        empCode,
      },
    }
  );

  // 2. Call procedure to get EL Days/Loan
  const [elResult] = await element.query(
    `EXEC Proc_FullandFinalELDAys :empCode`,
    { replacements: { empCode } }
  );

  const elDays = elResult?.[0]?.ELDays || 0;
  const elAmount = elResult?.[0]?.ELEncashmentAmount || 0;
  const loanAmount = elResult?.[0]?.LoanAmount || 0;

  // 3. Calculate totals
  let totalEarning = 0, totalDeduction = 0;
  salaryDetails.forEach(row => {
    if (row.EDType === "Earning") totalEarning += row.Amount;
    else if (row.EDType === "Deduction") totalDeduction += row.Amount;
  });

  const netSalary = totalEarning - totalDeduction;

  // 4. PF / ESIC
  const basic = salaryDetails.find(s => s.HeadCode === "SHC00001")?.Amount || 0;
  const hra = salaryDetails.find(s => s.HeadCode === "SHC00002")?.Amount || 0;
  const spl = salaryDetails.find(s => s.HeadCode === "SHC00005")?.Amount || 0;
  const conv = salaryDetails.find(s => s.HeadCode === "SHC00006")?.Amount || 0;
  const gross = basic + hra + spl + conv;

  let pf = 0;
  if (basic < 15000 && gross < 15000) pf = Math.round(gross * 0.12);
  else if (basic > 15000 && gross > 15000) pf = Math.round(basic * 0.12);
  else if (basic < 15000 && gross > 15000) pf = Math.round(15000 * 0.12);

  let esicEmployer = gross > 21000 ? 0 : Math.round(gross * 3.25 / 100);
  let pfAdminCharge = Math.round(gross * 1.0 / 100);

  // 5. Total Receipt
  const totalReceipt = (netSalary + elAmount) - loanAmount;

  return {
    salaryDetails,
    totals: {
      totalEarning,
      totalDeduction,
      netSalary,
      elDays,
      elAmount,
      loanAmount,
      totalReceipt,
      pf,
      esicEmployer,
      pfAdminCharge
    }
  };
};

// CREATE FNF
const createFNFService = async (payload) => {
  const t = await element.transaction();
  try {
    const { masterData, salaryDetails, encashments, financialYear, companyCode, branchCode } = payload;

    // Ensure date fields are ISO strings
    masterData.JoiningDt = new Date(masterData.JoiningDt).toISOString();
    masterData.DateOfApplication = new Date(masterData.DateOfApplication).toISOString();

    // 🔎 Validation: Check if EmpCode already exists in FullAndFinalMaster

    const existingRecord = await FullAndFinalMaster.findOne({
      where: { EmpCode: masterData.EmpCode },
      transaction: t,
    });

    if (existingRecord) {
      console.warn(`❌ Duplicate found: EmpCode ${masterData.EmpCode} already exists in FullAndFinalMaster.`);
      await t.rollback();
      return {
        success: false,
        message: `FNF record already exists for EmpCode ${masterData.EmpCode}`,
      };
    }

    await FullAndFinalMaster.create(
      { ...masterData },
      { transaction: t }
    );


    if (salaryDetails && salaryDetails.length > 0) {
      console.log("➡️ Inserting SalaryDetails...");
      await FullAndFinalSalaryDetail.bulkCreate(
        salaryDetails.map((s, idx) => ({
          ...s,
          FullandFinalCode: masterData.FullandFinalCode,
          SNo: idx + 1,
        })),
        { transaction: t }
      );
      console.log("✅ SalaryDetails inserted successfully");
    }

    if (encashments && encashments.length > 0) {

      await FullAndFinalEncashmentDetail.bulkCreate(
        encashments.map((e, idx) => ({
          ...e,
          FullandFinalCode: masterData.FullandFinalCode,
          SNo: idx + 1,
        })),
        { transaction: t }
      );
      console.log("✅ Encashments inserted successfully");
    }

    console.log("➡️ Updating sequence...");
    const seqTable =
      financialYear === process.env.CURRENT_FIN_YEAR
        ? SequenceMaster1
        : SequenceMasterO;

    await seqTable.increment("lastValue", {
      by: 1,
      where: { head: "FullAndFinal", CompanyCode: companyCode, BranchCode: branchCode },
      transaction: t,
    });


    await t.commit();
    console.log("🎉 Transaction committed successfully");

    return { success: true, message: "FNF created successfully" };
  } catch (error) {
    console.error("❌ Transaction failed:", error);
    await t.rollback();
    return { success: false, message: "FNF creation failed", error: error.message || error };
  }
};


const updateFNFService = async (payload) => {

  const t = await element.transaction();
  const { masterData, salaryDetails, encashments } = payload;
  console.log("data", masterData)
  try {

    masterData.JoiningDt = new Date(masterData.JoiningDt).toISOString();
    masterData.DateOfApplication = new Date(masterData.DateOfApplication).toISOString();
    // 1. Update master
    await FullAndFinalMaster.update(masterData, {
      where: { FullandFinalCode: masterData.FullandFinalCode },
      transaction: t,
    });

    // 4. Re-insert salary details
    if (salaryDetails && salaryDetails.length > 0) {

      // 2. Delete old salary details
      await FullAndFinalSalaryDetail.destroy({
        where: { FullandFinalCode: masterData.FullandFinalCode },
        transaction: t,
      });


      await FullAndFinalSalaryDetail.bulkCreate(
        salaryDetails.map((s, idx) => ({
          ...s,
          FullandFinalCode: masterData.FullandFinalCode,
          SNo: idx + 1
        })),
        { transaction: t }
      );
    }

    // 5. Re-insert encashments
    if (encashments && encashments.length > 0) {

      // 3. Delete old encashments
      await FullAndFinalEncashmentDetail.destroy({
        where: { FullandFinalCode: masterData.FullandFinalCode },
        transaction: t,
      });

      await FullAndFinalEncashmentDetail.bulkCreate(
        encashments.map((e, idx) => ({
          ...e,
          FullandFinalCode: masterData.FullandFinalCode,
          SNo: idx + 1
        })),
        { transaction: t }
      );
    }

    await t.commit();
    return { success: true, message: "FNF updated successfully" };
  } catch (error) {
    await t.rollback();
    throw error;
  }
};


const getFullAndFinalPayRegister = async ({ month, year, empType, branchCode }) => {
  const query = `EXEC Proc_FullandFinalPayRegister :month, :year, :empType, :branchCode`;
  const results = await element.query(query, {
    replacements: { month, year, empType, branchCode },
    type: element.QueryTypes.SELECT,
  });
  return results;
};


const recalcMasterTotals = async (fullandFinalCode, transaction) => {
  const details = await FullAndFinalEncashmentDetail.findAll({
    where: { FullandFinalCode: fullandFinalCode },
    transaction,
  });

  let otherEarning = 0;
  let otherDeduction = 0;

  details.forEach(d => {
    if (d.PlusMinus === "+") otherEarning += d.Amount;
    else if (d.PlusMinus === "-") otherDeduction += d.Amount;
  });

  const master = await FullAndFinalMaster.findOne({
    where: { FullandFinalCode: fullandFinalCode },
    transaction,
  });

  if (master) {
    const netPay = Number(master.NetSalary || 0);
    const loan = Number(master.LoanAmount || 0);
    const elAmount = Number(master.ELAmount || 0);

    const totalReceipt = (netPay + otherEarning + elAmount) - (otherDeduction + loan);

    await master.update({
      OtherEarning: otherEarning,
      OtherDeduction: otherDeduction,
      TotalReceipt: totalReceipt,
    }, { transaction });
  }
};

const createEncashmentRep = async (data) => {
  return await element.transaction(async (t) => {
    const detail = await FullAndFinalEncashmentDetail.create(data, { transaction: t });
    await recalcMasterTotals(data.FullandFinalCode, t);
    return detail;
  });
};

const updateEncashmentRep = async (fullandFinalCode, sNo, data) => {
  return await element.transaction(async (t) => {
    const detail = await FullAndFinalEncashmentDetail.findOne({
      where: {
        FullandFinalCode: fullandFinalCode,
        SNo: sNo,
      },
      transaction: t,
    });

    if (!detail) throw new Error("Encashment detail not found");

    await detail.update(data, { transaction: t });
    await recalcMasterTotals(fullandFinalCode, t);

    return detail;
  });
};

const deleteEncashmentRep = async (fullandFinalCode, sNo) => {
  return await element.transaction(async (t) => {
    const detail = await FullAndFinalEncashmentDetail.findOne({
      where: {
        FullandFinalCode: fullandFinalCode,
        SNo: sNo,
      },
      transaction: t,
    });

    if (!detail) throw new Error("Encashment detail not found");

    await detail.destroy({ transaction: t });

    // recalc totals after delete
    await recalcMasterTotals(fullandFinalCode, t);

    return { message: "Deleted successfully" };
  });
};


const getFullAndFinalEmployees = async (months, years, empType, branch) => {
  try {
    const query = `
      SELECT FFM.FullandFinalCode, FFM.PayMonth, @Years AS Years, 
             FFM.PresentDays, FFM.PaymentDays, FFM.BranchCode, 
             FFM.BranchName, EM.EmpType, FFM.EmpCode, FFM.EmpName,
             EM.UnitESIC, FFM.Department, FFM.Designation, EM.DoB,
             EM.JoiningDt, EM.PFNo, EM.ESICNo, EM.PanNo, EM.CardNo AS OldCode
      FROM FullandFinalMaster AS FFM
      INNER JOIN EmployeeMaster AS EM ON FFM.EmpCode = EM.EmpID
      WHERE FFM.PayMonth = @Months AND YEAR(FFM.DateOfApplication) = @Years
      ${branch !== 'All Branch' ? 'AND FFM.BranchCode = @Branch' : ''}
      ${empType ? 'AND EM.EmpType = @EmpType' : ''}
    `;
    const request = this.pool.request()
      .input('Months', sql.VarChar(50), months)
      .input('Years', sql.VarChar(25), years)
      .input('EmpType', sql.VarChar(50), empType)
      .input('Branch', sql.VarChar(25), branch);
    const result = await request.query(query);
    return result.recordset;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

const getEmployeeEntitlements = async (companyCode = 'CM00002') => {
  try {
    const query = `
      SELECT EM.EmpId, EE.SalHead, SHM.Head, EE.Entitle, 
             SHM.EarningDeduction AS HeadType, EM.IsESICApplicable
      FROM EmployeeMaster EM 
      INNER JOIN EmployeeEntitlement EE ON EM.EmpId = EE.EmpCode
      INNER JOIN SalaryHeadMaster SHM ON EE.SalHead = SHM.Code
      WHERE EM.CompanyCode = @CompanyCode 
        AND EM.HasLeft = 1
        AND EE.SalHead NOT IN ('SHC00008', 'SHC00009', 'SHC00020', 'SHC00022', 'SHC00023')
    `;
    const result = await this.pool.request()
      .input('CompanyCode', sql.VarChar(50), companyCode)
      .query(query);
    return result.recordset;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
const getSalaryDetails = async (months, years) => {
  try {
    const query = `SELECT FFM.FullandFinalCode, FFM.EmpCode, SHM.Head AS HeadName, FFSD.Amount FROM FullandFinalMaster FFM INNER JOIN FullandFinalSalaryDetail AS FFSD ON FFM.FullandFinalCode = FFSD.FullandFinalCode INNER JOIN SalaryHeadMaster AS SHM ON FFSD.HeadCode = SHM.Code WHERE FFM.PayMonth = @Months AND YEAR(FFM.DateOfApplication) = @Years`;
    const result = await this.pool.request()
      .input('Months', sql.VarChar(50), months)
      .input('Years', sql.VarChar(25), years)
      .query(query);
    return result.recordset;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

const getEmployeeBankDetails = async (empCodes) => {
  try {
    if (!empCodes.length) return [];
    const placeholders = empCodes.map((_, i) => `@EmpCode${i}`).join(',');
    const query = `
      SELECT EmpId, BankName, AccountNo, RegdNo AS IFSCCode
      FROM EmployeeMaster
      WHERE EmpId IN (${placeholders})
    `;
    const result = await request.query(query);
    return result.recordset;
  } catch (error) {
    throw error;
  }
}

module.exports = {

  getExistingFNFDetailsService,
  getFNFSalaryDetailsService,
  getEligibleEmployeesService,
  getFnfByEmployeeService,
  generateFullAndFinalCodeRepo,
  showFNFDetailsService,
  createFNFService,
  updateFNFService,
  getFullAndFinalPayRegister,
  createEncashmentRep,
  updateEncashmentRep,
  deleteEncashmentRep,
  getFullAndFinalEmployees,
  getEmployeeEntitlements,
  getEmployeeBankDetails,
  getSalaryDetails

};
