import { Router } from "express";
import { addCourses } from "../../controllers/courses/addCourses";
import { isAuth } from "../../middlwares/authMiddlwares/authVefification";
import { getCoursesByUserId } from "../../controllers/courses/getCourses";
import { uploadVideo } from "../../services/multer";

const express = require('express');
const CoursesRouter: Router = express.Router();

CoursesRouter.route('/add/course').post(isAuth,uploadVideo.array('videos', 5),addCourses);
CoursesRouter.route('/courses/:page').get(isAuth,getCoursesByUserId);

module.exports = CoursesRouter;