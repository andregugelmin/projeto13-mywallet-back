import joi from 'joi';

export async function singupValidation(req, res, next) {
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
        res.sendStatus(422).send(
            validation.error.details.map((detail) => detail.message)
        );
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
        res.sendStatus(422).send(
            validation.error.details.map((detail) => detail.message)
        );
        return;
    }

    next();
}
