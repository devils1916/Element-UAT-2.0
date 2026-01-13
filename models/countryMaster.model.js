module.exports = (sequelize, DataTypes) => {
    return sequelize.define("Country",
        {
            CityId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            COUNTRY: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },
            Region: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            STATE: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            CITY: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            Pin: {
                type: DataTypes.STRING(20),
                allowNull: true,
            },
            City_Category: {
                type: DataTypes.STRING(5),
                allowNull: true,
            },
            newCompanyCode: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
        },
        {
            tableName: "CountryMaster",
            timestamps: false,
            freezeTableName: true,
        }
    );

};
