const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const JobVacancy = sequelize.define("JobVacancy", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  descriptionEmbedding: { 
    type: "VECTOR(4096)",
    allowNull: false,
  },
  studyCaseBrief: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  studyCaseBriefEmbedding: {
    type: "VECTOR(4096)",
    allowNull: false,
  },
  scoringRubric: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  scoringRubricEmbedding: {
    type: "VECTOR(4096)",
    allowNull: true,
  },
},
{
    tableName: "job_vacancies",
    timestamps: false,
  }
);

module.exports = JobVacancy;