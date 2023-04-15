import { getCourses } from "../../services/courses/coursesConnection"
import { decodToken } from "../../services/parseToken"

export const getCoursesByUserId = (req: any,res:any)=> {
    console.log(req.cookies)
    const id = decodToken(req.cookies.access_token,res);
    getCourses(res,id.data, req.params.page);
}