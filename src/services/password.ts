import { createResponse } from "../utils/resultStatus";

const bcrypt = require('bcrypt');
const saltRounds = 22;

export const encryptPassword = (password: string): string | null => {
 return bcrypt.genSalt(saltRounds, function(err: any, salt: any) {
     if(err) return null;
   return bcrypt.hash(password, salt, function(err: any, hash: any) {
        if(err) return err;
        return hash;
    });
});
}


export const checkPassword = (hash: string, password: string, res: any): boolean => {
return bcrypt.compare(password, hash, function(err: string, result:boolean) {
    if(err || !result) {
        return  createResponse(403,`Sorry , Email or password is not correct 1`,res);
    }
});
}