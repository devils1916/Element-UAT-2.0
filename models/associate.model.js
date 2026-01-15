const Sequelize = require("sequelize");
const element = require("../config/db").element;

// Import models
const DailyAttendanceMaster = require("./dailyAttendenceMaster.model");
const DailyAttendenceDetails = require("./dailyAttendanceDetails.model");
const { EmployeeLeaveAvailed, EmployeeLeave } = require("./AttendenceModels");

// Define association: DailyAttendenceDetails belongs to AttendenceMaster via AttendenceCode
// DailyAttendenceDetails.belongsTo(DailyAttendanceMaster, {
//   foreignKey: 'DailyAttendenceCode',
//   targetKey: 'DailyAttendenceCode',
// });

// // Optional reverse association: one master → many daily
// DailyAttendanceMaster.hasMany(DailyAttendenceDetails, {
//   foreignKey: 'DailyAttendenceCode',
//   sourceKey: 'DailyAttendenceCode',
// });


EmployeeLeaveAvailed.belongsTo(EmployeeLeave, {
  foreignKey: 'EmpLeaveCode',   // in EmployeeLeaveAvailed
  targetKey: 'EmpLeaveCode',    // in EmployeeLeaveApplication
  as: 'application'
});

EmployeeLeave.hasMany(EmployeeLeaveAvailed, {
  foreignKey: 'EmpLeaveCode',
  sourceKey: 'EmpLeaveCode',
  as: 'availed'
});





module.exports = {
  Sequelize,
  sequelize: element,
  // DailyAttendanceMaster,
  // DailyAttendenceDetails,
  EmployeeLeaveAvailed,
  EmployeeLeave
};
