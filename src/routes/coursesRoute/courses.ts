import { Router } from 'express'
import { addCourses } from '../../controllers/courses/addCourses'
import { getCoursesByUserId } from '../../controllers/courses/getCourses'
import { isAuth } from '../../middlewares/authMiddleware/middleware'

import express from 'express'
const CoursesRouter: Router = express.Router()
import multer from 'multer'
import { getVideoByID } from '../../controllers/courses/getVideoByID'
import { updateCourseDetails } from '../../controllers/courses/updateCourse'
// import path from 'path'

const storage = multer.memoryStorage()

export const uploadVideo = multer({ storage })

const fields = [
    { name: 'file', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 },
]

CoursesRouter.route('/add/course').post(
    isAuth,
    uploadVideo.fields(fields),
    addCourses
)
CoursesRouter.route('/courses/:module').get(isAuth, getCoursesByUserId)
CoursesRouter.route('/course/:id').get(isAuth, getVideoByID)
CoursesRouter.route('/update/course/:id').put(
    isAuth,
    uploadVideo.fields(fields),
    updateCourseDetails
)

module.exports = CoursesRouter
