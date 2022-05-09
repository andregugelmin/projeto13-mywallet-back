import bcrypt from 'bcrypt';
import db from '../db.js';

export async function joiSignupValidation(req, res, next) {
    const passwordHash = bcrypt.hashSync(req.body.password, 10);
    const user = {
        name: req.body.name,
        email: req.body.email,
        password: passwordHash,
    };
    try {
        const checkUser = await db
            .collection('users')
            .findOne({ email: user.email });
        if (checkUser)
            return res
                .status(409)
                .send({ message: 'email is already transactioned' });

        res.locals.user = user;
    } catch (e) {
        return res.sendStatus(500);
    }

    next();
}
