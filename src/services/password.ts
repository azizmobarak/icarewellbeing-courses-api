import { Response } from 'express'
import { createResponse } from '../utils/resultStatus'
import { authorizeUser } from './user/userConnection'
import { HydratedDocument } from 'mongoose'

const bcrypt = require('bcrypt')
const saltRounds = 22

export const encryptPassword = (password: string): string | null => {
    return bcrypt.genSalt(saltRounds, function (err: any, salt: any) {
        if (err) return null
        return bcrypt.hash(password, salt, function (err: any, hash: any) {
            if (err) return err
            return hash
        })
    })
}

export const checkPassword = (
    doc: HydratedDocument<any>,
    password: string,
    res: Response
): boolean | void => {
    return bcrypt.compare(
        password,
        doc.password,
        function (err: string, result: boolean) {
            if (err || !result) {
                return createResponse(
                    203,
                    `Sorry , Email or password is not correct`,
                    res
                )
            } else {
                return authorizeUser(doc._id, doc.role, doc, res)
            }
        }
    )
}
