import { validateUserData } from "../../services/validation";
import { createResponse } from "../../utils/resultStatus";

export function validateUser (req: any, res: any, next: any){
    const {isValid, error} = validateUserData(req.body)
  isValid ? next() :
  createResponse(400,error,res);
}