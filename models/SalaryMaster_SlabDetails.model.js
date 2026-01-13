const { DataTypes } = require("sequelize");
const { element } = require("../config/db");

const SalaryMaster_SlabDetails = element.define("SalaryMaster_SlabDetails", {
  SalHead: { type: DataTypes.STRING(50) },
  Sequence: { type: DataTypes.INTEGER },
  CompanyCode: { type: DataTypes.STRING(50) },
  Branch: { type: DataTypes.STRING(50) },
  SubUnit: { type: DataTypes.STRING(200) },
  MinofCalculatedOn: { type: DataTypes.DECIMAL(18, 2) },
  MaxOfCalculatedOn: { type: DataTypes.DECIMAL(18, 2) },
  Percentage: { type: DataTypes.DECIMAL(18, 2) },
  MinAmount: { type: DataTypes.DECIMAL(18, 2) },
  MaxAmount: { type: DataTypes.DECIMAL(18, 2) },
  EmployerShare: { type: DataTypes.DECIMAL(18, 2) },
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  }
}, {
  tableName: "SalaryMaster_SlabDetails",
  timestamps: false
});

module.exports = SalaryMaster_SlabDetails;
