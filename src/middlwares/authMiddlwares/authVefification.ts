import { verifyUserAuth } from "../../services/user/userConnection";

export function isAuth (req: any,res: any,next: any){
 verifyUserAuth(req.cookies.access_token,res);
 next();
}