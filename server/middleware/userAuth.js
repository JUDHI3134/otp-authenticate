import jwt from "jsonwebtoken"

const userAuth = async (req,res,next)=>{
    

    try {

        const {token} = req.cookies

       if(!token){
        return res.json({success: false, message: "Not Authorize, Login Again"})
    }

       const tokenDecode = jwt.verify(token, process.env.JWT_SECRET) 

       if(tokenDecode.id){
        req.body.userId = tokenDecode.id
       }else{
        return res.json({success: false, message: "Not Authorize, Login Again"})
       }

       next();

    } catch (error) {
        return res.json({success: false, message: error.message}) 
    }
}

export default userAuth;