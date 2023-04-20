import mongoose from 'mongoose'
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()

const connectionString =
    process.env.NODE_ENV === 'DEV' ? process.env.DEV_DB : process.env.PRO_DB

export function createDatabaseConnection() {
    if (connectionString) {
        return mongoose.connect(connectionString)
    }
    throw new Error('please add DB connection string to .env file')
}
