'use strict';

module.exports = {
  up: async (queryInterface) => {
    await Promise.all([
      queryInterface.bulkInsert(
        'Users',
        [
          {
            id: '6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b',
            name: 'Admin',
            email: 'viktorr.plotnikov@gmail.com',
            password:
              '$2b$10$DelsctCcQSfJjQLWhlBw.eHBM49JDFcTTGNW232.hCCR9/lch.cTa', // password
            role: 'admin',
            country: 'GB',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        {},
      ),

      queryInterface.bulkInsert(
        'Accounts',
        [
          {
            userId: '6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b',
            balance: 100000,
            reserved: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        {},
      ),
    ]);
  },

  down: async (queryInterface) => {
    await Promise.all([
      queryInterface.bulkDelete('Users', null, {}),
      queryInterface.bulkDelete('Accounts', null, {}),
    ]);
  },
};
