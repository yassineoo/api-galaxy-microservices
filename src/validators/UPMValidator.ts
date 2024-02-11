import Joi from "joi";

const updateProfile = {
    FullName: Joi.string(),
    DateOfBirth: Joi.string(),
    Bio: Joi.string(),
    ProfilePicture: Joi.string(),
    Location: Joi.string()
}


export default {
    userProfileSchema: Joi.object(updateProfile),
}