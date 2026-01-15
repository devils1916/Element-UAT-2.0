const CustomError = require("../utils/errorHandler.util.js");
const { getAllCompaniesName, getDatabaseNameByCompany, login } = require('../repository/element.repository');
const { createJWTToken } = require("../utils/jwt.util.js");
const { getSequelize } = require("../config/sequelizeManager.js");

const getAllCompanies = async (_req, res, next) => {
    try {
        const [rows] = await getAllCompaniesName();
        const companyNames = rows.map(item => item.CompanyName);
        res.status(200).json({
            success: true,
            message: 'All Companies List found successfully : ',
            data: companyNames
        });
    } catch (err) {
        console.error(err);
        next(new CustomError(500, 'Login failed'));
    }
};

const loginAdministrator = async (req, res, next) => {
    const { email, password, companyName } = req.body;
    try {
        // const companyDetails = await getDatabaseNameByCompany(companyName);
        // if (!companyDetails) return next(new CustomError(404, 'Company not found'));

        // req.sequelize = await getSequelize(companyDetails[0].CompanyDatabaseName);

        const data = await login(companyName, email, password);
        if (!data) return next(new CustomError(401, 'Invalid email or password'));
        console .log('...user ', data.user.email)

        const token = createJWTToken({ email: data.user.email, name: data.user.UserName, companyCode: data.companyDetails[0].CompanyCode, companyDBName: data.companyDetails[0].CompanyDatabaseName, companyName : data.companyDetails[0].CompanyName});

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                email: data.user.email,
                name: data.user.UserName,
                companyCode: data.companyDetails[0].CompanyCode,
                companyName: data.companyDetails[0].CompanyDatabaseName,
                token
            }
        });
    } catch (err) {
        console.error(err);
        next(new CustomError(500, 'Login failed'));
    }
};

module.exports = { getAllCompanies, loginAdministrator };
