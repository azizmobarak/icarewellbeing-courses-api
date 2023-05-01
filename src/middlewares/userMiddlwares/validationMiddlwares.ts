import {
    validateEmail,
    validatePassword,
    validateUserData,
} from '../../services/validation'
import { createResponse } from '../../utils/resultStatus'
import { Request, Response, NextFunction, RequestHandler } from 'express'

export function validateUser(
    req: Request,
    res: Response,
    next: NextFunction
): void | RequestHandler {
    const { isValid, error } = validateUserData(req.body)
    return isValid ? next() : createResponse(400, error, res)
}

export function validateResetPassword(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (validatePassword(req.body.password).isValid && req.body.password) {
        return next()
    }
    return createResponse(400, 'Password Not valid, please try again', res)
}

export function validateRequestRestPassword(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (validateEmail(req.body.email).isValid && req.body.email) {
        return next()
    }
    return createResponse(400, 'Email Not valid, please try again', res)
}
