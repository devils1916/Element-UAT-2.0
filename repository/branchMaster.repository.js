const branchMaster = require("../models/branchMaster.model");
const { executeQuery } = require('../utils/dbhelper.util.js');
const { getSequelize } = require("../config/sequelizeManager.js");
const {getDatabaseNameByCompanyCode } = require("./element.repository.js")

const getNewBranchCodeDB = async () => {
  try {
    const lastBranchCode = await executeQuery(`SELECT TOP 1 code FROM BranchMaster ORDER BY CAST(REPLACE(code, 'BR', '') AS INT) DESC`)
    return `BR00${parseInt(lastBranchCode[0].code.replace("BR", ""), 10)+1}`;
  } catch (Error) {
    throw Error;
  }
}

const findAll = async (companyCode) => {
  try {
    const companyDetails = await getDatabaseNameByCompanyCode(companyCode);
        if (!companyDetails || companyDetails.length === 0) {
            throw new CustomError(404, "Company not found");
        }
        const sequelize = await getSequelize(companyDetails[0].CompanyDatabaseName);
        console.log('............', sequelize);
        const Branch = sequelize.models.Branch;
        
        if (!Branch) throw new Error('Company model not defined in this database');

    const branch = await Branch.findAll({
      attributes: ['Name', 'Code', 'CompanyCode', 'incharge', 'Address', 'City', 'pincode', 'faxno', 'phoneno', 'email', 'Website', 'createdBy', 'Prefix'],
      where: { newCompanyCode: companyCode }
    });
    return branch;
  } catch (error) {
    console.log(error);
    throw new Error('Error fetching companies : ' + error.message);
  }
};

const getBranch = async (branchCode, companyCode) => {
  try {
    const companyDetails = await getDatabaseNameByCompanyCode(companyCode);
    if (!companyDetails || companyDetails.length === 0) {
      throw new CustomError(404, "Company not found");
    }
    const sequelize = await getSequelize(companyDetails[0].CompanyDatabaseName);

    const Branch = sequelize.models.Branch;
    const branch = await Branch.findOne({
      attributes: ['Name', 'Code', 'CompanyCode', 'incharge', 'Address', 'City', 'pincode', 'faxno', 'phoneno', 'email', 'Website', 'createdBy', 'Prefix'],
      where: { Code: branchCode, newCompanyCode: companyCode } 
    });

    if (!branch) {
      throw new CustomError(404, "Branch not found");
    }
    return branch;
  } catch (Error) {
    throw new Error('Error in fond this branch details technical error ! go in contect us tab and suggest we so we improve the functionality THANK YOU !', Error.message)
  }
};

const shiftDetail = async (branchCode, companyCode) => {
  try {
    const companyDetails = await getDatabaseNameByCompanyCode(companyCode);
    if (!companyDetails || companyDetails.length === 0) {
      throw new CustomError(404, "Company not found");
    }

    const sequelize = await getSequelize(companyDetails[0].CompanyDatabaseName);
    console.log('Sequelize instance:', sequelize);

    const ShiftMaster = sequelize.models.ShiftMaster;

    const shiftDetails = await ShiftMaster.findAll({
      attributes: ['ShiftCode', 'ShiftName', 'ShiftFrom', 'ShiftTo', 'TotalMinutes'],
      where: {
        BranchCode: branchCode,
        newCompanyCode:companyCode
      }
    });

    return shiftDetails;
  } catch (error) {
    throw new Error('Error fetching ShiftDetails: ' + error.message);
  }
};

