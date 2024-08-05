'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    //Se agrega una nueva columna de username para la table users
    await queryInterface.addColumn('users', 'userName', {
      type: Sequelize.STRING,
      allowNull: false   // Permitir valores NULL temporalmente y luego hacer un cambio con un scripts y nueva migración.
    });
  },

  async down (queryInterface, Sequelize) {
    // Se habilita la posibilidad de poder revertir los cambios en la base de datos.
    await queryInterface.removeColumn('users', 'userName');
  }
};
