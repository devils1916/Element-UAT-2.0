const AttendenceMaster = require('../models/attendenceMaster.model');
const AttendenceDetail = require('../models/attendenceDetails.model.js');
const DailyAttendenceDetails = require("../models/dailyAttendanceDetails.model.js")
const employeeLeaveRecord = require("../models/employeeLeaveRecord.js")
const { Op } = require("sequelize");
const { Sequelize } = require('sequelize');
// const  {DailyAttendanceMaster,DailyAttendenceDetails } = require("../models/associate.model.js");
const DailyAttendenceMaster = require('../models/dailyAttendenceMaster.model.js');
const Employee = require("../models/employeeMaster.model.js");
const { element } = require('../config/db.js');
const moment = require('moment');
const DailyAttendanceEntryPortal = require('../models/dailyAttendanceEntry_Portal.js');
const DailyAttendanceEntryActual = require('../models/dailyAttendanceActual.js');
const EmployeeLeaveControl = require('../models/EmployeeLeaveControl.js');
const { EmployeeLeaveAvailed, EmployeeLeave, AttendenceOD, HolidayMaster, BranchMaster } = require("../models/AttendenceModels.js")
const { EmployeeLeaveAvailed: EmployeeLeaveAvailedAssociate, EmployeeLeave: EmployeeLeaveAssociate } = require("../models/associate.model.js")
// const EmployeeLeaveAvailed = require("../models/AttendenceModels.js/")


// import { Op } from 'sequelize';

const queryConditionMap = (where, condition) => {
  return where !== "" ? ` AND ${condition}` : `${condition}`
}

const getAllSaveAttendance = async (filters, page = 1, pageSize = 10) => {
  try {
    const offset = (page - 1) * pageSize;
    const where = {};

    if (filters.company) {
      where.CompanyCode = filters.company;
    }
    if (filters.year) {
      where.AttendenceYear = filters.year;
    }
    if (filters.month) {
      where.AttendenceMonth = filters.month;
    }
    if (filters.branch) {
      where.BranchCode = filters.branch;
    }

    const { count, rows } = await AttendenceMaster.findAndCountAll({
      attributes: ["AttendenceCode", "AttendenceMonth", "AttendenceYear", "BranchName", "BranchCode", "EmpType", "AttendenceCode"],
      where,
      offset,
      limit: pageSize,
      order: [['AttendenceDate', 'DESC']],
    });

    const totalPages = Math.ceil(count / pageSize);

    return {
      data: rows,
      totalRecords: count,
      currentPage: page,
      totalPages,
      pageSize,
    };
  } catch (error) {
    console.error('Error in getAllSaveAttendance:', error);
    return error
  }
};



// const getAttendenceByCode = async (attendenceCode, page = 1, limit = 10) => {
//   try {
//     const offset = (page - 1) * limit;

//     // Fetch the attendance master record
//     const master = await AttendenceMaster.findOne({
//       where: { AttendenceCode: attendenceCode },
//     });

//     // Fetch paginated attendance details
//     const { count, rows: details } = await AttendenceDetail.findAndCountAll({
//       where: { AttendenceCode: attendenceCode },
//       offset,
//       limit,
//     });

//     return {
//       master,
//       details,
//       pagination: {
//         totalRecords: count,
//         totalPages: Math.ceil(count / limit),
//         currentPage: page,
//         pageSize: limit,
//       },
//     };

//   } catch (error) {
//     console.log(error);
//     throw new Error(`Failed to fetch attendance by code: ${error.message}`);
//   }
// };
const getAttendenceByCode = async (attendenceCode, page = 1, limit = 10) => {
  try {
    const offset = (page - 1) * limit;

    // Fetch the attendance master record
    const master = await AttendenceMaster.findOne({
      where: { AttendenceCode: attendenceCode },
    });

    // Fetch paginated attendance details
    const { count, rows: details } = await AttendenceDetail.findAndCountAll({
      where: { AttendenceCode: attendenceCode },
      offset,
      limit,
    });

    return {
      master,
      details,
      pagination: {
        totalRecords: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        pageSize: limit,
      },
    };

  } catch (error) {
    console.log(error);
    throw new Error(`Failed to fetch attendance by code: ${error.message}`);
  }
};
const bulkInsertAttendanceByBranchService = async ({ newMasterData, attendenceCode, bulkData, createdBy }) => {


  const transaction = await element.transaction();

  try {
    // Step 1: Create AttendanceMaster if required
    if (newMasterData) {
      // console.log("Step 1: Creating AttendenceMaster...");
      await AttendenceMaster.create(newMasterData, { transaction });
      // console.log("Step 1 Success: Master created", result2?.toJSON ? result2.toJSON() : result2);
    }

    // Step 2: Fetch EmployeeMaster data for all employees in bulkData
    const employeeCodes = bulkData.map((item) => item.EmpCode);
    const employees = await Employee.findAll({
      where: { EmpID: { [Op.in]: employeeCodes } },
      raw: true
    });

    // Build a map for faster lookups
    const empMap = employees.reduce((acc, emp) => {
      acc[emp.EmpID] = emp;
      return acc;
    }, {});


    // Step 2: Prepare AttendanceDetails
    // Step 3: Prepare AttendanceDetails with enrichment
    const attendanceDetails = bulkData.map((item) => {
      const emp = empMap[item.EmpCode] || {};
      return {
        AttendenceCode: attendenceCode,
        EmployeeCode: item.EmpCode,
        EmployeeName: emp.Name || null,
        Designation: emp.Designation || null,
        Department: emp.Department || null,
        EmpBranchCode: emp.BranchCode || null,
        EmpBranchName: emp.BranchName || null,
        EmpType: emp.EmpType || null,
        JoiningDt: emp.JoiningDt || null,

        BranchCode: item.BranchCode || newMasterData?.BranchCode || "",
        BranchName: item.BranchName || newMasterData?.BranchName || "",

        PresentDays: item.PresentDays,
        CL: item.CL,
        SL: item.SL,
        EL: item.EL, 
        RH: item.RH,
        WPLDays: item.LWP, 
        TotalLeave: item.TotalLeave,
        WeeklyOff: item.WeeklyOff,
        Holidays: item.Holidays,
        SalaryDays: item.SalaryDays,
        Remarks: item.Remarks || null,

        OTDays: item.OTDays || 0,
        OTHours: item.OTHours || 0,

        CreatedAt: new Date(),
        CreatedBy: createdBy || "system"
      };
    });
    // console.log(`Step 2 Success: Prepared ${attendanceDetails.length} records`);

   
    const result = await AttendenceDetail.bulkCreate(attendanceDetails, {
      transaction
    });

    await transaction.commit();
    return result;
  } catch (error) {
    console.error("❌ Error occurred:", error.message);
    console.error("Full Error:", error);
    await transaction.rollback();
    console.log("== Transaction Rolled Back ==");
    throw error;
  }
};


