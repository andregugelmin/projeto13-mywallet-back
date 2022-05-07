import { Router } from 'express';
import {
    loginValidation,
    signupValidation,
} from './../Middlewares/joiValidationMiddleware.js';
import { joiSignupValidation } from './../Middlewares/authValidationMiddleware.js';
import { singin, singup } from './../Controllers/authenticationController.js';

const authenticationRouter = Router();

authenticationRouter.post(
    '/sign-up',
    joiSignupValidation,
    signupValidation,
    singup
);
authenticationRouter.post('/sign-in', loginValidation, singin);

export default authenticationRouter;
