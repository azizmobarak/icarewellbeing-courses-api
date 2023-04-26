import { decodeToken } from '../../services/parseToken'
import { Request, Response } from 'express'
import { createResponse } from '../../utils/resultStatus'
import { getCourses } from '../../services/courses/coursesConnection'
import { getAddedByOrID } from '../../utils/userUtils'

type RequestParams = {
    params: { module: string }
} & Request

export const getCoursesByUserId = (req: RequestParams, res: Response) => {
    return decodeToken(req.cookies.access_token, res)
        .then((data: string) => {
            const id = getRoleAndID(data).id
            getCourses(res, id, req.params.module)
        })
        .catch((_err: any) => {
            createResponse(403, 'Session expired please login', res)
        })
}

function getRoleAndID(decodedToken: string): { id: string; role: string } {
    return {
        role: decodedToken.split(',')[1],
        id: getAddedByOrID(decodedToken),
    }
}
