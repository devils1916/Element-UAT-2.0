const ExcelJS =require("exceljs");

const exportToExcel = async (rows, sheetName) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetName);

  if (rows.length > 0) {
    worksheet.columns = Object.keys(rows[0]).map(key => ({
      header: key,
      key: key,
      width: 20
    }));

    rows.forEach(row => worksheet.addRow(row));
  }

  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
};

module.exports = exportToExcel