const bulkInsertAttendanceDetail = async (attendanceData) => {
  try {
    console.log("attendanceData : ", attendanceData)
    const insertedRecords = await AttendenceDetail.bulkCreate(attendanceData, {
      validate: true,
    });

    return insertedRecords;

  } catch (error) {

    throw new Error('Error in bulkInsertAttendanceDetail: ' + error.message);

  }
};


const getAttendanceByEmployeeCode = async (employeeCode) => {
  try {
    const attendance = await AttendenceDetail.findOne({
      where: { EmployeeCode: employeeCode }
    });
    return attendance;
  } catch (error) {
    throw new Error('Error in getAttendanceByEmployeeCode: ' + error.message);
  }
};


const getAllDailyAttendance = async (page = 1, limit = 10, filters = {}) => {
  try {
    const offset = (page - 1) * limit;

    const { BranchCode, AttendenceYear, AttendenceMonth } = filters;
    const whereMaster = {};

    if (AttendenceMonth) whereMaster.AttendenceMonth = AttendenceMonth;
    if (AttendenceYear) whereMaster.AttendenceYear = AttendenceYear;
    if (BranchCode) whereMaster.BranchCode = BranchCode;

    const { count, rows } = await DailyAttendenceMaster.findAndCountAll({
      attributes: [
        "DailyAttendenceCode",
        "BranchCode",
        "BranchName",
        "AttendenceYear",
        "AttendenceMonth",
        "EmpType",
      ],
      where: whereMaster,
      offset,
      limit,
      order: [["CreationDate", "DESC"]],
    });

    const totalPages = Math.ceil(count / limit);

    return {
      data: rows,
      currentPage: page,
      totalRecords: count,
      totalPages,
    };
  } catch (error) {
    throw new Error("Error in getAllDailyAttendance: " + error.message);
  }
};


const getDailyAttendanceByCode = async (code, page = 1, limit = 10) => {
  try {
    const offset = (page - 1) * limit;

    const { count, rows } = await DailyAttendenceDetails.findAndCountAll({
      where: { DailyAttendenceCode: code },
      offset,
      limit,
      // order: [["CreationDate", "DESC"]],
    });

    if (count === 0) {
      throw new Error('No attendance records found for the given code');
    }

    const totalPages = Math.ceil(count / limit);

    return {
      data: rows,
      currentPage: page,
      totalRecords: count,
      totalPages
    };
  } catch (error) {
    throw new Error(error.message || 'Error fetching attendance');
  }
};

// const postEmployeeLeaveRecord = async ({ month, year, branchCode, details }) => {
//   if (!month || !year || !branchCode) {
//     throw new Error("Month, Year, and BranchCode are required");
//   }

//   const currentMonth = new Date().getMonth() + 1;
//   const monthNo = currentMonth === 1 ? 12 : currentMonth - 1;
//   const leaveOpeningDate = `01/${month}/${year}`;

//   const transaction = await element.transaction();

//   try {
//     for (const row of details) {
//       if (!row.EmpCode) throw new Error("Employee Code is required");

//       // Delete old leave records
//       await employeeLeaveRecord.destroy({
//         where: {
//           EmpCode: row.EmpCode,
//           Months: month,
//           Years: year
//         },
//         transaction
//       });

//       // Function to insert a leave type
//       const insertLeave = async (type, desc, opening, taken, availed, closing) => {
//         await employeeLeaveRecord.create({
//           BranchCode: branchCode,
//           EmpCode: row.EmpCode,
//           MonthNo: monthNo,
//           Months: month,
//           Years: year,
//           LeaveOpeningDate: leaveOpeningDate,
//           LeaveType: type,
//           LeaveDescription: desc,
//           OpeningBalance: opening,
//           LeaveTaken: taken,
//           AvailedLeave: availed,
//           ClosingBalance: closing
//         }, { transaction });
//       };

//       // Insert EL
//       await insertLeave("EL", "Earned Leave", row.O_EL, row.T_EL, row.E_EL, row.C_EL);

//       // Insert CL
//       await insertLeave("CL", "Casual Leave", row.O_CL, row.T_CL, row.E_CL, row.C_CL);

//       // Insert SL
//       await insertLeave("SL", "Sick Leave", row.O_SL, row.T_SL, row.E_SL, row.C_SL);
//     }

//     await transaction.commit();
//     return { success: true, message: "Leave records saved successfully" };

//   } catch (error) {
//     await transaction.rollback();
//     throw error;
//   }
// };


