const { DataTypes } = require('sequelize');
const { element } = require('../config/db'); // your Sequelize instance

const EmployeeLeaveControl = element.define('EmployeeLeaveControl', {
  LeaveID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  CompanyCode: DataTypes.STRING,
  BranchCode: DataTypes.STRING,
  LeaveYear: DataTypes.STRING,
  LeaveType: DataTypes.STRING,
  LeaveDescription: DataTypes.STRING,
  DaysCriteria: DataTypes.STRING,
  NoOfDays: DataTypes.FLOAT,
  LeaveDays: DataTypes.FLOAT,
  MinDays: DataTypes.FLOAT,
  MaxDays: DataTypes.FLOAT,
  AnnualLeave: DataTypes.FLOAT,
  CarryForward: DataTypes.BOOLEAN,
  DaysCarryforward: DataTypes.FLOAT,
  HolidayCount: DataTypes.BOOLEAN,
  Encashment: DataTypes.BOOLEAN,
  inPresentDays: DataTypes.BOOLEAN,
  PaymentMode: DataTypes.BOOLEAN,
  HalfPaidorFullPaid: DataTypes.BOOLEAN,
  LeavePerMonth: DataTypes.FLOAT,
  ToBeCalculated: DataTypes.BOOLEAN
}, {
  tableName: 'EmployeeLeaveControl',
  timestamps: false
});

module.exports = EmployeeLeaveControl;
