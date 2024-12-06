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

//verify otp
