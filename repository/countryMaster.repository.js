const { executeQuery } = require('../utils/dbhelper.util.js');
const { getDatabaseNameByCompanyCode } = require('../repository/element.repository.js');
const { getSequelize } = require('../config/sequelizeManager.js')
const getAllStatedb = async (companyCode) => {
    try {
        console.log('compnany', companyCode);
        const companyDetails = await getDatabaseNameByCompanyCode(companyCode);
        if (!companyDetails || companyDetails.length === 0) {
            throw new CustomError(404, "Company not found");
        }
        const sequelize = await getSequelize(companyDetails[0].CompanyDatabaseName);
        const Country = sequelize.models.Country

        console.log('.......', Country);
        const states = await Country.findAll({
            attributes: [
                [sequelize.fn('DISTINCT', sequelize.col('STATE')), 'STATE']
            ],
            where: {
                newCompanyCode: companyCode
            },
            order: [['STATE', 'ASC']] // optional: order alphabetically
        });

        // Return as plain JS objects
        return states.map(s => s.get({ plain: true }));

    } catch (error) {
        console.error('Error fetching states:', error.message);
        throw new CustomError('Internal server error', 500);
    }
};

const getAllCitydb = async (state, companyCode) => {
    try {
        const companyDetails = await getDatabaseNameByCompanyCode(companyCode);
        if (!companyDetails || companyDetails.length === 0) {
            throw new CustomError(404, "Company not found");
        }

        const sequelize = await getSequelize(companyDetails[0].CompanyDatabaseName);
        const Country = sequelize.models.Country;

        const cities = await Country.findAll({
            attributes: ['CityId', 'CITY'],
            where: {
                STATE: state,
                newCompanyCode: companyCode
            },
            order: [['CITY', 'ASC']]
        });
       console.log('cities',cities);
        return cities.map(c => c.get({ plain: true }));

    } catch (error) {
        console.error('Error fetching cities:', error.message);
        throw new CustomError('Internal server error', 500);
    }
};



module.exports = {

    getAllStatedb,
    getAllCitydb

};
