"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadVideo = void 0;
var addCourses_1 = require("../../controllers/courses/addCourses");
// import { isAuth } from "../../middlwares/authMiddlwares/authVefification";
var getCourses_1 = require("../../controllers/courses/getCourses");
// import { uploadVideo } from "../../services/multer";
var express = require('express');
var CoursesRouter = express.Router();
// isAuth
// const multer = require("multer");
// const storage = () => multer.diskStorage({
//     destination: function (_req: any, _file: any, cb: any) {
//         cb(null, 'videos')
//     },
//     filename: function (req: any, file: any, cb: any) {
//         cb(null, req.body.name + file.originalname)
//     },
// })
var multer = require('multer');
var path_1 = __importDefault(require("path"));
var storage = multer.diskStorage({
    destination: function (_req, _file, cb) {
        cb(null, 'videos/');
    },
    filename: function (_req, file, cb) {
        cb(null, "".concat(file.fieldname, "-").concat(Date.now()).concat(path_1.default.extname(file.originalname)));
    },
});
function checkFileType(file, cb) {
    var filetypes = /mp4|mp3|png/; // Choose Types you want...
    var extname = filetypes.test(path_1.default.extname(file.originalname).toLowerCase());
    var mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
        return cb(null, true);
    }
    else {
        cb('Images only!'); // custom this message to fit your needs
    }
}
var upload = multer({
    storage: storage,
    fileFilter: function (_req, file, cb) {
        checkFileType(file, cb);
    },
});
exports.uploadVideo = multer({ dest: "videos/", storage: storage });
CoursesRouter.route('/add/course').post(upload.array('videos', 5), addCourses_1.addCourses);
CoursesRouter.route('/courses/:page').get(getCourses_1.getCoursesByUserId);
module.exports = CoursesRouter;
