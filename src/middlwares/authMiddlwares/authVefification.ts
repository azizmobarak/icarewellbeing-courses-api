import { verifyUserAuth } from "../../services/user/userConnection";

export function isAuth (req: any,res: any,next: any){
    console.log(req.cookies.access_token);
 verifyUserAuth(req.cookies.access_token,res);
 next();
}