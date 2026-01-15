const SequenceMaster1 = require("../models/sequenceMaster1.model");
const AttendanceMaster = require("../models/attendenceMaster.model");

// const createFormattedCode = async ({ CompanyCode, BranchCode, Head, Year, Month }) => {
 
//    // Step 1: Check if AttendanceMaster already has a code for this branch, year, and month
//     const existingRecord = await AttendanceMaster.findOne({
//       where: {
//         CompanyCode,
//         BranchCode,
//         AttendenceYear: Year,
//         AttendenceMonth: Month,
//       },
//     });

//     if (existingRecord?.AttendenceCode) {
//       // Return existing code if present
//       return existingRecord.AttendenceCode;
//     }
  

//   // Step 2: Get sequence config from SequenceMaster1
//   const record = await SequenceMaster1.findOne({
//     where: { CompanyCode, BranchCode, Head:Head },
//   });

//    console.log("record", record)
    
//   if (!record) {
//     throw new Error("Prefix configuration not found for given parameters");
//   }

//   // Step 3: Format code using prefix + padded increment + financial year
//   const lastvalue = record.LastValue
//   const paddedValue = lastvalue.toString().padStart(5, "0");
//   const now = new Date();
//   const fyStart = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
//   const fyEnd = fyStart + 1;
//   const financialYear = `${fyStart.toString().slice(-2)}-${fyEnd.toString().slice(-2)}`;

//   const code = `${record.CompanyPrefix}/${record.BranchPrefix}/${record.Prefix}/${paddedValue}/${financialYear}`;
//     await SequenceMaster1.update(
//     { LastValue: lastvalue + record.Increment },
//     { where: { CompanyCode, BranchCode, Head: Head } }
//   );
//   return code;
// }
const createFormattedCode = async ({ CompanyCode, BranchCode, Head, Year, Month }) => {
  // Step 1: Check if AttendanceMaster already has a code
  const existingRecord = await AttendanceMaster.findOne({
    where: {
      CompanyCode,
      BranchCode,
      AttendenceYear: Year,
      AttendenceMonth: Month,
    },
  });

  if (existingRecord?.AttendenceCode) {
    return existingRecord.AttendenceCode;
  }

  // Step 2: Get sequence config from SequenceMaster1
  let record = await SequenceMaster1.findOne({
    where: { CompanyCode, BranchCode, Head },
  });

  // ✅ If "All Branch" requested but no record exists, create it automatically
  if (!record && BranchCode === "All Branch") {
    record = await SequenceMaster1.create({
      CompanyCode,
      CompanyPrefix: "ALL",
      BranchCode: "All Branch",
      BranchName: "All Branch",
      BranchPrefix: "BRAN",
      Head,
      Prefix: Head,
      Start: 1,
      Stop: 99999,
      Increment: 1,
      LastValue: 1,
      FinancialYear: 1,
    });
  }

  if (!record) {
    throw new Error("Prefix configuration not found for given parameters");
  }

  // Step 3: Format code
  const lastvalue = record.LastValue;
  const paddedValue = lastvalue.toString().padStart(5, "0");

  const now = new Date();
  const fyStart = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
  const fyEnd = fyStart + 1;
  const financialYear = `${fyStart.toString().slice(-2)}-${fyEnd.toString().slice(-2)}`;

  // ✅ Special prefix for "All Branch"
  const prefixPart =
    BranchCode === "All Branch"
      ? `All/Bran`
      : `${record.CompanyPrefix}/${record.BranchPrefix}/${record.Prefix}`;

  const code = `${prefixPart}/${paddedValue}/${financialYear}`;

  // Step 4: Update sequence so next time it stays unique
  await SequenceMaster1.update(
    { LastValue: lastvalue + record.Increment },
    { where: { CompanyCode, BranchCode, Head } }
  );

  return code;
};

const getFormattedCode = async ({ CompanyCode, BranchCode, Head}) => {
 
  const record = await SequenceMaster1.findOne({
    where: { CompanyCode, BranchCode, Head:Head },
  });

   console.log("record", record)
    
  if (!record) {
    throw new Error("Prefix configuration not found for given parameters");
  }
  // Step 3: Format code using prefix + padded increment + financial year
  const lastvalue = record.LastValue
  const paddedValue = lastvalue.toString().padStart(5, "0");
  const now = new Date();
  const fyStart = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
  const fyEnd = fyStart + 1;
  const financialYear = `${fyStart.toString().slice(-2)}-${fyEnd.toString().slice(-2)}`;

  const code = `${record.CompanyPrefix}/${record.BranchPrefix}/${record.Prefix}/${paddedValue}/${financialYear}`;
    await SequenceMaster1.update(
    { LastValue: lastvalue + record.Increment },
    { where: { CompanyCode, BranchCode, Head: Head } }
  );
  return code;
};

const getAttendanceCodeRepo = async ({ CompanyCode, BranchCode, Year, Month }) => {
 
   // Step 1: Check if AttendanceMaster already has a code for this branch, year, and month
    const existingRecord = await AttendanceMaster.findOne({
      where: {
        CompanyCode,
        BranchCode,
        AttendenceYear: Year,
        AttendenceMonth: Month,
      },
    });

    if (existingRecord?.AttendenceCode) {
      return existingRecord.AttendenceCode;
    }

    throw new Error(`Attendance code not found for ${CompanyCode}/${BranchCode} - ${Month}/${Year}`);
     
}


module.exports = {createFormattedCode, getFormattedCode, getAttendanceCodeRepo };
