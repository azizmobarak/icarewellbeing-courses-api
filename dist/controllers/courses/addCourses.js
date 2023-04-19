"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCourses = void 0;
// import { decodToken } from "../../services/parseToken";
var vimeo_1 = require("../../services/vimeo");
var addCourses = function (req, res) {
    //  const id  = decodToken(req.cookies.access_token,res)
    var data = {
        user_id: '1',
        video: req.files[0].filename,
        name: req.body.name,
        description: req.body.description
    };
    console.log(data);
    return (0, vimeo_1.uploadVimeoVideos)(data, res);
};
exports.addCourses = addCourses;
