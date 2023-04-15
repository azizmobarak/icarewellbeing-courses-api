import { UserModel } from "../../models/users";
import { checkPassword } from "../password";
import { createResponse } from "../../utils/resultStatus";
import { signUserAuth } from "../createToken";
import { decodToken } from "../parseToken";
const ObjectId = require('mongodb').ObjectId;
const sanitize = require("mongo-sanitize");
const bcrypt = require('bcrypt');
const saltRounds = 10;

export interface User {
  email: string;
  password: string;
  role: number;
  username: string;
}

export function verifyUserAuth (token: string, res: any) {
  const userModel = new UserModel();
  const {data} = decodToken(token,res);
  const id = new ObjectId(data.split(',')[0]);
  userModel.collection.findOne(sanitize({_id: id}))
  .then((doc: any) =>{
      if(!doc){
       return createResponse(403,`Not Authorized`,res);
      }
  })
  .catch(()=>{
              return createResponse(403,`oops something happen Sorry, back again later`,res);
        })
}

 export function checkUserExistAndAuth(res: any, data: User): void{
      const userModel = new UserModel();
        userModel.collection.findOne(sanitize({email: data.email}))
        .then((doc: any)=>{
             if(!doc){
                return createResponse(203,`Sorry , Email or password is not correct`,res);
             }else {
                 checkPassword(doc, data.password, res)
             }
        }).catch(()=>{
              return createResponse(203,`oops something happen Sorry, back again later`,res);
        })
    }

export function authorizeUser (id: string,role: number,data: User, res: any) {
    const token = signUserAuth(id,role);
   res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1 * 60 * 60 * 1000
    })
   .send({
       data: {
           email: data.email,
           username: data.username,
           role: data.role,
       },
       status: 200,
   })
}

export function checkUserEmailAndAddUser(res: any,data: User): void | boolean {
     const userModel = new UserModel();
       userModel.collection.findOne(sanitize({email: data.email}))
        .then(async(doc: any)=>{
           if(!doc){
                await AddNewUser(data.password, res, data);
           }else {
                createResponse(208,`email ${data.email} already exist`,res);
           }
        }).catch((_err: any)=>{
            createResponse(403,`oops something happen Sorry, back again later`,res);
        })
}

async function AddNewUser (password: string, res: any, data: User){
 await bcrypt.genSalt(saltRounds,async function(err: any, salt: any) { 
      if(err) return null;
  return await bcrypt.hash(password, salt, function(err: any, hash: any) {
          if(err) return null;
          return addUser(hash, res, data);
    });
});
}

function addUser(hash: string, res: any, data: User) {
    const userModel = new UserModel();
    userModel.collection.insertOne(sanitize({...data, password: hash}))
    .then(doc => {
        createResponse(200, {email:data.email, role: data.role, username: data.username, ...doc}, res);
    })
    .catch(error => {
       createResponse(400, error, res);
    })
}