import cohereService from './cohere-ai.service.js';
import jobVacancyRepository from '../repositories/job-vacancy.repository.js';
import { toPgVector } from '../utilities/index.js';

class JobVacancyService {
    create = async(data) => {
        const descriptionEmbedding = await cohereService.generateEmbedding(data.description);
        const studyCaseBriefEmbedding = await cohereService.generateEmbedding(data.studyCaseBrief);

        const rubricText = `CV scoring criteria: ${data.scoringRubric.cv.join(", ")}. 
                            Project scoring criteria: ${data.scoringRubric.project.join(", ")}.`;
        const scoringRubricEmbedding = await cohereService.generateEmbedding(rubricText);

        const jobVacancy = {
            title: data.title,
            description: data.description,
            descriptionEmbedding: toPgVector(descriptionEmbedding),
            studyCaseBrief: data.studyCaseBrief,
            studyCaseBriefEmbedding: toPgVector(studyCaseBriefEmbedding),
            scoringRubric: data.scoringRubric,
            scoringRubricEmbedding: toPgVector(scoringRubricEmbedding)
        }

        const created = await jobVacancyRepository.create(jobVacancy)

        return created
    }
}

export default new JobVacancyService();