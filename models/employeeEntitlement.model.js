const { DataTypes } = require('sequelize');
const { element } = require('../config/db');

const EmployeeSalary = element.define('EmployeeEntitle', {
    EmpCode: {
        type: DataTypes.STRING(25),
        allowNull: false
    },
    sno: {
        type: DataTypes.DOUBLE,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true 
    },
    SalHead: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    isEditable: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }, FixedAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: true
    },
    Entitle: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: true
    },
    changedDate: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    Remarks: {
        type: DataTypes.STRING(1000),
        allowNull: false
    },
    EntCatg: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    Type: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    Deduction: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false
    },
    LedgerCode: {
        type: DataTypes.STRING(25),
        allowNull: true
    },
    newCompanyCode   : {
            type : DataTypes.STRING(100),
            defaultValue: ''
        }
}, {
    tableName: 'EmployeeEntitlement',
    timestamps: false
});

module.exports = EmployeeSalary;
