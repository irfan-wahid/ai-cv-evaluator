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

    await queryInterface.createTable('job_applications', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        allowNull: false,
        primaryKey: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      jobVacancyId: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      cv: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      cvEmbedding: {
        type: 'vector(4096)',
        allowNull: false,
      },
      project: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      projectEmbedding: {
        type: 'vector(4096)',
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('QUEUED', 'PROCESSING', 'COMPLETED', 'FAILED'),
        allowNull: false,
        defaultValue: 'QUEUED',
      },
      cvMatchRate: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      cvFeedback: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      projectScore: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      projectFeedback: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      overallSummary: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      rubricScore: {
        type: Sequelize.JSONB,
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
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_job_applications_status";'
    );
  }
};
