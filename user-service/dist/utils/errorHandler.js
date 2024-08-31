"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleErrors = exports.SystemError = exports.UserError = void 0;
class UserError extends Error {
    constructor(message) {
        super(message);
        this.name = "UserError";
        this.isOperational = true;
    }
}
exports.UserError = UserError;
class SystemError extends Error {
    constructor(message) {
        super(message);
        this.name = "SystemError";
        this.isOperational = false;
    }
}
exports.SystemError = SystemError;
const handleErrors = (err, req, res, next) => {
    if (err instanceof UserError) {
        //console.log("here")
        return res.status(400).json({ error: true, message: err.message });
    }
    else if (err instanceof SystemError) {
        return res.status(500).json({ error: true, message: err.message });
    }
    else if (err.name == "CastError") {
        return res.status(400).json({
            error: true,
            message: `Ressource not found Invalid ${err.path}`
        });
    }
    else if (err.code == 11000) {
        return res.status(400).json({
            error: true,
            message: `Duplicate ${Object.keys(err.keyValue)} entered`
        });
    }
    else if (err.name == "JsonWebTokenError") {
        return res.status(400).json({
            error: true,
            message: `Json web token is invalid`
        });
    }
    else if (err.name == "TokenExpiredError") {
        return res.status(400).json({
            error: true,
            message: "Jwt token is expired, please try later"
        });
    }
    else if (err instanceof Error) {
        return res.status(500).json({
            error: true,
            message: err.message
        });
    }
    else {
        return res.status(500).json({
            error: true,
            message: "Unexpected server error"
        });
    }
};
exports.handleErrors = handleErrors;
