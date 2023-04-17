import { createResponse } from "../../utils/resultStatus";
import { validateEmail, validatePassword } from "../../services/validation";
import {Response, Request, NextFunction, RequestHandler} from 'express';

export function validateLogin(req: Request, res: Response, next: NextFunction): void | RequestHandler{
    if(!validateEmail(req.body.email).isValid || !validatePassword(req.body.password).isValid){
      createResponse(203,'email or password is not correct', res);
    }else {
     return next();
    }
}