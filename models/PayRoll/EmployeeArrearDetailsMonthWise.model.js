const { DataTypes } = require("sequelize");
const { element } = require("../../config/db");

const ArrearDetailsMonthWise = element.define(
  "ArrearDetailsMonthWise",
  {
    TransactionCode: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    HeadCode: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    HeadName: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    HeadType: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    ArrearMonth: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    Arrear: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    SNo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    }
  },
  {
    tableName: "EmployeeArrearMonthWise", 
    timestamps: false, 
  }
);

module.exports= ArrearDetailsMonthWise;
