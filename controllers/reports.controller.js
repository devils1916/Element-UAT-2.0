const { callBankStatementReport, getEmployeeDetails, getDropdownDataForEmpDetailRep, searchEmployeesRepo, getEmployeeEntitlementDetailsReportRepo, getEmployeePayRegisterReportRepo, exportToExcelPayRegisterReportRepo, getEmployeesActiveInactiveRepo, getEmpArrearRegisterReportRepo, getCostSheetReportRepo, getInsuranceReportRepo } = require("../repository/reports.repository");
const downloadEmployeeExcelService = require("../services/exportEmployeeDetilsReport.service")
const getActiveInactiveEmployeeFilteredData = require("../services/CalculateActiveInactiveEmployee.service");
const fs = require("fs");
const ExcelJS = require("exceljs");
const { fetchAllRowsActiveEnactiveEmployees } = require("../services/downloadEmployeeAll.service");



const getBankStatementReport = async (req, res) => {
    try {
        const { month, year, branchCode, bankOrCash, empType, bankName } = req.query;
        //   return res.status(200).json({data:req.query})
        if (!month || !year || !branchCode || !bankOrCash)
            return res.status(400).json({
                success: false,
                message: "Missing required parameters (month, year, branchCode, bankOrCash).",
            });

        const data = await callBankStatementReport(
            month,
            year,
            branchCode,
            bankOrCash,
            empType,
            bankName
        );

        res.json({ success: true, data });
    } catch (err) {
        console.error("Error in getBankStatementReport:", err);
        res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
};



const executeStoredProcedure = async (req, res) => {
    try {
        const { value, reportType } = req.query;

        if (!value || !reportType) {
            return res.status(400).json({
                success: false,
                message: 'Value and reportType are required'
            });
        }

        const result = await getEmployeeDetails(value, reportType);

        res.status(200).json({
            success: true,
            message: 'Stored procedure executed successfully',
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error executing stored procedure',
            error: error.message
        });
    }
};


// Get dropdown data based on report type
const getDropdownDataForEmpDetail = async (req, res) => {
    try {
        const { reportType } = req.query;

        if (!reportType) {
            return res.status(400).json({
                success: false,
                message: 'reportType is required (Branch Wise, Department Wise, or Designation Wise)'
            });
        }

        const validReportTypes = ['Branch Wise', 'Department Wise', 'Designation Wise'];
        if (!validReportTypes.includes(reportType)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid report type. Must be: Branch Wise, Department Wise, or Designation Wise'
            });
        }

        const data = await getDropdownDataForEmpDetailRep(reportType);

        res.status(200).json({
            success: true,
            reportType,
            totalRecords: data.length,
            data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving dropdown data',
            error: error.message
        });
    }
};


// Search employees
const searchEmployees = async (req, res) => {
    try {
        const { searchTerm, searchColumn } = req.query;

        if (!searchTerm) {
            return res.status(400).json({
                success: false,
                message: 'Search term is required'
            });
        }

        const data = await searchEmployeesRepo(searchTerm, searchColumn);

        res.status(200).json({
            success: true,
            searchTerm,
            searchColumn: searchColumn || 'Name',
            totalRecords: data.length,
            data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error searching employees',
            error: error.message
        });
    }
};


