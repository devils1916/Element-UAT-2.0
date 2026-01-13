const { findAll, create, updateByCode, deleteByCode, } = require("../repository/companyMaster.repository");
const CustomError = require("../utils/errorHandler.util.js");

const findAllCompanies = async (req, res, next) => {
    try {

        
        const companyCode = req.auth.companyCode
        console.log('........', companyCode);
        const companies = await findAll(companyCode);
        res.status(200).json({
            success: true,
            message: " All companies retrieved successfully ",
            data: companies
        });
    } catch (error) {
        next(new CustomError(500, "Failed to fetch company data"));
    }
};

// Create
const createCompany = async (req, res, next) => {
    try {
        const newCompany = await create(req.body);
        res.status(201).json({
            success: true,
            message: "Company created successfully",
            data: newCompany
        });
    } catch (error) {
        next(new CustomError(500, "Failed to create company"));
    }
};

// Update company
const updateCompany = async (req, res, next) => {
    try {
        const updatedCompany = await updateByCode(req.params.code, req.body);
        if (!updatedCompany) return next(new CustomError(404, "Company not found"));

        res.status(200).json({
            success: true,
            message: "Company updated successfully",
            data: updatedCompany
        });
    } catch (error) {
        console.error("Update Error:", error); // <--- log real error
        next(new CustomError(500, "Failed to update company"));
    }
};
// Delete company
const deleteCompany = async (req, res, next) => {
    try {
        const deletedCompany = await deleteByCode(req.params.code);
        if (!deletedCompany) return next(new CustomError(404, "Company not found"));

        res.status(200).json({
            success: true,
            message: "Company deleted successfully",
            data: deletedCompany
        });
    } catch (error) {
        next(new CustomError(500, "Failed to delete company"));
    }
};

module.exports={ findAllCompanies ,createCompany,updateCompany,deleteCompany};