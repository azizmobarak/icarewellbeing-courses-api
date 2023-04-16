import { checkUserEmailAndAddUser } from "../../services/user/userConnection"

export default function addNewUser (req: any,res: any) {
    console.log(req.body)
 return checkUserEmailAndAddUser(res,req.body);
}



