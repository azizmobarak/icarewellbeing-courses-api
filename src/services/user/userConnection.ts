import { UserModel, Users } from '../../models/users'
import { checkPassword } from '../password'
import { createResponse } from '../../utils/resultStatus'
import { signUserAuth } from '../createToken'
import { decodeToken } from '../parseToken'
import { Response } from 'express'
import { HydratedDocument } from 'mongoose'
const ObjectId = require('mongodb').ObjectId
const sanitize = require('mongo-sanitize')
const bcrypt = require('bcrypt')
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
    userModel.collection
        .findOne(sanitize({ email: data.email }))
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
        .catch(() => {
            return createResponse(
                203,
                `oops something happen Sorry, back again later`,
                res
            )
        })
}

export function authorizeUser(
    id: string,
    role: number,
    data: Users,
    res: Response
) {
    const token = signUserAuth(id, role)
    res.cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'PRO',
    }).send({
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
    await bcrypt.genSalt(saltRounds, async function (err: any, salt: any) {
        if (err) return null
        return await bcrypt.hash(
            password,
            salt,
            function (err: any, hash: any) {
                if (err) return null
                return addUser(hash, res, data)
            }
        )
    })
}

function addUser(hash: string, res: Response, data: Users) {
    const userModel = new UserModel()
    userModel.collection
        .insertOne(sanitize({ ...data, password: hash }))
        .then((doc) => {
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
