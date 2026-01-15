// middleware/models/branchMaster.model.js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Branch",
    {
      BranchId: {
        type: DataTypes.DECIMAL(18, 0),
        autoIncrement: true,
        primaryKey: true,
      },
      Name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      Code: {
        type: DataTypes.STRING(25),
        allowNull: false,
        unique: true,
      },
      CompanyCode: {
        type: DataTypes.STRING(25),
        allowNull: false,
      },
      incharge: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      con_per: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      city: {
        type: DataTypes.DECIMAL(18, 0),
        allowNull: true,
      },
      pincode: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      faxno: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      phoneno: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      website: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      remark: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      createdBy: {
        type: DataTypes.STRING(25),
        allowNull: true,
      },
      createdOn: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      modifiedBy: {
        type: DataTypes.STRING(25),
        allowNull: true,
      },
      Category: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      ESICNo: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      UPTinNo: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      Prefix: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      MobileNo: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      TinNo: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      CSTNo: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      ServiceTaxRegNo: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      PanNo: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      PANCircNo: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      PANWardNo: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      HGSTNo: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      ExcemptionNo: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      TANNo: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      ECCNo: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      CERegNo: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      CERange: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      CEDivision: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      CEComm: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      newCompanyCode: {
            type: DataTypes.STRING(100),
            defaultValue: ''
        }
    },
    {
      tableName: "BranchMaster",
      timestamps: false,
      freezeTableName: true, 
    }
  );
};
