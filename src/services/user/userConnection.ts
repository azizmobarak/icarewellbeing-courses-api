import { UserModel, Users } from '../../models/users'
import { checkPassword } from '../password'
import { createResponse } from '../../utils/resultStatus'
import { signUserAuth } from '../createToken'
import { decodeToken } from '../parseToken'
import { CookieOptions, Response } from 'express'
import { HydratedDocument } from 'mongoose'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ObjectId = require('mongodb').ObjectId
import sanitize from 'mongo-sanitize'
import bcrypt from 'bcrypt'
// import { sendPasswordEmail } from '../emailService'
const saltRounds = 10

export function verifyUserAuth(token: string, res: Response) {
    return new Promise((resolve, reject) => {
        try {
            const userModel = new UserModel()
            decodeToken(token, res).then((result) => {
                if (result) {
                    const id = new ObjectId(result.split(',')[0])
                    userModel.collection
                        .findOne(sanitize({ _id: id }))
                        .then((doc: HydratedDocument<any>) => {
                            if (!doc) {
                                reject(null)
                            }
                            resolve(true)
                        })
                }
            })
        } catch {
            reject(null)
        }
    })
}

export function checkUserExistAndAuth(res: Response, data: Users): void {
    const userModel = new UserModel()
    const email = data.email.toLocaleLowerCase();
    userModel.collection
        .findOne(sanitize({ email }))
        .then((doc: HydratedDocument<any>) => {
            if (!doc) {
                return createResponse(
                    203,
                    `Sorry , Email or password is not correct`,
                    res
                )
            } else {
                checkPassword(doc, data.password, res)
            }
        })
        .catch((err) => {
            console.log(err);
            return createResponse(
                203,
                `oops something happen Sorry, back again later`,
                res
            )
        })
}

export function authorizeUser(
    id: string,
    role: string,
    added_by: string,
    email: string,
    data: Users,
    res: Response
) {
    const cookieConfig: CookieOptions =
        process.env.NODE_DEV !== 'PRO'
            ? {
                  httpOnly: true,
                  secure: true,
                  sameSite: 'strict',
                  //   maxAge: 60 * 60 * 24 * 30,
                  path: '/',
              }
            : {
                  httpOnly: false,
                  secure: true,
                  sameSite: 'none',
                  domain: process.env.DOMAINE,
              }

    const token = signUserAuth(id, role, added_by, email)
    res.cookie('access_token', token, cookieConfig).send({
        data: {
            id,
            email: data.email,
            username: data.username,
            role: data.role,
        },
        status: 200,
    })
}

export function checkUserEmailAndAddUser(
    res: Response,
    data: Users
): void | boolean {
    const userModel = new UserModel()
    userModel.collection
        .findOne(sanitize({ email: data.email }))
        .then(async (doc: any) => {
            if (!doc) {
                await AddNewUser(data.password, res, data)
            } else {
                createResponse(208, `email ${data.email} already exist`, res)
            }
        })
        .catch((_err: any) => {
            createResponse(
                403,
                `oops something happen Sorry, back again later`,
                res
            )
        })
}

async function AddNewUser(password: string, res: Response, data: Users) {
    await bcrypt.genSalt(saltRounds, async function (err: any, salt: string) {
        if (err) return null
        return await bcrypt.hash(
            password,
            salt,
            function (err: any, hash: string) {
                if (err) return null
                return addUser(hash, res, data)
            }
        )
    })
}

async function addUser(
    hash: string,
    res: Response,
    data: Users
    // password: string
) {
    const userModel = new UserModel()
    userModel.collection
        .insertOne(sanitize({ ...data, email: data.email.toLocaleLowerCase(), password: hash }))
        .then(async (doc) => {
            // await sendPasswordEmail(data.email, password)
            createResponse(
                200,
                {
                    email: data.email,
                    role: data.role,
                    username: data.username,
                    ...doc,
                },
                res
            )
        })
        .catch((error) => {
            createResponse(400, error, res)
        })
}
