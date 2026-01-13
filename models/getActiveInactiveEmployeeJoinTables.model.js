const EmployeeMaster = require("./employeeMaster.model");
const BranchMaster = require("./branchMaster.model");
const AssesmentForm = require("./Assesment_Form.model");
const LoiInformation = require("./Loi_information.model");
const Resignation = require("./Resignation.model");
const EmployeeEntitlement = require("./employeeEntitlement.model");
const SalaryHeadMaster = require("./SalaryHeadMasterNew.model");

// // ------------------ EMPLOYEE → BRANCH ------------------ //
// EmployeeMaster.belongsTo(BranchMaster, {
//     foreignKey: "BranchCode",
//     targetKey: "Code",
//     as: "Branch",
//     constraints: false
// });

// // ------------------ EMPLOYEE → TEAM LEADER (SELF JOIN) ------------------ //
// EmployeeMaster.belongsTo(EmployeeMaster, {
//     foreignKey: "TL_Emp_Code",
//     targetKey: "EmpID",
//     as: "TL",
//     constraints: false
// });

// // ------------------ EMPLOYEE → LOI ------------------ //
// EmployeeMaster.hasOne(LoiInformation, {
//     foreignKey: "empId",      
//     sourceKey: "EmpID",      
//     as: "Loi",
//     constraints: false
// });

// // ------------------ LOI → ASSESSMENT FORM ------------------ //
// LoiInformation.belongsTo(AssesmentForm, {
//     foreignKey: "req_no",
//     targetKey: "requisition_no",
//     as: "AF",
//     constraints: false
// });

// //------------------ EMPLOYEE → RESIGNATION ------------------ //
// EmployeeMaster.hasOne(Resignation, {
//     foreignKey: "Empcode",
//     sourceKey: "EmpID",
//     as: "Resignation",
//     constraints: false
// });

// // ------------------ EMPLOYEE → EMPLOYEE ENTITLEMENT  ------------------ //
// EmployeeMaster.hasMany(EmployeeEntitlement, { 
//     foreignKey: "EmpCode",
//     sourceKey: "EmpID",
//     as: "EmployeeEntitle"   
// });

// // ------------------ EMPLOYEE ENTITLEMENT → SALARY HEAD MASTER ------------------ //
// EmployeeEntitlement.belongsTo(SalaryHeadMaster, {
//     foreignKey: "SalHead",
//     targetKey: "Code",
//     as: "SalaryHead"
// });

module.exports = {
    EmployeeMaster,
    BranchMaster,
    AssesmentForm,
    LoiInformation,
    Resignation,
    EmployeeEntitlement,
    SalaryHeadMaster
};
