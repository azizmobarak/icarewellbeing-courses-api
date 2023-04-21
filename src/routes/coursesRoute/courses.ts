import { Router } from 'express'
import { addCourses } from '../../controllers/courses/addCourses'
import { getCoursesByUserId } from '../../controllers/courses/getCourses'
import { isAuth } from '../../middlewares/authMiddleware/middleware'

import express from 'express'
const CoursesRouter: Router = express.Router()
import multer from 'multer'
// import path from 'path'

const storage = multer.memoryStorage()

export const uploadVideo = multer({ storage })

CoursesRouter.route('/add/course').post(
    isAuth,
    uploadVideo.single('file'),
    addCourses
)
CoursesRouter.route('/courses/:page').get(isAuth, getCoursesByUserId)

module.exports = CoursesRouter
