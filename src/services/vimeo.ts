import { Courses } from "../models/courses";
import { createResponse } from "../utils/resultStatus";
import { addCourse } from "./courses/coursesConnection";
import { deleteVideoLocally } from "./uploadVideos";

let Vimeo = require('vimeo').Vimeo;
let client = new Vimeo(process.env.client_id,process.env.client_secret, process.env.access_token);

export function getVimeoCourses(){
  client.request({
    method: 'GET',
    path: '/tutorial'
  }, function (_error: string, _body: any, _status_code: number, _headers: any) {})
}

export function uploadVimeoVideos (data: Courses, res: any) {
    client.upload(
   'videos/'+data.video,
   {
    'name': data.name,
    'description': data.description
  },
  function (uri: string) {
      const video_code = uri.split('/')[2];
      addCourse({...data,video: video_code}, res);
  },
  function (bytesUploaded: any, bytesTotal: any) {
    var percentage = (bytesUploaded / bytesTotal * 100).toFixed(2)
    if(parseInt(percentage) === 100){
      setTimeout(()=>{
        deleteVideoLocally('videos/'+data.video).then((value: boolean)=> console.log(value))
        .catch(err => console.log(err));
      }, 6000)
}

  },
  function (error: string) {
    createResponse(500,{error: error}, res)
  }
)
}



// export function getCoursesWithVimeo(uri: string, res: any){
// client.request('https://vimeo.com/'+uri, function (error: string, body: any, statusCode: number, headers: Object) {
//   if (error) {
//     console.log('There was an error making the request ', statusCode, headers)
//     console.log('Server reported: ' + error)
//     createResponse(200,error,res);
//     return
//   }
//   console.log('Your video link is: ' + body.link)
//   return body.link;
// })
// }


