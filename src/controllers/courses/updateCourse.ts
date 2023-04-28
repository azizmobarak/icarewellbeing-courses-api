import { Courses, CoursesModel } from '../../models/courses'
const ObjectId = require('mongodb').ObjectId
import sanitize from 'mongo-sanitize'
import { createResponse } from '../../utils/resultStatus'
import { Request, Response } from 'express'

export const updateCourseDetails = (req: Request, res: Response) => {
    const id = req.params.id
    const data = req.body
    return findAndUpdate(id, data, res)
        .then((doc) => {
            if (doc) {
                createResponse(204, 'video details updated', res)
            } else {
                createResponse(200, [], res)
            }
        })
        .catch((err) => {
            console.log(err)
            createResponse(502, 'internal Error', res)
        })
}

async function findAndUpdate(id: string, data: Courses, _res: Response) {
    const course = new CoursesModel()
    return course.collection.findOneAndUpdate(
        { _id: new ObjectId(sanitize(id)) },
        { $set: { name: data.name, description: data.description } }
    )
}
