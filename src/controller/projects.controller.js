const HttpError = require("../utils/HttpError")
const projectsRepository = require("../repository/projects.repository")
const {body, validationResult, matchedData, param} = require("express-validator");
const {checkValidation} = require("../utils/helpers");
const validateProject = require("../utils/validators.utils");
const validateTask = require("../utils/validators.utils");

const get = async (req, res, next) => {
    try {
        console.log(req.user)
        if (!req.user.roles.includes("admin")) {
            throw new HttpError(403, "You are not allowed to access this resource")
        }

        res.send(await projectsRepository.getAll());
    } catch (e) {
        next(e)
    }

}

const getForUser = async (req, res) => {
    res.send(await projectsRepository.getForUser(req.user.userId))
}

const create = [
    ...validateProject,
    async (req, res, next) => {
        try {
            checkValidation(validationResult(req));

            const matched = matchedData(req, {
                includeOptionals: true, onlyValidData: true
            });

            matched.author = req.user.userId;
            await projectsRepository.create(matched);
            res.status(201).send({
                message: "Its created successfully"
            });
        } catch (e) {
            next(e)
        }
    }];

const update = [
    param("id").notEmpty().withMessage("Id is required"),
    ...validateProject,
    async (req, res, next) => {
        try {
            checkValidation(validationResult(req))
            const matched = matchedData(req, {
                onlyValidData: true
            });

            const id = req.params.id;
            const exist = await projectsRepository.findById(id);
            if (!exist) {
                throw new HttpError(404, "Todo not found");
            }

            const newTodo = req.body;
            const userId = req.user.userId;
            await projectsRepository.update(id, newTodo, userId);
            res.send({
                message: "Its updated successfully"
            });
        } catch (error) {
            next(error);
        }
    }];

const addMember = [
    param("id").notEmpty().withMessage("Id is required"),
    body("usersId").notEmpty().withMessage("Users is required").isArray().withMessage("Users must be an array"),
    async (req, res, next) => {
        try {
            checkValidation(validationResult(req));
            const id = req.params.id;

            const exist = await projectsRepository.findById(id);
            if (!exist) {
                throw new HttpError(404, "Todo not found");
            }

            const matched = matchedData(req, {
                onlyValidData: true
            });

            await projectsRepository.addUsersToProject(id, matched.usersId);
            res.send({
                message: "Users added successfully"
            });
        } catch (error) {
            next(error);
        }
    }];


const getById = [
    param("id").notEmpty().withMessage("Id is required"),
    async (req, res, next) => {
        try {
            checkValidation(validationResult(req));
            res.send(
                await projectsRepository.findById(req.params.id)
            )
        } catch (e) {
            next(e)
        }
    }
]

const remove = [
    param("id").notEmpty().withMessage("Id is required"),
    async (req, res, next) => {
        try {
            checkValidation(validationResult(req));
            const id = req.params.id;
            const exist = await projectsRepository.findById(id);
            if (!exist) {
                throw new HttpError(404, "Todo not found");
            }
            await projectsRepository.deleteById(id);
            res.send({
                message: "Its deleted successfully"
            });
        } catch (error) {
            next(error);
        }
    }];

const addTask = [
    param("id").notEmpty().withMessage("Id is required"),
    ...validateTask,
    async (req, res, next) => {
        try {
            checkValidation(validationResult(req));
            const id = req.params.id;
            const exist = await projectsRepository.findById(id);

            if (!exist) {
                throw new HttpError(404, "Project not found");
            }

            const matched = matchedData(req, {
                onlyValidData: true
            });

            await projectsRepository.addTask(id, matched, req.user.userId, exist);
            res.send({
                message: "Task added successfully"
            });
        } catch (error) {
            next(error);
        }
    }];

const setStatus = [
    param("id").notEmpty().withMessage("Id is required"),
    param("status").isIn(['active', 'completed']).withMessage('Status must be either active or completed'),
    async (req, res, next) => {
        try {
            checkValidation(validationResult(req));
            const id = req.params.id;
            const exist = await projectsRepository.findById(id);

            if (!exist) {
                throw new HttpError(404, "Project not found")
            }

            await projectsRepository.setStatus(id, req.params.status)

            res.send({
                message: "status is set"
            })


        } catch (e) {
            next(e)
        }
    }
]


module.exports = {
    get,
    create,
    update,
    getForUser,
    getById,
    remove,
    addTask,
    addMember,
    setStatus
}
