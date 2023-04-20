import { Router } from 'express'
import { addCourses } from '../../controllers/courses/addCourses'
import { getCoursesByUserId } from '../../controllers/courses/getCourses'
import { isAuth } from '../../middlewares/authMiddleware/middleware'

import express from 'express'
const CoursesRouter: Router = express.Router()
import multer from 'multer'
// import path from 'path'

const storage = multer.memoryStorage()

// function checkFileType(file: any, cb: any) {
//     const filetypes = /mp4|mp3|png/ // Choose Types you want...
//     const extname = filetypes.test(
//         path.extname(file.originalname).toLowerCase()
//     )
//     const mimetype = filetypes.test(file.mimetype)

//     if (extname && mimetype) {
//         return cb(null, true)
//     } else {
//         cb('Videos only!') // custom this message to fit your needs
//     }
// }

// const upload = multer({
//     storage,
//     fileFilter: function (_req: Request, file: any, cb: any) {
//         checkFileType(file, cb)
//     },
// })

export const uploadVideo = multer({ storage })

CoursesRouter.route('/add/course').post(
    isAuth,
    uploadVideo.single('file'),
    addCourses
)
CoursesRouter.route('/courses/:page').get(isAuth, getCoursesByUserId)

module.exports = CoursesRouter
