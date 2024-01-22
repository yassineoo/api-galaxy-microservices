import Joi from "joi";

const userProfile = {
    ProfileID: Joi.number().required(),
    UserID: Joi.number().required(),
    FullName: Joi.string(),
    Bio : Joi.string(),
    ProfilePicture: Joi.string(),
    DateOfBirth: Joi.date(),
    Location: Joi.string(),
}

export default {
    userProfileSchema: Joi.object(userProfile),
}