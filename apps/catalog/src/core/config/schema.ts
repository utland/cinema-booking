import Joi from "joi";

export const catalogSchema = Joi.object({
    DATABASE_TYPE: Joi.string().required(),
    DATABASE_HOST: Joi.string().default("localhost"),
    DATABASE_PORT: Joi.number().default(5432),
    DATABASE_USER: Joi.string().required(),
    DATABASE_PASSWORD: Joi.string().required(),
    DATABASE_DB: Joi.string().required(),
    DATABASE_SYNC: Joi.number().valid(0, 1).required(),
    APP_PORT: Joi.number().required(),
    RABBITMQ_URL: Joi.string().required()
});
