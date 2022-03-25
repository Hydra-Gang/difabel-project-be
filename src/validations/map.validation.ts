import joi from 'joi';

export type NewMapType = {
    name: string,
    type: string,
    address: string,
    latitude: number,
    longitude: number
}

export const newMapSchema = joi.object({
    name: joi.string()
        .max(100)
        .required(),

    type: joi.string()
        .max(30)
        .required(),

    address: joi.string()
        .max(300)
        .required(),

    latitude: joi.number()
        .required(),

    longitude: joi.number()
        .required()
});
