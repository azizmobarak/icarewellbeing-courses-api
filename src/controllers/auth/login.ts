import { checkUserExistAndAuth } from "../../services/user/userConnection";

export function login(req: any,res: any){
    return checkUserExistAndAuth(res, req.body);
}