import mongoose from 'mongoose'


const courseSchema  = new mongoose.Schema({
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
})


export const CoursesModel = mongoose.model('course', courseSchema);