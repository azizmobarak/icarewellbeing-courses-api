import { getCourses } from "../../services/courses/coursesConnection"
import { decodToken } from "../../services/parseToken"

export const getCoursesByUserId = (req: any,res:any)=> {
    console.log('helloooooo')
    const id = decodToken(req.cookies.access_token,res) || req.headers.id
    getCourses(res,id.data, req.params.page);
}