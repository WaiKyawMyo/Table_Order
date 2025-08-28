import { Response } from "express"
import jwt from "jsonwebtoken"
import { Types } from "mongoose"

export const generateToken =(res:Response,tableId:Types.ObjectId)=>{
    const token = jwt.sign({tableId},process.env.JWT_SECRET!,{
        expiresIn:"2h"
    })
    res.cookie("token",token,{
        httpOnly:true,
        secure : process.env.NODE_ENV ==="production",
        sameSite:"strict",
        maxAge: 2* 60 * 60 * 1000
    })
}