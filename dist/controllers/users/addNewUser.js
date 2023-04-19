"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var userConnection_1 = require("../../services/user/userConnection");
function addNewUser(req, res) {
    console.log(req.body);
    return (0, userConnection_1.checkUserEmailAndAddUser)(res, req.body);
}
exports.default = addNewUser;
