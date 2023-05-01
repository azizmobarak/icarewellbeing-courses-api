import mongoose from 'mongoose'

export type Courses = {
    video: string
    user_id: string
    name: string
    description: string
    module: string
    author: string
    videoNumber?: number
    thumbnail: string
    createdAt: Date
}

// author missed

const courseSchema = new mongoose.Schema<Courses>(
    {
        video: {
            type: String,
            max: 1000,
            min: 4,
            required: true,
        },
        user_id: {
            type: String,
            max: 400,
            min: 2,
            required: true,
        },
        name: {
            type: String,
            required: true,
            max: 250,
        },
        description: {
            type: String,
            required: true,
            max: 1000,
        },
        module: {
            type: String,
            require,
            max: 240,
        },
        author: {
            type: String,
            require,
            max: 200,
        },
        videoNumber: {
            type: Number,
            max: 500,
            default: 0,
        },
        thumbnail: {
            type: String,
            max: 1000,
        },
    },
    { timestamps: true }
)

export const CoursesModel = mongoose.model<Courses>('course', courseSchema)
