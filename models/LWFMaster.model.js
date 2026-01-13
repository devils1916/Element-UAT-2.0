const { DataTypes } = require("sequelize");
const { element } = require("../config/db");


const LWF = element.define('lwfMaster', {
  Id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  Location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  State: {
    type: DataTypes.STRING,
    allowNull: false
  },
  EmpShare: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  ERShare: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  Deduction: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'lwfMaster', 
  timestamps: false
});

module.exports = LWF;
