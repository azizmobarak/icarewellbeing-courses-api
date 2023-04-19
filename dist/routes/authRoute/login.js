"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var login_1 = require("../../controllers/auth/login");
var authValidation_1 = require("../../middlwares/authMiddlwares/authValidation");
var express = require('express');
var AuthRouter = express.Router();
AuthRouter.route('/auth').post(authValidation_1.validateLogin, login_1.login);
module.exports = AuthRouter;
