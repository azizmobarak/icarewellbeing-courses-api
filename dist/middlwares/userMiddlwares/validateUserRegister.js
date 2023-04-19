"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUser = void 0;
var validation_1 = require("../../services/validation");
var resultStatus_1 = require("../../utils/resultStatus");
function validateUser(req, res, next) {
    var _a = (0, validation_1.validateUserData)(req.body), isValid = _a.isValid, error = _a.error;
    isValid ? next() :
        (0, resultStatus_1.createResponse)(400, error, res);
}
exports.validateUser = validateUser;
