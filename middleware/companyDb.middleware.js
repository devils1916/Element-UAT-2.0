const CustomError = require('../utils/errorHandler.util');
const { getSequelize } = require('../config/sequelizeManager');

async function companyDbMiddleware(req, res, next) {
    try {
        // const companyCodeHeader = req.headers['company-code'];
        // if (!companyCodeHeader) {
        //     return next(new CustomError(400, 'Company code header missing'));
        // }
        const { companyCode, companyDBName } = req.user;
        // if (companyCodeHeader !== companyCode) {
        //     return next(new CustomError(403, 'Unauthorized company access'));
        // }
        req.sequelize = await getSequelize(companyDBName);
        next();
    } catch (err) {
        console.error(err);
        next(new CustomError(500, 'Company database resolution failed'));
    }
}

module.exports = companyDbMiddleware;
