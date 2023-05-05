import { Request, Response } from 'express'
import { UserModel } from '../../../models/users'
import sanitize from 'mongo-sanitize'
import { ObjectId } from 'mongodb'
import { createResponse } from '../../../utils/resultStatus'

export async function restrictModule(req: Request, res: Response) {
    const { module, id, isChecked } = req.body
    const users = new UserModel()
    await users.collection
        .findOne({ _id: sanitize(new ObjectId(id)) })
        .then(async (doc) => {
            if (doc) {
                const data = preparData(
                    doc.restrictedModules,
                    isChecked,
                    module
                )
                await users.collection
                    .findOneAndUpdate(
                        { _id: sanitize(new ObjectId(id)) },
                        { $set: { restrictedModules: data } }
                    )
                    .then((result) => {
                        if (result) {
                            createResponse(200, 'updated', res)
                        }
                    })
            } else {
                createResponse(401, 'error', res)
            }
        })
        .catch((err) => {
            console.log(err)
            createResponse(401, 'error', res)
        })
}

const preparData = (
    restrictedModules: string[],
    isChecked: boolean,
    module: string
): string[] => {
    if (restrictedModules) {
        if (restrictedModules.length > 0) {
            return isChecked
                ? [...restrictedModules, module]
                : restrictedModules.filter((value: string) => value != module)
        } else {
            return isChecked
                ? [module]
                : restrictedModules.filter((value: string) => value != module)
        }
    }
    return [module]
}
