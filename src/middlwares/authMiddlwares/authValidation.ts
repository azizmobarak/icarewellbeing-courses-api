import { createResponse } from "../../utils/resultStatus";
import { validateEmail, validatePassword } from "../../services/validation";

export function validateLogin(req:any, res: any, next: any){
    if(!validateEmail(req.body.email).isValid || !validatePassword(req.body.password).isValid){
        createResponse(403,'email or password is not correct', res);
    }
    next();
}