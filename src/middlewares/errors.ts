import { NextFunction, Request, Response } from "express";
import {HttpException} from "../exceptions/root";


export const errorMiddleware = (err: HttpException, req: Request, res: Response, next:NextFunction)=>{
    console.log("error middleware is invoked")
    res.status(err.statusCode).json({
        message : err.message,
        errorCode : err.errorCode,
        errors : err.errors
    })
}