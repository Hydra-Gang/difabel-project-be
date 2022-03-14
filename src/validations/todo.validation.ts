import joi from 'joi';

export const newTodoSchema = joi.object({
    message: joi.string()
        .min(5)
        .max(256)
        .required()
});

export const todoIdSchema = joi.object({
    todoId: joi.number()
        .min(1)
        .required()
});