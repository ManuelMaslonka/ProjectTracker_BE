const {body, validationResult, matchedData, param} = require("express-validator");
const {checkValidation} = require("../utils/helpers");
const userRepository = require("../repository/user.repository");
const HttpError = require("../utils/HttpError");


const getAll = async (req, res, next) => {
    res.send(await userRepository.getAll());
};

const getUser = async (req, res, next) => {
    res.send(await userRepository.getById(req.user.userId));
}

const getById = async (req, res, next) => {
    res.send(await userRepository.getById(req.params.id));
}

const getAvailableUsersToAdd = async (req, res, next) => {
    const {projectId} = req.params;
    const {users} = await userRepository.getAvailableUsersToAdd(projectId);
    res.send(users);
}

const getAvailableUsersToAssignTask = [
    param("id").notEmpty().withMessage("Id is required"),
    param("taskId").notEmpty().withMessage("Task id is required"),
    async (req, res, next) => {
        try {
            checkValidation(validationResult(req));

            const users = await userRepository.getAvailableUsersToAssignTask(req.params.id, req.params.taskId);
            if (!users) {
                throw new HttpError(404, "Project not found");
            }


            res.send(users);
        } catch (e) {
            next(e);
        }
    }
];

const create = [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Email is required"),
    body("password").notEmpty().withMessage("Password is required"),
    async (req, res, next) => {
        try {
            checkValidation(validationResult(req));
            const data = matchedData(req);
            await userRepository.create(data);
            res.send({message: "User created"});
        } catch (e) {
            next(e);
        }
    }
]

const addRole = [
    param("id").notEmpty().withMessage("Id is required"),
    body("role").notEmpty().withMessage("Role is required").isIn(["admin", "user"]).withMessage("Role must be admin or user"),
    async (req, res, next) => {
        try {
            checkValidation(validationResult(req));
            const data = matchedData(req);
            const user = await userRepository.getById(req.params.id);
            if (!user) {
                throw new HttpError(404, "User not found");
            }
            user.roles = [data.role];
            await user.save();
            res.send(user);
        } catch (e) {
            next(e);
        }
    }
]

module.exports = {
    getAll,
    getById,
    getUser,
    getAvailableUsersToAdd,
    getAvailableUsersToAssignTask,
    create,
    addRole
}
