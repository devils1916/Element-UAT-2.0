const { element } = require("../config/db");
const ExcelJS = require('exceljs');
const Employee = require("../models/employeeMaster.model");
const { Op, QueryTypes } = require("sequelize");
const EmployeeArrearMaster = require("../models/PayRoll/EmployeeArrearMaster.model")
const EmployeeArrearDetails = require("../models/PayRoll/EmployeeArrearDetails.model")
const BranchMaster = require("../models/branchMaster.model")
const dayjs = require("dayjs");

const callBankStatementReport = async (
  month,
  year,
  branchCode,
  bankOrCash,
  empType,
  bankName
) => {
  try {
    const query = empType
      ? `EXEC Proc_BankStatementReport 
          @Month = :month,
          @Year = :year,
          @BranchCode = :branchCode,
          @Cash = :bankOrCash,
          @EmpType = :empType,
          @BankName = :bankName`
      : `EXEC Proc_BankStatementReport 
          @Month = :month,
          @Year = :year,
          @BranchCode = :branchCode,
          @Cash = :bankOrCash,
          @BankName = :bankName`;

    const result = await element.query(query, {
      replacements: { month, year, branchCode, bankOrCash, empType, bankName },
      type: element.QueryTypes.SELECT,
    });

    return result;
  } catch (error) {
    console.error("Error calling Proc_BankStatementReport:", error);
    throw error;
  }
};



// employee details report apis// start

//getEmployeeDetails
const getEmployeeDetails = async (value, reportType) => {
  let query;
  let replacements = {};

  switch (reportType) {
    case 'Branch Wise':
      query = `
        SELECT BranchCode, BranchName, EmpID, Name, Department, Designation, 
               DoB, JoiningDt, EduQualification, PhoneNo, Earning, Deduction, NetSalary 
        FROM VIEW_EmployeeSalaryDetailsRep 
        WHERE BranchCode = :value 
        ORDER BY Name
      `;
      replacements = { value };
      break;

    case 'Department Wise':
      query = `
        SELECT BranchCode, BranchName, EmpID, Name, Department, Designation, 
               DoB, JoiningDt, EduQualification, PhoneNo, Earning, Deduction, NetSalary 
        FROM VIEW_EmployeeSalaryDetailsRep 
        WHERE Department = :value 
        ORDER BY BranchName, Name
      `;
      replacements = { value };
      break;

    case 'Designation Wise':
      query = `
        SELECT BranchCode, BranchName, EmpID, Name, Department, Designation, 
               DoB, JoiningDt, EduQualification, PhoneNo, Earning, Deduction, NetSalary 
        FROM VIEW_EmployeeSalaryDetailsRep 
        WHERE Designation = :value 
        ORDER BY BranchName, Name
      `;
      replacements = { value };
      break;

    default:
      throw new Error('Invalid report type');
  }

  const results = await element.query(query, {
    replacements,
    type: element.QueryTypes.SELECT
  });

  return results;
};



const getDropdownDataForEmpDetailRep = async (reportType) => {
  switch (reportType) {
    case 'Branch Wise':
      // Returns branches from BranchMaster table
      return await BranchMaster.findAll({
        attributes: ['Code', 'Name'],
        order: [['Name', 'ASC']],
        raw: true
      });

    case 'Department Wise':
      // Returns unique departments from EmployeeMaster table
      const deptQuery = `
        SELECT DISTINCT Department AS Name, '' AS Code 
        FROM EmployeeMaster 
        WHERE Department IS NOT NULL
        ORDER BY Department
      `;
      return await element.query(deptQuery, {
        type: element.QueryTypes.SELECT
      });

    case 'Designation Wise':
      // Returns unique designations from EmployeeMaster table
      const desigQuery = `
        SELECT DISTINCT Designation AS Name, '' AS Code 
        FROM EmployeeMaster 
        WHERE Designation IS NOT NULL
        ORDER BY Designation
      `;
      return await element.query(desigQuery, {
        type: element.QueryTypes.SELECT
      });

    default:
      throw new Error('Invalid report type. Must be: Branch Wise, Department Wise, or Designation Wise');
  }
};

