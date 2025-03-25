const jwt = require('jsonwebtoken');


const authMiddleware = async (req, res, next) => {
    try {

    if (req.url.startsWith("/public")) {
        return next();
    }

    const token = req.headers.authorization;
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
