const { DataTypes } = require("sequelize");
const { element } = require("../config/db");

module.exports = (sequelize, DataTypes) => {
    return sequelize.define("DepartmentMaster", {
  DepartmentID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  DepartmentCode: { type: DataTypes.STRING(50) },
  Description: { type: DataTypes.STRING(255) },
  CreatedBy: { type: DataTypes.STRING(100) },
  ModifiedBy: { type: DataTypes.STRING(100) },
  AuthorisedDepartment: { type: DataTypes.STRING(100), allowNull: true },
  newCompanyCode : { type: DataTypes.STRING(100), allowNull: false },
}, {
  tableName: "DepartmentMaster",
  timestamps: false
});
}

