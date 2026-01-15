const { getSequelize } = require('../config/sequelizeManager.js');
const { getDatabaseNameByCompanyCode } = require('../repository/element.repository.js');
const CustomError = require("../utils/errorHandler.util.js");

const getAllGradesdb = async (companyCode) => {
    try {
        const companyDetails = await getDatabaseNameByCompanyCode(companyCode);
        if (!companyDetails || companyDetails.length === 0) {
            throw new CustomError(404, "Company not found");
        }

        const sequelize = await getSequelize(companyDetails[0].CompanyDatabaseName);
        const Grade = sequelize.models.Grade;

        const grades = await Grade.findAll({
            where: { newCompanyCode: companyCode }
        });

        return grades;

    } catch (error) {
        console.error('Error fetching grades:', error.message);
        throw new CustomError('Internal server error', 500);
    }
};

module.exports = { getAllGradesdb };
