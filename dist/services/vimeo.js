"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadVimeoVideos = exports.getVimeoCourses = void 0;
var resultStatus_1 = require("../utils/resultStatus");
var coursesConnection_1 = require("./courses/coursesConnection");
var uploadVideos_1 = require("./uploadVideos");
var Vimeo = require('vimeo').Vimeo;
var client = new Vimeo(process.env.client_id, process.env.client_secret, process.env.access_token);
function getVimeoCourses() {
    client.request({
        method: 'GET',
        path: '/tutorial'
    }, function (_error, _body, _status_code, _headers) { });
}
exports.getVimeoCourses = getVimeoCourses;
function uploadVimeoVideos(data, res) {
    client.upload('videos/' + data.video, {
        'name': data.name,
        'description': data.description
    }, function (uri) {
        var video_code = uri.split('/')[2];
        (0, coursesConnection_1.addCourse)(__assign(__assign({}, data), { video: video_code }), res);
    }, function (bytesUploaded, bytesTotal) {
        var percentage = (bytesUploaded / bytesTotal * 100).toFixed(2);
        if (parseInt(percentage) === 100) {
            setTimeout(function () {
                (0, uploadVideos_1.deleteVideoLocally)('videos/' + data.video);
            }, 6000);
        }
    }, function (error) {
        (0, resultStatus_1.createResponse)(500, { error: error }, res);
    });
}
exports.uploadVimeoVideos = uploadVimeoVideos;
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
