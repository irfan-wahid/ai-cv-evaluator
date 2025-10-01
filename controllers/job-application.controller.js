import jobApplicationService from "../services/job-application.service.js";

class JobApplicationController {
    create = async (req, res) => {
        try{
            const jobVacancyId = req.params.jobVacancyId;
            const cvFile = req.files.cv?.[0];
            const projectFile = req.files.project?.[0];

            // Validasi input
            if (!jobVacancyId) {
                return res.status(400).json({ message: "Job vacancy ID is required" });
            }
            if (!cvFile) {
                return res.status(400).json({ message: "CV file is required" });
            }
            if (!projectFile) {
                return res.status(400).json({ message: "Project file is required" });
            }

            const result = await jobApplicationService.create(
                jobVacancyId,
                cvFile,
                projectFile
            )

            res.status(201).json(result)
        }catch(err){
            console.log(err);
            res.status(500).json({ message: err.message });
        }
    }

    evaluate = async (req, res) => {
        try{
            const id = req.body.id;
            if (!id) {
                return res.status(400).json({ message: "ID is required" });
            }

            const evaluate = await jobApplicationService.runEvaluate(id)

            res.status(201).json(evaluate)
        }catch(err){
            console.log(err);
            res.status(500).json({ message: err.message });
        }
    }

    result = async (req, res) => {
        try{
            const id = req.params.id;
            if (!id) {
                return res.status(400).json({ message: "Job vacancy ID is required" });
            }

            const result = await jobApplicationService.result(id)

            res.status(201).json(result)
        }catch(err){
            console.log(err);
            res.status(500).json({ message: err.message })
        }
    }
}

export default new JobApplicationController();