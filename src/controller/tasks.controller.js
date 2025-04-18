const {body, validationResult, matchedData, param} = require("express-validator");
const {checkValidation} = require("../utils/helpers");
const tasksRepository = require("../repository/tasks.repository");
const projectRepository = require("../repository/projects.repository");
const jwt = require("jsonwebtoken");
const HttpError = require("../utils/HttpError");
const validateTask = require("../utils/validators.utils");
const {all} = require("express/lib/application");

const create = [
    ...validateTask,
    async (req, res, next) => {
        try {
            console.log(req.body);
            checkValidation(validationResult(req));

            const newTask = await tasksRepository.create(req.body, req.user);
            await projectRepository.addTasksToProject(req.body.project, newTask.id);

            res.status(201).send({
                message: "Task created successfully",
            });
        } catch (e) {
            next(e);
        }
    }]
;

const getForUser = async (req, res) => {
    res.send(await projectRepository.getAllTaskForUser(req.user.userId))
}

const findAll = async (req, res, next) => {
    const allTasks = await tasksRepository.findAll();

    res.send(allTasks);
}

const update = [
    param("id").notEmpty().withMessage("Id is required"),
    // ...validateTask,
    async (req, res, next) => {
        try {
            // checkValidation(validationResult(req));
            await tasksRepository.update(req.params.id, req.body);
            res.send({
                message: "Task updated successfully"
            });
        } catch (e) {
            next(e);
        }
    }
]

const findById = async (req, res, next) => {
    param("id").notEmpty().withMessage("Id is required");
    try {
        const task = await tasksRepository.findById(req.params.id);
        if (!task) {
            throw new HttpError(404, "Task not found");
        }
        res.send(task);
    } catch (e) {
        next(e);
    }
}

const assignTask = [
    param("id").notEmpty().withMessage("Id is required"),
    body("assignedTo").notEmpty().withMessage("assigned_to is required"),
    async (req, res, next) => {
        try {
            checkValidation(validationResult(req));

            exist = await tasksRepository.findById(req.params.id);
            if (!exist) {
                throw new HttpError(404, "Task not found");
            }

            await tasksRepository.assignTask(req.params.id, req.body.assignedTo);
            res.send({
                message: "Task assigned successfully"
            });
        } catch (e) {
            next(e);
        }
    }]

const setState = [
    param("id").notEmpty().withMessage("Id is required"),
    param("state").notEmpty().withMessage("State is required").isIn(["open" ,"progress" , "completed"]).withMessage("is only in active or completed"),
    async (req, res, next) => {
        try {

            checkValidation(validationResult(req))

            const exist = await tasksRepository.findById(req.params.id);
            if (!exist) {
                throw new HttpError(404, "not found")
            }

            await tasksRepository.setStatus(req.params.id, req.params.state)

            res.send({
                message: "Set status has been successful"
            })

        } catch (e) {
            next(e)
        }
    }
]

module.exports = {
    create,
    findAll,
    getForUser,
    update,
    findById,
    assignTask,
    setState
}
