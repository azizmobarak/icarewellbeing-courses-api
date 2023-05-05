import { checkUserEmailAndAddUser } from '../../../services/user/userConnection'
import { Response, Request } from 'express'

export default function addNewUser(req: Request, res: Response) {
    return checkUserEmailAndAddUser(res, req.body)
}
