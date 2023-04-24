/* eslint-disable @typescript-eslint/no-var-requires */
import * as AWS from '@aws-sdk/client-s3'
import crypt from 'crypto'
import { Courses } from '../models/courses'
import { Response } from 'express'
import { addCourse } from './courses/coursesConnection'
import { createResponse } from '../utils/resultStatus'
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')
// import { Upload } from '@aws-sdk/lib-storage'
// import fs from 'fs';

const s3Config = {
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY || '',
        secretAccessKey: process.env.AWS_ACCESS_SECRET || '',
    },
}

const client = new AWS.S3(s3Config)

const imageName = crypt.randomBytes(20).toString('hex')



async function initiateMultipartUpload(key: string,bucket: string) {
    try {
      return await client.send(new AWS.CreateMultipartUploadCommand({Key: key, Bucket: bucket}))
    } catch (err) {
        return err;
        // error handler function here
    }
}

async function uploadPart(body: any, UploadId: string, partNumber: number, data: any, originalName: string) {
    const partParams = {
        Bucket: process.env.BUCKET_NAME || '',
        Body: body,
        Key: imageName + data.user_id + originalName.replace(' ', ''),
        UploadId: UploadId,
        PartNumber: partNumber
    }
    return new Promise(async (resolve, reject) => {
        try {
            let part = await client.send(new AWS.UploadPartCommand(partParams))
            resolve({ PartNumber: partNumber, ETag: part.ETag });
        } catch (error) {
            reject({ partNumber, error });
        }
    })
}


export const uploadToS3 = async (
    data: Courses,
    originalName: string,
    buffer: Buffer,
    mimeType: string,
    size: any,
    res: Response
) => {
    
    try {
        const params = {
            Bucket: process.env.BUCKET_NAME || '',
            Key: imageName + data.user_id + originalName.replace(' ', ''),
            Body: buffer,
            ContentType: mimeType,
        }

        const fileSize = size; // total size of file
        const chunkSize = (1024 * 1024) * 5 // 5MB defined as each parts size 
        const numParts = Math.ceil(fileSize / chunkSize)
        const promise = [] // array to hold each async upload call 
        const slicedData = [] // array to contain our sliced data
        let Parts: any[] = [] //  to hold all Promise.allSettled resolve and reject response
        let MP_UPLOAD_ID = null // contain the upload ID to use for all processes 
        let FailedUploads: any = [] // array to populate failed upload
        let CompletedParts = []
        let RetryPromise = []


         MP_UPLOAD_ID = await initiateMultipartUpload(params.Key,params.Bucket).then((result: any)=>{
             return result["UploadId"];
        });

        for (let index = 1; index <= numParts; index++) {
            let start = (index - 1) * chunkSize
            let end = index * chunkSize;

            promise.push(uploadPart((index < numParts) ? buffer.slice(start, end) : buffer.slice(start), MP_UPLOAD_ID, index, data,originalName))

            slicedData.push({ PartNumber: index, buffer: Buffer.from(buffer.slice(start, end + 1)) });
        }

        Parts = await Promise.allSettled(promise);
        FailedUploads = Parts.filter(f => f.status == "rejected");

        if (!FailedUploads.length) {
            for (let i = 0; i < FailedUploads.length; i++) {
                let [data_res] = slicedData.filter(f => f.PartNumber == FailedUploads[i].value.PartNumber)
                let s = await uploadPart(data_res.buffer, MP_UPLOAD_ID, data_res.PartNumber, data,originalName);
                RetryPromise.push(s);
            }
        }

        CompletedParts = Parts.map(m => m.value);
        CompletedParts.push(...RetryPromise)

        const s3ParamsComplete = {
            Key: params.Key,
            Bucket: params.Bucket,
            UploadId: MP_UPLOAD_ID,
            MultipartUpload: {
                Parts: CompletedParts
            }
        }

        await client.send(new AWS.CompleteMultipartUploadCommand(s3ParamsComplete)).then(result=>{
                console.log(result)
                const course = { ...data, video: params.Key }
                addCourse(course, res)
        })


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
    } catch (e) {
        console.log(e)
    }
}

// for images upload use this function
// export async function uploadFileToS3(
//     data: Courses,
//     originalName: string,
//     buffer: Buffer,
//     mimeType: string,
//     res: Response
// ) {
//     const params = {
//         Bucket: process.env.BUCKET_NAME || '',
//         Key: imageName + data.user_id + originalName,
//         Body: buffer,
//         ContentType: mimeType,
//     }
//     const command = new AWS.CreateMultipartUploadCommand(params)
//     await client
//         .send(command)
//         .then((result) => {
//             console.log('video uploaded to s3', result)
//             const course = { ...data, video: params.Key }
//             addCourse(course, res)
//         })
//         .catch((err) => {
//             console.log('video s3 error', err)
//         })
// }

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
