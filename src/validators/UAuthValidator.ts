import Joi from "joi";

/* password ^: Asserts the position at the beginning of the string.
(?=.*[a-z]): Ensures at least one lowercase letter exists.
(?=.*[A-Z]): Ensures at least one uppercase letter exists.
(?=.*\d): Ensures at least one digit exists.
(?=.*[\^$*.\[\]{}()?\-"!@#%&/,><':;|_~\])`: Ensures at least one special character exists.
.{8,}: Ensures that there are at least 8 of any character (except newline).
$: Asserts the position at the end of the string.$  */

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\^$*.\[\]{}()?\-"!@#%&/,><':;|_~`\\]).{8,}$/;
const passwordSchema = Joi.string().pattern(passwordPattern).message('Password must have at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character');


const signup = {
    Username: Joi.string(),
    FullName: Joi.string(),
    DateOfBirth: Joi.date(),
    Email: Joi.string().email().messages({
        "string.email": "Email must be a valid email"
    }),
    password: passwordSchema,
    phoneNumber: Joi.string(),
}


const login = {
    Email: Joi.string().email().required().messages({
        "string.email": "Email must be a valid email"
    }),
    password: passwordSchema,
}

const Email = {
    Email: Joi.string().email().required().messages({
        "string.email": "Email must be a valid email"
    })
}

export default {
    loginSchema: Joi.object(login),
    signUpSchema: Joi.object(signup),
    EmailSchema: Joi.object(Email)
}