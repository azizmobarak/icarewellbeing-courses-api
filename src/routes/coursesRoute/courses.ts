import { Router } from 'express'
import { addCourses } from '../../controllers/courses/addCourses'
import { getCoursesByUserId } from '../../controllers/courses/getCourses'
import { isAuth } from '../../middlewares/authMiddleware/middleware'

import express from 'express'
const CoursesRouter: Router = express.Router()
import multer from 'multer'

// const storage = multer.diskStorage({
//   destination: function (_req, _file, cb) {
//     cb(null, "./videos")
//   },
//   filename: function (_req, file, cb) {
//     //   console.log('size of file ',file.size);
//     cb(null,file.originalname)
//   },
// });

const storage = multer.memoryStorage();

const uploadVideo = multer({storage})


CoursesRouter.route('/add/course').post(
    isAuth,
    uploadVideo.single('file'),
    addCourses
)
CoursesRouter.route('/courses/:page').get(isAuth, getCoursesByUserId)

module.exports = CoursesRouter
