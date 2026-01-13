const EmployeeArrearDetails = require("../../models/PayRoll/EmployeeArrearDetails.model");
const EmployeeArrearMaster = require("../../models/PayRoll/EmployeeArrearMaster.model");
const EmployeeArrearMonthWise = require("../../models/PayRoll/EmployeeArrearDetailsMonthWise.model");
const SalarySlip = require("../../models/salarySlip.model");
const SalarySlipEntitlementDetails = require("../../models/SalarySlipEntitlementDetails.model");
const { element } = require("../../config/db");

const saveArrearFull = async (master, details) => {
  const t = await element.transaction();
  try {
    // get SalarySlipCode
    const slip = await SalarySlip.findOne({
      attributes: ['SalarySlipCode'],
      where: {
        Months: master.PaidInMonth,
        Years: master.PaidInYear,
        BranchCode: master.BranchCode,
      }
    });

    const SalarySlipCode = slip ? slip.SalarySlipCode : null;

    if (!slip) {
      return { success: false, message: "Salary Slip not generated for " + master.PaidInMonth + "/" + master.PaidInYear };
    }

    //  save into EmployeeArrearMaster
    await EmployeeArrearMaster.create({
      TransactionCode: master.TransactionCode,
      TransactionDate: master.TransactionDate || new Date().toISOString().split('T')[0],
      BranchCode: master.BranchCode,
      BranchName: master.BranchName,
      EmployeeType: master.EmployeeType,
      EmployeeCode: master.EmployeeCode,
      EmployeeName: master.EmployeeName,
      WEFDate: master.WEFDate,
      ArrearType: master.ArrearType,
      ArrearFromMonth: master.ArrearFromMonth,
      ArrearFromYear: master.ArrearFromYear,
      PaidInMonth: master.PaidInMonth,
      PaidInYear: master.PaidInYear,
      ArrearDays: master.ArrearDays,
      ArrearPeriod: master.ArrearPeriod,
      TillDate: master.TillDate,
      SalarySlipCode: SalarySlipCode
    }, { transaction: t });

    // save into EmployeeArrearDetails
    for (let d of details) {
      await EmployeeArrearDetails.create({
        TransactionCode: master.TransactionCode,
        SNo: d.SNo,
        HeadCode: d.HeadCode,
        HeadName: d.HeadName,
        HeadType: d.HeadType,
        Rate: d.Rate,
        RevisedRate: d.RevisedRate,
        Difference: d.Difference,
        Arrear: d.Arrear
      }, { transaction: t });
    }
    // INSERT INTO EmployeeArrearMonthWise 
    for (let d of details) {
      await EmployeeArrearMonthWise.create({
        TransactionCode: master.TransactionCode,
        HeadCode: d.HeadCode,
        HeadName: d.HeadName,
        HeadType: d.HeadType,
        ArrearMonth: master.PaidInMonth,
        Arrear: d.Arrear,
        SNo: d.SNo,
      }, { transaction: t });
    }

    // Upsert into SalarySlipEntitlementDetails
    const existingRows = await SalarySlipEntitlementDetails.findAll({
      where: {
        SalarySlipCode: SalarySlipCode,
        EmpCode: master.EmployeeCode
      },
      transaction: t
    });

    const existingMap = {};
    existingRows.forEach(row => {
      existingMap[row.HeadCode] = row;
    });

    for (let d of details) {
      const existing = existingMap[d.HeadCode];

      if (existing) {
        await existing.update(
          { Arrear: d.Arrear },
          { transaction: t }
        );
      } else {
        await SalarySlipEntitlementDetails.create({
          SNo: d.SNo,
          SalarySlipCode: SalarySlipCode,
          HeadCode: d.HeadCode,
          Name: d.HeadName,
          Rate: d.Rate,
          Amount: d.Rate,
          EmpCode: master.EmployeeCode,
          EarnDedu: d.HeadType,
          Arrear: d.Arrear
        }, { transaction: t });
      }
    }

    await t.commit();
    return { success: true, message: "Arrear details saved successfully" };

  } catch (error) {
    console.error(error);
    await t.rollback();
    return { success: false, message: error.message };
  }
};
const getArrearDetailsByTransactionCode = async (TransactionCode) => {
  try {
    const result = await EmployeeArrearDetails.findAll({
      where: { TransactionCode },
      order: [["SNo", "ASC"]],
    });
    return { success: true, data: result };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

const getEmployeeArrearMasterByTransactionCode = async (transactionCode) => {
  try {
    const result = await EmployeeArrearMaster.findOne({
      where: { TransactionCode: transactionCode },
    });

    if (!result) {
      return { success: false, message: "No record found" };
    }

    return { success: true, data: result };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

module.exports = { saveArrearFull, getEmployeeArrearMasterByTransactionCode, getArrearDetailsByTransactionCode };