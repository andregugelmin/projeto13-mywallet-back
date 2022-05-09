import chalk from 'chalk';
import dayjs from 'dayjs';
import db from '../db.js';

export async function getTransactions(req, res) {
    const user = res.locals.user;

    try {
        const transactions = await db
            .collection('transactions')
            .find()
            .toArray();
        const userTransaction = transactions.filter(
            (transaction) => transaction.username === user.name
        );
        res.send({ user: user, userTransaction: userTransaction });
    } catch (e) {
        console.error(chalk.bold.red('Could not get transactions'), e);
        res.sendStatus(500);
    }
}

export async function postTransaction(req, res) {
    const user = res.locals.user;
    const transaction = res.locals.transaction;

    try {
        const currentDate = dayjs().format('DD/MM/YYYY');

        await db.collection('transactions').insertOne({
            username: user.name,
            value: transaction.value,
            description: transaction.description,
            date: currentDate,
            type: transaction.type,
        });
        res.sendStatus(201);
    } catch (e) {
        console.error(chalk.bold.red('Could not post transaction'), e);
        res.sendStatus(500);
    }
}
