import { NextFunction,Request, Response } from "express";
import { UnauthorizedException } from "../exceptions/unauthroizedException";
import * as jwt from "jsonwebtoken"
import { JWT_SECRET } from "../secrets";
import { prismaClient } from "..";

export const authMiddleware = async (req: Request, res:Response, next: NextFunction)=>{
    console.log("auth middleware triggered");
    /// 1. Extract the token
    const token = req.headers.authorization;
    /// 2. Token not present throw unauthorized error
    if(!token){
        return next(new UnauthorizedException("Unauthorized!", null))
    }
    /// 3. verify token
    try{
        const payload = jwt.verify(token, JWT_SECRET) as any

        const user = await prismaClient.user.findFirst({where: {id: payload.userId}})
        if(!user){
            return next(new UnauthorizedException("Unauthorized!", null))
        } 
        //res.json(user)
        req.user = user;
        return next()
    }catch(er){
        return next(new UnauthorizedException("Unauthorized!", null))
    }
    
}