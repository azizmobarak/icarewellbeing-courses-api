import { checkUserEmailAndAddUser } from "../../services/user/userConnection"

export const checkUserEmailExist = (req: any,res:any)=> checkUserEmailAndAddUser(res,req.body);