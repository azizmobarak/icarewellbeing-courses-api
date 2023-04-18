import { decodeToken } from '../../services/parseToken'
import { uploadVimeoVideos } from '../../services/vimeo'
import { Response } from 'express'
import { createResponse } from '../../utils/resultStatus'

//TODO: fix typing
// interface RequestWithFile extends Request {
//     files: {filename: string}[];
// }

export const addCourses = (req: any, res: Response) => {
    decodeToken(req.cookies.access_token, res)
        .then((result) => {
            if (result) {
                const data = {
                    user_id: result.split(',')[0],
                    video: req.files[0].filename,
                    name: req.body.name,
                    description: req.body.description,
                }
                return uploadVimeoVideos(data, res)
            }
        })
        .catch(() =>
            createResponse(
                403,
                'cannot define the user please try later or login again',
                res
            )
        )
}
