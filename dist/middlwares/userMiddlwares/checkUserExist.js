"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUserEmailExist = void 0;
var userConnection_1 = require("../../services/user/userConnection");
var checkUserEmailExist = function (req, res) { return (0, userConnection_1.checkUserEmailAndAddUser)(res, req.body); };
exports.checkUserEmailExist = checkUserEmailExist;
