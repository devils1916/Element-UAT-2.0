const { calculatePF, calculateESIC, calculateCTC, calculateServiceTax } = require('../utils/payRegisterCalulations');
const { getFullAndFinalEmployees,
    getEmployeeEntitlements,
    getEmployeeBankDetails,
    getSalaryDetails } = require('../repository/FNF.repository')


class PayrollService {
    constructor(employeeModel, fullAndFinalModel) {
        this.employeeModel = employeeModel;
        this.fullAndFinalModel = fullAndFinalModel;
    }

    async processSalaryData(salaryDetails) {
        const salaryMap = new Map();

        salaryDetails.forEach(item => {
            const { FullandFinalCode, EmpCode, HeadName, Amount } = item;

            if (!salaryMap.has(EmpCode)) {
                salaryMap.set(EmpCode, {
                    FullandFinalCode,
                    EmpCode,
                    Basic: 0, HRA: 0, Conveyance: 0,
                    WashingAllowance: 0, SplAllowance: 0, Allowance1: 0, PDA: 0,
                    MedicalReimbursement: 0, DeputationAllowance: 0, LTA: 0,
                    Insurance: 0, Bonus: 0, Gratuity: 0,
                    PF: 0, ESIC: 0, Advance: 0, TDS: 0,
                    MiscDeduction: 0, MediPolicy: 0, ProfessionalTax: 0,
                    LWF: 0, VoluntaryPF: 0, TelephoneDeduction: 0,
                    BankDeduction: 0, FoodDeduction: 0
                });
            }

            const salary = salaryMap.get(EmpCode);

            // Map SQL column names to JS property names
            const propertyMap = {
                'Basic': 'Basic',
                'HRA': 'HRA',
                'Conveyance': 'Conveyance',
                'Advance Payment': 'WashingAllowance',
                'Special Allowance': 'SplAllowance',
                'Allowance1': 'Allowance1',
                'PDA': 'PDA',
                'Medical Allowance': 'MedicalReimbursement',
                'Deputation Allowance': 'DeputationAllowance',
                'LTA': 'LTA',
                'Insurance': 'Insurance',
                'Bonus': 'Bonus',
                'Gratuity': 'Gratuity',
                'PF': 'PF',
                'ESIC': 'ESIC',
                'Advance': 'Advance',
                'TDS': 'TDS',
                'Misc. Deduction': 'MiscDeduction',
                'Medi. Policy': 'MediPolicy',
                'Professional Tax': 'ProfessionalTax',
                'LWF': 'LWF',
                'Voluntary PF': 'VoluntaryPF',
                'Telephone Deduction': 'TelephoneDeduction',
                'Bank Deduction': 'BankDeduction',
                'Food Deduction': 'FoodDeduction'
            };

            if (propertyMap[HeadName]) {
                salary[propertyMap[HeadName]] += Amount || 0;
            }
        });

        // Calculate derived fields
        for (let [empCode, salary] of salaryMap) {
            salary.GrossEarning = this.calculateGrossEarning(salary);
            salary.TotalEarning = this.calculateTotalEarning(salary);
            salary.ESICEarning = this.calculateESICEarning(salary);
            salary.TotalDeduction = this.calculateTotalDeduction(salary);
            salary.NetPay = salary.GrossEarning - salary.TotalDeduction;
        }

        return Array.from(salaryMap.values());
    }

    calculateGrossEarning(salary) {
        return salary.Basic + salary.HRA + salary.Conveyance + salary.WashingAllowance +
            salary.SplAllowance + salary.Allowance1 + salary.PDA +
            salary.MedicalReimbursement + salary.DeputationAllowance + salary.LTA;
    }

    calculateTotalEarning(salary) {
        return this.calculateGrossEarning(salary) + salary.Insurance +
            salary.Bonus + salary.Gratuity;
    }

    calculateESICEarning(salary) {
        return salary.Basic + salary.HRA + salary.Conveyance + salary.WashingAllowance +
            salary.SplAllowance + salary.Allowance1 + salary.PDA +
            salary.MedicalReimbursement + salary.LTA;
    }

    calculateTotalDeduction(salary) {
        return salary.PF + salary.ESIC + salary.Advance + salary.TDS +
            salary.MiscDeduction + salary.MediPolicy + salary.ProfessionalTax +
            salary.LWF + salary.VoluntaryPF + salary.TelephoneDeduction +
            salary.BankDeduction + salary.FoodDeduction;
    }

