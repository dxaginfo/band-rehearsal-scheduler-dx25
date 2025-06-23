const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class BandMember extends Model {
    static associate(models) {
      // Define associations here
      // This is a junction table, so no direct associations needed
    }
  }

  BandMember.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    bandId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Bands',
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    role: {
      type: DataTypes.ENUM('admin', 'member'),
      defaultValue: 'member',
      allowNull: false
    },
    instruments: {
      type: DataTypes.STRING,
      allowNull: true
    },
    joinedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'BandMember',
    timestamps: true
  });

  return BandMember;
};