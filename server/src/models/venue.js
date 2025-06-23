const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Venue extends Model {
    static associate(models) {
      // Define associations here
      Venue.belongsTo(models.Band, {
        foreignKey: 'bandId',
        as: 'band'
      });

      Venue.hasMany(models.Rehearsal, {
        foreignKey: 'venueId',
        as: 'rehearsals'
      });
    }
  }

  Venue.init({
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
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Venue',
    timestamps: true
  });

  return Venue;
};