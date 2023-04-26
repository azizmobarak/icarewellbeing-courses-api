import { CookieOptions, Response } from 'express'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const jwt = require('jsonwebtoken')

function generateAccessToken(
    id: string,
    role: string,
    added_by: string,
    email: string
): string {
    return jwt.sign(
        { data: id + ',' + role + ',' + added_by + ',' + email },
        process.env.TOKEN_SECRET,
        {
            expiresIn: '2000h',
        }
    )
}

export function signUserAuth(
    id: string,
    role: string,
    added_by: string,
    email: string
): string {
    const token = generateAccessToken(id, role, added_by, email)
    return token
}

export const fakeUserTokenSign = (res: Response) => {
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
    res.cookie('access_token', '', cookieConfig).send({
        data: {},
        status: 200,
    })
}
