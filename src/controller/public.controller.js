const {body, validationResult, matchedData} = require("express-validator");
const {checkValidation} = require("../utils/helpers");
const userRepository = require("../repository/user.repository");
const jwt = require("jsonwebtoken");
const HttpError = require("../utils/HttpError");


const register = [
    body("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Invalid email"),
    body("name").notEmpty().withMessage("Username is required"),
    body("password").notEmpty().withMessage("Password is required").isLength({min: 6}).withMessage("Password must be at least 6 characters"),
    body("confirmPassword").notEmpty().withMessage("Confirm password is required").custom((value, {req}) => {
        console.log(value)
        console.log(req.body.password)
        if (value !== req.body.password) {
            throw new Error("Password does not match");
        }
        return true;
    }).withMessage("Password does not match"),
    async (req, res, next) => {
        try {

            checkValidation(validationResult(req))
            const matched = matchedData(req, {
                onlyValidData: true
            });

            const userWithEmailExist = await userRepository.getAll();

            if (!userWithEmailExist) {
                throw new HttpError(400, "Email already exist");
            }

            await userRepository.create(matched);

            res.status(201).send({
                message: "User created successfully"
            });
        } catch (err) {
            next(err)
        }

    }
];

const login = [
    body("email").isEmail().withMessage("Email is required"),
    body("password").notEmpty().withMessage("Password is required"),
    async (req, res, next) => {
        try {
            checkValidation(validationResult(req))
            const matched = matchedData(req, {
                onlyValidData: true
            });
            const {email, password} = matched;
            const existingUser = await userRepository.findUserByEmail(email);
            if (!existingUser) {
                throw new HttpError(404, "User not found");
            }

            if (!userRepository.checkPassword(existingUser, password)) {
                throw new HttpError(401, "Invalid credentials");
            }

            const token = jwt.sign({
                userId: existingUser.id,
                userName: existingUser.email,
                roles: existingUser.roles
            }, process.env.API_KEY)
            console.log(existingUser)

            res.send({
                user: existingUser,
                token: token
            });

        } catch (err) {
            next(err)
        }

    }];


module.exports = {
    register,
    login
}
