const { DataTypes } = require("sequelize");
const { element } = require("../../config/db");

module.exports = (sequelize, DataTypes) => {
    sequelize.define(
  "EmployeeArrearMaster",
  {
    Id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
    },
    TransactionCode: {
      type: DataTypes.STRING(25),
      primaryKey: true,
      unique: true,
      allowNull: false,
    },
    TransactionDate: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    BranchCode: {
      type: DataTypes.STRING(25),
      allowNull: false,
    },
    BranchName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    EmployeeType: {
      type: DataTypes.STRING(25),
      allowNull: false,
    },
    EmployeeCode: {
      type: DataTypes.STRING(25),
      allowNull: false,
    },
    EmployeeName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    WEFDate: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    ArrearType: {
      type: DataTypes.STRING(25),
      allowNull: false,
    },
    ArrearFromMonth: {
      type: DataTypes.STRING(25),
      allowNull: false,
    },
    ArrearFromYear: {
      type: DataTypes.STRING(25),
      allowNull: false,
    },
    PaidInMonth: {
      type: DataTypes.STRING(25),
      allowNull: false,
    },
    PaidInYear: {
      type: DataTypes.STRING(25),
      allowNull: false,
    },
    ArrearDays: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: false,
    },
    ArrearPeriod: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    TillDate: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  },
  {
    tableName: "EmployeeArrearMaster",
    timestamps: false,
  }
);
}
//module.exports = EmployeeArrearMaster;
