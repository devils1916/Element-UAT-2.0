const CustomError = require("../utils/errorHandler.util.js");
const {
  findAll,
  findOne,
  getAllByBranch,
  updateEmployee,
  createEmployee,
  createNewRM,
  createNewEMPid,
  RMofBranch,
  createNewHLid,
  validateEmployeeDetails,
  getAllDepartment,
  getAllDesignation,
  getAllEduQualificationOptions,
  getAllProfQualificationOptions,
  getAllRMsdb,
  getDepartmentCodeByDescription,
  getDesignationCodeByDescription,
} = require("../repository/employeeMaster.repository");
const moment = require("moment");
const e = require("express");
const findAllemployees = async (req, res) => {
  try {
    const companyCode = req.auth.companyCode;
    console.log('company code ....', companyCode);
    const page = parseInt(req.query.page) || 1;
    const pageSize = 20;
    const search = req.query.search || "";
    const download = req.query.download === "true"; // if frontend sends ?download=true

    if (page < 1 || pageSize < 1) {
      return res.status(400).json({ error: "Invalid pagination parameters" });
    }

    const { count, rows, leftCount } = await findAll( companyCode, page, pageSize, search, download);

    res.json({
      data: rows,
      pagination: download
        ? null // no pagination info when downloading full data
        : {
          total: count,
          page,
          pageSize,
          totalPages: Math.ceil(count / pageSize),
          activeEmployees: count - leftCount,
          inActiveEmployees: leftCount,
        },
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getEmployeeById = async (req, res, next) => {
  try {
    const companyCode = req.auth.companyCode;
    const empId = req.params.id;
    const employee = await findOne(empId, companyCode);
    if (employee) {
      res.status(200).json({
        success: true,
        message: " employee found successfully ",
        data: employee,
      });
    } else {
      res.status(401).json({
        success: false,
        message: " employee not found check employee id ",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllEmployeeFromBranch = async (req, res, next) => {
  try {
    const companyCode = req.auth.companyCode;
    const branchCode = req.params.branchCode;
    const employees = await getAllByBranch(branchCode, companyCode);
    if (employees) {
      res.status(200).json({
        success: true,
        message:
          " All employee found successfully of " + branchCode + " branch",
        data: employees,
      });
    } else {
      res.status(401).json({
        success: false,
        message: " employee not found by branch",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllRM = async (req, res, next) => {
  try {
    const companyCode = req.auth.companyCode;
    const branchCode = req.params.branchCode;
    const rm = await RMofBranch(branchCode, companyCode);
    if (rm) {
      res.status(200).json({
        success: true,
        message: " All RM found successfully of " + branchCode + " branch",
        data: rm,
      });
    } else {
      res.status(401).json({
        success: false,
        message: " employee not found by branch",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// helper for cleaning invalid dates
function sanitizeDate(value) {
  if (!value || value === '' || value === 'Invalid date') return null;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : value; // keep valid ISO dates only
}

function sanitizeEmployeeData(employee) {
  const dateFields = [
    "DoB", "SpouseDOb", "FatherDOB", "MotherDOB",
    "Child1DOB", "Child2DOB", "Child3DOB", "Child4DOB",
    "ResignationDate", "LeftDate",
    "FirstCompanyFromDate", "SecondCompanyFromDate", "T_EndDate"
  ];

  dateFields.forEach(field => {
    if (field in employee) {
      employee[field] = sanitizeDate(employee[field]);
    }
  });

  return employee;
}

const saveEmployee = async (req, res, next) => {
  try {
    const employees = req.body;
    const companyCode = req.auth.companyCode;
    console.log('company....code', companyCode);

    // 🔥 sanitize before hitting repo
    const employee = sanitizeEmployeeData(employees);

    let emp = await findOne(employee.EmpID, companyCode);

    if (!emp) {
      return res.status(404).json({
        success: false,
        message: "Employee not found by this id, please register first",
      });
    }

    const employeeDetail = await updateEmployee(employee, companyCode);

    if (employeeDetail[0] > 0) {
      res.status(200).json({
        success: true,
        message: "Employee Detail Updated Successfully",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Employee not updated",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const saveBulkEmployees = async (req, res, next) => {
  try {
    const employees = req.body;

    if (!Array.isArray(employees) || employees.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide an array of employee details",
      });
    }

    const results = {
      updated: [],
      notFound: [],
      failed: [],
    };

    for (const employee of employees) {
      try {
        const emp = await findOne(employee.EmpID);

        if (!emp) {

          results.notFound.push(employee.EmpID);

        } else {

          const updated = await updateEmployee(employee);

          if (updated[0] > 0) {

            results.updated.push(employee.EmpID);

          } else {

            results.failed.push(employee.EmpID);

          }
        }
      } catch (err) {
        console.error(`Error updating employee ${employee.EmpID}:`, err);
        results.failed.push(employee.EmpID);
      }
    }

    res.status(200).json({
      success: true,
      message: "Bulk employee update process completed",
      data: results,
    });
  } catch (error) {
    console.error("Error in bulk update:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


const saveNewEmployee = async (req, res) => {
  try {
    const companyCode = req.auth.companyCode;
    const employee = req.body;
    const { EmpID, Email, MobileNo, AdharNo, PanNo } = employee;

    const validationResult = await validateEmployeeDetails(
      EmpID,
      Email,
      MobileNo,
      AdharNo,
      PanNo
    );

    if (validationResult) {
      return res.status(409).json({
        success: false,
        message: validationResult.message,
        conflictFields: validationResult.conflictFields,
        existingEmployee: validationResult.existingEmployee,
      });
    }
    const newEmployee = await createEmployee(employee, companyCode);

    if (newEmployee) {
      return res.status(201).json({
        success: true,
        message: "Employee detail saved successfully.",
        data: newEmployee,
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Something went wrong, employee not saved!",
      });
    }
  } catch (error) {
    console.error("Controller Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

const saveNewRM = async (req, res, next) => {
  try {
    const companyCode = req.auth.companyCode;
    const employee = req.body;
    const EmpID = employee.EmpID;

    const existingRM = await findOne(EmpID, companyCode);
    if (existingRM) {
      return res.status(409).json({
        success: false,
        message: "RM/CH/Head or TL with this ID already exists.",
        existingEmployee: {
          ID: existingRM.EmpID,
          Name: existingRM.Name,
          BranchCode: existingRM.BranchCode,
          CompanyCode: existingRM.CompanyCode,
          Designation: existingRM.Designation,
          Department: existingRM.Department,
          Email: existingRM.Email,
          MobileNo: existingRM.PhoneNo,
        },
      });
    }
    const result = await createNewRM(employee, companyCode);
    if (result) {
      res.status(200).json({
        success: true,
        message: "RM/CH/TL or Head detail saved successfully.",
        data: result,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Something went wrong, RM not saved!",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error,
    });
  }
};

const lastEMPid = async (req, res, next) => {
  try {
    const companyCode = req.auth.companyCode
    const newEMPid = await createNewEMPid(companyCode);

    if (newEMPid) {
      res.status(200).json({
        success: true,
        message: " This ID for RM EMP ID to be use for next RM/CH/Head  ",
        data: newEMPid,
      });
    } else {
      res.status(401).json({
        success: false,
        message:
          " Last Employee EMP ID not found please refresh the curent page ",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const lastHLid = async (req, res, next) => {
  try {
    const companyCode = req.auth.companyCode;
    const newHLid = await createNewHLid(companyCode);

    if (newHLid) {
      res.status(200).json({
        success: true,
        message: " This is Last Employee HL ID",
        data: newHLid,
      });
    } else {
      res.status(401).json({
        success: false,
        message:
          " Last Employee HL ID not found please refresh the curent page ",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const getDepartment = async (req, res, next) => {
  try {
    const companyCode = req.auth.companyCode;
    const department = await getAllDepartment(companyCode);

    if (department) {
      res.status(200).json({
        success: true,
        message: " All Department found successfully ",
        data: department,
      });
    } else {
      res.status(401).json({
        success: false,
        message: " department not found ",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const fetchDepartmentByDescription = async (req, res) => {
  try {
    const companyCode = req.auth.companyCode;
    const { description } = req.body; // 🔹 POST body { "description": "Manager" }

    if (!description) {
      return res.status(400).json({
        success: false,
        message: "Description is required !!",
      });
    }

    const department = await getDepartmentCodeByDescription(description, companyCode);

    res.status(200).json({
      success: true,
      message: "Description found successfully",
      data: department, // { DesignationCode: "D001" }
    });
  } catch (error) {
    console.error("Error in controller:", error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

const getDesignation = async (req, res, next) => {
  try {
    const companyCode = req.auth.companyCode;
    const designation = await getAllDesignation(companyCode);

    if (designation) {
      res.status(200).json({
        success: true,
        message: " All Designation found successfully ",
        data: designation,
      });
    } else {
      res.status(401).json({
        success: false,
        message: " Designation not found ",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const fetchDesignationByDescription = async (req, res) => {
  try {
    const companyCode = req.auth.companyCode;
    const { description } = req.body; // 🔹 POST body { "description": "Manager" }

    if (!description) {
      return res.status(400).json({
        success: false,
        message: "Description is required",
      });
    }

    const designation = await getDesignationCodeByDescription(description, companyCode);

    res.status(200).json({
      success: true,
      message: "Designation found successfully",
      data: designation, // { DesignationCode: "D001" }
    });
  } catch (error) {
    console.error("Error in controller:", error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
const getEduQualificationOptions = async (req, res, next) => {
  try {
    const companyCode = req.auth.companyCode;
    const eduQualificationOptions = await getAllEduQualificationOptions(companyCode);

    if (eduQualificationOptions) {
      res.status(200).json({
        success: true,
        message: " All Edu Qualification Options found successfully ",
        data: eduQualificationOptions,
      });
    } else {
      res.status(401).json({
        success: false,
        message: " Edu Qualification Options not found ",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const getProfQualificationOptions = async (req, res, next) => {
  try {
    const companyCode = req.auth.companyCode;
    const profQualificationOptions = await getAllProfQualificationOptions(companyCode);

    if (profQualificationOptions) {
      res.status(200).json({
        success: true,
        message: " All Prof Qualification Options found successfully ",
        data: profQualificationOptions,
      });
    } else {
      res.status(401).json({
        success: false,
        message: " Prof Qualification Options not found ",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const getAllRMs = async (req, res, next) => {
  try {
    const branchCode = req.query.branchCode;
    const companyCode = req.auth.companyCode;
    const AllRm = await getAllRMsdb(branchCode, companyCode);

    if (AllRm) {
      res.status(200).json({
        success: true,
        message: " All RM's found successfully ",
        data: AllRm,
      });
    } else {
      res.status(401).json({
        success: false,
        message: " NO RM found try again !  it seem's server busy try later ",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  findAllemployees,
  getEmployeeById,
  getAllEmployeeFromBranch,
  getAllRM,
  saveEmployee,
  saveNewEmployee,
  saveNewRM,
  lastEMPid,
  lastHLid,
  getDepartment,
  getDesignation,
  getEduQualificationOptions,
  getProfQualificationOptions,
  getAllRMs,
  saveBulkEmployees,
  fetchDesignationByDescription,
  fetchDepartmentByDescription
};
