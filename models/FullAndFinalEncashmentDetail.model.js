const { DataTypes } = require("sequelize");
const { element } = require("../config/db");

const FullAndFinalEncashmentDetail = element.define("FullAndFinalEncashmentDetail", {
  FullandFinalCode: { type: DataTypes.STRING(50), primaryKey: true },
  Type: { type: DataTypes.STRING(200) },
  Days: { type: DataTypes.DECIMAL(18, 2) },
  PlusMinus: { type: DataTypes.STRING(5) }, // '+' or '-'
  Amount: { type: DataTypes.DECIMAL(18, 2) },
 SNo: { 
     type: DataTypes.INTEGER,
    primaryKey: true // if DB auto-increments SNo
  },
}, {
  tableName: "FullAndFinalEncashmentDetail",
  timestamps: false
});

module.exports = FullAndFinalEncashmentDetail;
