
const Joi = require('@hapi/joi');

const registerValidation = data => {
    const schema = Joi.object({
        name: Joi.string()
                .min(2)
                .required(),
        email: Joi.string()
                .min(4)
                .email()
                .required(),
        password: Joi.string()
                .min(6)
                .required()
    })
    return schema.validate(data);
}

const loginValidation = data => {
    const schema = Joi.object({
        email: Joi.string()
                .min(4)
                .max(240)
                .email()
                .required(),
        password: Joi.string()
                .min(6)
                .max(240)
                .required()
    })
    return schema.validate(data);
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;