import JobVacancy from "../models/job-vacancy.model.js";


class JobVacancyRepository {
    create = async(data) => {
        return await JobVacancy.create(data)
    }

    findById = async(id) => {
        return await JobVacancy.findOne({where: { id: id}})
    }
}

export default new JobVacancyRepository();