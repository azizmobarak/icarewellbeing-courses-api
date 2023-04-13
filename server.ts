import { createDatabaseConnection } from "./src/config/connection";
require('dotenv').config();
const express = require('express');
const userRouter = require('./src/routes/usersRoute/router');
const authRouter = require('./src/routes/authRoute/login');
const coursesRouter = require('./src/routes/coursesRoute/courses');
const app = express();
const PORT = process.env.PORT || 2222;
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({
  origin: '*',
}))

const routes  = [userRouter, authRouter, coursesRouter];
const appRouter = routes.reduce((router,route) => router.use(route))
app.use('/api', appRouter);



app.listen(PORT, ()=>{
  createDatabaseConnection();
  console.log('running', PORT)
})