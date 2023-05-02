import { Request, Response } from 'express'
import { UserModel, Users } from '../../models/users'
import { createResponse } from '../../utils/resultStatus'
import bcrypt from 'bcrypt'
const saltRounds = 10

export function updateUser(req: Request, res: Response) {
    const id = req.body.id
    const user = req.body
    const data = prepareUserUpdateData(user)
    if (!user.password) {
        return updateUserData(data, id)
            .then((result) => {
                if (result) {
                    createResponse(200, 'updated', res)
                } else {
                    createResponse(200, 'Not updated', res)
                }
            })
            .catch(() => {
                createResponse(400, 'Not updated', res)
            })
    } else {
        return getPasswordAndUpdate(user, id, res)
    }
}

const prepareUserUpdateData = (user: any) => {
    const data = user
    if (!user.password) {
        delete data.password
    }
    if (!user.email) {
        delete data.email
    }

    if (!user.role) {
        delete data.role
    }

    if (!user.username) {
        delete data.username
    }

    return data
}

const getPasswordAndUpdate = async (user: Users, id: string, res: Response) => {
    await bcrypt.genSalt(saltRounds, async function (err: any, salt: string) {
        if (err) return null
        return await bcrypt.hash(
            user.password,
            salt,
            function (err: any, hash: string) {
                if (err) return null
                return updateUserData({ ...user, password: hash }, id)
                    .then((result) => {
                        if (result) {
                            createResponse(200, 'updated', res)
                        } else {
                            createResponse(200, 'Not updated', res)
                        }
                    })
                    .catch(() => {
                        createResponse(400, 'not updated', res)
                    })
            }
        )
    })
}

// body: email, password, name, last name,role

const updateUserData = async (user: Users, id: string) => {
    const users = new UserModel()
    return await users
        .updateOne(
            { id: id },
            {
                $set: { ...user },
            }
        )
        .then((doc) => {
            if (doc) {
                return true
            }
            return false
        })
        .catch((err) => {
            console.log(err)
            return false
        })
}