// Search employees
const searchEmployeesRepo = async (searchTerm, searchColumn = 'Name') => {
  const validColumns = ['Name', 'EmpID', 'Department', 'Designation', 'BranchName'];

  if (!validColumns.includes(searchColumn)) {
    throw new Error('Invalid search column');
  }

  const query = `
    SELECT BranchCode, BranchName, EmpID, Name, Department, Designation, 
           DoB, JoiningDt, EduQualification, PhoneNo, Earning, Deduction, NetSalary 
    FROM VIEW_EmployeeSalaryDetailsRep 
    WHERE ${searchColumn} LIKE :searchTerm
    ORDER BY Name
  `;

  return await element.query(query, {
    replacements: { searchTerm: `%${searchTerm}%` },
    type: QueryTypes.SELECT
  });
};



// Employee Entitlement Details
const calculateSummary = (data) => {
  if (!data?.length) return {};
  // Example: You can customize the summary logic here
  return {
    totalEmployees: data.length,
    totalBasicPay: data.reduce((acc, emp) => acc + (emp.BasicPay || 0), 0),
    totalAllowance: data.reduce((acc, emp) => acc + (emp.Allowance || 0), 0),
  };
};

const formatDateForSQL = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`; // SQL standard format YYYY-MM-DD
};


const getEmployeeEntitlementDetailsReportRepo = async ({
  companyCode,
  branchCode,
  fromDate,
  toDate,
  asOnDate,
  searchText,
}) => {
  if (!companyCode) {
    throw new Error("Company code is required");
  }
  if (!branchCode) {
    throw new Error("Branch code is required");
  }

  let startDate, endDate;

  // Determine date range
  if (asOnDate) {
    const minDateResult = await element.query(
      "SELECT MIN(JoiningDt) as minDate FROM EmployeeMaster",
      { type: element.QueryTypes.SELECT }
    );
    startDate = minDateResult[0]?.minDate || new Date();
    endDate = new Date();
  } else {
    if (!fromDate || !toDate) {
      throw new Error("From date and To date are required when asOnDate is false");
    }
    startDate = new Date(fromDate);
    endDate = new Date(toDate);
  }

  // Execute stored procedure
  const query = `
    EXECUTE Proc_EmployeeEntitlementDetails 
      'Full Time', 
      :companyCode, 
      :branchCode, 
      :fromDate, 
      :toDate
  `;

  const results = await element.query(query, {
    replacements: {
      companyCode,
      branchCode,
      fromDate: formatDateForSQL(startDate),
      toDate: formatDateForSQL(endDate),
    },
    type: element.QueryTypes.SELECT,
  });

  // Apply search filter if provided
  let filteredData = results;
  if (searchText && searchText.trim() !== "") {
    const search = searchText.toLowerCase();
    filteredData = results.filter(
      (emp) =>
        emp.EmpCode?.toLowerCase().includes(search) ||
        emp.EmpName?.toLowerCase().includes(search) ||
        emp.CentreName?.toLowerCase().includes(search) ||
        emp.Department?.toLowerCase().includes(search) ||
        emp.Designation?.toLowerCase().includes(search)
    );
  }

  // Calculate summary
  const summary = calculateSummary(filteredData);

  return {
    data: filteredData,
    summary,
    fromDate: startDate.toLocaleDateString("en-GB"),
    toDate: endDate.toLocaleDateString("en-GB"),
    totalRecords: filteredData.length,
  };
};



/**
 * Get Employee Pay Register Report
 */
const getEmployeePayRegisterReportRepo = async ({ month, year, employeeType, branchCode }) => {
  try {
    // First, get the salary slip code
    const salarySlipCode = await getSalarySlipCode({ month, year, employeeType, branchCode });

    if (!salarySlipCode) {
      throw new Error('Salary slip not generated for the given criteria');
    }

    // Execute stored procedure to get pay register data
    // const query = `EXEC Proc_EmpPayRegister @Month = :month, @Year = :year, @EmpType = :employeeType, @BranchCode = :branchCode`;
    const query = `
  EXEC Proc_EmpPayRegister 
    @Months = :month, 
    @Years = :year, 
    @EmpType = :employeeType, 
    @Branch = :branchCode
