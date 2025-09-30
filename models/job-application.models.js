const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const JobVacancy = sequelize.define("JobApplication", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
    jobVacancyId: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    cv: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    cvEmbedding: {
      type: "VECTOR(4096)",
      allowNull: false,
    },
    project: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    projectEmbedding: {
      type: "VECTOR(4096)",
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('QUEUED', 'PROCESSING', 'COMPLETED', 'FAILED'),
      allowNull: false,
      defaultValue: 'QUEUED',
    },
    cvMatchRate: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    cvFeedback: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    projectScore: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    projectFeedback: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    overallSummary: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    rubricScore: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
},
{
    tableName: "job_applications",
    timestamps: false,
}
);

module.exports = JobVacancy;