import Joi from "joi";

const updateUser = {
    Username: Joi.string(),
    FullName: Joi.string(),
    Email: Joi.string().email().messages({
        "string.email": "Email must be a valid email"
    }),
}
export default {
    updateSchema: Joi.object(updateUser),
}