"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var router = express.Router();
var addNewUser_1 = __importDefault(require("../../controllers/users/addNewUser"));
var validateUserRegister_1 = require("../../middlwares/userMiddlwares/validateUserRegister");
router.route('/register').post(validateUserRegister_1.validateUser, addNewUser_1.default);
module.exports = router;
