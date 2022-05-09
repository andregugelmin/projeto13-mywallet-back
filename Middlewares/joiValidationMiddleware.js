import joi from 'joi';
import { stripHtml } from 'string-strip-html';

export async function signupValidation(req, res, next) {
    const user = req.body;

    const userSchema = joi.object({
        name: joi.string().required(),
        email: joi.string().email({ minDomainSegments: 2 }).required(),
        password: joi.string().required(),
        passwordConfirm: joi.ref('password'),
    });

    const validation = userSchema.validate(user, { abortEarly: false });

    if (validation.error) {
        console.log(validation.error.details);
        res.status(422).send({
            message: 'Invalid signup input',
            details: validation.error.details.map((e) => e.message),
        });
        return;
    }

    next();
}

export async function loginValidation(req, res, next) {
    const login = req.body;

    const loginSchema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().required(),
    });

    const validation = loginSchema.validate(login, { abortEarly: false });

    if (validation.error) {
        console.log(validation.error.details);
        res.status(422).send({
            message: 'Invalid login input',
            details: validation.error.details.map((e) => e.message),
        });
        return;
    }

    next();
}

export async function transactionValidation(req, res, next) {
    let { value, description, type } = req.body;
    description = stripHtml(description).result.trim();

    const inputSchema = joi.object({
        value: joi.number().positive(),
        description: joi.string().required(),
        type: joi.any().valid('input', 'output'),
    });

    const validation = inputSchema.validate(
        { value, description, type },
        { abortEarly: false }
    );

    if (validation.error) {
        console.log(validation.error.details);
        res.status(422).send({
            message: 'Invalid transaction input',
            details: validation.error.details.map((e) => e.message),
        });
        return;
    }

    res.locals.transaction = {
        value: value,
        description: description,
        type: type,
    };
    next();
}
