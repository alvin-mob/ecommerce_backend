import { NextFunction, RequestHandler, Request, Response } from "express"
import { HttpException } from "./exceptions/root"
import { InternalException } from "./exceptions/internalException"
import { UnprocessabilityException } from "./exceptions/validations"

export const errorHandler = (method: Function)=> {
    return async(req:Request, res:Response, next:NextFunction)=>{
        try{
            await method(req, res, next)
        }catch(err : any){
            let exception : HttpException;
            if(err instanceof HttpException){
                exception = err;
            }else if(err instanceof UnprocessabilityException){
                exception = new UnprocessabilityException(err.message, err.errors);
            }else{
                exception = new InternalException("Something went wrong!", err)
            }
            next(exception)
        }
    }
}