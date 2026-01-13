const SequenceMaster1 = require("../../models/PayRoll/transition.model");


const getFormattedCode = async ({ CompanyCode, BranchCode, Head }) => {
  const record = await SequenceMaster1.findOne({
    where: { CompanyCode, BranchCode, Head },
  });

  if (!record) {
    throw new Error("Prefix configuration not found for given parameters");
  }

  const lastvalue = record.LastValue;
  const paddedValue = lastvalue.toString().padStart(5, "0");

  const now = new Date();
  const fyStart = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
  const fyEnd = fyStart + 1;
  const financialYear = `${fyStart.toString().slice(-2)}-${fyEnd.toString().slice(-2)}`;

  const code = `${record.CompanyPrefix}/${record.BranchPrefix}/${record.Prefix}/${paddedValue}/${financialYear}`;

  // Update LastValue in DB
  await SequenceMaster1.update(
    { LastValue: lastvalue + record.Increment },
    { where: { CompanyCode, BranchCode, Head } }
  );

  return code;
};

module.exports = {
  getFormattedCode,
};
