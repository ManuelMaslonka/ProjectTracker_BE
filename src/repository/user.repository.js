
const crypto = require("crypto");
const userModel = require('../model/user.model');
const addressModel = require('../model/user.model');
const HttpError = require("../utils/HttpError");


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

    checkPassword = (user, password) => {
        const hash_pwd = crypto
            .pbkdf2Sync(password, user.salt, 1000, 64, 'sha512')
            .toString('hex');
        return user.password === hash_pwd;
    }

}

module.exports = new UserRepository();
