import { verifyUserAuth } from '../../services/user/userConnection'
import { Response, Request, NextFunction } from 'express'
import { createResponse } from '../../utils/resultStatus'

export function isAuth(req: Request, res: Response, next: NextFunction): void {
    console.log('toooken', req.cookies.access_token)
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