const postEmployeeLeaveRecord = async (data) => {
  const { month, year, leaveData, branchCode } = data;

  const IntMonth = parseInt(month); 
  const OpeningDate = new Date(year, IntMonth - 1, 1); 

  const t = await employeeLeaveRecord.sequelize.transaction();

  try {
    for (const row of leaveData) {
      const EmpCode = row.EmpCode;
      if (!EmpCode || !branchCode) continue;

   
      await employeeLeaveRecord.destroy({
        where: {
          EmpCode,
          Months: month.toString(), 
          Years: year.toString()
        },
        transaction: t,
      });

 
      await employeeLeaveRecord.create({
        BranchCode: branchCode,
        EmpCode,
        MonthNo: IntMonth,
        Months: month.toString(),
        Years: year.toString(),
        LeaveOpeningDate: OpeningDate,
        LeaveType: 'EL',
        LeaveDescription: 'Earned Leave',
        OpeningBalance: row.O_EL || 0,
        LeaveTaken: row.T_EL || 0,
        AvailedLeave: row.E_EL || 0,
        ClosingBalance: row.C_EL || 0,
      }, { transaction: t });

 
      await employeeLeaveRecord.create({
        BranchCode: branchCode,
        EmpCode,
        MonthNo: IntMonth,
        Months: month.toString(),
        Years: year.toString(),
        LeaveOpeningDate: OpeningDate,
        LeaveType: 'CL',
        LeaveDescription: 'Casual Leave',
        OpeningBalance: row.O_CL || 0,
        LeaveTaken: row.T_CL || 0,
        AvailedLeave: row.E_CL || 0,
        ClosingBalance: row.C_CL || 0,
      }, { transaction: t });

      if (row.O_SL !== undefined) {
        await employeeLeaveRecord.create({
          BranchCode: branchCode,
          EmpCode,
          MonthNo: IntMonth,
          Months: month.toString(),
          Years: year.toString(),
          LeaveOpeningDate: OpeningDate,
          LeaveType: 'SL',
          LeaveDescription: 'Sick Leave',
          OpeningBalance: row.O_SL || 0,
          LeaveTaken: row.T_SL || 0,
          AvailedLeave: row.E_SL || 0,
          ClosingBalance: row.C_SL || 0,
        }, { transaction: t });
      }
    }

    await t.commit();
    return true;
  } catch (error) {
    await t.rollback();
    console.error(error);
    throw new Error("Failed to save leave records: " + error.message);
    // res.status(500).json({ error: 'Failed to save leave records.' });
  }
};




// const postEmployeeLeaveReacord = async ({ month, year, details }) => {
//   if (!month || !year) throw new Error("Month and Year are required");

//   const currentMonth = new Date().getMonth() + 1;
//   const monthNo = currentMonth === 1 ? 12 : currentMonth - 1;
//   const leaveOpeningDate = `01/${month}/${year}`;

//   const transaction = await element.transaction();

//   try {
//     for (const row of details) {
//       if (!row.EmpCode) throw new Error("Employee Code is required");

//       await employeeLeaveRecord.destroy({
//         where: {
//           EmpCode: row.EmpCode,
//           Months: month,
//           Years: year
//         },
//         transaction
//       });

//       const insertLeave = async (type, desc, opening, taken, availed, closing) => {
//         await employeeLeaveRecord.create({
//           BranchCode: row.BranchCode,
//           EmpCode: row.EmpCode,
//           MonthNo: monthNo,
//           Months: month,
//           Years: year,
//           LeaveOpeningDate: leaveOpeningDate,
//           LeaveType: type,
//           LeaveDescription: desc,
//           OpeningBalance: opening,
//           LeaveTaken: taken,
//           AvailedLeave: availed,
//           ClosingBalance: closing
//         }, { transaction });
//       };

//       await insertLeave('EL', 'Earned Leave', row.EL_Opening, row.EL_Taken, row.EL_Availed, row.EL_Closing);
//       await insertLeave('CL', 'Casual Leave', row.CL_Opening, row.CL_Taken, row.CL_Availed, row.CL_Closing);

//       if (row.SL_Opening !== undefined) {
//         await insertLeave('SL', 'Sick Leave', row.SL_Opening, row.SL_Taken, row.SL_Availed, row.SL_Closing);
//       }
//     }

//     await transaction.commit();
//     return { success: true, message: 'Leave records saved successfully' };
//   } catch (error) {
//     await transaction.rollback();
//     throw error;
//   }
// };

const getEmployeeLeaveRecordService = async ({ branchCode, month, year, page = 1, limit = 10 }) => {
  try {
    const offset = (page - 1) * limit;

  
    const allRecords = await employeeLeaveRecord.findAll({
      where: {
        BranchCode: branchCode,
        MonthNo: month,
        Years: year
      },
      raw: true
    });

    if (!allRecords.length) {
      return { data: [], totalPages: 0, currentPage: page, totalRecords: 0 };
    }


    const branchInfo = await BranchMaster.findOne({
      where: { Code: branchCode },
      attributes: ['Code', 'Name'],
      raw: true
    });

    const employeeMap = {};

    for (const record of allRecords) {
      const empCode = record.EmpCode;
      const leaveType = record.LeaveType?.toUpperCase?.() || '';

      if (!employeeMap[empCode]) {
        employeeMap[empCode] = {
          EmpCode: empCode,
          EmpName: '',
          BranchCode: record.BranchCode,
          BranchName: branchInfo?.Name || '',
          CL_Opening: 0, CL_Current: 0, CL_Taken: 0, CL_Closing: 0,
          SL_Opening: 0, SL_Current: 0, SL_Taken: 0, SL_Closing: 0,
          EL_Opening: 0, EL_Current: 0, EL_Taken: 0, EL_Closing: 0
        };
      }

      const emp = employeeMap[empCode];

      // ✅ Assign data directly from DB (no recalculation)
      if (leaveType === 'CL') {
        console.log("record", record)
        emp.CL_Opening = parseFloat(record.OpeningBalance || 0);
        emp.CL_Current = parseFloat(record.AvailedLeave || 0);
        emp.CL_Taken = parseFloat(record.LeaveTaken || 0);
        emp.CL_Closing = parseFloat(record.ClosingBalance || 0);
      } else if (leaveType === 'SL') {
        emp.SL_Opening = parseFloat(record.OpeningBalance || 0);
        emp.SL_Current = parseFloat(record.AvailedLeave || 0);
        emp.SL_Taken = parseFloat(record.LeaveTaken || 0);
        emp.SL_Closing = parseFloat(record.ClosingBalance || 0);
      } else if (leaveType === 'EL') {
        emp.EL_Opening = parseFloat(record.OpeningBalance || 0);
        emp.EL_Current = parseFloat(record.AvailedLeave || 0);
        emp.EL_Taken = parseFloat(record.LeaveTaken || 0);
        emp.EL_Closing = parseFloat(record.ClosingBalance || 0);
      }
    }

    const allEmployees = Object.values(employeeMap);

    // 🧾 Pagination
    const paginatedEmployees = allEmployees.slice(offset, offset + limit);

    // 🧩 Fetch Employee Names
    const empCodes = paginatedEmployees.map(e => e.EmpCode);
    const empNames = await Employee.findAll({
      where: { EmpID: empCodes },
      attributes: ['EmpID', 'Name'],
      raw: true
    });

    for (const emp of empNames) {
      const match = paginatedEmployees.find(e => e.EmpCode === emp.EmpID);
      if (match) match.EmpName = emp.Name;
    }

    // ✅ Add total summary ONLY for response
    const responseData = paginatedEmployees.map(emp => ({
      ...emp,
      Total_Opening: emp.CL_Opening + emp.SL_Opening + emp.EL_Opening,
      Total_Current: emp.CL_Current + emp.SL_Current + emp.EL_Current,
      Total_Taken: emp.CL_Taken + emp.SL_Taken + emp.EL_Taken,
      Total_Closing: emp.CL_Closing + emp.SL_Closing + emp.EL_Closing
    }));

    // ✅ Final paginated response
    return {
      data: responseData,
      totalPages: Math.ceil(allEmployees.length / limit),
      currentPage: page,
      totalRecords: allEmployees.length
    };

  } catch (error) {
    console.error('Error in getEmployeeLeaveRecordService:', error);
    throw error;
  }
};






