import express from "express"
import cors from "cors"
import 'dotenv/config'
import cookieParser from "cookie-parser"
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoute.js";
import userRouter from "./routes/userRoute.js";

const app = express();
const port = process.env.PORT || 4000
connectDB();

const allowedOrigins = ["http://localhost:5173"]

app.use(cors({origin: allowedOrigins,credentials: true}))
app.use(express.json())
app.use(cookieParser())

app.get("/",(req,res)=>{
    res.send("Api Working")
})

app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)

app.listen(port,()=> console.log(`server run port ${port}`))
