"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidator = exports.signupValidator = void 0;
const zod_1 = require("zod");
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
exports.signupValidator = zod_1.z.object({
    username: usernameValidator,
    email: emailValidator,
    password: passwordValidator
});
exports.loginValidator = zod_1.z.object({
    email: emailValidator,
    password: passwordValidator,
});
const EmailSchema = zod_1.z.object({ email: emailValidator });
