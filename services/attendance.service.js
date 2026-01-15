const { Op } = require("sequelize");
const {
  EmployeeMaster,
  ShiftMaster,
  DailyAttendanceEntryPortal,
  EmployeeLeaveAvailed,
  AttendenceOD,
  AttendenceWH,
  HolidayMaster,
  BranchMaster,
} = require("../models/AttendenceModels");
const {
  insertAttendanceMaster,
  insertAttendanceDetail,
  checkAlradyExistAttendence
} = require("../repository/attendance.repository");
const { createFormattedCode } = require("../repository/bulkUpload.repository");

// Helpers
const getFinancialYear = (year) => {
  const y = parseInt(year);
  return `${String(y).slice(-2)}-${String(y + 1).slice(-2)}`;
};

const formatDate = (date) => {
  if (!date) return null;
  return new Date(date).toISOString().slice(0, 19).replace("T", " ");
};

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Helper: calculate working days and weekly offs
function getWorkingDaysAndWeeklyOffs(year, month, weeklyOffDays = [0]) {
  let weeklyOff = 0;
  let workingDays = 0;
  const totalDays = new Date(year, month, 0).getDate();

  for (let day = 1; day <= totalDays; day++) {
    const currentDate = new Date(year, month - 1, day);
    if (weeklyOffDays.includes(currentDate.getDay())) weeklyOff++;
    else workingDays++;
  }
  return { workingDays, weeklyOff, totalDays };
}

// Helper: aggregate monthly summary with WPLDays from payload
function aggregateMonthly(days, leaves, shift, weeklyOff = 0, holidaysCount = 0, wplDaysFromPayload = 0) {
  
  let summary = {
    PresentDays: 0,
    WPLDays: wplDaysFromPayload,
    CL: 0,
    SL: 0,
    EL: 0,
    RH: 0,
    TotalLeave: 0,
    WeeklyOff: weeklyOff,
    Holidays: holidaysCount,
    SalaryDays: 0,
    OTDays: 0,
    OTHours: 0,
  };

  // Count leave days
  leaves.forEach((l) => {
    summary.TotalLeave += l.NoofLeave || 0;
    switch (l.LeaveType) {
      case "CL":
        summary.CL += l.NoofLeave || 0;
        break;
      case "SL":
        summary.SL += l.NoofLeave || 0;
        break;
      case "EL":
        summary.EL += l.NoofLeave || 0;
        break;
      case "RH":
        summary.RH += l.NoofLeave || 0;
        break;
    }
  });

  // PresentDays = TotalDays - TotalLeave - WeeklyOff - Holidays
  const totalDays = days.length;
  summary.PresentDays = totalDays - summary.WPLDays - summary.TotalLeave - summary.WeeklyOff - summary.Holidays;

  // OT
  days.forEach((d) => {
    if (d.OverTimeHrs > 0) {
      summary.OTDays++;
      summary.OTHours += d.OverTimeHrs;
    }
  });

  // SalaryDays = Present + Paid Leaves + Holidays + WeeklyOff
  summary.SalaryDays =
    summary.PresentDays +
    summary.CL +
    summary.SL +
    summary.EL +
    summary.RH +
    summary.Holidays +
    summary.WeeklyOff;

  return summary;
}

