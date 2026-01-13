const ExcelJS = require("exceljs");

const downloadEmployeeExcelService = async (employees) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Employees");

  if (!employees || employees.length === 0) {
    throw new Error("No employee data provided");
  }

  // ✅ Add headers
  const headers = Object.keys(employees[0]);
  worksheet.addRow(headers);

  // ✅ Add data rows
  employees.forEach((emp) => {
    worksheet.addRow(Object.values(emp));
  });

  // ✅ Auto column width
  worksheet.columns.forEach((col) => {
    let maxLength = 10;
    col.eachCell({ includeEmpty: true }, (cell) => {
      const len = cell.value ? cell.value.toString().length : 0;
      if (len > maxLength) maxLength = len;
    });
    col.width = maxLength + 2;
  });

  // ✅ Return Excel buffer (not saved to disk)
  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
};

module.exports = downloadEmployeeExcelService;
