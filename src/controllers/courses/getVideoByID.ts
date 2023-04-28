import { Request, Response } from 'express'
import { CoursesModel } from '../../models/courses'
import { createResponse } from '../../utils/resultStatus'
import { fetchDataFromS3 } from '../../services/awsS3service'
const ObjectId = require('mongodb').ObjectId
const sanitize = require('mongo-sanitize')

export const getVideoByID = async (req: Request, res: Response) => {
    await findVideoById(req.params.id, res).then((course) => {
        if (!course) {
            return createResponse(440, [], res)
        } else {
            return fetchDataFromS3(res, [course])
        }
    })
}

const findVideoById = async (
    id: string,
    res: Response
): Promise<any | null> => {
    const courses = new CoursesModel()
    const _id = new ObjectId(id)
    return await courses.collection
        .findOne({ _id: sanitize(_id) })
        .then((doc) => {
            return doc
        })
        .catch((err) => {
            console.log(err)
            createResponse(440, [], res)
            return null
        })
}
