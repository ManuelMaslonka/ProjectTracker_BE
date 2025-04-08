const projectsRepository = require("../repository/projects.repository")


const getAll = async (req, res) => {
    let tags = await projectsRepository.getAllTags();
    res.send(tags);
}

module.exports = {
    getAll
}
