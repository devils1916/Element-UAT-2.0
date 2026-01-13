// const { Sequelize, Op } = require("sequelize");

// // Associations Import (Do NOT remove)
// require("../models/getActiveInactiveEmployeeJoinTables.model");

// const EmployeeMaster = require("../models/employeeMaster.model");
// const BranchMaster = require("../models/branchMaster.model");
// const AssesmentForm = require("../models/Assesment_Form.model");
// const LoiInformation = require("../models/Loi_information.model");
// const Resignation = require("../models/Resignation.model");
// const EmployeeEntitlement = require("../models/employeeEntitlement.model");
// const SalaryHeadMaster = require("../models/SalaryHeadMasterNew.model");

// const getActiveInactiveEmployeeFilteredData = async ({
//     FilterType = null,
//     CompanyCode = null,
//     BranchCode = null,
//     Status = null,
//     search = null,        
//     page = 1,             
//     limit = 20             
// }) => {
//     try {

//         const pageNum = parseInt(page) > 0 ? parseInt(page) : 1;
//         const limitNum = parseInt(limit) > 0 ? parseInt(limit) : 20;
//         const offset = (pageNum - 1) * limitNum;

//         let whereClause = {
//             Joined: 1,
//             [Op.and]: [
//                 { EmpID: { [Op.like]: "HL%" } }
//             ]
//         };

//         // CompanyCode
//         if (CompanyCode) {
//             whereClause[Op.and].push({ CompanyCode });
//         }

//         // BranchCode
//         if (BranchCode) {
//             whereClause[Op.and].push({ BranchCode });
//         }

//         // Status
//         if (Status === "Active") {
//             whereClause[Op.and].push({ hasLeft: 0 });
//         }
//         if (Status === "Inactive") {
//             whereClause[Op.and].push({ hasLeft: 1 });
//         }

//           // ---- FILTER TYPE ---- //
//         let branchFilter = {};
//         if (FilterType === "ISD") {
//             branchFilter.Name = { [Op.like]: "%Lloyd%" };
//         } else if (FilterType === "ISP") {
//             branchFilter.Name = { [Op.like]: "%ISD%" };
//         } else if (FilterType === "PSR") {
//             branchFilter.Name = {
//                 [Op.and]: [
//                     { [Op.notLike]: "%ISD%" },
//                     { [Op.notLike]: "%Lloyd%" }
//                 ]
//             };
//         }

//         // GLOBAL SEARCH (does NOT remove HL% filter)
//         if (search && search.trim() !== "") {
//             const s = `%${search}%`;

//             whereClause[Op.and].push({
//                 [Op.or]: [
//                     { EmpID: { [Op.like]: s } },
//                     { Name: { [Op.like]: s } },
//                     { Department: { [Op.like]: s } },
//                     { Designation: { [Op.like]: s } },
//                     { Grade: { [Op.like]: s } },
//                     { Division: { [Op.like]: s } },
//                     { Sex: { [Op.like]: s } },
//                     { Fax: { [Op.like]: s } },
//                     { Store_Code: { [Op.like]: s } },
//                     { StoreName: { [Op.like]: s } },
//                     { Channel: { [Op.like]: s } },
//                     { TL_Email: { [Op.like]: s } }
//                 ]
//             });
//         }

//         console.log("Where Clause:", whereClause);
//         const { rows: employees, count: totalCount } = await EmployeeMaster.findAndCountAll({
//             where: whereClause,
//             distinct: true,         
//             col: "EmpID",         
//             include: [
//                 { model: EmployeeMaster, as: "TL", attributes: ["Fax", "Email", "Name"] },
//                 {
//                     model: BranchMaster,
//                     as: "Branch",
//                     required: false,
//                     attributes: ["Name"],
//                     where: Object.keys(branchFilter).length ? branchFilter : undefined
//                 },
//                 {
//                     model: LoiInformation,
//                     as: "Loi",
//                     required: false,
//                     include: [{ model: AssesmentForm, as: "AF", required: false }]
//                 },
//                 { model: Resignation, as: "Resignation", required: false },
//                 {
//                     model: EmployeeEntitlement,
//                     as: "EmployeeEntitle",
//                     include: [{ model: SalaryHeadMaster, as: "SalaryHead", attributes: ["Code", "EarningDeduction"] }]
//                 }
//             ],
//             order: [["JoiningDt", "DESC"]],
//             limit: limitNum,
//             offset: offset
//         });


//         // ---- MAP OUTPUT ---- //
//         const result = employees.map(emp => {
//             const TL = emp.TL || {};
//             const branch = emp.Branch || {};
//             const loi = emp.Loi || {};
//             const AF = loi.AF || {};
//             const resg = emp.Resignation || {};
//             const entitlements = emp.EmployeeEntitle || [];

