import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import chalk from 'chalk';
import bcrypt from 'bcrypt';
import joi from 'joi';

dotenv.config();
const app = express();
app.use(cors());
app.use(json());

let db = null;
const mongoClient = new MongoClient(process.env.MONGO_URL);
const promise = mongoClient.connect();
promise.then(() => (db = mongoClient.db('mywallet')));

app.post('/sing-up', async (req, res) => {
    //name, email, password, passwordConfirm
    const user = req.body;

    const userSchema = joi.object({
        name: joi.string().required(),
        email: joi.string().email({ minDomainSegments: 2 }).required(),
        password: joi.string().required(),
        passwordConfirm: joi.ref('password').required(),
    });

    const validation = userSchema.validate(user, { abortEarly: false });

    if (validation.error) {
        console.log(validation.error.details);
        res.sendStatus(422).send(
            validation.error.details.map((detail) => detail.message)
        );
        return;
    }

    try {
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
});

app.post('/sign-in', async (req, res) => {
    //email, password
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

    try {
        const user = await db
            .collection('users')
            .findOne({ email: login.email });
        if (user && bcrypt.compareSync(login.password, user.password)) {
            res.send(user);
        } else res.sendStatus(404);
    } catch (e) {
        res.sendStatus(500);
        console.error(chalk.bold.red('Could not post sing-in'), e);
    }
});

app.listen(5000, () => {
    console.log(chalk.bold.green('Server running'));
});
