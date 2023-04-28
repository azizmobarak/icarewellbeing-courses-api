import mongoose from 'mongoose'

export type Courses = {
    video: string
    user_id: string
    name: string
    description: string
    module: string
    author: string
    videoNumber?: number
}

// author missed

const courseSchema = new mongoose.Schema<Courses>({
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
        max: 3,
        default: 0,
    },
})

export const CoursesModel = mongoose.model<Courses>('course', courseSchema)
