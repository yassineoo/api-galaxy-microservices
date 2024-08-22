import Joi from "joi";

const createCheckoutSession = Joi.object({
    priceIds: Joi.array().items(Joi.string().required()).required(),
    successPage: Joi.string().required(),
    cancelPage: Joi.string().required(),
});


export default {
    createCheckoutSession : createCheckoutSession
}