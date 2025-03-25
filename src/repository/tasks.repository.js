const taskModel = require('../model/tasks.model');
const {Schema} = require("mongoose");
const HttpError = require("../utils/HttpError");

class TasksRepository {

    async findAll() {
        return taskModel.find();
    }

    async findById(id) {
        return taskModel.findById(id);
    }

    async create(attr, user) {
        try {
            const newTask = new taskModel({
                title: attr.title,
                description: attr.description,
                created_at: new Date(),
                due_date: attr.due_date,
                state: "open",
                project: attr.project,
                assigned_to: attr.assignedTo,
                author: user.userId
            });

            return newTask.save();
        } catch (e) {
            console.error(e)
        }
    }

    async update(id, attr) {
        try {
            console.log(id)
            const taskToUpdate = await taskModel.findById(id);
            console.log(taskToUpdate)
            if (!taskToUpdate) {
                throw new HttpError(404, "Task not found");
            }

            const updatedTask = await taskModel.findByIdAndUpdate(
                id,
                {
                    $set: {
                        title: attr.title,
                        description: attr.description,
                        due_date: attr.due_date,
                        state: attr.state,
                        project: attr.project,
                        assigned_to: attr.assignedTo
                    },
                    $addToSet: {
                        users: {$each: attr.users || []}
                    }
                },
                {
                    new: true,
                    runValidators: true
                }
            );

            return updatedTask;
        } catch (e) {
            console.error(e);
            throw new HttpError(500, "Internal server error");
        }
    }

    async assignTask(id, userId) {
        try {

            await taskModel.findByIdAndUpdate(
                id,
                {
                    $set: {
                        assigned_to: userId
                    }
                },
                {
                    new: true
                }
            )

        } catch (e) {
            console.error(e);
            throw new HttpError(e);
        }
    }

    async setStatus(id, state) {
        try {
            await taskModel.findByIdAndUpdate(
                id,
                {
                    state: state
                },
                {
                    new: true
                }
            );
        } catch (e) {
            console.error(e);
            throw new HttpError(e);
        }
    }

}


module.exports = new TasksRepository();
