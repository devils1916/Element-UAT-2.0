module.exports = (sequelize, DataTypes) => {
  sequelize.define('SequenceMaster1', {
    ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    CompanyCode: {
      type: DataTypes.STRING(25)
    },
    CompanyPrefix: {
      type: DataTypes.STRING(25)
    },
    BranchCode: {
      type: DataTypes.STRING(25)
    },
    BranchName: {
      type: DataTypes.STRING(100)
    },
    BranchPrefix: {
      type: DataTypes.STRING(25)
    },
    Head: {
      type: DataTypes.STRING(100)
    },
    Prefix: {
      type: DataTypes.STRING(25)
    },
    Start: {
      type: DataTypes.INTEGER
    },
    Stop: {
      type: DataTypes.INTEGER
    },
    Increment: {
      type: DataTypes.INTEGER
    },
    LastValue: {
      type: DataTypes.INTEGER
    },
    FinancialYear: {
      type: DataTypes.INTEGER
    },
    newCompanyCode: {
      type: DataTypes.STRING(200)
    } 
  }, {
    tableName: 'SequenceMaster1',
    timestamps: false
  });
};