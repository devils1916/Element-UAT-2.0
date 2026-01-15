const { QueryTypes } = require("sequelize");
const { Op } = require('sequelize');
const { element } = require("../config/db.js");
const userNameMaster = require("../models/userNameMaster.js");
const CustomError = require("../utils/errorHandler.util.js");
const { getSequelize } = require("../config/sequelizeManager.js");
async function getAllCompaniesName() {
    return await element.query(
        `SELECT CompanyName FROM CompanyMaster`);
}


async function getDatabaseNameByCompany(companyName) {
    return await element.query(
        `SELECT *
            FROM CompanyMaster
            WHERE CompanyName = :companyName`,
        {
            replacements: { companyName },
            type: QueryTypes.SELECT
        }
    );
}

async function getDatabaseNameByCompanyCode(companyCode) {
    return await element.query(
        `SELECT *
            FROM CompanyMaster
            WHERE companyCode = :companyCode`,
        {
            replacements: { companyCode },
            type: QueryTypes.SELECT
        }
    );
}

async function login(companyName, emailOrUserName, password) {
    const companyDetails = await getDatabaseNameByCompany(companyName);

    if (!companyDetails) {
        throw new CustomError(404, 'Company not found');
    }

    const sequelize = await getSequelize(
        companyDetails[0].CompanyDatabaseName
    );

    const UserNameMaster = sequelize.models.userNameMaster;

    const user = await UserNameMaster.findOne({
        where: {
            [Op.and]: [
                { password }, // password must match
                {
                    [Op.or]: [
                        { email: emailOrUserName },
                        { userName: emailOrUserName }
                    ]
                }
            ]
        }
    });

    return { user, companyDetails };
}



module.exports = { getAllCompaniesName, login, getDatabaseNameByCompany, getDatabaseNameByCompanyCode };
