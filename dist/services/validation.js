"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserRole = exports.validateUserName = exports.validatePassword = exports.validateEmail = exports.validateUserData = void 0;
var joi_1 = __importDefault(require("joi"));
var validationResult = function (validation) {
    if (validation.error) {
        return {
            error: validation.error.message,
            isValid: false,
        };
    }
    return {
        data: validation.value,
        isValid: true,
    };
};
function validateUserData(_a) {
    var email = _a.email, password = _a.password, username = _a.username, role = _a.role;
    if (!role || !password || !email || !username) {
        return {
            error: 'please make sure all inputs with values',
            isValid: false,
        };
    }
    else {
        if (validateEmail(email).isValid) {
            if (validatePassword(password).isValid) {
                if (validateUserName(username).isValid) {
                    if (validateUserRole(role).isValid) {
                        return validationResult({ error: undefined, value: 'success' });
                    }
                    else {
                        validateUserRole(role);
                    }
                }
                else {
                    return validateUserName(username);
                }
            }
            else {
                return validatePassword(password);
            }
        }
        return validateEmail(email);
    }
}
exports.validateUserData = validateUserData;
function validateEmail(email) {
    var schema = joi_1.default.object({
        email: joi_1.default.string().email().required().min(5).max(100),
    });
    var validation = schema.validate({ email: email });
    return validationResult(validation);
}
exports.validateEmail = validateEmail;
function validatePassword(password) {
    var schema = joi_1.default.object({
        password: joi_1.default.string().required().max(100).min(6),
    });
    var validation = schema.validate({ password: password });
    return validationResult(validation);
}
exports.validatePassword = validatePassword;
function validateUserName(username) {
    var schema = joi_1.default.object({
        username: joi_1.default.string().min(4).max(50).required(),
    });
    var validation = schema.validate({ username: username });
    return validationResult(validation);
}
exports.validateUserName = validateUserName;
function validateUserRole(role) {
    var schema = joi_1.default.object({
        role: joi_1.default.number().max(2).required(),
    });
    var validation = schema.validate({ role: role });
    return validationResult(validation);
}
exports.validateUserRole = validateUserRole;