//             let temp = entitlements
//                 .filter(e => e.SalHead && !["SHC00008", "SHC00009", "SHC00020", "SHC00023", "SHC00028"].includes(e.SalHead))
//                 .map(e => ({
//                     HeadCode: e.SalHead,
//                     Entitle: parseFloat(e.Entitle) || 0,
//                     HeadType: e.SalaryHead?.EarningDeduction
//                 }));

//             const basic = temp.find(e => e.HeadCode === "SHC00001")?.Entitle || 0;
//             const hra = temp.find(e => e.HeadCode === "SHC00002")?.Entitle || 0;

//             const totalEarning = temp
//                 .filter(e => e.HeadType === "Earning" && ["SHC00001", "SHC00002", "SHC00005", "SHC00006", "SHC00017", "SHC00025"].includes(e.HeadCode))
//                 .reduce((sum, e) => sum + e.Entitle, 0);

//             const grossAmount = temp
//                 .filter(e => ["SHC00001", "SHC00002", "SHC00005"].includes(e.HeadCode))
//                 .reduce((sum, e) => sum + e.Entitle, 0);

//             let PF = 0;
//             const inSpecialBranch = ["ISD", "LLO"].includes(FilterType);
//             // 1. Basic >= 15000
//             if (basic >= 15000 && !inSpecialBranch) {
//                 PF = Math.round(basic * 0.12);
//             }
//             else if (basic >= 15000 && inSpecialBranch) {
//                 PF = Math.round(15000 * 0.12);
//             }
//             // 2. Basic < 15000 and gross >= 15000
//             else if (basic < 15000 && grossAmount >= 15000 && !inSpecialBranch) {
//                 PF = Math.round(15000 * 0.12);
//             }
//             // 3. Basic < 15000 and (gross - HRA) >= 15000 in ISD / ISP / LLO
//             else if (basic < 15000 && grossAmount - hra >= 15000 && inSpecialBranch) {
//                 PF = Math.round(15000 * 0.12);
//             }
//             // 4. Basic < 15000 and gross < 15000 (normal branch)
//             else if (basic < 15000 && grossAmount < 15000 && !inSpecialBranch) {
//                 PF = Math.round(grossAmount * 0.12);
//             }
//             // 5. Basic < 15000 and (gross - HRA) < 15000 (ISD/ISP/LLO branch)
//             else if (basic < 15000 && grossAmount - hra < 15000 && inSpecialBranch) {
//                 PF = Math.round((grossAmount - hra) * 0.12);
//             }

//             const ESIC = Math.ceil(totalEarning * 0.0325);

//             temp = temp.map(e => {
//                 if (e.HeadCode === "SHC00003") e.Entitle = PF;
//                 if (e.HeadCode === "SHC00004") e.Entitle = emp.IsESICApplicable ? ESIC : 0;
//                 return e;
//             });

//             if (!emp.IsESICApplicable) temp = temp.filter(e => e.HeadCode !== "SHC00004");

//             const totalCTC = temp.reduce((sum, e) => sum + e.Entitle, 0);

//             return {
//                 AgencyName: "Parishram",
//                 reginaloffice: AF.reginaloffice || "",
//                 BranchName: branch.Name,
//                 AgencyId: emp.EmpID,
//                 SFAId: emp.EmpID.replace(/^\D+/g, ""),
//                 Name: emp.Name,
//                 JoiningDt: emp.JoiningDt,
//                 Designation: emp.Designation,
//                 profileIsdISp: emp.Profile_Code,
//                 L1Department: emp.Department,
//                 L1ShortText:
//                     emp.Department?.includes("Lloyd") ? "LYD" :
//                         emp.Department?.includes("ECD") ? "ECD" :
//                             emp.Department,
//                 L2SubDepartmentBU:
//                     emp.Department?.includes("Lloyd") ? "Lloyd" :
//                         emp.Department?.includes("ECD") ? "ECD Common" :
//                             emp.Department,
//                 L3SubDepartment1DivisionsProfitCenterequivalent: emp.Division,
//                 TempPerm: emp.Designation?.includes("temp") ? "TEMP" : "PERM",
//                 Gender: emp.Sex,
//                 Grade: emp.Grade,
//                 SAMOBILENO: emp.Fax,
//                 outletcode: emp.Store_Code,
//                 outletname: emp.StoreName,
//                 StoreKeyForCromaRelaince: "",
//                 channel: emp.Channel,
//                 PCG: emp.Div_Code,
//                 workLocation: AF.workLocation || "",
//                 TLSFA: FilterType === "ISP" ? "" : emp.ReportingTo || "",
//                 TL_Name: TL.Name || "",
//                 TL_Mobile: TL.Fax || "",
//                 TL_Email: emp.TL_Email,
//                 ASMRSOName: " ",
//                 ActualPCG: emp.Div_Code,
//                 Brand: FilterType === "ISD" ? "Lloyd" : "Havells",
//                 WeekOff: emp.WeekOff || "",
//                 Status: emp.hasLeft ? "Inactive" : "Active",
//                 ResignationDate: emp.hasLeft ? emp.ResignationDate : null,
//                 LeftDate: emp.LeftDate,
//                 ReasonOfLeaving: emp.hasLeft ? resg.Reason : null,
//                 FullAndFinalStatus: "",
//                 FullAndFinalClosingMonth: "",
//                 TotalCTC: totalCTC
//             };
//         });

