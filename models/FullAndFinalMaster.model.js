const { DataTypes } = require("sequelize");
const { element } = require("../config/db");

const FullAndFinalMaster = element.define("FullAndFinalMaster", {
  FullandFinalID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  FullandFinalCode: { type: DataTypes.STRING(50) },
  EmpCode: { type: DataTypes.STRING(25) },
  EmpName: { type: DataTypes.STRING(200) },
  BranchCode: { type: DataTypes.STRING(25) },
  BranchName: { type: DataTypes.STRING(200) },
  Designation: { type: DataTypes.STRING(100), allowNull: true, },
  Department: { type: DataTypes.STRING(100), allowNull: true, },
  FullandFinalType: { type: DataTypes.STRING(50), allowNull: true, },
  NoticePeriod: { type: DataTypes.DECIMAL(18, 2), allowNull: true, },
  NoticePeriodType: { type: DataTypes.STRING(50), allowNull: true, },
  JoiningDt: { type: DataTypes.STRING(100), allowNull: true, },
  DateOfApplication: { type: DataTypes.STRING(100), allowNull: true, },
  ReasonForLeaving: { type: DataTypes.STRING(500), allowNull: true, },
  Remarks: { type: DataTypes.STRING(500), allowNull: true, },
  PayMonth: { type: DataTypes.STRING(25), allowNull: true, },
  PaymentDays: { type: DataTypes.DECIMAL(18, 2), allowNull: true, },
  PresentDays: { type: DataTypes.DECIMAL(18, 2), allowNull: true, },
  TotalEarning: { type: DataTypes.DECIMAL(18, 2) },
  TotalDeduction: { type: DataTypes.DECIMAL(18, 2) },
  OtherEarning: { type: DataTypes.DECIMAL(18, 2), allowNull: true, },
  OtherDeduction: { type: DataTypes.DECIMAL(18, 2), allowNull: true, },
  NetSalary: { type: DataTypes.DECIMAL(18, 2), allowNull: true, },
  TotalReceipt: { type: DataTypes.DECIMAL(18, 2), allowNull: true, },
  CreatedBy: { type: DataTypes.STRING(50), allowNull: true, },
  CreatedDate: { type: DataTypes.STRING(100), allowNull: false, defaultValue: new Date().toISOString(), },
  ModifiedBy: { type: DataTypes.STRING(50), allowNull: true },
  ModifiedDate: { type: DataTypes.DATE, allowNull: true, },
  ELDays: { type: DataTypes.DECIMAL(18, 2), allowNull: true, },
  ELAmount: { type: DataTypes.DECIMAL(18, 2), allowNull: true, },
  LoanAmount: { type: DataTypes.DECIMAL(18, 2), allowNull: true, },
  PFamount: { type: DataTypes.DECIMAL(18, 2), allowNull: true, },
  ESICamount: { type: DataTypes.DECIMAL(18, 2), allowNull: true, },
  PFadminCharge: { type: DataTypes.DECIMAL(18, 2) }
}, {
  tableName: "FullAndFinalMaster",
  timestamps: false
});

module.exports = FullAndFinalMaster;
