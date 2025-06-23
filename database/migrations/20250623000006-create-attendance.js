'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Attendances', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      rehearsalId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Rehearsals',
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
      status: {
        type: Sequelize.ENUM('attending', 'maybe', 'not_attending'),
        allowNull: false,
        defaultValue: 'maybe'
      },
      comment: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      respondedAt: {
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

    // Create a unique constraint on rehearsalId and userId
    await queryInterface.addConstraint('Attendances', {
      fields: ['rehearsalId', 'userId'],
      type: 'unique',
      name: 'unique_rehearsal_attendance'
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Attendances');
  }
};