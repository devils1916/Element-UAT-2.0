const express = require("express");
const { getAllCompanies, getCompanyById, createCompany, updateCompany, deleteCompany } = require("../../controllers/companyMaster/companyMaster.controller");

const router = express.Router();




// CRUD routes
router.get("/", getAllCompanies);       // Get all companies
router.get("/:id", getCompanyById);    // Get company by ID
router.post("/",createCompany);       // Create company
router.put("/:id",updateCompany);    // Update company
router.delete("/:id", deleteCompany); // Delete company

module.exports = router;



