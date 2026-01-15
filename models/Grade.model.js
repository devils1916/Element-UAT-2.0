module.exports = (sequelize, DataTypes) => {
    return sequelize.define("Grade",
        {
            GradeID: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            GradeCode: {
                type: DataTypes.STRING(20),
                allowNull: false,
                unique: true,
            },
            GradeName: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            Description: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            CreatedBy: {
                type: DataTypes.STRING(10),
                allowNull: false,
            },
            ModifiedBy: {
                type: DataTypes.STRING(10),
                allowNull: false,
            },
            newCompanyCode: {
                type: DataTypes.STRING(20),
                allowNull: false,
            },
        },
        {
            tableName: "GradeMaster",
            timestamps: false,
            freezeTableName: true,
        }
    );
};
