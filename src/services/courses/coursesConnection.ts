import { Response } from "express";
import { Courses, CoursesModel } from "../../models/courses";
import { ErrorCodeStatus, responseErrorHandler } from "../../utils/ErrorHandler";
import { Pagination, getPaginationByPageNumber } from "../../utils/calculatePagination";
import { createResponse } from "../../utils/resultStatus";
const sanitize = require("mongo-sanitize");

export function addCourse(data: Courses, res: Response){
 try{
 const courses = new CoursesModel(sanitize(data));
 courses.save();
 createResponse(202,{
     url: data.video
 },res);
 }catch{
  responseErrorHandler(ErrorCodeStatus.TIME_OUT_ERROR,'please try later, or contact support',res);
 }
}


export async function getCourses (res: Response, id: string, page?: number){
 try{
const courses = new CoursesModel();
let pagination: Pagination = {} as Pagination;
courses.collection.countDocuments({user_id: sanitize(id)})
            .then((doc: any) =>{

                pagination = getPaginationByPageNumber(doc,50,100,page)
               getCoursesCollections(id,pagination.skip,pagination.limit,res,pagination.totalPages,pagination.currentPage,pagination.nenxtPage)

            }).catch(_err=>{
              return  responseErrorHandler(ErrorCodeStatus.TIME_OUT_ERROR,'internal server error',res)
            })

 }catch(error: any){
      responseErrorHandler(ErrorCodeStatus.INTERNAL_SERVER_ERROR,'internal server error',res)
 }
}


const getCoursesCollections = (id: string,_skip: number, _limit: number, res: Response,totalPages: number, currentPage: number, nextPage: number) => {
    const courses = new CoursesModel();
    let data: any[] = [];
courses.collection.find(sanitize({user_id: id})).forEach(value=>{
     data.push(value);
 })
  setTimeout(() => {
      verifyCoursesData(data,res,totalPages,currentPage,nextPage);
  }, 3000);
}


const verifyCoursesData =(data: any[], res: any,totalPages: number, currentPage: number, nextPage: number) => {
    if(!data){
          createResponse(404,'Not found',res)
     }else {
         createResponse(200,{data,totalPages, currentPage, nextPage},res)
     }
}