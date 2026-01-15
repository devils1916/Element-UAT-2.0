// File: controllers/departmentController.js
const { createDepartmentRepo, getAllDepartmentsRepo, getDepartmentByIdRepo, updateDepartmentRepo, deleteDepartmentRepo } = require("../repository/departmentMaster.repository");

const create = async (req, res) => {
  try {
    const { DepartmentCode, Description, CreatedBy, ModifiedBy, AuthorisedDepartment } = req.body;

    if (!DepartmentCode || !Description) {
      return res.status(400).json({ message: "DepartmentCode and Description are required" });
    }
    const department = await createDepartmentRepo({
      DepartmentCode,
      Description,
      CreatedBy,
      ModifiedBy,
      AuthorisedDepartment,
    });

    res.status(201).json({ message: "Department created successfully", data: department });
  } catch (error) {
    res.status(500).json({ message: "Error creating department", error: error.message });
  }
};

const getAll = async (req, res) => {
  try {
    const departments = await getAllDepartmentsRepo();
    res.json({ data: departments });
  } catch (error) {
    res.status(500).json({ message: "Error fetching departments", error: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await getDepartmentByIdRepo(id);

    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.json({ data: department });
  } catch (error) {
    res.status(500).json({ message: "Error fetching department", error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await updateDepartmentRepo(id, req.body);

    if (!updated) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.json({ message: "Department updated successfully", data: updated });
  } catch (error) {
    res.status(500).json({ message: "Error updating department", error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await deleteDepartmentRepo(id);

    if (!deleted) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.json({ message: "Department deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting department", error: error.message });
  }
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  remove,
};
