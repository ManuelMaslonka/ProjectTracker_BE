const projectModel = require('../model/projects.model');
const taskModel = require("../model/tasks.model");
const HttpError = require("../utils/HttpError");

class ProjectsRepository {

    async update(id, project, userId) {
        try {
            const projectToUpdate = await this.findById(id);

            if (!projectToUpdate) {
                throw new HttpError(404, 'Project not found');
            } else if (projectToUpdate.author.toString() !== userId) {
                throw new HttpError(403, 'You are not allowed to update this project');
            }

            const updatedProject = await projectModel.findByIdAndUpdate(
                id,
                {
                    $set: {
                        title: project.title,
                        description: project.description,
                        due_date: project.due_date,
                        status: project.status,
                        tags: project.tags,
                    },
                    $addToSet: {
                        tasks: {$each: project.tasks || []},
                        users: {$each: project.users || []}
                    }
                },
                {new: true, runValidators: true}
            );

            return updatedProject;

        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    async addTasksToProject(id, taskId) {

        try {
            return await projectModel.findByIdAndUpdate(
                id,
                {$addToSet: {tasks: {$each: taskId}}},
                {new: true}
            );
        } catch (e) {
            console.error(e)
        }

    }

    async create(attr) {
        try {
            const project = new projectModel({
                title: attr.title,
                description: attr.description,
                due_date: attr.due_date,

                author: attr.author,
            });
            await project.save();
        } catch (e) {

        }
    }

    async getAll() {
        return projectModel.find().populate("tasks");
    }

    async getForUser(userId) {
        return projectModel.find().where().or([{author: userId}, {users: userId}]);
    }

    async getAllTaskForUser(userId) {

        const projects = await projectModel.find({
            $or: [
                {author: userId},
                {tasks: {$exists: true, $ne: []}}
            ]
        }).populate({
            path: "tasks",
            match: {author: userId}
        });

        return projects.flatMap(projects => projects.tasks);

    }

    async findById(id) {
        return projectModel.findById(id);
    }

    async addTask(id, task, userId, project) {
        try {

            const newTask = new taskModel({
                title: task.title,
                description: task.description,
                created_at: new Date(),
                due_date: task.due_date,
                state: "open",
                project: project._id,
                author: userId
            })

            await newTask.save();

            return await projectModel.findByIdAndUpdate(
                id,
                {$addToSet: {tasks: newTask._id}},
                {new: true}
            );

        } catch (e) {
            console.error(e);
            throw new HttpError(500, e.message);
        }

    }

    async addUsersToProject(id, usersId) {
        try {
            return await projectModel.findByIdAndUpdate(
                id,
                {$addToSet: {users: {$each: usersId}}},
                {new: true}
            );
        } catch (e) {
            console.error(e);
            throw new HttpError(500, e.message);
        }
    }

    async deleteById(id) {
        try {
            return await projectModel.findByIdAndDelete(id);
        } catch (e) {
            console.error(e);
            throw new HttpError(500, e.message);
        }
    }

    async setStatus(id, status) {
        try {

            console.log(status)
            return await projectModel.findByIdAndUpdate(
                id,
                {status: status},
                {new: true}
            )

        } catch (e) {
            console.error(e)
            throw new HttpError(e);
        }
    }
}

module.exports = new ProjectsRepository();
