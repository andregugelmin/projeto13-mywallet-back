import { Router } from 'express';
import { validTokenHeader } from './../Middlewares/tokenHeaderMiddleware.js';
import {
    getRegisters,
    postRegisters,
} from './../Controllers/registersController.js';

const registersRouter = Router();

registersRouter.get('/registers', validTokenHeader, getRegisters);
registersRouter.post('/registers', validTokenHeader, postRegisters);

export default registersRouter;
