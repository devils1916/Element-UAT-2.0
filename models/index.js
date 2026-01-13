const EmployeeModel = require("./../models/employeeMaster.model");
const PHRMBranchWiseModel = require("./../models/PHBranchWise.model");
const usernamemaserModel = require("./../models/userNameMaster");
const companyModel = require("./../models/companyMaster.model")
const BranchModel = require("./../models/branchMaster.model")
const GradeModel = require("./../models/Grade.model")
const CountryModel = require("./../models/countryMaster.model")
const ShiftModel = require("./../models/ShiftMaster.model")
BranchCommercialHeadModel = require("./../models/BranchCommercialHead.Model")
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
};
