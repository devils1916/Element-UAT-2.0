require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT;
const bodyParser = require('body-parser');

//middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const errorMiddleware = require("./middleware/error.middleware");

const cotectUsRout = require("./routers/contectUs.routes");            // contect need to change database and it's functionality
const elementRout = require("./routers/element.routes");               //element login or user mastern routes
const employee = require("./routers/employeeMaster.routes");           //employee master routes
const company = require("./routers/companyMaster.routes");            // company master routes
const branches = require("./routers/branchMaster.routes");             // branch master routes
const salHead = require("./routers/salaryHeadMaster.routes");         // Salary related routes grade amout and reimbursement and entitlement and  minimum wages
const email = require("./routers/email.routes");                     // email routes
const GradeMaster = require("./routers/gradeMaster.routes");         // grade master routes
const countryMaster = require("./routers/countrymaster.routes");     // country master routes
const select = require("./routers/dropdowns.routes")                 //dropdawn options routes
const attendance = require("./routers/attendence.routes")
const bulkUpload = require("./routers/bulkUpload.routes")
const salarySlipRoutes = require("./routers/salarySlip.routes")
const salarySlipEmployeeRoutes = require("./routers/salarySlipEmployee.routes");
const entitlementDetailsRoute = require("./routers/SalarySlipEntitlementDetails.route");
const employeeAttendenceRoutes = require('./routers/employeeAttendenceDetails.routes');
const monthlyEntitlementEntry = require("./routers/monthlyEntitlementEntry.routes")
const employeeArrearRoutes = require("./routers/PayRoll/employeeArrear.routes")
const employeeArrearDetailsRoutes = require("./routers/PayRoll/EmployeeArrearDetails.route")
const transitionRoutes = require("./routers/PayRoll/transition.routes");
const FNFRoutes = require("./routers/FNF.routes");
const payrollRoutes = require("./routers/PayRoll/payroll.routes")
const DepartmentRout = require("./routers/Department/department.routes")
const DesignationRoute = require("./routers/designationMaster.routes")
const ReportsRoute = require("./routers/reports.route")


app.use("/contact", cotectUsRout);
app.use("/element", elementRout); // all done
app.use("/employee", employee); // all done           --------------changes REMAINING AT validateEmployeeDetails  function
app.use("/company", company);   // done
app.use("/employee", employee); // all done
app.use("/company", company); // all done 
app.use("/branch", branches); //all done
app.use("/salary", salHead);    // all done -- TDS part remaining
app.use("/email", email);
app.use("/grade", GradeMaster); // done
app.use("/country", countryMaster); // done
app.use("/select", select);     // done
app.use("/admin", attendance);   // working
app.use("/admin", bulkUpload);    //Done 
app.use('/api', salarySlipRoutes);
app.use('/api/salary-slip-employee', salarySlipEmployeeRoutes);
app.use("/api/salary-slip-entitlement", entitlementDetailsRoute);
app.use('/api/attendance', employeeAttendenceRoutes);
app.use('/api/monthentit', monthlyEntitlementEntry);
app.use("/api/emparrear", employeeArrearRoutes);
app.use("/admin", attendance); // 
app.use("/admin", bulkUpload); // done
app.use('/api/salary-slip_details', salarySlipRoutes); //  done 
app.use('/api/salary-slip-employee', salarySlipEmployeeRoutes); //done 
app.use("/api/salary-slip-entitlement", entitlementDetailsRoute); // done
app.use('/api/attendance', employeeAttendenceRoutes); //  done
app.use('/api/monthentit', monthlyEntitlementEntry); // done
app.use("/api/emparrear", employeeArrearRoutes); // done
app.use("/api/emparreardetails", employeeArrearDetailsRoutes);
app.use("/api/emparrear/transistion", transitionRoutes);
app.use("/payroll", payrollRoutes);
app.use("/fnf", FNFRoutes);
app.use("/departments", DepartmentRout);
app.use("/designation", DesignationRoute);
app.use("/departments", DepartmentRout); //done
app.use("/designation", DesignationRoute); // done 

app.use("/api/reports", ReportsRoute);

app.use(errorMiddleware);
app.listen(PORT, () => { console.log(`Server is running on port ${PORT}`); });

