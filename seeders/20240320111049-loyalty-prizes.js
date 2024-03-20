'use strict';

const LoyaltyPrizes = 'LoyaltyPrizes';
const LoyaltyStatuses = 'LoyaltyStatuses';

module.exports = {
  up: async (queryInterface) => {
    await getLoyaltyStatuses(queryInterface);
    await getLoyaltyPrizes(queryInterface);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete(LoyaltyStatuses, null, {});
    await queryInterface.bulkDelete(LoyaltyPrizes, null, {});
  },
};

function getLoyaltyStatuses(queryInterface) {
  return queryInterface.bulkInsert(
    LoyaltyStatuses,
    [
      {
        name: 'executive',
        points: 0,
        deposit: 0,
        prizeCoef: 0.5,
        expiresAfterDays: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'silver',
        points: 1,
        deposit: 250,
        prizeCoef: 0.5,
        expiresAfterDays: 30,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'gold',
        points: 100,
        deposit: 5000,
        prizeCoef: 0.5,
        expiresAfterDays: 60,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'diamond',
        points: 1000,
        deposit: 50000,
        prizeCoef: 0.6,
        expiresAfterDays: 90,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'elite',
        points: 20000,
        deposit: 1000000,
        prizeCoef: 0.8,
        expiresAfterDays: 120,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    {},
  );
}

function getLoyaltyPrizes(queryInterface) {
  return queryInterface.bulkInsert(
    LoyaltyPrizes,
    [
      // silver
      {
        name: 'VPS-server',
        description: 'VPS-server description',
        loyalty: 'silver',
        points: 20,
        country: 'GB',
        enabled: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Cashback $10',
        description: 'Cashback $10',
        loyalty: 'silver',
        points: 40,
        country: 'US',
        enabled: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Signed Haas Posters',
        description: 'Signed Haas Posters',
        loyalty: 'silver',
        points: 60,
        country: 'US',
        enabled: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Hantec Souvenir Collection',
        description: 'Hantec Souvenir Collection',
        loyalty: 'silver',
        points: 80,
        country: 'GB',
        enabled: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // gold
      {
        name: 'iphones / Galaxy',
        description: 'iphones / Galaxy',
        loyalty: 'gold',
        points: 110,
        country: 'US',
        enabled: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Signed Haas Helmets',
        description: 'Signed Haas Helmets',
        loyalty: 'gold',
        points: 150,
        country: 'GB',
        enabled: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Haas Merchandise',
        description: 'Haas Merchandise',
        loyalty: 'gold',
        points: 200,
        country: 'US',
        enabled: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Cashback $100',
        description: 'Haas Merchandise',
        loyalty: 'gold',
        points: 400,
        country: 'GB',
        enabled: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'High Priority Deposit and Withdrawal processing',
        description: 'High Priority Deposit and Withdrawal processing',
        loyalty: 'gold',
        points: 220,
        country: 'US',
        enabled: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'High Priority Customer requests via online chat',
        description: 'High Priority Customer requests via online chat',
        loyalty: 'gold',
        points: 250,
        country: 'GB',
        enabled: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // diamond
      {
        name: 'GP tickets',
        description: 'GP tickets',
        loyalty: 'diamond',
        points: 1000,
        country: 'US',
        enabled: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Macbook',
        description: 'Macbook',
        loyalty: 'diamond',
        points: 1200,
        country: 'GB',
        enabled: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'A Luxury Watch',
        description: 'A Luxury Watch',
        loyalty: 'diamond',
        points: 3000,
        country: 'GB',
        enabled: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'An iMac',
        description: 'An iMac',
        loyalty: 'diamond',
        points: 4000,
        country: 'US',
        enabled: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Personal Manager',
        description: 'Personal Manager',
        loyalty: 'diamond',
        points: 5000,
        country: 'GB',
        enabled: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // elite
      {
        name: 'A trip to Dubai ',
        description: 'A trip to Dubai ',
        loyalty: 'elite',
        points: 10000,
        country: 'US',
        enabled: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'A Supercar / Sports Car',
        description: 'A Supercar / Sports Car',
        loyalty: 'elite',
        points: 100000,
        country: 'GB',
        enabled: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'A private Yacht Holiday',
        description: 'A private Yacht Holiday',
        loyalty: 'elite',
        points: 200000,
        country: 'US',
        enabled: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    {},
  );
}
