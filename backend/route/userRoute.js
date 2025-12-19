// route/userRoute.js
import express from 'express'
// ✅ Make sure to include the .js extension in ES Modules
import { loginUser, registerUser, adminLogin } from '../controller/userController.js'

const userRouter = express.Router()

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/admin', adminLogin)

export default userRouter
