import mongoose from 'mongoose'

export type Modules = {
    name: string
}

const userSchema = new mongoose.Schema<Modules>({
    name: {
        type: String,
        max: 200,
        min: 4,
        required: true,
    },
})

export const ModuleModel = mongoose.model<Modules>('Module', userSchema)
