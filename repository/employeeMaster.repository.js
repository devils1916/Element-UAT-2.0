const { Op, Sequelize, QueryTypes } = require("sequelize");
const employeeMaster = require("../models/employeeMaster.model.js");
const CustomError = require("../utils/errorHandler.util.js");
const { executeQuery } = require("../utils/dbhelper.util.js");
const PHRMBranchWise = require("../models/PHBranchWise.model.js");
const { getDatabaseNameByCompanyCode } = require("./element.repository.js");
const { getSequelize } = require("../config/sequelizeManager.js");
const moment = require("moment");


const findAll = async (companyCode, page, pageSize, search = "", download = false) => {
  // Validate inputs
  if (!companyCode) {
    throw new CustomError(400, "Company code is required");
  }

  const offset = (page - 1) * pageSize;

  // Get company details
  const companyDetails = await getDatabaseNameByCompanyCode(companyCode);
  if (!companyDetails || companyDetails.length === 0) {
    throw new CustomError(404, "Company not found");
  }

  // Connect to the company's database
  const sequelize = await getSequelize(companyDetails[0].CompanyDatabaseName);
  const employeeMaster = sequelize.models.Employee;

  try {
    // Build mandatory where clause for companyCode
    const whereClause = {
      newCompanyCode: companyCode, // mandatory filter
    };

    // Add search conditions if provided
    if (search) {
      whereClause[Op.or] = [
        { EmpID: { [Op.like]: `%${search}%` } },
        { Name: { [Op.like]: `%${search}%` } },
        { BranchCode: { [Op.like]: `%${search}%` } },
        { Department: { [Op.like]: `%${search}%` } },
        { Designation: { [Op.like]: `%${search}%` } },
      ];
    }

    // Query options
    const queryOptions = {
      where: whereClause,
      order: [["EmpId1", "ASC"]],
    };

    // Apply pagination only if download=false
    if (!download) {
      queryOptions.limit = pageSize;
      queryOptions.offset = offset;
    }

    // Fetch employees
    const { count, rows } = await employeeMaster.findAndCountAll(queryOptions);

    // Count employees who have left
    const leftCount = await employeeMaster.count({
      where: { hasLeft: true, newCompanyCode: companyCode }, // ensure company filter
    });

    return { count, rows, leftCount };
  } catch (error) {
    console.error("Database Error:", error);
    throw new CustomError(
      500,
      "Database error occurred while fetching employee data."
    );
  }
};


const findOne = async (empId, companyCode) => {
  try {
    // Get company details
    const companyDetails = await getDatabaseNameByCompanyCode(companyCode);
    if (!companyDetails || companyDetails.length === 0) {
      throw new CustomError(404, "Company not found");
    }

    // Connect to the company's database
    const sequelize = await getSequelize(companyDetails[0].CompanyDatabaseName);
    const employeeMaster = sequelize.models.Employee;
    return (employee = await employeeMaster.findOne({
      where: { EmpID: empId, newCompanyCode: companyCode },
    }));
  } catch (error) {
    throw new Error("Error in fetching employee by id: " + error.message);
  }
};

const getAllByBranch = async (branchCode, companyCode) => {
  try {
    // Get company details
    const companyDetails = await getDatabaseNameByCompanyCode(companyCode);
    if (!companyDetails || companyDetails.length === 0) {
      throw new CustomError(404, "Company not found");
    }

    // Connect to the company's database
    const sequelize = await getSequelize(companyDetails[0].CompanyDatabaseName);
    const employeeMaster = sequelize.models.Employee;

    const employees = await employeeMaster.findAll({
      where: {
        branchCode: branchCode,
        newCompanyCode: companyCode

      },
    });
    return employees;
  } catch (error) {
    throw new Error("Error in fetching employee by branch: " + error.message);
  }
};
const RMofBranch = async (branchCode, companyCode) => {
  try {
    // Get company details
    const companyDetails = await getDatabaseNameByCompanyCode(companyCode);
    if (!companyDetails || companyDetails.length === 0) {
      throw new CustomError(404, "Company not found");
    }

    // Connect to the company's database
    const sequelize = await getSequelize(companyDetails[0].CompanyDatabaseName);
    const employeeMaster = sequelize.models.Employee;
    const rms = await employeeMaster.findAll({
      where: {
        newCompanyCode: companyCode,
        branchCode: branchCode,
        [Op.and]: [
          Sequelize.literal("ISNULL(IsBilled, 0) = 0"),
          Sequelize.literal("ISNULL(hasLeft, 0) = 0"),
        ],
      },
      order: [["EmpId1", "ASC"]],
    });
    return rms;
  } catch (error) {
    throw new Error("Error in fetching employee by branch: " + error.message);
  }
};

