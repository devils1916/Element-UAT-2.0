class CustomError extends Error {
    constructor(status, message, errors = null) {
        super(message);
        this.status = status;
        this.errors = errors;
        Error.captureStackTrace(this, this.constructor);
    }
}
module.exports = CustomError;