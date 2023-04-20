import { login } from '../../controllers/auth/login'
import { Router } from 'express'
import { validateLogin } from '../../middlewares/authMiddleware/authValidation'

import express from 'express'
const AuthRouter: Router = express.Router()

AuthRouter.route('/auth').post(validateLogin, login)

module.exports = AuthRouter
