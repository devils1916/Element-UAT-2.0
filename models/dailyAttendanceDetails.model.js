const { DataTypes } = require("sequelize");
const { element } = require('../config/db');

const DailyAttendenceDetails = element.define('AttendanceDetails', {
  SNo: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  DailyAttendenceCode: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  BranchCode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  BranchName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  EmployeeCode: {
    type: DataTypes.STRING,
    allowNull: false,
      // 👈 Set as Primary Key
  },
  EmployeeName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Designation: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Department: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  // D1 to D31
  ...Object.fromEntries(
    Array.from({ length: 31 }, (_, i) => [
      `D${i + 1}`,
      {
        type: DataTypes.STRING(5),
        allowNull: true,
      },
    ])
  ),

}, {
  tableName: 'DailyAttendenceDetails',
  timestamps: false,
  freezeTableName: true,  // Optional: prevents Sequelize from pluralizing the table name
});

module.exports = DailyAttendenceDetails;
