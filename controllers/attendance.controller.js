const { element } = require('../config/db');
const {
  getAllSaveAttendance,
  getAttendenceByCode,
  bulkInsertAttendanceDetail,
  getAttendanceByEmployeeCode,
  getAllDailyAttendance,
  getDailyAttendanceByCode,
  getEmployeeLeaveRecordService,
  postEmployeeLeaveRecord,
  calculateAttendanceService,
  bulkInsertAttendanceByBranchService,
  calculateAttendanceDaysService,
  saveLeaveService,
  getLeaveService,
  addLeaveService,
  updateLeaveService,
  deleteLeaveService,
  updateAttendanceDaysRepo,
  getDailyAttendanceNewRepo,
  callCalculateAttendanceByProcedure,
  calculateAttendanceNewRepo,
  

} = require('../repository/attendance.repository');
const { createAttendanceService } = require('../services/attendance.service');
const { getFromAndToDate } = require('../utils/dateHelper');
const { monthNameToNumber } = require('../utils/monthUtils');

const getSavedAttendance = async (req, res) => {
  try {
    // Extract query parameters from request
    const {
      company,
      year,
      month,
      branch,
      page = 1,
      pageSize = 10,
    } = req.query;

    // Pass filters and pagination to service
    const filters = {
      company,
      year,
      month,
      branch,
    };

    const result = await getAllSaveAttendance(filters, parseInt(page), parseInt(pageSize));
    // console.log("result", result)
    res.status(200).json({
      success: true,
      message: "Attendance records fetched successfully.",
      ...result, // contains data, totalRecords, currentPage, totalPages, pageSize
    });
  } catch (error) {
    console.error('Controller Error:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Server Error',
    });
  }
};

// const getAttendenceByAttendenceCode = async (req, res) => {
//   try {
//     // console.log("req.params", req.params)
//     const { attendanceCode } = req.params; // from route param
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;

//     if (!attendanceCode) {
//       return res.status(400).json({ success: false, message: "Attendance code is required" });
//     }

//     const data = await getAttendenceByCode(attendanceCode, page, limit);

//     res.status(200).json({
//       success: true,
//       message: "Attendance data fetched successfully.",
//       data: data,
//     });

