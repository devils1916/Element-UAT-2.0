module.exports = (sequelize, DataTypes) => {
    sequelize.define('AttendenceMaster', {
        AttendenceID: {
            type: DataTypes.DECIMAL(18, 0),
            primaryKey: true,
            autoIncrement: true
        },
        CompanyCode: { type: DataTypes.STRING(25), allowNull: true },       // nullable in live
        BranchCode: { type: DataTypes.STRING(25), allowNull: false },       // NOT NULL in live
        BranchName: { type: DataTypes.STRING(25), allowNull: true },        // nullable in live
        AttendenceCode: { type: DataTypes.STRING(25), allowNull: false },   // NOT NULL in live
        AttendenceDate: { type: DataTypes.STRING(50), allowNull: true },           // datetime
        MinDate: { type: DataTypes.STRING(50), allowNull: true },                  // datetime
        MaxDate: { type: DataTypes.STRING(50), allowNull: true },                  // datetime
        AttendenceYear: { type: DataTypes.STRING(10), allowNull: true },     // nullable
        AttendenceMonth: { type: DataTypes.STRING(15), allowNull: true },    // nullable
        TotalDays: { type: DataTypes.DECIMAL(18, 2), allowNull: true },     // nullable
        WorkingDays: { type: DataTypes.DECIMAL(18, 2), allowNull: true },   // nullable
        Holidays: { type: DataTypes.DECIMAL(18, 2), allowNull: true },      // nullable
        WeeklyHolidays: { type: DataTypes.DECIMAL(18, 2), allowNull: true },// nullable
        CreatedBy: { type: DataTypes.STRING(50), allowNull: true },         // nullable
        CreationDate: { type: DataTypes.STRING(50), allowNull: true },             // datetime
        ModifiedBy: { type: DataTypes.STRING(25), allowNull: true },        // nullable
        ModificationDate: { type: DataTypes.STRING(25), allowNull: true },         // datetime
        EmpType: { type: DataTypes.STRING(25), allowNull: false },
        newCompanyCode: { type: DataTypes.STRING(25), allowNull: false },           // NOT NULL in live
    }, {
        tableName: 'AttendenceMaster',
        timestamps: false
    });
}
