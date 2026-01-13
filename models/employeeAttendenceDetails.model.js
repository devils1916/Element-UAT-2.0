const { DataTypes } = require('sequelize');
const { element } = require('../config/db');

const AttendenceDetails = element.define('AttendenceDetails', {
  AttendenceCode: { type: DataTypes.STRING(25), allowNull: false },
  BranchCode: { type: DataTypes.STRING(25) },
  BranchName: { type: DataTypes.STRING(200) },
  EmployeeCode: { type: DataTypes.STRING(25) },
  EmployeeName: { type: DataTypes.STRING(200) },
  Designation: { type: DataTypes.STRING(100) },
  Department: { type: DataTypes.STRING(100) },
  PresentDays: { type: DataTypes.DECIMAL(24, 2), allowNull: false },
  WPLDays: { type: DataTypes.DECIMAL(18, 2) },
  CL: { type: DataTypes.DECIMAL(18, 2) },
  SL: { type: DataTypes.DECIMAL(18, 2) },
  EL: { type: DataTypes.DECIMAL(18, 2) },
  RH: { type: DataTypes.DECIMAL(18, 2) },
  TotalLeave: { type: DataTypes.DECIMAL(24, 2) },
  WeeklyOff: { type: DataTypes.DECIMAL(18, 0) },
  Holidays: { type: DataTypes.DECIMAL(18, 2) },
  SalaryDays: { type: DataTypes.DECIMAL(24, 2) },
  Remarks: { type: DataTypes.STRING(500) },
  AttPreviousMonth: { type: DataTypes.DECIMAL(18, 0) },
  EmpBranchCode: { type: DataTypes.STRING(25) },
  EmpBranchName: { type: DataTypes.STRING(200) },
  OTDays: { type: DataTypes.DECIMAL(18, 2), allowNull: false },
  OTHours: { type: DataTypes.DECIMAL(18, 2), allowNull: false },
  ID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
}, {
  tableName: 'AttendenceDetails',
  timestamps: false
});

module.exports = AttendenceDetails;
