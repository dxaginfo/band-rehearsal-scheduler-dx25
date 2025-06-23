const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Resource extends Model {
    static associate(models) {
      // Define associations here
      Resource.belongsTo(models.Rehearsal, {
        foreignKey: 'rehearsalId',
        as: 'rehearsal'
      });

      Resource.belongsTo(models.User, {
        foreignKey: 'uploadedBy',
        as: 'uploader'
      });
    }
  }

  Resource.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    rehearsalId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Rehearsals',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('setlist', 'sheet_music', 'recording', 'other'),
      allowNull: false
    },
    fileUrl: {
      type: DataTypes.STRING,
      allowNull: false
    },
    uploadedBy: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    uploadedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Resource',
    timestamps: true
  });

  return Resource;
};