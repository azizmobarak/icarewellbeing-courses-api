import { Request, Response } from 'express'
import { ModuleModel } from '../../models/modules'
import { getAddedByOrID, getRole } from '../../utils/userUtils'
import sanitize from 'mongo-sanitize'
import { createResponse } from '../../utils/resultStatus'
import { decodeToken } from '../../services/parseToken'

export function getModules(req: Request, res: Response) {
    const token = req.cookies.access_token
    const role = getRole(token)
    getParsedToken(token, res).then((parsedToken) => {
        if (parsedToken) {
            const id = getAddedByOrID(parsedToken)
            return getDataAndSendRequest(role, id, res)
        } else {
            return createResponse(
                403,
                'failed to get Modules please login',
                res
            )
        }
    })
}

const findByID = async (role: string, id: string) => {
    switch (role) {
        case '0':
            return {}
        default:
            return { added_by: id }
    }
}

const getModulesList = async (role: string, id: string) => {
    const module = new ModuleModel()
    const modules: any[] = []

    await module.collection
        .find(sanitize(findByID(role, id)))
        .forEach((module) => {
            modules.push(module)
        })
    return modules
}

async function getDataAndSendRequest(role: string, id: string, res: Response) {
    return await getModulesList(role, id)
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
