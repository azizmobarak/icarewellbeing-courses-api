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

app.use(cookieParser());

app.use(bodyParser.json({
  limit: '5000mb'
}));

app.use(bodyParser.urlencoded({
  limit: '5000mb',
  parameterLimit: 100000,
  extended: true,
}));

app.use(cors({
  origin: '*',
  credentials: true,
  // methods: "GET,PUT,PATCH,POST,DELETE,UPDATE",
}))
app.use(function(_req: any, res: any, next: any) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});


const routes  = [userRouter, authRouter, coursesRouter];
const appRouter = routes.reduce((router,route) => router.use(route))
app.use('/api', appRouter);
app.get('/api',(_req:any,res:any)=> res.send('working'))



app.listen(PORT, ()=>{createDatabaseConnection();console.log(PORT)});


