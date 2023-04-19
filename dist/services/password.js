"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPassword = exports.encryptPassword = void 0;
var resultStatus_1 = require("../utils/resultStatus");
var userConnection_1 = require("./user/userConnection");
var bcrypt = require('bcrypt');
var saltRounds = 22;
var encryptPassword = function (password) {
    return bcrypt.genSalt(saltRounds, function (err, salt) {
        if (err)
            return null;
        return bcrypt.hash(password, salt, function (err, hash) {
            if (err)
                return err;
            return hash;
        });
    });
};
exports.encryptPassword = encryptPassword;
var checkPassword = function (doc, password, res) {
    return bcrypt.compare(password, doc.password, function (err, result) {
        if (err || !result) {
            return (0, resultStatus_1.createResponse)(203, "Sorry , Email or password is not correct", res);
        }
        else {
            return (0, userConnection_1.authorizeUser)(doc._id, doc.role, doc, res);
        }
    });
};
exports.checkPassword = checkPassword;
