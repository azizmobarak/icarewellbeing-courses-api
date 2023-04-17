import { createResponse } from "../utils/resultStatus";

const jwt = require('jsonwebtoken');

export function decodToken (token: string,res: any){
try{
var decoded = jwt.verify(token, process.env.TOKEN_SECRET);
console.log(decoded)
return decoded;
}catch{
createResponse(403,'Session expired please login',res)
}
}