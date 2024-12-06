import express from "express"
import cors from "cors"
import 'dotenv/config'
import cookieParser from "cookie-parser"
import connectDB from "./config/mongodb.js";

const app = express();
const port = process.env.PORT || 4000
connectDB();

app.use(cors({credentials: true}))
app.use(express.json())
app.use(cookieParser())

app.get("/",(req,res)=>{
    res.send("Api Working")
})

app.listen(port,()=> console.log(`server run port ${port}`))
