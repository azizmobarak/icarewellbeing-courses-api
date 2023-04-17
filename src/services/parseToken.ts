import { Response } from "express";
import { createResponse } from "../utils/resultStatus";

const jwt = require('jsonwebtoken');

export function decodToken (token: string,res: Response): any {
try{
var decoded: string = jwt.verify(token, process.env.TOKEN_SECRET);
return decoded;
}catch{
 return createResponse(403,'Session expired please login',res)
}
}