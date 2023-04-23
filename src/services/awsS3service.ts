/* eslint-disable @typescript-eslint/no-var-requires */
import * as AWS from '@aws-sdk/client-s3'
import crypt from 'crypto'
import { Courses } from '../models/courses'
import { Response } from 'express'
import { addCourse } from './courses/coursesConnection'
import { createResponse } from '../utils/resultStatus'
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')

const s3Config = {
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY || '',
        secretAccessKey: process.env.AWS_ACCESS_SECRET || '',
    },
}

const client = new AWS.S3(s3Config)

// const accParams = {
//         Bucket: process.env.BUCKET_NAME || '',
//         AccelerateConfiguration: { /* required */
//            Status: 'Enabled'
//         },
//     }
 
// client.putBucketAccelerateConfiguration(accParams);

export async function uploadFileToS3(
    data: Courses,
    originalName: string,
    buffer: Buffer,
    mimeType: string,
    res: Response
) {
    const imageName = crypt.randomBytes(20).toString('hex')
    const params = {
        Bucket: process.env.BUCKET_NAME || '',
        Key: imageName + data.user_id + originalName,
        Body: buffer,
        ContentType: mimeType,
    }

    const command = new AWS.PutObjectCommand(params)
    await client
        .send(command)
        .then((result) => {
            console.log('video uploaded to s3', result)
            const course = { ...data, video: params.Key }
            addCourse(course, res)
        })
        .catch((err) => {
            console.log('video s3 error', err)
        })
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function fetchDataFromS3(
    res: Response,
    data: Courses[],
    totalPages: number,
    currentPage: number,
    nextPage: number
) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return Promise.all([fillData(data)])
        .then((result) => {
            createResponse(
                200,
                { data: result, totalPages, currentPage, nextPage },
                res
            )
        })
        .catch(() => {
            createResponse(404, 'No data Found', res)
        })
}

const fillData = async (data: Courses[]) => {
    const responseData: any[] = []
    let index = 0
    do {
        const getObjectParams = {
            Bucket: process.env.BUCKET_NAME || '',
            Key: data[index].video,
        }
        const command = new AWS.GetObjectCommand(getObjectParams)
        const url = await getSignedUrl(client, command, { expiresIn: 3600 })
        await responseData.push(preparedVideos(data[index], url))
        index++
    } while (index < data.length)
    return responseData.reverse()
}

const preparedVideos = (data: Courses, url: string) => {
    return {
        title: data.name,
        description: data.description,
        url: url,
        id: data.user_id,
    }
}
