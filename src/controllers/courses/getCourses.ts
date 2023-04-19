import { decodeToken } from '../../services/parseToken'
import { Request, Response } from 'express'
import { createResponse } from '../../utils/resultStatus'
import { getCourses } from '../../services/courses/coursesConnection'

type RequestParams = {
    params: { page: string }
} & Request

export const getCoursesByUserId = (req: RequestParams, res: Response) => {
    return decodeToken(req.cookies.access_token, res)
        .then((data: string) => {
            const id = getRoleAndID(data).id
            getCourses(res, id, parseInt(req.params.page))
        })
        .catch((_err: any) => {
            createResponse(403, 'Session expired please login', res)
        })
}

function getRoleAndID(decodedToken: string): { id: string; role: string } {
    return {
        role: decodedToken.split(',')[1],
        id: useAddedByIDInsteadOfID(decodedToken),
    }
}

function useAddedByIDInsteadOfID(decodedToken: string): string {
    const role = decodedToken.split(',')[1]
    console.log('detected role', role)
    switch (role) {
        case '2':
            return decodedToken.split(',')[2]
        default:
            return decodedToken.split(',')[0]
    }
}
