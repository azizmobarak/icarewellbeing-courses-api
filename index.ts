/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
import { createDatabaseConnection } from './src/config/connection'
require('dotenv').config()
const express = require('express')
const userRouter = require('./src/routes/usersRoute/router')
const authRouter = require('./src/routes/authRoute/login')
const coursesRouter = require('./src/routes/coursesRoute/courses')
const ModuleRouter = require('./src/routes/modulesRoute/modules')
const app = express()
const PORT = process.env.PORT || 2222
const bodyParser = require('body-parser')
const cors = require('cors')
const cookieParser = require('cookie-parser')


app.use(function (_req: any, res: any, next: any) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'https://courses.billivance.com');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

const domainsFromEnv = process.env.CORS_DOMAINS || '*'

const whitelist = domainsFromEnv.split(',').map((item) => item.trim())

const corsOptions = {
    origin: function (origin: any, callback: CallableFunction) {
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed'))
        }
    },
    credentials: true,
}
app.use(cors(corsOptions))

app.use(express.json({ limit: '5000mb' }))
app.use(
    bodyParser.urlencoded({
        limit: '5000mb',
        parameterLimit: 100000,
        extended: true,
    })
)

app.use(cookieParser())
app.use(
    bodyParser.json({
        limit: '5000mb',
    })
)

const routes = [userRouter, authRouter, coursesRouter, ModuleRouter]
const appRouter = routes.reduce((router, route) => router.use(route))
app.use('/api', appRouter)
app.get('/', (_req: any, res: any) => res.send('working'))

app.listen(PORT, () => createDatabaseConnection());

