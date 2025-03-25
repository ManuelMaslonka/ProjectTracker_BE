const HttpError = require("./HttpError");

const checkValidation = (errors) => {
    if (!errors.isEmpty()) {
        console.log(errors.array());
        const message = errors.array().map(error => `${error.path}: ${error.msg}`).join(", ");
        throw new HttpError(400, message);
    }
}

module.exports = {
    checkValidation
};
