const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {
    static associate(models) {
      // Define associations here
      Attendance.belongsTo(models.Rehearsal, {
        foreignKey: 'rehearsalId',
        as: 'rehearsal'
      });

      Attendance.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
    }
  }

  Attendance.init({
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
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.ENUM('attending', 'maybe', 'not_attending'),
      allowNull: false,
      defaultValue: 'maybe'
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    respondedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Attendance',
    timestamps: true
  });

  return Attendance;
};