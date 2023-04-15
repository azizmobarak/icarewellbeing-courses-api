const jwt = require('jsonwebtoken');


function generateAccessToken(id: string, role: number) {
  return jwt.sign({data: id+','+ role}, process.env.TOKEN_SECRET, { expiresIn: '24h' });
}


export function signUserAuth (id: string,role: number){
const token = generateAccessToken(id, role);
return token;
}