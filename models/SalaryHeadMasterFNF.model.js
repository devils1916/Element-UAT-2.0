const { DataTypes } = require("sequelize");
const { element } = require("../config/db");

const SalaryHeadMaster = element.define("SalaryHeadMaster", {
  SalaryID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Code: { type: DataTypes.STRING(50) },
  Head: { type: DataTypes.STRING(200) },
  Description: { type: DataTypes.STRING(500) },
  inSalarySlip: { type: DataTypes.BOOLEAN },
  EarningDeduction: { type: DataTypes.STRING(50) }, // 'Earning' or 'Deduction'
  Remarks: { type: DataTypes.STRING(500) },
  IsBasicSalary: { type: DataTypes.BOOLEAN },
  IsOvertime: { type: DataTypes.BOOLEAN },
  InOvertimeSlip: { type: DataTypes.BOOLEAN },
  IsAnnualBenefit: { type: DataTypes.BOOLEAN },
  IsStatutoryBenefit: { type: DataTypes.BOOLEAN },
  IsOnUploadExcel: { type: DataTypes.BOOLEAN },
  InCTC: { type: DataTypes.BOOLEAN },
  CompanyCode: { type: DataTypes.STRING(50) },
  Amount: { type: DataTypes.DECIMAL(18, 2) },
  Grade: { type: DataTypes.STRING(50) }
}, {
  tableName: "SalaryHeadMaster",
  timestamps: false
});

module.exports = SalaryHeadMaster;
