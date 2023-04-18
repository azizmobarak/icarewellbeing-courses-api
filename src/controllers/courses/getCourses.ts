import { getCourses } from '../../services/courses/coursesConnection'
import { decodeToken } from '../../services/parseToken'
import { Request, Response } from 'express'
import { createResponse } from '../../utils/resultStatus'

type RequestParams = {
    params: { page: string }
} & Request

export const getCoursesByUserId = (req: RequestParams, res: Response) => {
    return decodeToken(req.cookies.access_token, res)
        .then((data: string) => {
            const id = data.split(',')[0]
            getCourses(res, id, parseInt(req.params.page))
        })
        .catch((_err: any) => {
            createResponse(403, 'Session expired please login', res)
        })
}
