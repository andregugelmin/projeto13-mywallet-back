import chalk from 'chalk';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

let db = null;
try {
    const mongoClient = new MongoClient('mongodb://localhost:27017');
    await mongoClient.connect();
    db = mongoClient.db('mywallet');
} catch (e) {
    console.log(chalk.red.bold('Could not connect to data base'));
}

export default db;
