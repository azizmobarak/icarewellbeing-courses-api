"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUserAuth = void 0;
var jwt = require('jsonwebtoken');
function generateAccessToken(id, role) {
    return jwt.sign({ data: id + ',' + role }, process.env.TOKEN_SECRET, { expiresIn: '24h' });
}
function signUserAuth(id, role) {
    var token = generateAccessToken(id, role);
    return token;
}
exports.signUserAuth = signUserAuth;
