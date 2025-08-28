import express from "express"
import dotenv  from 'dotenv'
import { connectDB } from "./db"
import order from './router/Order'
import cors from "cors"
import cookieparser from "cookie-parser"
dotenv.config({
    path:".env"
})

const app =express()
const PORT = process.env.PORT || "4000"

app.use(express.json())
app.use(cors({
    origin:process.env.CLIENT_URL,
    credentials:true
}))
app.use(cookieparser())
app.use('/api',order)

app.listen(PORT,()=>{
    connectDB()
    console.log("Server is running on "+ PORT)
    
})