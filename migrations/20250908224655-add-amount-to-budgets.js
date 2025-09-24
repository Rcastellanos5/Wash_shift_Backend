'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    await queryInterface.addColumn('budgets', 'amount', {
      type: Sequelize.INTEGER,
      allowNull: false,   // o true si quieres que sea opcional
      defaultValue: 0     // opcional: valor por defecto
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('budgets', 'amount');
  }
};
