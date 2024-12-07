import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs"
import transpoter from "../config/nodemailer.js";


export const register = async (req,res) =>{

    try {
        const {name, email, password} = req.body;
    
        if(!name || !email || !password){
            return res.json({success: false, message: "All fields are required"});
        }

        const existemail = await userModel.findOne({email})
        if (existemail) {
            return res.json({success: false, message: "Email Already Exist"})
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = new userModel({
            name,
            email,
            password: hashedPassword,
        })
        await user.save();

        const token = jwt.sign({id: user._id},process.env.JWT_SECRET,{expiresIn: '7d'})

        res.cookie("token",token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60*1000,
        })

        //sending welcome email

        const mailOptions = {
            from : process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to to jbcodes',
            text: `Welcome to jbcodes website. your account has been created with email id : ${email}`
        }

        await transpoter.sendMail(mailOptions)



        return res.json({success: true})

    
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }

}

export const login = async (req,res) =>{
    try {
        const {email, password} = req.body;

        if(!email || !password){
            return res.json({success: false, message: "All fields are required"})
        }

        const user = await userModel.findOne({email})
        if(!user){
            return res.json({success: false, message: "user does not exist"})
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            return res.json({success: false, message: "Password does not match"})
        }

        const token = jwt.sign({id: user._id},process.env.JWT_SECRET,{expiresIn: '7d'})

        res.cookie("token",token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60*1000,
        })

        return res.json({success: true})

    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

export const logout = async (req, res) =>{
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60*1000,
        }) 

        return res.json({success: true, message: "Logged out"})
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

//send verification otp to users email
export const sendVerifyOtp = async (req,res)=>{
    try {
        const {userId} = req.body;
        const user = await userModel.findById(userId)

        if(user.isAccountVerified){
            return res.json({success: false, message: "Account Already verified"})
        }

        const otp = String(Math.floor(100000+ Math.random()*900000))
        
        user.verifyOtp = otp;
        user.verifyOtpExpiryAt = Date.now()+ 24*60*60*1000
        await user.save();

        const mailOptions = {
            from : process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Account Verification Otp',
            text: `Yopr otp is ${otp}. Verify your account using this otp`
        }

        await transpoter.sendMail(mailOptions);

        res.json({success: true, message: "Verification OTP sent to your Email"})

    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

//verify using otp after otp receive
export const verifyOtp = async (req,res) =>{
    try {
        const {userId, otp} = req.body;
        if(!userId || !otp){
            return res.json({success: false, message: "Missing Details"})
        }

        const user = await userModel.findById(userId);

        if(!user){
            return res.json({success: false, message: "User not Found"}) 
        }

        if(user.verifyOtp === '' || user.verifyOtp !== otp){
            return res.json({success: false, message: "Invalid OTP"})
        }

        if(user.verifyOtpExpiryAt < Date.now()){
            return res.json({success: false, message: "OTP Expired"})
        }

        user.isAccountVerified = true;
        user.verifyOtp = ''
        user.verifyOtpExpiryAt = 0

        await user.save();
        return res.json({success: true, message: "Email verified successfully"})

    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

//check if user is Authenticate
export const isAuthenticate = (req,res) =>{
    try {
        return res.json({success: true})
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message}) 
    }
}

//send reset password OTP
export const sendResetOtp = async (req,res) =>{
    const {email} = req.body;
    if(!email){
        return res.json({success: false, message: "Email is required"}) 
    }

    try {
        const user = await userModel.findOne({email})
        if(!user){
            return res.json({success: false, message: "User not found"})
        }

        const otp = String(Math.floor(100000+ Math.random()*900000))
        
        user.resetOtp = otp;
        user.resetOtpExpiryAt = Date.now()+ 15*60*1000
        await user.save();

        const mailOptions = {
            from : process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Password Reset OTP',
            text: `Your OTP for Reseting your Password is ${otp}. use this OTP to proceed with resetting your password`
        }

        await transpoter.sendMail(mailOptions);

        return res.json({success: true, message: "OTP sent to your Email"})

    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message}) 
    }
}

//Reset user password
export const resetPassword = async (req, res) =>{
    const {email, otp, newPassword} = req.body;

    if(!email || !otp || !newPassword){
        return res.json({success: false, message: "Email, otp and new Password are required"});
    }

    try {
       const user = await userModel.findOne({email})
       if(!user){
        return res.json({success: false, message:"User not found"});
       } 

       if(user.resetOtp === '' ||user.resetOtp !== otp){
        return res.json({success: false, message:"Invalid Otp"})
       }

       if(user.resetOtpExpiryAt < Date.now()){
        return res.json({success: false, message:"OTP Expired"})
       }

       const hashedPassword = await bcrypt.hash(newPassword, 10);

       user.password = hashedPassword;
       user.resetOtp = ''
       user.resetOtpExpiryAt = 0

       await user.save();

       return res.json({success: true, message:"Password has been reset successfully"})

    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }

}