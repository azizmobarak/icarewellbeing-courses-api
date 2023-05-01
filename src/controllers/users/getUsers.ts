import { Request, Response } from 'express'
import { UserModel } from '../../models/users'
import sanitize from 'mongo-sanitize'
import { decodeToken } from '../../services/parseToken'
import { getRole, getUserID } from '../../utils/userUtils'

export async function getUsers(req: Request, res: Response) {
    await decodeToken(req.cookies.access_token, res)
        .then(async (value) => {
            console.log(value)
            if (value) {
                const id = getUserID(value)
                const role = getRole(value)
                switch (role) {
                    case '0':
                        {
                            const data = await getAllUsers()
                            res.status(200).send({
                                list: data,
                            })
                        }
                        break
                    case '1':
                        {
                            const data = await getUsersById(id)
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

const getUsersById = async (id: string): Promise<any[]> => {
    const users = new UserModel()
    let usersCollection: any[] = []
    await users.collection.find({ added_by: sanitize(id) }).forEach((doc) => {
        usersCollection.push({
            email: doc.email,
            id: doc._id,
            username: doc.username,
            role: doc.role,
        })
    })
    console.log(usersCollection)
    return usersCollection
}

const getAllUsers = async (): Promise<any[]> => {
    const users = new UserModel()
    let usersCollection: any[] = []
    await users.collection.find({}).forEach((doc) => {
        usersCollection.push({
            email: doc.email,
            id: doc._id,
            username: doc.username,
            role: doc.role,
        })
    })
    console.log(usersCollection)
    return usersCollection
}
