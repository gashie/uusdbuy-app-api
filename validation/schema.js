const Joi = require('joi');

const schema = {
    usersignup: Joi.object({
        full_name: Joi.string().label("full name"),
        phone_number: Joi.string().required().label("phone"),
        email: Joi.string()
            .email()
            .required()
            .label("email"),
        password: Joi.string()
            .min(8)
            .required()
            .label("Password"),

    }),


};
module.exports = schema;
