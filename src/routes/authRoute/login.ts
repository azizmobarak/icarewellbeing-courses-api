import { login } from "../../controllers/auth/login";

import { Router } from "express";
import { validateLogin } from "../../middlwares/authMiddlwares/authValidation";

const express = require('express');
const AuthRouter: Router = express.Router();

AuthRouter.route('/auth').post(validateLogin,login);

module.exports = AuthRouter;