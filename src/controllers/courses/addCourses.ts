import { decodeToken } from '../../services/parseToken'
import { Response } from 'express'
import { createResponse } from '../../utils/resultStatus'
import { uploadFileToS3 } from '../../services/awsS3service'

//TODO: fix typing
// interface RequestWithFile extends Request {
//     files: {filename: string}[];
// }

export const addCourses = (req: any, res: Response) => {
    console.log(req.file)
    decodeToken(req.cookies.access_token, res)
        .then((result: string) => {
            if (result) {
                const id = result.split(',')[0]
                const data = {
                    user_id: id,
                    video: req.file.filename,
                    name: req.body.name,
                    description: req.body.description,
                }
                return uploadFileToS3(
                    data,
                    req.file.filename,
                    req.file.buffer,
                    req.file.mimetype,
                    res
                )
                // return uploadVimeoVideos(data, res)
            }
            return createResponse(
                403,
                'cannot define the user please try later or login again',
                res
            )
        })
        .catch(() =>
            createResponse(
                403,
                'cannot define the user please try later or login again',
                res
            )
        )
}
