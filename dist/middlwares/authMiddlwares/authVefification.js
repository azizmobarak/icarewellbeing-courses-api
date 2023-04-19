"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuth = void 0;
var userConnection_1 = require("../../services/user/userConnection");
function isAuth(req, res, next) {
    console.log(req.cookies);
    (0, userConnection_1.verifyUserAuth)(req.cookies.access_token, res, next);
}
exports.isAuth = isAuth;
