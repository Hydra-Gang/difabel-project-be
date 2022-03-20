import joi from 'joi';

export type NewUserType = {
    content: string
};

export const newReportSchema = joi.object({
    content: joi.string()
        .max(64)
        .required()
});