const { Sequelize, Op } = require("sequelize");
const EmployeeMaster = require("../models/employeeMaster.model");
const EmployeeEntitlement = require("../models/employeeEntitlement.model");
const SalaryHeadMaster = require("../models/salaryHeadMaster.model");
const BranchMaster = require("../models/branchMaster.model");

const getCTCCurrent = async (EmpCode, CompanyCode, BranchCode) => {
    try {
        // Fetch employee
        const employee = await EmployeeMaster.findOne({
            where: { EmpId: EmpCode, CompanyCode, BranchCode }
        });

        if (!employee) return 0;

        const isESICApplicable = employee.IsESICApplicable;

        // Fetch entitlements and salary heads
        const entitlements = await EmployeeEntitlement.findAll({
            where: { EmpCode: EmpCode },
            include: [
                {
                    model: SalaryHeadMaster,
                    as: "SalaryHead",
                    attributes: ["Code", "Head", "EarningDeduction"]
                }
            ]
        });

        // Create a temp-like object
        let temp = entitlements
            .filter(e => !["SHC00008", "SHC00009", "SHC00020", "SHC00023", "SHC00028"].includes(e.SalHead))
            .map(e => ({
                EmpCode: e.EmpCode,
                HeadCode: e.SalHead,
                HeadName: e.SalaryHead.Head,
                Entitle: parseFloat(e.Entitle),
                HeadType: e.SalaryHead.EarningDeduction
            }));

        // Calculate Basic, HRA, Total Earnings
        const basic = temp.find(e => e.HeadCode === "SHC00001")?.Entitle || 0;
        const hra = temp.find(e => e.HeadCode === "SHC00002")?.Entitle || 0;

        const totalEarning = temp
            .filter(e => e.HeadType === "Earning" && ["SHC00001","SHC00002","SHC00005","SHC00006","SHC00017","SHC00025"].includes(e.HeadCode))
            .reduce((sum, e) => sum + e.Entitle, 0);

        const grossAmount = temp
            .filter(e => ["SHC00001","SHC00002","SHC00005"].includes(e.HeadCode))
            .reduce((sum, e) => sum + e.Entitle, 0);

        // Calculate PF
        const branchPrefix = (await BranchMaster.findOne({ where: { Code: employee.BranchCode } }))?.Name?.substring(0,3) || "";
        let PF = 0;

        if (basic >= 15000 && !["ISD","ISP","LLO"].includes(branchPrefix)) PF = Math.round(basic * 0.12);
        else if (basic >= 15000 && ["ISD","ISP","LLO"].includes(branchPrefix)) PF = Math.round(15000 * 0.12);
        else if (basic < 15000 && grossAmount >= 15000 && !["ISD","ISP","LLO"].includes(branchPrefix)) PF = Math.round(15000 * 0.12);
        else if (basic < 15000 && grossAmount < 15000 && !["ISD","ISP","LLO"].includes(branchPrefix)) PF = Math.round(grossAmount * 0.12);
        else if (basic < 15000 && grossAmount - hra < 15000 && ["ISD","ISP","LLO"].includes(branchPrefix)) PF = Math.round((grossAmount - hra) * 0.12);

        // Calculate ESIC
        const ESIC = Math.ceil(totalEarning * 0.0325);

        // Update temp "table" like in SQL
        temp = temp.map(e => {
            if (e.HeadCode === "SHC00003") e.Entitle = PF;
            if (e.HeadCode === "SHC00004") e.Entitle = isESICApplicable ? ESIC : 0;
            return e;
        });

        if (!isESICApplicable) {
            temp = temp.filter(e => e.HeadCode !== "SHC00004");
        }

        // Calculate total CTC (sum of all Entitle)
        const totalCTC = temp.reduce((sum, e) => sum + e.Entitle, 0);

        return totalCTC;

    } catch (error) {
        console.error("Error in getCTCCurrent:", error);
        return 0;
    }
};

module.exports = getCTCCurrent;
