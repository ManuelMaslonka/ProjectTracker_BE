const {body, validationResult, matchedData} = require("express-validator");
const {checkValidation} = require("../utils/helpers");
const userRepository = require("../repository/user.repository");
const jwt = require("jsonwebtoken");
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

module.exports = {
    getAll,
    getById,
    getUser
}
