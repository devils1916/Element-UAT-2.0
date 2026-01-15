const { DataTypes } = require("sequelize");
const { element } = require("../config/db");

const FullAndFinalSalaryDetail = element.define("FullAndFinalSalaryDetail", {
  FullandFinalCode: { type: DataTypes.STRING(50),  primaryKey: true, },
  HeadCode: { type: DataTypes.STRING(50), },
  HeadName: { type: DataTypes.STRING(200), allowNull: true, },
  Rate: { type: DataTypes.DECIMAL(18, 2), allowNull: true, },
  Amount: { type: DataTypes.DECIMAL(18, 2), allowNull: true, },
  EmpCode: { type: DataTypes.STRING(25), allowNull: true, },
  EarnDedu: { type: DataTypes.STRING(50), allowNull: true, }, // 'Earning' or 'Deduction'
  Arreal: { type: DataTypes.DECIMAL(18, 2), allowNull: true, },
 SNo: { 
    type: DataTypes.INTEGER, 
      // ✅ PK defined here
    // autoIncrement: true // if DB auto-increments SNo
  },
}, {
  tableName: "FullAndFinalSalaryDetail",
  timestamps: false
});

module.exports = FullAndFinalSalaryDetail;
