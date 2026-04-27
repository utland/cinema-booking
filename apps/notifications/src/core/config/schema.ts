import Joi from "joi";

export const notificationsSchema = Joi.object({
    NODEMAILER_TOKEN: Joi.string().required(),
    RABBITMQ_URL: Joi.string().required(),
    APP_PORT: Joi.number().required()
});
