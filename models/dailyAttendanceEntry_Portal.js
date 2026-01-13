// File: models/DailyAttendanceEntry_Portal.js
const { DataTypes } = require("sequelize");
const { element } = require("../config/db");

const DailyAttendanceEntry_Portal = element.define("DailyAttendanceEntry_Portal", {
  DailyAttendanceId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  BranchCode: { type: DataTypes.STRING(25) },
  BranchName: { type: DataTypes.STRING(100) },
  Location: { type: DataTypes.STRING(100) },
  UserId: { type: DataTypes.INTEGER },
  Badgenumber: { type: DataTypes.STRING(25) },
  SSN: { type: DataTypes.STRING(25) },
  EmployeeCode: { type: DataTypes.STRING(25) },
  EmployeeName: { type: DataTypes.STRING(100) },
  AttendanceDate: { type: DataTypes.DATEONLY },
  CheckInOut: { type: DataTypes.DATE },
  Insert_By: { type: DataTypes.STRING(50) }
}, {
  tableName: "DailyAttendanceEntry_Portal",
  timestamps: false
});

module.exports = DailyAttendanceEntry_Portal;
