const jwt = require('jsonwebtoken');


function generateAccessToken(id: string, role: number): string {
  return jwt.sign({data: id+','+ role}, process.env.TOKEN_SECRET, { expiresIn: '24h' });
}


export function signUserAuth (id: string,role: number): string{
const token = generateAccessToken(id, role);
return token;
}