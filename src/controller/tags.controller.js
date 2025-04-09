const projectsRepository = require("../repository/projects.repository")


const getAll = async (req, res) => {
    let tags = await projectsRepository.getAllTags();
    res.send(tags);
}

const getAvailableTags = async (req, res, next) => {
    const projectId = req.params.id;
    if (!projectId) {
        return res.status(400).send({message: "Project ID is required"});
    }

    try {
        const availableTags = await projectsRepository.getAvailableTags(projectId);
        res.send(availableTags);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAll,
    getAvailableTags
}
