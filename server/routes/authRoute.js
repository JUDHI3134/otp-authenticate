import express from "express"
import { isAuthenticate, login, logout, register, resetPassword, sendResetOtp, sendVerifyOtp, verifyOtp } from "../controllers/authController.js"
import userAuth from "../middleware/userAuth.js"


const authRouter = express.Router()

authRouter.post("/register",register)
authRouter.post("/login",login)
authRouter.post("/logout",logout)
authRouter.post("/send-verify-otp",userAuth,sendVerifyOtp)
authRouter.post("/verify-account",userAuth,verifyOtp)
authRouter.get("/is-auth",userAuth,isAuthenticate)
authRouter.post("/send-reset-otp",sendResetOtp)
authRouter.post("/reset-password",resetPassword)


export default authRouter;