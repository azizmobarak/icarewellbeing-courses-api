const jwt = require('jsonwebtoken');


function generateAccessToken(email: string) {
  return jwt.sign({data: email}, process.env.TOKEN_SECRET, { expiresIn: '24h' });
}


export function signUserAuth (email: string){
const token = generateAccessToken(email);
return token;
}