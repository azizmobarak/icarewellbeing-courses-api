import { Request, Response } from 'express'
import { fakeUserTokenSign } from '../../services/createToken'
import { createResponse } from '../../utils/resultStatus'

export function logout(_req: Request, res: Response) {
    try {
        return fakeUserTokenSign(res)
    } catch (err) {
        createResponse(502, 'an error has been launched please try again', res)
    }
}
