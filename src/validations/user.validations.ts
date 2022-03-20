import joi from 'joi';

function validatePhone(val: string) {
    const res = val.match(/[0-9]+/g);

    if (res?.length && val === res[0]) {
        return val;
    }

    throw Error('Invalid phone number');
}

const passwordSchema = joi.string()
    .min(8)
    .max(64)

    .regex(/[0-9]/)
    .rule({ message: '{#label} requires at least a number' })

    .regex(/[a-z]/)
    .rule({ message: '{#label} requires at least a lowercase character' })

    .regex(/[A-Z]/)
    .rule({ message: '{#label} requires at least an uppercase character' })

    .regex(/[^a-zA-Z\d]/)
    .rule({ message: '{#label} requires at least a special character' });

export const loginSchema = joi.object({
    email: joi.string()
        .max(64)
        .email()
        .required(),

    password: passwordSchema
        .required()
});

export const registerSchema = loginSchema.append({
    fullName: joi.string()
        .max(64)
        .required(),

    phone: joi.string()
        .max(32)

        .custom(validatePhone)
        .rule({ message: '{#label} must only be numbers' })

        .required()
});