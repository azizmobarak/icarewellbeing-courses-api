import { decodeToken } from '../../services/parseToken'
import { Response } from 'express'
import { createResponse } from '../../utils/resultStatus'
// import { uploadFileToS3 } from '../../services/awsS3service'
import { ModuleModel } from '../../models/modules'
import fs from 'fs';
import path from 'path';

//TODO: fix typing
// interface RequestWithFile extends Request {
//     files: {filename: string}[];
// }

export const addCourses = async(req: any, res: Response) => {
   await decodeToken(req.cookies.access_token, res)
        .then(async(result: string) => {
            if (result) {
              await saveModule(req.body.module, req.cookies.access_token)
                    .then(async(_moduleId) => {
                      setTimeout(async() => {
                        const filepath = path.join(__dirname, 'videos/'+'empty');
                        const data = await fs.readFileSync(filepath);
                        console.log(data,'   \tbuffer');
                      }, 10000);
                //         do{
                //              const id = result.split(',')[0]
                //         const data = {
                //             user_id: id,
                //             video: req.file.filename,
                //             name: req.body.name,
                //             description: req.body.description,
                //             module: moduleId,
                //             author: req.body.author,
                //         }
                //  await uploadFileToS3(
                //             data,
                //             req.file.filename,
                //             buffer,
                //             req.file.mimetype,
                //             res
                //         )
                //         }while(!buffer)
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
            } else {
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

function saveModule(name: string, token: string) {
    const added_by = token
    const module = new ModuleModel({ name, added_by })
    const getID = module.save()
    return new Promise(
        (resolve: CallableFunction, reject: CallableFunction) => {
            getID.then((value) => {
                if (!value) {
                    reject()
                } else {
                    resolve(value._id.toString())
                }
            })
        }
    )
}
