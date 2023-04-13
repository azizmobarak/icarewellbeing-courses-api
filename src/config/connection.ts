import mongoose from 'mongoose';


export function createDatabaseConnection () {
   if(process.env.DB){
      return  mongoose.connect(process.env.DB);
   }
  throw new Error('please add DB connection string to .env file')
}