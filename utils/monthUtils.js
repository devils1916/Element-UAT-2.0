// monthUtils.js

const monthNameToNumber = (monthName) => {
  const months = {
    January: "01",
    February: "02",
    March: "03",
    April: "04",
    May: "05",
    June: "06",
    July: "07",
    August: "08",
    September: "09",
    October: "10",
    November: "11",
    December: "12",
  };

  const formattedName = monthName.trim().charAt(0).toUpperCase() + monthName.trim().slice(1).toLowerCase();

  if (!months[formattedName]) {
    throw new Error(`Invalid month name: "${monthName}"`);
  }

  return months[formattedName];
};

module.exports = { monthNameToNumber };
