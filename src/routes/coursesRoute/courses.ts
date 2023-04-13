import { Router } from "express";
import { addCourses } from "../../controllers/courses/addCourses";
import { isAuth } from "../../middlwares/authMiddlwares/authVefification";
import { getCoursesByUserId } from "../../controllers/courses/getCourses";

const express = require('express');
const CoursesRouter: Router = express.Router();

const multer = require("multer");
const storage = multer.diskStorage({
    destination: function (req: any, file: any, cb: any) {
        console.log(req.s,file.d)
        // console.log(file, req);
        cb(null, 'videos')
    },
    filename: function (req: any, file: any, cb: any) {
        cb(null, req.body.name + file.originalname)
    },
})

const upload = multer({ dest: "videos/", storage });

CoursesRouter.route('/add/course').post(isAuth,upload.array('videos', 5),addCourses);
CoursesRouter.route('/courses').get(isAuth,getCoursesByUserId);

module.exports = CoursesRouter;