const { DataTypes } = require("sequelize");
const { element } = require("../../config/db");

const Department = element.define(
  "Department",
  {
    DepartmentID: {
      type: DataTypes.NUMERIC(18, 0),
      primaryKey: true,
      autoIncrement: true,
    },
    DepartmentCode: {
      type: DataTypes.STRING(25),
      allowNull: false,
      unique: true,
    },
    Description: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    CreatedBy: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    ModifiedBy: {
      type: DataTypes.STRING(25),
      allowNull: true,
    },
    AuthorisedDepartment: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
  },
  {
    tableName: "DepartmentMaster",
    timestamps: false,
  }
);

module.exports = Department;
