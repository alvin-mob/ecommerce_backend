import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../exceptions/unauthroizedException";

const adminMiddleware = (req: Request, res: Response, next: NextFunction) =>{
    const user = req.user;
    if(user?.role == "ADMIN"){
        next();
    }else{
        next(new UnauthorizedException('Unauthorized', null));
    }
} 

export default adminMiddleware;