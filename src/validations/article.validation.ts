import joi from 'joi';

export type NewArticleType = {
    title: string,
    content: string
}

export const newArticleSchema = joi.object({
    title: joi.string()
        .max(128)
        .required(),

    content: joi.string()
        .max(2_000)
        .required()
});

export const articleIdSchema = joi.object({
    articleId: joi.number()
        .min(1)
        .required()
});