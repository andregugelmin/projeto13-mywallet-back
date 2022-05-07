import express, { json } from 'express';
import cors from 'cors';
import chalk from 'chalk';
import authenticationRouter from './Routers/authenticationRouter.js';
import registersRouter from './Routers/registersRouter.js';

const app = express();
app.use(cors());
app.use(json());

app.use(authenticationRouter);
app.use(registersRouter);

app.listen(process.env.PORT, () => {
    console.log(chalk.bold.green('Server running on port 5500'));
});