const updateEmployee = async (employee, companyCode) => {
  const empId = employee.EmpID;
  console.log('company code ...', companyCode);
  try {
    // Get company details
    const companyDetails = await getDatabaseNameByCompanyCode(companyCode);
    if (!companyDetails || companyDetails.length === 0) {
      throw new CustomError(404, "Company not found");
    }

    // Connect to the company's database
    const sequelize = await getSequelize(companyDetails[0].CompanyDatabaseName);
    const employeeMaster = sequelize.models.Employee;
    return await employeeMaster.update(employee, { where: { EmpID: empId, newCompanyCode: companyCode } });
  } catch (error) {
    console.error("Update failed:", error);
    throw new Error("! error in Updating employee: " + error.message);
  }
};

const createEmployee = async (employee, companyCode) => {
  try {
    // Get company details
    const companyDetails = await getDatabaseNameByCompanyCode(companyCode);
    if (!companyDetails || companyDetails.length === 0) {
      throw new CustomError(404, "Company not found");
    }

    // Connect to the company's database
    const sequelize = await getSequelize(companyDetails[0].CompanyDatabaseName);
    const employeeMaster = sequelize.models.Employee;
    return await employeeMaster.create(employee);
  } catch (error) {
    console.error("Error in register new Employee:", error);
    throw new Error(error);
  }
};

const createNewRM = async (employee) => {
  try {
    // Get company details
    const companyDetails = await getDatabaseNameByCompanyCode(companyCode);
    if (!companyDetails || companyDetails.length === 0) {
      throw new CustomError(404, "Company not found");
    }

    // Connect to the company's database
    const sequelize = await getSequelize(companyDetails[0].CompanyDatabaseName);
    const employeeMaster = sequelize.models.Employee;
    return await employeeMaster.create({
      EmpID: employee.EmpID,
      Name: employee.Name,
      Department: employee.Department,
      BranchCode: employee.BranchCode,
      CompanyCode: employee.CompanyCode,
      PhoneNo: employee.PhoneNo,
      Email: employee.Email,
      IsRM: employee.IsRM,
      IsBranchHead: employee.IsBranchHead,
      IsHead: employee.IsHead,
      isTL: employee.isTL,
      IsBilled: 0,
      BranchHeadName: employee.BranchHeadName,
      BranchHeadEmailId: employee.BranchHeadEmailId,
      HeadName: employee.HeadName,
      HeadEmailId: employee.HeadEmailId,
      TL_Emp_Name: employee.TL_Emp_Name,
      TL_Email: employee.TL_Email,
      RMEmpName: employee.RMEmpName,
      RMEmailId: employee.RMEmailId,
    });
  } catch (error) {
    console.error("Error in creating new RM:", error);
    throw new CustomError(
      500,
      "Database error occurred during creating new RM."
    );
  }
};

const createNewEMPid = async (companyCode) => {
  try {
    // Get company details
    const companyDetails = await getDatabaseNameByCompanyCode(companyCode);
    if (!companyDetails || companyDetails.length === 0) {
      throw new CustomError(404, "Company not found");
    }

    // Connect to the company's database
    const sequelize = await getSequelize(companyDetails[0].CompanyDatabaseName);
    const employeeMaster = sequelize.models.Employee;
    const latestEmp = await employeeMaster.findOne({
      attributes: ["EmpId"],
      where: {
        newCompanyCode: companyCode,
        EmpId: {
          [Op.like]: "EMP%",
        },
      },
      order: [["EmpId", "DESC"]],
      raw: true,
    });

    let newEmpId = "EMP1000";

    if (latestEmp && latestEmp.EmpId) {
      const numberPart = parseInt(latestEmp.EmpId.replace(/\D/g, ""));
      const incremented = numberPart + 1;
      newEmpId = "EMP" + incremented.toString().padStart(4, "0");
    }

    return newEmpId;
  } catch (error) {
    console.error("Error in getiing Last employee EMP ID:", error);
    throw new CustomError(
      500,
      "Database error occurred during getiing Last employee EMP ID."
    );
  }
};

