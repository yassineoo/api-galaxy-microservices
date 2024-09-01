import { z } from "zod";

const passwordPattern = /[@#$%^&*()_+{}\[\]|\\:;'"<>,.?/~`]/;

const passwordValidator = z.string()
    .min(8, 'Password must be at least 8 characters long.')
    .refine(value => /[A-Z]/.test(value), 'Password must contain at least one uppercase letter.')
    .refine(value => /[a-z]/.test(value), 'Password must contain at least one lowercase letter.')
    .refine(value => passwordPattern.test(value), 'Password must contain at least one special symbol.');

const emailValidator = z
    .string()
    .email()
    .min(1, 'Email is required')

const usernameValidator = z.string()

export const signupValidator = z.object({
    username: usernameValidator,
    email: emailValidator,
    password: passwordValidator
})

export const loginValidator = z.object({
    email: emailValidator,
    password: passwordValidator,
})


const EmailSchema = z.object({ email: emailValidator })

