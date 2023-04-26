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

export async function getCourses(res: Response, id: string, module: string) {
    try {
        const courses = new CoursesModel()
        // let pagination: Pagination = {} as Pagination
        courses.collection
            .countDocuments({ user_id: sanitize(id) })
            .then((doc: any) => {
                if (doc === 0) {
                    createResponse(200, [], res)
                } else {
                    // pagination = getPaginationByPageNumber(doc, 50, 100, page)
                    getCoursesCollections(
                        module,
                        id,
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
    // _skip: number,
    // _limit: number,
    res: Response
    // totalPages: number,
    // currentPage: number,
    // nextPage: number
) => {
    getCoursesData(id, module)
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
    module: string
): Promise<any[] | null> {
    const courses = new CoursesModel()
    const data: any[] = []
    await courses.collection
        .find(sanitize({ user_id: id, module }))
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
