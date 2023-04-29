import { Request, Response } from 'express'
import { uploadToS3 } from '../../services/awsS3service'
import { CoursesModel } from '../../models/courses'
import sanitize from 'mongo-sanitize'
import { ObjectId } from 'mongodb'

export const updateCourseDetails = (req: Request, res: Response) => {
    const id = req.params.id
    const data = req.body
    return addNewFilesToS3(req.files, data, res, id)
}

async function addNewFilesToS3(
    files: any,
    data: any,
    res: Response,
    id: string
) {
    const thumbnail = files.thumbnail[0]
    const video = files.file[0]
    const course = new CoursesModel()
    course.collection
        .findOne({ _id: sanitize(new ObjectId(id)) })
        .then(async (doc) => {
            console.log(doc)
            if (doc) {
                const updateData = {
                    user_id: doc.user_id,
                    video: video.originalname,
                    thumbnail: thumbnail.originalname,
                    name: data.name,
                    description: data.description,
                }
                return await uploadToS3(
                    updateData,
                    video.originalname,
                    video.buffer,
                    thumbnail.buffer,
                    video.mimetype,
                    thumbnail.mimetype,
                    video.size,
                    res,
                    id
                )
            }
        })
        .catch((err) => {
            console.log(err)
        })
}
