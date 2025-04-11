const projectModel = require('../model/projects.model');
const taskModel = require("../model/tasks.model");
const HttpError = require("../utils/HttpError");

class ProjectsRepository {

    async addTag(id, tag, user) {
        try {
            const projectToUpdate = await this.findById(id);
            if (!projectToUpdate) {
                throw new HttpError(404, 'Project not found');
            }
            if (projectToUpdate.author.toString() !== user.userId.toString()) {
                if (!user.roles.includes("admin")) {
                    throw new HttpError(403, 'You are not allowed to update this project');
                }
            }

            const updatedProject = await projectModel.findByIdAndUpdate(
                id,
                {
                    $addToSet: {
                        tags: tag
                    }
                },
                {
                    new: true
                }
            )
            return updatedProject;
        } catch (e) {
            console.error(e);
            throw new HttpError(500, e.message);
        }
    }

    async removeTag(id, tag, user) {
        try {
            const projectToUpdate = await this.findById(id);
            if (!projectToUpdate) {
                throw new HttpError(404, 'Project not found');
            }
            if (projectToUpdate.author.toString() !== user.userId.toString()) {
                if (!user.roles.includes("admin")) {
                    throw new HttpError(403, 'You are not allowed to update this project');
                }
            }

            console.log(tag)

            const updatedProject = await projectModel.findByIdAndUpdate(
                id,
                {
                    $pull: {
                        tags: tag
                    }
                },
                {
                    new: true
                }
            )
            return updatedProject;
        } catch (e) {
            console.error(e);
            throw new HttpError(500, e.message);
        }
    }

    async update(id, project, userId) {
        try {
            const projectToUpdate = await this.findById(id);

            if (!projectToUpdate) {
                throw new HttpError(404, 'Project not found');
            } else if (projectToUpdate.author.toString() !== userId) {
                throw new HttpError(403, 'You are not allowed to update this project');
            }

            if (project.status !== null) {
                await this.setStatus(id, project.status);
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
            console.log(attr)
            const project = new projectModel({
                title: attr.title,
                description: attr.description,
                due_date: attr.due_date,
                status: "active",
                tags: [...attr.tags],
                author: attr.author,
                users: []
            });
            await project.save();
        } catch (e) {

        }
    }

    async getAll() {
        return projectModel.find().populate("tasks");
    }

    async getAllTags() {
        return projectModel.find().distinct("tags");
    }

    async getForUser(userId) {
        return projectModel.find().where().or([{author: userId}, {users: userId}]).populate("author", "name email _id");
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

    async findByIdWithTasksAndAuthorAndAsssinged(id) {
        return projectModel.findById(id)
            .populate({
                path: "tasks",
                populate: [{path: "assigned_to"}, {path: "author", select: "name email _id"}]
            })
            .populate("author", "name email _id")
            .populate("users", "name email _id");

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
                author: userId,
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

            if (status == "active") {
                return await projectModel.findByIdAndUpdate(
                    id,
                    {status: status},
                    {new: true}
                )
            } else if (status == "completed") {

                const project = await projectModel.findById(id).populate("tasks");
                if (!project) {
                    throw new HttpError(404, 'Project not found');
                }

                await taskModel.updateMany(
                    {_id: {$in: project.tasks}},
                    {state: "completed"}
                );

                return await projectModel.findByIdAndUpdate(
                    id,
                    {status: status},
                    {new: true}
                )

            }

        } catch (e) {
            console.error(e)
            throw new HttpError(e);
        }
    }

    async removeTask(id, taskId) {
        try {
            return await projectModel.findByIdAndUpdate(
                id,
                {$pull: {tasks: taskId}},
                {new: true}
            );
        } catch (e) {
            console.error(e);
            throw new HttpError(500, e.message);
        }
    }

    async removeMember(id, userId) {
        try {
            return await projectModel.findByIdAndUpdate(
                id,
                {$pull: {users: userId}},
                {new: true}
            );
        } catch (e) {
            console.error(e);
            throw new HttpError(500, e.message);
        }
    }

    async getAllMembers(id) {
        try {
            const project = await projectModel.findById(id).populate("users", "name email _id");
            if (!project) {
                throw new HttpError(404, 'Project not found');
            }
            return project.users;
        } catch (e) {
            console.error(e);
            throw new HttpError(500, e.message);
        }
    }

    async getAvailableTags(id) {
        try {
            const project = await projectModel.findById(id);
            if (!project) {
                throw new HttpError(404, 'Project not found');
            }

            const allTags = await this.getAllTags();

            const tagsOfProject = project.tags || [];

            if (tagsOfProject.length === 0) {
                return allTags;
            }

            return allTags.filter(tag => !tagsOfProject.includes(tag));
        } catch (e) {
            console.error(e);
            throw new HttpError(500, e.message);
        }
    }
}

module.exports = new ProjectsRepository();
