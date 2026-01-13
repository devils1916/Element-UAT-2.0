function calculatePF(basic) {
  return Math.round((basic * 13.61) / 100);
}

function calculateESIC(esicEarning, isESICApplicable) {
  if (!isESICApplicable) return 0;
  return Math.ceil((esicEarning * 4.75) / 100);
}

function calculateCTC(totalEarning, insurance, miscDeduction, pfEmployer, esicEmployer) {
  return totalEarning - insurance - miscDeduction + pfEmployer + esicEmployer;
}

function calculateServiceTax(billAmount) {
  const managementFee = 200;
  return Math.round(((billAmount + managementFee) * 12.36) / 100);
}

function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).replace(/ /g, '-');
}

module.exports = {
  calculatePF,
  calculateESIC,
  calculateCTC,
  calculateServiceTax,
  formatDate
};