import { checkUserEmailAndAddUser } from '../../services/user/userConnection'
import { Request, Response } from 'express'
export const checkUserEmailExist = (req: Request, res: Response) =>
    checkUserEmailAndAddUser(res, req.body)
