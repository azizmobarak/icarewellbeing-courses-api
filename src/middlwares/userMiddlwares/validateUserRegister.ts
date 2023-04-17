import { validateUserData } from "../../services/validation";
import { createResponse } from "../../utils/resultStatus";
import {Request, Response, NextFunction, RequestHandler} from 'express';

export function validateUser (req: Request, res: Response, next: NextFunction): void | RequestHandler{
    const {isValid, error} = validateUserData(req.body)
 return isValid ? next() :
  createResponse(400,error,res);
}