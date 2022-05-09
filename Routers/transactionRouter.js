import { Router } from 'express';
import { validTokenHeader } from '../Middlewares/tokenHeaderMiddleware.js';
import {
    getTransactions,
    postTransaction,
} from '../Controllers/transactionsController.js';
import { transactionValidation } from '../Middlewares/joiValidationMiddleware.js';

const transactionsRouter = Router();

transactionsRouter.get('/transactions', validTokenHeader, getTransactions);
transactionsRouter.post(
    '/transactions',
    validTokenHeader,
    transactionValidation,
    postTransaction
);

export default transactionsRouter;
