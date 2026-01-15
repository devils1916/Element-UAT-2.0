const { DataTypes } = require("sequelize");
const { element } = require("../config/db");

const DailyAttendanceMaster = element.define(
  "DailyAttendenceMaster",
  {
    DailyAttendanceID: {
      type: DataTypes.BIGINT, // numeric(18,0)
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    BranchCode: {
      type: DataTypes.STRING(25),
      allowNull: false,
    },
    BranchName: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    DailyAttendenceCode: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    AttendenceYear: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    AttendenceMonth: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    MinDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    CreatedBy: {
      type: DataTypes.STRING(25),
      allowNull: true,
    },
    CreationDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    ModifiedBy: {
      type: DataTypes.STRING(25),
      allowNull: true,
    },
    ModificationDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    EmpType: {
      type: DataTypes.STRING(25),
      allowNull: true,
    },
  },
  {
    tableName: "DailyAttendenceMaster",
    timestamps: false,
    freezeTableName: true,
  }
);

module.exports = DailyAttendanceMaster;
