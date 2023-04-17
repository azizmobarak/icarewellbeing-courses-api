import { decodToken } from "../../services/parseToken";
import { uploadVimeoVideos } from "../../services/vimeo";
import {Response} from 'express';


//TODO: fix typing
// interface RequestWithFile extends Request {
//     files: {filename: string}[];
// }

export const addCourses = (req: any,res: Response) =>{
 const id  = decodToken(req.cookies.access_token,res)
 const data = {
     user_id: id,
     video: req.files[0].filename,
     name: req.body.name,
     description: req.body.description
 }
 return uploadVimeoVideos(data, res);
}