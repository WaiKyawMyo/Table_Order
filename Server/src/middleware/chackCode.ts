import { NextFunction, Request, Response } from "express";
import { Table } from "../Models/table";
import { asyncHandler } from "../Utils/asyncHandler";
import jwt, { JwtPayload } from "jsonwebtoken"

// Define interface for request body
export interface CheckCodeRequest extends Request {

  table?: any; // or your specific Table type
}

const checkCode = async (req: CheckCodeRequest, res: Response, next: NextFunction) => {
    let token = req.cookies.token
    if (!token) {
        return res.status(400).json({ 
            success: false, 
            message: "user is not authorized" 
        });
    }
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET!)as JwtPayload
        if(!decoded){
            res.status(401).json({message:"user is not authorized"})
        }
        
        req.table =await Table.findById(decoded.tableId)
        next()
    } catch (error) {
        res.status(401).json({message:"user is not authorized"})
    }
    

    
};

export default checkCode;