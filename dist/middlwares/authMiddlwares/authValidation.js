"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLogin = void 0;
var resultStatus_1 = require("../../utils/resultStatus");
var validation_1 = require("../../services/validation");
function validateLogin(req, res, next) {
    if (!(0, validation_1.validateEmail)(req.body.email).isValid || !(0, validation_1.validatePassword)(req.body.password).isValid) {
        (0, resultStatus_1.createResponse)(203, 'email or password is not correct', res);
    }
    else {
        next();
    }
}
exports.validateLogin = validateLogin;
