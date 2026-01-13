const { DataTypes } = require("sequelize");
const { element } = require('../config/db');

const LoiInformation = element.define(
    "LoiInformation",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        req_no: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        mobile: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        empId: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        loiStatus: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        loiReleasedDate: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        status: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
    },
    {
        tableName: "Loi_information",
        timestamps: false,
    }
);
module.exports = LoiInformation;