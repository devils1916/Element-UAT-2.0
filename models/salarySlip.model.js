module.exports = (sequelize, DataTypes) => {
  sequelize.define('SalarySlip', {
    SalarySlipID: {
      type: DataTypes.DECIMAL(18, 0),
      primaryKey: true,
      autoIncrement: true,
    },
    SalarySlipCode: { type: DataTypes.STRING(25), allowNull: false },
    Months: { type: DataTypes.STRING(50), allowNull: true },
    Years: { type: DataTypes.STRING(25), allowNull: true },
    CompanyCode: { type: DataTypes.STRING(25), allowNull: true },
    BranchCode: { type: DataTypes.STRING(25), allowNull: true },
    BranchName: { type: DataTypes.STRING(200), allowNull: true },
    TakenOn: { type: DataTypes.DATE, allowNull: true },
    IsApproved: { type: DataTypes.BOOLEAN, allowNull: true },
    EmpType: { type: DataTypes.STRING(25), allowNull: false },
    AttendenceCode: { type: DataTypes.STRING(25), allowNull: false },
    neCompanyCode : { type: DataTypes.STRING(100), allowNull: false },
  }, {
    tableName: 'SalarySlipMaster',
    timestamps: false,
  });
}