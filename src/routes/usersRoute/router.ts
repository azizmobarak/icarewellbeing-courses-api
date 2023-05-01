import { Router } from 'express'

const express = require('express')
const router: Router = express.Router()
import addNewUser from '../../controllers/users/addNewUser'
import {
    validateRequestRestPassword,
    validateResetPassword,
    validateUser,
} from '../../middlewares/userMiddlwares/validationMiddlwares'
import { resetPassword } from '../../controllers/users/resetPassword'
import { requestresetPassword } from '../../controllers/users/requestResetPassword'

router.route('/register').post(validateUser, addNewUser)
// Put accepts password and token
router.route('/password/reset').put(validateResetPassword, resetPassword)
router
    .route('/password/request')
    .post(validateRequestRestPassword, requestresetPassword)

module.exports = router
