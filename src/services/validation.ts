import joi from 'joi'

type userData = {
    email: string
    password: string
    username: string
    role: number
}

type ValidationResult = {
    error?: string
    isValid: boolean
    data?: string
}

const validationResult = (
    validation: joi.ValidationResult<any>
): ValidationResult => {
    if (validation.error) {
        return {
            error: validation.error.message,
            isValid: false,
        }
    }

    return {
        data: validation.value,
        isValid: true,
    }
}

export function validateUserData({
    email,
    password,
    username,
    role,
}: userData): ValidationResult {
    if (!role || !password || !email || !username) {
        return {
            error: 'please make sure all inputs with values',
            isValid: false,
        }
    } else {
        if (validateEmail(email).isValid) {
            if (validatePassword(password).isValid) {
                if (validateUserName(username).isValid) {
                    if (validateUserRole(role).isValid) {
                        return validationResult({
                            error: undefined,
                            value: 'success',
                        })
                    } else {
                        validateUserRole(role)
                    }
                } else {
                    return validateUserName(username)
                }
            } else {
                return validatePassword(password)
            }
        }
        return validateEmail(email)
    }
}

export function validateEmail(email: string) {
    const regex =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    const schema = joi.object({
        email: joi
            .string()
            .email()
            .required()
            .min(5)
            .max(100)
            .pattern(new RegExp(regex)),
    })

    const validation = schema.validate({ email })
    return validationResult(validation)
}

export function validatePassword(password: string) {
    const schema = joi.object({
        password: joi.string().required().max(100).min(6),
    })

    const validation = schema.validate({ password })
    return validationResult(validation)
}

export function validateUserName(username: string) {
    const schema = joi.object({
        username: joi.string().min(4).max(50).required(),
    })

    const validation = schema.validate({ username })
    return validationResult(validation)
}

export function validateUserRole(role: number) {
    const schema = joi.object({
        role: joi.number().max(2).required(),
    })

    const validation = schema.validate({ role })
    return validationResult(validation)
}
