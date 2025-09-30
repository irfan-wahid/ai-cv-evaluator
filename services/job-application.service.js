import cohereService from './cohere-ai.service.js';
import jobVacancyRepository from '../repositories/job-vacancy.repository.js';
import { promises as fs } from 'fs';
import jobApplicationRepository from '../repositories/job-application.repository.js';
import path from 'path';
import { loadPdfText, simmilarity, toPgVector } from '../utilities/index.js';
import evaluationQueue from '../queues/evaluation.queue.js';

class JobApplicationService {
    create = async(jobVacancyId, cvFile, projectFile) => {
        if (!cvFile || !projectFile) {
            throw new Error('CV dan project wajib diunggah');
        }

        if (cvFile.mimetype !== 'application/pdf' || projectFile.mimetype !== 'application/pdf') {
            throw new Error('Hanya file PDF yang diizinkan');
        }

        const jobVacancy = await jobVacancyRepository.findById(jobVacancyId)
        if(!jobVacancy){
            throw new Error("Data lowongan pekerjaan tidak ditemukan")
        }

        const uploadDir = path.join(process.cwd(), 'uploads');
        await fs.mkdir(uploadDir, {recursive: true});

        const cvPath = path.join(uploadDir, `${Date.now()}_${cvFile.originalname}`);
        const projectPath = path.join(uploadDir, `${Date.now()}_${projectFile.originalname}`);

        await fs.writeFile(cvPath, cvFile.buffer);
        await fs.writeFile(projectPath, projectFile.buffer);

        const cvText = await loadPdfText(cvPath);
        const projectText = await loadPdfText(projectPath);

        const cvEmbedding = await cohereService.generateEmbedding(cvText);
        const projectEmbedding = await cohereService.generateEmbedding(projectText);

        const created = await jobApplicationRepository.create({
            jobVacancyId: jobVacancyId,
            cv: cvPath,
            cvEmbedding: toPgVector(cvEmbedding),
            project: projectPath,
            projectEmbedding: toPgVector(projectEmbedding),
            status: 'QUEUED'
        })

        return created
    }

    result = async(id) => {
        const jobApplication = await jobApplicationRepository.findById(id);
        if(!jobApplication){
            throw new Error("Data lamaran pekerjaan tidak ditemukan")
        }

        if(jobApplication.status === 'QUEUED' || jobApplication.status === 'PROCESSING' || jobApplication.status === 'FAILED'){
            return {
                id: jobApplication.id,
                status: jobApplication.status,
            }
        }else{
            return{
                id: jobApplication.id,
                status: jobApplication.status,
                result: {
                    cv_match_rate: jobApplication.cvMatchRate,
                    cv_feedback: jobApplication.cvFeedback,
                    project_score: jobApplication.projectScore,
                    project_feedback: jobApplication.projectFeedback,
                    overallSummary: jobApplication.overallSummary
                }
            }    
        }
    }

    runEvaluate = async(id) => {
        const jobApplication = await jobApplicationRepository.findById(id);
        if(!jobApplication){
            throw new Error("Data lamaran pekerjaan tidak ditemukan")
        }

        const jobVacancy = await jobVacancyRepository.findById(jobApplication.jobVacancyId)
        if(!jobVacancy){
            throw new Error("Data lowongan pekerjaan tidak ditemukan")
        }

        const updated = await jobApplicationRepository.update(id, { status: "PROCESSING" });
        if(!updated){
            throw new Error("Gagal mengubah data lamaran pekerjaan")
        }

        await evaluationQueue.addEvaluationJob({
            applicationId: id,
            cvPath: path.resolve(jobApplication.cv),
            cvEmbedding: jobApplication.cvEmbedding,
            projectPath: path.resolve(jobApplication.project),
            projectEmbedding: jobApplication.projectEmbedding,
            jobVacancy: jobVacancy,
        });

        return {
            id: updated.id,
            status: "QUEUED",
        }
    }

    evaluateCv = async(cvPath, cvEmbedding, projectPath, projectEmbedding, jobVacancy) => {
        const cvText = await loadPdfText(cvPath);
        const projectText = await loadPdfText(projectPath);

        const cvEmbeddingArray = typeof cvEmbedding === 'string' 
            ? JSON.parse(cvEmbedding) 
            : cvEmbedding;

        const projectEmbeddingArray = typeof projectEmbedding === 'string' 
            ? JSON.parse(projectEmbedding) 
            : projectEmbedding;

        const descriptionEmbeddingArray = typeof jobVacancy.descriptionEmbedding === 'string'
            ? JSON.parse(jobVacancy.descriptionEmbedding)
            : jobVacancy.descriptionEmbedding;

        const studyCaseBriefEmbeddingArray = typeof jobVacancy.studyCaseBriefEmbedding === 'string'
            ? JSON.parse(jobVacancy.studyCaseBriefEmbedding)
            : jobVacancy.studyCaseBriefEmbedding;

        const cvMatchRate = simmilarity(cvEmbeddingArray, descriptionEmbeddingArray);
        const projectScore = simmilarity(projectEmbeddingArray, studyCaseBriefEmbeddingArray);
        
        const rubricCv = Array.isArray(jobVacancy.scoringRubric?.cv)
            ? jobVacancy.scoringRubric.cv
            : [];
        const rubricProject = Array.isArray(jobVacancy.scoringRubric?.project)
            ? jobVacancy.scoringRubric.project
            : [];

        const feedbackPrompt = `
            You are evaluating a candidate. Return JSON only, no explanation.
            Job description: ${jobVacancy.description}
            Study case: ${jobVacancy.studyCaseBrief}
            Candidate CV: ${cvText}
            Candidate Project: ${projectText}

            Scoring rubric:
            CV: ${rubricCv.join(", ")}
            Project: ${rubricProject.join(", ")}

            Instructions:
            - For each CV rubric item, give a numeric score (1–5) and feedback.
            - For each Project rubric item, give a numeric score (1–5) and feedback.
            - Also provide overall summary.

            JSON format:
            {
                "cvFeedback": "string",
                "projectFeedback": "string",
                "overallSummary": "string",
                "rubricScore": {
                    "cv": { "<rubric_name>": number },
                    "project": { "<rubric_name>": number }
                }
            }
        `

        const feedbackText = await cohereService.generateText(feedbackPrompt);

        const cleanText = feedbackText.trim().replace(/^```json\s*/, "").replace(/```$/, "").trim();
        var feedback;
        try {
            feedback = JSON.parse(cleanText);
        } catch (err) {
            throw new Error("Model did not return valid JSON: " + feedbackText);
        }

        return{
            cvMatchRate,
            projectScore,
            cvFeedback: feedback.cvFeedback,
            projectFeedback: feedback.projectFeedback,
            overallSummary: feedback.overallSummary,
            rubricScore: feedback.rubricScore,
        }
    }
}

export default new JobApplicationService();