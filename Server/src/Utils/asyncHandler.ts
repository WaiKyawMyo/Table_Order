import { NextFunction, Request, Response } from "express";
import { CheckCodeRequest } from "../middleware/chackCode";


export const asyncHandler=(controllerFn:(req:CheckCodeRequest,res:Response,next:NextFunction)=>Promise<void>)=>(req:Request,res:Response,next:NextFunction)=>{
    Promise.resolve(controllerFn(req,res,next)).catch(next)
}
