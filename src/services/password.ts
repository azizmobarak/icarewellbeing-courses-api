import { Response } from 'express'
import { createResponse } from '../utils/resultStatus'
import { authorizeUser } from './user/userConnection'
import { HydratedDocument } from 'mongoose'
/* eslint-disable @typescript-eslint/no-var-requires */
const bcrypt = require('bcrypt')
const saltRounds = 22

export const encryptPassword = async(password: string): Promise<string | null> => {
    return await bcrypt.genSalt(saltRounds,async function (err: string, salt: any) {
        if (err) return null
        return await bcrypt.hash(password, salt, function (err: string, hash: string) {
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
                return authorizeUser(
                    doc._id,
                    doc.role,
                    doc.added_by,
                    doc.email,
                    doc,
                    res
                )
            }
        }
    )
}
