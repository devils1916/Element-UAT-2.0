const { DataTypes } = require("sequelize");
const { element } = require("../../config/db");

const EmployeeArrearDetails = element.define(
  "EmployeeArrearDetails",
  {
    TransactionCode: {
      type: DataTypes.STRING(25),
      primaryKey: true,
    },
    SNo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    HeadCode: {
      type: DataTypes.STRING(25),
      allowNull: false,
    },
    HeadName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    HeadType: {
      type: DataTypes.STRING(25),
      allowNull: false,
    },
    Rate: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
    },
    RevisedRate: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
    },
    Difference: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
    },
    Arrear: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
    },
  },
  {
    tableName: "EmployeeArrearDetails",
    timestamps: false,
  }
);

module.exports = EmployeeArrearDetails;
