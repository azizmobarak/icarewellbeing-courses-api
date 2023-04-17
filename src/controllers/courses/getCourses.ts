import { getCourses } from "../../services/courses/coursesConnection"
import { decodToken } from "../../services/parseToken"
import {Request, Response} from 'express';

interface RequestParams extends Request {
    params: {page: string}
}

export const getCoursesByUserId = (req: RequestParams,res:Response)=> {
    const id = decodToken(req.cookies.access_token,res) || req.headers.id
    // const id = req.body.id;
    getCourses(res,id, parseInt(req.params.page));
}