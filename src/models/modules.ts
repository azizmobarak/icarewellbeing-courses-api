import mongoose from 'mongoose'

export type Modules = {
    name: string
    added_by: string[]
}

const userSchema = new mongoose.Schema<Modules>({
    name: {
        type: String,
        max: 200,
        min: 4,
        required: true,
    },
    added_by: [
        {
            type: String,
            required: true,
        },
    ],
})

export const ModuleModel = mongoose.model<Modules>('Module', userSchema)
