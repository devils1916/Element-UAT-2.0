// Function to process salary heads and extract rates
function processSalaryHeads(salaryHeads) {
  const config = {
    basicRate: 0.4, // Default 40%
    hraRate: 0.4, // Default 40%
    pfRate: 0.12, // Default 12%
    esiRate: 0.0325, // Default 3.25%
    bonusRate: 0.0833, // Default 8.33%
    customEarnings: [],
    customDeductions: []
  };

  salaryHeads.forEach(head => {
    const amount = parseFloat(head.Amount);
    const rate = amount / 100; // Convert percentage to decimal

    switch (head.Head.toLowerCase()) {
      case 'basic':
        config.basicRate = rate;
        break;
      case 'hra':
        config.hraRate = rate;
        break;
      case 'pf':
        config.pfRate = rate;
        break;
      case 'esic':
        config.esiRate = rate;
        break;
      case 'advance payment':
        config.bonusRate = rate;
        break;
      default:
        // Handle custom salary heads
        if (head.EarningDeduction === 'Earning') {
          config.customEarnings.push({
            code: head.Code,
            head: head.Head,
            description: head.Description,
            rate: rate
          });
        } else if (head.EarningDeduction === 'Deduction') {
          config.customDeductions.push({
            code: head.Code,
            head: head.Head,
            description: head.Description,
            rate: rate
          });
        }
        break;
    }
  });

  return config;
}

