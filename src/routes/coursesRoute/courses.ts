import { Request, Router } from "express";
import { addCourses } from "../../controllers/courses/addCourses";
import { isAuth } from "../../middlwares/authMiddlwares/authVefification";
import { getCoursesByUserId } from "../../controllers/courses/getCourses";

const express = require('express');
const CoursesRouter: Router = express.Router();


const multer =  require('multer');
import path from 'path';

const storage = multer.diskStorage({
  destination(_req: any, _file: any, cb: any) {
    cb(null, 'videos/')
  },
  filename(_req: any, file: any, cb: any) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    )
  },
})

function checkFileType(file: any, cb: any) {
  const filetypes = /mp4|mp3|png/ // Choose Types you want...
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = filetypes.test(file.mimetype)

  if (extname && mimetype) {
    return cb(null, true)
  } else {
    cb('Images only!') // custom this message to fit your needs
  }
}

const upload = multer({
  storage,
  fileFilter: function (_req: Request, file: any, cb: any) {
    checkFileType(file, cb)
  },
})


export const uploadVideo = multer({ dest: "videos/", storage });

CoursesRouter.route('/add/course').post(isAuth,upload.array('videos', 5), addCourses);
CoursesRouter.route('/courses/:page').get(getCoursesByUserId);

module.exports = CoursesRouter;