"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
/* password ^: Asserts the position at the beginning of the string.
(?=.*[a-z]): Ensures at least one lowercase letter exists.
(?=.*[A-Z]): Ensures at least one uppercase letter exists.
(?=.*\d): Ensures at least one digit exists.
(?=.*[\^$*.\[\]{}()?\-"!@#%&/,><':;|_~\])`: Ensures at least one special character exists.
.{8,}: Ensures that there are at least 8 of any character (except newline).
$: Asserts the position at the end of the string.$  */
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\^$*.\[\]{}()?\-"!@#%&/,><':;|_~`\\]).{8,}$/;
const passwordSchema = joi_1.default.string().pattern(passwordPattern).message('Password must have at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character');
const signup = {
    Username: joi_1.default.string(),
    FullName: joi_1.default.string(),
    DateOfBirth: joi_1.default.date(),
    Email: joi_1.default.string().email().messages({
        "string.email": "Email must be a valid email"
    }),
    password: passwordSchema,
    phoneNumber: joi_1.default.string(),
};
const login = {
    Email: joi_1.default.string().email().required().messages({
        "string.email": "Email must be a valid email"
    }),
    password: passwordSchema,
    Username: joi_1.default.string()
};
const Email = {
    Email: joi_1.default.string().email().required().messages({
        "string.email": "Email must be a valid email"
    })
};
exports.default = {
    loginSchema: joi_1.default.object(login),
    signUpSchema: joi_1.default.object(signup),
    EmailSchema: joi_1.default.object(Email)
};
