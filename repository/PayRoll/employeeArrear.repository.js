const EmployeeArrearMaster = require("../../models/PayRoll/EmployeeArrearMaster.model");


const createEmployeeArrear = async (data) => {
  return await EmployeeArrearMaster.create(data);
};

module.exports = {
  createEmployeeArrear,
};
