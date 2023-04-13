import { decodToken } from "../../services/parseToken";
import { uploadVimeoVideos } from "../../services/vimeo";

export const addCourses = (req: any,res: any) =>{
 const id  = decodToken(req.cookies.access_token)
 const data = {
     user_id: id.data,
     video: req.files[0].filename,
     name: req.body.name,
     description: req.body.description
 }
 return uploadVimeoVideos(data, res);
}