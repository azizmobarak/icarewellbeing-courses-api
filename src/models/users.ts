import mongoose from 'mongoose'

export type Users = {
    email: string
    username: string
    password: string
    role: string
    added_by: string
    token: string
    active: boolean
    restrictedModules: string[]
    createdAt: string
    updatedAt: string
}

const date = new Date();

const userSchema = new mongoose.Schema<Users>(
    {
        email: {
            type: String,
            max: 200,
            min: 4,
            required: true,
        },
        username: {
            type: String,
            max: 200,
            min: 2,
            required: true,
        },
        password: {
            required: true,
            type: String,
            max: 400,
        },
        role: {
            type: String,
            enum: [0, 1, 2],
        },
        added_by: {
            type: String,
            max: 255,
        },
        token: {
            type: String,
            max: 1000,
        },
        active: {
            type: Boolean,
            default: true,
        },
        restrictedModules: [
            {
                type: String,
                max: 1000,
            },
        ],
        createdAt: {
            type: String,
            default: date.toString(),
        },
        updatedAt: {
            type: String,
            default: date.toString(),
        },
    }
)

export const UserModel = mongoose.model<Users>('user', userSchema)
