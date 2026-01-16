const MonthlyEntitlementEntry = require('../models/monthlyEntitlementEntry.model');
const { Op } = require('sequelize');
const { getDatabaseNameByCompanyCode } = require('./element.repository');
const { getSequelize } = require('../config/sequelizeManager');

const bulkCreateMonthlyEntitlements = async (entries, companyCode) => {

  const filteredEntries = [];
 
    const companyDetails = await getDatabaseNameByCompanyCode(companyCode);

  if (!companyDetails?.length) {
    throw new CustomError(404, "Company not found");
  }

  const sequelize = await getSequelize(companyDetails[0].CompanyDatabaseName);
  const MonthlyEntitlementEntry = sequelize.models.MonthlyEntitlementEntry;
  for (const entry of entries) {
    const exists = await MonthlyEntitlementEntry.findOne({
      where: {
        EmpID: entry.EmpID,
        SalaryHeadCode: entry.SalaryHeadCode,
        Month: entry.Month,
        Year: entry.Year
      }
    });

    if (!exists) {
      filteredEntries.push(entry);
    }
  }

  if (filteredEntries.length === 0) {
    throw new Error('No valid entries found to save');
  }

  return await MonthlyEntitlementEntry.bulkCreate(filteredEntries, { validate: true });
};
const getMonthlyEntitlements = async ({ month, year, branchCode, companyCode }) => {
  const companyDetails = await getDatabaseNameByCompanyCode(companyCode);

  if (!companyDetails?.length) {
    throw new CustomError(404, "Company not found");
  }

  const sequelize = await getSequelize(companyDetails[0].CompanyDatabaseName);
  const MonthlyEntitlementEntry = sequelize.models.MonthlyEntitlementEntry;
  const whereClause = {};

  if (month) whereClause.Month = month;
  if (year) whereClause.Year = year;
  if (branchCode) whereClause.BranchCode = branchCode;

  return await MonthlyEntitlementEntry.findAll({ where: whereClause });
};
module.exports = {
  bulkCreateMonthlyEntitlements,
  getMonthlyEntitlements
};
