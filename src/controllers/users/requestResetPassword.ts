import { Request, Response } from 'express'
import { UserModel } from '../../models/users'
import { createResponse } from '../../utils/resultStatus'
import { senResetPasswordEmail } from '../../services/emailService'

export function requestresetPassword(req: Request, res: Response) {
    const user = new UserModel()
    console.log(req.body.email);
    user.collection
        .findOne({ email: req.body.email })
        .then((result) => {
            console.log(result)
            if (result) {
                senResetPasswordEmail(result.email, result.token)
                createResponse(
                    200,
                    'link has been sent, please check your email',
                    res
                )
            } else {
                createResponse(200, 'email not exist', res)
            }
        })
        .catch((err) => {
            console.log(err)
            createResponse(400, 'something is happen try later', res)
        })
}
