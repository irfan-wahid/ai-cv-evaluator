
import express from "express";
import jobVacancyController from "../controllers/job-vacancy.controller.js";
import jobApplicationController from "../controllers/job-application.controller.js"
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

const routes = (app) => {

    const jobVacancyRouter = express.Router()
    app.use('/job-vacancy', jobVacancyRouter)
    jobVacancyRouter.post('/', jobVacancyController.create)

    const jobApplicationRouter = express.Router()
    app.use('/job-application', jobApplicationRouter)
    jobApplicationRouter.post('/evaluate', jobApplicationController.evaluate)
    jobApplicationRouter.get('/result/:id', jobApplicationController.result)
    jobApplicationRouter.post('/:jobVacancyId', 
        upload.fields([
            { name: "cv", maxCount: 1 },
            { name: "project", maxCount: 1 },
        ]), jobApplicationController.create)
}

export default routes;