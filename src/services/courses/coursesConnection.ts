/* eslint-disable @typescript-eslint/no-var-requires */
import { Response } from 'express'
import { Courses, CoursesModel } from '../../models/courses'
import { ErrorCodeStatus, responseErrorHandler } from '../../utils/ErrorHandler'
// import {
//     Pagination,
//     getPaginationByPageNumber,
// } from '../../utils/calculatePagination'
import { createResponse } from '../../utils/resultStatus'
import { fetchDataFromS3 } from '../awsS3service'
import { ObjectId } from 'mongodb'
const sanitize = require('mongo-sanitize')

export function addCourse(data: Courses, res: Response) {
    try {
        const courses = new CoursesModel(sanitize(data))
        courses.save()
        createResponse(
            202,
            {
                url: data.video,
            },
            res
        )
    } catch {
        responseErrorHandler(
            ErrorCodeStatus.TIME_OUT_ERROR,
            'please try later, or contact support',
            res
        )
    }
}

export const getCoursesQuery = (id: string, role: string) => {
    switch (role) {
        case '0':
            return {}
        default:
            return {
                user_id: sanitize(id),
            }
    }
}

export async function getCourses(
    res: Response,
    id: string,
    role: string,
    module: string
) {
    try {
        const courses = new CoursesModel()
        // let pagination: Pagination = {} as Pagination
        courses.collection
            .countDocuments(getCoursesQuery(id, role))
            .then((doc: any) => {
                if (doc === 0) {
                    createResponse(200, [], res)
                } else {
                    // pagination = getPaginationByPageNumber(doc, 50, 100, page)
                    getCoursesCollections(
                        module,
                        id,
                        role,
                        // pagination.skip,
                        // pagination.limit,
                        res
                        // pagination.totalPages,
                        // pagination.currentPage,
                        // pagination.nextPage
                    )
                }
            })
            .catch((_err) => {
                return responseErrorHandler(
                    ErrorCodeStatus.TIME_OUT_ERROR,
                    'internal server error',
                    res
                )
            })
    } catch (error: any) {
        responseErrorHandler(
            ErrorCodeStatus.INTERNAL_SERVER_ERROR,
            'internal server error',
            res
        )
    }
}

const getCoursesCollections = async (
    module: string,
    id: string,
    role: string,
    // _skip: number,
    // _limit: number,
    res: Response
    // totalPages: number,
    // currentPage: number,
    // nextPage: number
) => {
    await getCoursesData(id, role, module)
        .then(async (data) => {
            if (data && data.length > 0) {
                await fetchDataFromS3(
                    res,
                    data
                    // totalPages,
                    // currentPage,
                    // nextPage
                )
            } else {
                createResponse(200, [], res)
            }
        })
        .catch((_err: string) => {
            createResponse(403, 'an is error is thrown, please try again', res)
        })
}

async function getCoursesData(
    id: string,
    role: string,
    module: string
): Promise<any[] | null> {
    const courses = new CoursesModel()
    const data: any[] = []
    await courses.collection
        .find(sanitize({ ...getCoursesQuery(id, role), module }))
        .forEach((value) => {
            data.push(value)
        })
    return data
}

// const verifyCoursesData = (
//     data: any[],
//     res: any,
//     totalPages: number,
//     currentPage: number,
//     nextPage: number
// ) => {
//     if (!data) {
//         createResponse(404, 'Not found', res)
//     } else {
//         createResponse(200, { data, totalPages, currentPage, nextPage }, res)
//     }
// }

export async function findAndUpdateCourse(
    id: string,
    data: any,
    res: Response
) {
    try {
        const course = new CoursesModel()
        await course.collection.findOneAndUpdate(
            { _id: new ObjectId(sanitize(id)) },
            { $set: { ...data } }
        )
        createResponse(200, 'updated with success', res)
    } catch (err) {
        console.log(err)
        createResponse(405, 'not updated', res)
    }
}
