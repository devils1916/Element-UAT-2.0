// ctcService.js
require('dotenv').config();

function calculatePFForPsr(basic, gross) {
    let pf;
    if (basic < 15000 && gross > 15000) {
        pf = 15000 * 0.12;
    } else if (basic > 15000) {
        pf = basic * 0.12;
    } else if (gross > 15000) {
        pf = 15000 * 0.12;
    } else {
        pf = gross * 0.12;
    }
    return Math.round(pf);
}

// Static defaults for PT and LWF by branch (2025 values; customize as needed)
const statutoryDefaults = {
    'Ahmedabad': { pt: 0, lwfEmployer: 0, lwfDed: 0 },  // Gujarat: PT=200/month (slab 10k-50k gross), LWF=0
    'Mumbai': { pt: 0, lwfEmployer: 0, lwfDed: 0 },    // Maharashtra example: PT=300, LWF=20/month
    'Delhi': { pt: 0, lwfEmployer: 0, lwfDed: 0 },       // Delhi: Similar to Gujarat
    'default': { pt: 0, lwfEmployer: 0, lwfDed: 0 }      // Fallback for unknown branches
};


function getGradeCode(grade) {
    if (!grade) return "";

    // Split by "-" and take the first part, trim spaces, and convert to lowercase
    return grade.split("-")[0].trim().toLowerCase();
}

// Grade categories for insurance rules
const sGrades = ['s1', 's2', 's3', 's4'];  // S-category grades from UI
const otherGrades = ['e1', 'e2', 'e3', 'e4', 'm7', 'm6', 'm5', 'm4', 'm3', 'm2b', 'm2a', 'm1', 'm0'];  // Other grades from UI
const validGrades = [...sGrades, ...otherGrades];

// Fetch PT and LWF statically (no API)
function getPTAndLWF(branch = 'Ahmedabad') {
    const branchKey = branch.toLowerCase().includes('ahmedabad') ? 'Ahmedabad' : branch;
    const defaults = statutoryDefaults[branchKey] || statutoryDefaults['default'];

    const { pt, lwfEmployer, lwfDed } = defaults;
    console.log(`Using static PT/LWF for ${branch}: PT=${pt}, LWF Employer=${lwfEmployer}, LWF Ded=${lwfDed}`);
    return { pt: Math.round(pt), lwfEmployer: Math.round(lwfEmployer), lwfDed: Math.round(lwfDed) };
}

