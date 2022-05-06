import { Router } from 'express';
import {
    loginValidation,
    singupValidation,
} from './../Middlewares/joiValidationMiddleware.js';
import { singin, singup } from './../Controllers/authenticationController.js';

const authenticationRouter = Router();

authenticationRouter.post('/sign-up', singupValidation, singup);
authenticationRouter.post('/sign-in', loginValidation, singin);

export default authenticationRouter;