    async calculateStatutoryContributions(employees, entitlements) {
        const pfMap = new Map();
        const esicMap = new Map();
        const ctcMap = new Map();

        // Calculate PF
        entitlements
            .filter(e => e.Head === 'Basic')
            .forEach(e => {
                pfMap.set(e.EmpId, calculatePF(e.Entitle));
            });

        // Calculate ESIC eligible earnings and ESIC
        entitlements
            .filter(e => ['Basic', 'HRA', 'Conveyance', 'Special Allowance',
                'Allowance1', 'PDA', 'Medical Allowance', 'LTA'].includes(e.Head))
            .forEach(e => {
                if (!esicMap.has(e.EmpId)) {
                    esicMap.set(e.EmpId, { totalEarning: 0, isESICApplicable: e.IsESICApplicable });
                }
                const esicData = esicMap.get(e.EmpId);
                esicData.totalEarning += e.Entitle;
            });

        // Calculate CTC
        entitlements.forEach(e => {
            if (!ctcMap.has(e.EmpId)) {
                ctcMap.set(e.EmpId, 0);
            }
            ctcMap.set(e.EmpId, ctcMap.get(e.EmpId) + e.Entitle);
        });

        return { pfMap, esicMap, ctcMap };
    }

    async generatePayRegister(months, years, empType, branch) {
        try {
            // Get employee attendance data
            const employees = await this.employeeModel.getFullAndFinalEmployees(months, years, empType, branch);

            // Get salary details
            const salaryDetails = await getSalaryDetails(months, years);
            const salaryData = await processSalaryData(salaryDetails);

            // Get employee entitlements for statutory calculations
            const entitlements = await getEmployeeEntitlements();
            const statutoryData = await this.calculateStatutoryContributions(employees, entitlements);

            // Get bank details
            const empCodes = employees.map(e => e.EmpCode);
            const bankDetails = await getEmployeeBankDetails(empCodes);
            const bankMap = new Map(bankDetails.map(b => [b.EmpId, b]));

            // Combine all data
            const payRegister = employees.map(emp => {
                const salary = salaryData.find(s => s.EmpCode === emp.EmpCode) || {};
                const bank = bankMap.get(emp.EmpCode) || {};
                const pf = statutoryData.pfMap.get(emp.EmpCode) || 0;
                const esicData = statutoryData.esicMap.get(emp.EmpCode) || { totalEarning: 0, isESICApplicable: false };
                const actualCTC = statutoryData.ctcMap.get(emp.EmpCode) || 0;

                const esicEmployer = calculateESIC(esicData.totalEarning, esicData.isESICApplicable);
                const billAmount = this.calculateBillAmount(salary, pf, esicEmployer);
                const serviceTax = calculateServiceTax(billAmount);
                const invoiceAmount = billAmount + serviceTax + 200; // + management fee

                return {
                    BranchCode: emp.BranchCode,
                    BranchName: emp.BranchName,
                    EmpCode: emp.EmpCode,
                    EmpName: emp.EmpName,
                    PresentDays: emp.PresentDays,
                    PaymentDays: emp.PaymentDays,
                    ...salary,
                    PFEmployerContr: pf,
                    ESICEmployerContr: esicEmployer,
                    CTC: this.calculateCTC(salary, pf, esicEmployer),
                    ActualCTC: actualCTC,
                    BankName: bank.BankName,
                    AccountNo: bank.AccountNo,
                    IFSCCode: bank.IFSCCode,
                    BillAmount: billAmount,
                    ManagementFee: 200,
                    ServiceTax: serviceTax,
                    InvoiceAmount: invoiceAmount,
                    UnitESIC: emp.UnitESIC,
                    Department: emp.Department,
                    Designation: emp.Designation,
                    DoB: emp.DoB,
                    JoiningDt: emp.JoiningDt,
                    PFNo: emp.PFNo,
                    ESICNo: emp.ESICNo,
                    PanNo: emp.PanNo
                };
            });

            return payRegister;
        } catch (error) {
            throw new Error(`Payroll processing failed: ${error.message}`);
        }
    }

    calculateBillAmount(salary, pfEmployer, esicEmployer) {
        return salary.GrossEarning - (salary.MiscDeduction || 0) + pfEmployer + esicEmployer;
    }

    calculateCTC(salary, pfEmployer, esicEmployer) {
        return salary.TotalEarning - (salary.Insurance || 0) - (salary.MiscDeduction || 0) + pfEmployer + esicEmployer;
    }
}

module.exports = PayrollService;