// Enhanced function to calculate CTC breakup with salary heads configuration
function calculateCTCBreakup(ctc, minimumWages, isMetro, salaryHeads = []) {
  // Process salary heads to get configuration
  const salaryConfig = processSalaryHeads(salaryHeads);

  const basicMonthly = Math.round(Math.max(Number(ctc * 0.40), minimumWages));
  if (!basicMonthly || basicMonthly <= 0) {
    return 'Invalid minimum wage';
  }

  // Use salary heads configuration or defaults
  const hraRate = salaryHeads.length > 0 ? salaryConfig.hraRate : (isMetro ? 0.5 : 0.4);
  const pfRate = salaryConfig.pfRate;
  const pfCap = 15000;
  const esiEmployerRate = salaryConfig.esiRate;
  const esiEmployeeRate = 0.0075;
  const esiLimit = 21000;
  const bonusRate = salaryConfig.bonusRate;
  const gratuityRate = 0.0481;
  const lwfMonthly = 0;
  const ptMonthly = 0;

  // Employer contributions (without insurance)
  const bonusMonthly = Math.round(basicMonthly * bonusRate);
  const gratuityMonthly = Math.round(basicMonthly * gratuityRate);
  const otherEmployerMonthly = Math.round(PdfAdminCharge + EDLI);
  const constEmployer = Math.round(bonusMonthly + gratuityMonthly + otherEmployerMonthly + lwfMonthly);

  // Initial assumption: PF capped at 1800, ESI applicable
  let pfMonthlyAssumed = Math.round(pfRate * pfCap);
  let useEsi = true;

  // Calculate gross
  let grossMonthly = Math.round((ctc - pfMonthlyAssumed - constEmployer) / (1 + esiEmployerRate));
  let hraMonthly = Math.round(hraRate * basicMonthly);
  if (hraMonthly < 0) {
    hraMonthly = 0;
  }
  let specialAllowance = Math.round(grossMonthly - basicMonthly - hraMonthly);
  if (specialAllowance < 0) {
    specialAllowance = 0;
    grossMonthly = Math.round(basicMonthly + hraMonthly);
  }

  // Calculate custom earnings from salary heads
  let customEarningsMonthly = 0;
  const customEarningsBreakdown = [];
  
  salaryConfig.customEarnings.forEach(earning => {
    const amount = Math.round(basicMonthly * earning.rate);
    customEarningsMonthly += amount;
    customEarningsBreakdown.push({
      code: earning.code,
      head: earning.head,
      description: earning.description,
      monthly: amount
    });
  });

  // Adjust special allowance for custom earnings
  specialAllowance = Math.round(Math.max(0, specialAllowance - customEarningsMonthly));
  grossMonthly = Math.round(basicMonthly + hraMonthly + specialAllowance + customEarningsMonthly);

  // Verify PF and ESI
  let pfBase = Math.round(basicMonthly + specialAllowance);
  let pfMonthly = Math.round(pfRate * Math.min(pfBase, pfCap));
  let esiEmployerMonthly = useEsi ? Math.round(esiEmployerRate * grossMonthly) : 0;

  // Check ESI applicability
  if (grossMonthly > esiLimit) {
    useEsi = false;
    grossMonthly = Math.round(ctc - pfMonthlyAssumed - constEmployer);
    hraMonthly = Math.round(hraRate * basicMonthly);
    if (hraMonthly < 0) {
      hraMonthly = 0;
    }
    
    // Recalculate custom earnings for non-ESI case
    customEarningsMonthly = 0;
    salaryConfig.customEarnings.forEach((earning, index) => {
      const amount = Math.round(basicMonthly * earning.rate);
      customEarningsMonthly += amount;
      customEarningsBreakdown[index].monthly = amount;
    });
    
    specialAllowance = Math.round(grossMonthly - basicMonthly - hraMonthly - customEarningsMonthly);
    if (specialAllowance < 0) {
      specialAllowance = 0;
      grossMonthly = Math.round(basicMonthly + hraMonthly + customEarningsMonthly);
    }
    pfBase = Math.round(basicMonthly + specialAllowance);
    pfMonthly = Math.round(pfRate * Math.min(pfBase, pfCap));
    esiEmployerMonthly = 0;
  }

  // Handle PF non-capped case
  if (pfBase < pfCap) {
    const esiRate = useEsi ? esiEmployerRate : 0;
    grossMonthly = Math.round((ctc + (pfRate * hraRate * basicMonthly) - constEmployer) / (1 + pfRate + esiRate));
    hraMonthly = Math.round(hraRate * basicMonthly);
    if (hraMonthly < 0) {
      hraMonthly = 0;
    }
    
    // Recalculate custom earnings for non-capped PF case
    customEarningsMonthly = 0;
    salaryConfig.customEarnings.forEach((earning, index) => {
      const amount = Math.round(basicMonthly * earning.rate);
      customEarningsMonthly += amount;
      customEarningsBreakdown[index].monthly = amount;
    });
    
    specialAllowance = Math.round(grossMonthly - basicMonthly - hraMonthly - customEarningsMonthly);
    if (specialAllowance < 0) {
      specialAllowance = 0;
      grossMonthly = Math.round(basicMonthly + hraMonthly + customEarningsMonthly);
    }
    pfBase = Math.round(basicMonthly + specialAllowance);
    pfMonthly = Math.round(pfRate * Math.min(pfBase, pfCap));
    esiEmployerMonthly = useEsi ? Math.round(esiEmployerRate * grossMonthly) : 0;
  }

  // Calculate custom deductions from salary heads
  let customDeductionsMonthly = 0;
  const customDeductionsBreakdown = [];
  
  salaryConfig.customDeductions.forEach(deduction => {
    const amount = Math.round(grossMonthly * deduction.rate);
    customDeductionsMonthly += amount;
    customDeductionsBreakdown.push({
      code: deduction.code,
      head: deduction.head,
      description: deduction.description,
      monthly: amount
    });
  });

  // Final calculations with rounded values
  grossMonthly = Math.round(basicMonthly + hraMonthly + specialAllowance + customEarningsMonthly);
  pfMonthly = Math.round(pfMonthly);
  esiEmployerMonthly = Math.round(esiEmployerMonthly);
  const totalEmployerMonthly = Math.round(pfMonthly + esiEmployerMonthly + lwfMonthly + bonusMonthly + gratuityMonthly + otherEmployerMonthly);

  const fixedCtcMonthly = Math.round(grossMonthly + totalEmployerMonthly);

  // Employee deductions
  const pfEmployeeMonthly = Math.round(pfMonthly);
  const esiEmployeeMonthly = useEsi ? Math.round(esiEmployeeRate * grossMonthly) : 0;
  const totalDeductionMonthly = Math.round(pfEmployeeMonthly + esiEmployeeMonthly + ptMonthly + lwfMonthly + customDeductionsMonthly);

  const netTakeHomeMonthly = Math.round(grossMonthly - totalDeductionMonthly);
  const finalNthMonthly = Math.round(netTakeHomeMonthly + bonusMonthly);

  // Build the new format structure
  const salaryStructure = {
    targetCTC: Math.round(ctc),
    salaryHead: {
      BASIC: Math.round(basicMonthly),
      HRA: Math.round(hraMonthly),
      SPECIAL_ALLOWANCE: Math.round(specialAllowance)
    },
    sub1: {
      Gross: Math.round(grossMonthly)
    },
    employer: {
      PF_Employer: Math.round(pfMonthly),
      ESI_3_25_percent_of_gross: Math.round(esiEmployerMonthly),
      LWF: Math.round(lwfMonthly),
      ADVANCE_STATUTORY_BONUS: Math.round(bonusMonthly),
      Gratuity: Math.round(gratuityMonthly),
      PF_admin_Charge: Math.round(PdfAdminCharge),
      EDLI: Math.round(EDLI),
      GTLI: 0,
      GHI: 0,
      GPA: 0,
      TOTAL_Employer: Math.round(totalEmployerMonthly)
    },
    sub2: {
      TOTAL_Employer: Math.round(totalEmployerMonthly)
    },
    grossPlusSub2: {
      Fixed_CTC: Math.round(fixedCtcMonthly)
    },
    employee: {
      PF_12_percent_of_BASIC: Math.round(pfEmployeeMonthly),
      ESI_0_75_percent_GROSS: Math.round(esiEmployeeMonthly),
      PT: Math.round(ptMonthly),
      LWF: Math.round(lwfMonthly),
      TOTAL_Deduction: Math.round(totalDeductionMonthly)
    },
    grossMinusSub2: {
      Net_Take_Home: Math.round(netTakeHomeMonthly),
      ADVANCE_STATUTORY_BONUS: Math.round(bonusMonthly)
    },
    grossMinusSub2Final: {
      Final_NTH: Math.round(finalNthMonthly)
    }
  };

  // Add custom earnings to salaryHead if they exist
  customEarningsBreakdown.forEach(earning => {
    const key = earning.head.replace(/\s+/g, '_').toUpperCase();
    salaryStructure.salaryHead[key] = Math.round(earning.monthly);
  });

  // Add custom deductions to employee if they exist
  customDeductionsBreakdown.forEach(deduction => {
    const key = deduction.head.replace(/\s+/g, '_').toUpperCase();
    salaryStructure.employee[key] = Math.round(deduction.monthly);
  });

  return salaryStructure;
}

module.exports = calculateCTCBreakup;