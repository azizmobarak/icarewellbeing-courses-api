/* eslint-disable @typescript-eslint/no-var-requires */
import * as AWS from '@aws-sdk/client-s3'
import crypt from 'crypto'
import { Courses } from '../models/courses'
import { Response } from 'express'
import { addCourse, findAndUpdateCourse } from './courses/coursesConnection'
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

const imageName = crypt.randomBytes(20).toString('hex')

async function initiateMultipartUpload(key: string, bucket: string) {
    try {
        return await client.send(
            new AWS.CreateMultipartUploadCommand({ Key: key, Bucket: bucket })
        )
    } catch (err) {
        console.log(err)
        return err
        // error handler function here
    }
}

async function uploadPart(
    body: any,
    UploadId: string,
    partNumber: number,
    data: Courses,
    originalName: string
) {
    const partParams = {
        Bucket: process.env.BUCKET_NAME || '',
        Body: body,
        Key: imageName + data.user_id + originalName.replace(' ', ''),
        UploadId: UploadId,
        PartNumber: partNumber,
    }
    return new Promise(async (resolve, reject) => {
        try {
            let part = await client.send(new AWS.UploadPartCommand(partParams))
            resolve({ PartNumber: partNumber, ETag: part.ETag })
        } catch (error) {
            reject({ partNumber, error })
        }
    })
}

export const uploadToS3 = async (
    data: Courses | any,
    originalName: string,
    buffer: Buffer,
    thumbnailBuffer: Buffer,
    mimeType: string,
    thumbnailMimeType: string,
    size: number,
    res: Response,
    course_id?: string
) => {

    try {
        const params = {
            Bucket: process.env.BUCKET_NAME || '',
            Key: imageName + data.user_id + originalName.replace(' ', ''),
            Body: buffer,
            ContentType: mimeType,
        }

        // when video is not sent
         if(!data.video){
             console.log('no video')
          return  await uploadTumbnailOrUpdateDataWithThumbnail(data,thumbnailBuffer,thumbnailMimeType,'',res,course_id);
          }

        const fileSize = size // total size of file
        const chunkSize = 1024 * 1024 * 5 // 5MB defined as each parts size
        const numParts = Math.ceil(fileSize / chunkSize)
        const promise = [] // array to hold each async upload call
        const slicedData = [] // array to contain our sliced data
        let Parts: any[] = [] //  to hold all Promise.allSettled resolve and reject response
        let MP_UPLOAD_ID = null // contain the upload ID to use for all processes
        let FailedUploads: any = [] // array to populate failed upload
        let CompletedParts = []
        let RetryPromise = []

        MP_UPLOAD_ID = await initiateMultipartUpload(
            params.Key,
            params.Bucket
        ).then((result: any) => {
            return result['UploadId']
        })

        for (let index = 1; index <= numParts; index++) {
            let start = (index - 1) * chunkSize
            let end = index * chunkSize

            promise.push(
                uploadPart(
                    index < numParts
                        ? buffer.slice(start, end)
                        : buffer.slice(start),
                    MP_UPLOAD_ID,
                    index,
                    data,
                    originalName
                )
            )

            slicedData.push({
                PartNumber: index,
                buffer: Buffer.from(buffer.slice(start, end + 1)),
            })
        }

        Parts = await Promise.allSettled(promise)
        FailedUploads = Parts.filter((f) => f.status == 'rejected')

        if (!FailedUploads.length) {
            for (let i = 0; i < FailedUploads.length; i++) {
                let [data_res] = slicedData.filter(
                    (f) => f.PartNumber == FailedUploads[i].value.PartNumber
                )
                let s = await uploadPart(
                    data_res.buffer,
                    MP_UPLOAD_ID,
                    data_res.PartNumber,
                    data,
                    originalName
                )
                RetryPromise.push(s)
            }
        }

        CompletedParts = Parts.map((m) => m.value)
        CompletedParts.push(...RetryPromise)

        const s3ParamsComplete = {
            Key: params.Key,
            Bucket: params.Bucket,
            UploadId: MP_UPLOAD_ID,
            MultipartUpload: {
                Parts: CompletedParts,
            },
        }

         if(!data.thumbnail && course_id){
           return  await client
            .send(new AWS.CompleteMultipartUploadCommand(s3ParamsComplete))
            .then(async (result) => {
                if (result) {
                            const course = {
                                 user_id: data.user_id,
                                 name: data.name,
                                 description: data.description,
                                 video: params.Key,
                            }
                             findAndUpdateCourse(course_id, course, res)
                        }
            })

          }
       

        await client
            .send(new AWS.CompleteMultipartUploadCommand(s3ParamsComplete))
            .then(async (_result) => {
                await uploadTumbnailOrUpdateDataWithThumbnail(data,thumbnailBuffer,thumbnailMimeType,params,res,course_id);
            })
    } catch (e) {
        console.log('2', e)
        createResponse(
            500,
            'cannot upload thumbnail please try or contact support',
            res
        )
    }
}

