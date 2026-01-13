module.exports = (sequelize, DataTypes) => {
  return sequelize.define('BranchCommercialHead', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    BranchCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    BranchName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    BranchHeadId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    BranchHeadName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    BranchHeadEmail: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ComHeadId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ComHeadName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ComHeadEmail: {
      type: DataTypes.STRING,
      allowNull: true
    },
    CreateDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    CreateBy: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'BranchCommercialHeadList', 
    timestamps: false ,
    freezeTableName: true,        
  });
};
