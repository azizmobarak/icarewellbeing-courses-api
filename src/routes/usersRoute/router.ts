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
import { changeUserStatus } from '../../controllers/users/changeUserActiveStatus'
import {
    isAuth,
    isSuperAdmin,
} from '../../middlewares/authMiddleware/middleware'
import { getUsers } from '../../controllers/users/getUsers'
import { updateUser } from '../../controllers/users/updateUser'
import { getUserData } from '../../controllers/users/getUserData'

router.route('/register').post(validateUser, addNewUser)
// Put accepts password and token
router.route('/password/reset').put(validateResetPassword, resetPassword)
router
    .route('/password/request')
    .post(validateRequestRestPassword, requestresetPassword)
router.route('/user/status').put(isAuth, isSuperAdmin, changeUserStatus)
router.route('/users/list/:page').get(isAuth, getUsers)
router.route('/users/update').put(isAuth, updateUser)
router.route('/user/:id').get(isAuth, getUserData)

module.exports = router