// Calculate daily attendance per employee
async function calculateDailyAttendance(branchCode, employeeCode, fromDate, toDate) {
  const emp = await EmployeeMaster.findOne({
    where: { EmpID: employeeCode, BranchCode: branchCode },
    raw: true,
  });

  if (!emp) throw new Error("Employee not found");

  const branchName = await BranchMaster.findOne({
    where: { Code: branchCode },
    attributes: ['Name'],
    raw: true,
  });

  if (emp) emp.BranchName = branchName ? branchName.Name : null;

  const shift = await ShiftMaster.findOne({
    where: { ShiftCode: emp.ShiftCode },
    raw: true,
  });

  const holidays = await HolidayMaster.findAll({
    where: {
      BranchCode: branchCode,
      HolidayDate: { [Op.between]: [fromDate, toDate] },
    },
    raw: true,
  });

  const leaves = await EmployeeLeaveAvailed.findAll({
    where: {
      Employeecode: employeeCode,
      SanctionedFrom: { [Op.lte]: toDate },
      SanctionedTo: { [Op.gte]: fromDate },
    },
    raw: true,
  });

  const ods = await AttendenceOD.findAll({
    where: {
      EmployeeCode: employeeCode,
      ODFromDate: { [Op.lte]: toDate },
      ODToDate: { [Op.gte]: fromDate },
    },
    raw: true,
  });

  const whs = await AttendenceWH.findAll({
    where: {
      EmployeeCode: employeeCode,
      ODFromDate: { [Op.lte]: toDate },
      ODToDate: { [Op.gte]: fromDate },
    },
    raw: true,
  });

  const dailyMap = {};

  const days = [];
  let curr = new Date(fromDate);
  while (curr <= new Date(toDate)) {
    const d = curr.toISOString().substring(0, 10);
    const rec = {
      EmpCode: emp.EmpID,
      EmpName: emp.Name,
      AttDate: d,
      InTime: dailyMap[d]?.inTime || null,
      OutTime: dailyMap[d]?.outTime || null,
      Status: "A",
      Remarks: "Absent",
      LateMin: 0,
      EarlyMin: 0,
      OverTimeHrs: 0,
    };

    if (leaves.some((l) => d >= l.SanctionedFrom && d <= l.SanctionedTo)) {
      rec.Status = "L";
      rec.Remarks = "Leave";
    }
    if (holidays.some((h) => h.HolidayDate.toISOString().substring(0, 10) === d)) {
      rec.Status = "H";
      rec.Remarks = "Holiday";
    }
    if (ods.some((o) => d >= o.ODFromDate && d <= o.ODToDate)) {
      rec.Status = "OD";
      rec.Remarks = "On Duty";
    }
    if (whs.some((o) => d >= o.ODFromDate && d <= o.ODToDate)) {
      rec.Status = "WH";
      rec.Remarks = "Work From Home";
    }
    if (rec.InTime && rec.OutTime && rec.Status === "A") {
      rec.Status = "P";
      rec.Remarks = "Present";
    }

    if (shift && rec.InTime) {
      const shiftStart = new Date(`${d}T${shift.StartTime}`);
      const inTime = new Date(`${d}T${rec.InTime}`);
      if (inTime > shiftStart) rec.LateMin = Math.round((inTime - shiftStart) / 60000);
    }
    if (shift && rec.OutTime) {
      const shiftEnd = new Date(`${d}T${shift.EndTime}`);
      const outTime = new Date(`${d}T${rec.OutTime}`);
      if (outTime < shiftEnd) rec.EarlyMin = Math.round((shiftEnd - outTime) / 60000);
      if (outTime > shiftEnd) rec.OverTimeHrs = Math.round((outTime - shiftEnd) / 3600000);
    }

    days.push(rec);
    curr.setDate(curr.getDate() + 1);
  }

  return { days, emp, shift, leaves, holidays };
}

