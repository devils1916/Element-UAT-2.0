// File: models/DesignationMaster.js
const { DataTypes } = require("sequelize");
const { element } = require("../config/db");

module.exports = (sequelize, DataTypes) => {
    return sequelize.define("DesignationMaster", {
  ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  DesignationCode: { type: DataTypes.STRING(50), allowNull: false },
  Description: { type: DataTypes.STRING(255), allowNull: false },
  CreatedBy: { type: DataTypes.STRING(100), allowNull: false },
  ModifiedBy: { type: DataTypes.STRING(100), allowNull: false },
  newCompanyCode : { type: DataTypes.STRING(100), allowNull: false },
}, {
  tableName: "DesignationMaster",
  timestamps: false,
});
}
//module.exports = DesignationMaster;
