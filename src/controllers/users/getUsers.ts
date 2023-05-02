import { Request, Response } from 'express'
import { UserModel } from '../../models/users'
import sanitize from 'mongo-sanitize'
import { decodeToken } from '../../services/parseToken'
import { getRole, getUserEmail, getUserID } from '../../utils/userUtils'
import { ObjectId } from 'mongodb'

export async function getUsers(req: Request, res: Response) {
    const page = parseInt(req.params.page)
    await decodeToken(req.cookies.access_token, res)
        .then(async (value) => {
            if (value) {
                const id = getUserID(value)
                const role = getRole(value)
                const email = getUserEmail(value)
                switch (role) {
                    case '0':
                        {
                            const data = await getAllUsers(page, email)
                            res.status(200).send({
                                list: data,
                            })
                        }
                        break
                    case '1':
                        {
                            const data = await getUsersById(page, id)
                            res.status(200).send({
                                list: data,
                            })
                        }
                        break

                    default: {
                        res.status(403).send({
                            error: 'Not Authorized',
                        })
                    }
                }
            }
        })
        .catch((err) => {
            console.log(err)
            res.status(403).send({
                error: 'Error, please contact support',
            })
        })
}

const getUsersById = async (page: number, id?: string): Promise<any> => {
    const users = new UserModel()
    let usersCollection: any[] = []
    return await pagination(page, id).then(async (value) => {
        if (value) {
            await users.collection
                .find({ added_by: sanitize(id) })
                .skip(value.skip)
                .limit(value.limit)
                .forEach((doc) => {
                    usersCollection.push({
                        email: doc.email,
                        id: doc._id,
                        username: doc.username,
                        role: doc.role,
                    })
                })
            return {
                data: usersCollection,
                nextPage: value.next,
                totalPages: value.totalPages,
                currentPage: page,
            }
        } else {
            return {
                data: [],
            }
        }
    })
}

const getAllUsers = async (
    page: number,
    email: string,
    id?: string
): Promise<any> => {
    const users = new UserModel()
    let usersCollection: any[] = []
    return await pagination(page, id).then(async (value) => {
        if (value) {
            await users.collection
                .find({})
                .skip(value.skip)
                .limit(100)
                .forEach((doc) => {
                    if (email !== doc.email) {
                        usersCollection.push({
                            email: doc.email,
                            id: doc._id,
                            username: doc.username,
                            role: doc.role,
                            status:
                                doc.active ?? true ? 'Active' : 'Not active',
                        })
                    }
                })
            return {
                data: usersCollection,
                nextPage: value.next,
                totalPages: value.totalPages,
                currentPage: page,
            }
        } else {
            return {
                data: [],
            }
        }
    })
}

const pagination = async (page: number, id?: string): Promise<any> => {
    return await getTotalUsers(id).then((total) => {
        if (total === -1) {
            return null
        } else {
            const limit = 10
            const skip = page * 10
            const totalPages = Math.floor(total / limit)
            const next = page + 1 < totalPages ? page + 1 : page
            return {
                limit,
                next,
                skip,
                total,
                totalPages,
            }
        }
    })
}

const getTotalUsers = async (id?: string): Promise<number> => {
    const users = new UserModel()
    if (id) {
        return await users.collection
            .countDocuments({ _id: sanitize(new ObjectId(id)) })
            .then((count) => {
                console.log('count docs', count)
                return count
            })
            .catch((err) => {
                console.log(err)
                return -1
            })
    } else {
        return await users.collection
            .countDocuments({})
            .then((count) => {
                console.log('count docs', count)
                return count
            })
            .catch((err) => {
                console.log(err)
                return -1
            })
    }
}
