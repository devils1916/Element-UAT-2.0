const contectUs=require("../models/contectUs.model")

const getAll = async (companyCode) => {
    try {
        const companyDetails = await getDatabaseNameByCompanyCode(companyCode);
        if (!companyDetails || companyDetails.length === 0) {
            throw new CustomError(404, "Company not found");
        }
        const sequelize = await getSequelize(companyDetails[0].CompanyDatabaseName);
        const contect = sequelize.models.contect
        return await contect.findAll();
    } catch (error) {
        throw new Error('Error fetching contects: ' + error.message);
    }
};
const save = async ( contectData) => {

    try {

        return await contectUs.create( contectData );

    } catch (error) {

        throw new Error('Error saving product: ' + error.message);
    }
};
module.exports = { getAll, save };