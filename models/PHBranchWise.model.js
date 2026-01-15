module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        "PHRMBranchWise",
        {
            BranchCode: {
                type: DataTypes.STRING(255),
                allowNull: true
            },
            BranchName: {
                type: DataTypes.STRING(255),
                allowNull: true
            },
            PHEMPID: {
                type: DataTypes.STRING(255),
                allowNull: true
            },
            PHName: {
                type: DataTypes.STRING(255),
                allowNull: true
            },
            id: {
                type: DataTypes.DECIMAL(18, 0),
                primaryKey: true,
                allowNull: false,
                autoIncrement: false
            },
            rmEmail: {
                type: DataTypes.STRING(250),
                allowNull: true
            }
        },
        {
            tableName: "PH_Branch_Wise",
            timestamps: false
        }
    );
};
