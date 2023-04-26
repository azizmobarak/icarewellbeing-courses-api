import { decodeToken } from '../../services/parseToken'
import { Response } from 'express'
import { createResponse } from '../../utils/resultStatus'
import { uploadToS3 } from '../../services/awsS3service'
import { ModuleModel } from '../../models/modules'
import sanitize from 'mongo-sanitize'
import { getUserID } from '../../utils/userUtils'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ObjectId = require('mongodb').ObjectId

//TODO: fix typing
// interface RequestWithFile extends Request {
//     files: {filename: string}[];
// }

export const addCourses = (req: any, res: Response) => {
    let module_id = ''
    decodeToken(req.cookies.access_token, res)
        .then(async (result: string) => {
            if (result) {
                const id = getUserID(result)
                await checkModuleName(req.body.module, id)
                    .then(async (moduleId) => {
                        if (!moduleId) {
                            await saveModule(req.body.module, id).then(
                                (value) => {
                                    module_id = value
                                }
                            )
                        } else {
                            module_id = moduleId
                        }

                        const data = {
                            user_id: id,
                            video: req.file.filename,
                            name: req.body.name,
                            description: req.body.description,
                            module: module_id,
                            author: req.body.author,
                        }

                        return uploadToS3(
                            data,
                            req.body.name,
                            req.file.buffer,
                            req.file.mimetype,
                            req.file.size,
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
                // if you want to use vimeo
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

function saveModule(name: string, id: string): Promise<string> {
    const added_by = [id]
    const module = new ModuleModel(sanitize({ name, added_by }))
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

const checkModuleName = async (
    moduleName: string,
    id: string
): Promise<string> => {
    let _id = ''
    return await countModules(moduleName)
        .then(async (count) => {
            if (count > 0) {
                await findModuleByName(moduleName).forEach((doc: any) => {
                    _id = doc._id.toString()
                    if (doc._id) {
                        if (doc.added_by.indexOf(id) === -1) {
                            findModuleAndUpdateAdded_By_List(
                                doc._id,
                                doc.added_by
                            )
                        }
                    }
                })
                return _id
            } else {
                return _id
            }
        })
        .catch((err) => {
            console.log(err)
            return ''
        })
}

const countModules = async (moduleName: string) => {
    const module = new ModuleModel()
    return await module.collection.countDocuments({
        name: sanitize(moduleName),
    })
}

const findModuleByName = (moduleName: string) => {
    const module = new ModuleModel()
    return module.collection.find({ name: sanitize(moduleName) })
}

const findModuleAndUpdateAdded_By_List = (id: string, added_by: string[]) => {
    const module = new ModuleModel()
    return module.collection.findOneAndUpdate(
        { _id: sanitize(new ObjectId(id)) },
        { $set: { added_by: [...added_by, id] } }
    )
}
