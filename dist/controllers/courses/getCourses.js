"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCoursesByUserId = void 0;
var coursesConnection_1 = require("../../services/courses/coursesConnection");
// import { decodToken } from "../../services/parseToken"
var getCoursesByUserId = function (req, res) {
    // const id = decodToken(req.cookies.access_token,res) || req.headers.id
    // const id = req.body.id;
    (0, coursesConnection_1.getCourses)(res, '1', req.params.page);
};
exports.getCoursesByUserId = getCoursesByUserId;
