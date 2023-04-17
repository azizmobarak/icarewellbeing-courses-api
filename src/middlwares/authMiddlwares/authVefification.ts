import { verifyUserAuth } from "../../services/user/userConnection";
import {Response, Request, NextFunction} from 'express';

export function isAuth (req: Request,res: Response,next: NextFunction): void{
   verifyUserAuth(req.cookies.access_token,res, next);
}