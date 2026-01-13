const salaryslipMaster = require("../../models/salarySlip.model")
const salarySlipEntitlementDetails = require("../../models/SalarySlipEntitlementDetails.model")


const getSalarySlipInMaster = async (salarySlipCode) => {
  try {
    return await salaryslipMaster.findOne({
      where: { SalarySlipCode: salarySlipCode },
    });
  } catch (error) {
    console.error("Error fetching salary slip in master:", error);  
    throw new CustomError(
      "Error fetching salary slip in master",
      error.message
    );  
  }
};

const saveSalarySlipDetailsdb = async (salarySlipArray) => {
  try {
    if (!Array.isArray(salarySlipArray) || salarySlipArray.length === 0) {
      return { created: [], alreadyExist: [] };
    }
    const created = [];
    const alreadyExist = [];
    let SNo=1;
    for (const record of salarySlipArray) {
      const {
        SalarySlipCode,
        HeadCode,
        Name,
        Rate,
        Amount,
        EmpCode,
        EarnDedu,
        Arrear
      } = record;

      const arrearValue = Arrear && Arrear !== "" ? Arrear : 0.0;

      // Check for existing record
      const existing = await salarySlipEntitlementDetails.findOne({
        where: { SalarySlipCode, HeadCode, EmpCode }
      });

      if (existing) {
        alreadyExist.push({ SalarySlipCode, EmpCode, HeadCode });
      } else {
        await salarySlipEntitlementDetails.create({

          SalarySlipCode,
          HeadCode,
          Name,
          Rate,
          Amount,
          EmpCode,
          EarnDedu,
          Arrear: arrearValue,
          SNo:SNo++
        });
        created.push({ SalarySlipCode, EmpCode, HeadCode });
      }
    }

    return { created, alreadyExist };

  } catch (error) {
    console.error("Error saving salary slip details:", error);
    return { created: [], alreadyExist: [], error: error.message || "Unknown error" };
  }
};
// ✅ Get SalarySlipCode by AttendenceCode
const getSalarySlipByAttendance = async (AttendenceCode) => {
  try {
    return await salaryslipMaster.findOne({
      attributes: ["SalarySlipCode"],
      where: { AttendenceCode }
    });
  } catch (error) {
    console.error("Error fetching SalarySlipCode by AttendenceCode:", error);
    throw error;
  }
};




module.exports = {
    getSalarySlipInMaster,
    saveSalarySlipDetailsdb,
    getSalarySlipByAttendance
}