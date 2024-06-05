import Joi from "joi";

const updateUser = {
    Username: Joi.string(),
    FullName: Joi.string(),
    Email: Joi.string().email().messages({
        "string.email": "Email must be a valid email"
    }),
}

const updateRole = {
    Role: Joi.string().valid("admin", "moderator","userClient","userProvider").messages({
        "string.valid": "Role must be either 'admin' or 'user' or 'moderator' or 'userClient' or 'userProvider'"
    }),

}
export default {
    updateRoleSchema: Joi.object(updateRole),
    updateSchema: Joi.object(updateUser),
}