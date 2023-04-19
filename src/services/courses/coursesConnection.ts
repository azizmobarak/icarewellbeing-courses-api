/* eslint-disable @typescript-eslint/no-var-requires */
import { Response } from 'express'
import { Courses, CoursesModel } from '../../models/courses'
import { ErrorCodeStatus, responseErrorHandler } from '../../utils/ErrorHandler'
import {
    Pagination,
    getPaginationByPageNumber,
} from '../../utils/calculatePagination'
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

export async function getCourses(res: Response, id: string, page?: number) {
    try {
        const courses = new CoursesModel()
        let pagination: Pagination = {} as Pagination
        courses.collection
            .countDocuments({ user_id: sanitize(id) })
            .then((doc: any) => {
                console.log('count', doc)
                if (doc === 0) {
                    createResponse(200, [], res)
                } else {
                    pagination = getPaginationByPageNumber(doc, 50, 100, page)
                    getCoursesCollections(
                        id,
                        pagination.skip,
                        pagination.limit,
                        res,
                        pagination.totalPages,
                        pagination.currentPage,
                        pagination.nextPage
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
    id: string,
    _skip: number,
    _limit: number,
    res: Response,
    totalPages: number,
    currentPage: number,
    nextPage: number
) => {
    getCoursesData(id)
        .then(async (data) => {
            if (data) {
                await fetchDataFromS3(
                    res,
                    data,
                    totalPages,
                    currentPage,
                    nextPage
                )
            } else {
                createResponse(200, 'No Data', res)
            }
        })
        .catch((err) => {
            console.log(err)
        })
}

async function getCoursesData(id: string): Promise<any[] | null> {
    const courses = new CoursesModel()
    const data: any[] = []
    return new Promise(async (resolve, _reject) => {
        await courses.collection
            .find(sanitize({ user_id: id }))
            .forEach((value) => {
                data.push(value)
            })
        resolve(data)
    })
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
