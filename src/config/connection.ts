import mongoose from 'mongoose'
import { initAppAdmin } from '../utils/databaseScriptRunner'
require('dotenv').config()

const connectionString =
    process.env.NODE_ENV === 'DEV' ? process.env.DEV_DB : process.env.PRO_DB

export function createDatabaseConnection() {
    if (connectionString) {
        return mongoose.connect(connectionString).then(()=>{
         initAppAdmin();
        })
    }
    throw new Error('please add DB connection string to .env file')
}
