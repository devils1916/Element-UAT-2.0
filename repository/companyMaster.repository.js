const company = require("../models/index.js")
const {getDatabaseNameByCompanyCode} = require("./element.repository")
const { getSequelize } = require("../config/sequelizeManager.js");
const findAll = async (companyCode) => {
    try {
        const companyDetails = await getDatabaseNameByCompanyCode(companyCode);
        if (!companyDetails || companyDetails.length === 0) {
            throw new CustomError(404, "Company not found");
        }
        const sequelize = await getSequelize(companyDetails[0].CompanyDatabaseName);

        const company = sequelize.models.Company;
        if (!company) throw new Error('Company model not defined in this database');

        // Add WHERE condition for newCompanyCode
        const companies = await company.findAll({
            attributes: ['Name', 'Code', 'Address', 'City', 'State', 'Country', 'Phone', 'Email', 'Website', 'Fax', 'Prefix'],
            where: {
                newCompanyCode: companyCode 
            }
        });
 
        return companies;
    } catch (error) {
        console.error(error);
        if (error instanceof CustomError) throw error;
        
        throw new Error('Error fetching companies: ' + error.message);
    }
};

// Create
const create = async (data) => {
    return await company.create(data);
};

// Update company by code
const updateByCode = async (code, data) => {
    const existingCompany = await company.findOne({ where: { Code: code } });
    if (!existingCompany) return null;

    // Prevent changing Code to a duplicate
    if (data.Code && data.Code !== code) {
        const duplicate = await isDuplicateCode(data.Code);
        if (duplicate) throw new Error("Company Code already exists");
    }

    return await existingCompany.update(data);
};
// Delete company by Code
const deleteByCode = async (code) => {
    const existingCompany = await company.findOne({ where: { Code: code } });
    if (!existingCompany) return null;

    await existingCompany.destroy();
    return { message: "Company deleted successfully" };
}

module.exports = { findAll, create, updateByCode, deleteByCode };