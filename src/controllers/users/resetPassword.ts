import { Request, Response } from 'express'
import { UserModel } from '../../models/users'
import bcrypt from 'bcrypt'
import crypt from 'crypto'
import { createResponse } from '../../utils/resultStatus'
const saltRounds = 10

export async function resetPassword(req: Request, res: Response) {
    const token = req.body.token
    const newPassword = req.body.password
    await bcrypt.genSalt(saltRounds, async function (err: any, salt: string) {
        if (err) return null
        return await bcrypt.hash(
            newPassword,
            salt,
            function (err: any, hash: string) {
                if (err) return null
                return upadatePassword(token, hash).then((value) => {
                    if (value) {
                        createResponse(200, 'password has been changed', res)
                    } else {
                        createResponse(402, 'please try again', res)
                    }
                })
            }
        )
    })
}

const upadatePassword = async (
    token: string,
    password: string
): Promise<boolean> => {
    const user = new UserModel()
    const hash = crypt.randomBytes(34).toString('hex')
    return await user.collection
        .findOneAndUpdate({ token: token }, { $set: { password, token: hash } })
        .then((doc) => {
            if (doc) {
                return true
            } else {
                return false
            }
        })
        .catch((err) => {
            console.log(err)
            return false
        })
}
