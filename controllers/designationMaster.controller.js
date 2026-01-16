// File: controllers/designationController.js

const { createDesignationRepo, getAllDesignationsRepo, getDesignationByIdRepo, updateDesignationRepo, deleteDesignationRepo } = require("../repository/designationMaster.repository");


const create = async (req, res) => {
  try { 
    const companyCode = req.auth.companyCode;
    const { DesignationCode, Description, CreatedBy, ModifiedBy } = req.body;

    if (!DesignationCode || !Description) {
      return res.status(400).json({ message: "DesignationCode and Description are required" });
    }

    const designation = await createDesignationRepo({
      DesignationCode,
      Description,
      CreatedBy,
      ModifiedBy,
      companyCode
    });

    res.status(201).json({ message: "Designation created successfully", data: designation });
  } catch (error) {
    res.status(500).json({ message: "Error creating designation", error: error.message });
  }
};

const getAll = async (req, res) => {
  try {
    const companyCode = req.auth.companyCode;
    const designations = await getAllDesignationsRepo(companyCode);
    
    res.json({ data: designations });
  } catch (error) {
    res.status(500).json({ message: "Error fetching designations", error: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const companyCode = req.auth.companyCode;
    const { id } = req.params;
    const designation = await getDesignationByIdRepo(id, companyCode);

    if (!designation) {
      return res.status(404).json({ message: "Designation not found" });
    }

    res.json({ data: designation });
  } catch (error) {
    res.status(500).json({ message: "Error fetching designation", error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const companyCode = req.auth.companyCode;
    const { id } = req.params;
    const updated = await updateDesignationRepo(id, req.body, companyCode);

    if (!updated) {
      return res.status(404).json({ message: "Designation not found" });
    }

    res.json({ message: "Designation updated successfully", data: updated });
  } catch (error) {
    res.status(500).json({ message: "Error updating designation", error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const companyCode = req.auth.companyCode;
    const { id } = req.params;
    const deleted = await deleteDesignationRepo(id, companyCode);

    if (!deleted) {
      return res.status(404).json({ message: "Designation not found" });
    }

    res.json({ message: "Designation deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting designation", error: error.message });
  }
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  remove,
};
