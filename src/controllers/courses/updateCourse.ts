import { Request, Response } from 'express'
// import { uploadToS3 } from '../../services/awsS3service'
import { CoursesModel } from '../../models/courses'
import sanitize from 'mongo-sanitize'
import { ObjectId } from 'mongodb'

export const updateCourseDetails = (req: Request, res: Response) => {
    console.log(req.files)
    const id = req.params.id
    const data = req.body
    return addNewFilesToS3(req.files, data, res, id)
}

async function addNewFilesToS3(
    files: any,
    data: any,
    _res: Response,
    id: string
) {
    const emptyName = { originalname: '' }
    const thumbnail = files.thumbnail ? files.thumbnail[0] : emptyName
    const video = files.file ? files.file[0] : emptyName
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
                removeUpdatedFilesFromS3(updateData.video, updateData.thumbnail)
                // return await uploadToS3(
                //     updateData,
                //     video.originalname,
                //     video.buffer,
                //     thumbnail.buffer,
                //     video.mimetype,
                //     thumbnail.mimetype,
                //     video.size,
                //     res,
                //     id
                // )
            }
        })
        .catch((err) => {
            console.log(err)
        })
}

const getFileToBeRemoved = async (video: string, thumbnail: string) => {
    const course = new CoursesModel()
    if (video && !thumbnail) {
        return await course.collection.findOne({ video }).then((doc) => {
            return doc?.video
        })
    } else {
        if (!video && thumbnail) {
            return await course.collection
                .findOne({ thumbnail })
                .then((doc) => {
                    return doc?.thumbnail
                })
        } else {
            return await course.collection
                .findOne({ thumbnail, video })
                .then((doc) => {
                    return {
                        video: doc?.video,
                        thumbnail: doc?.thumbnail,
                    }
                })
        }
    }
}

async function removeUpdatedFilesFromS3(video: string, thumbnail: string) {
    const remove = await getFileToBeRemoved(video, thumbnail)
    console.log(remove)
}
