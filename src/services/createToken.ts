// eslint-disable-next-line @typescript-eslint/no-var-requires
const jwt = require('jsonwebtoken')

function generateAccessToken(
    id: string,
    role: string,
    added_by: string
): string {
    return jwt.sign(
        { data: id + ',' + role + ',' + added_by },
        process.env.TOKEN_SECRET,
        {
            expiresIn: '24h',
        }
    )
}

export function signUserAuth(
    id: string,
    role: string,
    added_by: string
): string {
    const token = generateAccessToken(id, role, added_by)
    return token
}
