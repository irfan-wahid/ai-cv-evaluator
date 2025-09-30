'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.sequelize.query(`CREATE EXTENSION IF NOT EXISTS vector;`);

    await queryInterface.createTable('job_vacancies', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        primaryKey: true,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      descriptionEmbedding: {
        type: 'VECTOR(4096)',
        allowNull: true,
      },
      studyCaseBrief: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      studyCaseBriefEmbedding: {
        type: 'VECTOR(4096)',
        allowNull: true,
      },
      scoringRubric: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      scoringRubricEmbedding: {
        type: 'VECTOR(4096)',
        allowNull: true,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('job_applications');
  }
};
