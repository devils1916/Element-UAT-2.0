// File: models/DailyAttendanceEntry_Actual.js
const { DataTypes } = require("sequelize");
const { element } = require("../config/db");

const DailyAttendanceEntry_Actual = element.define("DailyAttendanceEntry_Actual", {
  BranchCode: { type: DataTypes.STRING(25) },
  BranchName: { type: DataTypes.STRING(100) },
  EmployeeCode: { type: DataTypes.STRING(25) },
  EmployeeName: { type: DataTypes.STRING(100) },
  AttendanceMonth: { type: DataTypes.STRING(25) },
  AttendanceYear: { type: DataTypes.STRING(25) },
  AttendanceDate: { type: DataTypes.DATEONLY },
  InTime: { type: DataTypes.DATE },
  OutTime: { type: DataTypes.DATE },
  PresentStatus: { type: DataTypes.STRING(10) },
  Remarks: { type: DataTypes.STRING(200) },
  noofleave: { type: DataTypes.DECIMAL(10, 2) },
  Noofshortleave: { type: DataTypes.DECIMAL(10, 2) }
}, {
  tableName: "DailyAttendanceEntry_Actual",
  timestamps: false
});

module.exports = DailyAttendanceEntry_Actual;
