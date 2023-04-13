import { CoursesModel } from "../../models/courses";
import { createResponse } from "../../utils/resultStatus";
const sanitize = require("mongo-sanitize");

export interface Course {
    video: string;
    user_id: string;
}

export function addCourse(data: Course, res: any){
    console.log(data)
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