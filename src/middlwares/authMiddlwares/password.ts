import { encryptPassword } from "../../services/password"
import { createResponse } from "../../utils/resultStatus";

export const checkPasswordEncError = (req:any, res: any, next: any) => {
 const passwordHash = encryptPassword(req.body.password);
 if(!passwordHash){
     createResponse(400,'error',res);
 }
 next();
}