const { DataTypes } = require("sequelize");
const { element } = require('../config/db');

const Resignation = element.define(
    "Resignation",
    {
        Id: {
            type: DataTypes.DECIMAL(18, 0),
            primaryKey: true,
            autoIncrement: true,
        },

        Status: { type: DataTypes.STRING(50), allowNull: true },
        Last_working_date: { type: DataTypes.STRING(50), allowNull: true },
        Pref_last_working_date: { type: DataTypes.STRING(50), allowNull: true },
        Resignation_Date: { type: DataTypes.STRING(50), allowNull: true },
        Reason: { type: DataTypes.STRING(500), allowNull: true },
        Remark: { type: DataTypes.STRING(500), allowNull: true },
        Empcode: { type: DataTypes.STRING(50), allowNull: true },
        EmpName: { type: DataTypes.STRING(200), allowNull: true },
        tlEmpCode: { type: DataTypes.STRING(50), allowNull: true },
        Update_status: { type: DataTypes.STRING(50), allowNull: true },
        Incomplete_status: { type: DataTypes.STRING(50), allowNull: true },
        Incomplete_Status_date: { type: DataTypes.STRING(50), allowNull: true },
        revoke_status: { type: DataTypes.STRING(50), allowNull: true },
        revoke_date: { type: DataTypes.STRING(50), allowNull: true },

        isp_email: { type: DataTypes.STRING(100), allowNull: true },
        rm_email: { type: DataTypes.STRING(100), allowNull: true },
        bh_email: { type: DataTypes.STRING(100), allowNull: true },
        h_email: { type: DataTypes.STRING(100), allowNull: true },
        tl_email: { type: DataTypes.STRING(100), allowNull: true },

        Isp_resg_feedback: { type: DataTypes.STRING(500), allowNull: true },
        Isp_same_org: { type: DataTypes.STRING(500), allowNull: true },
        rm_remarks: { type: DataTypes.STRING(500), allowNull: true },
        rm_same_org: { type: DataTypes.STRING(500), allowNull: true },
        rm_resg_feedback: { type: DataTypes.STRING(500), allowNull: true },

        filePath: { type: DataTypes.STRING(500), allowNull: true },
        fileUrl: { type: DataTypes.TEXT, allowNull: true }, // nvarchar(max)
    },
    {
        tableName: "Resignation",
        timestamps: false,
    }
);
module.exports = Resignation;