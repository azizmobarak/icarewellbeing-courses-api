import { checkUserExistAndAuth } from "../../services/user/userConnection";
import {Response, Request} from 'express';
export function login(req: Request,res: Response){
    return checkUserExistAndAuth(res, req.body);
}