//   } catch (error) {
//     console.error("Error fetching attendance by code:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message || "Internal Server Error",
//     });
//   }
// };
const getAttendenceByAttendenceCode = async (req, res) => {
  try {
    // Read attendanceCode from body instead of params
    const { attendanceCode, page = 1, limit = 10 } = req.body;

    if (!attendanceCode) {
      return res.status(400).json({ success: false, message: "Attendance code is required" });
    }

    const data = await getAttendenceByCode(attendanceCode, page, limit);

    res.status(200).json({
      success: true,
      message: "Attendance data fetched successfully.",
      data,
    });
  } catch (error) {
    console.error("Error fetching attendance by code:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
const bulkInsertAttendanceByBranch = async (req, res)=>{
 const bulkData = req.body.bulkAttedanceData;
  const {
    attendenceCode,
    companyCode,
    branchCode,
    year,
    month
  } = req.body.attendanceFilter;

  const createdBy = req.user?.userCode || 'system';

  try {
    const result = await bulkInsertAttendanceByBranchService({
      newMasterData: req.newAttendanceMaster || null,
      attendenceCode,
      bulkData,
      createdBy
    });

     res.status(200).json({
      success: true,
      message: "Attendance insert successfully.",
      data:result, // contains data, totalRecords, currentPage, totalPages, pageSize
    });



  } catch (error) {
    console.error('Error in attendance controller:', error);
    res.status(500).json({ error: 'Failed to upload attendance.' });
  }
}

const bulkInsertAttendanceDetails = async (req, res) => {
  try {

    // console.log("bulkdata", req.body)
    // res.status(200).json({
    //   success: true,
    //   message: "bulk insert found"
    // });

    const data = req.body;

    // const uniqueBranchCodes = new Set();

    for (const attendance of data) {
      if (attendance.branchCode) {
        uniqueBranchCodes.add(attendance.branchCode);
      }
    }

    const result = await checkAttendenceExist(uniqueBranchCodes);


    // {
    //  if (!Array.isArray(req.body) || req.body.length === 0) {
    //   return res.status(400).json({ message: 'Invalid or empty array data.' });
    // }
    const allAttendence = await bulkInsertAttendanceDetail(req.body);

    if (allAttendence.length > 0) {
      res.status(200).json({
        success: true,
        message: "All attendence insert successfully ",
        data: allAttendence
      });
    } else {
      res.status(400).json({
        success: false,
        message: "No Attendence Found !"
      });
    }
  } catch (error) {
    console.error("Error retrieving branches:", error);
    res.status(500).json({
      success: false,
      message: "Failed to insert attendence",
      error: error.message
    });
  }
};



const getAttendanceByEmployeeCodeC = async (req, res) => {
  const { employeeCode } = req.params;

  try {
    const attendance = await getAttendanceByEmployeeCode(employeeCode);

    if (!attendance) {
      return res.status(404).json({ message: 'No attendance found for the given EmployeeCode' });
    }

    return res.status(200).json(attendance);
  } catch (error) {
    console.error('Error in attendanceController:', error.message);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

const getAllDailyAttendence = async (req, res) => {
  try {
    // Parse query params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const filters = {
      BranchCode: req.query.BranchCode,
      AttendenceYear: req.query.AttendenceYear,
      AttendenceMonth: req.query.AttendenceMonth
    };

    const result = await getAllDailyAttendance(page, limit, filters);

    return res.status(200).json({
      success: true,
      message: 'Daily attendance records fetched successfully.',
      ...result // includes: data, currentPage, totalRecords, totalPages
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Something went wrong while fetching daily attendance.'
    });
  }
};

const fetchDailyAttendanceByCode = async (req, res) => {
  try {
    const { dailyAttendanceCode, page = 1, limit = 10 } = req.body;

    if (!dailyAttendanceCode) {
      return res.status(400).json({
        success: false,
        message: 'Attendance code is required.'
      });
    }

    const result = await getDailyAttendanceByCode(dailyAttendanceCode, page, limit);

    return res.status(200).json({
      success: true,
      message: 'Attendance records fetched successfully.',
      ...result
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching attendance records.'
    });
  }
};


const insertEmployeeLeaveReacord = async (req, res) => {
  try {
    const result = await postEmployeeLeaveRecord(req.body);
    return  res.status(200).json({ message: 'Leave records saved successfully.', success: true });
    
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getEmployeeLeaveReacordController = async (req, res) => {
    //  console.log("data",req.body )
  const { branchCode, month, year, page, limit } = req.body;
  if (!branchCode || !month || !year) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  try {
    const data = await getEmployeeLeaveRecordService({ branchCode, month, year, page, limit});

    return res.status(200).json({
      success: true,
      count: data.length,
      data
    });
  } catch (err) {
    // console.error('Leave Controller Error:', err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};


const calculateAttendance = async (req, res) => {
  const { months, years, branchCode, branchName } = req.body;
   const monthNumber = monthNameToNumber(months);

    const { fromDate, toDate } = getFromAndToDate(monthNumber, years);
    // console.log("monthNumber", monthNumber)
  try {
    const result = await calculateAttendanceService({
      fromDate,
      toDate,
      months:`${monthNumber}`,
      years,
      branchCode,
      branchName
    });

    return res.status(200).json({
      success: true,
      result,
      noOfResult: result.length || 0
    });
  } catch (err) {
    console.error("Error in calculateAttendance controller:", err);
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};



const calculateAttendanceByEmployee = async (req, res) => {
  try {
    const {
      EmployeeCode = '',
      BranchName = '',
      BranchCode = '',
      Years = '',
      Months = '',
      ToDate = null,
      FromDate = null
    } = req.body;

    // console.log("req", req.body)

    if (!EmployeeCode || !BranchCode || !FromDate || !ToDate) {
      return res.status(400).json({ success: false, error: "Required fields missing" });
    }

    const result = await element.query(
      `EXEC PROC_CalculateAttendancebyEmp 
        @EmployeeCode = :EmployeeCode,
        @BranchName = :BranchName,
        @BranchCode = :BranchCode,
        @Years = :Years,
        @Months = :Months,
        @ToDate = :ToDate,
        @FromDate = :FromDate`,
      {
        replacements: {
          EmployeeCode,
          BranchName,
          BranchCode,
          Years,
          Months,
          ToDate,
          FromDate,
        },
        type: element.QueryTypes.SELECT,
      }
    );

    res.json({ success: true, data: result });

  } catch (error) {
    console.error('Error executing procedure:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};


// get current day attendnace
const calculateAttendanceDaysController = async (req, res) => {
  try {
   const { branchCode, month, year, employeeType } = req.body;
    if (!branchCode || !month || !year || !employeeType) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const result = await calculateAttendanceDaysService(branchCode, month, year, employeeType);
    if (result.length === 0) {
      return res.status(404).json({ success: false, message: "No attendance records found for today" });
    }
    res.status(200).json({
      success: true,
      message: "Today's attendance records fetched successfully.",
      data: result
    });

  } catch (error) {
    console.error("Error in getTodayAttendanceController:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    }); 
  }
};

const getLeaveController = async (req, res) => {
  //  console.log("req.body", req.body )
  const { LeaveYear, BranchCode, CompanyCode } = req.query;
  if (!LeaveYear || !BranchCode || !CompanyCode) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }
  try {
  
    const result = await getLeaveService(req.body);
    if (result.length === 0) {
      return res.status(404).json({ success: false, message: "No leave records found" });
    }
    res.status(200).json({
      success: true,
      message: "Leave records fetched successfully.",
      data: result
    });
  } catch (err) {
    console.error("Error in getLeaveController:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }   
    // res.status(500).json({ message: 'Server Error', error: err.message });
  
};

const saveLeaveController = async (req, res) => {
  const { records, LeaveYear, BranchCode, CompanyCode, isEdit } = req.body
  if (!records || !LeaveYear || !BranchCode || !CompanyCode) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }
  try {
  
    const result = await saveLeaveService(req.body);
    if (result.length === 0) {
      return res.status(404).json({ success: false, message: "No leave records found" });
    }
    res.status(200).json({
      success: true,
      message: "Leave records fetched successfully.",
      data: result
    });
  } catch (err) {
    console.error("Error in getLeaveController:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }   
    // res.status(500).json({ message: 'Server Error', error: err.message });
  
};


const addLeaveController = async (req, res) => {
     console.log("req.body", req.body )
  try {
    const leave = await addLeaveService(req.body);
    res.status(201).json({
      success: true,
      message: 'Leave added successfully.',
      data: leave,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateLeaveController = async (req, res) => {
  try {
    const id = req.params.id;
    const updated = await updateLeaveService(id, req.body);
    if (updated) {
      res.json({ success: true, message: 'Leave updated successfully.' });
    } else {
      res.status(404).json({ success: false, message: 'Leave not found.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteLeaveController = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await deleteLeaveService(id);
    if (deleted) {
      res.json({ success: true, message: 'Leave deleted successfully.' });
    } else {
      res.status(404).json({ success: false, message: 'Leave not found.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const updateAttendance = async (req, res) => {
  try {
    const { attendenceCode, employeeCode, presentDays, salaryDays } = req.body;

    if (!attendenceCode || !employeeCode) {
      return res.status(400).json({ success: false, message: "AttendenceCode and EmployeeCode are required" });
    }

    const result = await updateAttendanceDaysRepo({
      attendenceCode,
      employeeCode,
      presentDays,
      salaryDays,
    });

    if (!result.success) {
      return res.status(404).json({ success: false, message: result.message });
    }

    return res.status(200).json({ success: true, data: result.data });
  } catch (error) {
    console.error("Error in updateAttendance controller:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getDailyAttendanceNewController = async (req, res) => {
    try {
        const { branchCode, month, year, page, limit } = req.query;

        if (!branchCode || !month || !year) {
            return res.status(400).json({ error: 'branchCode, month and year are required' });
        }

        const summary = await getDailyAttendanceNewRepo(branchCode, month, year, page, limit);
        res.json({ success: true, data: summary });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to get attendance summary' });
    }
};



const calculateAttendanceByProcedureController = async (req, res) => {
  try {
    const { fromDate, toDate, month, year, branchCode, branchName } = req.body;

    if (!fromDate || !toDate || !month || !year || !branchCode || !branchName) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const data = await callCalculateAttendanceByProcedure(fromDate, toDate, month, year, branchCode, branchName);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: 'Failed to calculate attendance' });
  }
};



// calculateAttendancenew


const calculateAttendanceControllerNew = async (req, res) => {
    try {
        const { fromDate, toDate, month, year, branchCode, branchName } = req.body;

        if (!fromDate || !toDate || !month || !year || !branchCode || !branchName) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const attendanceResult = await callCalculateAttendanceByProcedure(
            fromDate, toDate, month, year, branchCode, branchName
        );

        res.json({ success: true, data: attendanceResult });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to calculate attendance' });
    }
};


// new bulk uplaod attendance
const createAttendance = async (req, res) => {
  try {
    const { attendanceFilter, bulkAttedanceData } = req.body;

    const result = await createAttendanceService(
      attendanceFilter,
      bulkAttedanceData
    );

    if (typeof result === "string" && result.includes("Attendence already exists")) {
      return res.status(200).json({
        success: false,
        message: result,
      });
    } else if (result) {
      res.status(200).json({
        success: true,
        message: "Attendance created successfully",
        data: result,
      });
    }else{
       res.status(400).json({
      success: false,
      message: "Something went wrong to create Attendance !",
      data: result,
    });
    }
  } catch (error) {
    console.error("Error creating attendance:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};








module.exports = {
  getSavedAttendance,
  getAttendenceByAttendenceCode,
  bulkInsertAttendanceDetails,
  getAttendanceByEmployeeCodeC,
  getAllDailyAttendence,
  fetchDailyAttendanceByCode,
  insertEmployeeLeaveReacord,
  getEmployeeLeaveReacordController,
  calculateAttendance,
  calculateAttendanceByEmployee,
  bulkInsertAttendanceByBranch,
  calculateAttendanceDaysController,
  getLeaveController,
  saveLeaveController,
  addLeaveController,
  updateLeaveController,
  deleteLeaveController,
  updateAttendance,
  getDailyAttendanceNewController,
  calculateAttendanceByProcedureController,
  calculateAttendanceControllerNew,
createAttendance
}