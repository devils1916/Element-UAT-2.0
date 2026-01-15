const EmployeeModel = require("./../models/employeeMaster.model");
const PHRMBranchWiseModel = require("./../models/PHBranchWise.model");
const usernamemaserModel = require("./../models/userNameMaster");
const companyModel = require("./../models/companyMaster.model")
const BranchModel = require("./../models/branchMaster.model")
const GradeModel = require("./../models/Grade.model")
const CountryModel = require("./../models/countryMaster.model")
const ShiftModel = require("./../models/ShiftMaster.model")
BranchCommercialHeadModel = require("./../models/BranchCommercialHead.Model");
const employeeEntitlementModel = require("./../models/employeeEntitlement.model");
const SalaryHeadMasterNewModel = require("./../models/SalaryHeadMasterNew.model")
// const salaryHeadMaster2 = require("./../models/salaryHeadMaster.model");
const reimbursementModel = require("./../models/employeeReimbursement.model");
const glDetailsModel = require("./../models/glDetails.model");
const salarySlipModel = require("./../models/salarySlip.model");
const salarySlipEmployeeModel = require("./../models/salarySlipEmployee.model");
const salarySlipEntitlementDetailsModel = require("./../models/SalarySlipEntitlementDetails.model");
const MonthlyEntitlementEntry = require("./../models/monthlyEntitlementEntry.model");
const SalarySlipEmployeeModel = require("./../models/salarySlipEmployee.model");
const DesignationMasterModel = require("../models/designationMaster.model");
const DepartmentMasterModel = require("./../models/departmentMaster.model");
const MonthlyEntitlementEntryModel = require('./../models/monthlyEntitlementEntry.model');
const EmployeeArrearMasterModel  =  require('./../models/PayRoll/EmployeeArrearMaster.model');
const AttendenceDetailsModel = require('./../models/employeeAttendenceDetails.model')
module.exports = (sequelize, DataTypes) => {
  EmployeeModel(sequelize, DataTypes);
  PHRMBranchWiseModel(sequelize, DataTypes);
  usernamemaserModel(sequelize, DataTypes);
  companyModel(sequelize, DataTypes);
  BranchModel(sequelize, DataTypes);
  GradeModel(sequelize, DataTypes);
  CountryModel(sequelize, DataTypes);
  ShiftModel(sequelize, DataTypes);
  BranchCommercialHeadModel(sequelize, DataTypes);
  employeeEntitlementModel(sequelize, DataTypes);
  SalaryHeadMasterNewModel(sequelize, DataTypes);
  // salaryHeadMaster2(sequelize, DataTypes);
  reimbursementModel(sequelize, DataTypes);
  glDetailsModel(sequelize, DataTypes);
  salarySlipModel(sequelize, DataTypes);
  salarySlipEmployeeModel(sequelize, DataTypes);
  salarySlipEntitlementDetailsModel(sequelize, DataTypes);
  MonthlyEntitlementEntry(sequelize, DataTypes);
  SalarySlipEmployeeModel(sequelize, DataTypes);
  DesignationMasterModel(sequelize, DataTypes);
  DepartmentMasterModel(sequelize, DataTypes);
  MonthlyEntitlementEntryModel (sequelize, DataTypes);
  EmployeeArrearMasterModel (sequelize, DataTypes);
  AttendenceDetailsModel (sequelize, DataTypes);
};
