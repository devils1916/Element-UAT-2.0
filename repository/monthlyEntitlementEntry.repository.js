const MonthlyEntitlementEntry = require('../models/monthlyEntitlementEntry.model');
const { Op } = require('sequelize');

const bulkCreateMonthlyEntitlements = async (entries) => {
  const filteredEntries = [];

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
const getMonthlyEntitlements = async ({ month, year, branchCode }) => {
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
