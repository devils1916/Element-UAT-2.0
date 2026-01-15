function getFromAndToDate(month, year) {
  const monthNumber = parseInt(month, 10);
  const numericYear = parseInt(year, 10);

  if (isNaN(monthNumber) || monthNumber < 1 || monthNumber > 12) {
    throw new Error(`Invalid month input: ${month}`);
  }

  if (isNaN(numericYear)) {
    throw new Error('Invalid year input');
  }

  const fromDate = new Date(numericYear, monthNumber - 1, 1);
  const toDate = new Date(numericYear, monthNumber, 0);

  const format = (d) => d.toISOString().split('T')[0];

  return {
    fromDate: format(fromDate),
    toDate: format(toDate),
  };
}

module.exports = { getFromAndToDate };