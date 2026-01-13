// services/downloadEmployeeAll.service.js
const { Op } = require("sequelize");

// Associations import (same as your main service)
require("../models/getActiveInactiveEmployeeJoinTables.model");

const EmployeeMaster = require("../models/employeeMaster.model");
const BranchMaster = require("../models/branchMaster.model");
const AssesmentForm = require("../models/Assesment_Form.model");
const LoiInformation = require("../models/Loi_information.model");
const Resignation = require("../models/Resignation.model");
const EmployeeEntitlement = require("../models/employeeEntitlement.model");
const SalaryHeadMaster = require("../models/SalaryHeadMasterNew.model");

async function* fetchAllRowsActiveEnactiveEmployees({
    FilterType = null,
    CompanyCode = null,
    BranchCode = null,
    Status = null,
    batchSize = 3000 
}) {
    if (!CompanyCode) {
        throw new Error("CompanyCode is required");
    }

    let branchFilter = {};
    if (FilterType === "ISD") {
        branchFilter.Name = { [Op.like]: "%Lloyd%" };
    } else if (FilterType === "ISP") {
        branchFilter.Name = { [Op.like]: "%ISD%" };
    } else if (FilterType === "PSR") {
        branchFilter = {
            [Op.and]: [
                { Name: { [Op.notLike]: "%ISD%" } },
                { Name: { [Op.notLike]: "%Lloyd%" } }
            ]
        };
    } else {
        branchFilter = {};
    }

    const whereClause = {
        Joined: 1,
        CompanyCode,
        [Op.and]: [
            { EmpID: { [Op.like]: "HL%" } }
        ]
    };

    if (BranchCode) whereClause[Op.and].push({ BranchCode });

    if (Status === "Active") whereClause[Op.and].push({ hasLeft: 0 });
    if (Status === "Inactive") whereClause[Op.and].push({ hasLeft: 1 });

    const include = [
        { model: EmployeeMaster, as: "TL", attributes: ["Fax", "Email", "Name"] },
        {
            model: BranchMaster,
            as: "Branch",
            attributes: ["Name"],
            required: true,
            where: branchFilter
        },
        {
            model: LoiInformation,
            as: "Loi",
            required: false,
            include: [{ model: AssesmentForm, as: "AF", required: false }]
        },
        { model: Resignation, as: "Resignation", required: false },
        {
            model: EmployeeEntitlement,
            as: "EmployeeEntitle",
            required: false,
            include: [{ model: SalaryHeadMaster, as: "SalaryHead", attributes: ["Code", "EarningDeduction"] }]
        }
    ];

    let offset = 0;
    let rowsFetched = 0;
    while (true) {
        const rows = await EmployeeMaster.findAll({
            where: whereClause,
            include,
            distinct: true,
            col: "EmpID",
            order: [["JoiningDt", "DESC"]],
            limit: batchSize,
            offset
        });

        if (!rows || rows.length === 0) break;

        for (const emp of rows) {

            const TL = emp.TL || {};
            const branch = emp.Branch || {};
            const loi = emp.Loi || {};
            const AF = loi.AF || {};
            const resg = emp.Resignation || {};
            const entitlements = emp.EmployeeEntitle || [];

            let temp = entitlements
                .filter(e => e.SalHead && !["SHC00008", "SHC00009", "SHC00020", "SHC00023", "SHC00028"].includes(e.SalHead))
                .map(e => ({
                    HeadCode: e.SalHead,
                    Entitle: parseFloat(e.Entitle) || 0,
                    HeadType: e.SalaryHead?.EarningDeduction
                }));

            const basic = temp.find(e => e.HeadCode === "SHC00001")?.Entitle || 0;
            const hra = temp.find(e => e.HeadCode === "SHC00002")?.Entitle || 0;

            const totalEarning = temp
                .filter(e => e.HeadType === "Earning" && ["SHC00001", "SHC00002", "SHC00005", "SHC00006", "SHC00017", "SHC00025"].includes(e.HeadCode))
                .reduce((sum, e) => sum + e.Entitle, 0);

            const grossAmount = temp
                .filter(e => ["SHC00001", "SHC00002", "SHC00005"].includes(e.HeadCode))
                .reduce((sum, e) => sum + e.Entitle, 0);

            const inSpecialBranch = ["ISD", "LLO"].includes(FilterType);
            let PF = 0;
            if (basic >= 15000 && !inSpecialBranch) PF = Math.round(basic * 0.12);
            else if (basic >= 15000 && inSpecialBranch) PF = Math.round(15000 * 0.12);
            else if (basic < 15000 && grossAmount >= 15000 && !inSpecialBranch) PF = Math.round(15000 * 0.12);
            else if (basic < 15000 && (grossAmount - hra) >= 15000 && inSpecialBranch) PF = Math.round(15000 * 0.12);
            else if (basic < 15000 && grossAmount < 15000 && !inSpecialBranch) PF = Math.round(grossAmount * 0.12);
            else if (basic < 15000 && (grossAmount - hra) < 15000 && inSpecialBranch) PF = Math.round((grossAmount - hra) * 0.12);

            const ESIC = Math.ceil(totalEarning * 0.0325);

            temp = temp.map(e => {
                if (e.HeadCode === "SHC00003") e.Entitle = PF;
                if (e.HeadCode === "SHC00004") e.Entitle = emp.IsESICApplicable ? ESIC : 0;
                return e;
            });

            if (!emp.IsESICApplicable) temp = temp.filter(e => e.HeadCode !== "SHC00004");

            const totalCTC = temp.reduce((sum, e) => sum + e.Entitle, 0);

            const dept = (emp.Department || "").toLowerCase();

            const mapped = {
                AgencyName: "Parishram",
                reginaloffice: AF.reginaloffice || "",
                BranchName: branch.Name,
                AgencyId: emp.EmpID,
                SFAId: emp.EmpID.replace(/^\D+/g, ""),
                Name: emp.Name,
                JoiningDt: emp.JoiningDt,
                Designation: emp.Designation,
                profileIsdISp: emp.Profile_Code,
                L1Department: emp.Department,
                L1ShortText:
                    dept.includes("lloyd") ? "LYD" :
                        dept.includes("ecd") ? "ECD" :
                            emp.Department,
                L2SubDepartmentBU:
                    emp.Department?.includes("Lloyd") ? "Lloyd" :
                        emp.Department?.includes("ECD") ? "ECD Common" :
                            emp.Department,
                L3SubDepartment1DivisionsProfitCenterequivalent: emp.Division,
                TempPerm: emp.Designation?.toLowerCase().includes("temp") ? "TEMP" : "PERM",
                Gender: emp.Sex,
                Grade: emp.Grade,
                SAMOBILENO: emp.Fax,
                outletcode: emp.Store_Code,
                outletname: emp.StoreName,
                StoreKeyForCromaRelaince: "",
                channel: emp.Channel,
                PCG: emp.Div_Code,
                workLocation: AF.workLocation || "",
                TLSFA: FilterType === "ISP" ? "" : emp.ReportingTo || "",
                TL_Name: TL.Name || "",
                TL_Mobile: TL.Fax || "",
                TL_Email: emp.TL_Email,
                ASMRSOName: " ",
                ActualPCG: emp.Div_Code,
                Brand: FilterType === "ISD" ? "Lloyd" : "Havells",
                WeekOff: emp.WeekOff || "",
                Status: emp.hasLeft ? "Inactive" : "Active",
                ResignationDate: emp.hasLeft ? emp.ResignationDate : null,
                LeftDate: emp.LeftDate,
                ReasonOfLeaving: emp.hasLeft ? resg.Reason : null,
                FullAndFinalStatus: "",
                FullAndFinalClosingMonth: "",
                TotalCTC: totalCTC
            };

            yield mapped;
        }

        rowsFetched += rows.length;
        offset += rows.length;

        if (rows.length < batchSize) break;
    }
}

module.exports = {
    fetchAllRowsActiveEnactiveEmployees
};