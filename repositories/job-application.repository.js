import JobApplication from "../models/job-application.models.js"

class JobApplicationRepository {
    create = async(data) => {
        return await JobApplication.create(data)
    }

    findById = async(id) => {
        return await JobApplication.findOne({where: { id : id }})
    }

    update = async (id, data) => {
        await JobApplication.update(data, { where: { id : id } });
        const updated = await JobApplication.findOne({where: {id : id}})
        if(!updated){
            return null
        }

        return updated
    }
}

export default new JobApplicationRepository();