const getHeadCH = async (branchCode, companyCode) => {
  try {
    const companyDetails = await getDatabaseNameByCompanyCode(companyCode);
    if (!companyDetails || companyDetails.length === 0) {
      throw new CustomError(404, "Company not found");
    }

    const sequelize = await getSequelize(companyDetails[0].CompanyDatabaseName);
    console.log('Sequelize instance:', sequelize);

    const BranchCommercialHead = sequelize.models.BranchCommercialHead;
    const allBranches = await BranchCommercialHead.findAll({
      attributes: [
        'BranchCode',
        'BranchName', 
        'BranchHeadId', 
        'BranchHeadName', 
        'BranchHeadEmail', 
        'ComHeadId', 
        'ComHeadName', 
        'ComHeadEmail'
      ],
      where: {
        BranchCode: branchCode,
        newCompanyCode:companyCode
      },
      order: [['BranchCode', 'ASC']] 
    });

    return allBranches;

  } catch (error) {
    throw new Error("Error in fetching all Branch Heads: " + error.message);
  }
};


const findAllBranch = async (companyCode) => {
  try {
    const companyDetails = await getDatabaseNameByCompanyCode(companyCode);
        if (!companyDetails || companyDetails.length === 0) {
            throw new CustomError(404, "Company not found");
        }
        const sequelize = await getSequelize(companyDetails[0].CompanyDatabaseName);

        const Branch = sequelize.models.Branch;
        if (!Branch) throw new Error('Branch model not defined in this database');

    const branch = await Branch.findAll({
  where: {
    newCompanyCode: companyCode
  }
});
return branch
  } catch (error) {
    console.log('error ', error);
    throw new Error("Error fetching branches: " + error.message);
  }
};

const updateBranch = async (branchCode, companyCode, branchData) => {
  try {
    const companyDetails = await getDatabaseNameByCompanyCode(companyCode);
        if (!companyDetails || companyDetails.length === 0) {
            throw new CustomError(404, "Company not found");
        }
        const sequelize = await getSequelize(companyDetails[0].CompanyDatabaseName);

        const Branch = sequelize.models.Branch;
        if (!Branch) throw new Error('Branch model not defined in this database');
    const [updatedCount] = await Branch.update(branchData, {
      where: {
        Code: branchCode,
        newCompanyCode: companyCode
      }
    });
    if (updatedCount === 0) {
      throw new Error("Branch not found or no changes made");
    }
    const updatedBranch = await branchMaster.findOne({
      where: { 
        Code: branchCode,
        newCompanyCode: companyCode 
      }
    });

    return updatedBranch;
  } catch (error) {
    console.log(error);
    throw new Error("Error updating branch: " + error.message);
  }
};

const createBranch = async (branchData, companyCode) => {
  try {
    const companyDetails = await getDatabaseNameByCompanyCode(companyCode);
    if (!companyDetails || companyDetails.length === 0) {
      throw new Error("Company not found");
    }

    const sequelize = await getSequelize(companyDetails[0].CompanyDatabaseName);

    const Branch = sequelize.models.Branch;
    if (!Branch) throw new Error("Branch model not defined in this database");
    const existing = await Branch.findOne({ where: { Code: branchData.Code } });
    if (existing) {
      throw new Error( "Branch with this Code already exists!");
    }

    const newBranch = await Branch.create(branchData);
    return newBranch;

  } catch (error) {
    console.log(error);
    throw new Error("Error creating branch: " + error.message);
  }
};


const deleteBranch = async (branchCode, companyCode) => {
  try {
    const companyDetails = await getDatabaseNameByCompanyCode(companyCode);
    if (!companyDetails || companyDetails.length === 0) {
      throw new CustomError(404, "Company not found");
    }

    const sequelize = await getSequelize(companyDetails[0].CompanyDatabaseName);
    const Branch = sequelize.models.Branch;
    if (!Branch) throw new Error("Branch model not defined in this database");

    const deletedCount = await Branch.destroy({
      where: { Code: branchCode, newCompanyCode: companyCode }
    });

    if (deletedCount === 0) {
      throw new Error("Branch not found");
    }

    return { message: "Branch deleted successfully", deletedCount };
  } catch (error) {
    console.log( error);
    throw new Error("Error deleting branch: " + error.message);
  }
};

module.exports = {
  getNewBranchCodeDB,
  findAll,
  getBranch,
  shiftDetail,
  getHeadCH,
  findAllBranch,
  updateBranch,
  createBranch,
  deleteBranch
};