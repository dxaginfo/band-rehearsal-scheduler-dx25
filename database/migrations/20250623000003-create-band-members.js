'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('BandMembers', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      bandId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Bands',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      role: {
        type: Sequelize.ENUM('admin', 'member'),
        defaultValue: 'member',
        allowNull: false
      },
      instruments: {
        type: Sequelize.STRING,
        allowNull: true
      },
      joinedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Create a unique constraint on bandId and userId
    await queryInterface.addConstraint('BandMembers', {
      fields: ['bandId', 'userId'],
      type: 'unique',
      name: 'unique_band_member'
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('BandMembers');
  }
};