const { Op } = require('sequelize');
const AttendanceMaster = require('../models/attendenceMaster.model');
const AttendanceDetails = require('../models/attendenceDetails.model');
const { getBranch } = require('../repository/branchMaster.repository');

const checkAttendanceUpload = async (req, res, next) => {
  try {
    const bulkData = req.body.bulkAttedanceData;
    const {
      attendenceCode,
      companyCode,
      branchCode,
      year,
      month
    } = req.body.attendanceFilter;

    if (!bulkData || !Array.isArray(bulkData)) {
      return res.status(400).json({ error: 'Invalid or missing bulkAttedanceData' });
    }

    if (!attendenceCode || !companyCode || !branchCode || !year || !month) {
      return res.status(400).json({ error: 'Missing fields in attendanceFilter' });
    }

    // Step 1: Check if AttendenceCode already exists
    const master = await AttendanceMaster.findOne({
      where: {
        AttendenceCode: attendenceCode,
        BranchCode: branchCode,
        AttendenceYear: year,
        AttendenceMonth: month
      }
    });

    //  console.log("AttendanceMaster record:", master);

    if (!master) {
      // AttendanceMaster does not exist — attach data for creation
      const branchdetails = await getBranch(branchCode);

      if (!branchdetails) {
        return res.status(404).json({ error: 'Branch not found' });
      }

      const finYearStart = parseInt(year.slice(-2)); // "25"
      const finYearEnd = finYearStart + 1;           // "26"
      const financialYear = `${finYearStart}-${finYearEnd}`;

      // Dates for August 2025 new Date(masterData.JoiningDt).toISOString();
      const minDate = new Date("2025-09-01").toISOString();
      const maxDate = new Date("2025-09-31").toISOString();
      const attendenceDate = maxDate; // Usually the end of the attendance month
      const creationDate = new Date().toISOString(); // Use current timestamp


      req.newAttendanceMaster = {
        CompanyCode: companyCode,
        BranchCode: branchCode,
        BranchName: branchdetails?.Name,
        AttendenceCode: attendenceCode,
        AttendenceDate: attendenceDate,
        MinDate: minDate,
        MaxDate: maxDate,
        AttendenceYear: year,
        AttendenceMonth: month,
        TotalDays: 30.00,
        WorkingDays: 24.00,       
        Holidays: 2.00,
        WeeklyHolidays: 4.00,
        CreatedBy: "0001",
        CreationDate: creationDate,
        ModifiedBy: null,
        ModificationDate: null,
        EmpType: "Full Time"
        
      };

      // No need to check employeeCode — continue
      return next();
    }

    // Step 2: AttendanceMaster exists — check for duplicate EmployeeCode
    const employeeCodes = bulkData.map(e => e.EmpCode);

    const existingDetails = await AttendanceDetails.findAll({
      where: {
        AttendenceCode: attendenceCode,
        EmployeeCode: { [Op.in]: employeeCodes }
      },
      attributes: ['EmployeeCode']
    });

    if (existingDetails.length > 0) {
      const duplicates = existingDetails.map(d => d.EmployeeCode);
      return res.status(409).json({
        error: 'Some employees already have attendance recorded for this AttendenceCode.',
        duplicates
      });
    }

    // No conflicts — continue
    next();

  } catch (error) {
    console.error('Attendance check middleware error:', error);
    res.status(500).json({ error: 'Server error while checking attendance records' });
  }
};

module.exports = { checkAttendanceUpload };
