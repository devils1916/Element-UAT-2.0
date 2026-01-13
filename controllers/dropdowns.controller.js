const {
  getOrgUnits,
  getProfileNames,
  getDepartments,
  getDivisions,
  getSaleOffices,
  getDesignations,
  getEmployeeTypes,
  getChannelDetailUrldb
} = require("../repository/dropdowns.repository.js");

const getOrganizationUnit = async (req, res) => {
  try {
    const organizationUnit = req.query.organizationUnit;
    let data;
    if (organizationUnit) {
      const result = await getOrgUnits().then(results => results.filter(item => item.OrgUnitName.toLowerCase().includes(organizationUnit.toLowerCase())));
      data = { OrgUnitCode: result?.[0]?.OrgUnitCode ?? null };
    } else {
      data = await getOrgUnits();
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getProfileName = async (req, res) => {
  try {
    const profileName = req.query.profileName;
    let data;
    if (profileName) {
      const result = await getProfileNames().then(results => results.filter(item => item.Profile_Name.toLowerCase().includes(profileName.toLowerCase())));
      data = { Profile_Code: result?.[0]?.Profile_Code ?? null };
    }
    else {
      data = await getProfileNames();
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getDepartmentInfo = async (req, res) => {
  try {
    const department = req.query.department;
    let data;
    if (department) {
      const result = await getDepartments().then(results => results.filter(item => item.Dep_Name.toLowerCase().includes(department.toLowerCase())));
      data = { Dep_Code: result?.[0]?.Dep_Code ?? null };
    } else {
      data = await getDepartments();
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getDevision = async (req, res) => {
  try {
    const devision = req.query.devision;
    let data;
    if (devision) {
      const result = await getDivisions().then(results => results.filter(item => item.Division_Name.toLowerCase().includes(devision.toLowerCase())));
      data = { Division_Code: result?.[0]?.Division_Code ?? null };
    } else {
      data = await getDivisions();
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getSaleOfficeUnit = async (req, res) => {
  try {
    const saleOffice = req.query.saleOffice;
    let data;
    if (saleOffice) {
      const result = await getSaleOffices().then(results => results.filter(item => item.Sale_officeName.toLowerCase().includes(saleOffice.toLowerCase())));
      data = { Sale_officeCode: result?.[0]?.Sale_officeCode ?? null };
    } else {
      data = await getSaleOffices();
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getDesignation = async (req, res) => {
  try {

    const designation = req.query.designation;
    let data;
    if (designation) {
      const result = await getDesignations().then(results => results.filter(item => item.DesignationName.toLowerCase().includes(designation.toLowerCase())));
      data = { DesignationCode: result?.[0]?.DesignationCode ?? null };
    } else {
      data = await getDesignations();
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getEmpType = async (req, res) => {
  try {
    const data = await getEmployeeTypes();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getChannelDetailUrl = async (req, res) => {
  try {
    const data = await getChannelDetailUrldb();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getOrganizationUnit,
  getProfileName,
  getDepartmentInfo,
  getDevision,
  getSaleOfficeUnit,
  getDesignation,
  getEmpType,
  getChannelDetailUrl
};