// calculate attendance
const calculateAttendanceService = async ({ fromDate, toDate, months, years, branchCode, branchName }) => {
  try {
    const result = await element.query(
      `EXEC PROC_CalculateAttendance 
        @FromDate = :fromDate, 
        @ToDate = :toDate, 
        @Months = :months, 
        @Years = :years, 
        @BranchCode = :branchCode, 
        @BranchName = :branchName`,
      {
        replacements: {
          fromDate,
          toDate,
          months,
          years,
          branchCode,
          branchName
        },
        type: element.QueryTypes.SELECT
      }
    );

    return result;
  } catch (error) {
    console.error("Error in calculateAttendanceService:", error);
    throw error;
  }
};


// get current dat attendance
// const calculateAttendanceDaysService = async (branchCode, month, year, employeeType) => {
//      console.log(branchCode, month, year, employeeType)
//   try {
//     const result = await element.query(
//       `EXEC proc_calculateAttendenceDays :branchCode, :month, :year, :employeeType`,
//       {
//         replacements: {
//           branchCode,
//           month,
//           year,
//           employeeType
//         },
//         type: element.QueryTypes.SELECT
//       }
//     );

//     return result;
//   } catch (error) {

//   throw new Error('Error while fetching attendance: ' + error.message);

//   }
// };
const calculateAttendanceDaysService = async (branchCode, month, year) => {
  console.log(branchCode, month, year);
  try {
    const result = await element.query(
      `EXEC Proc_CalculateAttendenceDays_Portal :branchCode, :month, :year`,
      {
        replacements: {
          branchCode,
          month,
          year
        },
        type: element.QueryTypes.SELECT
      }
    );

    return result;
  } catch (error) {
    throw new Error('Error while fetching attendance: ' + error.message);
  }
};

