"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPasswordEncError = void 0;
var password_1 = require("../../services/password");
var resultStatus_1 = require("../../utils/resultStatus");
var checkPasswordEncError = function (req, res, next) {
    var passwordHash = (0, password_1.encryptPassword)(req.body.password);
    if (!passwordHash) {
        (0, resultStatus_1.createResponse)(400, 'error', res);
    }
    next();
};
exports.checkPasswordEncError = checkPasswordEncError;
