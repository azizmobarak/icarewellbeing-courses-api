import { Request, Response } from 'express'
import { ModuleModel, Modules } from '../../models/modules'
import { getAddedByOrID, getRole, getUserID } from '../../utils/userUtils'
import { createResponse } from '../../utils/resultStatus'
import { decodeToken } from '../../services/parseToken'
import { UserModel } from '../../models/users'
import sanitize from 'mongo-sanitize'
import { ObjectId } from 'mongodb'

export async function getModules(req: Request, res: Response) {
    const token = req.cookies.access_token
    await getParsedToken(token, res).then((parsedToken) => {
        if (parsedToken) {
            const role = getRole(parsedToken)
            const id = getAddedByOrID(parsedToken)
            const active_user_id = getUserID(parsedToken)
            return getDataAndSendRequest(role, id, active_user_id, res)
        } else {
            return createResponse(
                403,
                'failed to get Modules please login',
                res
            )
        }
    })
}

const findByID = (id: string, module: Modules) => {
    return module.added_by.indexOf(id) !== -1
}

const getModulesList = async (
    role: string,
    id: string,
    active_user_id: string
) => {
    const module = new ModuleModel()
    const users = new UserModel()
    const modules: any[] = []
    await users.collection
        .findOne({ _id: sanitize(new ObjectId(active_user_id)) })
        .then(async (doc) => {
            {
                await module.collection.find().forEach((module) => {
                    if (role === '0') {
                        modules.push(module)
                    } else {
                        if (
                            !doc?.restrictedModules.includes(
                                module._id.toString()
                            )
                        ) {
                            if (findByID(id, module as any)) {
                                modules.push(module)
                            }
                        }
                    }
                })
            }
        })
    return modules
}

async function getDataAndSendRequest(
    role: string,
    id: string,
    active_user_id: string,
    res: Response
) {
    return await getModulesList(role, id, active_user_id)
        .then((data) => {
            createResponse(200, data, res)
        })
        .catch(() => {
            createResponse(200, 'cannot get Modules', res)
        })
}

const getParsedToken = (token: string, res: Response): Promise<string> =>
    decodeToken(token, res)
        .then((parsedToken) => parsedToken)
        .catch(() => '')
