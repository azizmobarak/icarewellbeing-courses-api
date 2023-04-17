import { checkUserEmailAndAddUser } from "../../services/user/userConnection"
import {Response, Request} from 'express';

export default function addNewUser (req: Request,res: Response) {
    console.log(req.body)
 return checkUserEmailAndAddUser(res,req.body);
}



