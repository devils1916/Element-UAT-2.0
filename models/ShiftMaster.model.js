

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('ShiftMaster', {
        ShiftID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        ShiftCode: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        ShiftName: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        ShiftFrom: {
            type: DataTypes.TIME,
            allowNull: false
        },
        ShiftTo: {
            type: DataTypes.TIME,
            allowNull: false
        },
        Remarks: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        TotalHours: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true
        },
        TotalMinutes: {
            type: DataTypes.DECIMAL(6, 2),
            allowNull: true
        },
        LateAllowed: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        weeklyOffOnSun: { type: DataTypes.BOOLEAN, defaultValue: false },
        weeklyOffOnMon: { type: DataTypes.BOOLEAN, defaultValue: false },
        weeklyOffOnTue: { type: DataTypes.BOOLEAN, defaultValue: false },
        weeklyOffOnWed: { type: DataTypes.BOOLEAN, defaultValue: false },
        weeklyOffOnThu: { type: DataTypes.BOOLEAN, defaultValue: false },
        weeklyOffOnFri: { type: DataTypes.BOOLEAN, defaultValue: false },
        weeklyOffOnSat: { type: DataTypes.BOOLEAN, defaultValue: false },
        HalfOnSun: { type: DataTypes.BOOLEAN, defaultValue: false },
        HalfOnMon: { type: DataTypes.BOOLEAN, defaultValue: false },
        HalfOnTue: { type: DataTypes.BOOLEAN, defaultValue: false },
        HalfOnWed: { type: DataTypes.BOOLEAN, defaultValue: false },
        HalfOnThu: { type: DataTypes.BOOLEAN, defaultValue: false },
        HalfOnFri: { type: DataTypes.BOOLEAN, defaultValue: false },
        HalfOnSat: { type: DataTypes.BOOLEAN, defaultValue: false },
        FullOnSun: { type: DataTypes.BOOLEAN, defaultValue: false },
        FullOnMon: { type: DataTypes.BOOLEAN, defaultValue: false },
        FullOnTue: { type: DataTypes.BOOLEAN, defaultValue: false },
        FullOnWed: { type: DataTypes.BOOLEAN, defaultValue: false },
        FullOnThu: { type: DataTypes.BOOLEAN, defaultValue: false },
        FullOnFri: { type: DataTypes.BOOLEAN, defaultValue: false },
        FullOnSat: { type: DataTypes.BOOLEAN, defaultValue: false },
        BranchCode: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        LateAllowedNew: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        ShiftFromNew: {
            type: DataTypes.TIME,
            allowNull: true
        },
        ShiftToNew: {
            type: DataTypes.TIME,
            allowNull: true
        },
        newCompanyCode: {
            type: DataTypes.STRING(20),
            allowNull: false,
            defaultValue: 'CM00002'
        }
    }, {
        tableName: 'ShiftMaster',
        timestamps: false,
        freezeTableName: true,
    })
};