// Main CTC calculation (minWage passed as argument)
function calculateExactCTC(targetCTC, grade, branch, minWage, date = new Date().toISOString().split('T')[0], lwf, isMetro = false, father = false, mother = false, isPSR = false) {

    // Calculate parent addition (₹500 per parent)
    const parentAddition = (father ? 500 : 0) + (mother ? 500 : 0);
    // console.log(`Parent Addition: Father=${father}, Mother=${mother}, Total=${parentAddition}`);

    const inputGrade = getGradeCode(grade);  // Normalize to lowercase for matching
    if (targetCTC <= 0 || !validGrades.includes(inputGrade)) {
        throw new Error(`Invalid input: targetCTC must be > 0, grade must be one of: ${validGrades.join(', ')}`);
    }

    if ( minWage < 0) {
        throw new Error('Invalid minWage: must be a positive number');
    }

    // Get PT/LWF statically (sync)
    const { lwfEmployer, lwfDed } = lwf;
    const { pt } = getPTAndLWF(branch);

    // Basic Salary: MAX(minWage, ROUND(targetCTC * 40%, 0))
    const basic = Math.max(minWage, Math.round(targetCTC * 0.4));

    // ADVANCE STATUTORY BONUS: ROUND(IF(BASIC <=7000,7000*8.33%,IF(BASIC>=21000,21000*8.33%, BASIC*8.33%)),0)
    let bonus = Math.round(
        basic <= 7000 ? 7000 * 0.0833 :
            (basic >= 21000 ? 21000 * 0.0833 : basic * 0.0833)
    );

    // Gratuity calculation (only for PSR)
    const gratuity = isPSR ? Math.round(basic * 0.0481) : 0;

    // Iterative solver to converge on exact CTC
    let special = 0;
    let hra = basic * (isMetro ? 0.5 : 0.4);
    let converged = false;
    for (let iter = 0; iter < 50; iter++) {
        let gross = basic + hra + special;

        // PF Emplyr: =ROUND(IF(C11>15000,1800,IF((C11+C13)>15000,1800,(C11+C13)*12%)),0)
        // ROUND(IF(AND(basic<15000,gross>15000),15000*12%,ROUND(IF(basic>15000,ROUND(basic*12%,0),IF(gross>15000,15000*12%,gross*12%)),0)),0)
        const pfBase = basic + special;
        let employerPF;
        if (isPSR) {
            employerPF = calculatePFForPsr(basic, gross);
        } else {
            employerPF = Math.round(
                basic > 15000 ? 1800 : (pfBase > 15000 ? 1800 : pfBase * 0.12)
            );
        }

        // ESI 3.25% of gross: =ROUNDUP(IF(C14>=21000,0,C14*3.25%),0)
        const esiEmployer = Math.ceil(gross < 21000 ? gross * 0.0325 : 0);

        // INSURANCE: Based on grade category and gross threshold
        let insurance = {};
        let insuranceTotal;
        if (gross < 21000) {
            if (sGrades.includes(inputGrade)) {
                insurance = { 'GPA': 18, 'GTLI': 80, 'GHI': 0 + parentAddition };
                insuranceTotal = 98 + parentAddition;
            } else if (otherGrades.includes(inputGrade)) {
                insurance = { 'GPA': 18, 'GTLI': 160, 'GHI': 0 + parentAddition };
                insuranceTotal = 178 + parentAddition;
            } else {
                insurance = { 'GPA': 18, 'GTLI': 160, 'GHI': 0 + parentAddition };
                insuranceTotal = 178 + parentAddition;
            }
        } else {  // gross >= 21000
            if (sGrades.includes(inputGrade)) {
                insurance = { 'GPA': 18, 'GTLI': 80, 'GHI': 568 + parentAddition };
                insuranceTotal = 666 + parentAddition;
            } else if (otherGrades.includes(inputGrade)) {
                insurance = { 'GPA': 18, 'GTLI': 160, 'GHI': 568 + parentAddition };
                insuranceTotal = 746 + parentAddition;
            } else {
                insurance = { 'GPA': 18, 'GTLI': 160, 'GHI': 568 + parentAddition };
                insuranceTotal = 746 + parentAddition;
            }
        }

        // TOTAL Employer preliminary (SUM including lwfEmployer and gratuity)
        let totalEmployer = employerPF + esiEmployer + lwfEmployer + bonus + insuranceTotal + gratuity;

        // HRA adjustment logic (from Excel)
        const defaultHra = basic * (isMetro ? 0.5 : 0.4);
        let remainingAfterFixed = targetCTC - (basic + defaultHra + totalEmployer);
        if (remainingAfterFixed < 0) {
            hra = defaultHra + remainingAfterFixed;  // Reduce HRA
        } else {
            hra = defaultHra;
        }
        hra = Math.max(0, Math.round(hra));

        // SPACIAL ALLOWANCE: Remaining, min 0, rounded
        let specialTemp = targetCTC - (basic + hra + totalEmployer);
        special = Math.max(0, Math.round(specialTemp));

        // Recalculate
        gross = basic + hra + special;
        const pfBaseRecalc = basic + special;
        if (isPSR) {
            employerPF = calculatePFForPsr(basic, gross);
        } else {
            employerPF = Math.round(
                basic > 15000 ? 1800 : (pfBaseRecalc > 15000 ? 1800 : pfBaseRecalc * 0.12)
            );
        }
        const esiEmployerRecalc = Math.ceil(gross < 21000 ? gross * 0.0325 : 0);

        // Recalc insurance
        if (gross < 21000) {
            if (sGrades.includes(inputGrade)) {
                insuranceTotal = 98 + parentAddition;
                insurance = { 'GPA': 18, 'GTLI': 80, 'GHI': 0 + parentAddition };
            } else if (otherGrades.includes(inputGrade)) {
                insuranceTotal = 178 + parentAddition;
                insurance = { 'GPA': 18, 'GTLI': 160, 'GHI': 0 + parentAddition };
            } else {
                insuranceTotal = 178 + parentAddition;
                insurance = { 'GPA': 18, 'GTLI': 160, 'GHI': 0 + parentAddition };
            }
        } else {
            if (sGrades.includes(inputGrade)) {
                insuranceTotal = 666 + parentAddition;
                insurance = { 'GPA': 18, 'GTLI': 80, 'GHI': 568 + parentAddition };
            } else if (otherGrades.includes(inputGrade)) {
                insuranceTotal = 746 + parentAddition;
                insurance = { 'GPA': 18, 'GTLI': 160, 'GHI': 568 + parentAddition };
            } else {
                insuranceTotal = 746 + parentAddition;
                insurance = { 'GPA': 18, 'GTLI': 160, 'GHI': 568 + parentAddition };
            }
        }

        totalEmployer = employerPF + esiEmployerRecalc + lwfEmployer + bonus + insuranceTotal + gratuity;
        const fixedCTC = gross + totalEmployer;

        if (Math.abs(fixedCTC - targetCTC) < 1) {
            converged = true;
            break;
        }
    }

    // Final values
    const grossFinal = basic + hra + special;
    let employerPFFinal;
    if (isPSR) {
        employerPFFinal = calculatePFForPsr(basic, grossFinal);
    } else {
        employerPFFinal = Math.round(
            basic > 15000 ? 1800 : ((basic + special) > 15000 ? 1800 : (basic + special) * 0.12)
        );
    }
    const esiEmployerFinal = Math.ceil(grossFinal < 21000 ? grossFinal * 0.0325 : 0);

    // Final insurance
    let insuranceFinal = {};
    let insuranceTotalFinal;
    if (grossFinal < 21000) {
        if (sGrades.includes(inputGrade)) {
            insuranceFinal = { 'GPA': 18, 'GTLI': 80, 'GHI': 0 + parentAddition };
            insuranceTotalFinal = 98 + parentAddition;
        } else if (otherGrades.includes(inputGrade)) {
            insuranceFinal = { 'GPA': 18, 'GTLI': 160, 'GHI': 0 + parentAddition };
            insuranceTotalFinal = 178 + parentAddition;
        } else {
            insuranceFinal = { 'GPA': 18, 'GTLI': 160, 'GHI': 0 + parentAddition };
            insuranceTotalFinal = 178 + parentAddition;
        }
    } else {
        if (sGrades.includes(inputGrade)) {
            insuranceFinal = { 'GPA': 18, 'GTLI': 80, 'GHI': 568 + parentAddition };
            insuranceTotalFinal = 666 + parentAddition;
        } else if (otherGrades.includes(inputGrade)) {
            insuranceFinal = { 'GPA': 18, 'GTLI': 160, 'GHI': 568 + parentAddition };
            insuranceTotalFinal = 746 + parentAddition;
        } else {
            insuranceFinal = { 'GPA': 18, 'GTLI': 160, 'GHI': 568 + parentAddition };
            insuranceTotalFinal = 746 + parentAddition;
        }
    }

    const totalEmployerFinal = employerPFFinal + esiEmployerFinal + lwfEmployer + bonus + insuranceTotalFinal + gratuity;
    const fixedCTCFinal = grossFinal + totalEmployerFinal;

    // Employee Deductions (including pt and lwfDed)
    const employeePF = employerPFFinal;
    const esiEmployee = Math.ceil(grossFinal < 21000 ? grossFinal * 0.0075 : 0);
    const totalDeduction = employeePF + esiEmployee + pt + lwfDed;
    const netTakeHome = grossFinal - totalDeduction;
    const finalNTH = netTakeHome + bonus;

    // Build employer contributions object conditionally
    const employerContributions = {
        PF_Emplyr: employerPFFinal,
        ESI_325_percent_of_gross: esiEmployerFinal,
        LWF: lwfEmployer,
        ADVANCE_STATUTORY_BONUS: bonus,
        INSURANCE: insuranceFinal
    };

    // Add Gratuity only if isPSR is true
    if (isPSR) {
        employerContributions.Gratuity = gratuity;
    }

    employerContributions.TOTAL_Employer = totalEmployerFinal;

    // Output (added static PT/LWF for reference; grade as input)
    return {
        monthlyHeads: {
            BASIC: basic,
            HRA: hra,
            SPECIAL_ALLOWANCE: special,
            Gross: grossFinal
        },
        employerContributions,
        fixedCTC: fixedCTCFinal,
        employeeDeductions: {
            PF_12_percent_of_BASIC: employeePF,
            ESI_075_percent_GROSS: esiEmployee,
            PT: pt,
            LWF: lwfDed,
            TOTAL_DEDUCTION: totalDeduction
        },
        netTakeHome: netTakeHome,
        advanceStatutoryBonus: bonus,
        finalNTH: finalNTH,
        minimumWageUsed: minWage,
        ptUsed: pt,
        lwfEmployerUsed: lwfEmployer,
        lwfDedUsed: lwfDed,
        grade: inputGrade,
        targetCTC,
        branch,
        date,
        converged,
        parentAddition: parentAddition,
        fatherInsurance: father,
        motherInsurance: mother,
        isPSR: isPSR,
        gratuityUsed: gratuity
    };
}

module.exports = { calculateExactCTC };