const createNewHLid = async (companyCode) => {
  try {

    // Get company details
    const companyDetails = await getDatabaseNameByCompanyCode(companyCode);
    if (!companyDetails || companyDetails.length === 0) {
      throw new CustomError(404, "Company not found");
    }

    // Connect to the company's database
    const sequelize = await getSequelize(companyDetails[0].CompanyDatabaseName);
    //const sequencemaster = sequelize.models.sequencemaster;
    // const result = await executeQuery(
    const result = sequelize.query("SELECT CONCAT(prefix, LastValue) AS NewEmployeeCode FROM sequencemaster WHERE head = 'Employee';"
    );

    return result ? result[0].NewEmployeeCode : null;
  } catch (error) {
    console.error("Error in getiing Last employee HL ID:", error);
    throw new CustomError(
      500,
      "Database error occurred during getiing Last employee HL ID."
    );
  }
};

const validateEmployeeDetails = async (
  EmpID,
  Email,
  MobileNo,
  AdharNo,
  PanNo,
  UANNo
) => {
  try {
    const existing = await employeeMaster.findOne({
      where: {
        [Op.or]: [
          { EmpID },
          { Email },
          { MobileNo },
          { AdharNo },
          { PanNo },
          { UANNo }
        ],
      },
    });

    if (!existing) return null;

    const data = existing.get(); 
    const conflicts = [];

    if (data.EmpID === EmpID) conflicts.push("EmpID");
    if (data.Email?.toLowerCase() === Email?.toLowerCase()) conflicts.push("Email");
    if (data.MobileNo === MobileNo) conflicts.push("MobileNo");
    if (data.AdharNo === AdharNo) conflicts.push("AdharNo");
    if (data.PanNo?.toUpperCase() === PanNo?.toUpperCase()) conflicts.push("PanNo");
    if (data.UANNo === UANNo) conflicts.push("UANNo");

    return {
      message: `Conflict: ${conflicts.join(", ")} already in use.`,
      conflictFields: conflicts,
      existingEmployee: {
        EmpID: data.EmpID,
        Email: data.Email,
        MobileNo: data.MobileNo,
        AdharNo: data.AdharNo,
        PanNo: data.PanNo,
        UANNo: data.UANNo,
      },
    };
  } catch (error) {
    console.error("Service Error (validateEmployeeDetails):", error);
    throw new Error("Database error during employee validation.");
  }
};

const getAllDepartment = async (companyCode) => {
  try {
    // Get company details
    const companyDetails = await getDatabaseNameByCompanyCode(companyCode);
    if (!companyDetails || companyDetails.length === 0) {
      throw new CustomError(404, "Company not found");
    }

    // Connect to the company's database
    const sequelize = await getSequelize(companyDetails[0].CompanyDatabaseName);
    const result = await sequelize.query("SELECT DepartmentCode, Description FROM DepartmentMaster");
    return result
  } catch (error) {
    console.error("Error in fetching departments:", error);
    throw new CustomError(
      500,
      "Database error occurred during getting all departments."
    );
  }
};
const getDepartmentCodeByDescription = async (description, companyCode) => {
  // Get company details
  const companyDetails = await getDatabaseNameByCompanyCode(companyCode);
  if (!companyDetails || companyDetails.length === 0) {
    throw new CustomError(404, "Company not found");
  }

  // Connect to the company's database
  const sequelize = await getSequelize(
    companyDetails[0].CompanyDatabaseName
  );

  const query = `
    SELECT DepartmentCode
    FROM DepartmentMaster
    WHERE Description = :description
    AND newCompanyCode = :companyCode
  `;

  const rows = await sequelize.query(query, {
    replacements: { description, companyCode },
    type: QueryTypes.SELECT,
  });

  return rows.length > 0 ? rows[0].DepartmentCode : null;
};




