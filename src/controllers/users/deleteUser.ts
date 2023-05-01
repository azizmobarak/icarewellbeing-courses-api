import { Response, Request } from 'express'
import { UserModel } from '../../models/users'
import { ObjectId } from 'mongodb'
import sanitize from 'mongo-sanitize'
import { createResponse } from '../../utils/resultStatus'

export function deleteUser(req: Request, res: Response) {
    const user = new UserModel()
    user.collection
        .deleteOne({ _id: sanitize(new ObjectId(req.body.id)) })
        .then((doc) => {
            if (doc) {
                createResponse(203, 'user deleted', res)
            } else {
                createResponse(
                    203,
                    'user not found, try different email address',
                    res
                )
            }
        })
        .catch((err) => {
            console.log(err)
            createResponse(
                400,
                'an error is launched please contact support or try later',
                res
            )
        })
}
