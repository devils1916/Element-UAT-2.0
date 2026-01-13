const express = require( 'express' );
const router = express.Router();
const {
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
} = require( "../controllers/attendance.controller" );
const { checkAttendanceUpload } = require('../middleware/checkAttendanceUpload.middleware');
const { generateAttendanceCodeForUnmatched } = require('../middleware/generateAttendanceCodeForUnmatched.middeware');


router.get("/get/attendanceCode", getSavedAttendance );
// router.get("/get/attendence/:attendanceCode", getAttendenceByAttendenceCode );
router.post("/get/attendence", getAttendenceByAttendenceCode);
router.post( "/upload/bulk-upload-attendance", checkAttendanceUpload, bulkInsertAttendanceByBranch);
router.get("/get/employee/:employeeCode", getAttendanceByEmployeeCodeC);
router.get("/get/dailyAttendance", getAllDailyAttendence);
router.post('/get/dailyAttedenceDetails', fetchDailyAttendanceByCode);
router.post('/calculate-attendance-days', calculateAttendanceDaysController);
router.put("/attendance/update", updateAttendance);

router.post("/insert/empLeaveRecord", insertEmployeeLeaveReacord)
router.post("/get/empLeaveRecord", getEmployeeLeaveReacordController)
router.post("/calculate-attedance", calculateAttendance) // calculateAttendanceByEmployee
router.post('/calculate-attendance-by-employee', calculateAttendanceByEmployee);

router.get('/leave-controls', getLeaveController);
router.post('/leave-controls', saveLeaveController);

router.post('/leave-control', addLeaveController);
router.put('/leave-control/:id', updateLeaveController);
router.delete('/leave-control/:id', deleteLeaveController);

// new api for get daily attendnace
router.get('/get-daily-attendance', getDailyAttendanceNewController);
router.post('/calculate-attendance-by-procedure', calculateAttendanceControllerNew);
router.post( "/upload/bulk-upload-attendance-MultiBranch", createAttendance);
module.exports = router;