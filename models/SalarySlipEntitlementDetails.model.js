module.exports = (sequelize, DataTypes) => {
  sequelize.define("SalarySlipEntitlementDetails", {
    SNo: {
      type: DataTypes.DECIMAL(18, 0),
      primaryKey: true,
      allowNull: false
    },
    SalarySlipCode: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    HeadCode: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Rate: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true
    },
    Amount: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true
    },
    EmpCode: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    EarnDedu: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Arrear: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
      defaultValue: 0
    }
  }, {
    tableName: "SalarySlipEntitlementDetails",
    timestamps: false
  });
}
