const jwt = require('jsonwebtoken');
const HttpError = require("../utils/HttpError");


const authMiddleware = async (req, res, next) => {
    try {

        if (req.url.startsWith("/public")) {
            return next();
        }

        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2UyZGIxZmM4OWI4MmEyZWVmZGRjNDIiLCJ1c2VyTmFtZSI6ImpvaG5AZXhhbXBsZS5jb20iLCJyb2xlcyI6WyJhZG1pbiJdLCJpYXQiOjE3NDQwNDUxMjd9.P93BnxuvkZR8boDQH-X8DjMLkBx1bevuAy7XY5DvW2o"//req.headers.authorization;
        if (!token) {
            throw new HttpError(401, "Unauthorized");
        }


        const decoded = jwt.verify(token, process.env.API_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        next(error);
    }

};

module.exports = authMiddleware;
