"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");

/* password ^: Asserts the position at the beginning of the string.
(?=.*[a-z]): Ensures at least one lowercase letter exists.
(?=.*[A-Z]): Ensures at least one uppercase letter exists.
(?=.*\d): Ensures at least one digit exists.
(?=.*[\^$*.\[\]{}()?\-"!@#%&/,><':;|_~\])`: Ensures at least one special character exists.
.{8,}: Ensures that there are at least 8 of any character (except newline).
$: Asserts the position at the end of the string.$  */

const passwordPattern = /[@#$%^&*()_+{}\[\]|\\:;'"<>,.?/~`]/;
const passwordValidator = zod_1.z.string()
    .min(8, 'Password must be at least 8 characters long.')
    .refine(value => /[A-Z]/.test(value), 'Password must contain at least one uppercase letter.')
    .refine(value => /[a-z]/.test(value), 'Password must contain at least one lowercase letter.')
    .refine(value => passwordPattern.test(value), 'Password must contain at least one special symbol.');
const emailValidator = zod_1.z
    .string()
    .email()
    .min(1, 'Email is required');
const usernameValidator = zod_1.z.string();
// const signupValidator = {
// Username: Joi.string(),
// // FullName: Joi.string(),
// // DateOfBirth: Joi.date(),
// Email: emailSchema,
// password: passwordSchema,
// // phoneNumber: Joi.string(),
// }
const signupValidator = zod_1.z.object({
    username: usernameValidator,
    email: emailValidator,
    password: passwordValidator
});
const loginValidator = zod_1.z.object({
    email: emailValidator,
    password: passwordValidator,
    username: usernameValidator
});
const EmailSchema = zod_1.z.object({ email: emailValidator });
exports.default = {
    loginSchema: loginValidator,
    signUpSchema: signupValidator,
    EmailSchema

};
