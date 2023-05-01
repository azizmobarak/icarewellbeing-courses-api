import { verifyUserAuth } from '../../services/user/userConnection'
import { Response, Request, NextFunction } from 'express'
import { createResponse } from '../../utils/resultStatus'
import { decodeToken } from '../../services/parseToken'
import { getRole } from '../../utils/userUtils'

export function isAuth(req: Request, res: Response, next: NextFunction): void {
    verifyUserAuth(req.cookies.access_token, res)
        .then((result) => {
            if (result) {
                next()
            } else {
                createResponse(403, `Not Authorized`, res)
            }
        })
        .catch((_err) =>
            createResponse(
                403,
                `oops something happen Sorry, back again later`,
                res
            )
        )
}

export function isSuperAdmin(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    decodeToken(req.cookies.access_token, res)
        .then((value) => {
            const role = getRole(value)
            if (role === '0') {
                return next()
            } else {
                createResponse(403, 'Not Authorized', res)
            }
        })
        .catch((err) => {
            console.log(err)
            createResponse(
                403,
                `oops something happen Sorry, back again later`,
                res
            )
        })
}
