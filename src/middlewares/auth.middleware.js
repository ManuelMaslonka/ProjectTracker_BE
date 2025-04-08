const jwt = require('jsonwebtoken');
const HttpError = require("../utils/HttpError");


const authMiddleware = async (req, res, next) => {
    try {

        if (req.url.startsWith("/public")) {
            return next();
        }

        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2UyYWYyYWRhNTBmOTFmZTZkMDk3ZWUiLCJ1c2VyTmFtZSI6IjEyM0AxMjMyNC5jb20iLCJyb2xlcyI6WyJhZG1pbiJdLCJpYXQiOjE3NDQxMTQ0NTF9.Z4TTJgF8kVfOGP8LV22dOcRaNiS2CMEab99eaFpZFd0"//req.headers.authorization;
        if (!token) {
            throw new HttpError(401, "Unauthorized");
        }


        const decoded = jwt.verify(token, process.env.API_KEY);
        console.log(decoded)
        req.user = decoded;
        next();
    } catch (error) {
        next(error);
    }

};

module.exports = authMiddleware;
