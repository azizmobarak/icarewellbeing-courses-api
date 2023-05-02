import { Request, Response } from 'express'
import { UserModel } from '../../models/users'
import { ObjectId } from 'mongodb'
import sanitize from 'mongo-sanitize'
import { createResponse } from '../../utils/resultStatus'

export function getUserData(req: Request, res: Response) {
    const users = new UserModel()
    users.collection
        .findOne({ _id: sanitize(new ObjectId(req.params.id)) })
        .then((result) => {
            if (result) {
                const data = {
                    email: result.email,
                    role: result.role,
                    username: result.username,
                }
                createResponse(200, data, res)
            } else {
                createResponse(200, [], res)
            }
        })
        .catch((err) => {
            console.log(err)
            createResponse(402, 'error ,try again', res)
        })
}
