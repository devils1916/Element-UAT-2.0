module.exports = (sequelize, DataTypes) => {
  sequelize.define("SalarySlipEmployee", {
    SNo: {
      type: DataTypes.DECIMAL(18, 0),
      primaryKey: true,
      autoIncrement: false,
    },
    SalarySlipCode: { type: DataTypes.STRING(25), allowNull: true },
    AttendenceCode: { type: DataTypes.STRING(25), allowNull: false },
    EmpCode: { type: DataTypes.STRING(50), allowNull: false },
    EmpName: { type: DataTypes.STRING(200), allowNull: false },
    BranchCode: { type: DataTypes.STRING(25), allowNull: true },
    BranchName: { type: DataTypes.STRING(100), allowNull: true },
    Department: { type: DataTypes.STRING(100), allowNull: true },
    Designation: { type: DataTypes.STRING(100), allowNull: true },
    EmpBranchCode: { type: DataTypes.STRING(25), allowNull: true },
    EmpBranchName: { type: DataTypes.STRING(100), allowNull: true },
  }, {
    tableName: "SalarySlipEmployee",
    timestamps: false,
  });
}
