import mongoose from 'mongoose'


const userSchema  = new mongoose.Schema({
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
      enum: [0,1,2],
  }
})


export const UserModel = mongoose.model('user', userSchema);