const createAttendanceService = async (attendanceFilter, bulkAttedanceData) => {
  if (!attendanceFilter || !bulkAttedanceData) throw new Error("Invalid payload");

  const year = parseInt(attendanceFilter.year);
  const month = parseInt(attendanceFilter.month);
  const companyCode = attendanceFilter.companyCode;

  const groupedByBranch = bulkAttedanceData.reduce((acc, emp) => {
    if (!acc[emp.EmpBranchCode]) acc[emp.EmpBranchCode] = [];
    acc[emp.EmpBranchCode].push(emp);
    return acc;
  }, {});

  let master = [];
  let details = [];
  let missingEmployees = [];
  let leftEmployees = [];
  let skippedBranches = [];

  for (const [branchCode, employees] of Object.entries(groupedByBranch)) {
    const empCodes = employees.map((e) => e.EmpCode);

    const existingEmployees = await EmployeeMaster.findAll({
      where: { EmpID: empCodes, BranchCode: branchCode },
      attributes: ["EmpID", "HasLeft", "EmpType"],
      raw: true,
    });

    const existingEmpIds = existingEmployees.map((e) => e.EmpID);
    const notFound = empCodes.filter((e) => !existingEmpIds.includes(e));

    const branchName = await BranchMaster.findOne({
      where: { Code: branchCode },
      attributes: ["Name"],
      raw: true,
    });

    if (notFound.length > 0) {
      missingEmployees.push(...notFound);
      skippedBranches.push({
        branchCode,
        branchName: branchName?.Name || "Unknown",
        reason: "Missing employees",
        missingEmpCodes: notFound,
      });
      continue;
    }

    const leftEmp = existingEmployees
      .filter((e) => e.HasLeft === true || e.HasLeft === 1 || e.HasLeft === "true" || e.HasLeft === "1")
      .map((e) => e.EmpID);

    if (leftEmp.length > 0) {
      leftEmployees.push(...leftEmp);
      skippedBranches.push({
        branchCode,
        branchName: branchName?.Name || "Unknown",
        reason: "Employees have left",
        leftEmpCodes: leftEmp,
      });
      continue;
    }

    const empFromMaster = existingEmployees[0];

    const attendenceCode = await createFormattedCode({
      CompanyCode: companyCode,
      BranchCode: branchCode,
      Head: "Attendence",
      Year: attendanceFilter.year,
      Month: MONTHS[month - 1],
    });

    const { totalDays, workingDays, weeklyOff } = getWorkingDaysAndWeeklyOffs(year, month);
    const fromDate = `${year}-${month.toString().padStart(2, "0")}-01`;
    const toDate = `${year}-${month.toString().padStart(2, "0")}-${totalDays}`;

    const holidaysList = await HolidayMaster.findAll({
      where: {
        [Op.and]: [
          { BranchCode: branchCode },
          { HolidayDate: { [Op.between]: [ fromDate, toDate ] } },
        ],
      },
      attributes: ["HolidayDate"],
    });

    const totalHolidays = holidaysList.length;

    let holidayOnSunday = false;
    holidaysList.forEach((h) => {
      const date = new Date(h.HolidayDate);
      if (date.getDay() === 0) holidayOnSunday = true;
    });

    let weeklyHoliday = weeklyOff;
    if (holidayOnSunday) weeklyHoliday = weeklyOff - 1;

    const alreadyExistForMonth = await checkAlradyExistAttendence(MONTHS[month - 1], year, branchCode);
    if (alreadyExistForMonth) {
      skippedBranches.push({
        branchCode,
        branchName: branchName?.Name || "Unknown",
        reason: `Attendance already exists with Code ${alreadyExistForMonth.AttendenceCode}`,
      });
      continue;
    }

    const masterRow = await insertAttendanceMaster({
      CompanyCode: companyCode,
      BranchCode: branchCode,
      BranchName: branchName.Name,
      AttendenceCode: attendenceCode,
      AttendenceDate: formatDate(new Date()),
      MinDate: fromDate,
      MaxDate: toDate,
      AttendenceYear: year,
      AttendenceMonth: MONTHS[month - 1],
      TotalDays: totalDays,
      WorkingDays: workingDays - totalHolidays-weeklyHoliday,
      Holidays: totalHolidays,
      WeeklyHolidays: weeklyHoliday,
      CreatedBy: "Admin",
      CreationDate: formatDate(new Date()),
      EmpType: empFromMaster.EmpType,
    });
    master.push(masterRow);

    for (const emp of employees) {
      const { days, emp: empData, shift, leaves } = await calculateDailyAttendance(branchCode, emp.EmpCode, fromDate, toDate);
      const summary = aggregateMonthly(days, leaves, shift, weeklyHoliday, totalHolidays, emp.WplDays || 0);

      const detailRow = await insertAttendanceDetail({
        AttendenceCode: attendenceCode,
        BranchCode: branchCode,
        BranchName: branchName.Name,
        EmployeeCode: empData.EmpID,
        EmployeeName: empData.Name,
        Department: empData.Department,
        Designation: empData.Designation,
        EmpBranchCode: empData.BranchCode,
        EmpBranchName: branchName.Name,
        Remarks: "Admin",
        ...summary,
      });
      details.push(detailRow);
    }
  }

  return {
    attendanceMaster: master,
    attendanceDetails: details,
    skippedBranches,
  };

};

module.exports = { createAttendanceService };