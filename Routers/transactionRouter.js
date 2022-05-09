import { Router } from 'express';
import { validTokenHeader } from '../Middlewares/tokenHeaderMiddleware.js';
import {
    gettransactions,
    posttransactions,
} from '../Controllers/transactionsController.js';
import { transactionValidation } from '../Middlewares/joiValidationMiddleware.js';

const transactionsRouter = Router();

transactionsRouter.get('/transactions', validTokenHeader, gettransactions);
transactionsRouter.post(
    '/transactions',
    validTokenHeader,
    transactionValidation,
    posttransactions
);

export default transactionsRouter;