const getEmployeeEntitlementDetailsReport = async (req, res) => {
    try {
        const result = await getEmployeeEntitlementDetailsReportRepo(req.body);

        return res.status(200).json({
            success: true,
            ...result,
        });
    } catch (error) {
        console.error("Error fetching employee entitlement details:", error);
        const status = error.message.includes("required") ? 400 : 500;
        return res.status(status).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
};


/**
 * Get Employee Pay Register Report
 */
const getEmployeePayRegisterReport = async (req, res) => {
    try {
        const { month, year, employeeType, branchCode } = req.query;

        // Validation
        if (!month || !year || !employeeType) {
            return res.status(400).json({
                success: false,
                message: 'Month, Year, and Employee Type are required'
            });
        }

        const result = await getEmployeePayRegisterReportRepo({
            month,
            year,
            employeeType,
            branchCode: branchCode || 'All Branch'
        });

        return res.status(200).json({
            success: true,
            data: result,
            message: 'Employee pay register retrieved successfully'
        });
    } catch (error) {
        console.error('Error in getEmployeePayRegister:', error);
        return res.status(500).json({
            success: false,
            message: 'Error retrieving employee pay register',
            error: error.message
        });
    }
};

const exportToExcelPayRegisterReport = async (req, res) => {
    try {
        const { month, year, employeeType, branchCode, branchName } = req.body;

        if (!month || !year || !employeeType) {
            return res.status(400).json({
                success: false,
                message: 'Month, Year, and Employee Type are required'
            });
        }

        const buffer = await exportToExcelPayRegisterReportRepo({
            month,
            year,
            employeeType,
            branchCode,
            branchName
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=PayRegister_${branchName}_${month}_${year}.xlsx`);

        return res.send(buffer);
    } catch (error) {
        console.error('Error in exportToExcel:', error);
        return res.status(500).json({
            success: false,
            message: 'Error exporting to Excel',
            error: error.message
        });
    }
};

const getEmployeesActiveInactive = async (req, res) => {
    try {
        const { companyCode, branchCode, Type, status } = req.query;
        if (!companyCode) {
            return res.status(400).json({
                success: false,
                message: "companyCode and branchCode are required",
            });
        }
        const employees = await getEmployeesActiveInactiveRepo(companyCode, branchCode, Type, status);
        return res.status(200).json({ success: true, data: employees });
    } catch (error) {
        console.error("Error fetching employees:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
const getFilteredEmployees = async (req, res) => {
    const data = await getActiveInactiveEmployeeFilteredData({
        FilterType: req.query.FilterType,
        CompanyCode: req.query.CompanyCode,
        BranchCode: req.query.BranchCode,
        Status: req.query.Status,
        search: req.query.search,
        page: req.query.page,
        limit: req.query.limit
    });

    return res.json(data);
};

const exportEmployeesActiveInactive = async (req, res) => {
    try {
        const { companyCode, branchCode, Type, status } = req.query;

        if (!companyCode) {
            return res.status(400).json({
                success: false,
                message: "companyCode and branchCode are required",
            });
        }

        // 1️⃣ Get employee data
        const employees = await getEmployeesActiveInactiveRepo(companyCode, branchCode, Type, status);

        if (!employees || employees.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No employees found for the given filters",
            });
        }

        // 2️⃣ Generate Excel buffer (not file)
        const buffer = await downloadEmployeeExcelService(employees);

        // 3️⃣ Set headers for download
        res.setHeader(
            "Content-Disposition",
            'attachment; filename="Employee_Report.xlsx"'
        );
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        // 4️⃣ Send Excel buffer directly
        res.send(buffer);
    } catch (error) {
        console.error("Error exporting employees:", error);
        res
            .status(500)
            .json({ success: false, message: "Internal Server Error" });
    }
};

const downloadExcelActiveInactiveEmployees = async (req, res) => {
    try {
        const { FilterType, CompanyCode, BranchCode, Status } = req.query;

        if (!CompanyCode) {
            return res.status(400).json({ success: false, message: "CompanyCode is required" });
        }

        const fileName = `${FilterType}_${Status ? Status : "ActiveInactive"}_Employees_Status_${Date.now()}.xlsx`;
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

        const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({ stream: res });
        const sheet = workbook.addWorksheet("Employees");

        sheet.columns = [
            { header: "AGENCY NAME", key: "AgencyName" },
            { header: "REGION", key: "reginaloffice" },
            { header: "BRANCH", key: "BranchName" },
            { header: "AGENCY ID", key: "AgencyId" },
            { header: "ISD SFA ID", key: "SFAId" },
            { header: "ISD NAME", key: "Name" },
            { header: "DOJ", key: "JoiningDt" },
            { header: "Designation", key: "Designation" },
            { header: "PROFILE (ISD/ISP)", key: "profileIsdISp" },
            { header: "L1 - Department/SBU", key: "L1Department" },
            { header: "L1 short text", key: "L1ShortText" },
            { header: "L2 - Sub Department/BU", key: "L2SubDepartmentBU" },
            { header: "L3 - Sub Department 1/Divisions/Profit Center equivalent", key: "L3SubDepartment1DivisionsProfitCenterequivalent" },
            { header: "Temp/Perm", key: "TempPerm" },
            { header: "Gender", key: "Gender" },
            { header: "Grade", key: "Grade" },
            { header: "SA MOBILE NO", key: "SAMOBILENO" },
            { header: "OUTLET CODE", key: "outletcode" },
            { header: "OUTLET NAME", key: "outletname" },
            { header: "Store Key (For Croma/Relaince)", key: "StoreKeyForCromaRelaince" },
            { header: "Channel", key: "channel" },
            { header: "PCG", key: "PCG" },
            { header: "LOCATION", key: "workLocation" },
            { header: "TL SFA", key: "TLSFA" },
            { header: "TL Name", key: "TL_Name" },
            { header: "TL Mobile no", key: "TL_Mobile" },
            { header: "TL Mail ID", key: "TL_Email" },
            { header: "ASM/RSO Name", key: "ASMRSOName" },
            { header: "Actual PCG", key: "ActualPCG" },
            { header: "Brand", key: "Brand" },
            { header: "Weekoff", key: "WeekOff" },
            { header: "Status", key: "Status" },
            { header: "DOR", key: "ResignationDate" },
            { header: "DOL", key: "LeftDate" },
            { header: "ReasonOfLeaving", key: "ReasonOfLeaving" },
            { header: "F&F Status", key: "FullAndFinalStatus" },
            { header: "F&F Closing Month", key: "FullAndFinalClosingMonth" },
            { header: "TotalCTC", key: "TotalCTC" }
        ];
        const generator = fetchAllRowsActiveEnactiveEmployees({ FilterType, CompanyCode, BranchCode, Status });

        let rowCount = 0;
        for await (const row of generator) {
            sheet.addRow(row).commit();
            rowCount++;
        }
        sheet.commit();
        await workbook.commit();
    } catch (err) {
        console.error("Download controller error:", err);
        if (!res.headersSent) {
            res.status(500).json({ success: false, message: "Export failed", error: err.message });
        } else {
            try { res.end(); } catch (e) { /* ignore */ }
        }
    }
};

const getCostSheetReport = async (req, res) => {
    try {
        const { branchCode, year, month } = req.query;

        // ✅ Validate required fields first
        if (!branchCode || !year || !month) {
            return res.status(400).json({
                success: false,
                message: "branchCode, year, and month are required",
            });
        }

        // ✅ Fetch report data
        const result = await getCostSheetReportRepo(branchCode, year, month);

        // ✅ Return success response
        return res.status(200).json({
            success: true,
            data: result,
            message: "Cost Sheet Report fetched successfully",
        });
    } catch (error) {
        console.error("Error in getCostSheetReport:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
};


// EMPLOYEE ARREAR REGISTER REPORT
const getEmpArrearRegisterReport = async (req, res) => {
    try {
        const { month, year, employeeType, branchCode } = req.query;

        // ✅ Validate inputs
        if (!month || !year || !employeeType || !branchCode) {
            return res.status(400).json({
                success: false,
                message: 'Missing required parameters: month, year, employeeType, branchName',
            });
        }

        // ✅ Call service
        const result = await getEmpArrearRegisterReportRepo({ month, year, employeeType, branchCode });

        // ✅ Handle response
        if (!result.success) {
            return res.status(404).json(result);
        }

        return res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching employee arrear data:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};


const getEnsuranceReport = async (req, res) => {
    try {
        const { company, branch, type, endorsementEffective, yearPremiumAmount } = req.body;
        const insuranceReport = await getInsuranceReportRepo(company, branch, type, endorsementEffective, yearPremiumAmount)

        res.status(200).json({ success: true, data: insuranceReport })
    } catch (error) {

        console.error("Error fetching insurance report:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }

}


module.exports = {
    getBankStatementReport,
    executeStoredProcedure,
    getDropdownDataForEmpDetail,
    searchEmployees,
    getEmployeeEntitlementDetailsReport,
    getEmployeePayRegisterReport,
    exportToExcelPayRegisterReport,
    getEmployeesActiveInactive,
    exportEmployeesActiveInactive,
    downloadExcelActiveInactiveEmployees,
    getEmpArrearRegisterReport,
    getCostSheetReport,
    getEnsuranceReport,
    getFilteredEmployees
}
