import chalk from 'chalk';
import bcrypt from 'bcrypt';
import db from './../db.js';
import dayjs from 'dayjs';
import { v4 as uuid } from 'uuid';

export async function singup(req, res) {
    //name, email, password, passwordConfirm
    const user = req.body;
    try {
        const checkUser = await db
            .collection('user')
            .findOne({ email: user.email });
        if (checkUser)
            return res.status(409).send('email is already registered');

        const passwordHash = bcrypt.hashSync(user.password, 10);
        await db.collection('users').insertOne({
            name: user.name,
            email: user.email,
            password: passwordHash,
        });
        res.sendStatus(201);
    } catch (e) {
        res.sendStatus(500);
        console.error(chalk.bold.red('Could not post sing-up'), e);
    }
}

export async function singin(req, res) {
    //email, password
    const login = req.body;
    try {
        const user = await db
            .collection('users')
            .findOne({ email: login.email });
        if (user && bcrypt.compareSync(login.password, user.password)) {
            const token = uuid();
            const loginTime = dayjs().format('DD/MM/YYYY HH:mm:ss');
            await db.collection('sessions').insertOne({
                token,
                userId: user._id,
                date: loginTime,
            });

            res.send(token);
        } else res.sendStatus(404);
    } catch (e) {
        res.sendStatus(500);
        console.error(chalk.bold.red('Could not post sing-in'), e);
    }
}