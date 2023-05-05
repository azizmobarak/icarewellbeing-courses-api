import { Router } from 'express'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const express = require('express')
const router: Router = express.Router()
import addNewUser from '../../controllers/users/Admin/addNewUser'
import {
    validateRequestRestPassword,
    validateResetPassword,
    validateUser,
} from '../../middlewares/userMiddlwares/validationMiddlwares'
import { resetPassword } from '../../controllers/users/user/resetPassword'
import { requestresetPassword } from '../../controllers/users/user/requestResetPassword'
import { changeUserStatus } from '../../controllers/users/Admin/changeUserActiveStatus'
import {
    isAuth,
    isSuperAdmin,
} from '../../middlewares/authMiddleware/middleware'
import { getUsers } from '../../controllers/users/Admin/getUsers'
import { updateUser } from '../../controllers/users/Admin/updateUser'
import { getUserData } from '../../controllers/users/Admin/getUserData'
import { restrictModule } from '../../controllers/users/Admin/restrictModule'
import { updateUserPassword } from '../../controllers/users/user/updateUsersPassword'

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
router.route('/user/restrict-module').put(isAuth, restrictModule)
router.route('/password/update').put(isAuth, updateUserPassword);

module.exports = router
