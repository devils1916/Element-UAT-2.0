const { getSequelize } = require('../config/sequelizeManager');
const { getDatabaseNameByCompanyCode } = require('./element.repository');

const createFormattedCode = async ({ newCompanyCode, CompanyCode, BranchCode, Head, Year, Month }) => {

  const companyDetails = await getDatabaseNameByCompanyCode(newCompanyCode);
  if (!companyDetails || companyDetails.length === 0) {
    throw new CustomError(404, "Company not found");
  }
  const sequelize = await getSequelize(companyDetails[0].CompanyDatabaseName);

  const AttendanceMaster = sequelize.models.AttendenceMaster;
  const existingRecord = await AttendanceMaster.findOne({
    where: {
      CompanyCode,
      BranchCode,
      AttendenceYear: Year,
      AttendenceMonth: Month,
      newCompanyCode: newCompanyCode
    },
  });

  if (existingRecord?.AttendenceCode) {
    return existingRecord.AttendenceCode;
  }

  const SequenceMaster1 = sequelize.models.SequenceMaster1;
  // Step 2: Get sequence config from SequenceMaster1
  let record = await SequenceMaster1.findOne({
    where: { CompanyCode, BranchCode, Head, newCompanyCode },
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
    { where: { CompanyCode, BranchCode, Head, newCompanyCode } }
  );

  return code;
};

const getFormattedCode = async ({ newCompanyCode, CompanyCode, BranchCode, Head }) => {
  const companyDetails = await getDatabaseNameByCompanyCode(newCompanyCode);
  if (!companyDetails || companyDetails.length === 0) {
    throw new CustomError(404, "Company not found");
  }
  const sequelize = await getSequelize(companyDetails[0].CompanyDatabaseName);

  const SequenceMaster1 = sequelize.models.SequenceMaster1;

  const record = await SequenceMaster1.findOne({ where: { CompanyCode, BranchCode, Head, newCompanyCode } });

  if (!record) {
    throw new Error("Prefix configuration not found for given parameters");
  }
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

const getAttendanceCodeRepo = async ({ newCompanyCode, CompanyCode, BranchCode, Year, Month }) => {

  const companyDetails = await getDatabaseNameByCompanyCode(newCompanyCode);
  if (!companyDetails || companyDetails.length === 0) {
    throw new CustomError(404, "Company not found");
  }
  const sequelize = await getSequelize(companyDetails[0].CompanyDatabaseName);
  const AttendanceMaster = sequelize.models.AttendenceMaster;
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


module.exports = { createFormattedCode, getFormattedCode, getAttendanceCodeRepo };
