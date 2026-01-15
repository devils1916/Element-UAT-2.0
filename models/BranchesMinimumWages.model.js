// File: models/BranchesMinimumWages.js
const { DataTypes } = require("sequelize");
const { element } = require("../config/db");

const BranchesMinimumWages = element.define("BranchesMinimumWages", {
  SrNo: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Branch: { type: DataTypes.STRING(100) },
  BranchCode: { type: DataTypes.STRING(25) },
  State: { type: DataTypes.STRING(100) },
  Unskilled: { type: DataTypes.DECIMAL(18, 2) },
  SemiSkilled: { type: DataTypes.DECIMAL(18, 2) },
  Skilled: { type: DataTypes.DECIMAL(18, 2) },
  HighlySkilled: { type: DataTypes.DECIMAL(18, 2) },



}, {
  tableName: "BranchesMinimumWages",
  timestamps: false
});

module.exports = BranchesMinimumWages;