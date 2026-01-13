const { DataTypes } = require("sequelize");
const { element } = require("../config/db");

const SequenceMasterO = element.define("SequenceMasterO", {
  ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  CompanyCode: { type: DataTypes.STRING(50) },
  CompanyPrefix: { type: DataTypes.STRING(50) },
  BranchCode: { type: DataTypes.STRING(50) },
  BranchName: { type: DataTypes.STRING(200) },
  BranchPrefix: { type: DataTypes.STRING(50) },
  Head: { type: DataTypes.STRING(200) },
  Prefix: { type: DataTypes.STRING(50) },
  Start: { type: DataTypes.INTEGER },
  Stop: { type: DataTypes.INTEGER },
  Increment: { type: DataTypes.INTEGER },
  LastValue: { type: DataTypes.INTEGER },
  FinancialYear: { type: DataTypes.BOOLEAN }
}, {
  tableName: "SequenceMasterO",
  timestamps: false
});

module.exports = SequenceMasterO;
