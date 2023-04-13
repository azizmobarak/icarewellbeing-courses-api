const jwt = require('jsonwebtoken');

export function decodToken (token: string){
var decoded = jwt.verify(token, process.env.TOKEN_SECRET);
return decoded;
}