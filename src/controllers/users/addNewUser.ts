import { checkUserEmailAndAddUser } from "../../services/user/userConnection"

export default function addNewUser (req: any,res: any) {
 return checkUserEmailAndAddUser(res,req.body);
}



