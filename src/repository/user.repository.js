const crypto = require("crypto");
const userModel = require('../model/user.model');
const HttpError = require("../utils/HttpError");
const projectModel = require("../model/projects.model");
const taskModel = require("../model/tasks.model");


class UserRepository {

    async getAll() {
        return userModel.User.find();
    }

    async findUserByEmail(email) {
        return userModel.User.findOne({email: email});
    }

    async getById(id) {
        return userModel.User.findById(id);
    }


    async create(attr) {
        try {
            const salt = crypto.randomBytes(16).toString("hex");


            const user = new userModel.User({
                name: attr.name,
                email: attr.email,
                salt: salt,
                password: crypto.pbkdf2Sync(attr.password, salt, 1000, 64, 'sha512').toString('hex'),
                roles: ['user']
            });
            console.log(user);
            await user.save();
        } catch (e) {
            throw new HttpError(400, e);
        }
    }

    async getAvailableUsersToAdd(projectId) {
        const usersInProject = await projectModel.findById(projectId).populate('users');
        return userModel.User.find().then(users => {
            const usersInProjectIds = usersInProject.users.map(user => user._id.toString());
            usersInProjectIds.push(usersInProject.author.toString());
            const availableUsers = users.filter(user => !usersInProjectIds.includes(user._id.toString()));
            return {users: availableUsers};
        });
    }

    async getAvailableUsersToAssignTask(projectId, taskId) {
        const allUsersInProject = await projectModel.findById(projectId)
            .populate('users', 'name email _id')
            .populate('author', 'name email _id');

        const userInTask = await taskModel.findById(taskId);
        console.log(userInTask);
        const users = [...allUsersInProject.users, allUsersInProject.author];
        const filteredUsers = users.filter(user => user._id.toString() !== userInTask.assigned_to.toString());
        console.log(filteredUsers);
        return filteredUsers;
    }

    checkPassword = (user, password) => {
        const hash_pwd = crypto
            .pbkdf2Sync(password, user.salt, 1000, 64, 'sha512')
            .toString('hex');
        return user.password === hash_pwd;
    }

}

module.exports = new UserRepository();