const getLeaveService = async (filterdata) => {
  const { LeaveYear, BranchCode, CompanyCode } = filterdata;

  try {
    const where = {};
    if (LeaveYear && BranchCode && CompanyCode) {
      where.LeaveYear = LeaveYear;
      where.BranchCode = BranchCode;
      where.CompanyCode = CompanyCode;
    }

    const result = await EmployeeLeaveControl.findAll({ where });
    return result;
  } catch (err) {
    throw new Error("Server Error: " + err.message);
    // res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

const saveLeaveService = async (data) => {
  const { records, LeaveYear, BranchCode, CompanyCode, isEdit } = data;

  const t = await EmployeeLeaveControl.sequelize.transaction();
  try {
    if (isEdit) {
      await EmployeeLeaveControl.destroy({
        where: { LeaveYear, BranchCode, CompanyCode },
        transaction: t
      });
    }

    for (const record of records) {
      await EmployeeLeaveControl.create({ ...record, LeaveYear, BranchCode, CompanyCode }, { transaction: t });
    }

    await t.commit();
    return true

  } catch (err) {
    await t.rollback();
    throw new Error("Save failed: " + err.message);

  }
};

const addLeaveService = async (data) => {
  console.log(data)
  try {
    return await EmployeeLeaveControl.create(data);
  } catch (error) {
    throw new Error(`Add Error: ${error.message}`);
  }
};

const updateLeaveService = async (id, data) => {
  try {
    const [updated] = await EmployeeLeaveControl.update(data, {
      where: { LeaveID: id },
    });
    return updated;
  } catch (error) {
    throw new Error(`Update Error: ${error.message}`);
  }
};

const deleteLeaveService = async (id) => {
  try {
    return await EmployeeLeaveControl.destroy({
      where: { LeaveID: id },
    });
  } catch (error) {
    throw new Error(`Delete Error: ${error.message}`);
  }
};

const updateAttendanceDaysRepo = async ({ attendenceCode, employeeCode, presentDays, salaryDays }) => {
  try {
    // Find record by AttendenceCode + EmployeeCode
    const record = await AttendenceDetail.findOne({
      where: {
        AttendenceCode: attendenceCode,
        EmployeeCode: employeeCode,
      },
    });

    if (!record) {
      return { success: false, message: "Record not found" };
    }

    // Update PresentDays & SalaryDays
    record.PresentDays = presentDays;
    record.SalaryDays = salaryDays;

    await record.save();

    return { success: true, data: record };
  } catch (error) {
    console.error("Error in updateAttendanceDays:", error);
    throw error;
  }
};


const getDailyAttendanceNewRepo = async (branchCode, month, year, page = 1, limit = 10) => {
  const offset = (page - 1) * limit;

  // ✅ Step 1: Count total records (before pagination)
  const totalCount = await DailyAttendanceEntryActual.count({
    where: {
      BranchCode: branchCode,
      AttendanceMonth: month,
      AttendanceYear: year
    },
    distinct: true,
    col: 'EmployeeCode'
  });

  // ✅ Step 2: Aggregate attendance counts by employee and status (with pagination)
  const attendance = await DailyAttendanceEntryActual.findAll({
    where: {
      BranchCode: branchCode,
      AttendanceMonth: month,
      AttendanceYear: year
    },
    attributes: [
      'EmployeeCode',
      'EmployeeName',
      'Remarks',
      'BranchName',
      'BranchCode',
      [Sequelize.fn('SUM', Sequelize.literal(`CASE WHEN PresentStatus='P' THEN 1 ELSE 0 END`)), 'PresentDays'],
      [Sequelize.fn('SUM', Sequelize.literal(`CASE WHEN PresentStatus='A' THEN 1 ELSE 0 END`)), 'LWP'],
      [Sequelize.fn('SUM', Sequelize.literal(`CASE WHEN PresentStatus='EL' THEN 1 ELSE 0 END`)), 'EL'],
      [Sequelize.fn('SUM', Sequelize.literal(`CASE WHEN PresentStatus='CL' THEN 1 ELSE 0 END`)), 'CL'],
      [Sequelize.fn('SUM', Sequelize.literal(`CASE WHEN PresentStatus='SL' THEN 1 ELSE 0 END`)), 'SL'],
      [Sequelize.fn('SUM', Sequelize.literal(`CASE WHEN PresentStatus='HD' THEN 1 ELSE 0 END`)), 'Holidays'],
      [Sequelize.fn('SUM', Sequelize.literal(`CASE WHEN PresentStatus='WO' THEN 1 ELSE 0 END`)), 'WeeklyOff'],
      [Sequelize.fn('COUNT', Sequelize.col('AttendanceDate')), 'TotalDays']
    ],
    group: ['EmployeeCode', 'EmployeeName', 'BranchCode', 'BranchName', 'Remarks'],
    order: [['EmployeeName', 'ASC']],
    offset,
    limit,
    raw: true
  });

  // ✅ Step 3: Fetch extra employee info (Designation, Department)
  const employees = await Employee.findAll({
    where: { EmpID: { [Op.in]: attendance.map(a => a.EmployeeCode) } },
    attributes: ['EmpID', 'Designation', 'Department'],
    raw: true
  });

  const empMap = {};
  employees.forEach(e => (empMap[e.EmpID] = e));

  // ✅ Step 4: Merge and compute derived values
  const result = attendance.map(a => {
    const emp = empMap[a.EmployeeCode] || {};
    const totalLeave = Number(a.EL) + Number(a.CL) + Number(a.SL);
    const salaryDays = Number(a.PresentDays) + totalLeave + Number(a.Holidays) + Number(a.WeeklyOff);

    return {
      EmployeeCode: a.EmployeeCode,
      EmployeeName: a.EmployeeName,
      Designation: emp.Designation || null,
      Department: emp.Department || null,
      AttendanceMonth: month,
      AttendanceYear: year,
      PresentDays: Number(a.PresentDays),
      LWP: Number(a.LWP),
      EL: Number(a.EL),
      CL: Number(a.CL),
      SL: Number(a.SL),
      TotalLeave: totalLeave,
      Holidays: Number(a.Holidays),
      WeeklyOff: Number(a.WeeklyOff),
      SalaryDays: salaryDays,
      TotalDays: Number(a.TotalDays),
      BranchCode: a.BranchCode,
      BranchName: a.BranchName,
      Remarks: a.Remarks || '',
    };
  });

  // ✅ Step 5: Return with pagination metadata
  return {
    data: result,
    pagination: {
      totalRecords: totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      limit,
    },
  };
};




const callCalculateAttendanceByProcedure = async (fromDate, toDate, month, year, branchCode, branchName) => {
  try {
    // Execute stored procedure using Sequelize's query method
    const result = await element.query(
      `EXEC PROC_CalculateAttendance 
        @FromDate = :fromDate,
        @ToDate = :toDate,
        @Months = :month,
        @Years = :year,
        @BranchCode = :branchCode,
        @BranchName = :branchName`,
      {
        replacements: { fromDate, toDate, month, year, branchCode, branchName },
        type: element.QueryTypes.SELECT
      }
    );

    return result; // this is an array of rows returned from procedure
  } catch (error) {
    console.error('Error calling PROC_CalculateAttendance:', error);
    throw error;
  }
};

// calculateattendancenewrepo
// const calculateAttendanceNewRepo= async (fromDate, toDate, month, year, branchCode, branchName) => {

//     // 1. Delete old attendance
//     await DailyAttendanceEntryActual.destroy({
//         where: { BranchCode: branchCode, AttendanceMonth: month, AttendanceYear: year }
//     });

//     // 2. Get employees
//     const employees = await EmployeeMaster.findAll({
//         where: {
//             BranchCode: branchCode,
//             IsBilled: 1,
//             [Op.or]: [
//                 { hasLeft: 0 },
//                 { hasLeft: 1, LeftDate: { [Op.between]: [fromDate, toDate] } }
//             ]
//         }
//     });

//     // 3. Get portal attendance
//     const attendanceRaw = await DailyAttendanceEntryPortal.findAll({
//         where: {
//             BranchCode: branchCode,
//             AttendanceDate: { [Op.between]: [fromDate, toDate] }
//         }
//     });

//     // 4. Get approved leaves
//     const leaves = await EmployeeLeaveAvailed.findAll({
//         include: [{
//             model: EmployeeLeaveApplication,
//             as: 'application',
//             where: { Status: 'Approve', EmployeeCode: { [Op.in]: employees.map(e => e.EmpID) } }
//         }]
//     });

//     // 5. Get OD
//     const ods = await AttendenceOD.findAll({
//         where: {
//             IsApproved: 1,
//             EmployeeCode: { [Op.in]: employees.map(e => e.EmpID) },
//             [Op.or]: [
//                 { ODFromDate: { [Op.between]: [fromDate, toDate] } },
//                 { ODToDate: { [Op.between]: [fromDate, toDate] } }
//             ]
//         }
//     });

//     // 6. Get holidays
//     const holidays = await HolidayMaster.findAll({
//         where: {
//             BranchCode: branchCode,
//             HolidayDate: { [Op.between]: [fromDate, toDate] }
//         }
//     });

//     // 7. Build daily attendance
//     const attendanceFinal = [];

//     for (const emp of employees) {
//         let currentDate = new Date(fromDate);
//         while (currentDate <= new Date(toDate)) {
//             const dateStr = currentDate.toISOString().split('T')[0];
//             const day = currentDate.getDay(); // 0 = Sunday
//             const isWeeklyOff = day === 0;
//             const isHoliday = holidays.some(h => h.HolidayDate.toISOString().split('T')[0] === dateStr);

//             const leave = leaves.find(l =>
//                 emp.EmpID === l.EmployeeCode &&
//                 new Date(l.SanctionedFrom) <= currentDate &&
//                 new Date(l.SanctionedTo) >= currentDate
//             );

//             const od = ods.find(o =>
//                 emp.EmpID === o.EmployeeCode &&
//                 new Date(o.ODFromDate) <= currentDate &&
//                 new Date(o.ODToDate) >= currentDate
//             );

//             const att = attendanceRaw.find(a =>
//                 emp.EmpID === a.EmployeeCode &&
//                 new Date(a.AttendanceDate).toISOString().split('T')[0] === dateStr
//             );

//             let status = 'A';
//             let remarks = '';
//             let inTime = null;
//             let outTime = null;

//             if (isWeeklyOff) { status = 'WO'; remarks = 'Weekly Off'; }
//             else if (isHoliday) { status = 'HD'; remarks = 'Holiday'; }
//             else if (leave) { status = leave.LeaveType; remarks = 'On Leave'; }
//             else if (od) { status = 'P'; remarks = 'On Duty'; }
//             else if (att) { status = 'P'; remarks = 'Present'; inTime = att.InTime; outTime = att.OutTime; }

//             attendanceFinal.push({
//                 BranchCode: branchCode,
//                 BranchName: branchName,
//                 EmployeeCode: emp.EmpID,
//                 EmployeeName: emp.Name,
//                 AttendanceMonth: month,
//                 AttendanceYear: year,
//                 AttendanceDate: currentDate,
//                 InTime: inTime,
//                 OutTime: outTime,
//                 AttStatus: status,
//                 Remarks: remarks
//             });

//             currentDate.setDate(currentDate.getDate() + 1);
//         }
//     }

//     // 8. Insert into DailyAttendanceEntryActual
//     await DailyAttendanceEntryActual.bulkCreate(attendanceFinal);

//     return attendanceFinal;
// };

// const calculateAttendanceNewRepo = async (fromDate, toDate, month, year, branchCode, branchName) => {
//     const transaction = await element.transaction();

//     try {
//         // 1. Delete old attendance
//         await DailyAttendanceEntryActual.destroy({
//             where: { BranchCode: branchCode, AttendanceMonth: month, AttendanceYear: year },
//             transaction
//         });

//         // 2. Get employees
//         let employees = await Employee.findAll({
//             where: {
//                 BranchCode: branchCode,
//                 IsBilled: 1,
//                 [Op.or]: [
//                     { hasLeft: 0 },
//                     { hasLeft: 1, LeftDate: { [Op.between]: [fromDate, toDate] } }
//                 ]
//             },
//             transaction
//         });

//         employees.length =1


//         // 3. Get portal attendance
//         const attendanceRaw = await DailyAttendanceEntryPortal.findAll({
//             where: {
//                 BranchCode: branchCode,
//                 AttendanceDate: { [Op.between]: [fromDate, toDate] }
//             },
//             transaction
//         });

//         // 4. Get approved leaves
//         const leaves = await EmployeeLeaveAvailedAssociate.findAll({
//             include: [{
//                 model: EmployeeLeaveAssociate,
//                 as: 'application',
//                 where: { IsApproved: 1, EmployeeCode: { [Op.in]: employees.map(e => e.EmpID) } }
//             }],
//             transaction
//         });



//         // 5. Get OD
//         const ods = await AttendenceOD.findAll({
//             where: {
//                 IsApproved: 1,
//                 EmployeeCode: { [Op.in]: employees.map(e => e.EmpID) },
//                 [Op.or]: [
//                     { ODFromDate: { [Op.between]: [fromDate, toDate] } },
//                     { ODToDate: { [Op.between]: [fromDate, toDate] } }
//                 ]
//             },
//             transaction
//         });



//         // 6. Get holidays
//         const holidays = await HolidayMaster.findAll({
//             where: {
//                 BranchCode: branchCode,
//                 HolidayDate: { [Op.between]: [fromDate, toDate] }
//             },
//             transaction
//         });

//         // return attendanceRaw

//         // 7. Build daily attendance
//         const attendanceFinal = [];

//         for (const emp of employees) {
//             let currentDate = new Date(fromDate);

//             while (currentDate <= new Date(toDate)) {
//                 const dateStr = currentDate.toISOString().split('T')[0];
//                 //  console.log("dateStr",dateStr)
//                 const day = currentDate.getDay();
//                 const isWeeklyOff = day === 0;
//                 const isHoliday = holidays.some(h => h.HolidayDate.toISOString().split('T')[0] === dateStr);

//                 const leave = leaves.find(l =>
//                     emp.EmpID === l.EmployeeCode &&
//                     new Date(l.SanctionedFrom) <= currentDate &&
//                     new Date(l.SanctionedTo) >= currentDate
//                 );

//                 const od = ods.find(o =>
//                     emp.EmpID === o.EmployeeCode &&
//                     new Date(o.ODFromDate) <= currentDate &&
//                     new Date(o.ODToDate) >= currentDate
//                 );

//                 const att = attendanceRaw.find(a =>
//                     emp.EmpID === a.EmployeeCode &&
//                     new Date(a.AttendanceDate).toISOString().split('T')[0] === dateStr
//                 );

//                 // console.log('att',att)

//                 let status = 'A';
//                 let remarks = '';
//                 let inTime = null;
//                 let outTime = null;

//                 if (isWeeklyOff) { status = 'WO'; remarks = 'Weekly Off'; }
//                 else if (isHoliday) { status = 'HD'; remarks = 'Holiday'; }
//                 else if (leave) { status = leave.LeaveType; remarks = 'On Leave'; }
//                 else if (od) { status = 'P'; remarks = 'On Duty'; }
//                 else if (att) { status = 'P'; remarks = 'Present'; inTime = att.InTime; outTime = att.OutTime; }

//                 attendanceFinal.push({
//                     BranchCode: branchCode,
//                     BranchName: branchName,
//                     EmployeeCode: emp.EmpID,
//                     EmployeeName: emp.Name,
//                     AttendanceMonth: month,
//                     AttendanceYear: year,
//                     AttendanceDate: currentDate,
//                     InTime: inTime,
//                     OutTime: outTime,
//                     AttStatus: status,
//                     Remarks: remarks
//                 });

//                 currentDate.setDate(currentDate.getDate() + 1);
//             }
//         }


//         return attendanceFinal

//         // 8. Insert into DailyAttendanceEntryActual
//         await DailyAttendanceEntryActual.bulkCreate(attendanceFinal, { transaction });

//         // Commit transaction if everything succeeds
//         await transaction.commit();

//         return attendanceFinal;

//     } catch (error) {
//         // Rollback transaction on any error
//         await transaction.rollback();
//         throw error; // Re-throw to let caller handle it
//     }
// };

// const calculateAttendanceNewRepo = async (fromDate, toDate, month, year, branchCode, branchName) => {
//     const transaction = await element.transaction();

//     try {
//         // 1. Delete old attendance
//         await DailyAttendanceEntryActual.destroy({
//             where: { BranchCode: branchCode, AttendanceMonth: month, AttendanceYear: year },
//             transaction
//         });

//         // 2. Get employees
//         let employees = await Employee.findAll({
//             where: {
//                 BranchCode: branchCode,
//                 IsBilled: 1,
//                 [Op.or]: [
//                     { hasLeft: 0 },
//                     { hasLeft: 1, LeftDate: { [Op.between]: [fromDate, toDate] } }
//                 ]
//             },
//             attributes: ['EmpID', 'Name', 'Designation', 'Department', 'BranchCode'],
//             transaction
//         });

//         // 3. Get portal attendance
//         const attendanceRaw = await DailyAttendanceEntryPortal.findAll({
//             where: {
//                 BranchCode: branchCode,
//                 AttendanceDate: { [Op.between]: [fromDate, toDate] }
//             },
//             transaction
//         });

//           return attendanceRaw
//         // 4. Get approved leaves
//         const leaves = await EmployeeLeaveAvailedAssociate.findAll({
//             include: [{
//                 model: EmployeeLeaveAssociate,
//                 as: 'application',
//                 where: { 
//                     IsApproved: 1, 
//                     EmployeeCode: { [Op.in]: employees.map(e => e.EmpID) } 
//                 }
//             }],
//             transaction
//         });

//         // 5. Get OD (On Duty)
//         const ods = await AttendenceOD.findAll({
//             where: {
//                 IsApproved: 1,
//                 EmployeeCode: { [Op.in]: employees.map(e => e.EmpID) },
//                 [Op.or]: [
//                     { ODFromDate: { [Op.between]: [fromDate, toDate] } },
//                     { ODToDate: { [Op.between]: [fromDate, toDate] } }
//                 ]
//             },
//             transaction
//         });

//         // 6. Get holidays
//         const holidays = await HolidayMaster.findAll({
//             where: {
//                 BranchCode: branchCode,
//                 HolidayDate: { [Op.between]: [fromDate, toDate] }
//             },
//             transaction
//         });

//         // 7. Build daily attendance
//         const attendanceFinal = [];

//         for (const emp of employees) {
//             let currentDate = new Date(fromDate);

//             while (currentDate <= new Date(toDate)) {
//                 const dateStr = currentDate.toISOString().split('T')[0];
//                 const day = currentDate.getDay();
//                 const isWeeklyOff = day === 0; // Sunday
//                 const isHoliday = holidays.some(h => 
//                     h.HolidayDate.toISOString().split('T')[0] === dateStr
//                 );

//                 // Find leave for current date
//                 const leave = leaves.find(l =>
//                     l.application.EmployeeCode === emp.EmpID &&
//                     new Date(l.SanctionedFrom) <= currentDate &&
//                     new Date(l.SanctionedTo) >= currentDate
//                 );

//                 // Find OD for current date
//                 const od = ods.find(o =>
//                     o.EmployeeCode === emp.EmpID &&
//                     new Date(o.ODFromDate) <= currentDate &&
//                     new Date(o.ODToDate) >= currentDate
//                 );

//                 // FIXED: Added return statement in find()
//                 const att = attendanceRaw.find(a =>
//                     a.EmployeeCode === emp.EmpID &&
//                     new Date(a.AttendanceDate).toISOString().split('T')[0] === dateStr
//                 );

//                 let status = 'A'; // Absent
//                 let remarks = 'Absent';
//                 let inTime = null;
//                 let outTime = null;

//                 // Priority order: Weekly Off > Holiday > Leave > (OD with Present) > Present > OD > Absent
//                 if (isWeeklyOff) {
//                     status = 'S';
//                     remarks = 'Weekly Off';
//                 } else if (isHoliday) {
//                     status = 'H';
//                     remarks = 'Holiday';
//                 } else if (leave) {
//                     // Map leave types to match procedure codes
//                     status = leave.LeaveType; // Should be CL, SL, EL, RH, LWP, etc.
//                     remarks = `On Leave (${leave.LeaveType})`;
//                 } else if (att) {
//                     // If attendance exists, capture InTime and OutTime
//                     status = att.AttStatus || 'P'; // Present or Half Day
//                     remarks = status === 'HD' ? 'Half Day' : 'Present';
//                     inTime = att.InTime;
//                     outTime = att.OutTime;

//                     // If OD exists and attendance is marked, still show as Present with times
//                     if (od) {
//                         remarks = 'Present (On Duty)';
//                     }
//                 } else if (od) {
//                     // OD without attendance marking
//                     status = 'T'; // Tour/On Duty
//                     remarks = 'On Duty';
//                 }

//                 attendanceFinal.push({
//                     BranchCode: branchCode,
//                     BranchName: branchName,
//                     EmployeeCode: emp.EmpID,
//                     EmployeeName: emp.Name,
//                     Designation: emp.Designation || '',
//                     Department: emp.Department || '',
//                     AttendanceMonth: month,
//                     AttendanceYear: year,
//                     AttendanceDate: currentDate,
//                     InTime: inTime,
//                     OutTime: outTime,
//                     AttStatus: status,
//                     Remarks: remarks
//                 });

//                 currentDate.setDate(currentDate.getDate() + 1);
//             }
//         }

//           return attendanceFinal
//         // 8. Insert into DailyAttendanceEntryActual
//         await DailyAttendanceEntryActual.bulkCreate(attendanceFinal, { transaction });

//         // 9. Calculate monthly summary (similar to stored procedure output)
//         const monthlySummary = calculateMonthlySummary(attendanceFinal);

//         // Commit transaction if everything succeeds
//         await transaction.commit();

//         return {
//             dailyRecords: attendanceFinal,
//             monthlySummary: monthlySummary
//         };

//     } catch (error) {
//         // Rollback transaction on any error
//         await transaction.rollback();
//         console.error('Error in calculateAttendanceNewRepo:', error);
//         throw error;
//     }
// };

//Helper function to calculate monthly summary like the stored procedure
// const calculateMonthlySummary = (attendanceRecords) => {
//     const summary = {};

//     attendanceRecords.forEach(record => {
//         const empKey = record.EmployeeCode;

//         if (!summary[empKey]) {
//             summary[empKey] = {
//                 BranchCode: record.BranchCode,
//                 BranchName: record.BranchName,
//                 EmployeeCode: record.EmployeeCode,
//                 EmployeeName: record.EmployeeName,
//                 Designation: record.Designation,
//                 Department: record.Department,
//                 PresentDays: 0,
//                 HalfDay: 0,
//                 LWP: 0,
//                 CL: 0,
//                 SL: 0,
//                 EL: 0,
//                 RH: 0,
//                 L: 0, // Generic Leave
//                 T: 0, // Tour/OD
//                 TotalLeave: 0,
//                 WeeklyOff: 0,
//                 Holidays: 0,
//                 Absent: 0,
//                 SalaryDays: 0
//             };
//         }

//         const status = record.AttStatus;

//         switch(status) {
//             case 'P':
//                 summary[empKey].PresentDays += 1;
//                 break;
//             case 'HD':
//                 summary[empKey].HalfDay += 1;
//                 break;
//             case 'CL':
//                 summary[empKey].CL += 1;
//                 break;
//             case 'SL':
//                 summary[empKey].SL += 1;
//                 break;
//             case 'EL':
//                 summary[empKey].EL += 1;
//                 break;
//             case 'RH':
//                 summary[empKey].RH += 1;
//                 break;
//             case 'LWP':
//             case 'WPL':
//                 summary[empKey].LWP += 1;
//                 break;
//             case 'L':
//                 summary[empKey].L += 1;
//                 break;
//             case 'T':
//                 summary[empKey].T += 1;
//                 break;
//             case 'S':
//                 summary[empKey].WeeklyOff += 1;
//                 break;
//             case 'H':
//                 summary[empKey].Holidays += 1;
//                 break;
//             case 'A':
//                 summary[empKey].Absent += 1;
//                 break;
//         }
//     });

//     // Calculate totals (matching stored procedure logic)
//     Object.keys(summary).forEach(empKey => {
//         const emp = summary[empKey];

//         // Handle half days: half goes to present, half goes to CL
//         const halfDayAdjustment = Math.round((emp.HalfDay / 2) * 100) / 100;
//         emp.PresentDays += halfDayAdjustment;
//         emp.CL += halfDayAdjustment;

//         // Present days includes Tour/OD
//         emp.PresentDays += emp.T;

//         // Total Leave
//         emp.TotalLeave = emp.CL + emp.SL + emp.EL + emp.RH + emp.L;

//         // Salary Days = Present + All Leaves + Weekly Off + Holidays + Half Days
//         emp.SalaryDays = emp.PresentDays + emp.TotalLeave + emp.WeeklyOff + emp.Holidays;

//         // Round to 2 decimal places
//         emp.PresentDays = Math.round(emp.PresentDays * 100) / 100;
//         emp.CL = Math.round(emp.CL * 100) / 100;
//         emp.SL = Math.round(emp.SL * 100) / 100;
//         emp.EL = Math.round(emp.EL * 100) / 100;
//         emp.TotalLeave = Math.round(emp.TotalLeave * 100) / 100;
//         emp.SalaryDays = Math.round(emp.SalaryDays * 100) / 100;
//     });

//     return Object.values(summary);
// };


// insert bulk attendance new
const insertAttendanceMaster = async (masterData) => {
  return await AttendenceMaster.create(masterData);
};

const insertAttendanceDetail = async (detailData) => {
  return await AttendenceDetail.create(detailData);
};
const checkAlradyExistAttendence = async (month, year, branchCode) => {
  try {
    const existingRecord = await AttendenceMaster.findOne({
      where: {
        AttendenceMonth: month,
        AttendenceYear: year,
        BranchCode: branchCode
      },
      attributes: ['AttendenceCode']
    });
    return existingRecord;
  } catch (error) {
    throw new Error('Error checking existing attendance: ' + error.message);
  }
};



module.exports = {
  getAllSaveAttendance,
  getAttendenceByCode,
  bulkInsertAttendanceDetail,
  getAttendanceByEmployeeCode,
  getAllDailyAttendance,
  getDailyAttendanceByCode,
  postEmployeeLeaveRecord,
  getEmployeeLeaveRecordService,
  calculateAttendanceService,
  bulkInsertAttendanceByBranchService,
  calculateAttendanceDaysService,
  getLeaveService,
  saveLeaveService,
  addLeaveService,
  updateLeaveService,
  deleteLeaveService,
  updateAttendanceDaysRepo,
  getDailyAttendanceNewRepo,
  callCalculateAttendanceByProcedure,
  insertAttendanceMaster,
  checkAlradyExistAttendence,
  insertAttendanceDetail


} 