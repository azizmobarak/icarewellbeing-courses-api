import { Request, Response } from 'express'
import { UserModel, Users } from '../../models/users'
import { createResponse } from '../../utils/resultStatus'

export function updateUser(req: Request, res: Response) {
    const id = req.body.id
    const user = req.body
    return updateUserData(user, id)
        .then((result) => {
            if (result) {
                createResponse(200, 'updated', res)
            } else {
                createResponse(200, 'updated', res)
            }
        })
        .catch(() => {
            createResponse(400, 'not updated', res)
        })
}

// body: email, password, name, last name,role

const updateUserData = async (user: Users, id: string) => {
    const users = new UserModel()
    return await users
        .updateOne(
            { id: id },
            {
                $set: {
                    username: user.username,
                    email: user.email,
                    role: user.role,
                },
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
