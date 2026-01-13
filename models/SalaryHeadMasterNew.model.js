const { DataTypes } = require("sequelize");
const { element } = require("../config/db");

const SalaryHeadMaster = element.define(
  "SalaryHeadMaster",
  {
    SalaryID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Code: {
      type: DataTypes.STRING(25),
      allowNull: true,
    },
    Head: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    Description: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    inSalarySlip: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
    },
    EarningDeduction: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    Remarks: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    IsBasicSalary: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
    },
    IsOvertime: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
    },
    InOvertimeSlip: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
    },
    IsAnnualBenefit: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
    },
    IsStatutoryBenefit: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
    },
    IsOnUploadExcel: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
    },
    InCTC: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
    }
  },
  {
    tableName: "SalaryHeadMaster",
    timestamps: false,
  }
);

module.exports = SalaryHeadMaster;