import Redis from 'ioredis';
import 'dotenv/config'
import jobApplicationService from '../../services/job-application.service.js';
import jobApplicationRepository from '../../repositories/job-application.repository.js';
import { Worker } from 'bullmq';

const connection = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || '6380',
    maxRetriesPerRequest: null
})

const worker = new Worker(
  "evaluation",
  async (job) => {
    console.log(`Processing job: ${job.name}`, job.data);

    if (job.name === "evaluate") {
      const {
        applicationId,
        cvPath,
        cvEmbedding,
        projectPath,
        projectEmbedding,
        jobVacancy,
      } = job.data;

      try {
        const result = await jobApplicationService.evaluateCv(
          cvPath,
          cvEmbedding,
          projectPath,
          projectEmbedding,
          jobVacancy
        );

        await jobApplicationRepository.update(applicationId, {
          status: "COMPLETED",
          cvMatchRate: result.cvMatchRate,
          cvFeedback: result.cvFeedback,
          projectScore: result.projectScore,
          projectFeedback: result.projectFeedback,
          overallSummary: result.overallSummary,
          rubricScore: result.rubricScore,
        });

        console.log(`Job ${applicationId} selesai dievaluasi`);
      } catch (err) {
        console.error(`Gagal memproses job ${applicationId}`, err);

        await jobApplicationRepository.update(applicationId, {
          status: 'FAILED'
        });

        throw err;
      }
    }
  },
  { connection }
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`Job ${job.id} failed`, err);
});

export default worker;