const uploadTumbnailOrUpdateDataWithThumbnail = async(data: any,thumbnailBuffer: Buffer,thumbnailMimeType: string, params: any, res: Response,course_id?: string) => {
    console.log('thumb update data', data.thumbnail,
                    thumbnailBuffer,
                    thumbnailMimeType,
                    data.user_id)
     await uploadThumbnailFileToS3(
                    data.thumbnail,
                    thumbnailBuffer,
                    thumbnailMimeType,
                    data.user_id
                )
                    .then((result) => {
                        if (result) {
                            if(!params.Key && course_id){
                                const course = {
                                user_id: data.user_id,
                                name: data.name,
                                description: data.description,
                                thumbnail: result,
                            }
                              findAndUpdateCourse(course_id, course, res)
                            }else {
                                
                            if (course_id) {
                                const course = {
                                ...data,
                                thumbnail: result,
                                video: params.Key,
                                }
                                findAndUpdateCourse(course_id, course, res)
                            } else {
                                const course: Courses = {
                                ...data,
                                thumbnail: result,
                                video: params.Key,
                            }
                                addCourse(course, res)
                            }
                            
                        }
                    }})
                    .catch((err) => {
                        console.log('1', err)
                        createResponse(
                            500,
                            'cannot upload thumbnail please try or contact support',
                            res
                        )
                    })
}

// for images upload use this function
export async function uploadThumbnailFileToS3(
    originalName: string,
    buffer: Buffer,
    mimeType: string,
    user_id: string
): Promise<null | string> {
    const params = {
        Bucket: process.env.BUCKET_NAME || '',
        Key: imageName + user_id + originalName.replace(' ', ''),
        Body: buffer,
        ContentType: mimeType,
    }
    const command = new AWS.PutObjectCommand(params)
    return await client
        .send(command)
        .then((_result) => {
            return params.Key
        })
        .catch((err) => {
            console.log(err)
            return null
        })
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function fetchDataFromS3(
    res: Response,
    data: Courses[]
    // totalPages: number,
    // currentPage: number,
    // nextPage: number
) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return Promise.all([fillData(data)])
        .then((result) => {
            createResponse(200, result, res)
        })
        .catch(() => {
            createResponse(200, [], res)
        })
}

const fillData = async (data: Courses[]) => {
    const responseData: any[] = []
    let index = 0
    do {
        const getVideoParams = {
            Bucket: process.env.BUCKET_NAME || '',
            Key: data[index].video,
        }
        const getThumbnailParams = {
            Bucket: process.env.BUCKET_NAME || '',
            Key: data[index].thumbnail,
        }
        // get Video
        const videoCommand = new AWS.GetObjectCommand(getVideoParams)
        const url = await getSignedUrl(client, videoCommand, {
            expiresIn: 3600,
        })

        // get Thumbnail
        let thumbnail = ''
        if (data[index].thumbnail) {
            const thumbnailCommand = new AWS.GetObjectCommand(
                getThumbnailParams
            )
            thumbnail = await getSignedUrl(client, thumbnailCommand, {
                expiresIn: 3600,
            })
        }

        await responseData.push(preparedVideos(data[index], url, thumbnail))
        index++
    } while (index < data.length)
    return responseData.reverse()
}

const preparedVideos = (data: any, url: string, thumbnail: string) => {
    return {
        _id: data._id,
        id: data.user_id,
        title: data.name,
        description: data.description,
        url,
        thumbnail,
        videoNumber: data.videoNumber,
        author: data.author,
    }
}

// an other way  to store videos as chunks
// await client.send(new AWS.PutObjectCommand(params));
// const uploadToS3 = new Upload({
//     client,
//     queueSize: 4,
//     partSize: 5242880,
//     leavePartsOnError: false,
//     params: params,
// })

// const form = new IncomingForm({ multiples: true });

// form.parse(async function (_err: any, _fields: any, files: any) {
//     // const fileStream = fs.createReadStream(files.payload.filepath)
// }

// await uploadToS3
//     .done()
//     .then((result: any) => {
//         console.log(result)
//         const course = { ...data, video: params.Key }
//         addCourse(course, res)
//     })
//     .catch((err) => {
//         console.log('video s3 error', err)
//         createResponse(500, 'cannot upload video please try later', res)
//     })
