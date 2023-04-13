import { Router } from "express";
import { addCourses } from "../../controllers/courses/addCourses";
import { isAuth } from "../../middlwares/authMiddlwares/authVefification";

const express = require('express');
const CoursesRouter: Router = express.Router();

CoursesRouter.route('/add/course').post(isAuth,addCourses);

module.exports = CoursesRouter;