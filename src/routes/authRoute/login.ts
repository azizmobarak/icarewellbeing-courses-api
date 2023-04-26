import { login } from '../../controllers/auth/login'
import { Router } from 'express'
import { validateLogin } from '../../middlewares/authMiddleware/authValidation'
import express from 'express'
import { isAuth } from '../../middlewares/authMiddleware/middleware'
import { logout } from '../../controllers/auth/logout'

const AuthRouter: Router = express.Router()

AuthRouter.route('/auth').post(validateLogin, login)
AuthRouter.route('/logout').post(isAuth, logout)

module.exports = AuthRouter
