import chalk from 'chalk';
import joi from 'joi';
import { stripHtml } from 'string-strip-html';
import dayjs from 'dayjs';
import db from '../db.js';

export async function getRegisters(req, res) {
    const user = res.locals.user;

    try {
        const registers = await db.collection('registers').find().toArray();
        const userRegisters = registers.filter(
            (register) => register.username === user.name
        );
        res.send({ user: user, userRegisters: userRegisters });
    } catch (e) {
        console.error(chalk.bold.red('Could not get registers'), e);
        res.sendStatus(500);
    }
}

export async function postRegisters(req, res) {
    //value, description, type
    let { value, description, type } = req.body;
    description = stripHtml(description).result.trim();

    const user = res.locals.user;

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
        const currentDate = dayjs().format('DD/MM/YYYY');

        await db.collection('registers').insertOne({
            username: user.name,
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
}
