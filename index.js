import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import chalk from 'chalk';
import bcrypt from 'bcrypt';
import joi from 'joi';
import dayjs from 'dayjs';
import { stripHtml } from 'string-strip-html';

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

app.get('/registers', async (req, res) => {
    let { user } = req.headers;
    user = stripHtml(user).result.trim();

    try {
        const registers = await db.collection('registers').find().toArray();
        const userRegisters = registers.filter(
            (register) => register.username === user
        );
        res.send(userRegisters);
    } catch (e) {
        console.error(chalk.bold.red('Could not get registers'), e);
        res.sendStatus(500);
    }
});

app.post('/register', async (req, res) => {
    //value, description, type
    let { value, description, type } = req.body;
    let { user } = req.headers;

    description = stripHtml(description).result.trim();
    user = stripHtml(user).result.trim();

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
        res.sendStatus(422);
        return;
    }

    try {
        const checkUser = await db.collection('users').findOne({ name: user });
        const currentDate = dayjs().format('DD/MM/YYYY');
        if (!checkUser) {
            res.sendStatus(422);
            return;
        }

        await db.collection('register').insertOne({
            username: user,
            value: value,
            description: description,
            date: currentDate,
            type: type,
        });
        res.sendStatus(201);
    } catch (e) {
        console.error(chalk.bold.red('Could not post register'), e);
        res.sendStatus(500);
    }
});

app.listen(5000, () => {
    console.log(chalk.bold.green('Server running'));
});