`;
    const results = await element.query(query, {
      replacements: {
        month,
        year,
        employeeType,
        branchCode: branchCode === 'All Branch' ? '' : branchCode
      },
      type: element.QueryTypes.SELECT
    });

    return {
      salarySlipCode,
      payRegister: results,
      summary: calculateSummary(results)
    };
  } catch (error) {
    console.error('Service Error - getEmployeePayRegister:', error);
    throw error;
  }
};


const getSalarySlipCode = async ({ month, year, employeeType, branchCode }) => {
  try {
    let query;
    let replacements = { month, year, employeeType };

    if (branchCode === 'All Branch' || !branchCode) {
      query = `
        SELECT TOP 1 SalarySlipCode 
        FROM SalarySlipMaster 
        WHERE Months = :month 
          AND Years = :year 
          AND EmpType = :employeeType
      `;
    } else {
      query = `
        SELECT DISTINCT TOP 1 SSM.SalarySlipCode 
        FROM SalarySlipMaster AS SSM 
        INNER JOIN SalarySlipEmployee AS SSE ON SSM.SalarySlipCode = SSE.SalarySlipCode 
        WHERE SSM.Months = :month 
          AND SSM.Years = :year 
          AND SSM.EmpType = :employeeType 
          AND SSE.EmpBranchCode = :branchCode
      `;
      replacements.branchCode = branchCode;
    }

    const result = await element.query(query, {
      replacements,
      type: element.QueryTypes.SELECT
    });

    return result.length > 0 ? result[0].SalarySlipCode : null;
  } catch (error) {
    console.error('Service Error - getSalarySlipCode:', error);
    throw error;
  }
};


/**
 * Export Pay Register to Excel
 */
const exportToExcelPayRegisterReportRepo = async ({ month, year, employeeType, branchCode, branchName = 'Test' }) => {
  try {
    // Get the data
    const data = await getEmployeePayRegisterReportRepo({ month, year, employeeType, branchCode });

    // Create workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Pay Register');

    // Add title
    worksheet.mergeCells('A1:E1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = `Employee Pay Register ${branchName} (${month}-${year})`;
    titleCell.font = { bold: true, size: 14 };
    titleCell.alignment = { horizontal: 'center' };

    // Add headers (row 2)
    const headers = Object.keys(data.payRegister[0] || {});
    worksheet.getRow(2).values = headers;
    worksheet.getRow(2).font = { bold: true };

    // Add data
    data.payRegister.forEach((row, index) => {
      const rowData = headers.map(header => row[header]);
      worksheet.getRow(index + 3).values = rowData;
    });

    // Auto-fit columns
    worksheet.columns.forEach(column => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, cell => {
        const columnLength = cell.value ? cell.value.toString().length : 10;
        if (columnLength > maxLength) {
          maxLength = columnLength;
        }
      });
      column.width = maxLength < 10 ? 10 : maxLength + 2;
    });

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  } catch (error) {
    console.error('Service Error - exportToExcel:', error);
    throw error;
  }
};



// EMPLOYEE ACTIVE/INACTIVE DETAILS REPORT
const getEmployeesActiveInactiveRepo = async (companyCode, branchCode, Type, status) => {
  try {
    console.log(companyCode, branchCode, status, Type)
    const result = await element.query(
      `EXEC PROC_GetActiveInactiveEmployeeFilteredData 
          @FilterType = :FilterType,               
          @CompanyCode = :CompanyCode,
          @BranchCode = :BranchCode,
          @Status = :Status`,
      {
        replacements: {
          FilterType: Type || null,
          CompanyCode: companyCode,
          BranchCode: branchCode && branchCode.trim() !== '' ? branchCode : null,
          Status: status && status.trim() !== '' ? status : null,
        },
        type: QueryTypes.SELECT,
      }
    );
    return result;
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
};


// EMPLOYEE ARREAR REGISTER
const getEmpArrearRegisterReportRepo = async ({ month, year, employeeType, branchCode }) => {
  // Step 1: Fetch arrear master records
  const arrearMasterRecords = await EmployeeArrearMaster.findAll({
    //  attributes: ['TransactionCode', 'BranchCode', 'BranchName', 'EmployeeCode', 'EmployeeName', 'ArrearDays'],
    where: {
      PaidInMonth: month,
      PaidInYear: year,
      EmployeeType: employeeType,
      BranchCode: branchCode,
    },
  });

  //  return arrearMasterRecords 

  if (!arrearMasterRecords || arrearMasterRecords.length === 0) {
    return { success: false, message: 'No arrear records found for the given criteria' };
  }

  // Step 2: Extract keys
  const transactionCodes = arrearMasterRecords.map((r) => r.TransactionCode);
  const employeeCodes = [...new Set(arrearMasterRecords.map((r) => r.EmployeeCode))];

  // Step 3: Fetch arrear details
  const arrearDetails = await EmployeeArrearDetails.findAll({
    where: { TransactionCode: { [Op.in]: transactionCodes } },
  });

  //  return arrearDetails
  // Step 4: Fetch employee data
  const employees = await Employee.findAll({
    where: { EmpID: { [Op.in]: employeeCodes } },
  });
  // return employees
  // Step 5: Merge all data
  const combinedData = arrearMasterRecords.map((master) => {
    const details = arrearDetails.filter((d) => d.TransactionCode === master.TransactionCode);
    const employee = employees.find((e) => e.EmpID === master.EmployeeCode);
    return {
      arrearMaster: master,
      arrearDetails: details,
      employeeData: employee || null,
    };
  });

  // Step 6: Summary
  const summary = {
    totalRecords: arrearMasterRecords.length,
    totalEmployees: employeeCodes.length,
    totalArrearAmount: arrearDetails.reduce(
      (sum, d) => sum + parseFloat(d.Arrear || 0),
      0
    ),
    filters: { month, year, employeeType, branchCode },
  };

  return { success: true, summary, data: combinedData };
};



function getFinancialYear(month, year) {
  const monthLower = month.toLowerCase();

  const monthsAfterMarch = [
    "april", "may", "june", "july",
    "august", "september", "october",
    "november", "december"
  ];

  let startYear, endYear;

  if (monthsAfterMarch.includes(monthLower)) {
    startYear = year;
    endYear = (year + 1).toString().slice(-2); // e.g. 2025 → 2026 → "26"
  } else {
    startYear = year - 1;
    endYear = year.toString().slice(-2);
  }

  return `${startYear}-${endYear}`;
}



const getCostSheetReportRepo = async (branchCode, year, month) => {

  try {
    const EmployeePayRegister = await getEmployeePayRegisterReportRepo({
      month,
      year,
      employeeType: "Full Time",
      branchCode,
    })


    if (!EmployeePayRegister?.payRegister) {
      throw new Error("No Data found");
    }

    const mapData = EmployeePayRegister?.payRegister.map((data) => ({
      FY: getFinancialYear(month, year),
      MONTH: month,
      "AGENCYNAME": "",
      "AGENCYID": "",
      SFAID: "",
      BRANCH: data?.BranchName,
      REGION: "",
      PROFILE: "",
      DOJ: data?.JoiningDt,
      "EMPLOYEENAME": data?.EmpName,
      "OUTLETCODE": "",
      "OUTLETNAME": "",
      CHANNEL: "",
      FIXEDCTC: data?.TotalCTC,
      "FIXEDNTH": data?.GrossEarning - data?.TotalDeduction,
      NETPAYABLE: data?.NetPayable,
      "PayableCTC": data?.CTC,
      ServiceFEE: 0,
      "TotalCTC": data?.TotalCTC
    }))

    return mapData



    // let whereClause= {
    //   CompanyCode:comapny,
    //   BranchCode:branch
    // }
    // const employees = await Employee.findAll({
    //   where: whereClause,
    //   order: [["Name", "ASC"]],
    // });

    // if (!employees) {
    //   throw new Error("No Data found");
    // }
  } catch (error) {
    throw new Error(error);
  }
}



const getInsuranceReportRepo = async (company, branch, type, endorsementEffective, yearPremiumAmount) => {
  try {

    // Convert start date
    const start = dayjs(endorsementEffective);

    // Policy End Date = start + 1 year - 1 day (so full 1-year coverage)
    const policyEndDate = start.add(1, "year").subtract(1, "day");

    // Calculate pro-rata days
    const proRataDays = policyEndDate.diff(start, "day") + 1; // include start day

    // Core Calculations
    const proRataPremium = (yearPremiumAmount * proRataDays) / 365;
    const gst = proRataPremium * 0.18;
    const total = proRataPremium + gst;

    const insuranceReport = {
      endorsementEffective: start.format("YYYY-MM-DD"),
      policyEndDate: policyEndDate.format("YYYY-MM-DD"),
      proRataDays,
      yearPremiumAmount,
      proRataPremium: Math.round(proRataPremium),
      gst: Math.round(gst),
      total: Math.round(total),
    }

    const whereClause = {
      CompanyCode: company,
      BranchCode: branch
    };

    const employees = await Employee.findAll({
      where: whereClause,
      order: [["Name", "ASC"]],
    });

    // return employees;

    const result = employees.map((emp, index) => ({
      "S No.": index + 1,
      "BRANCHNAME": emp.BranchCode || "",
      "EMPCODE": emp.EmpID || "",
      "EMPNAME": emp.Name || "",
      "DEPARTMENT": emp.Department || "",
      "DESIGNATION": emp.Designation || "",
      "ESG": emp.Grade || "",
      "DOB": emp.DoB ? emp.DoB : "",
      "JOINING DATE": emp.JoiningDt ? emp.JoiningDt : "",
      "GENDER": emp.Sex || "",
      "GROSS EARNING": emp.GrossSalary || "",
      "ESIC /NO ESIC": emp.IsESICApplicable ? "ESIC" : "NO ESIC",
      "FATHER NAME": emp.FatherName || "",
      "FATHER (DOB)": emp.FatherDOB ? emp.FatherDOB : "",
      "MOTHER NAME": emp.MotherName || "",
      "MOTHER (DOB)": emp.MotherDOB ? emp.MotherDOB : "",
      "MARRITAL STATUS": emp.MaritalStatus || "",
      "SPOUSE NAME": emp.SpouseName || "",
      "SPOUSE DOB": emp.SpouseDOb ? emp.SpouseDOb : "",
      "CHILD-1 NAME": emp.Child1Name || "",
      "DOB.1": emp.Child1DOB ? emp.Child1DOB : "",
      "GENDER.1": emp.Child1Gender || "",
      "CHILD-2 NAME": emp.Chile2Name || "",
      "DOB.2": emp.Child2DOB ? emp.Child2DOB : "",
      "GENDER.2": emp.Child2Gender || "",
      "NOMINEE NAME": emp.NomeneeName || "",
      "RELATION WITH NOMINEE": emp.ReleationwithNomnee || "",
      "EMPLOYEE MOBILE NO": emp.MobileNo || emp.PhoneNo || "",
      "GHI SUM ASSURED": "",
      "Medical (Self + Family)": "",
      "Medical For Parents": "",
      "Medical (Self + Family+Parent": "",
      "No of Add": "",
      "Division": emp.Division || "",
      "Endorsement Effective": insuranceReport.endorsementEffective || "",
      "Pro-Rata days": insuranceReport.proRataDays || "",
      "Policy End Date": insuranceReport.policyEndDate || "",
      "Year Premium amount": insuranceReport.yearPremiumAmount || "",
      "Pro-rata Premium": insuranceReport.proRataPremium || "",
      "18% GST": insuranceReport.gst || "",
      "Total": insuranceReport.total || "",
      "Remarks": "",
      "Brand": ""
    }));

    return result;

  } catch (error) {
    console.error("Error fetching insurance report:", error);
    throw error;
  }
};




module.exports = {
  callBankStatementReport,
  getEmployeeDetails,
  getDropdownDataForEmpDetailRep,
  searchEmployeesRepo,
  getEmployeeEntitlementDetailsReportRepo,
  getEmployeePayRegisterReportRepo,
  exportToExcelPayRegisterReportRepo,
  getEmployeesActiveInactiveRepo,
  getEmpArrearRegisterReportRepo,
  getCostSheetReportRepo,
  getInsuranceReportRepo
}