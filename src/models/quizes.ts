import { Schema, model } from "mongoose"

interface Choice {
    id: string,
    answer: string
}

export interface Quize{
    question: string
    choices: Choice[]
    correct: string // choice id
}

export interface Quizes{
    question: string
    quize: Choice[]
    correct: string
}

const quizesSchema = new Schema<Quizes>({
    question: String,
    quize:[{
        id: String,
        answer: String,
        required: true,
    }]
},{timestamps: true});


const quezesModel = model<Quizes>('quize', quizesSchema)

module.exports = quezesModel;