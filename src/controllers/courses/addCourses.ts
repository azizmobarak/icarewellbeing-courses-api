import { addCourse } from "../../services/courses/coursesConnection";
import { decodToken } from "../../services/parseToken";

export const addCourses = (req: any,res: any) =>{
 const params = req.headers['video'];
 const id  = decodToken(req.cookies.access_token)
 return addCourse({user_id: id.data,video: params}, res);
}