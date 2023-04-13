import { getCourses } from "../../services/courses/coursesConnection"
import { decodToken } from "../../services/parseToken"

export const getCoursesByUserId = (req: any,res:any)=> {
    const id = decodToken(req.cookies.access_token);
    console.log(id);
    getCourses(res,id.data)
}