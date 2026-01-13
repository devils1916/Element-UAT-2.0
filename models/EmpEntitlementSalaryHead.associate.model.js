const EmployeeSalary = require("../models/employeeEntitlement.model");
const SalaryHeadMaster = require("./SalaryHeadMasterNew.model");

EmployeeSalary.belongsTo(SalaryHeadMaster, {
  foreignKey: "SalHead",
  targetKey: "Code"
});

SalaryHeadMaster.hasMany(EmployeeSalary, {
  foreignKey: "SalHead",
  sourceKey: "Code"
});

module.exports = { EmployeeSalary, SalaryHeadMaster };