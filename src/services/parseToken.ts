import { Response } from 'express'
import { createResponse } from '../utils/resultStatus';

const jwt = require('jsonwebtoken')

export function decodeToken(
    token: string,
    res: Response
): Promise<string> {
    return new Promise((resolve, reject) => {
        try {
            const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
            if(decoded){
                resolve(decoded.data)
            }else {
                createResponse(403, 'Session expired please login', res)
                reject(new Error('token not found'))
            }
        } catch {
            createResponse(403, 'Session expired please login', res)
           reject(new Error('token not found'))
        }
    })
}
