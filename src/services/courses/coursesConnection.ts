import { CoursesModel } from "../../models/courses";
import { createResponse } from "../../utils/resultStatus";
const sanitize = require("mongo-sanitize");

export interface Course {
    video: string;
    user_id: string;
    name: string;
    description: string;
}

export function addCourse(data: Course, res: any){
 try{
 const courses = new CoursesModel(sanitize(data));
 courses.save();
 createResponse(202,{
     url: data.video
 },res);
 }catch{
  createResponse(500,'please try later, or contact support',res);
 }
}


export async function getCourses (res: any, id: string){
 try{
const courses = new CoursesModel();
 const data = await courses.collection.find(sanitize({user_id: id}));
 console.log(data);
     if(!data){
          createResponse(404,'Not found',res)
     }else {
         createResponse(200,{data},res)
     }
 }catch(error: any){
     console.log(error)
 createResponse(500,'error',res)
 }
}