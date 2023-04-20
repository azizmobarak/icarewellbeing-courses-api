/* eslint-disable @typescript-eslint/no-var-requires */
import { Response } from 'express'
import { createResponse } from '../utils/resultStatus'

const jwt = require('jsonwebtoken')

export function decodeToken(token: string, res: Response): Promise<string> {
    return new Promise(
        (resolve: CallableFunction, _reject: CallableFunction) => {
            try {
                const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
                if (decoded) {
                    resolve(decoded.data)
                } else {
                    createResponse(403, 'Session expired please login', res)
                }
            } catch (e) {
                createResponse(403, 'Session expired please login', res)
                // reject(new Error('token not found'))
            }
        }
    )
}

export function parsTokenToSTring(token: string): Promise<string> {
    return new Promise(
        (resolve: CallableFunction, reject: CallableFunction) => {
            try {
                const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
                if (decoded) {
                    resolve(decoded.data)
                }
            } catch (e) {
                reject()
            }
        }
    )
}
