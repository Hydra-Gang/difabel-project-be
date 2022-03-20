import joi from 'joi';

export type NewReportType = {
    content: string,
    createdAt: Date,
    updatedAt: Date
};

export const newReportSchema = joi.object({
    content: joi.string()
        .max(64)
        .required()
});