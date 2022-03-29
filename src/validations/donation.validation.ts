import joi from 'joi';

export type NewDonation = {
    donator: string,
    money: number
}

export const newDonationSchema = joi.object({
    donator: joi.string()
        .max(64)
        .required(),

    money: joi.number()
        .positive()
        .required()
});
