const jwt = require('jsonwebtoken');
const HttpError = require("../utils/HttpError");

const authMiddleware = async (req, res, next) => {
    try {
        if (req.url.startsWith("/auth")) {
            return next();
        }

        // Check for token in Authorization header or X-Access-Token header
        let token = req.headers.authorization || req.headers['x-access-token'];

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