const getAllDesignation = async (companyCode) => {
  try {
    // Get company details
    const companyDetails = await getDatabaseNameByCompanyCode(companyCode);
    if (!companyDetails || companyDetails.length === 0) {
      throw new CustomError(404, "Company not found");
    }

    // Connect to the company's database
    const sequelize = await getSequelize(companyDetails[0].CompanyDatabaseName);
    const result = await sequelize.query("SELECT Description,DesignationCode FROM DesignationMaster");
    return result;
  } catch (error) {
    console.error("Error in fetching designations:", error);
    throw new CustomError(
      500,
      "Database error occurred during getting all designations."
    );
  }
};

const getDesignationCodeByDescription = async (description, companyCode) => {
  // Get company details
  const companyDetails = await getDatabaseNameByCompanyCode(companyCode);
  if (!companyDetails || companyDetails.length === 0) {
    throw new CustomError(404, "Company not found");
  }

  // Connect to the company's database
  const sequelize = await getSequelize(companyDetails[0].CompanyDatabaseName);

  const query = `
    SELECT DesignationCode
    FROM DesignationMaster
    WHERE Description = :description
  `;

  const result = await sequelize.query(query, {
    replacements: { description },
    type: QueryTypes.SELECT,
  });

  // result is an array of rows
  return result.length > 0 ? result[0].DesignationCode : null;
};




const getAllEduQualificationOptions = async (companyCode) => {
  try {
    // Get company details
    const companyDetails = await getDatabaseNameByCompanyCode(companyCode);
    if (!companyDetails || companyDetails.length === 0) {
      throw new CustomError(404, "Company not found");
    }

    // Connect to the company's database
    const sequelize = await getSequelize(companyDetails[0].CompanyDatabaseName);
    const employeeMaster = sequelize.models.Employee;

    return await employeeMaster.findAll({
      attributes: [
        [
          Sequelize.fn("DISTINCT", Sequelize.col("EduQualification")),
          "EduQualification",
        ],
      ],
      raw: true,
    });
  } catch (error) {
    console.error("Error in fetching designations:", error);
    throw new CustomError(
      500,
      "Database error occurred during getting all designations."
    );
  }
};
const getAllProfQualificationOptions = async (companyCode) => {
  try {
    // Get company details
    const companyDetails = await getDatabaseNameByCompanyCode(companyCode);
    if (!companyDetails || companyDetails.length === 0) {
      throw new CustomError(404, "Company not found");
    }

    // Connect to the company's database
    const sequelize = await getSequelize(companyDetails[0].CompanyDatabaseName);
    const employeeMaster = sequelize.models.Employee;
    return await employeeMaster.findAll({
      attributes: [
        [
          Sequelize.fn("DISTINCT", Sequelize.col("ProfQualification")),
          "ProfQualification",
        ],
      ],
      raw: true,
    });
  } catch (error) {
    console.error("Error in fetching designations:", error);
    throw new CustomError(
      500,
      "Database error occurred during getting all designations."
    );
  }
};

const getAllRMsdb = async (branchCode, companyCode) => {
  try {
    // Get company details
    const companyDetails = await getDatabaseNameByCompanyCode(companyCode);
    if (!companyDetails || companyDetails.length === 0) {
      throw new CustomError(404, "Company not found");
    }

    // Connect to the company's database
    const sequelize = await getSequelize(companyDetails[0].CompanyDatabaseName);
    const PHRMBranchWise = sequelize.models.PHRMBranchWise;
    if (branchCode) {
      return await PHRMBranchWise.findAll({ where: { BranchCode: branchCode, newCompanyCode: companyCode } });
    }
    return await PHRMBranchWise.findAll();
  } catch (error) {
    throw new CustomError(500, "error in founding RM from db ");
  }
};

module.exports = {
  findAll,
  findOne,
  getAllByBranch,
  RMofBranch,
  updateEmployee,
  createEmployee,
  createNewRM,
  createNewEMPid,
  createNewHLid,
  validateEmployeeDetails,
  getAllDepartment,
  getAllDesignation,
  getAllEduQualificationOptions,
  getAllProfQualificationOptions,
  getAllRMsdb,
  getDepartmentCodeByDescription,
  getDesignationCodeByDescription

};
