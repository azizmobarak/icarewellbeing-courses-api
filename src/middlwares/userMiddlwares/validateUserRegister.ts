import { validateUserData } from "../../services/validation";

export function validateUser (req: any, res: any, next: any){
    const {isValid, error} = validateUserData(req.body)
  isValid ? next() : 
  res.send({
    error,
    code: '400',
  })
}