import jobVacancyService from "../services/job-vacancy.service.js";

class JobVacancyController {
    create = async (req, res) => {
        try{
            const body = req.body

            if (!body.title || !body.description || !body.studyCaseBrief || !body.scoring_rubric) {
                return res.status(400).json({ message: "title, description, studyCaseBrief, scoring_rubric is required" });
            }

            const jobVacancy = await jobVacancyService.create(body);

            res.status(200).json({
                jobVacancy
            })
        }catch(err){
            console.log(err);
            res.status(500).json({ message: err.message });
        }
    }
}

export default new JobVacancyController();