//         return {
//             success: true,
//             page: pageNum,
//             limit: limitNum,
//             totalRecords: totalCount,
//             totalPages: Math.ceil(totalCount / limitNum),
//             count: result.length,
//             data: result,
//         };

//     } catch (error) {
//         console.error("Service error:", error);
//         return {
//             success: false,
//             message: "Service processing failed",
//             error: error.message
//         };
//     }
// };

// module.exports = getActiveInactiveEmployeeFilteredData;

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const { Op } = require("sequelize");

// Associations import 
require("../models/getActiveInactiveEmployeeJoinTables.model");

const EmployeeMaster = require("../models/employeeMaster.model");
const BranchMaster = require("../models/branchMaster.model");
const AssesmentForm = require("../models/Assesment_Form.model");
const LoiInformation = require("../models/Loi_information.model");
const Resignation = require("../models/Resignation.model");
const EmployeeEntitlement = require("../models/employeeEntitlement.model");
const SalaryHeadMaster = require("../models/SalaryHeadMasterNew.model");

const getActiveInactiveEmployeeFilteredData = async ({
    FilterType = null,
    CompanyCode = null,
    BranchCode = null,
    Status = null,
    search = null,
    page = 1,
    limit = 20
}) => {
    try {

        if (!CompanyCode) {
            return {
                success: false,
                message: "CompanyCode is required"
            };
        }

        // ---- pagination sanitization ----
        const pageNum = Number.isInteger(+page) && +page > 0 ? +page : 1;
        const limitNum = Number.isInteger(+limit) && +limit > 0 ? +limit : 20;
        const offset = (pageNum - 1) * limitNum;

        // ---- branch filter 
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

        // Global search 
        if (search && String(search).trim() !== "") {
            const s = `%${String(search).trim()}%`;
            whereClause[Op.and].push({
                [Op.or]: [
                    { EmpID: { [Op.like]: s } },
                    { Name: { [Op.like]: s } },
                    { Department: { [Op.like]: s } },
                    { Designation: { [Op.like]: s } },
                    { Grade: { [Op.like]: s } },
                    { Division: { [Op.like]: s } },
                    { Sex: { [Op.like]: s } },
                    { Fax: { [Op.like]: s } },
                    { Store_Code: { [Op.like]: s } },
                    { StoreName: { [Op.like]: s } },
                    { Channel: { [Op.like]: s } },
                    { TL_Email: { [Op.like]: s } }
                ]
            });
        }

        const branchInclude = {
            model: BranchMaster,
            as: "Branch",
            attributes: ["Name"],
            required: true,
            where: branchFilter
        };

        const include = [
            { model: EmployeeMaster, as: "TL", attributes: ["Fax", "Email", "Name"] },
            branchInclude,
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

        const totalCount = await EmployeeMaster.count({
            where: whereClause,
            include,
            distinct: true,
            col: "EmpID"
        });

        const { rows: employees } = await EmployeeMaster.findAndCountAll({
            where: whereClause,
            include,
            distinct: true,
            col: "EmpID",
            order: [["JoiningDt", "DESC"]],
            limit: limitNum,
            offset
        });

        const result = employees.map(emp => {
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

            return {
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
        });

        const totalPages = Math.max(1, Math.ceil(totalCount / limitNum));
        const safePage = Math.min(pageNum, totalPages);

        return {
            success: true,
            page: safePage,
            limit: limitNum,
            totalRecords: totalCount,
            totalPages,
            count: result.length,
            data: result
        };

    } catch (error) {
        console.error("Service error:", error);
        return {
            success: false,
            message: "Service processing failed",
            error: error.message
        };
    }
};

module.exports = getActiveInactiveEmployeeFilteredData;
