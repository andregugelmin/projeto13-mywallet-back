import db from '../db.js';

export async function validTokenHeader(req, res, next) {
    const authorization = req.headers.authorization;
    const token = authorization?.replace('Bearer ', '');

    if (!token)
        return res.status(401).send({
            message: 'Token not found',
        });

    try {
        const session = await db.collection('sessions').findOne({ token });
        if (!session)
            return res.status(401).send({
                message: 'Sessions not found',
            });

        const user = await db
            .collection('users')
            .findOne({ _id: session.userId });

        if (!user) {
            return res.status(401).send({
                message: 'User not authorizade',
            });
        }

        delete user.password;
        res.locals.user = user;
    } catch (e) {
        return res.sendStatus(500);
    }

    next();
}
