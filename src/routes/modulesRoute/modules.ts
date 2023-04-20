import { Router } from 'express'
import { isAuth } from '../../middlewares/authMiddleware/middleware'
import { getModules } from '../../controllers/module/getModules'

import express from 'express'
const ModuleRouter: Router = express.Router()

ModuleRouter.route('/modules').get(isAuth, getModules)

module.exports = ModuleRouter
