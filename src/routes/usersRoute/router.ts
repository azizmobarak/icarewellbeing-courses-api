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
import { deleteUser } from '../../controllers/users/deleteUser'
import {
    isAuth,
    isSuperAdmin,
} from '../../middlewares/authMiddleware/middleware'
import { getUsers } from '../../controllers/users/getUsers'
import { updateUser } from '../../controllers/users/updateUser'

router.route('/register').post(validateUser, addNewUser)
// Put accepts password and token
router.route('/password/reset').put(validateResetPassword, resetPassword)
router
    .route('/password/request')
    .post(validateRequestRestPassword, requestresetPassword)
router.route('/user/delete').delete(isAuth, isSuperAdmin, deleteUser)
router.route('/users/list').get(isAuth,getUsers)
router.route('users/update').put(isAuth,updateUser);

module.exports = router
