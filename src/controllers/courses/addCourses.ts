import { decodeToken } from '../../services/parseToken'
import { Response } from 'express'
import { createResponse } from '../../utils/resultStatus'
import { uploadFileToS3 } from '../../services/awsS3service'
import { ModuleModel } from '../../models/modules'

//TODO: fix typing
// interface RequestWithFile extends Request {
//     files: {filename: string}[];
// }

export const addCourses = (req: any, res: Response) => {
    console.log(req.file)
    decodeToken(req.cookies.access_token, res)
        .then((result: string) => {
            if (result) {
                saveModule(req.body.module)
                    .then((moduleId) => {
                        const id = result.split(',')[0]
                        const data = {
                            user_id: id,
                            video: req.file.filename,
                            name: req.body.name,
                            description: req.body.description,
                            module: moduleId,
                        }
                        return uploadFileToS3(
                            data,
                            req.file.filename,
                            req.file.buffer,
                            req.file.mimetype,
                            res
                        )
                    })
                    .catch((e) => {
                        console.log(e)
                        return createResponse(
                            403,
                            'cannot add Module please try again',
                            res
                        )
                    })
                // return uploadVimeoVideos(data, res)
            }else {
                return createResponse(
                403,
                'cannot define the user please try later or login again',
                res
            )
            }
            
        })
        .catch(() =>
            createResponse(
                403,
                'cannot define the user please try later or login again',
                res
            )
        )
}

function saveModule(name: string) {
    const module = new ModuleModel({ name })
    const getID = module.save()
    return new Promise(
        (resolve: CallableFunction, reject: CallableFunction) => {
            getID.then((value) => {
                if(!value){
                  reject();
                }
                else {
                    resolve(value._id.toString())
                }
            })
        }
    )
}
