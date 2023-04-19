"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUserEmailAndAddUser = exports.authorizeUser = exports.checkUserExistAndAuth = exports.verifyUserAuth = void 0;
var users_1 = require("../../models/users");
var password_1 = require("../password");
var resultStatus_1 = require("../../utils/resultStatus");
var createToken_1 = require("../createToken");
var parseToken_1 = require("../parseToken");
var ObjectId = require('mongodb').ObjectId;
var sanitize = require("mongo-sanitize");
var bcrypt = require('bcrypt');
var saltRounds = 10;
function verifyUserAuth(token, res, next) {
    var userModel = new users_1.UserModel();
    var data = (0, parseToken_1.decodToken)(token, res).data;
    var id = new ObjectId(data.split(',')[0]);
    userModel.collection.findOne(sanitize({ _id: id }))
        .then(function (doc) {
        if (!doc) {
            return (0, resultStatus_1.createResponse)(403, "Not Authorized", res);
        }
        next();
    })
        .catch(function () {
        return (0, resultStatus_1.createResponse)(403, "oops something happen Sorry, back again later", res);
    });
}
exports.verifyUserAuth = verifyUserAuth;
function checkUserExistAndAuth(res, data) {
    var userModel = new users_1.UserModel();
    userModel.collection.findOne(sanitize({ email: data.email }))
        .then(function (doc) {
        if (!doc) {
            return (0, resultStatus_1.createResponse)(203, "Sorry , Email or password is not correct", res);
        }
        else {
            (0, password_1.checkPassword)(doc, data.password, res);
        }
    }).catch(function () {
        return (0, resultStatus_1.createResponse)(203, "oops something happen Sorry, back again later", res);
    });
}
exports.checkUserExistAndAuth = checkUserExistAndAuth;
function authorizeUser(id, role, data, res) {
    var token = (0, createToken_1.signUserAuth)(id, role);
    res.cookie("access_token", token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
    })
        .send({
        data: {
            id: id,
            email: data.email,
            username: data.username,
            role: data.role,
        },
        status: 200,
    });
}
exports.authorizeUser = authorizeUser;
function checkUserEmailAndAddUser(res, data) {
    var _this = this;
    var userModel = new users_1.UserModel();
    userModel.collection.findOne(sanitize({ email: data.email }))
        .then(function (doc) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!!doc) return [3 /*break*/, 2];
                    return [4 /*yield*/, AddNewUser(data.password, res, data)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    (0, resultStatus_1.createResponse)(208, "email ".concat(data.email, " already exist"), res);
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    }); }).catch(function (_err) {
        (0, resultStatus_1.createResponse)(403, "oops something happen Sorry, back again later", res);
    });
}
exports.checkUserEmailAndAddUser = checkUserEmailAndAddUser;
function AddNewUser(password, res, data) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, bcrypt.genSalt(saltRounds, function (err, salt) {
                        return __awaiter(this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (err)
                                            return [2 /*return*/, null];
                                        return [4 /*yield*/, bcrypt.hash(password, salt, function (err, hash) {
                                                if (err)
                                                    return null;
                                                return addUser(hash, res, data);
                                            })];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            });
                        });
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function addUser(hash, res, data) {
    var userModel = new users_1.UserModel();
    userModel.collection.insertOne(sanitize(__assign(__assign({}, data), { password: hash })))
        .then(function (doc) {
        (0, resultStatus_1.createResponse)(200, __assign({ email: data.email, role: data.role, username: data.username }, doc), res);
    })
        .catch(function (error) {
        (0, resultStatus_1.createResponse)(400, error, res);
    });
}
