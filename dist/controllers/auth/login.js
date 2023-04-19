"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
var userConnection_1 = require("../../services/user/userConnection");
function login(req, res) {
    return (0, userConnection_1.checkUserExistAndAuth)(res, req.body);
}
exports.login = login;
