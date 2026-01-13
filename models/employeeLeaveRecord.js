const { DataTypes } = require("sequelize");
const { element } = require('../config/db');

const EmployeeLeaveRecord = element.define('EmployeeLeaveRecord', {
  ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  BranchCode: { type: DataTypes.STRING(25) },
  EmpCode: { type: DataTypes.STRING(25) },
  MonthNo: { type: DataTypes.INTEGER },
  Months: { type: DataTypes.STRING(10) },
  Years: { type: DataTypes.STRING(10) },
  LeaveOpeningDate: { type: DataTypes.DATEONLY },
  LeaveType: { type: DataTypes.STRING(5) },
  LeaveDescription: { type: DataTypes.STRING(100) },
  OpeningBalance: { type: DataTypes.DECIMAL(18, 2) },
  LeaveTaken: { type: DataTypes.DECIMAL(18, 2) },
  AvailedLeave: { type: DataTypes.DECIMAL(18, 2) },
  ClosingBalance: { type: DataTypes.DECIMAL(18, 2) }
}, {
  tableName: 'EmployeeLeaveRecord',
  timestamps: false
});

module.exports = EmployeeLeaveRecord;
