'use strict';
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    return queryInterface.bulkInsert('Users', [
      {
        id: uuidv4(),
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: hashedPassword,
        phone: '555-123-4567',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        password: hashedPassword,
        phone: '555-987-6543',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        firstName: 'Mike',
        lastName: 'Johnson',
        email: 'mike@example.com',
        password: hashedPassword,
        phone: '555-555-5555',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};