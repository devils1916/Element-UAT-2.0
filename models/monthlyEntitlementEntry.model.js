const { DataTypes } = require('sequelize');
const { element } = require('../config/db');

const MonthlyEntitlementEntry = element.define('MonthlyEntitlementEntry', {
    SNo: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true, // Important!
  },
  BranchCode: DataTypes.STRING(50),
  Month: DataTypes.STRING(50),
  Year: DataTypes.STRING(50),
 EmpID: {
  type: DataTypes.STRING,
  allowNull: false,
},
  EmpName: DataTypes.STRING(500),
  SalaryHeadCode: DataTypes.STRING(50),
  SalaryHead: DataTypes.STRING(100),
  Entitle: DataTypes.DECIMAL(9, 2),
  CreatedBy: DataTypes.STRING(500),
  CreatedDate: {
    type: DataTypes.DATE,
    allowNull: true, 
  },
  ModifiedBy: DataTypes.STRING(500),
  ModifiedDate: {
    type: DataTypes.DATE,
    allowNull: true, // Same here
  }
}, {
  tableName: 'MonthlyEntitlementEntry',
  timestamps: false
});

module.exports = MonthlyEntitlementEntry;
