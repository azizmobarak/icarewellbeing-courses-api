import { Router } from 'express'

const express = require('express')
const router: Router = express.Router()
import addNewUser from '../../controllers/users/addNewUser'
import { validateUser } from '../../middlewares/userMiddlwares/validateUserRegister'

router.route('/register').post(validateUser, addNewUser)

module.exports = router
