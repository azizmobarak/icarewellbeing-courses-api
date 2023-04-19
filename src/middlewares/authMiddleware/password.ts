import { encryptPassword } from '../../services/password'
import { createResponse } from '../../utils/resultStatus'
import { Response, Request, NextFunction, RequestHandler } from 'express'

export const checkPasswordEncError = (
    req: Request,
    res: Response,
    next: NextFunction
): void | RequestHandler => {
    const passwordHash = encryptPassword(req.body.password)
    if (!passwordHash) {
        createResponse(400, 'password error', res)
    }
    return next()
}
